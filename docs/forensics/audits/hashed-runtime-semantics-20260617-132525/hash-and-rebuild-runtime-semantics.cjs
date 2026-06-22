const fs = require('fs');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');

function loadDotEnv(path) {
  if (!fs.existsSync(path)) return;

  for (const line of fs.readFileSync(path, 'utf8').split(/\r?\n/)) {
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
const batchSize = Number(process.env.ENRICHMENT_BATCH_SIZE || 10);
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

function sha256(value) {
  return crypto.createHash('sha256').update(value, 'utf8').digest('hex');
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, val]) => [key, canonicalize(val)])
    );
  }

  return value;
}

function deterministicUuid(seed) {
  const hex = sha256(seed).slice(0, 32).split('');
  hex[12] = '5';
  hex[16] = ((parseInt(hex[16], 16) & 0x3) | 0x8).toString(16);
  const joined = hex.join('');

  return [
    joined.slice(0, 8),
    joined.slice(8, 12),
    joined.slice(12, 16),
    joined.slice(16, 20),
    joined.slice(20, 32),
  ].join('-');
}

function clamp(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, Number(n.toFixed(4))));
}

function normalizeWeights(input, keys) {
  const out = {};
  for (const key of keys) out[key] = clamp(input?.[key] ?? 0);
  return out;
}

function normalizeRefs(refs) {
  if (!Array.isArray(refs)) return [];

  const out = [];
  const seen = new Set();

  for (const ref of refs) {
    const reference_text = String(ref?.reference_text || ref?.text || '').trim();
    const book = String(ref?.book || '').trim();
    const chapterRaw = ref?.chapter;
    const verseRaw = ref?.verse;

    const chapter =
      chapterRaw === null || chapterRaw === undefined || chapterRaw === ''
        ? null
        : Number(chapterRaw);

    const verse =
      verseRaw === null || verseRaw === undefined || verseRaw === ''
        ? null
        : Number(verseRaw);

    if (!reference_text && !book) continue;

    const row = {
      reference_text: reference_text || [book, chapter, verse].filter((x) => x !== null && x !== '').join(' '),
      book: book || null,
      chapter: Number.isFinite(chapter) ? chapter : null,
      verse: Number.isFinite(verse) ? verse : null,
    };

    const key = JSON.stringify(row);
    if (!seen.has(key)) {
      seen.add(key);
      out.push(row);
    }
  }

  return out.slice(0, 10);
}

function normalizeLinks(links, archetypalWeights, dualismMap) {
  const out = [];
  const seen = new Set();

  const add = (theme_node_a, theme_node_b, link_type, weight) => {
    theme_node_a = String(theme_node_a || '').trim();
    theme_node_b = String(theme_node_b || '').trim();
    link_type = String(link_type || 'semantic').trim();

    if (!theme_node_a || !theme_node_b || theme_node_a === theme_node_b) return;

    const key = `${theme_node_a}|${theme_node_b}|${link_type}`;
    if (seen.has(key)) return;

    seen.add(key);
    out.push({
      theme_node_a,
      theme_node_b,
      link_type,
      weight: clamp(weight ?? 0.5),
    });
  };

  if (Array.isArray(links)) {
    for (const link of links) {
      add(link?.theme_node_a, link?.theme_node_b, link?.link_type || 'semantic', link?.weight ?? 0.5);
    }
  }

  for (const [dualism, dualismWeight] of Object.entries(dualismMap)) {
    for (const [archetype, archetypeWeight] of Object.entries(archetypalWeights)) {
      if (dualismWeight > 0 && archetypeWeight > 0) {
        add(dualism, archetype, 'dualism_archetype', (dualismWeight + archetypeWeight) / 2);
      }
    }
  }

  const dualismEntries = Object.entries(dualismMap).filter(([, weight]) => weight > 0);
  for (let i = 0; i < dualismEntries.length; i++) {
    for (let j = i + 1; j < dualismEntries.length; j++) {
      add(
        dualismEntries[i][0],
        dualismEntries[j][0],
        'dualism',
        (dualismEntries[i][1] + dualismEntries[j][1]) / 2
      );
    }
  }

  const archetypeEntries = Object.entries(archetypalWeights).filter(([, weight]) => weight > 0);
  for (let i = 0; i < archetypeEntries.length; i++) {
    for (let j = i + 1; j < archetypeEntries.length; j++) {
      add(
        archetypeEntries[i][0],
        archetypeEntries[j][0],
        'archetypal_resonance',
        (archetypeEntries[i][1] + archetypeEntries[j][1]) / 2
      );
    }
  }

  return out.slice(0, 16);
}

