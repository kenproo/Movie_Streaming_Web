"""
Embedding service — load model một lần, reuse cho mọi request
"""
import logging
import time
from typing import List, Optional

logger = logging.getLogger("chillfilm.rag.embedding")

_embedding_model = None
_model_name: Optional[str] = None
_model_loaded = False


def load_embedding_model(model_name: str, device: str = "cpu") -> bool:
    """
    Load embedding model vào memory (singleton).
    Trả về True nếu thành công, False nếu không.

    QUAN TRỌNG: model_name phải khớp với model đã dùng khi tạo Qdrant collection.
    Kiểm tra vector dimension trong Qdrant trước khi thay đổi model.
    """
    global _embedding_model, _model_name, _model_loaded

    if not model_name:
        logger.warning(
            "EMBEDDING_MODEL not set. Vector search disabled. "
            "Set EMBEDDING_MODEL to the model used when creating Qdrant collection."
        )
        _model_loaded = False
        return False

    if _model_loaded and _model_name == model_name:
        logger.info("Embedding model already loaded: %s", model_name)
        return True

    try:
        from sentence_transformers import SentenceTransformer
        logger.info("Loading embedding model: %s (device=%s)", model_name, device)
        start = time.time()
        _embedding_model = SentenceTransformer(model_name, device=device)
        elapsed = time.time() - start
        _model_name = model_name
        _model_loaded = True
        logger.info("Embedding model loaded in %.1fs", elapsed)
        return True
    except ImportError:
        logger.warning(
            "sentence-transformers not installed. "
            "Install it to enable vector search: pip install sentence-transformers"
        )
        _model_loaded = False
        return False
    except Exception as e:
        logger.error("Failed to load embedding model %s: %s", model_name, e)
        _model_loaded = False
        return False


def is_model_loaded() -> bool:
    return _model_loaded


def get_model_name() -> Optional[str]:
    return _model_name


def encode_texts(texts: List[str], batch_size: int = 16) -> Optional[List[List[float]]]:
    """
    Encode texts thành vectors.
    Trả về None nếu model chưa load.
    """
    if not _model_loaded or _embedding_model is None:
        return None

    start = time.time()
    try:
        vectors = _embedding_model.encode(
            texts,
            batch_size=batch_size,
            show_progress_bar=False,
            convert_to_numpy=True,
        )
        elapsed_ms = (time.time() - start) * 1000
        logger.debug("Encoded %d texts in %.1fms", len(texts), elapsed_ms)
        return vectors.tolist()
    except Exception as e:
        logger.error("Embedding error: %s", e)
        return None


def encode_query(query: str) -> Optional[List[float]]:
    """Encode single query string."""
    results = encode_texts([query])
    return results[0] if results else None
