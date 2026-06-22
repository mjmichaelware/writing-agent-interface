#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

cd /data/data/com.termux/files/home/Workspaces/Hybrid/writing-agent-interface || exit 1

PR_NUM=24

echo "===== MERGE PR $PR_NUM ====="
gh pr merge "$PR_NUM" --squash --delete-branch || gh pr merge "$PR_NUM" --squash

echo
echo "===== VERIFY PR MERGED ====="
gh pr view "$PR_NUM" --json number,state,url,mergeCommit \
  --jq '{number,state,url,mergeCommit:.mergeCommit.oid}'

echo
echo "===== FETCH MASTER ====="
git fetch origin
gh repo view --json defaultBranchRef --jq '.defaultBranchRef.name'

echo
echo "===== APPLY EXPANDED RUNTIME MIGRATION ON MASTER ====="
MIG_OUT="$PWD/.audit_tmp/pr24_migration_dispatch.out"
rm -f "$MIG_OUT"
gh workflow run apply-selected-xml-meaning-span-migration.yml --ref master | tee "$MIG_OUT"

sleep 5
MIG_RUN_ID="$(grep -Eo 'actions/runs/[0-9]+' "$MIG_OUT" | tail -n1 | cut -d/ -f3 || true)"
if [ -z "${MIG_RUN_ID}" ]; then
  MIG_RUN_ID="$(gh run list \
    --workflow apply-selected-xml-meaning-span-migration.yml \
    --branch master \
    --event workflow_dispatch \
    --limit 1 \
    --json databaseId \
    --jq '.[0].databaseId')"
fi

echo "MIG_RUN_ID=$MIG_RUN_ID"
test -n "$MIG_RUN_ID"

gh run watch "$MIG_RUN_ID"

echo
echo "===== MIGRATION STATUS ====="
gh run view "$MIG_RUN_ID" --json status,conclusion,url \
  --jq '{status,conclusion,url}'

echo
echo "===== SUBMIT FULL OPENAI BATCH ON MASTER ====="
RUN_OUT="$PWD/.audit_tmp/pr24_full_batch_dispatch.out"
rm -f "$RUN_OUT"
gh workflow run semantic-selected-xml-write.yml \
  -f batch_action=submit_batch \
  -f provider=openai_batch \
  -f model=gpt-4.1-mini \
  -f batch_size=1 \
  -f full_run_confirm=true \
  -f apply_migration_first=false \
  --ref master | tee "$RUN_OUT"

sleep 5
RUN_ID="$(grep -Eo 'actions/runs/[0-9]+' "$RUN_OUT" | tail -n1 | cut -d/ -f3 || true)"
if [ -z "${RUN_ID}" ]; then
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
echo "===== FULL BATCH SUBMIT STATUS ====="
gh run view "$RUN_ID" --json status,conclusion,url \
  --jq '{status,conclusion,url}'

echo
echo "===== DOWNLOAD BATCH SUBMIT ARTIFACTS ====="
OUT="$PWD/.audit_tmp/run-$RUN_ID"
rm -rf "$OUT"
mkdir -p "$OUT"
gh run download "$RUN_ID" -D "$OUT" || true

echo
echo "===== FIND BATCH IDS / FILE IDS ====="
grep -RInE \
  'batch_id|input_file_id|output_file_id|error_file_id|custom_id|openai_batch|submit_batch|/v1/batches|file-' \
  "$OUT" 2>/dev/null | sed -n '1,260p' || true
