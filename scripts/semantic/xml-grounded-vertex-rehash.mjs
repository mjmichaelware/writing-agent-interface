#!/usr/bin/env node
import { createHash } from "node:crypto";
import { readFileSync, existsSync, readdirSync, statSync, mkdirSync, writeFileSync } from "node:fs";
import { join, basename } from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();
const RUN_ID = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
const PROMPT_VERSION = "xml-grounded-semantic-v1";
const NARRATIVE_CONTEXT_SHA256 = "6e7e306c32940db56e82f1aff23942e6f3d62d7483db8e5735bb2ef2ef75eb8c";
const XML_MANIFEST_SHA256 = "6e74a501762c3368a6b3fd421c59d13e0c5da26b5b3e56b8729e0bf29163daf7";
const XML_MANIFEST_COUNT = 195;

const args = new Set(process.argv.slice(2));
const writeMode = args.has("--write");
const registerSources = args.has("--register-sources");
const noAi = args.has("--no-ai");

const limitArg = process.argv.find((x) => x.startsWith("--limit="));
const chapterArg = process.argv.find((x) => x.startsWith("--chapter="));
const batchArg = process.argv.find((x) => x.startsWith("--batch-size="));

const LIMIT = limitArg ? Number(limitArg.split("=")[1]) : null;
const CHAPTER_FILTER = chapterArg ? Number(chapterArg.split("=")[1]) : null;
const BATCH_SIZE = batchArg ? Number(batchArg.split("=")[1]) : 8;

const paths = {
  contextPack: join(ROOT, "docs/agent_context/source_drop/hasher_context_v1/narrative_context_pack_v1.txt"),
  xmlManifest: join(ROOT, "reports/xml_recovery/materialized_ooxml_manifest.json"),
  ooxmlRaw: join(ROOT, "src/data-layer/ingestion-buffer/gdrive_ooxml_raw"),
  publicChapters: join(ROOT, "public/data/chapters"),
  outDir: join(ROOT, "docs/forensics/audits/xml-grounded-vertex-rehash-runs", RUN_ID),
};

mkdirSync(paths.outDir, { recursive: true });

function sha256Text(text) {
  return createHash("sha256").update(text).digest("hex");
}

function sha256File(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function readText(path) {
  return readFileSync(path, "utf8");
}

function canonicalJson(value) {
  return JSON.stringify(sortObject(value));
}

function sortObject(value) {
  if (Array.isArray(value)) return value.map(sortObject);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, sortObject(value[key])]));
  }
  return value;
}

function clip(text, max = 12000) {
  const normalized = String(text || "").replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;
  return normalized.slice(0, max) + "\n[CLIPPED]";
}

function stripOoxml(xml) {
  return String(xml || "")
    .replace(/<w:tab\/>/g, "\t")
    .replace(/<\/w:p>/g, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s+/g, "\n")
    .trim();
}

function must(condition, message) {
  if (!condition) throw new Error(message);
}

function env(name, fallback = "") {
  return process.env[name] || fallback;
}

const SUPABASE_ACCESS_TOKEN = env("SUPABASE_ACCESS_TOKEN", env("SUPABASE_MANAGEMENT_TOKEN", ""));
const SUPABASE_PROJECT_REF = env("SUPABASE_PROJECT_REF", "yegricugzqbmoziycfnt");
const VERTEX_PROJECT_ID = env("VERTEX_PROJECT_ID", env("GCP_PROJECT_ID", ""));
const VERTEX_LOCATION = env("VERTEX_LOCATION", "us-central1");
const VERTEX_MODEL = env("VERTEX_MODEL", "gemini-2.5-pro");

function validateSources() {
  must(existsSync(paths.contextPack), `Missing context pack: ${paths.contextPack}`);
  must(existsSync(paths.xmlManifest), `Missing XML manifest: ${paths.xmlManifest}`);
  must(existsSync(paths.ooxmlRaw), `Missing OOXML raw root: ${paths.ooxmlRaw}`);
  must(existsSync(paths.publicChapters), `Missing public chapter corpus: ${paths.publicChapters}`);

  const contextSha = sha256File(paths.contextPack);
  const xmlSha = sha256File(paths.xmlManifest);
  const manifest = JSON.parse(readText(paths.xmlManifest));

  must(contextSha === NARRATIVE_CONTEXT_SHA256, `Context hash drift: ${contextSha}`);
  must(xmlSha === XML_MANIFEST_SHA256, `XML manifest hash drift: ${xmlSha}`);
  must(Array.isArray(manifest) && manifest.length === XML_MANIFEST_COUNT, `XML manifest count drift: ${manifest.length}`);

  return manifest;
}

function sqlText(value) {
  if (value === null || value === undefined) return "NULL";
  const s = String(value);
  const tag = `$txt_${sha256Text(s).slice(0, 16)}$`;
  return `${tag}${s}${tag}`;
}

function sqlUuid(value) {
  if (!value) return "NULL";
  return `${sqlText(value)}::uuid`;
}

function sqlJson(value) {
  const s = JSON.stringify(value ?? null);
  const tag = `$json_${sha256Text(s).slice(0, 16)}$`;
  return `${tag}${s}${tag}::jsonb`;
}

function sqlArrayUuid(values) {
  const safe = Array.isArray(values) ? values.filter(Boolean) : [];
  if (!safe.length) return "ARRAY[]::uuid[]";
  return `ARRAY[${safe.map(sqlUuid).join(", ")}]::uuid[]`;
}

function quoteIdent(name) {
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
    throw new Error(`Unsafe SQL identifier: ${name}`);
  }
  return `"${name}"`;
}

function normalizeManagementRows(json) {
  if (Array.isArray(json)) return json;
  if (Array.isArray(json?.result)) return json.result;
  if (Array.isArray(json?.data)) return json.data;
  if (Array.isArray(json?.rows)) return json.rows;
  if (json && typeof json === "object") return [json];
  return [];
}

async function managementQuery(sql) {
  must(SUPABASE_ACCESS_TOKEN, "Missing SUPABASE_ACCESS_TOKEN. Use a Supabase Management PAT/access token.");
  must(SUPABASE_PROJECT_REF, "Missing SUPABASE_PROJECT_REF.");

  const endpoint = `https://api.supabase.com/v1/projects/${SUPABASE_PROJECT_REF}/database/query`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SUPABASE_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: sql }),
  });

  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }

  if (!res.ok) {
    throw new Error(`Supabase Management API ${res.status}: ${text.slice(0, 1200)}`);
  }

  return normalizeManagementRows(json);
}

