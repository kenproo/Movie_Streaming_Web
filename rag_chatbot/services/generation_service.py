import os
from typing import List, Dict, Any
from config import settings


class GenerationService:
    @staticmethod
    def generate_answer(query: str, movies: List[Dict[str, Any]], intent: dict = None) -> str:
        intent = intent or {}
        # Check if Gemini API key is configured
        api_key = settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY")

        if api_key:
            try:
                from google import genai

                client = genai.Client(api_key=api_key)

                # Build rich context for each movie
                movies_context = ""
                for idx, m in enumerate(movies, 1):
                    genres_str = ", ".join(m.get("genres", [])) or "Chưa phân loại"
                    movies_context += (
                        f"{idx}. **{m.get('title')}** ({m.get('year')})\n"
                        f"   Tên gốc: {m.get('original_title') or 'N/A'}\n"
                        f"   Thể loại: {genres_str}\n"
                        f"   Điểm: {m.get('rating', 0):.1f}/10\n"
                        f"   Đạo diễn: {m.get('director') or 'N/A'}\n"
                        f"   Mô tả: {(m.get('description') or '')[:200]}...\n\n"
                    )

                # Build intent context
                genres_detected = intent.get("genres", []) + intent.get("mood_genres", [])
                intent_note = ""
                if genres_detected:
                    intent_note = f"Người dùng muốn thể loại: {', '.join(genres_detected)}. "
                if intent.get("film_type"):
                    intent_note += f"Loại phim: {intent['film_type']}."

                prompt = f"""Yêu cầu người dùng: "{query}"
{intent_note}

Danh sách phim gợi ý từ cơ sở dữ liệu ChillFilm:
{movies_context if movies else "Không tìm thấy phim nào phù hợp trong kho dữ liệu."}

Hãy viết một phản hồi tự nhiên, thân thiện và cuốn hút bằng tiếng Việt (2-4 câu ngắn gọn). 
- Đề cập tên các bộ phim được gợi ý và lý do chúng phù hợp với yêu cầu người dùng.
- Giọng điệu nhiệt tình, như một người bạn yêu phim đang tư vấn.
- Nếu không có phim nào: thông báo lịch sự và gợi ý thử từ khóa khác.
- KHÔNG đề cập đến "danh sách" hay "hệ thống" một cách khô khan.
"""
                response = client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt,
                    config={
                        "system_instruction": (
                            "Bạn là ChillFilm AI, trợ lý ảo thân thiện của nền tảng xem phim ChillFilm. "
                            "Hãy gợi ý phim một cách nhiệt tình, chân thực và ngắn gọn như một người bạn yêu phim."
                        ),
                        "temperature": 0.75,
                    },
                )

                if response and response.text:
                    return response.text.strip()
            except Exception as e:
                print(f"[generation] Gemini error: {e}")

        # ── Fallback: local generation ────────────────────────────────────
        return GenerationService._generate_local_answer(query, movies, intent)

    @staticmethod
    def _generate_local_answer(query: str, movies: List[Dict[str, Any]], intent: dict) -> str:
        if not movies:
            genres = intent.get("genres", [])
            if genres:
                return (
                    f"Xin lỗi, tôi chưa tìm thấy phim thể loại {', '.join(genres)} nào phù hợp trong kho phim. "
                    f"Bạn thử tìm với từ khóa khác hoặc thể loại khác nhé! 🎬"
                )
            return (
                f"Xin lỗi, tôi không tìm thấy phim nào phù hợp với yêu cầu '{query}'. "
                f"Hãy thử mô tả thể loại, tâm trạng hoặc tên phim bạn muốn tìm nhé! 🎬"
            )

        titles_str = " và ".join([f'**"{m.get("title")}"**' for m in movies[:3]])
        genres_detected = intent.get("genres", []) + intent.get("mood_genres", [])

        if genres_detected:
            genre_txt = ", ".join(genres_detected[:2])
            answer = f"Với thể loại {genre_txt}, mình gợi ý bạn xem {titles_str}"
        else:
            answer = f"Dựa trên yêu cầu của bạn, mình tìm thấy {titles_str}"

        if len(movies) > 3:
            answer += f" cùng {len(movies) - 3} bộ phim hay khác nữa"

        answer += ". Hy vọng bạn tìm được bộ phim ưng ý! 🍿"
        return answer
