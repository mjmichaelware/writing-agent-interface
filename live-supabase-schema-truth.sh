#!/usr/bin/env bash
set -u

cd /data/data/com.termux/files/home/Workspaces/Hybrid/writing-agent-interface || exit 1

PROJECT_REF="yegricugzqbmoziycfnt"
SUPABASE_URL="https://${PROJECT_REF}.supabase.co"
SUPABASE_ACCESS_TOKEN="${SUPABASE_ACCESS_TOKEN:-sbp_7dbb74da4c168efa276009d6edac20cf9959d620}"

OUT_DIR="docs/forensics/audits/live-schema-truth-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$OUT_DIR"

command -v jq >/dev/null 2>&1 || pkg install -y jq

echo "[1] Fetch service-role key from Supabase Management API"
KEYS_RAW="$OUT_DIR/supabase-api-keys.raw.json"
curl -fsS "https://api.supabase.com/v1/projects/${PROJECT_REF}/api-keys" \
  -H "Authorization: Bearer ${SUPABASE_ACCESS_TOKEN}" \
  -o "$KEYS_RAW" || exit 1

SERVICE_ROLE_KEY="$(jq -r '
  if type == "array" then
    .[] | select((.name // .description // "" | ascii_downcase) | test("service")) | (.api_key // .apikey // .key // empty)
  else
    (.service_role // .service_role_key // .serviceRole // .api_keys[]? | select((.name // .description // "" | ascii_downcase) | test("service")) | (.api_key // .apikey // .key // empty))
  end
' "$KEYS_RAW" | head -1)"

rm -f "$KEYS_RAW"

if [ -z "$SERVICE_ROLE_KEY" ] || [ "$SERVICE_ROLE_KEY" = "null" ]; then
  echo "FAILED: no service-role key parsed"
  exit 1
fi

echo "OK: service-role key loaded"

echo
echo "[2] Live Supabase schema/count/enrichment truth"
SUPABASE_URL="$SUPABASE_URL" SERVICE_ROLE_KEY="$SERVICE_ROLE_KEY" node <<'NODE' | tee "$OUT_DIR/live-schema-truth.json"
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

const probes = {
  chapters: ['id', 'manifest_id', 'content_hash', 'source_hash', 'sha256', 'thematic_embedding'],
  paragraphs: ['id', 'content', 'content_hash', 'source_hash', 'sha256', 'embedding', 'archetypal_weights', 'dualism_map', 'hebrew_spans', 'metadata'],
  biblical_references: ['id', 'paragraph_id', 'reference_text', 'book', 'chapter', 'verse'],
  hyperlinks: ['id', 'paragraph_id', 'theme_node_a', 'theme_node_b', 'link_type', 'weight'],
  source_documents: ['id', 'source_kind', 'drive_file_id', 'original_name', 'current_docx_sha256'],
  source_document_parts: ['id', 'source_document_id', 'part_path', 'local_path', 'sha256', 'text_preview'],
  source_document_revisions: ['id', 'source_document_id', 'drive_revision_id', 'media_sha256'],
  runtime_sources: ['id', 'label', 'source', 'dest', 'sha256', 'metadata'],
};

async function countTable(table) {
  const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
  return { table, exists: !error, count: count ?? null, error: error?.message || null, code: error?.code || null };
}

async function countNotEq(table, column, value) {
  const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true }).not(column, 'eq', value);
  return { table, column, value, count: count ?? null, error: error?.message || null, code: error?.code || null };
}

async function probeColumn(table, column) {
  const { data, error } = await supabase.from(table).select(column).limit(1);
  return { table, column, exists: !error, error: error?.message || null, code: error?.code || null, sample: data || [] };
}

async function sample(table, select) {
  const { data, error } = await supabase.from(table).select(select).limit(2);
  return { table, error: error?.message || null, code: error?.code || null, rows: data || [] };
}

async function main() {
  const counts = [];
  for (const table of tables) counts.push(await countTable(table));

  const columns = [];
  for (const [table, cols] of Object.entries(probes)) {
    for (const column of cols) columns.push(await probeColumn(table, column));
  }

  const enrichment = [
    await countNotEq('paragraphs', 'archetypal_weights', '{}'),
    await countNotEq('paragraphs', 'dualism_map', '{}'),
    await countNotEq('paragraphs', 'hebrew_spans', '[]'),
    await countNotEq('paragraphs', 'metadata', '{}'),
  ];

  const samples = [
    await sample('paragraphs', 'id, chunk_index, content, archetypal_weights, dualism_map, hebrew_spans, metadata'),
    await sample('biblical_references', '*'),
    await sample('hyperlinks', '*'),
  ];

  const out = { counts, columns, enrichment, samples };
  console.log(JSON.stringify(out, null, 2));

  const c = (table) => counts.find((x) => x.table === table);
  const col = (table, column) => columns.find((x) => x.table === table && x.column === column);

  console.error('');
  console.error('===== HUMAN SUMMARY =====');
  for (const table of tables) {
    const x = c(table);
    console.error(`${table}: ${x.exists ? x.count : 'MISSING'}${x.error ? ` -- ${x.error}` : ''}`);
  }

  console.error('');
  for (const [table, cols] of Object.entries({
    chapters: ['content_hash', 'source_hash', 'sha256'],
    paragraphs: ['content_hash', 'source_hash', 'sha256', 'embedding', 'archetypal_weights', 'dualism_map'],
    source_document_parts: ['sha256'],
    runtime_sources: ['sha256'],
  })) {
    for (const column of cols) {
      const x = col(table, column);
      console.error(`${table}.${column}: ${x.exists ? 'EXISTS' : 'MISSING'}${x.error ? ` -- ${x.error}` : ''}`);
    }
  }

  console.error('');
  console.error('ENRICHMENT COUNTS');
  for (const e of enrichment) {
    console.error(`${e.table}.${e.column} != ${e.value}: ${e.count}${e.error ? ` -- ${e.error}` : ''}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
NODE

echo
echo "[3] Saved audit file"
find "$OUT_DIR" -maxdepth 1 -type f -print
