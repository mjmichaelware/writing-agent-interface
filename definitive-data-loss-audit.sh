#!/usr/bin/env bash
set -euo pipefail

cd /data/data/com.termux/files/home/Workspaces/Hybrid/writing-agent-interface || exit 1

PROJECT_REF="yegricugzqbmoziycfnt"
SUPABASE_URL="https://${PROJECT_REF}.supabase.co"
SUPABASE_ACCESS_TOKEN="${SUPABASE_ACCESS_TOKEN:-sbp_7dbb74da4c168efa276009d6edac20cf9959d620}"

OUT_DIR="docs/forensics/audits/data-loss-audit-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$OUT_DIR"

command -v jq >/dev/null 2>&1 || pkg install -y jq

echo "[1] Confirm current git state"
git status --short | tee "$OUT_DIR/git-status.txt"
git log --oneline -8 | tee "$OUT_DIR/git-log.txt"

echo
echo "[2] Fetch Supabase service-role key through Management API, not Vercel env"
KEYS_JSON="$OUT_DIR/supabase-api-keys.redacted.json"
curl -fsS "https://api.supabase.com/v1/projects/${PROJECT_REF}/api-keys" \
  -H "Authorization: Bearer ${SUPABASE_ACCESS_TOKEN}" \
  -o "$KEYS_JSON.raw"

SERVICE_ROLE_KEY="$(jq -r '
  if type == "array" then
    .[] | select((.name // .description // "" | ascii_downcase) | test("service")) | (.api_key // .apikey // .key // empty)
  else
    (.service_role // .service_role_key // .serviceRole // .api_keys[]? | select((.name // .description // "" | ascii_downcase) | test("service")) | (.api_key // .apikey // .key // empty))
  end
' "$KEYS_JSON.raw" | head -1)"

[ -n "$SERVICE_ROLE_KEY" ] && [ "$SERVICE_ROLE_KEY" != "null" ] || {
  echo "FAILED: could not extract service-role key from Supabase Management API response"
  cat "$KEYS_JSON.raw"
  exit 1
}

jq 'walk(if type == "object" and has("api_key") then .api_key = "[REDACTED]" elif type == "object" and has("key") then .key = "[REDACTED]" else . end)' \
  "$KEYS_JSON.raw" > "$KEYS_JSON" || cp "$KEYS_JSON.raw" "$KEYS_JSON"
rm -f "$KEYS_JSON.raw"

echo "service-role key loaded from Management API"

echo
echo "[3] Live Supabase table/count/schema audit over REST client"
SUPABASE_URL="$SUPABASE_URL" SERVICE_ROLE_KEY="$SERVICE_ROLE_KEY" node > "$OUT_DIR/live-supabase-audit.json" <<'NODE'
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const tables = [
  'chapters',
  'paragraphs',
  'biblical_references',
  'hyperlinks',
  'runtime_sources',
  'documents',
  'corpus',
  'chapter_manifests',
  'ema_history',
];

async function countTable(table) {
  const { count, error } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: true });

  return {
    table,
    exists: !error,
    count: error ? null : count,
    error: error?.message || null,
    code: error?.code || null,
  };
}

async function sample(table, select = '*', limit = 3) {
  const { data, error } = await supabase.from(table).select(select).limit(limit);
  return {
    table,
    select,
    rows: data || [],
    error: error?.message || null,
    code: error?.code || null,
  };
}

async function countFilter(label, table, column, operator, value) {
  const query = supabase.from(table).select('*', { count: 'exact', head: true });
  const { count, error } = query.not(column, operator, value);
  return {
    label,
    table,
    column,
    count: error ? null : count,
    error: error?.message || null,
    code: error?.code || null,
  };
}

async function columnProbe(table, columns) {
  const out = [];
  for (const column of columns) {
    const { data, error } = await supabase.from(table).select(`id, ${column}`).limit(1);
    out.push({
      table,
      column,
      exists: !error,
      sample: data || [],
      error: error?.message || null,
      code: error?.code || null,
    });
  }
  return out;
}

async function main() {
  const result = {
    generated_at: new Date().toISOString(),
    project_ref: 'yegricugzqbmoziycfnt',
    counts: [],
    paragraph_enrichment_density: [],
    column_probes: [],
    samples: [],
  };

  for (const table of tables) {
    result.counts.push(await countTable(table));
  }

  result.paragraph_enrichment_density.push(
    await countFilter('paragraphs_with_dualism_map_nonempty', 'paragraphs', 'dualism_map', 'eq', '{}'),
    await countFilter('paragraphs_with_archetypal_weights_nonempty', 'paragraphs', 'archetypal_weights', 'eq', '{}'),
    await countFilter('paragraphs_with_hebrew_spans_nonempty', 'paragraphs', 'hebrew_spans', 'eq', '[]'),
    await countFilter('paragraphs_with_metadata_nonempty', 'paragraphs', 'metadata', 'eq', '{}')
  );

  result.column_probes.push(
    ...(await columnProbe('paragraphs', [
      'content_hash',
      'hash',
      'sha256',
      'checksum',
      'archetypal_weights',
      'dualism_map',
      'hebrew_spans',
      'metadata',
    ])),
    ...(await columnProbe('chapters', [
      'content_hash',
      'hash',
      'source_hash',
      'manifest_id',
      'thematic_embedding',
    ]))
  );

  result.samples.push(
    await sample('chapters', 'id, manifest_id, part_number, chapter_number, status'),
    await sample('paragraphs', 'id, chapter_id, chunk_index, content, archetypal_weights, dualism_map, hebrew_spans, metadata'),
    await sample('biblical_references'),
    await sample('hyperlinks')
  );

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(JSON.stringify({ fatal: error.message, stack: error.stack }, null, 2));
  process.exit(1);
});
NODE

