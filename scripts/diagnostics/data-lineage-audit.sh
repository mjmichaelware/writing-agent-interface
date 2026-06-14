#!/usr/bin/env bash
set -e

mkdir -p reports

echo "=== TREE SOURCES ===" | tee reports/data-lineage-audit.txt
find public src/data src/data-layer supabase -maxdepth 5 -type f 2>/dev/null | sort | tee -a reports/data-lineage-audit.txt

echo "" | tee -a reports/data-lineage-audit.txt
echo "=== ROUTES TOUCHING DATA ===" | tee -a reports/data-lineage-audit.txt
find src/app/api -name route.ts | sort | tee -a reports/data-lineage-audit.txt

echo "" | tee -a reports/data-lineage-audit.txt
echo "=== CHAPTER SOURCE REFERENCES ===" | tee -a reports/data-lineage-audit.txt
grep -RIn \
  --exclude-dir=node_modules \
  --exclude-dir=.next \
  --exclude-dir=.git \
  -E "public/data/chapters|chapters|paragraphs|chapter7|chapter_?id|fileService|readFile|fs\\.|supabase" \
  src public supabase scripts 2>/dev/null | tee reports/chapter-source-references.txt

echo "" | tee -a reports/data-lineage-audit.txt
echo "=== EMPTY PANEL REFERENCES ===" | tee -a reports/data-lineage-audit.txt
grep -RIn \
  --exclude-dir=node_modules \
  --exclude-dir=.next \
  --exclude-dir=.git \
  -E "biblical_references|hyperlinks|archetype|parallelism|dualism|No biblical references|No archetype|0 nodes|0 connections" \
  src supabase scripts 2>/dev/null | tee reports/derived-panel-references.txt

echo "" | tee -a reports/data-lineage-audit.txt
echo "=== INGESTION / HASH REFERENCES ===" | tee -a reports/data-lineage-audit.txt
grep -RIn \
  --exclude-dir=node_modules \
  --exclude-dir=.next \
  --exclude-dir=.git \
  -E "hash|sha|digest|embedding|token|tokenize|ingest|upsert|insert|parse|extract|reference|hyperlink" \
  src scripts supabase 2>/dev/null | tee reports/ingestion-hash-references.txt

echo "" | tee -a reports/data-lineage-audit.txt
echo "=== RAW GOOGLE DRIVE CORPUS COUNTS ===" | tee -a reports/data-lineage-audit.txt
find docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw -type f 2>/dev/null | wc -l | tee -a reports/data-lineage-audit.txt

echo "" | tee -a reports/data-lineage-audit.txt
echo "=== FINAL PUBLIC CHAPTER COUNTS ===" | tee -a reports/data-lineage-audit.txt
find public/data/chapters -type f 2>/dev/null | sort | tee -a reports/data-lineage-audit.txt

echo ""
echo "Wrote reports:"
ls -la reports