const TABLE_SCHEMAS = {
  source_documents: {
    source_kind: "text",
    source_path: "text",
    source_sha256: "text",
    title: "text",
    byte_count: "bigint",
    metadata: "jsonb",
  },
  semantic_runs: {
    status: "text",
    provider: "text",
    model: "text",
    prompt_version: "text",
    narrative_context_sha256: "text",
    xml_manifest_sha256: "text",
    xml_manifest_count: "int",
    source_summary: "jsonb",
    reset_policy: "text",
    completed_at: "timestamptz",
    error: "text",
    metadata: "jsonb",
  },
  archetype_observations: {
    paragraph_id: "uuid",
    semantic_run_id: "uuid",
    archetype: "text",
    subject_name: "text",
    movement_stage: "text",
    evidence_text: "text",
    interpretation: "text",
    confidence: "numeric",
    semantic_hash: "text",
    active: "boolean",
    metadata: "jsonb",
  },
  archetype_movements: {
    semantic_run_id: "uuid",
    subject_name: "text",
    arc_label: "text",
    from_state: "text",
    to_state: "text",
    start_paragraph_id: "uuid",
    end_paragraph_id: "uuid",
    evidence_summary: "text",
    interpretation: "text",
    confidence: "numeric",
    semantic_hash: "text",
    active: "boolean",
    metadata: "jsonb",
  },
  biblical_references: {
    paragraph_id: "uuid",
    semantic_run_id: "uuid",
    reference_text: "text",
    book: "text",
    chapter: "int",
    verse: "int",
    allusion_type: "text",
    evidence_text: "text",
    interpretation: "text",
    confidence: "numeric",
    source_label: "text",
    source_span: "jsonb",
    semantic_hash: "text",
    active: "boolean",
    metadata: "jsonb",
  },
  dualism_relations: {
    semantic_run_id: "uuid",
    relation_type: "text",
    shared_substrate: "text",
    pole_a: "jsonb",
    pole_b: "jsonb",
    interpretation: "text",
    confidence: "numeric",
    semantic_relation_sha256: "text",
    active: "boolean",
    metadata: "jsonb",
  },
  dualism_relation_evidence: {
    dualism_relation_id: "uuid",
    paragraph_id: "uuid",
    evidence_role: "text",
    evidence_text: "text",
    source_span: "jsonb",
    metadata: "jsonb",
  },
  hyperlinks: {
    paragraph_id: "uuid",
    semantic_run_id: "uuid",
    theme_node_a: "text",
    theme_node_b: "text",
    connection_type: "text",
    chapter_reference: "text",
    strength: "numeric",
    source_table: "text",
    source_id: "uuid",
    edge_type: "text",
    confidence: "numeric",
    semantic_hash: "text",
    active: "boolean",
    metadata: "jsonb",
  },
};

const PATCH_SCHEMAS = {
  paragraphs: {
    content_sha256: "text",
    source_document_part_id: "uuid",
    active_semantic_run_id: "uuid",
    archetypal_weights: "jsonb",
    dualism_map: "jsonb",
    metadata: "jsonb",
  },
  semantic_runs: TABLE_SCHEMAS.semantic_runs,
};

function parseTableArg(tableArg) {
  const [tableName, query = ""] = String(tableArg).split("?");
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) {
    throw new Error(`Unsafe table name: ${tableArg}`);
  }
  const params = new URLSearchParams(query);
  return {
    tableName,
    onConflict: params.get("on_conflict"),
  };
}

function coerceForSql(value, type) {
  if (value === undefined) return null;
  if (type === "jsonb") return value ?? {};
  if (type === "boolean") return Boolean(value);
  if (type === "numeric") return value === null || value === undefined || Number.isNaN(Number(value)) ? null : Number(value);
  if (type === "int" || type === "bigint") return value === null || value === undefined || Number.isNaN(Number(value)) ? null : Number(value);
  return value ?? null;
}

function jsonRecordsetType(cols, schema) {
  return cols.map((col) => `${quoteIdent(col)} ${schema[col]}`).join(", ");
}

async function fetchAll(table, select, order = "id.asc") {
  const pageSize = 1000;
  const rows = [];

  let baseSql = "";
  if (table === "chapters") {
    baseSql = `
      select id, manifest_id, chapter_number, part_number, status
      from public.chapters
      order by chapter_number asc nulls last, id asc
    `;
  } else if (table === "paragraphs") {
    baseSql = `
      select id, chapter_id, chunk_index, content, metadata
      from public.paragraphs
      order by chapter_id asc, chunk_index asc, id asc
    `;
  } else {
    throw new Error(`fetchAll does not allow table: ${table}`);
  }

  for (let offset = 0; ; offset += pageSize) {
    const sql = `${baseSql} limit ${pageSize} offset ${offset}`;
    const chunk = await managementQuery(sql);
    rows.push(...chunk);
    if (chunk.length < pageSize) break;
  }

  return rows;
}


const LIVE_TABLE_COLUMN_CACHE = new Map();

function schemaSqlLiteral(value) {
  return `'${String(value).replaceAll("'", "''")}'`;
}

async function getLiveTableColumnsForInsert(tableName) {
  if (LIVE_TABLE_COLUMN_CACHE.has(tableName)) return LIVE_TABLE_COLUMN_CACHE.get(tableName);

  const rows = await managementQuery(`
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = ${schemaSqlLiteral(tableName)}
  `);

  const cols = new Set((Array.isArray(rows) ? rows : []).map((row) => row.column_name).filter(Boolean));
  LIVE_TABLE_COLUMN_CACHE.set(tableName, cols);
  return cols;
}

