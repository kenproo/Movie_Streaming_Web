import re
from typing import Optional

# Vietnamese → English genre mapping
GENRE_MAP = {
    # Action / Hành động
    "hành động": "action", "hanh dong": "action",
    # Comedy / Hài
    "hài": "comedy", "hài hước": "comedy", "hai": "comedy",
    # Romance / Tình cảm
    "tình cảm": "romance", "lãng mạn": "romance", "tinh cam": "romance",
    # Horror / Kinh dị
    "kinh dị": "horror", "kinh di": "horror", "ma": "horror", "quỷ": "horror",
    # Drama / Tâm lý
    "tâm lý": "drama", "tam ly": "drama", "drama": "drama",
    # Thriller / Hồi hộp
    "hồi hộp": "thriller", "giật gân": "thriller",
    # Crime / Tội phạm
    "tội phạm": "crime", "toi pham": "crime", "trinh thám": "crime",
    # Family / Gia đình
    "gia đình": "family", "gia dinh": "family",
    # Fantasy / Giả tưởng
    "giả tưởng": "fantasy", "gia tuong": "fantasy", "kỳ ảo": "fantasy",
    # Sci-fi / Khoa học viễn tưởng
    "khoa học viễn tưởng": "sci-fi", "sci fi": "sci-fi", "viễn tưởng": "sci-fi",
    # Adventure / Phiêu lưu
    "phiêu lưu": "adventure", "phieu luu": "adventure",
    # Documentary / Tài liệu
    "tài liệu": "documentary", "tai lieu": "documentary",
    # Animation / Hoạt hình
    "hoạt hình": "animation", "hoat hinh": "animation", "anime": "anime",
    # War / Chiến tranh
    "chiến tranh": "war", "chien tranh": "war",
    # History / Lịch sử
    "lịch sử": "history", "lich su": "history",
    # Music / Âm nhạc
    "âm nhạc": "music", "am nhac": "music",
    # Mystery / Bí ẩn
    "bí ẩn": "mystery", "bi an": "mystery",
    # Biography
    "tiểu sử": "biography",
}

# Film type mapping
TYPE_MAP = {
    "phim lẻ": "single", "phim le": "single", "phim chiếu rạp": "single",
    "phim bộ": "series", "phim bo": "series", "series": "series",
    "anime": "anime",
}

# Mood / intent keywords
MOOD_MAP = {
    "vui": ["comedy", "family", "animation"],
    "buồn": ["drama", "romance"],
    "sợ": ["horror", "thriller"],
    "hồi hộp": ["thriller", "action", "crime"],
    "thư giãn": ["comedy", "family", "romance"],
    "truyền cảm hứng": ["biography", "history", "drama"],
    "nghẹt thở": ["action", "thriller"],
    "cảm động": ["drama", "family", "romance"],
}


class QueryService:
    @staticmethod
    def normalize(raw_query: str) -> str:
        if not raw_query:
            return ""

        # Trim and lowercase
        normalized = raw_query.strip().lower()

        # Remove common filler words in Vietnamese and English
        filler_pattern = r"\b(gợi ý|recommend|tìm|find|cho tôi|cho mình|muốn xem|hay|nhất|tốt|những|mấy|các)\b"
        normalized = re.sub(filler_pattern, "", normalized)

        # Replace multiple spaces with a single space
        normalized = re.sub(r"\s+", " ", normalized).strip()

        return normalized if normalized else raw_query.strip()

    @staticmethod
    def extract_intent(query: str) -> dict:
        """
        Extract structured intent from user query:
        - genres: list of target genre strings (English)
        - film_type: 'single'|'series'|'anime'|None
        - search_terms: keywords for full-text search
        - mood_genres: genres derived from mood keywords
        """
        q = query.strip().lower()
        found_genres = []
        film_type = None
        mood_genres = []

        # Detect genres
        for vn_kw, en_genre in GENRE_MAP.items():
            if vn_kw in q:
                if en_genre not in found_genres:
                    found_genres.append(en_genre)

        # Detect film type
        for vn_kw, ftype in TYPE_MAP.items():
            if vn_kw in q:
                film_type = ftype
                break

        # Detect moods
        for mood_kw, genres in MOOD_MAP.items():
            if mood_kw in q:
                for g in genres:
                    if g not in mood_genres:
                        mood_genres.append(g)

        # Extract search keywords (words > 2 chars that aren't stop words)
        stop_words = {
            "phim", "movie", "film", "của", "và", "với", "là", "có", "the", "a", "an",
            "in", "on", "at", "to", "for", "of", "or", "but", "not", "this", "that",
            "một", "một số", "hay", "nhất", "tốt", "được", "xem", "giống", "như",
        }
        words = re.findall(r"[a-zA-ZÀ-ỹà-ỹ0-9]+", q)
        search_terms = [w for w in words if len(w) > 2 and w not in stop_words]

        return {
            "genres": found_genres,
            "film_type": film_type,
            "mood_genres": mood_genres,
            "search_terms": search_terms,
            "raw": query,
        }
