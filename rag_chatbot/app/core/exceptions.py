"""
Custom exceptions cho RAG service
"""
from fastapi import HTTPException, status


class QdrantUnavailableError(Exception):
    """Raised khi không kết nối được Qdrant"""
    pass


class EmbeddingModelError(Exception):
    """Raised khi embedding model gặp lỗi"""
    pass


class InvalidTopKError(ValueError):
    """Raised khi top_k vượt quá MAX_TOP_K"""
    pass


def qdrant_unavailable_exception() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        detail="Vector database (Qdrant) is currently unavailable. Using fallback retrieval.",
    )


def invalid_top_k_exception(max_k: int) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        detail=f"top_k must be between 1 and {max_k}",
    )