async function normalizeRowsForLiveSchema(tableName, rows) {
  if (!rows?.length) return rows;

  const liveColumns = await getLiveTableColumnsForInsert(tableName);
  if (!liveColumns.size) return rows;

  const dropped = new Set();

  const normalized = rows.map((row) => {
    const next = {};
    const metadata = {
      ...(row.metadata && typeof row.metadata === "object" && !Array.isArray(row.metadata) ? row.metadata : {}),
    };

    if (tableName === "dualism_relations") {
      row = {
        ...row,
        relation_type: row.relation_type ?? row.axis ?? row.edge_type ?? "semantic_dualism",
        semantic_relation_sha256: row.semantic_relation_sha256 ?? row.semantic_hash,
        shared_substrate: row.shared_substrate ?? row.axis ?? null,
        interpretation: row.interpretation ?? row.analysis ?? null,
        pole_a: row.pole_a ?? { label: row.node_a ?? row.theme_node_a ?? null },
        pole_b: row.pole_b ?? { label: row.node_b ?? row.theme_node_b ?? null },
      };
    }

    if (tableName === "archetype_observations") {
      row = {
        ...row,
        subject_name: row.subject_name ?? row.character_name ?? row.character ?? null,
        movement_stage: row.movement_stage ?? row.phase ?? null,
        interpretation: row.interpretation ?? row.analysis ?? null,
      };
    }

    if (tableName === "archetype_movements") {
      row = {
        ...row,
        subject_name: row.subject_name ?? row.character_name ?? row.character ?? null,
        arc_label: row.arc_label ?? row.archetype ?? null,
        from_state: row.from_state ?? row.from_phase ?? null,
        to_state: row.to_state ?? row.to_phase ?? null,
        evidence_summary: row.evidence_summary ?? row.evidence_text ?? row.evidence ?? null,
        interpretation: row.interpretation ?? row.analysis ?? null,
      };
    }

    if (tableName === "biblical_references") {
      row = {
        ...row,
        reference_text: row.reference_text ?? row.reference ?? null,
        interpretation: row.interpretation ?? row.analysis ?? null,
      };
    }

    if (tableName === "hyperlinks") {
      row = {
        ...row,
        link_type: row.link_type ?? row.connection_type ?? row.edge_type ?? null,
      };
    }

    for (const [key, value] of Object.entries(row)) {
      if (liveColumns.has(key)) {
        next[key] = value;
      } else {
        dropped.add(key);
        metadata[`dropped_${key}`] = value;
      }
    }

    if (liveColumns.has("active") && (next.active === undefined || next.active === null)) {
      next.active = true;
    }

    if (liveColumns.has("metadata")) {
      next.metadata = {
        ...metadata,
        ...(next.metadata && typeof next.metadata === "object" && !Array.isArray(next.metadata) ? next.metadata : {}),
      };
    }

    return next;
  });

  if (dropped.size) {
    console.error(`schema-align: ${tableName} preserved unsupported insert keys in metadata: ${Array.from(dropped).sort().join(", ")}`);
  }

  return normalized;
}

async function insertRows(tableArg, rows, chunkSize = 100) {
  rows = await normalizeRowsForLiveSchema(tableArg, rows);


  if (tableArg === "archetype_observations") {
    rows = rows.map((row) => ({
      ...row,
      active: row.active ?? true,
    }));
  }


  if (!rows.length) return [];

  const { tableName, onConflict } = parseTableArg(tableArg);
  const schema = TABLE_SCHEMAS[tableName];
  if (!schema) throw new Error(`insertRows table not allowed: ${tableName}`);

  const out = [];
  const allCols = Object.keys(schema);

  for (let i = 0; i < rows.length; i += chunkSize) {
    const rawChunk = rows.slice(i, i + chunkSize);
    const chunk = rawChunk.map((row) => {
      const clean = {};
      for (const col of allCols) clean[col] = coerceForSql(row[col], schema[col]);
      return clean;
    });

    const json = sqlJson(chunk);
    const colList = allCols.map(quoteIdent).join(", ");
    const selectList = allCols.map(quoteIdent).join(", ");
    const recordsetType = jsonRecordsetType(allCols, schema);

    let conflictSql = "";
    if (onConflict) {
      if (!schema[onConflict]) throw new Error(`Invalid on_conflict column for ${tableName}: ${onConflict}`);
      const updateCols = allCols.filter((col) => col !== onConflict);
      conflictSql = `
        on conflict (${quoteIdent(onConflict)}) do update set
        ${updateCols.map((col) => `${quoteIdent(col)} = excluded.${quoteIdent(col)}`).join(",\n        ")}
      `;
    }

    const sql = `
      with input as (
        select *
        from jsonb_to_recordset(${json}) as x(${recordsetType})
      )
      insert into public.${quoteIdent(tableName)} (${colList})
      select ${selectList}
      from input
      ${conflictSql}
      returning *;
    `;

    const inserted = await managementQuery(sql);
    out.push(...inserted);
  }

  return out;
}

async function patchRow(tableName, id, body) {
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) throw new Error(`Unsafe table name: ${tableName}`);
  const schema = PATCH_SCHEMAS[tableName];
  if (!schema) throw new Error(`patchRow table not allowed: ${tableName}`);
  if (!id) throw new Error(`patchRow missing id for ${tableName}`);

  const cols = Object.keys(body).filter((col) => schema[col]);
  if (!cols.length) return [];

  const clean = {};
  for (const col of cols) clean[col] = coerceForSql(body[col], schema[col]);

  const recordType = cols.map((col) => `${quoteIdent(col)} ${schema[col]}`).join(", ");
  const assignments = cols.map((col) => `${quoteIdent(col)} = input.${quoteIdent(col)}`).join(",\n        ");

  const sql = `
    with input as (
      select *
      from jsonb_to_record(${sqlJson(clean)}) as x(${recordType})
    )
    update public.${quoteIdent(tableName)} as target
    set ${assignments}
    from input
    where target.id = ${sqlUuid(id)}
    returning target.*;
  `;

  return managementQuery(sql);
}

async function createSemanticRun(sourceSummary) {
  if (!writeMode) {
    return {
      id: `dry-run-${RUN_ID}`,
      status: "dry_run",
      provider: "vertex",
      model: VERTEX_MODEL,
      prompt_version: PROMPT_VERSION,
      narrative_context_sha256: NARRATIVE_CONTEXT_SHA256,
      xml_manifest_sha256: XML_MANIFEST_SHA256,
      xml_manifest_count: XML_MANIFEST_COUNT,
    };
  }

  const rows = await insertRows("semantic_runs", [{
    status: "running",
    provider: "vertex",
    model: VERTEX_MODEL,
    prompt_version: PROMPT_VERSION,
    narrative_context_sha256: NARRATIVE_CONTEXT_SHA256,
    xml_manifest_sha256: XML_MANIFEST_SHA256,
    xml_manifest_count: XML_MANIFEST_COUNT,
    source_summary: sourceSummary,
    reset_policy: "supersede_by_semantic_run_id",
    metadata: { run_id: RUN_ID, script: "scripts/semantic/xml-grounded-vertex-rehash.mjs", db_write_mode: "supabase_management_api" },
  }]);
  return rows[0];
}

