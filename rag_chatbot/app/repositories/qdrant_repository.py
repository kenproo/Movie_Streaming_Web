"""
Qdrant repository — tất cả tương tác với Qdrant vector database
"""
import logging
import time
from typing import Any, Dict, List, Optional

logger = logging.getLogger("chillfilm.rag.qdrant")

_qdrant_client = None
_qdrant_available = False


def init_qdrant_client(url: str, api_key: Optional[str] = None, timeout: int = 10) -> bool:
    """
    Khởi tạo Qdrant client (singleton).
    Trả về True nếu kết nối thành công, False nếu không.
    """
    global _qdrant_client, _qdrant_available
    try:
        from qdrant_client import QdrantClient
        kwargs: Dict[str, Any] = {"url": url, "timeout": timeout}
        if api_key:
            kwargs["api_key"] = api_key
        _qdrant_client = QdrantClient(**kwargs)
        # Test connection
        _qdrant_client.get_collections()
        _qdrant_available = True
        logger.info("Qdrant connected at: %s", url)
        return True
    except ImportError:
        logger.warning("qdrant-client not installed. Qdrant search disabled.")
        _qdrant_available = False
        return False
    except Exception as e:
        logger.warning("Cannot connect to Qdrant at %s: %s", url, e)
        _qdrant_available = False
        return False


def is_qdrant_available() -> bool:
    return _qdrant_available


def get_collection_info(collection_name: str) -> Optional[Dict[str, Any]]:
    """Lấy thông tin collection để kiểm tra vector dimension."""
    if not _qdrant_available or _qdrant_client is None:
        return None
    try:
        info = _qdrant_client.get_collection(collection_name)
        config = info.config.params.vectors
        return {
            "name": collection_name,
            "vectors_count": getattr(info, "vectors_count", getattr(info, "points_count", 0)),
            "indexed_vectors_count": getattr(info, "indexed_vectors_count", 0),
            "vector_size": getattr(config, 'size', None),
            "distance": str(getattr(config, 'distance', None)),
        }
    except Exception as e:
        logger.warning("Cannot get collection info for %s: %s", collection_name, e)
        return None


def search_vectors(
    collection_name: str,
    query_vector: List[float],
    top_k: int = 10,
    score_threshold: float = 0.3,
    payload_filter: Optional[Any] = None,
) -> List[Dict[str, Any]]:
    """
    Tìm kiếm vector trong Qdrant.
    Trả về list dict với các trường từ payload.
    """
    if not _qdrant_available or _qdrant_client is None:
        logger.warning("Qdrant not available, returning empty results")
        return []

    start = time.time()
    try:
        from qdrant_client.models import Filter
        kwargs: Dict[str, Any] = {
            "collection_name": collection_name,
            "query_vector": query_vector,
            "limit": top_k,
            "score_threshold": score_threshold,
            "with_payload": True,
        }
        if payload_filter is not None:
            kwargs["query_filter"] = payload_filter

        # Dùng search_points để tương thích với mọi phiên bản qdrant-client
        results = _qdrant_client.search_points(**kwargs)

        elapsed_ms = (time.time() - start) * 1000
        logger.debug("Qdrant search: %d results in %.1fms", len(results), elapsed_ms)

        return [
            {
                **point.payload,
                "_score": point.score,
                "_id": str(point.id),
            }
            for point in results
        ]
    except Exception as e:
        logger.error("Qdrant search error: %s", e)
        return []


def build_filter(
    genre: Optional[str] = None,
    year: Optional[int] = None,
    movie_type: Optional[str] = None,
) -> Optional[Any]:
    """Tạo Qdrant filter từ metadata."""
    if not (genre or year or movie_type):
        return None
    try:
        from qdrant_client.models import Filter, FieldCondition, MatchValue, Range
        conditions = []
        if genre:
            conditions.append(
                FieldCondition(key="genres", match=MatchValue(value=genre.lower()))
            )
        if year:
            conditions.append(
                FieldCondition(key="year", range=Range(gte=year, lte=year))
            )
        if movie_type:
            conditions.append(
                FieldCondition(key="type", match=MatchValue(value=movie_type.lower()))
            )
        return Filter(must=conditions) if conditions else None
    except ImportError:
        return None
