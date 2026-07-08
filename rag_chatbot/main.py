import uuid
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from config import settings
from database import get_db
from services.query_service import QueryService
from services.retrieval_service import RetrievalService
from services.rerank_service import RerankService
from services.generation_service import GenerationService

app = FastAPI(
    title="ChillFilm RAG Chatbot Service",
    description="Microservice handles RAG chatbot and movie recommendations",
    version="2.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Pydantic Schemas ──────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str = Field(..., description="User message")
    userId: Optional[str] = Field(None, description="Optional user UUID string")
    sessionId: Optional[str] = Field(None, description="Optional session identifier")


class MovieRecommendationResponse(BaseModel):
    id: str
    title: str
    slug: str
    posterUrl: str = Field(..., serialization_alias="posterUrl")
    rating: float
    year: int
    reason: str
    score: float

    class Config:
        populate_by_name = True


class ChatResponse(BaseModel):
    answer: str
    recommendations: List[MovieRecommendationResponse]
    sessionId: str = Field(..., serialization_alias="sessionId")

    class Config:
        populate_by_name = True


# ── Endpoints ─────────────────────────────────────────────────────────────────

@app.post("/rag/chat", response_model=ChatResponse)
def chat(request: ChatRequest, db: Session = Depends(get_db)):
    try:
        # Step 1: Normalize query + extract intent
        normalized_query = QueryService.normalize(request.message)
        intent = QueryService.extract_intent(request.message)  # use raw message for intent

        # Step 2: Multi-strategy retrieval (genre + text + keywords)
        candidates = RetrievalService.retrieve(db, normalized_query, intent, top_k=40)

        # Step 3: Rerank with intent-aware scoring
        reranked = RerankService.rerank(candidates, normalized_query, intent)

        # Step 4: Build recommendation responses with per-movie reasons
        recommendations = []
        for m in reranked:
            reason = RerankService.build_reason(m, intent)
            recommendations.append(MovieRecommendationResponse(
                id=m["id"],
                title=m["title"],
                slug=m["slug"],
                posterUrl=m["poster_url"],
                rating=m["rating"],
                year=m["year"],
                reason=reason,
                score=m.get("score", m["rating"]),
            ))

        # Step 5: Generate natural language answer
        answer = GenerationService.generate_answer(normalized_query, reranked, intent)

        session_id = request.sessionId if request.sessionId else str(uuid.uuid4())

        return ChatResponse(
            answer=answer,
            recommendations=recommendations,
            sessionId=session_id,
        )

    except Exception as e:
        import traceback
        print(f"[RAG] Error: {e}\n{traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred in RAG pipeline: {str(e)}",
        )


@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "rag-chatbot", "version": "2.0.0"}
