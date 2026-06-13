#!/usr/bin/env bash
set -euo pipefail
mkdir -p reports/perfect_weight
OUT="reports/perfect_weight/06_supabase_snapshot.md"
{
  echo "# Supabase Snapshot"
  echo
  echo "This script is read-only."
  echo
} > "$OUT"

DBURL="${DATABASE_URL:-}"
if [ -z "$DBURL" ] && command -v gcloud >/dev/null 2>&1; then
  DBURL="$(gcloud secrets versions access latest --project=ai-job-agent-498702 --secret=DATABASE_URL 2>/dev/null || true)"
fi

if [ -z "$DBURL" ]; then
  {
    echo "DATABASE_URL not available. Skipped DB snapshot."
  } >> "$OUT"
  exit 0
fi

{
  echo "## Table Counts"
  psql "$DBURL" -Atc "
    select 'documents=' || count(*) from public.documents
    union all select 'chapters=' || count(*) from public.chapters
    union all select 'paragraphs=' || count(*) from public.paragraphs
    union all select 'biblical_references=' || count(*) from public.biblical_references
    union all select 'hyperlinks=' || count(*) from public.hyperlinks;
  "
  echo
  echo "## Paragraph JSON Enrichment Counts"
  psql "$DBURL" -Atc "
    select 'has_archetypal_weights=' || count(*) from public.paragraphs where archetypal_weights <> '{}'::jsonb
    union all select 'has_dualism_map=' || count(*) from public.paragraphs where dualism_map <> '{}'::jsonb
    union all select 'has_hebrew_spans=' || count(*) from public.paragraphs where hebrew_spans <> '[]'::jsonb
    union all select 'has_metadata=' || count(*) from public.paragraphs where metadata <> '{}'::jsonb;
  "
} >> "$OUT"

