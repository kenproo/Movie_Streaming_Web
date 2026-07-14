"""
Main FastAPI application — ChillFilm RAG Service
"""
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.routes import chat_routes
from app.core.config import get_settings
from app.core.logging import logger
from app.repositories import qdrant_repository
from app.repositories.qdrant_repository import get_collection_info
from app.schemas.schemas import HealthResponse, ChatRequest
from app.services import embedding_service


# ── Lifespan (startup / shutdown) ─────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Khởi tạo services khi startup, cleanup khi shutdown."""
    settings = get_settings()

    logger.info("=== ChillFilm RAG Service Starting ===")
    logger.info("Environment: %s", settings.APP_ENV)
    logger.info("Qdrant URL: %s", settings.QDRANT_URL)
    logger.info("Collection: %s", settings.QDRANT_COLLECTION)
    logger.info("LLM Provider: %s", settings.LLM_PROVIDER)

    if settings.retrieval_only_mode:
        logger.warning(
            "Running in RETRIEVAL-ONLY mode — LLM_PROVIDER=none or GEMINI_API_KEY not set. "
            "Responses will use template generation."
        )

    # Init Qdrant
    qdrant_ok = qdrant_repository.init_qdrant_client(
        url=settings.QDRANT_URL,
        api_key=settings.QDRANT_API_KEY or None,
        timeout=settings.QDRANT_TIMEOUT_SECONDS,
    )
    if qdrant_ok:
        collection_info = get_collection_info(settings.QDRANT_COLLECTION)
        if collection_info:
            logger.info(
                "Qdrant collection '%s': %d vectors, dimension=%s",
                settings.QDRANT_COLLECTION,
                collection_info.get("vectors_count", 0),
                collection_info.get("vector_size", "unknown"),
            )
    else:
        logger.warning("Qdrant unavailable — will use MySQL fallback retrieval")

    # Load embedding model (chỉ nếu Qdrant available và model đã set)
    if qdrant_ok and settings.EMBEDDING_MODEL:
        embedding_service.load_embedding_model(
            model_name=settings.EMBEDDING_MODEL,
            device=settings.EMBEDDING_DEVICE,
        )
    elif not settings.EMBEDDING_MODEL:
        logger.warning(
            "EMBEDDING_MODEL not set — vector search disabled. "
            "Set to the model used when creating the Qdrant collection."
        )

    logger.info("=== ChillFilm RAG Service Ready ===")

    yield  # App is running

    # Shutdown
    logger.info("=== ChillFilm RAG Service Shutting Down ===")


# ── FastAPI App ────────────────────────────────────────────────────────────

settings = get_settings()

app = FastAPI(
    title="ChillFilm RAG Chatbot Service",
    description="RAG-powered movie recommendation chatbot for ChillFilm",
    version="3.0.0",
    lifespan=lifespan,
    docs_url="/docs" if not settings.is_production else None,
    redoc_url=None,
)

# CORS — chỉ cho phép backend gọi, KHÔNG wildcard với credentials
# Frontend không gọi trực tiếp RAG service
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://backend:8080"],
    allow_credentials=False,
    allow_methods=["POST", "GET"],
    allow_headers=["Content-Type"],
)


# ── Health endpoints ───────────────────────────────────────────────────────

@app.get("/health", response_model=HealthResponse, tags=["Health"])
def health_check():
    """Basic health check — luôn trả về kể cả khi Qdrant down."""
    return HealthResponse(
        status="healthy",
        service="rag-chatbot",
        version="3.0.0",
        mode="retrieval-only" if settings.retrieval_only_mode else "full",
        qdrant_connected=qdrant_repository.is_qdrant_available(),
        retrieval_mode="qdrant+mysql" if qdrant_repository.is_qdrant_available() else "mysql-only",
    )


@app.get("/ready", tags=["Health"])
def readiness_check():
    """Readiness check — kiểm tra service sẵn sàng xử lý request."""
    return {
        "ready": True,
        "qdrant": qdrant_repository.is_qdrant_available(),
        "embedding_model": embedding_service.is_model_loaded(),
        "retrieval_mode": (
            "vector+mysql" if qdrant_repository.is_qdrant_available()
            else "mysql-fallback"
        ),
    }


# ── Legacy endpoint (giữ tương thích với backend đang gọi /rag/chat) ─────

@app.post("/rag/chat", tags=["Legacy"])
async def legacy_chat(request: ChatRequest):
    """Legacy endpoint — giữ tương thích với Spring Boot backend."""
    from app.services import chatbot_service
    import uuid

    message = request.message
    session_id = request.session_id

    try:
        result = chatbot_service.chat(message=message, session_id=session_id)

        recommendations = [
            {
                "id": m["id"],
                "title": m["title"],
                "slug": m["slug"],
                "posterUrl": m.get("poster_url", ""),
                "rating": m.get("rating", 0.0),
                "year": m.get("year", 0),
                "reason": "Gợi ý phù hợp",
                "score": float(m.get("_score", 0.5)),
                "genres": m.get("genres", []),
            }
            for m in result["movies"]
        ]

        return {
            "answer": result["answer"],
            "recommendations": recommendations,
            "sessionId": result["session_id"],
        }
    except Exception as e:
        logger.error("Legacy chat error: %s", str(e))
        return {
            "answer": "Xin lỗi, hệ thống chatbot đang gặp sự cố. Vui lòng thử lại sau!",
            "recommendations": [],
            "sessionId": session_id or str(uuid.uuid4()),
        }


# ── API v1 routes ──────────────────────────────────────────────────────────

app.include_router(
    chat_routes.router,
    prefix="/api/v1",
    tags=["Chat & Search"],
)


# ── Exception handler ──────────────────────────────────────────────────────

@app.exception_handler(Exception)
async def generic_exception_handler(request, exc):
    logger.error("Unhandled exception: %s", str(exc))
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred."},
    )
