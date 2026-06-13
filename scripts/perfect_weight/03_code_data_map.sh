#!/usr/bin/env bash
set -euo pipefail
mkdir -p reports/perfect_weight
{
  echo "# Code/Data Map"
  echo
  echo "## Package Scripts"
  node -e 'const p=require("./package.json"); console.log(JSON.stringify(p.scripts||{},null,2))' || true
  echo
  echo "## API Routes"
  find src/app/api -type f 2>/dev/null | sort || true
  echo
  echo "## Components"
  find src/components -type f 2>/dev/null | sort || true
  echo
  echo "## Supabase Migrations"
  find supabase -type f 2>/dev/null | sort || true
  echo
  echo "## Data Field Grep"
  grep -RIn --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git \
    "archetypal_weights\|dualism_map\|hebrew_spans\|biblical_references\|hyperlinks\|paragraphs\|chapters" \
    src supabase scripts 2>/dev/null || true
} > reports/perfect_weight/03_code_data_map.md

