from sqlalchemy import text
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
import uuid


def decode_uuid(val) -> str:
    if val is None:
        return ""
    if isinstance(val, bytes):
        if len(val) == 16:
            return str(uuid.UUID(bytes=val))
        try:
            return val.decode("utf-8")
        except:
            pass
    return str(val)


def _row_to_movie(row) -> Dict[str, Any]:
    return {
        "id": decode_uuid(row[0]),
        "title": row[1] or "",
        "slug": row[2] or "",
        "poster_url": row[3] or "",
        "rating": float(row[4]) if row[4] is not None else 0.0,
        "year": int(row[5]) if row[5] is not None else 0,
        "original_title": row[6] or "",
        "description": row[7] or "",
        "director": row[8] or "",
        "language": row[9] or "",
        "duration": row[10] or "",
        "views": int(row[11]) if row[11] is not None else 0,
        "type": row[12] or "",
        "genres": [],  # will be populated later
    }


class RetrievalService:
    # Base SELECT columns
    BASE_SELECT = """
        SELECT id, title, slug, poster_url, rating, year, original_title,
               description, director, display_language, duration, views, type
        FROM movies
        WHERE status = 'PUBLISHED'
    """

    @staticmethod
    def retrieve(
        db: Session,
        normalized_query: str,
        intent: dict,
        top_k: int = 30,
    ) -> List[Dict[str, Any]]:
        """
        Multi-strategy retrieval:
        1. Genre-based search (if genre detected from intent)
        2. Full-text search on title, original_title, description, director
        3. Fallback: top-rated/most-viewed if nothing found
        """
        movies_map: Dict[str, Dict] = {}  # dedup by id

        genres = intent.get("genres", [])
        mood_genres = intent.get("mood_genres", [])
        film_type = intent.get("film_type")
        search_terms = intent.get("search_terms", [])

        all_genres = list(dict.fromkeys(genres + mood_genres))  # preserve order, deduplicate

        is_binary = False  # we'll detect from first result

        def _execute(sql_str: str, params: dict) -> list:
            nonlocal is_binary
            result = db.execute(text(sql_str), params)
            rows = []
            for row in result:
                if row[0] is not None and not is_binary:
                    is_binary = isinstance(row[0], bytes)
                rows.append(row)
            return rows

        def _add_rows(rows, source_weight: float = 1.0):
            for row in rows:
                m = _row_to_movie(row)
                mid = m["id"]
                if mid and mid not in movies_map:
                    m["_source_weight"] = source_weight
                    movies_map[mid] = m

        # ── Strategy 1: Genre-based search ──────────────────────────────
        if all_genres:
            for genre in all_genres[:3]:  # limit to top 3 genres
                type_clause = "AND LOWER(m.type) = :film_type" if film_type else ""
                # Use subquery to avoid DISTINCT + ORDER BY popularity conflict
                sql = f"""
                    SELECT id, title, slug, poster_url, rating, year,
                           original_title, description, director, display_language,
                           duration, views, type
                    FROM (
                        SELECT DISTINCT m.id, m.title, m.slug, m.poster_url, m.rating, m.year,
                               m.original_title, m.description, m.director, m.display_language,
                               m.duration, m.views, m.type, m.popularity
                        FROM movies m
                        JOIN movie_genres g ON m.id = g.movie_id
                        WHERE m.status = 'PUBLISHED'
                          AND LOWER(g.genre) = LOWER(:genre)
                          {type_clause}
                    ) sub
                    ORDER BY rating DESC, popularity DESC
                    LIMIT :lim
                """
                params = {"genre": genre, "lim": top_k}
                if film_type:
                    params["film_type"] = film_type.lower()
                rows = _execute(sql, params)
                _add_rows(rows, source_weight=2.0)

        # ── Strategy 2: Full-text title/original_title search ────────────
        if normalized_query.strip():
            like_pattern = f"%{normalized_query}%"
            type_clause = "AND LOWER(type) = :film_type" if film_type else ""
            sql = f"""
                SELECT id, title, slug, poster_url, rating, year, original_title,
                       description, director, display_language, duration, views, type
                FROM movies
                WHERE status = 'PUBLISHED'
                  AND (LOWER(title) LIKE :pat OR LOWER(original_title) LIKE :pat)
                  {type_clause}
                ORDER BY rating DESC
                LIMIT :lim
            """
            params = {"pat": like_pattern, "lim": top_k}
            if film_type:
                params["film_type"] = film_type.lower()
            rows = _execute(sql, params)
            _add_rows(rows, source_weight=3.0)  # title match highest priority

        # ── Strategy 3: Description / keyword-based search ───────────────
        if search_terms and len(movies_map) < top_k:
            # Search top 3 meaningful terms
            for term in search_terms[:3]:
                if len(term) < 3:
                    continue
                like_pattern = f"%{term}%"
                sql = """
                    SELECT id, title, slug, poster_url, rating, year, original_title,
                           description, director, display_language, duration, views, type
                    FROM movies
                    WHERE status = 'PUBLISHED'
                      AND (LOWER(description) LIKE :pat OR LOWER(director) LIKE :pat
                           OR LOWER(title) LIKE :pat OR LOWER(original_title) LIKE :pat)
                    ORDER BY rating DESC
                    LIMIT :lim
                """
                rows = _execute(sql, {"pat": like_pattern, "lim": 15})
                _add_rows(rows, source_weight=1.5)

        # ── Keyword table search ─────────────────────────────────────────
        if search_terms and len(movies_map) < top_k:
            for term in search_terms[:3]:
                if len(term) < 3:
                    continue
                like_pattern = f"%{term}%"
                sql = """
                    SELECT DISTINCT m.id, m.title, m.slug, m.poster_url, m.rating, m.year,
                           m.original_title, m.description, m.director, m.display_language,
                           m.duration, m.views, m.type
                    FROM movies m
                    JOIN movie_keywords k ON m.id = k.movie_id
                    WHERE m.status = 'PUBLISHED'
                      AND LOWER(k.keyword) LIKE :pat
                    ORDER BY m.rating DESC
                    LIMIT :lim
                """
                rows = _execute(sql, {"pat": like_pattern, "lim": 10})
                _add_rows(rows, source_weight=1.2)

        # ── Fallback: top-rated if nothing found ─────────────────────────
        if not movies_map:
            type_clause = "AND LOWER(type) = :film_type" if film_type else ""
            sql = f"""
                SELECT id, title, slug, poster_url, rating, year, original_title,
                       description, director, display_language, duration, views, type
                FROM movies
                WHERE status = 'PUBLISHED'
                  {type_clause}
                ORDER BY rating DESC, popularity DESC, views DESC
                LIMIT :lim
            """
            params = {"lim": top_k}
            if film_type:
                params["film_type"] = film_type.lower()
            rows = _execute(sql, params)
            _add_rows(rows, source_weight=0.5)

        movies = list(movies_map.values())

        # ── Fetch genres for all retrieved movies ────────────────────────
        if movies:
            movie_ids = [m["id"] for m in movies]
            genres_sql = text("""
                SELECT movie_id, genre
                FROM movie_genres
                WHERE movie_id IN :movie_ids
            """)
            try:
                if is_binary:
                    bin_ids = tuple(uuid.UUID(mid).bytes for mid in movie_ids if mid)
                    if bin_ids:
                        genres_result = db.execute(genres_sql, {"movie_ids": bin_ids})
                    else:
                        genres_result = []
                else:
                    genres_result = db.execute(genres_sql, {"movie_ids": tuple(movie_ids)})

                genres_map: Dict[str, List[str]] = {}
                for row in genres_result:
                    mid = decode_uuid(row[0])
                    g = row[1]
                    if mid not in genres_map:
                        genres_map[mid] = []
                    genres_map[mid].append(g)

                for m in movies:
                    m["genres"] = genres_map.get(m["id"], [])
            except Exception as e:
                print(f"[retrieval] genre fetch error: {e}")
                for m in movies:
                    m["genres"] = []

        return movies
