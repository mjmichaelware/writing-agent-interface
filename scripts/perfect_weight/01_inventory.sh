#!/usr/bin/env bash
set -euo pipefail
mkdir -p reports/perfect_weight
{
  echo "# Repo Inventory"
  echo
  echo "## Date"
  date
  echo
  echo "## Git Status"
  git status --short || true
  echo
  echo "## Root Files"
  find . -maxdepth 2 -type f \
    -not -path './node_modules/*' \
    -not -path './.git/*' \
    -not -path './.next/*' \
    | sort
  echo
  echo "## Source Context Files"
  find src/data-layer/ingestion-buffer/readme_docs -type f -printf '%p\t%s bytes\n' 2>/dev/null | sort || true
} > reports/perfect_weight/01_repo_inventory.md

find . -type f \
  -not -path './node_modules/*' \
  -not -path './.git/*' \
  -not -path './.next/*' \
  -printf '%p\t%s\n' 2>/dev/null \
  | sort > reports/perfect_weight/01_file_manifest.tsv

