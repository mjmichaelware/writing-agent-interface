#!/usr/bin/env bash
set -euo pipefail

cd /data/data/com.termux/files/home/Workspaces/Hybrid/writing-agent-interface || exit 1

PROJECT_REF="yegricugzqbmoziycfnt"
SUPABASE_URL="https://${PROJECT_REF}.supabase.co"
SUPABASE_ACCESS_TOKEN="${SUPABASE_ACCESS_TOKEN:-sbp_7dbb74da4c168efa276009d6edac20cf9959d620}"

OUT_DIR="docs/forensics/audits/hash-provenance-map-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$OUT_DIR"

command -v jq >/dev/null 2>&1 || pkg install -y jq

echo "[1] Local files that contain sha256/source provenance"
for f in \
  reports/runtime_sources/active_runtime_source_manifest.json \
  reports/ingestion-hash-references.txt \
  reports/chapter-source-references.txt \
  reports/xml_recovery/materialized_ooxml_manifest.json \
  reports/xml_recovery/source_xml_supabase_schema_proposal.sql
do
  if [ -f "$f" ]; then
    echo "FOUND $f"
  else
    echo "MISSING $f"
  fi
done | tee "$OUT_DIR/provenance-files-present.txt"

echo
echo "[2] Count local sha256 records by manifest/report"
{
  for f in \
    reports/runtime_sources/active_runtime_source_manifest.json \
    reports/ingestion-hash-references.txt \
    reports/chapter-source-references.txt \
    reports/xml_recovery/materialized_ooxml_manifest.json
  do
    if [ -f "$f" ]; then
      echo
      echo "===== $f ====="
      printf "sha256_count="
      grep -oE '"sha256"[[:space:]]*:[[:space:]]*"[^"]+"' "$f" 2>/dev/null | wc -l
      printf "unique_sha256_count="
      grep -oE '[a-f0-9]{64}' "$f" 2>/dev/null | sort -u | wc -l
      grep -oE '[a-f0-9]{64}' "$f" 2>/dev/null | sort -u | sed -n '1,20p'
    fi
  done
} | tee "$OUT_DIR/local-sha256-counts.txt"

echo
echo "[3] Extract active runtime source manifest summary"
if [ -f reports/runtime_sources/active_runtime_source_manifest.json ]; then
  node <<'NODE' | tee "docs/forensics/audits/hash-provenance-map-summary.tmp"
const fs = require('fs');
const p = 'reports/runtime_sources/active_runtime_source_manifest.json';
const raw = fs.readFileSync(p, 'utf8');
const data = JSON.parse(raw);

const records = Array.isArray(data) ? data : (
  Array.isArray(data.records) ? data.records :
  Array.isArray(data.files) ? data.files :
  Array.isArray(data.copied) ? data.copied :
  []
);

const byLabel = {};
for (const r of records) {
  const label = r.label || r.action || 'unknown';
  byLabel[label] ??= { count: 0, bytes: 0, sha256: new Set() };
  byLabel[label].count++;
  byLabel[label].bytes += Number(r.bytes || 0);
  if (r.sha256) byLabel[label].sha256.add(r.sha256);
}

const summary = {
  manifest: p,
  top_level_type: Array.isArray(data) ? 'array' : typeof data,
  record_count: records.length,
  labels: Object.fromEntries(
    Object.entries(byLabel).map(([k, v]) => [
      k,
      { count: v.count, bytes: v.bytes, unique_sha256: v.sha256.size },
    ])
  ),
  first_10: records.slice(0, 10).map((r) => ({
    label: r.label,
    source: r.source,
    dest: r.dest,
    bytes: r.bytes,
    sha256: r.sha256,
  })),
};

console.log(JSON.stringify(summary, null, 2));
NODE
  mv docs/forensics/audits/hash-provenance-map-summary.tmp "$OUT_DIR/active-runtime-source-summary.json"
  cat "$OUT_DIR/active-runtime-source-summary.json"
else
  echo "No active_runtime_source_manifest.json found"
fi

echo
echo "[4] Fetch Supabase service-role key through Management API"
KEYS_RAW="$OUT_DIR/supabase-api-keys.raw.json"
curl -fsS "https://api.supabase.com/v1/projects/${PROJECT_REF}/api-keys" \
  -H "Authorization: Bearer ${SUPABASE_ACCESS_TOKEN}" \
  -o "$KEYS_RAW"

