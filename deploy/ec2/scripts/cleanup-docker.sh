#!/usr/bin/env bash
# ChillFilm Docker Cleanup Script
# Xóa image cũ nhưng KHÔNG xóa volume

set -euo pipefail

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }

log "=== Docker Cleanup (safe — volumes preserved) ==="

# Xóa stopped containers (không phải running)
DEAD_CONTAINERS=$(docker ps -aq --filter status=exited --filter status=dead 2>/dev/null || echo "")
if [ -n "$DEAD_CONTAINERS" ]; then
    log "Removing stopped containers..."
    echo "$DEAD_CONTAINERS" | xargs docker rm -f 2>/dev/null || true
fi

# Xóa dangling images chỉ (không phải tất cả)
log "Removing dangling images..."
docker image prune -f

# Xóa unused networks
log "Removing unused networks..."
docker network prune -f

# KHÔNG dùng docker system prune -a --volumes
log "=== Cleanup done. Volumes preserved. ==="

# Show disk usage
echo ""
log "Current Docker disk usage:"
docker system df
