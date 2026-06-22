#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

cd /data/data/com.termux/files/home/Workspaces/Hybrid/writing-agent-interface || exit 1

ATTEMPTS=8
SLEEP_SECONDS=240

for i in $(seq 1 "$ATTEMPTS"); do
  echo
  echo "===== SYNC HASH ATTEMPT $i / $ATTEMPTS ====="

  gh workflow run semantic-selected-xml-write.yml \
    -f batch_action=sync_write \
    -f provider=openai_sync \
    -f model=gpt-4.1-mini \
    -f batch_size=1 \
    -f full_run_confirm=true \
    -f apply_migration_first=false \
    --ref master

  sleep 5

  RUN_ID="$(gh run list \
    --workflow semantic-selected-xml-write.yml \
    --branch master \
    --event workflow_dispatch \
    --limit 1 \
    --json databaseId \
    --jq '.[0].databaseId')"

  echo "RUN_ID=$RUN_ID"

  gh run watch "$RUN_ID" || true

  STATUS="$(gh run view "$RUN_ID" --json conclusion --jq '.conclusion')"
  echo "STATUS=$STATUS"

  if [ "$STATUS" = "success" ]; then
    echo
    echo "===== HASH PASS SUCCEEDED ====="
    gh run view "$RUN_ID" --json status,conclusion,url \
      --jq '{status,conclusion,url}'
    exit 0
  fi

  echo
  echo "===== FAILED LOG TAIL ====="
  gh run view "$RUN_ID" --log-failed | tail -n 80 || true

  if [ "$i" -lt "$ATTEMPTS" ]; then
    echo
    echo "Sleeping $SLEEP_SECONDS seconds before retry..."
    sleep "$SLEEP_SECONDS"
  fi
done

echo
echo "===== ALL RETRIES USED ====="
exit 1