function loadPublicChapters() {
  const files = readdirSync(paths.publicChapters)
    .filter((x) => x.endsWith(".txt"))
    .sort((a, b) => Number(a.replace(".txt", "")) - Number(b.replace(".txt", "")));

  return files.map((file) => {
    const chapterNumber = Number(file.replace(".txt", ""));
    const fullPath = join(paths.publicChapters, file);
    const content = readText(fullPath);
    return {
      chapter_number: chapterNumber,
      path: `public/data/chapters/${file}`,
      bytes: statSync(fullPath).size,
      sha256: sha256File(fullPath),
      content,
    };
  });
}

function relevantXmlEntriesForChapter(manifest, chapterNumber) {
  const n = String(chapterNumber);
  const needles = [
    `chapter_${n}`,
    `chapter ${n}`,
    `chapter:${n}`,
    `chapter_${n}_`,
    `chapter-${n}`,
    `ch${n}`,
    `${n}.txt`,
  ].map((x) => x.toLowerCase());

  return manifest.filter((entry) => {
    const hay = `${entry.source || ""} ${entry.dest || ""} ${entry.doc_folder || ""} ${entry.part_path || ""}`.toLowerCase();
    return needles.some((needle) => hay.includes(needle));
  }).slice(0, 16);
}

function loadXmlEvidence(entries, maxChars = 16000) {
  const fragments = [];
  for (const entry of entries) {
    const possible = [
      entry.dest,
      join("src/data-layer/ingestion-buffer/gdrive_ooxml_raw", entry.doc_folder || "", entry.part_path || ""),
      join("src/data-layer/ingestion-buffer/gdrive_ooxml_raw", entry.doc_folder || "", "word", "document.xml"),
    ].filter(Boolean);

    let found = null;
    for (const p of possible) {
      const full = p.startsWith("/") ? p : join(ROOT, p);
      if (existsSync(full)) {
        found = full;
        break;
      }
    }
    if (!found) continue;

    try {
      const text = stripOoxml(readText(found));
      if (text) {
        fragments.push({
          source: entry.source || entry.dest || found,
          part_path: entry.part_path || "",
          sha256: entry.sha256 || "",
          text: clip(text, 3500),
        });
      }
    } catch {
      continue;
    }

    if (fragments.map((f) => f.text).join("\n").length > maxChars) break;
  }
  return fragments;
}

function paragraphBatches(paragraphs) {
  const batches = [];
  for (let i = 0; i < paragraphs.length; i += BATCH_SIZE) {
    batches.push(paragraphs.slice(i, i + BATCH_SIZE));
  }
  return batches;
}

function normalizeContextSnippet(text) {
  return String(text || "")
    .replace(/\s+/g, " ")
    .trim();
}

