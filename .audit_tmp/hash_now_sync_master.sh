#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

cd /data/data/com.termux/files/home/Workspaces/Hybrid/writing-agent-interface || exit 1

echo "===== HASH NOW: OPENAI SYNC FULL RUN ON MASTER ====="
RUN_OUT="$PWD/.audit_tmp/hash_now_sync_master.out"
rm -f "$RUN_OUT"

gh workflow run semantic-selected-xml-write.yml \
  -f batch_action=sync_write \
  -f provider=openai_sync \
  -f model=gpt-4.1-mini \
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

echo
echo "===== WATCH HASH RUN ====="
gh run watch "$RUN_ID"

echo
echo "===== FINAL HASH STATUS ====="
gh run view "$RUN_ID" --json status,conclusion,url \
  --jq '{status,conclusion,url}'

echo
echo "===== DOWNLOAD HASH ARTIFACTS ====="
OUT="$PWD/.audit_tmp/run-$RUN_ID"
rm -rf "$OUT"
mkdir -p "$OUT"
gh run download "$RUN_ID" -D "$OUT" || true

echo
echo "===== IMPORT / WRITE SIGNALS ====="
grep -RInE \
  'inserted|upserted|semantic_meaning_spans|semantic_crosslinks|semantic_biblical_anchors|semantic_archetype_anchors|semantic_run_artifacts|row_count|completed|success|fail_fast|error|OpenAI API error' \
  "$OUT" 2>/dev/null | sed -n '1,260p' || true
