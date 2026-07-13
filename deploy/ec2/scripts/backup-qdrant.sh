#!/usr/bin/env bash
# ChillFilm Qdrant Backup Script (via Snapshot API)

set -euo pipefail

SERVICE_DIR="/opt/movie-service"
BACKUP_DIR="$SERVICE_DIR/backups/qdrant"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
QDRANT_URL="http://localhost:6333"
COLLECTION="${QDRANT_COLLECTION:-chillfilm_movies}"
MAX_SNAPSHOTS=3

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }

mkdir -p "$BACKUP_DIR"

log "Creating Qdrant snapshot for collection: $COLLECTION"

# Create snapshot
RESPONSE=$(curl -sf -X POST "$QDRANT_URL/collections/$COLLECTION/snapshots" \
    -H "Content-Type: application/json" 2>&1)

if [ $? -ne 0 ]; then
    log "ERROR: Failed to create Qdrant snapshot. Is Qdrant running?"
    exit 1
fi

SNAPSHOT_NAME=$(echo "$RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin)['result']['name'])" 2>/dev/null || echo "")

if [ -z "$SNAPSHOT_NAME" ]; then
    log "ERROR: Could not parse snapshot name from response: $RESPONSE"
    exit 1
fi

log "Snapshot created: $SNAPSHOT_NAME"

# Download snapshot
DOWNLOAD_FILE="$BACKUP_DIR/$COLLECTION-$TIMESTAMP.snapshot"
curl -sf "$QDRANT_URL/collections/$COLLECTION/snapshots/$SNAPSHOT_NAME" \
    -o "$DOWNLOAD_FILE"

log "Snapshot downloaded to: $DOWNLOAD_FILE ($(du -sh $DOWNLOAD_FILE | cut -f1))"

# Rotate old snapshots
COUNT=$(ls -1 "$BACKUP_DIR"/*.snapshot 2>/dev/null | wc -l)
if [ "$COUNT" -gt "$MAX_SNAPSHOTS" ]; then
    TO_DELETE=$((COUNT - MAX_SNAPSHOTS))
    ls -1t "$BACKUP_DIR"/*.snapshot | tail -n "$TO_DELETE" | xargs rm -f
    log "Rotated: removed $TO_DELETE old snapshot(s), kept $MAX_SNAPSHOTS."
fi

log "Qdrant backup complete. Collection '$COLLECTION' preserved."
