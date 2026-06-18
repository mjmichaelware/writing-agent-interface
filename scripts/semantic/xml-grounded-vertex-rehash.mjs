#!/usr/bin/env node
import { createHash } from "node:crypto";
import { readFileSync, existsSync, readdirSync, statSync, mkdirSync, writeFileSync } from "node:fs";
import { join, basename } from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();
const RUN_ID = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
const PROMPT_VERSION = "xml-grounded-semantic-v1";
const NARRATIVE_CONTEXT_SHA256 = "6e7e306c32940db56e82f1aff23942e6f3d62d7483db8e5735bb2ef2ef75eb8c";
const XML_MANIFEST_SHA256 = "bca8eeacca6a9dd260d50a14a8b2dce9f2f2e759dd16a5cc3ef2ee06d0a1b970";
const XML_MANIFEST_COUNT = 579;

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
const VERTEX_PROJECT_ID = env("VERTEX_PROJECT_ID", env("GCP_PROJECT_ID", "ai-job-agent-498702"));
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

async function insertRows(tableArg, rows, chunkSize = 100) {
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

function buildPrompt({ contextPack, chapter, xmlEvidence, paragraphs }) {
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
- Biblical references can be non-verbatim, but must explain why the allusion is valid.

NARRATIVE CONTEXT PACK SHA256:
${NARRATIVE_CONTEXT_SHA256}

NARRATIVE CONTEXT PACK:
${clip(contextPack, 30000)}

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


class VertexJsonRepairError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "VertexJsonRepairError";
    this.details = details;
  }
}

function extractVertexText(json) {
  return json?.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") || "";
}

function cleanJsonText(raw) {
  let t = String(raw || "").trim();
  t = t.replace(/^\s*```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
  const firstObj = t.indexOf("{");
  const firstArr = t.indexOf("[");
  const starts = [firstObj, firstArr].filter((x) => x >= 0);
  if (starts.length) t = t.slice(Math.min(...starts));
  t = t.replace(/,\s*([}\]])/g, "$1");
  return t;
}

async function saveBadVertexJson(raw, meta = {}) {
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const crypto = await import("node:crypto");

  const root = path.join("docs", "forensics", "audits", "vertex-bad-json");
  await fs.mkdir(root, { recursive: true });

  const hash = crypto.createHash("sha256").update(String(raw || "")).digest("hex").slice(0, 16);
  const file = path.join(root, `${new Date().toISOString().replace(/[:.]/g, "-")}-${hash}.json`);

  await fs.writeFile(file, JSON.stringify({ meta, raw }, null, 2), "utf-8");
  return file;
}

function parseJsonOrNull(raw) {
  try { return JSON.parse(raw); } catch {}
  try { return JSON.parse(cleanJsonText(raw)); } catch {}
  return null;
}

async function repairJsonWithVertex(raw, originalPrompt) {
  const repairPrompt = `
Return ONLY valid JSON. Repair this malformed JSON output. Do not add commentary. Do not invent missing evidence. If a field is truncated, omit that item.

Malformed JSON:
${String(raw || "").slice(0, 24000)}
`;

  const repaired = await callVertexRaw(repairPrompt, { maxOutputTokens: 8192, temperature: 0 });
  const parsed = parseJsonOrNull(repaired.text);

  if (!parsed) {
    const badPath = await saveBadVertexJson(repaired.text, {
      phase: "repair_failed",
      model: VERTEX_MODEL,
      original_prompt_sha256: sha256Text(originalPrompt || ""),
    });
    throw new VertexJsonRepairError(`Vertex JSON repair failed. Raw repair output saved: ${badPath}`, { badPath });
  }

  return parsed;
}

async function callVertexRaw(prompt, overrideGenerationConfig = {}

async function callVertex(prompt) {
  const raw = await callVertexRaw(prompt);

  if (raw && typeof raw === "object" && !Object.prototype.hasOwnProperty.call(raw, "text")) {
    return raw;
  }

  const text = typeof raw === "string" ? raw : (raw?.text || "");
  const parsed = parseJsonOrNull(text);
  if (parsed) return parsed;

  const badPath = await saveBadVertexJson(text, {
    phase: "initial_parse_failed",
    model: VERTEX_MODEL,
    prompt_sha256: sha256Text(prompt),
  });

  console.error(`Vertex returned malformed JSON. Raw output saved: ${badPath}`);
  console.error("Retrying with JSON repair prompt...");
  return repairJsonWithVertex(text, prompt);
}
) {
  if (noAi) {
    return {
      paragraphs: [],
      dualism_relations: [],
      archetype_movements: [],
    };
  }

  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.15,
      topP: 0.9,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
    },
  };

  const token = getGcloudAccessToken();

  if (token) {
    const endpoint =
      `https://${VERTEX_LOCATION}-aiplatform.googleapis.com/v1/projects/${VERTEX_PROJECT_ID}` +
      `/locations/${VERTEX_LOCATION}/publishers/google/models/${VERTEX_MODEL}:generateContent`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(`Vertex error: ${JSON.stringify(json).slice(0, 1200)}`);
    const text = json?.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") || "{}";
    return JSON.parse(text);
  }

  const key = process.env.GOOGLE_API_KEY;
  if (!key) throw new Error("No Vertex ADC token and no GOOGLE_API_KEY fallback.");

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${VERTEX_MODEL}:generateContent?key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`Gemini API fallback error: ${JSON.stringify(json).slice(0, 1200)}`);
  const text = json?.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") || "{}";
  return JSON.parse(text);
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

  const sourceSummary = {
    context_pack_sha256: NARRATIVE_CONTEXT_SHA256,
    xml_manifest_sha256: XML_MANIFEST_SHA256,
    xml_manifest_count: XML_MANIFEST_COUNT,
    public_chapter_count: chapters.length,
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

      const prompt = buildPrompt({ contextPack, chapter, xmlEvidence, paragraphs: batch });
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
