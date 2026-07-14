"""
Retrieval service — tích hợp Qdrant vector search + MySQL fallback
"""
import logging
import time
import uuid
from typing import Any, Dict, List, Optional

from app.core.config import get_settings
from app.repositories import qdrant_repository
from app.services import embedding_service
from app.utils.text_normalizer import normalize_query, normalize_for_search

logger = logging.getLogger("chillfilm.rag.retrieval")


# ── MySQL fallback (SQLAlchemy) ───────────────────────────────────────────

def _get_db_engine():
    """Lazy-init SQLAlchemy engine cho MySQL fallback."""
    try:
        from sqlalchemy import create_engine
        settings = get_settings()
        engine = create_engine(
            settings.database_url,
            pool_pre_ping=True,
            pool_recycle=3600,
            pool_size=3,
            max_overflow=2,
        )
        return engine
    except Exception as e:
        logger.warning("Cannot create DB engine: %s", e)
        return None


_db_engine = None


def _get_engine():
    global _db_engine
    if _db_engine is None:
        _db_engine = _get_db_engine()
    return _db_engine


def _decode_uuid(val) -> str:
    if val is None:
        return ""
    if isinstance(val, bytes):
        if len(val) == 16:
            return str(uuid.UUID(bytes=val))
        try:
            return val.decode("utf-8")
        except Exception:
            pass
    return str(val)


def _mysql_search(
    normalized_query: str,
    genres: Optional[List[str]] = None,
    film_type: Optional[str] = None,
    top_k: int = 20,
) -> List[Dict[str, Any]]:
    """Fallback: tìm kiếm MySQL bằng LIKE query."""
    engine = _get_engine()
    if engine is None:
        return []

    start = time.time()
    try:
        from sqlalchemy import text
        with engine.connect() as conn:
            results = {}

            # Strategy 1: Genre filter
            if genres:
                for genre in genres[:3]:
                    type_clause = "AND LOWER(m.type) = :film_type" if film_type else ""
                    sql = f"""
                        SELECT m.id, m.title, m.slug, m.poster_url, m.rating, m.release_year AS year,
                               m.original_title, m.description, m.director, m.display_language,
                               m.duration, m.views, m.type
                        FROM movies m
                        JOIN movie_genres g ON m.id = g.movie_id
                        WHERE m.status = 'PUBLISHED'
                          AND LOWER(g.genre) = LOWER(:genre)
                          {type_clause}
                        ORDER BY m.rating DESC
                        LIMIT :lim
                    """
                    params = {"genre": genre, "lim": top_k}
                    if film_type:
                        params["film_type"] = film_type.lower()
                    for row in conn.execute(text(sql), params):
                        mid = _decode_uuid(row[0])
                        if mid and mid not in results:
                            results[mid] = _row_to_movie(row)

            # Strategy 2: Title search
            if normalized_query.strip():
                like_pat = f"%{normalized_query}%"
                sql = """
                    SELECT id, title, slug, poster_url, rating, release_year AS year, original_title,
                           description, director, display_language, duration, views, type
                    FROM movies
                    WHERE status = 'PUBLISHED'
                      AND (LOWER(title) LIKE :pat OR LOWER(original_title) LIKE :pat)
                    ORDER BY rating DESC
                    LIMIT :lim
                """
                for row in conn.execute(text(sql), {"pat": like_pat, "lim": top_k}):
                    mid = _decode_uuid(row[0])
                    if mid and mid not in results:
                        results[mid] = _row_to_movie(row)

            # Fallback: top rated
            if not results:
                sql = """
                    SELECT id, title, slug, poster_url, rating, release_year AS year, original_title,
                           description, director, display_language, duration, views, type
                    FROM movies WHERE status = 'PUBLISHED'
                    ORDER BY rating DESC LIMIT :lim
                """
                for row in conn.execute(text(sql), {"lim": top_k}):
                    mid = _decode_uuid(row[0])
                    if mid:
                        results[mid] = _row_to_movie(row)

            movies = list(results.values())

            # Fetch genres
            if movies:
                movie_ids = tuple(m["id"] for m in movies if m["id"])
                if movie_ids:
                    genre_rows = conn.execute(
                        text("SELECT movie_id, genre FROM movie_genres WHERE movie_id IN :ids"),
                        {"ids": movie_ids},
                    )
                    genres_map: Dict[str, List[str]] = {}
                    for gr in genre_rows:
                        mid = _decode_uuid(gr[0])
                        if mid not in genres_map:
                            genres_map[mid] = []
                        genres_map[mid].append(gr[1])
                    for m in movies:
                        m["genres"] = genres_map.get(m["id"], [])

            elapsed_ms = (time.time() - start) * 1000
            logger.info("MySQL retrieval: %d results in %.1fms", len(movies), elapsed_ms)
            return movies[:top_k]

    except Exception as e:
        logger.error("MySQL retrieval error: %s", e)
        return []


def _row_to_movie(row) -> Dict[str, Any]:
    return {
        "id": _decode_uuid(row[0]),
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
        "genres": [],
        "_score": 0.5,
    }


# ── Qdrant vector search ──────────────────────────────────────────────────

def _qdrant_search(
    query: str,
    top_k: int = 10,
    genre: Optional[str] = None,
    year: Optional[int] = None,
    movie_type: Optional[str] = None,
) -> List[Dict[str, Any]]:
    """Vector search trong Qdrant."""
    if not qdrant_repository.is_qdrant_available():
        return []
    if not embedding_service.is_model_loaded():
        return []

    settings = get_settings()
    start = time.time()

    # Normalize for search
    search_text = normalize_for_search(query)
    vector = embedding_service.encode_query(search_text)
    if vector is None:
        return []

    # Build filter
    payload_filter = qdrant_repository.build_filter(
        genre=genre,
        year=year,
        movie_type=movie_type,
    )

    results = qdrant_repository.search_vectors(
        collection_name=settings.QDRANT_COLLECTION,
        query_vector=vector,
        top_k=top_k,
        payload_filter=payload_filter,
    )

    elapsed_ms = (time.time() - start) * 1000
    logger.info("Qdrant search: %d results in %.1fms", len(results), elapsed_ms)
    return results


# ── Public retrieval interface ────────────────────────────────────────────

def retrieve(
    query: str,
    top_k: int = 10,
    genres: Optional[List[str]] = None,
    year: Optional[int] = None,
    film_type: Optional[str] = None,
) -> List[Dict[str, Any]]:
    """
    Hybrid retrieval:
    1. Nếu Qdrant và embedding model có sẵn → vector search
    2. Fallback → MySQL LIKE search
    """
    settings = get_settings()
    top_k = min(top_k, settings.MAX_TOP_K)
    normalized = normalize_query(query)

    # Try Qdrant first
    if qdrant_repository.is_qdrant_available() and embedding_service.is_model_loaded():
        genre_filter = genres[0] if genres else None
        qdrant_results = _qdrant_search(
            query=normalized,
            top_k=top_k,
            genre=genre_filter,
            year=year,
            movie_type=film_type,
        )
        if qdrant_results:
            logger.info("Using Qdrant vector search results")
            return qdrant_results

    # Fallback: MySQL
    logger.info("Using MySQL fallback retrieval")
    return _mysql_search(
        normalized_query=normalized,
        genres=genres,
        film_type=film_type,
        top_k=top_k,
    )
