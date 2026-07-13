# ChillFilm — Architecture

## Overview

```
User
  |
  v
Vercel (Frontend — React/Vite)
https://chillfilm.io.vn
  |
  v (HTTPS)
Nginx (EC2)
https://api.chillfilm.io.vn
  |
  v (HTTP internal, port 8080)
Spring Boot Backend
  |              |               |
  v              v               v
MySQL :3306   Qdrant :6333   RAG Chatbot :8000
                                  |
                                  v
                              MySQL (fallback retrieval)
                              Qdrant (vector search)
```

## Services

| Service | Tech | Host | Port |
|---------|------|------|------|
| Frontend | React + Vite + TypeScript | Vercel | 443 |
| Backend API | Spring Boot 3.x + Java 21 | EC2 | 8080 (internal) |
| Database | MySQL 8.4 | EC2 Docker | 3306 (internal) |
| Vector DB | Qdrant | EC2 Docker | 6333 (internal) |
| RAG Service | Python FastAPI | EC2 Docker | 8000 (internal) |
| Nginx | Nginx | EC2 host | 80, 443 |

## Network rules
- Chỉ public port 22 (SSH), 80 (HTTP), 443 (HTTPS)
- MySQL, Qdrant, RAG **không** expose ra ngoài
- Backend bind `127.0.0.1:8080` — chỉ Nginx mới access được
- Frontend → Backend: qua Nginx (HTTPS)
- Backend → RAG: qua Docker internal network (http://rag-chatbot:8000)
- Backend → MySQL: qua Docker internal network (mysql:3306)
- Backend → Qdrant: qua Docker internal network (qdrant:6333)
