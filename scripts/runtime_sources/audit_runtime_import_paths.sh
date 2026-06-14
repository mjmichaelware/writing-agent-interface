#!/usr/bin/env bash
set -euo pipefail
mkdir -p reports/runtime_sources

{
  echo "# Runtime Source Import / Path Audit"
  echo
  echo "Generated: $(date)"
  echo
  echo "Finds every reference to old source paths and new active runtime paths."
  echo
  echo "## References"
  grep -RIn \
    --exclude-dir=node_modules \
    --exclude-dir=.git \
    --exclude-dir=.next \
    --exclude-dir=data/runtime_sources \
    --exclude='*.log' \
    --exclude='*.json' \
    "src/data-layer/ingestion-buffer\|gdrive_raw\|readme_docs\|gdrive_ooxml_raw\|gdrive_docx_intake\|data/runtime_sources\|SOURCE_RUNTIME" \
    . 2>/dev/null || true

  echo
  echo "## Counts"
  for d in \
    docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw \
    src/data-layer/ingestion-buffer/readme_docs \
    src/data-layer/ingestion-buffer/gdrive_docx_intake \
    src/data-layer/ingestion-buffer/gdrive_ooxml_raw \
    data/runtime_sources/weight_of_the_sky
  do
    if [ -d "$d" ]; then
      echo "- $d: $(find "$d" -type f | wc -l) files"
    else
      echo "- $d: missing"
    fi
  done
} > reports/runtime_sources/runtime_import_path_audit.md

cat reports/runtime_sources/runtime_import_path_audit.md
