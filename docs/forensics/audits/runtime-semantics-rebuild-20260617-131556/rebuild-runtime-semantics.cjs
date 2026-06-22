const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');

function loadDotEnv(path) {
  if (!fs.existsSync(path)) return;
  const lines = fs.readFileSync(path, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;
    const key = match[1];
    let value = match[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadDotEnv('.env.local');
loadDotEnv('.env');

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SERVICE_ROLE_KEY;
const runId = process.env.RUN_ID;
const model = process.env.ENRICHMENT_MODEL || 'gpt-4o-mini';
const batchSize = Number(process.env.ENRICHMENT_BATCH_SIZE || 12);
const maxParagraphs = Number(process.env.MAX_PARAGRAPHS || 0);

if (!supabaseUrl || !serviceRoleKey) throw new Error('Missing Supabase credentials');
if (!process.env.OPENAI_API_KEY) throw new Error('Missing OPENAI_API_KEY in shell, .env.local, or .env');

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchAllParagraphs() {
  const rows = [];
  const pageSize = 1000;

  for (let from = 0; ; from += pageSize) {
    const to = from + pageSize - 1;
    const { data, error } = await supabase
      .from('paragraphs')
      .select('id, chapter_id, chunk_index, content, metadata')
      .order('chapter_id', { ascending: true })
      .order('chunk_index', { ascending: true, nullsFirst: false })
      .range(from, to);

    if (error) throw new Error(`fetch paragraphs: ${error.message}`);

    rows.push(...(data || []));
    if (!data || data.length < pageSize) break;
  }

  return maxParagraphs > 0 ? rows.slice(0, maxParagraphs) : rows;
}

function clampNumber(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, Number(n.toFixed(4))));
}

function normalizeWeights(input, keys) {
  const out = {};
  for (const key of keys) out[key] = clampNumber(input?.[key] ?? 0);
  return out;
}

function normalizeBiblicalReferences(refs) {
  if (!Array.isArray(refs)) return [];

  const out = [];
  const seen = new Set();

  for (const ref of refs) {
    const reference_text = String(ref?.text || ref?.reference_text || '').trim();
    const book = String(ref?.book || '').trim();
    const chapter = ref?.chapter === null || ref?.chapter === undefined ? null : Number(ref.chapter);
    const verse = ref?.verse === null || ref?.verse === undefined ? null : Number(ref.verse);

    if (!reference_text && !book) continue;

    const row = {
      reference_text: reference_text || [book, chapter, verse].filter((v) => v !== null && v !== '').join(' '),
      book: book || null,
      chapter: Number.isFinite(chapter) ? chapter : null,
      verse: Number.isFinite(verse) ? verse : null,
    };

    const key = `${row.reference_text}|${row.book}|${row.chapter}|${row.verse}`;
    if (!seen.has(key)) {
      seen.add(key);
      out.push(row);
    }
  }

  return out.slice(0, 8);
}

function normalizeHyperlinks(links, archetypal_weights, dualism_map) {
  const out = [];
  const seen = new Set();

  if (Array.isArray(links)) {
    for (const link of links) {
      const theme_node_a = String(link?.theme_node_a || '').trim();
      const theme_node_b = String(link?.theme_node_b || '').trim();
      const link_type = String(link?.link_type || 'semantic').trim();

      if (!theme_node_a || !theme_node_b || theme_node_a === theme_node_b) continue;

      const weight = clampNumber(link?.weight ?? 0.5);
      const key = `${theme_node_a}|${theme_node_b}|${link_type}`;

      if (!seen.has(key)) {
        seen.add(key);
        out.push({ theme_node_a, theme_node_b, link_type, weight });
      }
    }
  }

  for (const [dualismKey, dualismValue] of Object.entries(dualism_map)) {
    for (const [archetypeKey, archetypeValue] of Object.entries(archetypal_weights)) {
      if (dualismValue <= 0 || archetypeValue <= 0) continue;
      const key = `${dualismKey}|${archetypeKey}|dualism_archetype`;
      if (seen.has(key)) continue;

      seen.add(key);
      out.push({
        theme_node_a: dualismKey,
        theme_node_b: archetypeKey,
        link_type: 'dualism_archetype',
        weight: clampNumber((dualismValue + archetypeValue) / 2),
      });
    }
  }

  return out.slice(0, 12);
}

async function enrichBatch(batch) {
  const payload = batch.map((p, index) => ({
    batch_index: index,
    paragraph_id: p.id,
    chunk_index: p.chunk_index,
    content: String(p.content || '').slice(0, 6000),
  }));

  const completion = await openai.chat.completions.create({
    model,
    temperature: 0.15,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content:
`You are a deterministic semantic enrichment engine for a literary runtime.

Return valid JSON only:
{
  "results": [
    {
      "batch_index": 0,
      "archetypal_weights": {
        "shadow": 0.0,
        "persona": 0.0,
        "anima": 0.0,
        "self": 0.0,
        "hero": 0.0
      },
      "dualism_map": {
        "sacred": 0.0,
        "descent": 0.0,
        "ascent": 0.0,
        "void": 0.0,
        "earth": 0.0,
        "sky": 0.0,
        "anger": 0.0,
        "mercy": 0.0,
        "memory": 0.0,
        "forgetting": 0.0,
        "exile": 0.0,
        "return": 0.0
      },
      "biblical_references": [
        { "text": "Genesis 1:2", "book": "Genesis", "chapter": 1, "verse": 2 }
      ],
      "hyperlinks": [
        { "theme_node_a": "descent", "theme_node_b": "ascent", "link_type": "dualism", "weight": 0.8 }
      ]
    }
  ]
}

Rules:
- Scores are 0.0 to 1.0.
- Include explicit biblical references only when the paragraph directly names, quotes, or strongly evokes a specific biblical book/chapter/verse.
- If no biblical reference is justified, return [].
- Hyperlinks are semantic links for graph/navigation, not web URLs.
- Do not use static keyword matching; infer from scene role, imagery, and narrative function.
- Preserve batch_index exactly.`
      },
      {
        role: 'user',
        content: JSON.stringify({ paragraphs: payload }),
      },
    ],
  });

  const text = completion.choices?.[0]?.message?.content || '{"results":[]}';
  const parsed = JSON.parse(text);
  return Array.isArray(parsed.results) ? parsed.results : [];
}

