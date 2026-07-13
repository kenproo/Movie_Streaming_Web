"""
ChillFilm RAG Chatbot Service
Cấu hình tập trung từ environment variables
"""
import os
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # App
    APP_ENV: str = "local"
    APP_HOST: str = "0.0.0.0"
    APP_PORT: int = 8000

    # Qdrant
    QDRANT_URL: str = "http://localhost:6333"
    QDRANT_COLLECTION: str = "chillfilm_movies"
    QDRANT_API_KEY: str = ""
    QDRANT_TIMEOUT_SECONDS: int = 10

    # Embedding
    EMBEDDING_MODEL: str = ""
    EMBEDDING_DEVICE: str = "cpu"
    EMBEDDING_BATCH_SIZE: int = 16
    HF_HOME: str = "/app/.cache/huggingface"

    # Retrieval
    DEFAULT_TOP_K: int = 10
    MAX_TOP_K: int = 30

    # LLM (optional)
    LLM_PROVIDER: str = "none"  # "none" | "gemini"
    GEMINI_API_KEY: str = ""

    # Logging
    LOG_LEVEL: str = "INFO"

    # Legacy MySQL (fallback retrieval khi chưa có Qdrant data)
    DB_HOST: str = "127.0.0.1"
    DB_PORT: int = 3306
    DB_USER: str = "root"
    DB_PASSWORD: str = "root"
    DB_NAME: str = "movie_streaming_web"

    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def database_url(self) -> str:
        return (
            f"mysql+pymysql://{self.DB_USER}:{self.DB_PASSWORD}"
            f"@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}?charset=utf8mb4"
        )

    @property
    def is_production(self) -> bool:
        return self.APP_ENV == "production"

    @property
    def retrieval_only_mode(self) -> bool:
        return self.LLM_PROVIDER == "none" or not self.GEMINI_API_KEY


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