async function countTable(table) {
  const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
  return error ? { error: error.message } : count;
}

async function fetchAllParagraphs() {
  const rows = [];
  const pageSize = 1000;

  for (let from = 0; ; from += pageSize) {
    const to = from + pageSize - 1;

    const { data, error } = await supabase
      .from('paragraphs')
      .select('id, chapter_id, chunk_index, content, metadata, chapters:chapter_id(manifest_id, chapter_number, part_number)')
      .range(from, to);

    if (error) throw new Error(`fetch paragraphs: ${error.message}`);

    rows.push(...(data || []));
    if (!data || data.length < pageSize) break;
  }

  rows.sort((a, b) => {
    const ac = Array.isArray(a.chapters) ? a.chapters[0] : a.chapters;
    const bc = Array.isArray(b.chapters) ? b.chapters[0] : b.chapters;

    return (
      Number(ac?.chapter_number ?? 0) - Number(bc?.chapter_number ?? 0) ||
      Number(a.chunk_index ?? 0) - Number(b.chunk_index ?? 0) ||
      String(a.id).localeCompare(String(b.id))
    );
  });

  return maxParagraphs > 0 ? rows.slice(0, maxParagraphs) : rows;
}

async function enrichBatch(batch) {
  const payload = batch.map((p, index) => {
    const chapter = Array.isArray(p.chapters) ? p.chapters[0] : p.chapters;

    return {
      batch_index: index,
      paragraph_id: p.id,
      chapter_number: chapter?.chapter_number ?? null,
      manifest_id: chapter?.manifest_id ?? null,
      chunk_index: p.chunk_index,
      content_sha256: sha256(String(p.content || '')),
      content: String(p.content || '').slice(0, 6500),
    };
  });

  const completion = await openai.chat.completions.create({
    model,
    temperature: 0.1,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content:
`You are the semantic extraction engine for an interactive literary runtime.

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
        { "reference_text": "Genesis 1:2", "book": "Genesis", "chapter": 1, "verse": 2 }
      ],
      "hyperlinks": [
        { "theme_node_a": "descent", "theme_node_b": "ascent", "link_type": "dualism", "weight": 0.8 }
      ]
    }
  ]
}

Rules:
- Preserve batch_index exactly.
- Scores must be numbers from 0.0 to 1.0.
- Archetypes track scene function, not keyword counts.
- Dualism map tracks structural tensions used by an interactive panel graph.
- Biblical references must be specific when possible; return [] when a reference would be speculative.
- Hyperlinks are graph edges for the panel, not URLs.
- Prefer high-signal edges over many weak edges.
- Do not produce prose outside JSON.`
      },
      {
        role: 'user',
        content: JSON.stringify({ paragraphs: payload }),
      },
    ],
  });

  const raw = completion.choices?.[0]?.message?.content || '{"results":[]}';
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed.results) ? parsed.results : [];
}

async function clearDerivedTables() {
  for (const table of ['biblical_references', 'hyperlinks']) {
    const { error } = await supabase.from(table).delete().not('id', 'is', null);
    if (error) throw new Error(`clear ${table}: ${error.message}`);
  }
}

async function insertBatches(table, rows, size = 500) {
  let inserted = 0;

  for (let i = 0; i < rows.length; i += size) {
    const batch = rows.slice(i, i + size);
    if (!batch.length) continue;

    const { error } = await supabase.from(table).upsert(batch, { onConflict: 'id' });
    if (error) throw new Error(`upsert ${table} at ${i}: ${error.message}`);

    inserted += batch.length;
  }

  return inserted;
}

