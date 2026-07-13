#!/usr/bin/env bash
# ChillFilm Rollback Script
# Dùng khi cần rollback về commit trước

set -Eeuo pipefail

SOURCE_DIR="/opt/movie-streaming-web"
SERVICE_DIR="/opt/movie-service"
COMPOSE_FILE="$SERVICE_DIR/docker-compose.prod.yml"
LOG_FILE="$SERVICE_DIR/logs/rollback-$(date +%Y%m%d-%H%M%S).log"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"; }
err() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $*" | tee -a "$LOG_FILE"; }

mkdir -p "$SERVICE_DIR/logs"

if [ -z "${1:-}" ]; then
    log "Usage: $0 <git-commit-hash>"
    log "Example: $0 abc1234"
    log ""
    log "Recent commits:"
    cd "$SOURCE_DIR" && git log --oneline -10
    exit 1
fi

TARGET_COMMIT="$1"

log "=== ChillFilm Rollback to $TARGET_COMMIT ==="

# Checkout target commit
log "Checking out $TARGET_COMMIT..."
cd "$SOURCE_DIR"
git fetch origin
git checkout "$TARGET_COMMIT"

# Rebuild and restart
log "Rebuilding images for rollback commit..."
cd "$SERVICE_DIR"
docker compose -f "$COMPOSE_FILE" build backend rag-chatbot 2>&1 | tee -a "$LOG_FILE"
docker compose -f "$COMPOSE_FILE" up -d 2>&1 | tee -a "$LOG_FILE"

# Wait for health
for i in $(seq 1 20); do
    if curl -sf http://localhost:8080/api/actuator/health > /dev/null 2>&1; then
        log "Rollback successful! Backend is healthy."
        break
    fi
    if [ "$i" -eq 20 ]; then
        err "Rollback health check failed. Manual intervention required!"
        exit 1
    fi
    log "Waiting... ($i/20)"
    sleep 10
done

log "=== Rollback completed: $TARGET_COMMIT ==="
