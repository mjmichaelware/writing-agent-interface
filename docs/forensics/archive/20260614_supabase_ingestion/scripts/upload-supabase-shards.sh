#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail
set +H

DEST="${1:-data/source_archive/drive_temporal_xml_reextract/20260614_015110_local182_EXTRACT_UNITS_FULL}"
OUT="$DEST/supabase_manifest"
INDEX="$OUT/storage_shards/shard-index.tsv"

: "${SUPABASE_URL:?Set SUPABASE_URL first}"
: "${SUPABASE_SERVICE_ROLE_KEY:?Set SUPABASE_SERVICE_ROLE_KEY first}"

test -f "$INDEX" || { echo "Missing shard index: $INDEX"; exit 1; }

LOG="$OUT/storage_upload.log"
: > "$LOG"

tail -n +2 "$INDEX" | while IFS=$'\t' read -r batch_key source_rel shard_index shard_count bucket object_path local_path sha256 byte_size content_type; do
  printf 'uploading bucket=%s object=%s bytes=%s\n' "$bucket" "$object_path" "$byte_size" | tee -a "$LOG"

  encoded_path="$(python - <<PY
from urllib.parse import quote
print(quote("$object_path"))
PY
)"

  curl -fsS \
    -X POST \
    "$SUPABASE_URL/storage/v1/object/$bucket/$encoded_path" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
    -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Content-Type: $content_type" \
    -H "x-upsert: false" \
    --data-binary "@$local_path" \
    >/tmp/nos_supabase_upload_response.json || {
      cat /tmp/nos_supabase_upload_response.json 2>/dev/null || true
      echo "UPLOAD_FAILED object=$object_path"
      exit 1
    }

  curl -fsS \
    -X POST \
    "$SUPABASE_URL/functions/v1/register-uploaded-artifact" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
    -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Content-Type: application/json" \
    --data "$(python - <<PY
import json
print(json.dumps({
  "batch_key": "$batch_key",
  "storage_prefix": "$batch_key",
  "bucket": "$bucket",
  "object_path": "$object_path",
  "local_rel_path": "$source_rel",
  "artifact_kind": "manifest_shard",
  "sha256_expected": "$sha256",
  "byte_size_expected": int("$byte_size"),
  "content_type": "$content_type",
  "enqueue_verify": True
}))
PY
)" \
    >> "$LOG"

  printf '\n' >> "$LOG"
done

printf 'upload_log=%s\n' "$LOG"