async function updateParagraphSemantic(paragraph, enrichment) {
  const content = String(paragraph.content || '');
  const contentSha256 = sha256(content);

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

  const biblicalRefs = normalizeRefs(enrichment?.biblical_references);
  const hyperlinks = normalizeLinks(enrichment?.hyperlinks, archetypal_weights, dualism_map);

  const relationSeed = {
    paragraph_id: paragraph.id,
    content_sha256: contentSha256,
    archetypal_weights,
    dualism_map,
    biblicalRefs,
    hyperlinks,
  };

  const semanticSha256 = sha256(JSON.stringify(canonicalize(relationSeed)));

  const biblicalReferenceRows = biblicalRefs.map((ref) => {
    const rowHash = sha256(JSON.stringify(canonicalize({
      paragraph_id: paragraph.id,
      content_sha256: contentSha256,
      reference_text: ref.reference_text,
      book: ref.book,
      chapter: ref.chapter,
      verse: ref.verse,
    })));

    return {
      id: deterministicUuid(`biblical_reference:${rowHash}`),
      paragraph_id: paragraph.id,
      reference_text: ref.reference_text,
      book: ref.book,
      chapter: ref.chapter,
      verse: ref.verse,
    };
  });

  const hyperlinkRows = hyperlinks.map((link) => {
    const rowHash = sha256(JSON.stringify(canonicalize({
      paragraph_id: paragraph.id,
      content_sha256: contentSha256,
      theme_node_a: link.theme_node_a,
      theme_node_b: link.theme_node_b,
      link_type: link.link_type,
      weight: link.weight,
    })));

    return {
      id: deterministicUuid(`hyperlink:${rowHash}`),
      paragraph_id: paragraph.id,
      theme_node_a: link.theme_node_a,
      theme_node_b: link.theme_node_b,
      link_type: link.link_type,
      weight: link.weight,
    };
  });

  const existingMetadata =
    paragraph.metadata && typeof paragraph.metadata === 'object' && !Array.isArray(paragraph.metadata)
      ? paragraph.metadata
      : {};

  const metadata = {
    ...existingMetadata,
    content_sha256: contentSha256,
    semantic_sha256: semanticSha256,
    semantic_hash_algorithm: 'sha256',
    semantic_hash_scope: 'paragraph_content_plus_runtime_semantics',
    runtime_semantics_run_id: runId,
    runtime_semantics_model: model,
    runtime_semantics_updated_at: new Date().toISOString(),
    biblical_reference_hashes: biblicalReferenceRows.map((row) => row.id),
    hyperlink_hashes: hyperlinkRows.map((row) => row.id),
  };

  const { error } = await supabase
    .from('paragraphs')
    .update({
      archetypal_weights,
      dualism_map,
      metadata,
    })
    .eq('id', paragraph.id);

  if (error) throw new Error(`update paragraph ${paragraph.id}: ${error.message}`);

  return {
    biblicalReferenceRows,
    hyperlinkRows,
  };
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
    mode: 'hash_existing_paragraphs_then_rebuild_runtime_semantics',
    model,
    batch_size: batchSize,
    max_paragraphs: maxParagraphs || null,
    before,
    paragraph_count_to_process: paragraphs.length,
  }, null, 2));

  await clearDerivedTables();

  let processed = 0;
  let allReferenceRows = [];
  let allHyperlinkRows = [];

  for (let i = 0; i < paragraphs.length; i += batchSize) {
    const batch = paragraphs.slice(i, i + batchSize);

    let enriched;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        enriched = await enrichBatch(batch);
        break;
      } catch (error) {
        if (attempt === 3) throw error;
        console.warn(`batch ${i} failed attempt ${attempt}: ${error.message}`);
        await sleep(1500 * attempt);
      }
    }

    const byIndex = new Map((enriched || []).map((item) => [Number(item.batch_index), item]));

    for (let j = 0; j < batch.length; j++) {
      const rows = await updateParagraphSemantic(batch[j], byIndex.get(j) || {});
      allReferenceRows.push(...rows.biblicalReferenceRows);
      allHyperlinkRows.push(...rows.hyperlinkRows);
      processed++;
    }

    if (allReferenceRows.length >= 500) {
      const inserted = await insertBatches('biblical_references', allReferenceRows);
      console.log(`upserted biblical_references: ${inserted}`);
      allReferenceRows = [];
    }

    if (allHyperlinkRows.length >= 500) {
      const inserted = await insertBatches('hyperlinks', allHyperlinkRows);
      console.log(`upserted hyperlinks: ${inserted}`);
      allHyperlinkRows = [];
    }

    console.log(`processed ${processed}/${paragraphs.length}`);
    await sleep(250);
  }

  const finalReferences = await insertBatches('biblical_references', allReferenceRows);
  const finalHyperlinks = await insertBatches('hyperlinks', allHyperlinkRows);

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
    final_reference_upsert_batch: finalReferences,
    final_hyperlink_upsert_batch: finalHyperlinks,
    after,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
