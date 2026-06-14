#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail
set +H

DEST="${1:-data/source_archive/drive_temporal_xml_reextract/20260614_015110_local182_EXTRACT_UNITS_FULL}"
OUT="$DEST/supabase_manifest"
INDEX="$OUT/storage_shards/shard-index.tsv"

: "${SUPABASE_URL:?Set SUPABASE_URL first}"
: "${SUPABASE_SERVICE_ROLE_KEY:?Set SUPABASE_SERVICE_ROLE_KEY first}"

test -f "$INDEX" || { echo "Missing shard index: $INDEX"; exit 1; }

LOG="$OUT/storage_upload_only.log"
: > "$LOG"

tail -n +2 "$INDEX" | while IFS=$'\t' read -r batch_key source_rel shard_index shard_count bucket object_path local_path sha256 byte_size content_type; do
  printf 'uploading bucket=%s object=%s bytes=%s\n' "$bucket" "$object_path" "$byte_size" | tee -a "$LOG"

  encoded_path="$(python - <<PY
from urllib.parse import quote
print(quote("$object_path"))
PY
)"

  http_code="$(curl -sS \
    -o /tmp/nos_storage_upload_response.json \
    -w '%{http_code}' \
    -X POST \
    "$SUPABASE_URL/storage/v1/object/$bucket/$encoded_path" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
    -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Content-Type: $content_type" \
    -H "x-upsert: true" \
    --data-binary "@$local_path")"

  printf 'http_code=%s object=%s\n' "$http_code" "$object_path" | tee -a "$LOG"

  if [ "$http_code" -lt 200 ] || [ "$http_code" -ge 300 ]; then
    cat /tmp/nos_storage_upload_response.json | tee -a "$LOG"
    echo "UPLOAD_FAILED object=$object_path"
    exit 1
  fi
done

printf 'upload_log=%s\n' "$LOG"
