# ChillFilm — Environment Variables

## Frontend (Vercel)

| Variable | Description | Example |
|----------|-------------|--------|
| `VITE_API_BASE_URL` | Backend API base URL | `https://api.chillfilm.io.vn/api` |
| `VITE_RAG_API_BASE_URL` | RAG via backend | `https://api.chillfilm.io.vn/api/chatbot` |
| `VITE_APP_NAME` | App name | `ChillFilm` |

## Backend (Spring Boot)

| Variable | Description | Example |
|----------|-------------|--------|
| `SPRING_PROFILES_ACTIVE` | Profile | `prod` |
| `SPRING_DATASOURCE_URL` | MySQL JDBC URL | `jdbc:mysql://mysql:3306/chillfilm?...` |
| `SPRING_DATASOURCE_USERNAME` | MySQL user | `chillfilm_user` |
| `SPRING_DATASOURCE_PASSWORD` | MySQL password | `CHANGE_ME` |
| `JWT_SECRET` | JWT signing key (min 64 chars) | `...` |
| `FRONTEND_URL` | Allowed CORS origin | `https://chillfilm.io.vn` |
| `RAG_BASE_URL` | RAG service URL | `http://rag-chatbot:8000` |
| `QDRANT_URL` | Qdrant URL | `http://qdrant:6333` |

## RAG Chatbot (FastAPI)

| Variable | Description | Example |
|----------|-------------|--------|
| `QDRANT_URL` | Qdrant URL | `http://qdrant:6333` |
| `QDRANT_COLLECTION` | Collection name | `chillfilm_movies` |
| `EMBEDDING_MODEL` | HuggingFace model | check current dimension |
| `LLM_PROVIDER` | LLM provider | `none` hoặc `gemini` |
| `GEMINI_API_KEY` | Gemini key (optional) | `...` |

> **QUAN TRỌNG**: `EMBEDDING_MODEL` phải khớp với model đã dùng khi tạo Qdrant collection.
> Chạy `python rag_chatbot/scripts/check_collection.py` để kiểm tra trước khi đổi.