function buildAvailableNarrativeContextMap(chapters) {
  const mapLines = [];

  for (const chapter of chapters) {
    let raw = "";
    try {
      raw = readText(chapter.path);
    } catch {
      raw = "";
    }

    const clean = normalizeContextSnippet(raw);
    const words = clean ? clean.split(/\s+/).filter(Boolean).length : 0;
    const opening = clean.slice(0, 900);
    const midpointStart = Math.max(0, Math.floor(clean.length / 2) - 450);
    const middle = clean.slice(midpointStart, midpointStart + 900);
    const ending = clean.slice(Math.max(0, clean.length - 900));

    mapLines.push([
      `CHAPTER ${chapter.chapter_number}`,
      `path=${chapter.path}`,
      `sha256=${chapter.sha256}`,
      `word_count=${words}`,
      `opening=${opening}`,
      `middle=${middle}`,
      `ending=${ending}`,
    ].join("\n"));
  }

  return mapLines.join("\n\n---\n\n");
}
function buildPrompt({ contextPack, availableNarrativeContextMap = "", chapter, xmlEvidence, paragraphs }) {
  return `
You are the XML-grounded semantic hasher for Michael Alonza P. Ware's "The Weight of the Sky".

You must use the NARRATIVE CONTEXT PACK as the interpretive lens, and the CHAPTER PROSE / XML EVIDENCE / LIVE PARAGRAPHS as evidence.

Definitions for this book:

DUALISM:
A conceptual mirror, inversion, opposition, or structural parallel between narrative objects. It is not a keyword pair.
Examples: high gods above vs low gods beneath; Dan shedding weight vs Aviel hoarding weight; ascent toward Hermon vs descent into Megiddo/Pit; Daniel/Love vs Beelzebub/consumption; Isabel born from hell but choosing forgiveness; same terrain seen as green pasture by one consciousness and gray pasture by another; loyal star-love multiplying vs resentful twin consuming brother.

ARCHETYPE:
A Jungian/mythic role or transformation movement. It is not a flat label.
Examples: Dan to Daniel as individuation, sacrifice, judge becoming judged; Aviel as wounded father/hoarder/restored witness; Zuna as mother-memory/stardust wisdom; Dagon as false abundance/death-raft; Beelzebub as consuming shadow; Isabel as hell-born shadow-child transformed into forgiveness; Rapha as giant/failed sky-bearer/threshold guardian transformed by hope; Sak as curiosity/witness.

BIBLICAL REFERENCE:
Direct, indirect, typological, symbolic, numerological, structural, or non-verbatim allusion. It may be layered and discreet.
Examples: Dagon before the Ark; Samson and Dagon's temple; Babel/confused tongues; Flood/giants/Anakim/Goliath/six fingers and toes; Daniel identity; Cain/Abel recurrence in the stars; pride as self-enclosed nothingness; Enoch/Elijah-like ascent/body-spirit preservation.

HYPERLINK:
A derived graph/display edge. It is not source truth. It must point back to a dualism, archetype, biblical reference, or paragraph relation.

Return strict JSON only with this shape:
{
  "paragraphs": [
    {
      "paragraph_id": "uuid",
      "content_sha256": "sha256",
      "archetypal_weights": {"shadow":0.0,"self":0.0},
      "dualism_map": {"ascent_descent":0.0},
      "metadata": {"summary":"", "semantic_notes": []},
      "archetype_observations": [
        {
          "archetype": "",
          "subject_name": "",
          "movement_stage": "",
          "evidence_text": "",
          "interpretation": "",
          "confidence": 0.0
        }
      ],
      "biblical_references": [
        {
          "reference_text": "",
          "book": "",
          "chapter": null,
          "verse": null,
          "allusion_type": "direct|typological|symbolic|numerological|structural|non_verbatim|image_based",
          "evidence_text": "",
          "interpretation": "",
          "confidence": 0.0
        }
      ],
      "derived_hyperlinks": [
        {
          "theme_node_a": "",
          "theme_node_b": "",
          "connection_type": "",
          "edge_type": "archetype|biblical|dualism|parallelism",
          "confidence": 0.0,
          "evidence_text": ""
        }
      ]
    }
  ],
  "dualism_relations": [
    {
      "relation_type": "",
      "shared_substrate": "",
      "pole_a": {"label":"", "paragraph_id":"", "description":""},
      "pole_b": {"label":"", "paragraph_id":"", "description":""},
      "interpretation": "",
      "confidence": 0.0,
      "evidence": [
        {"paragraph_id":"", "evidence_role":"pole_a|pole_b|bridge", "evidence_text":""}
      ],
      "derived_hyperlink": {
        "theme_node_a": "",
        "theme_node_b": "",
        "connection_type": "",
        "edge_type": "dualism",
        "confidence": 0.0
      }
    }
  ],
  "archetype_movements": [
    {
      "subject_name": "",
      "arc_label": "",
      "from_state": "",
      "to_state": "",
      "start_paragraph_id": "",
      "end_paragraph_id": "",
      "evidence_summary": "",
      "interpretation": "",
      "confidence": 0.0
    }
  ]
}

Rules:
- Do not invent chapter/prose evidence.
- Empty arrays are valid when no strong evidence exists.
- Prefer fewer high-confidence records over many weak records.
- Hyperlinks are derived; do not treat them as source truth.
- Dualisms can cross paragraphs and can use conceptual evidence, not exact repeated words.
- Biblical references can be non-verbatim, symbolic, typological, inverted, ironic, or paraphrased, but must explain why the allusion is valid.
- Actively detect implicit biblical allusions even when no book/chapter/verse is named.
- Creation-language rule: if prose describes primordial void, formlessness, darkness, deep water, potential before creation, speech creating reality, the first word, the Word, Truth spoken into being, light emerging, naming, breath, dust, or creation by divine utterance, consider Genesis 1:1-3, Genesis 1:2, John 1:1-5, Psalm 33:6, and related creation motifs where justified by evidence.
- Garden/serpent/fall rule: if prose describes serpents, patient serpents, a garden, temptation, knowledge, innocence, shame, nakedness, exile, forbidden desire, fruit, crawling things, or a fall from innocence, consider Genesis 2-3 where justified by evidence.
- Sacrifice rule: if prose describes offering, blood, altar, lamb, scapegoat, binding, substitution, atonement, burning, surrender, or living sacrifice, consider Genesis 22, Leviticus sacrificial patterns, Isaiah 53, Romans 12:1, and cruciform typology where justified by evidence.
- Exodus/wilderness rule: if prose describes desert wandering, thirst, bitter water, manna-like provision, testing, plague, bondage, liberation, pillar/fire/cloud, or crossing, consider Exodus/Numbers motifs where justified by evidence.
- Prophetic/apocalyptic rule: if prose describes beasts, pits, abyss, locusts/flies, seals, trumpets, judgment, cosmic signs, Megiddo, Babylon, new name, white stone, or final ascent/descent, consider Daniel, Revelation, Isaiah, Ezekiel, Zechariah, and apocalyptic typology where justified by evidence.
- Wisdom/Job rule: if prose describes suffering without explanation, accusation, dust, silence, cosmic courtroom, leviathan/behemoth, friends who fail, or the crushing weight of creation, consider Job/Ecclesiastes/Psalms wisdom motifs where justified by evidence.
- Gospel/Pauline rule: if prose describes flesh versus spirit, old self/new self, death-to-self, rebirth, baptismal descent/ascent, thorn, weakness/power, grace, law, bondage, or inner war, consider Romans, Galatians, Corinthians, Ephesians, John 3, and Pauline anthropology where justified by evidence.
- Name/word/truth rule: if prose emphasizes naming, renaming, hidden names, the New Name, the Word, Truth, Logos, voice, speech, silence, tongues, or language breaking, consider John 1, Genesis 11, Revelation 2:17, and biblical naming motifs where justified by evidence.
- Do not force a biblical reference. If the allusion is suggestive, include it with lower confidence and explain uncertainty.
- Every biblical reference must include direct evidence_text from the prose/XML/context that caused the inference.
- Archetype movement must track direction, not just label: descent, ascent, inversion, confrontation, sacrifice, purification, fragmentation, integration, death, rebirth, exile, return, judgment, revelation.
- Dualism extraction must look for active tensions: flesh/spirit, ascent/descent, truth/illusion, love/curiosity, speech/silence, void/creation, body/soul, judgment/mercy, knowledge/ignorance, bondage/liberation, self/shadow, garden/pit, innocence/corruption, hunger/sacrifice.
- Derived hyperlinks must connect recurring motifs, not only explicit links. Prefer named motifs from the context pack when evidence supports them: The Unmanifest, The Snare, Living Sacrifice, The Chaos, Aviel's Rot, The Pit, The Lord of the Flies, The Two Hundred Holes, The New Name, Internal War/Flesh and Spirit, Shekels/Gerah, Curiosity, Truth, Love.
- When cross-chapter continuity is inferred from the Available Narrative Context Map or the compendium/synopsis, state that it is contextual support; when evidence comes from the live paragraph, quote the paragraph evidence directly.

NARRATIVE CONTEXT PACK SHA256:
${NARRATIVE_CONTEXT_SHA256}

NARRATIVE CONTEXT PACK:
${clip(contextPack, 30000)}

AVAILABLE NARRATIVE CONTEXT MAP:
This is not the full manuscript text. It contains the available public chapter corpus:
chapters 1-11, chapter 13, and chapter 24/second-to-last.
Use this map together with the Master Compendium and New Synopsis in the narrative context pack
to infer cross-chapter continuity, archetype movement, dualisms, biblical allusions,
and thematic hyperlinks. Do not assume unavailable chapters are present verbatim.

${clip(availableNarrativeContextMap, 22000)}

CHAPTER:
${JSON.stringify({ chapter_number: chapter.chapter_number, path: chapter.path, sha256: chapter.sha256 })}

XML EVIDENCE:
${JSON.stringify(xmlEvidence, null, 2)}

LIVE PARAGRAPHS TO HASH:
${JSON.stringify(paragraphs.map((p) => ({
  paragraph_id: p.id,
  chapter_id: p.chapter_id,
  chunk_index: p.chunk_index,
  content_sha256: sha256Text(p.content || ""),
  content: p.content,
})), null, 2)}
`;
}

