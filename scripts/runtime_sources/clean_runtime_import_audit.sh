#!/usr/bin/env bash
set -euo pipefail
mkdir -p reports/runtime_sources

{
  echo "# Clean Runtime Source Import Audit"
  echo
  echo "Generated: $(date)"
  echo
  echo "This excludes generated reports and copied runtime-source data so we only see real code/script references."
  echo
  grep -RIn \
    --exclude-dir=node_modules \
    --exclude-dir=.git \
    --exclude-dir=.next \
    --exclude-dir=data/runtime_sources \
    --exclude-dir=data/source_corpus \
    --exclude-dir=reports \
    --exclude='*.log' \
    --exclude='*.json' \
    --exclude='*.md' \
    "src/data-layer/ingestion-buffer\|gdrive_raw\|readme_docs\|gdrive_ooxml_raw\|gdrive_docx_intake\|data/runtime_sources\|RUNTIME_SOURCE" \
    src scripts package.json next.config.* tsconfig.json 2>/dev/null || true
} > reports/runtime_sources/clean_runtime_import_audit.md

cat reports/runtime_sources/clean_runtime_import_audit.md
