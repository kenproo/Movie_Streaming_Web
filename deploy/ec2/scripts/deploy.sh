#!/usr/bin/env bash
# ChillFilm Production Deploy Script
# Chạy từ: /opt/movie-service/scripts/deploy.sh

set -Eeuo pipefail

# ── Configuration ─────────────────────────────────────────────────────────────
SOURCE_DIR="/opt/movie-streaming-web"
SERVICE_DIR="/opt/movie-service"
BRANCH="production"
COMPOSE_FILE="$SERVICE_DIR/docker-compose.prod.yml"
LOG_FILE="$SERVICE_DIR/logs/deploy-$(date +%Y%m%d-%H%M%S).log"
BACKEND_HEALTH="http://localhost:8080/api/actuator/health"
RETRY_COUNT=30
RETRY_INTERVAL=10

# ── Colors ────────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] $*${NC}" | tee -a "$LOG_FILE"; }
warn() { echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARN: $*${NC}" | tee -a "$LOG_FILE"; }
err() { echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $*${NC}" | tee -a "$LOG_FILE"; }

# ── Rollback function ─────────────────────────────────────────────────────────
rollback() {
    err "Deploy failed! Initiating rollback..."
    if [ -f "$SERVICE_DIR/docker-compose.prod.yml.bak" ]; then
        cp "$SERVICE_DIR/docker-compose.prod.yml.bak" "$SERVICE_DIR/docker-compose.prod.yml"
    fi
    cd "$SERVICE_DIR"
    docker compose -f docker-compose.prod.yml up -d --no-build 2>&1 | tee -a "$LOG_FILE" || true
    err "Rollback attempted. Check logs: $LOG_FILE"
    exit 1
}

trap rollback ERR

# ── Preflight checks ──────────────────────────────────────────────────────────
log "=== ChillFilm Deploy Start ==="
mkdir -p "$SERVICE_DIR/logs"
mkdir -p "$SERVICE_DIR/backups/mysql"
mkdir -p "$SERVICE_DIR/backups/qdrant"

[ -f "$SERVICE_DIR/.env" ] || { err ".env file not found at $SERVICE_DIR/.env"; exit 1; }
[ -f "$COMPOSE_FILE" ] || { err "docker-compose.prod.yml not found"; exit 1; }

# ── Step 1: Fetch latest code ─────────────────────────────────────────────────
log "Step 1: Fetching latest code from GitHub..."
cd "$SOURCE_DIR"
git fetch origin
git checkout "$BRANCH"
git pull origin "$BRANCH"
log "Current commit: $(git rev-parse --short HEAD)"

# ── Step 2: Run backend tests ─────────────────────────────────────────────────
log "Step 2: Running backend tests..."
cd "$SOURCE_DIR/backend"
mvn clean test -q 2>&1 | tee -a "$LOG_FILE"
log "Backend tests passed."

# ── Step 3: Build frontend (validate only, Vercel deploys separately) ─────────
log "Step 3: Validating frontend build..."
cd "$SOURCE_DIR/frontend"
if command -v npm &>/dev/null; then
    npm ci --silent 2>&1 | tee -a "$LOG_FILE"
    npm run build --silent 2>&1 | tee -a "$LOG_FILE"
    log "Frontend build validated (not deployed from EC2)."
else
    warn "npm not found, skipping frontend validation."
fi

# ── Step 4: Backup MySQL before deploy ────────────────────────────────────────
log "Step 4: Backing up MySQL before deploy..."
"$SERVICE_DIR/scripts/backup-mysql.sh" 2>&1 | tee -a "$LOG_FILE"
log "MySQL backup completed."

# ── Step 5: Build Docker images ───────────────────────────────────────────────
log "Step 5: Building Docker images..."
cd "$SERVICE_DIR"
docker compose -f docker-compose.prod.yml build --no-cache backend rag-chatbot 2>&1 | tee -a "$LOG_FILE"
log "Docker images built."

# ── Step 6: Validate Compose config ──────────────────────────────────────────
log "Step 6: Validating Docker Compose config..."
docker compose -f docker-compose.prod.yml config > /dev/null
log "Compose config valid."

# ── Step 7: Start/update containers ──────────────────────────────────────────
log "Step 7: Starting containers..."
docker compose -f docker-compose.prod.yml up -d 2>&1 | tee -a "$LOG_FILE"

# ── Step 8: Wait for health check ────────────────────────────────────────────
log "Step 8: Waiting for backend health check..."
for i in $(seq 1 $RETRY_COUNT); do
    if curl -sf "$BACKEND_HEALTH" > /dev/null 2>&1; then
        log "Backend is healthy! (attempt $i/$RETRY_COUNT)"
        break
    fi
    if [ "$i" -eq "$RETRY_COUNT" ]; then
        err "Backend health check failed after $RETRY_COUNT attempts!"
        rollback
    fi
    warn "Waiting for backend... ($i/$RETRY_COUNT)"
    sleep "$RETRY_INTERVAL"
done

# ── Step 9: Cleanup old images ────────────────────────────────────────────────
log "Step 9: Cleaning up old Docker images (not volumes)..."
docker image prune -f 2>&1 | tee -a "$LOG_FILE"

# ── Done ──────────────────────────────────────────────────────────────────────
log "=== Deploy completed successfully ==="
log "Commit: $(cd $SOURCE_DIR && git rev-parse --short HEAD)"
log "Log: $LOG_FILE"
