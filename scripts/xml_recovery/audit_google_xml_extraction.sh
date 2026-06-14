#!/usr/bin/env bash
set -euo pipefail

mkdir -p reports/xml_recovery

OUT="reports/xml_recovery/google_xml_extraction_audit.md"

{
  echo "# Google XML / OOXML Extraction Audit"
  echo
  echo "Generated: $(date)"
  echo
  echo "## Local gdrive_raw text targets"
  echo
  if [ -d "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw" ]; then
    echo "- gdrive_raw file count: $(find docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw -type f | wc -l)"
  else
    echo "- gdrive_raw missing"
  fi
  echo
  echo "## Active XML folder"
  echo "- gdrive_ooxml_raw file count: $(find src/data-layer/ingestion-buffer/gdrive_ooxml_raw -type f 2>/dev/null | wc -l || echo 0)"
  echo
  echo "## Name-matched Google archive report"
  if [ -f "reports/name-matched-google-docs-archive-latest.json" ]; then
    cat reports/name-matched-google-docs-archive-latest.json
  else
    echo "- No latest Google archive report exists."
    echo "- Conclusion: Google export/extraction has not completed in this repo."
  fi
  echo
  echo "## Existing current.docx files"
  find data/source_archive/name_matched_google_docs -path '*/current/current.docx' -type f 2>/dev/null | sort || true
  echo
  echo "## Existing extracted OOXML folders"
  find data/source_archive/name_matched_google_docs -path '*/ooxml_current' -type d 2>/dev/null | sort || true
  echo
  echo "## Existing extracted XML files"
  find data/source_archive/name_matched_google_docs -path '*/ooxml_current/*' -type f 2>/dev/null | sort | head -300 || true
} > "$OUT"

cat "$OUT"
