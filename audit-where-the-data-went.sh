#!/usr/bin/env bash
set -euo pipefail

cd /data/data/com.termux/files/home/Workspaces/Hybrid/writing-agent-interface || exit 1

echo "[1] Git state and latest commits"
git status --short
git log --oneline -8

echo
echo "[2] Search local repo for enrichment/hash producers and deletion paths"
grep -RInE "biblical_references|hyperlinks|content_hash|hash|sha256|md5|archetypal_weights|dualism_map|hebrew_spans|DELETE FROM|TRUNCATE|clearParagraphs|insertParagraph|insertChapter" \
  src docs public data scripts package.json 2>/dev/null | sed -n '1,260p'

echo
echo "[3] List likely local data/artifact directories without flooding"
find . -maxdepth 4 -type f \
  \( -iname '*biblical*' -o -iname '*hyperlink*' -o -iname '*dualism*' -o -iname '*archetyp*' -o -iname '*hash*' -o -iname '*ema*' -o -iname '*chapter*' -o -iname '*manifest*' \) \
  -not -path './node_modules/*' \
  -not -path './.next/*' \
  -not -path './src/data-layer/ingestion-buffer/*' \
  -print | sed -n '1,260p'

echo
echo "[4] Query live Supabase through the already-configured Vercel production env"
vercel env run -e production -- node <<'NODE'
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SERVICE_ROLE_KEY ||
  process.env.SETVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase URL/key in Vercel production env');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function countTable(table) {
  const { count, error } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: true });

  if (error) {
    return { table, exists: false, error: error.message, code: error.code };
  }

  return { table, exists: true, count };
}

async function sample(table, select = '*') {
  const { data, error } = await supabase.from(table).select(select).limit(3);
  return { table, data, error: error ? { message: error.message, code: error.code } : null };
}

async function main() {
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

  console.log('COUNTS');
  for (const table of tables) {
    console.log(JSON.stringify(await countTable(table)));
  }

  console.log('\nPARAGRAPH ENRICHMENT DENSITY');

  const checks = [
    ['dualism_map_nonempty', "not.dualism_map.eq.{}"],
    ['archetypal_weights_nonempty', "not.archetypal_weights.eq.{}"],
    ['hebrew_spans_nonempty', "not.hebrew_spans.eq.[]"],
    ['metadata_nonempty', "not.metadata.eq.{}"],
  ];

  for (const [label, filter] of checks) {
    const [operator, expression] = filter.split('.', 2);
    void operator;
    const column = expression.split('.')[0];
  }

  const dualism = await supabase
    .from('paragraphs')
    .select('*', { count: 'exact', head: true })
    .not('dualism_map', 'eq', '{}');

  const archetypes = await supabase
    .from('paragraphs')
    .select('*', { count: 'exact', head: true })
    .not('archetypal_weights', 'eq', '{}');

  const hebrew = await supabase
    .from('paragraphs')
    .select('*', { count: 'exact', head: true })
    .not('hebrew_spans', 'eq', '[]');

  const metadata = await supabase
    .from('paragraphs')
    .select('*', { count: 'exact', head: true })
    .not('metadata', 'eq', '{}');

  console.log(JSON.stringify({
    dualism_map_nonempty: dualism.count,
    archetypal_weights_nonempty: archetypes.count,
    hebrew_spans_nonempty: hebrew.count,
    metadata_nonempty: metadata.count,
    errors: {
      dualism: dualism.error?.message || null,
      archetypes: archetypes.error?.message || null,
      hebrew: hebrew.error?.message || null,
      metadata: metadata.error?.message || null,
    }
  }, null, 2));

  console.log('\nSAMPLES');
  console.log(JSON.stringify(await sample('chapters', 'id, manifest_id, part_number, chapter_number, status'), null, 2));
  console.log(JSON.stringify(await sample('paragraphs', 'id, chapter_id, chunk_index, content, archetypal_weights, dualism_map, hebrew_spans, metadata'), null, 2));
  console.log(JSON.stringify(await sample('biblical_references'), null, 2));
  console.log(JSON.stringify(await sample('hyperlinks'), null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
NODE

echo
echo "[5] Inspect ingestion/service files most likely responsible"
for f in \
  src/services/ingestion/pipeline.ts \
  src/services/memory-engine/vector-store.ts \
  src/services/document-analyzer/corpus-searcher.ts \
  src/app/api/analyze-document/route.ts \
  src/app/api/biblical-references/route.ts \
  src/app/api/graph/route.ts
do
  if [ -f "$f" ]; then
    echo
    echo "===== $f ====="
    sed -n '1,260p' "$f"
  fi
done
