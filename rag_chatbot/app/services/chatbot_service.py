"""
Chatbot service — orchestrates retrieval + generation
"""
import logging
import time
import uuid
from typing import Any, Dict, List, Optional

from app.core.config import get_settings
from app.services import retrieval_service
from app.utils.text_normalizer import normalize_query

logger = logging.getLogger("chillfilm.rag.chatbot")


def _extract_intent(message: str) -> Dict[str, Any]:
    """
    Trích xuất intent từ message người dùng.
    Detect: genres, film_type, search_terms.
    """
    msg_lower = message.lower()

    # Genre keywords
    genre_map = {
        "hành động": "Action",
        "hanh dong": "Action",
        "action": "Action",
        "tình cảm": "Romance",
        "tinh cam": "Romance",
        "romance": "Romance",
        "hài": "Comedy",
        "hai huoc": "Comedy",
        "comedy": "Comedy",
        "kinh dị": "Horror",
        "kinh di": "Horror",
        "horror": "Horror",
        "hoạt hình": "Animation",
        "hoat hinh": "Animation",
        "animation": "Animation",
        "tài liệu": "Documentary",
        "tai lieu": "Documentary",
        "documentary": "Documentary",
        "khoa học viễn tưởng": "Sci-Fi",
        "khoa hoc vien tuong": "Sci-Fi",
        "sci-fi": "Sci-Fi",
        "viễn tưởng": "Sci-Fi",
        "vien tuong": "Sci-Fi",
        "drama": "Drama",
        "tâm lý": "Drama",
        "tam ly": "Drama",
        "phiêu lưu": "Adventure",
        "phieu luu": "Adventure",
        "adventure": "Adventure",
        "gia đình": "Family",
        "gia dinh": "Family",
        "family": "Family",
        "lịch sử": "History",
        "lich su": "History",
        "history": "History",
        "trinh thám": "Mystery",
        "trinh tham": "Mystery",
        "mystery": "Mystery",
        "thriller": "Thriller",
        "tội phạm": "Crime",
        "toi pham": "Crime",
        "crime": "Crime",
    }

    # Mood → genre mapping
    mood_map = {
        "vui": ["Comedy"],
        "buon": ["Drama"],
        "buồn": ["Drama"],
        "sợ": ["Horror"],
        "so": ["Horror"],
        "romantic": ["Romance"],
        "hồi hộp": ["Thriller", "Action"],
        "hoi hop": ["Thriller", "Action"],
    }

    detected_genres = []
    detected_mood_genres = []

    for kw, genre in genre_map.items():
        if kw in msg_lower and genre not in detected_genres:
            detected_genres.append(genre)

    for kw, genres in mood_map.items():
        if kw in msg_lower:
            for g in genres:
                if g not in detected_mood_genres:
                    detected_mood_genres.append(g)

    # Film type
    film_type = None
    if any(kw in msg_lower for kw in ["phim lẻ", "phim le", "single", "movie"]):
        film_type = "single"
    elif any(kw in msg_lower for kw in ["phim bộ", "phim bo", "series", "tập"]):
        film_type = "series"

    return {
        "genres": detected_genres,
        "mood_genres": detected_mood_genres,
        "film_type": film_type,
    }


def _generate_answer(
    query: str,
    movies: List[Dict[str, Any]],
    intent: Dict[str, Any],
) -> str:
    """
    Sinh câu trả lời. Thử Gemini nếu có API key, fallback về template.
    """
    settings = get_settings()

    if not settings.retrieval_only_mode and settings.GEMINI_API_KEY:
        try:
            from google import genai

            client = genai.Client(api_key=settings.GEMINI_API_KEY)

            movies_context = ""
            for idx, m in enumerate(movies[:10], 1):
                genres_str = ", ".join(m.get("genres", [])) or "Chưa phân loại"
                movies_context += (
                    f"{idx}. **{m.get('title')}** ({m.get('year')})\n"
                    f"   Thể loại: {genres_str} | Điểm: {m.get('rating', 0):.1f}\n"
                    f"   Mô tả: {(m.get('description') or '')[:150]}...\n\n"
                )

            genres_detected = intent.get("genres", []) + intent.get("mood_genres", [])
            intent_note = ""
            if genres_detected:
                intent_note = f"Người dùng muốn thể loại: {', '.join(genres_detected)}. "

            prompt = f"""Yêu cầu: "{query}"
{intent_note}

Gợi ý từ ChillFilm:
{movies_context if movies else "Không tìm thấy phim phù hợp."}

Viết phản hồi thân thiện, ngắn gọn (2-4 câu) bằng tiếng Việt như người bạn yêu phim đang tư vấn."""

            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config={
                    "system_instruction": (
                        "Bạn là ChillFilm AI, trợ lý xem phim thân thiện. "
                        "Gợi ý phim nhiệt tình và ngắn gọn."
                    ),
                    "temperature": 0.7,
                },
            )
            if response and response.text:
                return response.text.strip()
        except Exception as e:
            logger.warning("Gemini generation failed: %s", e)

    # Template fallback
    return _template_answer(query, movies, intent)


def _template_answer(
    query: str,
    movies: List[Dict[str, Any]],
    intent: Dict[str, Any],
) -> str:
    if not movies:
        genres = intent.get("genres", [])
        if genres:
            return (
                f"Xin lỗi, chưa tìm thấy phim thể loại {', '.join(genres)} phù hợp. "
                f"Bạn thử tìm thể loại khác nhé! 🎬"
            )
        return (
            f"Xin lỗi, không tìm thấy phim nào phù hợp với '{query}'. "
            f"Hãy thử mô tả thể loại hoặc tên phim bạn muốn! 🎬"
        )

    titles = " và ".join([f'**"{m.get("title")}"**' for m in movies[:3]])
    genres = intent.get("genres", []) + intent.get("mood_genres", [])

    if genres:
        answer = f"Với thể loại {', '.join(genres[:2])}, mình gợi ý {titles}"
    else:
        answer = f"Dựa trên yêu cầu, mình tìm được {titles}"

    if len(movies) > 3:
        answer += f" cùng {len(movies) - 3} bộ phim hay khác"

    answer += ". Hy vọng bạn tìm được phim ưng ý! 🍿"
    return answer


# ── Public interface ──────────────────────────────────────────────────────

def chat(
    message: str,
    session_id: Optional[str] = None,
) -> Dict[str, Any]:
    """Main chat function — orchestrates retrieval + generation."""
    start = time.time()
    settings = get_settings()

    if settings.retrieval_only_mode:
        logger.info("Running in retrieval-only mode (no LLM configured)")

    normalized_query = normalize_query(message)
    intent = _extract_intent(message)

    genres = intent.get("genres", []) + intent.get("mood_genres", [])
    film_type = intent.get("film_type")

    # Retrieve
    movies = retrieval_service.retrieve(
        query=normalized_query,
        top_k=settings.DEFAULT_TOP_K,
        genres=genres if genres else None,
        film_type=film_type,
    )

    # Generate answer
    answer = _generate_answer(normalized_query, movies, intent)

    elapsed_ms = (time.time() - start) * 1000
    logger.info("Chat completed in %.1fms, %d movies found", elapsed_ms, len(movies))

    return {
        "answer": answer,
        "movies": movies,
        "session_id": session_id or str(uuid.uuid4()),
        "normalized_query": normalized_query,
        "processing_time_ms": elapsed_ms,
    }