cat "$OUT_DIR/live-supabase-audit.json"

echo
echo "[4] Local source/artifact audit: hashes, hyperlinks, biblical refs, enrichment"
{
  echo "===== schema/migrations ====="
  grep -RInE "CREATE TABLE|ALTER TABLE|biblical_references|hyperlinks|content_hash|source_hash|hash|sha256|checksum|dualism_map|archetypal_weights|hebrew_spans" \
    supabase src/lib src/app/api src/services 2>/dev/null || true

  echo
  echo "===== reports/docs/data artifacts ====="
  grep -RInE "biblical_references|biblical references|hyperlinks|cross-referenced|content_hash|source_hash|sha256|checksum|hash|dualism_map|archetypal_weights|hebrew_spans" \
    reports docs src/data src/data-layer public/data supabase 2>/dev/null \
    --exclude-dir=node_modules \
    --exclude-dir=.next \
    --exclude='*.png' \
    --exclude='*.jpg' \
    --exclude='*.jpeg' \
    --exclude='*.webp' \
    | sed -n '1,500p' || true
} | tee "$OUT_DIR/local-artifact-hits.txt"

echo
echo "[5] Specific high-value files"
for f in \
  reports/ingestion-hash-references.txt \
  reports/chapter-source-references.txt \
  reports/runtime_sources/active_runtime_source_manifest.json \
  reports/xml_recovery/source_xml_supabase_schema_proposal.sql \
  supabase/migrations/20260521000000_initial_schema.sql \
  supabase/migrations/20260521000002_seed_chapters.sql \
  supabase/functions/_shared/hash.ts \
  src/services/ingestion/pipeline.ts \
  src/services/memory-engine/vector-store.ts
do
  if [ -f "$f" ]; then
    echo
    echo "===== $f =====" | tee -a "$OUT_DIR/high-value-files.txt"
    sed -n '1,260p' "$f" | tee -a "$OUT_DIR/high-value-files.txt"
  fi
done

echo
echo "[6] Machine summary"
node - "$OUT_DIR/live-supabase-audit.json" <<'NODE'
const fs = require('fs');
const audit = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));

const count = (table) => audit.counts.find((x) => x.table === table);
const density = (label) => audit.paragraph_enrichment_density.find((x) => x.label === label);

console.log('LIVE_DB_COUNTS');
for (const table of ['chapters', 'paragraphs', 'biblical_references', 'hyperlinks']) {
  console.log(`${table}:`, count(table));
}

console.log('\nPARAGRAPH_ENRICHMENT');
for (const label of [
  'paragraphs_with_dualism_map_nonempty',
  'paragraphs_with_archetypal_weights_nonempty',
  'paragraphs_with_hebrew_spans_nonempty',
  'paragraphs_with_metadata_nonempty',
]) {
  console.log(`${label}:`, density(label));
}

console.log('\nCOLUMN_PROBES');
for (const probe of audit.column_probes) {
  console.log(`${probe.table}.${probe.column}: ${probe.exists ? 'EXISTS' : 'MISSING'} ${probe.error || ''}`);
}

console.log('\nINTERPRETATION');
console.log('- If paragraphs count is ~4500 but biblical_references/hyperlinks are 0 or missing, base manuscript ingestion ran but normalized enrichment did not land in this Supabase project.');
console.log('- If content_hash/hash/source_hash columns are missing, hashes were never represented in the live schema, even if local reports mention them.');
console.log('- If local-artifact-hits.txt contains hash/reference/hyperlink artifacts, the data is local/generated but not loaded into live Supabase.');
NODE

echo
echo "[7] Audit files written"
find "$OUT_DIR" -maxdepth 1 -type f -print
