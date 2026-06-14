#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail
set +H

: "${SUPABASE_URL:?Set SUPABASE_URL first}"
: "${SUPABASE_SERVICE_ROLE_KEY:?Set SUPABASE_SERVICE_ROLE_KEY first}"

BUCKET="${1:?bucket required}"
OBJECT_PATH="${2:?object_path required}"

curl -fsS \
  -X POST \
  "$SUPABASE_URL/functions/v1/verify-artifact-hash" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  --data "$(python - <<PY
import json
print(json.dumps({"bucket":"$BUCKET","object_path":"$OBJECT_PATH"}))
PY
)"
