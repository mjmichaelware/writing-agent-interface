#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

cd /data/data/com.termux/files/home/Workspaces/Hybrid/writing-agent-interface || exit 1

echo "===== SUBMIT SHARD 01 ====="
RUN_OUT="$PWD/.audit_tmp/shard01_submit.out"
rm -f "$RUN_OUT"

gh workflow run semantic-selected-xml-write.yml \
  -f batch_action=submit_batch \
  -f provider=openai_batch \
  -f model=gpt-4.1-mini \
  -f limit_docs=1 \
  -f limit=25 \
  -f batch_size=1 \
  -f full_run_confirm=true \
  -f apply_migration_first=false \
  --ref master | tee "$RUN_OUT"

sleep 5

RUN_ID="$(grep -Eo 'actions/runs/[0-9]+' "$RUN_OUT" | tail -n1 | cut -d/ -f3 || true)"
if [ -z "$RUN_ID" ]; then
  RUN_ID="$(gh run list \
    --workflow semantic-selected-xml-write.yml \
    --branch master \
    --event workflow_dispatch \
    --limit 1 \
    --json databaseId \
    --jq '.[0].databaseId')"
fi

echo "RUN_ID=$RUN_ID"
test -n "$RUN_ID"

gh run watch "$RUN_ID"

echo
echo "===== SHARD 01 STATUS ====="
gh run view "$RUN_ID" --json status,conclusion,url \
  --jq '{status,conclusion,url}'

echo
echo "===== DOWNLOAD SHARD 01 ARTIFACTS ====="
OUT="$PWD/.audit_tmp/run-$RUN_ID"
rm -rf "$OUT"
mkdir -p "$OUT"
gh run download "$RUN_ID" -D "$OUT" || true

echo
echo "===== SHARD 01 BATCH IDS ====="
grep -RInE \
  'batch_id|input_file_id|output_file_id|error_file_id|custom_id|submit_batch|openai_batch|/v1/batches|file-' \
  "$OUT" 2>/dev/null | sed -n '1,240p' || true
