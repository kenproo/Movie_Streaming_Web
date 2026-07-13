"""
Vietnamese & multilingual text normalizer
"""
import re
import unicodedata


# Vietnamese accent removal mapping
_ACCENT_MAP = str.maketrans(
    "àáâãäåæāăąbcçćĉčddðďđèéêëēĕęěfggĝğġĥħìíîïĩīĭiĵkklĺļľŀłmnñńņňŋòóôõöøōŏőœppqrŕŗřsśŝşšttţťŧùúûüũūŭůűųvŵxýÿźżžþ"
    "ÀÁÂÃÄÅÆĀĂĄBCÇĆĈČDDÐĎĐÈÉÊËĒĔĘĚFGGĜĞĠĤĦÌÍÎÏĨĪĬIĴKKLĹĻĽĿŁMNÑŃŅŇŊÒÓÔÕÖØŌŎŐŒPPQRŔŖŘSŚŜŞŠTTŢŤŦÙÚÛÜŨŪŬŮŰŲVŴXÝŸŹŻŽÞ",
    "aaaaaaaaaaabcccccdddddeeeeeeeeeefggggghhiiiiiiiiijkklllllmnnnnnnoooooooooooppqrrrrssssssttttuuuuuuuuuuvwxyyzzzt"
    "AAAAAAAAAAABCCCCCDDDDDEEEEEEEEEEFGGGGGHHIIIIIIIIIJKKLLLLLMNNNNNNOOOOOOOOOOOPPQRRRRSSSSSSTTTTUUUUUUUUUUVWXYYZZZT",
)

# Vietnamese diacritics
_VIET_ACCENT_MAP = {
    'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a',
    'ā': 'a', 'ă': 'a', 'ą': 'a',
    'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e', 'ē': 'e', 'ĕ': 'e',
    'ę': 'e', 'ě': 'e',
    'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i', 'ĩ': 'i', 'ī': 'i',
    'ĭ': 'i',
    'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o', 'ø': 'o',
    'ō': 'o', 'ŏ': 'o', 'ő': 'o',
    'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u', 'ũ': 'u', 'ū': 'u',
    'ŭ': 'u', 'ů': 'u', 'ű': 'u', 'ų': 'u',
    'ý': 'y', 'ÿ': 'y',
    'ç': 'c', 'ć': 'c', 'ĉ': 'c', 'č': 'c',
    'ñ': 'n', 'ń': 'n', 'ņ': 'n', 'ň': 'n', 'ŋ': 'n',
    'ß': 'ss', 'đ': 'd', 'ð': 'd',
    # Vietnamese specific
    'ạ': 'a', 'ả': 'a', 'ấ': 'a', 'ầ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
    'ắ': 'a', 'ằ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
    'ẹ': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ế': 'e', 'ề': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
    'ị': 'i', 'ỉ': 'i', 'ĩ': 'i',
    'ọ': 'o', 'ỏ': 'o', 'ố': 'o', 'ồ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
    'ớ': 'o', 'ờ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
    'ụ': 'u', 'ủ': 'u', 'ứ': 'u', 'ừ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
    'ỳ': 'y', 'ỵ': 'y', 'ỷ': 'y', 'ỹ': 'y',
}


def remove_accents(text: str) -> str:
    """Loại bỏ dấu tiếng Việt và Latin, trả về chuỗi ASCII."""
    result = []
    for ch in text:
        lower = ch.lower()
        if lower in _VIET_ACCENT_MAP:
            mapped = _VIET_ACCENT_MAP[lower]
            result.append(mapped.upper() if ch.isupper() else mapped)
        else:
            try:
                normalized = unicodedata.normalize('NFD', ch)
                ascii_char = normalized.encode('ascii', 'ignore').decode('ascii')
                result.append(ascii_char if ascii_char else ch)
            except Exception:
                result.append(ch)
    return ''.join(result)


def normalize_query(text: str) -> str:
    """
    Chuẩn hóa query:
    1. Unicode NFC normalization
    2. Lowercase
    3. Loại bỏ ký tự thừa (giữ chữ, số, khoảng trắng, dấu tiếng Việt)
    4. Chuẩn hóa khoảng trắng
    """
    if not text:
        return ""

    # NFC normalize
    text = unicodedata.normalize('NFC', text)

    # Lowercase
    text = text.lower()

    # Loại bỏ ký tự không phải chữ/số/khoảng trắng/dấu tiếng Việt
    text = re.sub(r'[^\w\s\u00C0-\u024F\u1E00-\u1EFF]', ' ', text)

    # Chuẩn hóa khoảng trắng
    text = re.sub(r'\s+', ' ', text).strip()

    return text


def normalize_for_search(text: str) -> str:
    """Normalize + remove accents để dùng cho fuzzy matching."""
    normalized = normalize_query(text)
    return remove_accents(normalized).lower()


def is_likely_title(query: str) -> bool:
    """Heuristic: query ngắn và viết hoa có thể là tên phim."""
    words = query.strip().split()
    if len(words) <= 6 and any(w[0].isupper() for w in words if w):
        return True
    return False
