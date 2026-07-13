#!/usr/bin/env bash
# ChillFilm Health Check Script

set -euo pipefail

BACKEND_URL="http://localhost:8080/api/actuator/health"
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'

check() {
    local name="$1"
    local cmd="$2"
    if eval "$cmd" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ $name${NC}"
        return 0
    else
        echo -e "${RED}✗ $name${NC}"
        return 1
    fi
}

echo "=== ChillFilm Health Check ==="
echo ""

# Docker container status
echo "--- Container Status ---"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "chillfilm|NAME" || true
echo ""

# Service health checks
echo "--- Service Health ---"
check "Backend API" "curl -sf $BACKEND_URL"
check "MySQL" "docker exec \$(docker ps -qf name=mysql) mysqladmin ping -h localhost --silent 2>/dev/null"
check "Qdrant" "curl -sf http://localhost:6333/healthz"
check "RAG Chatbot" "curl -sf http://localhost:8000/health"
echo ""

# Backend health response
echo "--- Backend Health Detail ---"
curl -sf "$BACKEND_URL" | python3 -m json.tool 2>/dev/null || echo "Cannot reach backend"
echo ""

echo "=== Health Check Complete ==="
