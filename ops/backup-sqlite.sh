#!/bin/sh
set -eu

DB_PATH="${1:-/opt/recruitmenttracker/data/sqlite.db}"
BACKUP_DIR="${2:-/opt/recruitmenttracker/backups}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"

if [ ! -f "$DB_PATH" ]; then
  echo "Database file not found: $DB_PATH" >&2
  exit 1
fi

mkdir -p "$BACKUP_DIR"

TIMESTAMP="$(date '+%Y-%m-%d_%H-%M-%S')"
BACKUP_FILE="$BACKUP_DIR/sqlite-$TIMESTAMP.db"

cp "$DB_PATH" "$BACKUP_FILE"
gzip -f "$BACKUP_FILE"

find "$BACKUP_DIR" -type f -name 'sqlite-*.db.gz' -mtime +"$RETENTION_DAYS" -delete

echo "Backup created: $BACKUP_FILE.gz"
