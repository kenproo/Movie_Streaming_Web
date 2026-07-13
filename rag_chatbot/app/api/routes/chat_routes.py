"""
FastAPI routes for RAG chatbot
"""
import logging
import time
from typing import Optional

from fastapi import APIRouter, HTTPException, Query, status

from app.core.config import get_settings
from app.core.exceptions import invalid_top_k_exception
from app.repositories import qdrant_repository
from app.schemas.schemas import (
    ChatRequest,
    ChatResponse,
    MovieResult,
    SearchRequest,
    SearchResponse,
)
from app.services import chatbot_service, embedding_service, retrieval_service
from app.utils.text_normalizer import normalize_query

logger = logging.getLogger("chillfilm.rag.routes")

router = APIRouter()


@router.post("/search", response_model=SearchResponse)
def search_movies(request: SearchRequest):
    """Vector/fulltext search cho phim."""
    settings = get_settings()

    if request.top_k > settings.MAX_TOP_K:
        raise invalid_top_k_exception(settings.MAX_TOP_K)

    start = time.time()
    normalized = normalize_query(request.query)

    genres = None
    year = None
    film_type = None
    if request.filters:
        if request.filters.genre:
            genres = [request.filters.genre]
        year = request.filters.year
        film_type = request.filters.type

    movies = retrieval_service.retrieve(
        query=normalized,
        top_k=request.top_k,
        genres=genres,
        year=year,
        film_type=film_type,
    )

    elapsed_ms = (time.time() - start) * 1000

    results = [
        MovieResult(
            id=m["id"],
            title=m["title"],
            slug=m["slug"],
            posterUrl=m.get("poster_url", ""),
            rating=m.get("rating", 0.0),
            year=m.get("year", 0),
            reason="Phù hợp với tìm kiếm của bạn",
            score=float(m.get("_score", 0.5)),
            genres=m.get("genres", []),
        )
        for m in movies
    ]

    return SearchResponse(
        success=True,
        query=request.query,
        normalized_query=normalized,
        results=results,
        total=len(results),
        processing_time_ms=elapsed_ms,
    )


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    """Chatbot endpoint — retrieval + generation."""
    try:
        result = chatbot_service.chat(
            message=request.message,
            session_id=request.session_id,
        )

        recommendations = [
            MovieResult(
                id=m["id"],
                title=m["title"],
                slug=m["slug"],
                posterUrl=m.get("poster_url", ""),
                rating=m.get("rating", 0.0),
                year=m.get("year", 0),
                reason="Gợi ý phù hợp với yêu cầu của bạn",
                score=float(m.get("_score", 0.5)),
                genres=m.get("genres", []),
            )
            for m in result["movies"]
        ]

        return ChatResponse(
            answer=result["answer"],
            recommendations=recommendations,
            sessionId=result["session_id"],
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Chat error: %s", str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An internal error occurred in the RAG pipeline.",
        )