SERVICE_ROLE_KEY="$(jq -r '
  if type == "array" then
    .[] | select((.name // .description // "" | ascii_downcase) | test("service")) | (.api_key // .apikey // .key // empty)
  else
    (.service_role // .service_role_key // .serviceRole // .api_keys[]? | select((.name // .description // "" | ascii_downcase) | test("service")) | (.api_key // .apikey // .key // empty))
  end
' "$KEYS_RAW" | head -1)"

[ -n "$SERVICE_ROLE_KEY" ] && [ "$SERVICE_ROLE_KEY" != "null" ] || {
  echo "FAILED: no service role key parsed"
  cat "$KEYS_RAW"
  exit 1
}
rm -f "$KEYS_RAW"
echo "service-role key loaded"

echo
echo "[5] Live Supabase schema/data audit for provenance/enrichment tables"
SUPABASE_URL="$SUPABASE_URL" SERVICE_ROLE_KEY="$SERVICE_ROLE_KEY" node <<'NODE' | tee "$OUT_DIR/live-schema-provenance-audit.json"
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const tables = [
  'chapters',
  'paragraphs',
  'biblical_references',
  'hyperlinks',
  'source_documents',
  'source_document_parts',
  'source_document_revisions',
  'runtime_sources',
];

const columnsByTable = {
  chapters: ['id', 'manifest_id', 'content_hash', 'source_hash', 'sha256', 'thematic_embedding'],
  paragraphs: ['id', 'content', 'content_hash', 'source_hash', 'sha256', 'embedding', 'archetypal_weights', 'dualism_map', 'hebrew_spans', 'metadata'],
  biblical_references: ['id', 'paragraph_id', 'reference_text', 'book', 'chapter', 'verse'],
  hyperlinks: ['id', 'paragraph_id', 'theme_node_a', 'theme_node_b', 'link_type', 'weight'],
  source_documents: ['id', 'source_kind', 'drive_file_id', 'original_name', 'current_docx_sha256'],
  source_document_parts: ['id', 'source_document_id', 'part_path', 'local_path', 'sha256', 'text_preview'],
  source_document_revisions: ['id', 'source_document_id', 'drive_revision_id', 'media_sha256'],
  runtime_sources: ['id', 'label', 'source', 'dest', 'sha256', 'metadata'],
};

async function count(table) {
  const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
  return { table, exists: !error, count: count ?? null, error: error?.message || null, code: error?.code || null };
}

async function probeColumn(table, column) {
  const { data, error } = await supabase.from(table).select(column).limit(1);
  return { table, column, exists: !error, sample: data || [], error: error?.message || null, code: error?.code || null };
}

async function main() {
  const out = { counts: [], columns: [] };

  for (const table of tables) out.counts.push(await count(table));

  for (const [table, columns] of Object.entries(columnsByTable)) {
    for (const column of columns) {
      out.columns.push(await probeColumn(table, column));
    }
  }

  console.log(JSON.stringify(out, null, 2));
}

main().catch((e) => {
  console.error(JSON.stringify({ fatal: e.message, stack: e.stack }, null, 2));
  process.exit(1);
});
NODE

echo
echo "[6] Human summary"
node - "$OUT_DIR/live-schema-provenance-audit.json" <<'NODE'
const fs = require('fs');
const audit = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));

const count = (t) => audit.counts.find((x) => x.table === t);
const col = (t, c) => audit.columns.find((x) => x.table === t && x.column === c);

for (const t of ['chapters','paragraphs','biblical_references','hyperlinks','source_documents','source_document_parts','runtime_sources']) {
  const x = count(t);
  console.log(`${t}: ${x?.exists ? x.count : 'MISSING'}${x?.error ? ` (${x.error})` : ''}`);
}

console.log('');
for (const [t, cols] of Object.entries({
  chapters: ['content_hash','source_hash','sha256'],
  paragraphs: ['content_hash','source_hash','sha256','embedding','archetypal_weights','dualism_map'],
  source_document_parts: ['sha256'],
  runtime_sources: ['sha256'],
})) {
  for (const c of cols) {
    const x = col(t, c);
    console.log(`${t}.${c}: ${x?.exists ? 'EXISTS' : 'MISSING'}`);
  }
}

console.log('');
console.log('Conclusion rule:');
console.log('- If source_document_parts/runtime_sources are MISSING or 0, file sha256 provenance was never loaded to Supabase.');
console.log('- If paragraphs content_hash/source_hash/sha256 are MISSING, paragraph hashes were never represented in live schema.');
console.log('- If biblical_references/hyperlinks are 0 or missing, enrichment was never loaded even though the pipeline code exists.');
NODE

echo
echo "[7] Audit written to:"
find "$OUT_DIR" -maxdepth 1 -type f -print
