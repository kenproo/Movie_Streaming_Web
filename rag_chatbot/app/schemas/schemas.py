"""
Pydantic schemas cho RAG API
"""
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


# ── Request schemas ────────────────────────────────────────────────────────

class SearchFilters(BaseModel):
    year: Optional[int] = None
    genre: Optional[str] = None
    type: Optional[str] = None  # "single" | "series"


class SearchRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=500, description="Search query")
    top_k: int = Field(10, ge=1, le=30, description="Number of results")
    filters: Optional[SearchFilters] = None


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000, description="User message")
    session_id: Optional[str] = Field(None, alias="sessionId", description="Session ID")
    user_id: Optional[str] = Field(None, alias="userId", description="User ID")

    model_config = {"populate_by_name": True}


# ── Response schemas ───────────────────────────────────────────────────────

class MovieResult(BaseModel):
    id: str
    title: str
    slug: str
    poster_url: str = Field(..., alias="posterUrl")
    rating: float
    year: int
    reason: str
    score: float
    genres: List[str] = []

    model_config = {"populate_by_name": True}


class SearchResponse(BaseModel):
    success: bool = True
    query: str
    normalized_query: str
    results: List[MovieResult]
    total: int
    processing_time_ms: float


class ChatResponse(BaseModel):
    answer: str
    recommendations: List[MovieResult]
    session_id: str = Field(..., alias="sessionId")

    model_config = {"populate_by_name": True}


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    mode: str
    qdrant_connected: bool
    retrieval_mode: str
