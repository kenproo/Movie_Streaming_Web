from typing import List, Dict, Any


class RerankService:
    @staticmethod
    def rerank(
        candidates: List[Dict[str, Any]],
        query: str,
        intent: dict,
    ) -> List[Dict[str, Any]]:
        if not candidates:
            return []

        query_lower = query.lower()
        query_words = set(query_lower.split())

        target_genres = set(g.lower() for g in (intent.get("genres", []) + intent.get("mood_genres", [])))
        film_type = intent.get("film_type", "")
        search_terms = [t.lower() for t in intent.get("search_terms", [])]

        scored = []
        for movie in candidates:
            title = (movie.get("title") or "").lower()
            original_title = (movie.get("original_title") or "").lower()
            description = (movie.get("description") or "").lower()
            director = (movie.get("director") or "").lower()
            movie_genres = [g.lower() for g in movie.get("genres", [])]
            rating = movie.get("rating", 0.0) or 0.0
            views = movie.get("views", 0) or 0
            movie_type = (movie.get("type") or "").lower()
            source_weight = movie.get("_source_weight", 1.0)

            score = 0.0

            # ── 1. Title exact / substring match (highest value) ─────────────
            if query_lower and (query_lower in title or query_lower in original_title):
                score += 20.0
            else:
                # word-level overlap with title
                title_words = set((title + " " + original_title).split())
                overlap = len(query_words & title_words)
                score += overlap * 3.0

            # ── 2. Genre match (very important) ──────────────────────────────
            if target_genres:
                matched_genres = target_genres & set(movie_genres)
                score += len(matched_genres) * 8.0
            
            # ── 3. Film type match ────────────────────────────────────────────
            if film_type and movie_type == film_type.lower():
                score += 4.0

            # ── 4. Description & director term overlap ────────────────────────
            for term in search_terms:
                if term in description:
                    score += 1.5
                if term in director:
                    score += 2.0
                if term in title or term in original_title:
                    score += 3.0

            # ── 5. Source weight (how reliable the retrieval strategy was) ─────
            score *= source_weight

            # ── 6. Quality boost: rating (max +5) and views (max +3) ─────────
            score += (rating / 10.0) * 5.0
            # log-scale views boost  (views up to 10M → +3)
            if views > 0:
                import math
                score += min(math.log10(views + 1) / 7.0 * 3.0, 3.0)

            movie_copy = movie.copy()
            movie_copy["score"] = round(score, 4)
            scored.append(movie_copy)

        # Sort by score descending
        scored.sort(key=lambda x: x["score"], reverse=True)

        # Return top 5
        return scored[:5]

    @staticmethod
    def build_reason(movie: Dict[str, Any], intent: dict) -> str:
        """Build a human-readable reason string for a recommendation."""
        genres = movie.get("genres", [])
        rating = movie.get("rating", 0.0) or 0.0
        director = movie.get("director", "")
        year = movie.get("year", 0)
        target_genres = intent.get("genres", []) + intent.get("mood_genres", [])

        parts = []

        # Genre matching reason
        matched = [g for g in genres if g.lower() in [tg.lower() for tg in target_genres]]
        if matched:
            parts.append(f"Thể loại {', '.join(matched[:2])}")

        # Rating
        if rating >= 8.0:
            parts.append(f"đánh giá xuất sắc {rating:.1f}/10")
        elif rating >= 7.0:
            parts.append(f"đánh giá tốt {rating:.1f}/10")

        # Director
        if director:
            parts.append(f"đạo diễn {director}")

        # Year
        if year:
            parts.append(f"năm {year}")

        if parts:
            return " · ".join(parts)
        return "Phim chất lượng cao được đề xuất cho bạn"
