#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail
set +H

: "${SUPABASE_DB_URL:?Set SUPABASE_DB_URL to your Supabase Postgres connection string with sslmode=require}"

MIG_DIR="${1:-supabase/migrations}"

command -v psql >/dev/null 2>&1 || {
  echo "psql missing. Install with: pkg install postgresql"
  exit 1
}

printf 'migration_dir=%s\n' "$MIG_DIR"
printf 'sql_files:\n'
ls -1 "$MIG_DIR"/*.sql

for sql in "$MIG_DIR"/*.sql; do
  printf '\nAPPLYING %s\n' "$sql"
  psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f "$sql"
done

printf '\nDONE applying SQL migrations through psql.\n'
