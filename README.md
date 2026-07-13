# ChillFilm — Movie Streaming Web App

Nền tảng xem phim trực tuyến với chatbot AI gợi ý phim (RAG).

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React + Vite + TypeScript + TailwindCSS |
| Backend | Java 21 + Spring Boot 3.x |
| Database | MySQL 8.4 |
| Vector DB | Qdrant |
| RAG Service | Python 3.11 + FastAPI |
| Storage | AWS S3 |
| Frontend Deploy | Vercel |
| Backend Deploy | AWS EC2 + Docker |

## Project Structure

```
movie-streaming-web/
├── .github/workflows/     # CI/CD pipelines
├── backend/               # Spring Boot API
├── frontend/              # React + Vite SPA
├── rag_chatbot/           # FastAPI RAG service
│   └── app/               # New structured app
├── deploy/ec2/            # Production infrastructure
│   ├── docker-compose.prod.yml
│   ├── nginx/
│   └── scripts/
├── docs/                  # Documentation
├── docker-compose.local.yml
└── README.md
```

## Local Development

### 1. Start infrastructure (MySQL + Qdrant + RAG)
```bash
docker compose -f docker-compose.local.yml up -d
```

### 2. Run Backend
```bash
cd backend
cp .env.example .env.local  # edit if needed
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

### 3. Run Frontend
```bash
cd frontend
cp .env.example .env.local  # edit if needed
npm install
npm run dev
```

## Production Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for full deployment guide.

**Quick overview:**
1. EC2 with Docker
2. Clone repo → `/opt/movie-streaming-web`
3. Copy `deploy/ec2/` files → `/opt/movie-service/`
4. Create `.env` from `.env.example`
5. Run `deploy.sh`

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Environment Variables](docs/ENVIRONMENT.md)

## Key Features

- 🎬 Movie listing, search, streaming
- 💬 AI chatbot with movie recommendations (RAG)
- 👤 User auth (JWT)
- ⭐ Ratings & comments
- 📋 Watch history & favorites
- 🔒 Admin dashboard
- 📊 Analytics