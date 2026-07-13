#!/usr/bin/env bash
# ChillFilm MySQL Backup Script

set -euo pipefail

SERVICE_DIR="/opt/movie-service"
BACKUP_DIR="$SERVICE_DIR/backups/mysql"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
MAX_BACKUPS=7

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }

mkdir -p "$BACKUP_DIR"

# Load env vars
if [ -f "$SERVICE_DIR/.env" ]; then
    set -a
    source <(grep -v '^#' "$SERVICE_DIR/.env" | grep -E '^(MYSQL_|DB_)')
    set +a
fi

DB_NAME="${MYSQL_DATABASE:-chillfilm}"
DB_USER="${MYSQL_USER:-chillfilm_user}"
MYSQL_CONTAINER=$(docker ps --filter "name=mysql" --format "{{.Names}}" | head -1)

if [ -z "$MYSQL_CONTAINER" ]; then
    log "ERROR: MySQL container not found!"
    exit 1
fi

log "Backing up database '$DB_NAME' from container '$MYSQL_CONTAINER'..."

BACKUP_FILE="$BACKUP_DIR/chillfilm-$TIMESTAMP.sql.gz"

# Dump without password in log
docker exec "$MYSQL_CONTAINER" sh -c \
    "exec mysqldump -u$DB_USER -p\"\$MYSQL_PASSWORD\" --single-transaction --quick --lock-tables=false $DB_NAME" \
    2>/dev/null | gzip > "$BACKUP_FILE"

log "Backup saved to: $BACKUP_FILE ($(du -sh $BACKUP_FILE | cut -f1))"

# Rotate: keep only MAX_BACKUPS
COUNT=$(ls -1 "$BACKUP_DIR"/*.sql.gz 2>/dev/null | wc -l)
if [ "$COUNT" -gt "$MAX_BACKUPS" ]; then
    TO_DELETE=$((COUNT - MAX_BACKUPS))
    ls -1t "$BACKUP_DIR"/*.sql.gz | tail -n "$TO_DELETE" | xargs rm -f
    log "Rotated: removed $TO_DELETE old backup(s), kept $MAX_BACKUPS."
fi

log "MySQL backup complete."