function getGcloudAccessToken() {
  if (process.env.GCLOUD_ACCESS_TOKEN) return process.env.GCLOUD_ACCESS_TOKEN;
  try {
    return execFileSync("gcloud", ["auth", "application-default", "print-access-token"], { encoding: "utf8" }).trim();
  } catch {
    return "";
  }
}

async function callVertex(prompt) {
  const stripFence = (raw) => String(raw || "")
    .trim()
    .replace(/^\s*```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();

  const balancedSlice = (raw) => {
    const text = stripFence(raw);
    const obj = text.indexOf("{");
    const arr = text.indexOf("[");
    const starts = [obj, arr].filter((x) => x >= 0);
    if (!starts.length) return text;

    const start = Math.min(...starts);
    const open = text[start];
    const close = open === "{" ? "}" : "]";
    let depth = 0;
    let inString = false;
    let escaped = false;

    for (let i = start; i < text.length; i++) {
      const ch = text[i];

      if (escaped) {
        escaped = false;
        continue;
      }

      if (ch === "\\") {
        escaped = true;
        continue;
      }

      if (ch === '"') {
        inString = !inString;
        continue;
      }

      if (inString) continue;

      if (ch === open) depth++;
      if (ch === close) depth--;

      if (depth === 0) return text.slice(start, i + 1);
    }

    return text.slice(start);
  };

  const cleanJson = (raw) => balancedSlice(raw)
    .replace(/,\s*([}\]])/g, "$1")
    .replace(/([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)(\s*:)/g, '$1"$2"$3');

  const parseModelJson = (raw) => {
    const attempts = [
      String(raw || ""),
      stripFence(raw),
      balancedSlice(raw),
      cleanJson(raw),
    ];

    for (const attempt of attempts) {
      try {
        return JSON.parse(attempt);
      } catch {}
    }

    return null;
  };

  const saveBadJson = async (raw, phase) => {
    const fs = await import("node:fs/promises");
    const path = await import("node:path");
    const crypto = await import("node:crypto");

    const dir = path.join("docs", "forensics", "audits", "vertex-bad-json");
    await fs.mkdir(dir, { recursive: true });

    const hash = crypto.createHash("sha256").update(String(raw || "")).digest("hex").slice(0, 16);
    const file = path.join(dir, `${new Date().toISOString().replace(/[:.]/g, "-")}-${phase}-${hash}.json`);

    await fs.writeFile(file, JSON.stringify({
      phase,
      model: VERTEX_MODEL,
      raw,
    }, null, 2), "utf-8");

    return file;
  };

  const extractCandidateText = (json) =>
    json?.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("") || "";

  const repairWithVertex = async (raw) => {
    const repairPrompt = [
      "Return ONLY valid JSON.",
      "Repair this malformed JSON output.",
      "Do not add commentary.",
      "Do not invent missing evidence.",
      "If an item is truncated, omit that item.",
      "",
      "Malformed JSON:",
      String(raw || "").slice(0, 24000),
    ].join("\n");

    const body = {
      contents: [{ role: "user", parts: [{ text: repairPrompt }] }],
      generationConfig: {
        temperature: 0,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
      },
    };

    const token = await getGcloudAccessToken();
    const url = `https://${VERTEX_LOCATION}-aiplatform.googleapis.com/v1/projects/${VERTEX_PROJECT_ID}/locations/${VERTEX_LOCATION}/publishers/google/models/${VERTEX_MODEL}:generateContent`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    if (!res.ok) throw new Error(`Vertex repair error: ${text}`);

    const outer = JSON.parse(text);
    const repairedText = extractCandidateText(outer);
    const repaired = parseModelJson(repairedText);

    if (!repaired) {
      const badPath = await saveBadJson(repairedText, "repair-failed");
      throw new Error(`Vertex JSON repair failed. Saved raw repair output: ${badPath}`);
    }

    return repaired;
  };

  const body = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
    },
  };

  if (VERTEX_PROJECT_ID) {
    const token = await getGcloudAccessToken();
    const url = `https://${VERTEX_LOCATION}-aiplatform.googleapis.com/v1/projects/${VERTEX_PROJECT_ID}/locations/${VERTEX_LOCATION}/publishers/google/models/${VERTEX_MODEL}:generateContent`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    if (!res.ok) throw new Error(`Vertex error: ${text}`);

    const json = JSON.parse(text);
    const candidateText = extractCandidateText(json);
    const parsed = parseModelJson(candidateText);

    if (parsed) return parsed;

    const badPath = await saveBadJson(candidateText, "initial-parse-failed");
    console.error(`Vertex returned malformed JSON. Saved raw output: ${badPath}`);
    console.error("Retrying once with Vertex JSON repair.");
    return repairWithVertex(candidateText);
  }

  const key = env("GOOGLE_API_KEY", "");
  must(key, "Missing GOOGLE_API_KEY or Vertex configuration.");

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${VERTEX_MODEL}:generateContent?key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  if (!res.ok) throw new Error(`Gemini API error: ${text}`);

  const json = JSON.parse(text);
  const candidateText = extractCandidateText(json);
  const parsed = parseModelJson(candidateText);

  if (parsed) return parsed;

  const badPath = await saveBadJson(candidateText, "initial-parse-failed");
  throw new Error(`Gemini returned malformed JSON. Saved raw output: ${badPath}`);
}

