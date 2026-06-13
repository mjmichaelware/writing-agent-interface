#!/usr/bin/env bash
set -euo pipefail
mkdir -p reports/runtime_sources

CODE_REPORT="reports/runtime_sources/code_only_runtime_path_audit.md"
DOC_REPORT="reports/runtime_sources/document_mentions_legacy_paths_audit.md"

{
  echo "# Code-Only Runtime Path Audit"
  echo
  echo "Generated: $(date)"
  echo
  echo "This searches app/source/script config files only."
  echo "It excludes staged source documents, generated reports, runtime corpus copies, node_modules, .next, and .git."
  echo
  echo "## App code and script references"
  find src scripts supabase . \
    -type f \
    \( -name '*.ts' -o -name '*.tsx' -o -name '*.js' -o -name '*.jsx' -o -name '*.mjs' -o -name '*.cjs' -o -name '*.json' -o -name '*.sql' -o -name '*.sh' -o -name '*.py' -o -name 'package.json' -o -name 'next.config.*' -o -name 'tsconfig.json' \) \
    -not -path './node_modules/*' \
    -not -path './.git/*' \
    -not -path './.next/*' \
    -not -path './reports/*' \
    -not -path './data/runtime_sources/*' \
    -not -path './data/source_corpus/*' \
    -not -path './src/data-layer/ingestion-buffer/readme_docs/*' \
    -print0 2>/dev/null \
  | xargs -0 grep -nE "src/data-layer/ingestion-buffer|gdrive_raw|readme_docs|gdrive_ooxml_raw|gdrive_docx_intake|data/runtime_sources|RUNTIME_SOURCE" 2>/dev/null || true
} > "$CODE_REPORT"

{
  echo "# Document Mentions of Legacy Paths"
  echo
  echo "Generated: $(date)"
  echo
  echo "These are references inside staged documents. They are historical/source-context mentions, not necessarily app imports."
  echo
  grep -RIn \
    --exclude-dir=node_modules \
    --exclude-dir=.git \
    --exclude-dir=.next \
    "src/data-layer/ingestion-buffer\|gdrive_raw\|readme_docs\|gdrive_ooxml_raw\|gdrive_docx_intake" \
    src/data-layer/ingestion-buffer/readme_docs 2>/dev/null || true
} > "$DOC_REPORT"

echo "Wrote $CODE_REPORT"
echo "Wrote $DOC_REPORT"
echo
cat "$CODE_REPORT"