async function clearDerivedTables() {
  for (const table of ['biblical_references', 'hyperlinks']) {
    const { error } = await supabase.from(table).delete().not('id', 'is', null);
    if (error) throw new Error(`clear ${table}: ${error.message}`);
  }
}

async function insertRows(table, rows, size = 500) {
  let inserted = 0;

  for (let i = 0; i < rows.length; i += size) {
    const batch = rows.slice(i, i + size);
    if (!batch.length) continue;

    const { error } = await supabase.from(table).insert(batch);
    if (error) throw new Error(`insert ${table} at ${i}: ${error.message}`);

    inserted += batch.length;
  }

  return inserted;
}

async function updateParagraph(paragraph, enrichment) {
  const archetypal_weights = normalizeWeights(enrichment?.archetypal_weights, [
    'shadow',
    'persona',
    'anima',
    'self',
    'hero',
  ]);

  const dualism_map = normalizeWeights(enrichment?.dualism_map, [
    'sacred',
    'descent',
    'ascent',
    'void',
    'earth',
    'sky',
    'anger',
    'mercy',
    'memory',
    'forgetting',
    'exile',
    'return',
  ]);

  const metadata =
    paragraph.metadata && typeof paragraph.metadata === 'object' && !Array.isArray(paragraph.metadata)
      ? paragraph.metadata
      : {};

  const { error } = await supabase
    .from('paragraphs')
    .update({
      archetypal_weights,
      dualism_map,
      metadata: {
        ...metadata,
        semantic_rebuild_run_id: runId,
        semantic_rebuild_model: model,
        semantic_rebuild_at: new Date().toISOString(),
      },
    })
    .eq('id', paragraph.id);

  if (error) throw new Error(`update paragraph ${paragraph.id}: ${error.message}`);

  const biblical_references = normalizeBiblicalReferences(enrichment?.biblical_references).map((ref) => ({
    paragraph_id: paragraph.id,
    reference_text: ref.reference_text,
    book: ref.book,
    chapter: ref.chapter,
    verse: ref.verse,
  }));

  const hyperlinks = normalizeHyperlinks(enrichment?.hyperlinks, archetypal_weights, dualism_map).map((link) => ({
    paragraph_id: paragraph.id,
    theme_node_a: link.theme_node_a,
    theme_node_b: link.theme_node_b,
    link_type: link.link_type,
    weight: link.weight,
  }));

  return { biblical_references, hyperlinks };
}

async function countTable(table) {
  const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
  return error ? { error: error.message } : count;
}

async function main() {
  const before = {
    chapters: await countTable('chapters'),
    paragraphs: await countTable('paragraphs'),
    biblical_references: await countTable('biblical_references'),
    hyperlinks: await countTable('hyperlinks'),
  };

  const paragraphs = await fetchAllParagraphs();

  console.log(JSON.stringify({
    run_id: runId,
    mode: 'ai_runtime_semantic_rebuild_existing_paragraphs_only',
    model,
    batch_size: batchSize,
    paragraph_count: paragraphs.length,
    before,
  }, null, 2));

  await clearDerivedTables();

  let processed = 0;
  let referenceRows = [];
  let hyperlinkRows = [];

  for (let i = 0; i < paragraphs.length; i += batchSize) {
    const batch = paragraphs.slice(i, i + batchSize);

    let enriched;
    let attempt = 0;

    while (true) {
      try {
        enriched = await enrichBatch(batch);
        break;
      } catch (error) {
        attempt++;
        if (attempt >= 3) throw error;
        console.warn(`batch ${i} failed attempt ${attempt}: ${error.message}`);
        await sleep(1500 * attempt);
      }
    }

    const byIndex = new Map(enriched.map((item) => [Number(item.batch_index), item]));

    for (let j = 0; j < batch.length; j++) {
      const paragraph = batch[j];
      const result = await updateParagraph(paragraph, byIndex.get(j) || {});
      referenceRows.push(...result.biblical_references);
      hyperlinkRows.push(...result.hyperlinks);
      processed++;
    }

    if (referenceRows.length >= 500) {
      const inserted = await insertRows('biblical_references', referenceRows);
      console.log(`inserted biblical_references batch: ${inserted}`);
      referenceRows = [];
    }

    if (hyperlinkRows.length >= 500) {
      const inserted = await insertRows('hyperlinks', hyperlinkRows);
      console.log(`inserted hyperlinks batch: ${inserted}`);
      hyperlinkRows = [];
    }

    console.log(`processed ${processed}/${paragraphs.length}`);
    await sleep(250);
  }

  const finalReferences = await insertRows('biblical_references', referenceRows);
  const finalHyperlinks = await insertRows('hyperlinks', hyperlinkRows);

  const after = {
    chapters: await countTable('chapters'),
    paragraphs: await countTable('paragraphs'),
    biblical_references: await countTable('biblical_references'),
    hyperlinks: await countTable('hyperlinks'),
  };

  console.log(JSON.stringify({
    run_id: runId,
    complete: true,
    processed,
    final_reference_insert_batch: finalReferences,
    final_hyperlink_insert_batch: finalHyperlinks,
    after,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