async function registerXmlSources(manifest) {
  const docs = new Map();
  for (const item of manifest) {
    const key = item.source || item.doc_folder || item.dest || item.sha256;
    if (!docs.has(key)) {
      docs.set(key, {
        source_kind: "gdrive_ooxml",
        source_path: String(item.source || item.doc_folder || item.dest || ""),
        source_sha256: sha256Text(String(item.source || item.doc_folder || "") + String(item.sha256 || "")),
        title: basename(String(item.source || item.doc_folder || "ooxml_source")),
        byte_count: Number(item.bytes || 0),
        metadata: { doc_folder: item.doc_folder || "", first_part_path: item.part_path || "" },
      });
    }
  }

  if (!writeMode) {
    console.log(`DRY_RUN register source_documents: ${docs.size}`);
    return;
  }

  await insertRows("source_documents?on_conflict=source_sha256", [...docs.values()].slice(0, 2000), 100);
  console.log(`registered source_documents: ${docs.size}`);
}

async function writeSemanticResult({ semanticRun, batch, result }) {
  const paragraphResults = Array.isArray(result.paragraphs) ? result.paragraphs : [];
  const dualisms = Array.isArray(result.dualism_relations) ? result.dualism_relations : [];
  const movements = Array.isArray(result.archetype_movements) ? result.archetype_movements : [];

  if (!writeMode) {
    console.log(JSON.stringify({
      dry_run_batch: batch.map((p) => p.id),
      paragraph_results: paragraphResults.length,
      dualism_relations: dualisms.length,
      archetype_movements: movements.length,
    }, null, 2));
    return;
  }

  for (const pr of paragraphResults) {
    const paragraph = batch.find((p) => p.id === pr.paragraph_id);
    if (!paragraph) continue;

    const contentSha = sha256Text(paragraph.content || "");
    const runtimeHash = sha256Text(canonicalJson({
      narrative_context_sha256: NARRATIVE_CONTEXT_SHA256,
      paragraph_id: paragraph.id,
      content_sha256: contentSha,
      model: VERTEX_MODEL,
      prompt_version: PROMPT_VERSION,
      archetypes: pr.archetype_observations || [],
      biblical_references: pr.biblical_references || [],
      dualism_participations: pr.dualism_map || {},
      hyperlinks: pr.derived_hyperlinks || [],
    }));

    await patchRow("paragraphs", paragraph.id, {
      content_sha256: contentSha,
      active_semantic_run_id: semanticRun.id,
      archetypal_weights: pr.archetypal_weights || {},
      dualism_map: pr.dualism_map || {},
      metadata: {
        ...(paragraph.metadata || {}),
        semantic: {
          semantic_run_id: semanticRun.id,
          runtime_semantic_sha256: runtimeHash,
          narrative_context_sha256: NARRATIVE_CONTEXT_SHA256,
          xml_manifest_sha256: XML_MANIFEST_SHA256,
          prompt_version: PROMPT_VERSION,
          model: VERTEX_MODEL,
          summary: pr.metadata?.summary || "",
          notes: pr.metadata?.semantic_notes || [],
        },
      },
    });

    const archetypes = (pr.archetype_observations || []).map((a) => ({
      paragraph_id: paragraph.id,
      semantic_run_id: semanticRun.id,
      archetype: String(a.archetype || "unknown"),
      subject_name: a.subject_name || null,
      movement_stage: a.movement_stage || null,
      evidence_text: a.evidence_text || null,
      interpretation: a.interpretation || null,
      confidence: Number(a.confidence || 0),
      semantic_hash: sha256Text(canonicalJson({ semanticRun: semanticRun.id, paragraph: paragraph.id, a })),
      metadata: { narrative_context_sha256: NARRATIVE_CONTEXT_SHA256 },
    }));

    if (archetypes.length) await insertRows("archetype_observations", archetypes);

    const biblical = (pr.biblical_references || []).map((b) => ({
      paragraph_id: paragraph.id,
      semantic_run_id: semanticRun.id,
      reference_text: b.reference_text || null,
      book: b.book || null,
      chapter: Number.isFinite(Number(b.chapter)) ? Number(b.chapter) : null,
      verse: Number.isFinite(Number(b.verse)) ? Number(b.verse) : null,
      allusion_type: b.allusion_type || null,
      evidence_text: b.evidence_text || null,
      interpretation: b.interpretation || null,
      confidence: Number(b.confidence || 0),
      source_label: "xml_grounded_vertex_rehash",
      source_span: {},
      semantic_hash: sha256Text(canonicalJson({ semanticRun: semanticRun.id, paragraph: paragraph.id, b })),
      metadata: { narrative_context_sha256: NARRATIVE_CONTEXT_SHA256 },
      active: true,
    }));

    if (biblical.length) await insertRows("biblical_references", biblical);

    const links = (pr.derived_hyperlinks || []).map((h) => ({
      paragraph_id: paragraph.id,
      semantic_run_id: semanticRun.id,
      theme_node_a: h.theme_node_a || null,
      theme_node_b: h.theme_node_b || null,
      connection_type: h.connection_type || h.edge_type || null,
      edge_type: h.edge_type || null,
      chapter_reference: String(paragraph.chapter_id || ""),
      strength: Number(h.confidence || 0),
      confidence: Number(h.confidence || 0),
      source_table: "paragraph_semantics",
      semantic_hash: sha256Text(canonicalJson({ semanticRun: semanticRun.id, paragraph: paragraph.id, h })),
      metadata: { evidence_text: h.evidence_text || "", narrative_context_sha256: NARRATIVE_CONTEXT_SHA256 },
      active: true,
    }));

    if (links.length) await insertRows("hyperlinks", links);
  }

  for (const d of dualisms) {
    const relationHash = sha256Text(canonicalJson({
      narrative_context_sha256: NARRATIVE_CONTEXT_SHA256,
      relation_type: d.relation_type || "",
      shared_substrate: d.shared_substrate || "",
      pole_a: d.pole_a || {},
      pole_b: d.pole_b || {},
      evidence: d.evidence || [],
      interpretation: d.interpretation || "",
      confidence: Number(d.confidence || 0),
    }));

    const inserted = await insertRows("dualism_relations", [{
      semantic_run_id: semanticRun.id,
      relation_type: d.relation_type || "conceptual_dualism",
      shared_substrate: d.shared_substrate || null,
      pole_a: d.pole_a || {},
      pole_b: d.pole_b || {},
      interpretation: d.interpretation || null,
      confidence: Number(d.confidence || 0),
      semantic_relation_sha256: relationHash,
      metadata: { narrative_context_sha256: NARRATIVE_CONTEXT_SHA256 },
      active: true,
    }]).catch(() => []);

    const relation = inserted?.[0];
    if (relation && Array.isArray(d.evidence) && d.evidence.length) {
      await insertRows("dualism_relation_evidence", d.evidence.map((e) => ({
        dualism_relation_id: relation.id,
        paragraph_id: e.paragraph_id || null,
        evidence_role: e.evidence_role || null,
        evidence_text: e.evidence_text || null,
        source_span: {},
        metadata: {},
      })));
    }

    if (relation && d.derived_hyperlink) {
      const h = d.derived_hyperlink;
      await insertRows("hyperlinks", [{
        paragraph_id: d.pole_a?.paragraph_id || d.pole_b?.paragraph_id || null,
        semantic_run_id: semanticRun.id,
        theme_node_a: h.theme_node_a || d.pole_a?.label || null,
        theme_node_b: h.theme_node_b || d.pole_b?.label || null,
        connection_type: h.connection_type || "dualism",
        edge_type: "dualism",
        chapter_reference: "",
        strength: Number(h.confidence || d.confidence || 0),
        confidence: Number(h.confidence || d.confidence || 0),
        source_table: "dualism_relations",
        source_id: relation.id,
        semantic_hash: sha256Text(canonicalJson({ relationHash, h })),
        metadata: { narrative_context_sha256: NARRATIVE_CONTEXT_SHA256 },
        active: true,
      }]);
    }
  }

  if (movements.length) {
    await insertRows("archetype_movements", movements.map((m) => ({
      semantic_run_id: semanticRun.id,
      subject_name: m.subject_name || "unknown",
      arc_label: m.arc_label || null,
      from_state: m.from_state || null,
      to_state: m.to_state || null,
      start_paragraph_id: m.start_paragraph_id || null,
      end_paragraph_id: m.end_paragraph_id || null,
      evidence_summary: m.evidence_summary || null,
      interpretation: m.interpretation || null,
      confidence: Number(m.confidence || 0),
      semantic_hash: sha256Text(canonicalJson({ semanticRun: semanticRun.id, m })),
      metadata: { narrative_context_sha256: NARRATIVE_CONTEXT_SHA256 },
      active: true,
    })));
  }
}

async function main() {
  const manifest = validateSources();
  const contextPack = readText(paths.contextPack);
  const chapters = loadPublicChapters().filter((c) => !CHAPTER_FILTER || c.chapter_number === CHAPTER_FILTER);
  const availableNarrativeContextMap = buildAvailableNarrativeContextMap(chapters);

  const sourceSummary = {
    context_pack_sha256: NARRATIVE_CONTEXT_SHA256,
    xml_manifest_sha256: XML_MANIFEST_SHA256,
    xml_manifest_count: XML_MANIFEST_COUNT,
    public_chapter_count: chapters.length,
    available_narrative_context_map: true,
    available_narrative_context_map_sha256: sha256Text(availableNarrativeContextMap),
    write_mode: writeMode,
  };

  writeFileSync(join(paths.outDir, "source-summary.json"), JSON.stringify(sourceSummary, null, 2));

  if (registerSources) await registerXmlSources(manifest);

  const semanticRun = await createSemanticRun(sourceSummary);

  const chaptersDb = await fetchAll("chapters", "id,manifest_id,chapter_number,part_number,status", "chapter_number.asc");
  let paragraphs = await fetchAll("paragraphs", "id,chapter_id,chunk_index,content,metadata", "chunk_index.asc");

  const chapterIdByNumber = new Map();
  for (const c of chaptersDb) {
    if (c.chapter_number !== null && c.chapter_number !== undefined) chapterIdByNumber.set(Number(c.chapter_number), c.id);
    const parsed = Number(String(c.manifest_id || "").match(/\d+/)?.[0]);
    if (Number.isFinite(parsed)) chapterIdByNumber.set(parsed, c.id);
  }

  let totalProcessed = 0;

  for (const chapter of chapters) {
    const chapterId = chapterIdByNumber.get(chapter.chapter_number);
    let chapterParagraphs = chapterId
      ? paragraphs.filter((p) => p.chapter_id === chapterId)
      : paragraphs.filter((p) => String(p.content || "").length > 0).slice(0, BATCH_SIZE);

    if (LIMIT) chapterParagraphs = chapterParagraphs.slice(0, Math.max(0, LIMIT - totalProcessed));
    if (!chapterParagraphs.length) continue;

    const xmlEntries = relevantXmlEntriesForChapter(manifest, chapter.chapter_number);
    const xmlEvidence = loadXmlEvidence(xmlEntries);

    for (const batch of paragraphBatches(chapterParagraphs)) {
      if (LIMIT && totalProcessed >= LIMIT) break;

      const prompt = buildPrompt({ contextPack, availableNarrativeContextMap, chapter, xmlEvidence, paragraphs: batch });
      const promptHash = sha256Text(prompt);
      writeFileSync(join(paths.outDir, `prompt-${chapter.chapter_number}-${totalProcessed}.sha256`), `${promptHash}\n`);

      const result = await callVertex(prompt);
      writeFileSync(
        join(paths.outDir, `result-${chapter.chapter_number}-${totalProcessed}.json`),
        JSON.stringify(result, null, 2)
      );

      await writeSemanticResult({ semanticRun, batch, result });
      totalProcessed += batch.length;

      console.log(JSON.stringify({
        run_id: semanticRun.id,
        chapter: chapter.chapter_number,
        processed: totalProcessed,
        write_mode: writeMode,
        prompt_hash: promptHash,
      }));
    }
  }

  if (writeMode) {
    await patchRow("semantic_runs", semanticRun.id, {
      status: "completed",
      completed_at: new Date().toISOString(),
      metadata: { ...(semanticRun.metadata || {}), total_processed: totalProcessed },
    });
  }

  writeFileSync(join(paths.outDir, "run-summary.json"), JSON.stringify({
    run_id: semanticRun.id,
    write_mode: writeMode,
    total_processed: totalProcessed,
    narrative_context_sha256: NARRATIVE_CONTEXT_SHA256,
    xml_manifest_sha256: XML_MANIFEST_SHA256,
    provider: "vertex",
    model: VERTEX_MODEL,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
