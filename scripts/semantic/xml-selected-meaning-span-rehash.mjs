#!/usr/bin/env node
import { createHash } from "node:crypto";
import { readFileSync, existsSync, readdirSync, statSync, mkdirSync, writeFileSync } from "node:fs";
import { join, basename } from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();
const RUN_ID = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
const PROMPT_VERSION = "xml-selected-meaning-span-v4";
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
const limitDocsArg = process.argv.find((x) => x.startsWith("--limit-docs="));
const selectedTruthArg = process.argv.find((x) => x.startsWith("--selected-truth="));
const providerArg = process.argv.find((x) => x.startsWith("--provider="));
const modelArg = process.argv.find((x) => x.startsWith("--model="));
const ollamaBaseUrlArg = process.argv.find((x) => x.startsWith("--ollama-base-url="));

const LIMIT = limitArg ? Number(limitArg.split("=")[1]) : null;
const CHAPTER_FILTER = chapterArg ? Number(chapterArg.split("=")[1]) : null;
const BATCH_SIZE = batchArg ? Number(batchArg.split("=")[1]) : 8;
const LIMIT_DOCS = limitDocsArg ? Number(limitDocsArg.split("=")[1]) : null;
const SELECTED_TRUTH_OVERRIDE = selectedTruthArg ? selectedTruthArg.split("=").slice(1).join("=") : "";

const paths = {
  contextPack: join(ROOT, "docs/agent_context/source_drop/hasher_context_v1/narrative_context_pack_v1.txt"),
  xmlManifest: join(ROOT, "reports/xml_recovery/materialized_ooxml_manifest.json"),
  selectedTruth: join(ROOT, "reports/xml_recovery/xml_starred_hash_truth.txt"),
  materializedOoxml: join(ROOT, "reports/xml_recovery/materialized_ooxml"),
  ooxmlRaw: join(ROOT, "src/data-layer/ingestion-buffer/gdrive_ooxml_raw"),
  publicChapters: join(ROOT, "public/data/chapters"),
  outDir: join(ROOT, "docs/forensics/audits/xml-selected-meaning-span-rehash-runs", RUN_ID),
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
const VERTEX_MODEL = env("VERTEX_MODEL", "gemini-2.5-flash");
const SELECTED_XML_PROVIDER = (providerArg ? providerArg.split("=").slice(1).join("=") : env("SELECTED_XML_PROVIDER", "vertex")).trim().toLowerCase();
const OLLAMA_BASE_URL = (ollamaBaseUrlArg ? ollamaBaseUrlArg.split("=").slice(1).join("=") : env("OLLAMA_BASE_URL", "http://127.0.0.1:11434")).trim().replace(/\/+$/, "");
const OLLAMA_MODEL = env("OLLAMA_MODEL", "llama3.2:1b");
const SELECTED_XML_MODEL = (modelArg ? modelArg.split("=").slice(1).join("=") : "").trim() || (SELECTED_XML_PROVIDER === "ollama" ? OLLAMA_MODEL : VERTEX_MODEL);
const SUPPORTED_SELECTED_XML_PROVIDERS = new Set(["vertex", "ollama"]);

function validateSources() {
  must(existsSync(paths.contextPack), `Missing context pack: ${paths.contextPack}`);
  must(existsSync(paths.xmlManifest), `Missing XML manifest: ${paths.xmlManifest}`);
  must(existsSync(paths.materializedOoxml), `Missing materialized OOXML root: ${paths.materializedOoxml}`);
  must(existsSync(paths.publicChapters), `Missing public chapter corpus: ${paths.publicChapters}`);

  const contextSha = sha256File(paths.contextPack);
  const xmlSha = sha256File(paths.xmlManifest);
  const manifest = JSON.parse(readText(paths.xmlManifest));

  must(contextSha === NARRATIVE_CONTEXT_SHA256, `Context hash drift: ${contextSha}`);
  must(xmlSha === XML_MANIFEST_SHA256, `XML manifest hash drift: ${xmlSha}`);
  must(Array.isArray(manifest) && manifest.length === XML_MANIFEST_COUNT, `XML manifest count drift: ${manifest.length}`);

  return manifest;
}

function validateProviderSelection() {
  must(
    SUPPORTED_SELECTED_XML_PROVIDERS.has(SELECTED_XML_PROVIDER),
    `Unsupported selected XML provider: ${SELECTED_XML_PROVIDER}. Expected one of ${Array.from(SUPPORTED_SELECTED_XML_PROVIDERS).join(", ")}`
  );

  if (SELECTED_XML_PROVIDER === "ollama") {
    must(OLLAMA_BASE_URL, "Missing OLLAMA_BASE_URL.");
    must(SELECTED_XML_MODEL, "Missing OLLAMA_MODEL or --model for Ollama.");
  }
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


function isRetryableGeminiError(error) {
  const text = String(error?.message || error || "");
  return /(?:\b429\b|\b500\b|\b502\b|\b503\b|\b504\b|RESOURCE_EXHAUSTED|UNAVAILABLE|high demand|try again later|temporar|malformed JSON|initial-parse-failed|fetch failed|network|timeout|ECONNRESET|ETIMEDOUT)/i.test(text);
}

function geminiRetryDelayMs(attempt) {
  const base = Number(process.env.GEMINI_RETRY_BASE_MS || 15000);
  const max = Number(process.env.GEMINI_RETRY_MAX_MS || 180000);
  const jitter = Math.floor(Math.random() * 3000);
  return Math.min(max, base * Math.pow(2, Math.max(0, attempt - 1)) + jitter);
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function stripFence(raw) {
  return String(raw || "")
    .trim()
    .replace(/^\s*```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();
}

function balancedSlice(raw) {
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
}

function cleanJson(raw) {
  return balancedSlice(raw)
    .replace(/,\s*([}\]])/g, "$1")
    .replace(/([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)(\s*:)/g, '$1"$2"$3');
}

function parseModelJson(raw) {
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
}

async function saveProviderBadJson(raw, phase, provider, model) {
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const crypto = await import("node:crypto");

  const dir = path.join("docs", "forensics", "audits", `${provider}-bad-json`);
  await fs.mkdir(dir, { recursive: true });

  const hash = crypto.createHash("sha256").update(String(raw || "")).digest("hex").slice(0, 16);
  const file = path.join(dir, `${new Date().toISOString().replace(/[:.]/g, "-")}-${phase}-${hash}.json`);

  await fs.writeFile(file, JSON.stringify({
    phase,
    provider,
    model,
    raw,
  }, null, 2), "utf-8");

  return file;
}

async function callVertex(prompt) {
  const maxRetries = Number(process.env.GEMINI_MAX_RETRIES || 12);
  let lastError = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await callVertexOnce(prompt);
    } catch (error) {
      lastError = error;

      if (!isRetryableGeminiError(error) || attempt >= maxRetries) {
        throw error;
      }

      const delay = geminiRetryDelayMs(attempt + 1);
      console.warn(JSON.stringify({
        event: "gemini_retry",
        attempt: attempt + 1,
        max_retries: maxRetries,
        delay_ms: delay,
        error: String(error?.message || error).slice(0, 1200),
      }));

      await sleep(delay);
    }
  }

  throw lastError || new Error("Gemini retry loop failed without captured error");
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
  render_paragraphs: {
    semantic_run_id: "uuid",
    source_doc_folder: "text",
    source_document_xml_sha256: "text",
    render_para_key: "text",
    render_index: "integer",
    text: "text",
    text_sha256: "text",
    start_char: "integer",
    end_char: "integer",
    source_xml_paragraph_indexes: "jsonb",
    boundary_method: "text",
    boundary_confidence: "numeric",
    boundary_reason: "text",
    metadata: "jsonb",
    active: "boolean",
  },
  semantic_meaning_spans: {
    semantic_run_id: "uuid",
    span_key: "text",
    span_type: "text",
    claim_family: "text",
    label: "text",
    subject_name: "text",
    evidence_text: "text",
    evidence_sha256: "text",
    source_span: "jsonb",
    interpretation: "text",
    confidence: "numeric",
    prompt_sha256: "text",
    model_output_sha256: "text",
    semantic_hash: "text",
    metadata: "jsonb",
    active: "boolean",
  },
  semantic_meaning_span_edges: {
    semantic_run_id: "uuid",
    edge_key: "text",
    edge_type: "text",
    from_span_key: "text",
    to_span_key: "text",
    relation_type: "text",
    evidence_text: "text",
    evidence_sha256: "text",
    interpretation: "text",
    confidence: "numeric",
    prompt_sha256: "text",
    model_output_sha256: "text",
    semantic_hash: "text",
    metadata: "jsonb",
    active: "boolean",
  },
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
      provider: SELECTED_XML_PROVIDER,
      model: SELECTED_XML_MODEL,
      prompt_version: PROMPT_VERSION,
      narrative_context_sha256: NARRATIVE_CONTEXT_SHA256,
      xml_manifest_sha256: XML_MANIFEST_SHA256,
      xml_manifest_count: XML_MANIFEST_COUNT,
    };
  }

  const rows = await insertRows("semantic_runs", [{
    status: "running",
    provider: SELECTED_XML_PROVIDER,
    model: SELECTED_XML_MODEL,
    prompt_version: PROMPT_VERSION,
    narrative_context_sha256: NARRATIVE_CONTEXT_SHA256,
    xml_manifest_sha256: XML_MANIFEST_SHA256,
    xml_manifest_count: XML_MANIFEST_COUNT,
    source_summary: sourceSummary,
    reset_policy: "supersede_by_semantic_run_id",
    metadata: { run_id: RUN_ID, script: "scripts/semantic/xml-selected-meaning-span-rehash.mjs", derived_from: "xml-grounded-vertex-rehash.mjs", db_write_mode: "supabase_management_api", selected_xml_driver: true, primary_hash_lane: "semantic_meaning_spans", old_semantic_table_writes: "blocked_on_first_run", selected_xml_provider: SELECTED_XML_PROVIDER, selected_xml_model: SELECTED_XML_MODEL },
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

You must use the NARRATIVE CONTEXT PACK as the interpretive lens. Selected XML render paragraphs are the source/hash evidence. Public chapter prose is narrative context, not the source driver.

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

SELECTED XML RENDER PARAGRAPHS TO HASH:
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

async function callVertexOnce(prompt) {
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
    const url = `https://${VERTEX_LOCATION}-aiplatform.googleapis.com/v1/projects/${VERTEX_PROJECT_ID}/locations/${VERTEX_LOCATION}/publishers/google/models/${SELECTED_XML_MODEL}:generateContent`;

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
      const badPath = await saveProviderBadJson(repairedText, "repair-failed", "vertex", SELECTED_XML_MODEL);
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
    const url = `https://${VERTEX_LOCATION}-aiplatform.googleapis.com/v1/projects/${VERTEX_PROJECT_ID}/locations/${VERTEX_LOCATION}/publishers/google/models/${SELECTED_XML_MODEL}:generateContent`;

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

    const badPath = await saveProviderBadJson(candidateText, "initial-parse-failed", "vertex", SELECTED_XML_MODEL);
    console.error(`Vertex returned malformed JSON. Saved raw output: ${badPath}`);
    console.error("Retrying once with Vertex JSON repair.");
    return repairWithVertex(candidateText);
  }

  const key = env("GOOGLE_API_KEY", env("GEMINI_API_KEY", ""));
  must(key, "Missing GOOGLE_API_KEY or Vertex configuration.");

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${SELECTED_XML_MODEL}:generateContent?key=${key}`, {
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

  const badPath = await saveProviderBadJson(candidateText, "initial-parse-failed", "vertex", SELECTED_XML_MODEL);
  throw new Error(`Gemini returned malformed JSON. Saved raw output: ${badPath}`);
}

async function callOllama(prompt) {
  const body = {
    model: SELECTED_XML_MODEL,
    prompt,
    stream: false,
    format: "json",
    options: {
      temperature: 0,
      num_predict: 8192,
    },
  };

  const res = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  if (!res.ok) throw new Error(`Ollama error: ${text}`);

  const json = JSON.parse(text);
  const candidateText = json?.response || "";
  const parsed = parseModelJson(candidateText);

  if (parsed) return parsed;

  const badPath = await saveProviderBadJson(candidateText, "initial-parse-failed", "ollama", SELECTED_XML_MODEL);
  throw new Error(`Ollama returned malformed JSON. Saved raw output: ${badPath}`);
}

async function callSelectedXmlProvider(prompt) {
  if (SELECTED_XML_PROVIDER === "ollama") return callOllama(prompt);
  return callVertex(prompt);
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
      model: SELECTED_XML_MODEL,
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
          model: SELECTED_XML_MODEL,
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

function loadSelectedXmlTruth() {
  const candidates = [SELECTED_TRUTH_OVERRIDE, paths.selectedTruth].filter(Boolean);

  for (const p of [...new Set(candidates)].filter((x) => x && existsSync(x))) {
    const text = readText(p);
    const folders = [];
    let inside = /xml_starred_hash_doc_folders\.txt$/.test(p);
    for (const line of text.split(/\r?\n/)) {
      if (/Included XML doc folders:/i.test(line)) {
        inside = true;
        continue;
      }
      if (/Explicitly excluded/i.test(line)) inside = false;
      if (!inside) continue;
      const m = line.match(/(?:-\s*)?(\d{4}_[^\s]+)/);
      if (m) folders.push(m[1]);
    }
    const selected = [...new Set(folders)];
    if (selected.length === 16) return { path: p, sha256: sha256File(p), folders: selected };
  }

  throw new Error("Could not find selected/starred XML truth with exactly 16 folders.");
}

function resolveSelectedDocumentPath(folder) {
  const repoLocal = join(paths.materializedOoxml, folder, "word", "document.xml");
  if (existsSync(repoLocal)) return repoLocal;

  const legacy = join(paths.ooxmlRaw, folder, "word", "document.xml");
  if (existsSync(legacy)) return legacy;

  throw new Error(`Selected folder missing word/document.xml: ${folder}`);
}

function decodeOoxml(s) {
  return String(s || "")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function paragraphProps(pXml) {
  return {
    style: pXml.match(/<w:pStyle[^>]*w:val="([^"]+)"/)?.[1] || "",
    jc: pXml.match(/<w:jc[^>]*w:val="([^"]+)"/)?.[1] || "",
    firstLine: pXml.match(/<w:ind[^>]*w:firstLine="([^"]+)"/)?.[1] || "",
    left: pXml.match(/<w:ind[^>]*w:left="([^"]+)"/)?.[1] || "",
    hanging: pXml.match(/<w:ind[^>]*w:hanging="([^"]+)"/)?.[1] || "",
    hasNumbering: /<w:numPr[\s>]/.test(pXml),
  };
}

function extractOoxmlParagraphs(xml, folder, docSha) {
  const body = String(xml || "").match(/<w:body[\s\S]*?<\/w:body>/)?.[0] || String(xml || "");
  const out = [];
  const re = /<w:p\b[\s\S]*?<\/w:p>/g;
  let m;
  let index = 0;
  let charCursor = 0;

  while ((m = re.exec(body))) {
    index += 1;
    const pXml = m[0];
    const text = [...pXml.matchAll(/<w:t\b[^>]*>([\s\S]*?)<\/w:t>|<w:tab\b[^>]*\/>|<w:br\b[^>]*\/>/g)]
      .map((x) => x[1] !== undefined ? decodeOoxml(x[1]) : x[0].startsWith("<w:tab") ? "\t" : "\n")
      .join("")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\s+/g, " ")
      .trim();

    const start = charCursor;
    const end = start + text.length;
    charCursor = end + 2;

    out.push({
      xml_paragraph_index: index,
      folder,
      document_xml_sha256: docSha,
      text,
      text_sha256: sha256Text(text),
      start_char: start,
      end_char: end,
      props: paragraphProps(pXml),
      empty: !text,
    });
  }

  return out;
}

function terminalPunctuation(text) {
  return /[.!?…]["”’')\]]?$/.test(String(text || "").trim());
}
function continuationEnd(text) {
  return /[,;:—–-]["”’')\]]?$/.test(String(text || "").trim());
}
function continuationStart(text) {
  return /^[a-z,;:—–\-)\]”’]/.test(String(text || "").trim()) || /^(and|but|or|because|while|when|as|that|which|who|then)\b/i.test(String(text || "").trim());
}
function sceneBreak(text) {
  return /^([*#\-–—_\s]{3,}|chapter\s+\d+|part\s+[ivx]+)$/i.test(String(text || "").trim());
}
function dialogueStart(text) {
  return /^["“]/.test(String(text || "").trim());
}
function shouldStartRenderParagraph(prevText, cur) {
  if (!prevText) return true;
  if (cur.empty) return true;
  if (sceneBreak(prevText) || sceneBreak(cur.text)) return true;
  if (cur.props?.firstLine || cur.props?.style || cur.props?.hasNumbering) return true;
  if (!terminalPunctuation(prevText) || continuationEnd(prevText) || continuationStart(cur.text)) return false;
  if (dialogueStart(cur.text)) return true;
  return true;
}

function buildRenderParagraphs(xmlParagraphs, folder, docSha) {
  const out = [];
  let cur = null;

  const flush = (reason) => {
    if (!cur) return;
    cur.text = cur.text.replace(/\s+/g, " ").trim();
    cur.content = cur.text;
    cur.text_sha256 = sha256Text(cur.text);
    cur.render_para_key = "rp_" + sha256Text([folder, docSha, cur.render_index, cur.text].join("\t")).slice(0, 32);
    cur.id = cur.render_para_key;
    cur.metadata.render_para_key = cur.render_para_key;
    cur.metadata.source_span.render_para_key = cur.render_para_key;
    cur.boundary_reason = cur.boundary_reason || reason;
    cur.metadata.boundary_reason = cur.boundary_reason;
    out.push(cur);
    cur = null;
  };

  for (const xp of xmlParagraphs) {
    if (xp.empty) {
      flush("blank_xml_paragraph_boundary");
      continue;
    }

    if (!cur || shouldStartRenderParagraph(cur.text, xp)) {
      flush("novel_standard_boundary");
      cur = {
        id: "",
        chapter_id: null,
        chunk_index: out.length + 1,
        content: xp.text,
        metadata: {
          selected_xml_driver: true,
          source_doc_folder: folder,
          document_xml_sha256: docSha,
          source_xml_paragraph_indexes: [xp.xml_paragraph_index],
          source_span: {
            source_doc_folder: folder,
            document_xml_sha256: docSha,
            source_xml_paragraph_indexes: [xp.xml_paragraph_index],
            start_char: xp.start_char,
            end_char: xp.end_char,
          },
          boundary_method: "xml_plus_novel_grammar_v4",
          boundary_confidence: xp.props.firstLine || xp.props.style ? 0.92 : 0.76,
          boundary_reason: xp.props.firstLine ? "xml_first_line_indent" : xp.props.style ? "xml_style_" + xp.props.style : "novel_grammar_boundary",
          xml_props: xp.props,
        },
        folder,
        document_xml_sha256: docSha,
        render_index: out.length + 1,
        text: xp.text,
        start_char: xp.start_char,
        end_char: xp.end_char,
        source_xml_paragraph_indexes: [xp.xml_paragraph_index],
        boundary_method: "xml_plus_novel_grammar_v4",
        boundary_confidence: xp.props.firstLine || xp.props.style ? 0.92 : 0.76,
        boundary_reason: xp.props.firstLine ? "xml_first_line_indent" : xp.props.style ? "xml_style_" + xp.props.style : "novel_grammar_boundary",
      };
    } else {
      cur.text += " " + xp.text;
      cur.content = cur.text;
      cur.end_char = xp.end_char;
      cur.source_xml_paragraph_indexes.push(xp.xml_paragraph_index);
      cur.metadata.source_xml_paragraph_indexes = cur.source_xml_paragraph_indexes;
      cur.metadata.source_span.source_xml_paragraph_indexes = cur.source_xml_paragraph_indexes;
      cur.metadata.source_span.end_char = xp.end_char;
      cur.boundary_confidence = Math.min(cur.boundary_confidence, 0.63);
      cur.metadata.boundary_confidence = cur.boundary_confidence;
      cur.metadata.merge_reason = "continued_sentence_or_lowercase_start";
    }
  }

  flush("end_of_document");
  return out;
}

function buildSceneWindows(renderParagraphs, size = Math.max(1, BATCH_SIZE)) {
  const out = [];
  for (let i = 0; i < renderParagraphs.length; i += size) {
    const chunk = renderParagraphs.slice(i, i + size);
    const text = chunk.map((p) => p.text).join("\n\n");
    out.push({
      scene_window_key: "scene_" + sha256Text([chunk[0]?.folder || "", i, text].join("\t")).slice(0, 32),
      folder: chunk[0]?.folder || "",
      document_xml_sha256: chunk[0]?.document_xml_sha256 || "",
      render_paragraphs: chunk,
      text,
      text_sha256: sha256Text(text),
    });
  }
  return out;
}

function loadSelectedXmlDocuments() {
  const selected = loadSelectedXmlTruth();
  let folders = selected.folders;

  if (CHAPTER_FILTER) {
    const n = String(CHAPTER_FILTER);
    folders = folders.filter((f) =>
      f.toLowerCase().includes(`chapter_${n}`) ||
      f.toLowerCase().includes(`chapter${n}`) ||
      f.toLowerCase().includes(`chapter_${n}_`)
    );
  }

  if (LIMIT_DOCS) folders = folders.slice(0, LIMIT_DOCS);

  const docs = [];
  for (const folder of folders) {
    const documentPath = resolveSelectedDocumentPath(folder);
    const docSha = sha256File(documentPath);
    const xmlParagraphs = extractOoxmlParagraphs(readText(documentPath), folder, docSha);
    const renderParagraphs = buildRenderParagraphs(xmlParagraphs, folder, docSha);
    const sceneWindows = buildSceneWindows(renderParagraphs);
    const fullText = renderParagraphs.map((p) => p.text).join("\n\n");

    docs.push({
      folder,
      document_path: documentPath,
      document_xml_sha256: docSha,
      xml_paragraphs: xmlParagraphs.filter((p) => !p.empty),
      render_paragraphs: renderParagraphs,
      scene_windows: sceneWindows,
      full_text_sha256: sha256Text(fullText),
    });
  }

  return { selected, docs };
}

function selectedXmlWindows(docs) {
  const windows = docs.flatMap((doc) =>
    doc.scene_windows.map((w) => ({
      ...w,
      folder: doc.folder,
      document_xml_sha256: doc.document_xml_sha256,
    }))
  );
  return LIMIT ? windows.slice(0, LIMIT) : windows;
}

function renderParagraphRowsForDb(semanticRun, docs) {
  return docs.flatMap((doc) =>
    doc.render_paragraphs.map((p) => ({
      semantic_run_id: semanticRun.id,
      source_doc_folder: doc.folder,
      source_document_xml_sha256: doc.document_xml_sha256,
      render_para_key: p.render_para_key,
      render_index: p.render_index,
      text: p.text,
      text_sha256: p.text_sha256,
      start_char: p.start_char,
      end_char: p.end_char,
      source_xml_paragraph_indexes: p.source_xml_paragraph_indexes,
      boundary_method: p.boundary_method,
      boundary_confidence: p.boundary_confidence,
      boundary_reason: p.boundary_reason,
      metadata: p.metadata || {},
      active: true,
    }))
  );
}

function xmlEvidenceForWindow(window) {
  return [{
    source: `selected_xml:${window.folder}`,
    part_path: "word/document.xml",
    sha256: window.document_xml_sha256,
    scene_window_key: window.scene_window_key,
    selected_xml_driver: true,
    text: clip(window.text, 12000),
  }];
}

function buildSelectedXmlPrompt({ contextPack, availableNarrativeContextMap, window }) {
  const base = buildPrompt({
    contextPack,
    availableNarrativeContextMap,
    chapter: {
      chapter_number: null,
      path: `selected_xml:${window.folder}`,
      sha256: window.text_sha256,
    },
    xmlEvidence: xmlEvidenceForWindow(window),
    paragraphs: window.render_paragraphs,
  });

  return `${base}

SELECTED XML HASHING OVERRIDE:
- Source truth for this batch is selected/starred XML: word/document.xml plus its sha256 and source spans.
- Public chapter text, compendium, synopsis, and narrative context pack are interpretive context only. They do not drive source hashing.
- The paragraph_id values above are render_para_key coordinates for Layer 3, not database paragraph UUIDs.
- Render paragraphs are display/navigation coordinates, not semantic truth boundaries.
- Meaning spans may be smaller than a render paragraph, larger than a render paragraph, overlapping, or discontinuous.
- Preserve the mature PR6 output categories: archetype_observations, biblical_references, derived_hyperlinks, dualism_relations, dualism_relation_evidence, and archetype_movements.
- For every claim, quote exact evidence_text from selected XML render paragraphs when possible.
- If whole-story context affects interpretation, mark it as context support in the interpretation. Do not treat it as the source span.
- Do not invent missing chapter prose, missing biblical references, or unsupported mirrors.
- Return the original PR6 JSON shape only.
`;
}

function sourceSpanForParagraph(paragraph) {
  return paragraph?.metadata?.source_span || {
    render_para_key: paragraph?.render_para_key || paragraph?.id || null,
    source_doc_folder: paragraph?.folder || null,
    document_xml_sha256: paragraph?.document_xml_sha256 || null,
    source_xml_paragraph_indexes: paragraph?.source_xml_paragraph_indexes || [],
  };
}

function meaningSpanRow({ semanticRun, family, spanType, label, subjectName, evidenceText, interpretation, confidence, sourceSpan, promptHash, outputHash, raw }) {
  const semanticHash = sha256Text(canonicalJson({
    selected_xml_driver: true,
    semantic_run_id: semanticRun.id,
    family,
    spanType,
    label,
    subjectName,
    evidenceText,
    interpretation,
    sourceSpan,
    raw,
    promptHash,
    outputHash,
  }));

  return {
    semantic_run_id: semanticRun.id,
    span_key: "mspan_" + semanticHash.slice(0, 32),
    span_type: spanType || family,
    claim_family: family,
    label: label || null,
    subject_name: subjectName || null,
    evidence_text: evidenceText || null,
    evidence_sha256: evidenceText ? sha256Text(evidenceText) : null,
    source_span: sourceSpan || {},
    interpretation: interpretation || null,
    confidence: Number(confidence || 0),
    prompt_sha256: promptHash,
    model_output_sha256: outputHash,
    semantic_hash: semanticHash,
    metadata: {
      selected_xml_driver: true,
      primary_lane: "semantic_meaning_spans",
      old_table_mirror_blocked_on_first_run: true,
      prompt_version: PROMPT_VERSION,
      provider: SELECTED_XML_PROVIDER,
      model: SELECTED_XML_MODEL,
      raw,
    },
    active: true,
  };
}

function meaningSpanRowsFromResult({ semanticRun, window, result, promptHash, outputHash }) {
  const rows = [];
  const paragraphMap = new Map(window.render_paragraphs.map((p) => [p.id, p]));

  for (const pr of Array.isArray(result.paragraphs) ? result.paragraphs : []) {
    const paragraph = paragraphMap.get(pr.paragraph_id) || window.render_paragraphs.find((p) => p.render_para_key === pr.paragraph_id) || null;
    const sourceSpan = sourceSpanForParagraph(paragraph);

    for (const a of pr.archetype_observations || []) {
      rows.push(meaningSpanRow({
        semanticRun,
        family: "archetype",
        spanType: "archetype_observation",
        label: a.archetype,
        subjectName: a.subject_name,
        evidenceText: a.evidence_text,
        interpretation: a.interpretation,
        confidence: a.confidence,
        sourceSpan,
        promptHash,
        outputHash,
        raw: a,
      }));
    }

    for (const b of pr.biblical_references || []) {
      rows.push(meaningSpanRow({
        semanticRun,
        family: "biblical",
        spanType: "biblical_reference",
        label: b.reference_text,
        subjectName: b.book,
        evidenceText: b.evidence_text,
        interpretation: b.interpretation,
        confidence: b.confidence,
        sourceSpan: { ...sourceSpan, biblical_source_span: b.source_span || {} },
        promptHash,
        outputHash,
        raw: b,
      }));
    }

    for (const h of pr.derived_hyperlinks || []) {
      rows.push(meaningSpanRow({
        semanticRun,
        family: "hyperlink",
        spanType: "derived_hyperlink",
        label: [h.theme_node_a, h.theme_node_b].filter(Boolean).join(" ↔ "),
        subjectName: h.edge_type || h.connection_type,
        evidenceText: h.evidence_text,
        interpretation: h.connection_type,
        confidence: h.confidence,
        sourceSpan,
        promptHash,
        outputHash,
        raw: h,
      }));
    }
  }

  for (const d of Array.isArray(result.dualism_relations) ? result.dualism_relations : []) {
    const evidenceText = Array.isArray(d.evidence) ? d.evidence.map((e) => e.evidence_text || "").filter(Boolean).join("\n---\n") : "";
    rows.push(meaningSpanRow({
      semanticRun,
      family: "dualism",
      spanType: "dualism_relation",
      label: d.relation_type || d.shared_substrate,
      subjectName: null,
      evidenceText,
      interpretation: d.interpretation,
      confidence: d.confidence,
      sourceSpan: {
        scene_window_key: window.scene_window_key,
        evidence: d.evidence || [],
        pole_a: d.pole_a || {},
        pole_b: d.pole_b || {},
      },
      promptHash,
      outputHash,
      raw: d,
    }));
  }

  for (const m of Array.isArray(result.archetype_movements) ? result.archetype_movements : []) {
    rows.push(meaningSpanRow({
      semanticRun,
      family: "archetype",
      spanType: "archetype_movement",
      label: m.arc_label,
      subjectName: m.subject_name,
      evidenceText: m.evidence_summary,
      interpretation: m.interpretation,
      confidence: m.confidence,
      sourceSpan: {
        scene_window_key: window.scene_window_key,
        start_paragraph_id: m.start_paragraph_id,
        end_paragraph_id: m.end_paragraph_id,
      },
      promptHash,
      outputHash,
      raw: m,
    }));
  }

  return rows;
}

function emptySemanticResult() {
  return { paragraphs: [], dualism_relations: [], archetype_movements: [] };
}

async function writeSelectedSemanticResult({ semanticRun, window, result, promptHash, outputHash }) {
  const spanRows = meaningSpanRowsFromResult({ semanticRun, window, result, promptHash, outputHash });

  if (!writeMode) {
    console.log(JSON.stringify({
      dry_run_selected_window: window.scene_window_key,
      render_para_keys: window.render_paragraphs.map((p) => p.render_para_key),
      old_semantic_table_writes: "blocked",
      primary_lane: "semantic_meaning_spans",
      paragraph_results: Array.isArray(result.paragraphs) ? result.paragraphs.length : 0,
      dualism_relations: Array.isArray(result.dualism_relations) ? result.dualism_relations.length : 0,
      archetype_movements: Array.isArray(result.archetype_movements) ? result.archetype_movements.length : 0,
      semantic_meaning_spans: spanRows.length,
    }, null, 2));
    return spanRows;
  }

  if (spanRows.length) await insertRows("semantic_meaning_spans?on_conflict=semantic_hash", spanRows);
  return spanRows;
}

async function main() {
  validateProviderSelection();
  validateSources();
  const contextPack = readText(paths.contextPack);
  const chapters = loadPublicChapters();
  const availableNarrativeContextMap = buildAvailableNarrativeContextMap(chapters);
  const { selected, docs } = loadSelectedXmlDocuments();
  const windows = selectedXmlWindows(docs);

  const sourceSummary = {
    context_pack_sha256: NARRATIVE_CONTEXT_SHA256,
    xml_manifest_sha256: XML_MANIFEST_SHA256,
    xml_manifest_count: XML_MANIFEST_COUNT,
    selected_truth_path: selected.path,
    selected_truth_sha256: selected.sha256,
    selected_folder_count: selected.folders.length,
    run_doc_count: docs.length,
    xml_paragraph_count: docs.reduce((sum, doc) => sum + doc.xml_paragraphs.length, 0),
    render_paragraph_count: docs.reduce((sum, doc) => sum + doc.render_paragraphs.length, 0),
    scene_window_count: windows.length,
    public_chapter_context_count: chapters.length,
    available_narrative_context_map: true,
    available_narrative_context_map_sha256: sha256Text(availableNarrativeContextMap),
    selected_xml_driver: true,
    render_segmentation: "xml_plus_novel_grammar_v4",
    primary_hash_lane: "semantic_meaning_spans",
    old_semantic_table_writes: "blocked_on_first_run",
    write_mode: writeMode,
    no_ai: noAi,
    selected_xml_provider: SELECTED_XML_PROVIDER,
    selected_xml_model: SELECTED_XML_MODEL,
  };

  writeFileSync(join(paths.outDir, "source-summary.json"), JSON.stringify(sourceSummary, null, 2));
  writeFileSync(join(paths.outDir, "selected-truth.json"), JSON.stringify(selected, null, 2));
  writeFileSync(join(paths.outDir, "selected-documents.jsonl"), docs.map((doc) => JSON.stringify({
    folder: doc.folder,
    document_path: doc.document_path,
    document_xml_sha256: doc.document_xml_sha256,
    xml_paragraph_count: doc.xml_paragraphs.length,
    render_paragraph_count: doc.render_paragraphs.length,
    scene_window_count: doc.scene_windows.length,
    full_text_sha256: doc.full_text_sha256,
  })).join("\n") + "\n");
  writeFileSync(join(paths.outDir, "render-paragraphs.jsonl"), docs.flatMap((doc) => doc.render_paragraphs).map((p) => JSON.stringify(p)).join("\n") + "\n");
  writeFileSync(join(paths.outDir, "scene-windows.jsonl"), windows.map((w) => JSON.stringify({
    scene_window_key: w.scene_window_key,
    folder: w.folder,
    document_xml_sha256: w.document_xml_sha256,
    render_para_keys: w.render_paragraphs.map((p) => p.render_para_key),
    text_sha256: w.text_sha256,
  })).join("\n") + "\n");

  const semanticRun = await createSemanticRun(sourceSummary);

  if (writeMode) {
    await insertRows("render_paragraphs?on_conflict=render_para_key", renderParagraphRowsForDb(semanticRun, docs));
  }

  let totalProcessed = 0;
  let totalMeaningSpans = 0;

  for (const window of windows) {
    const prompt = buildSelectedXmlPrompt({ contextPack, availableNarrativeContextMap, window });
    const promptHash = sha256Text(prompt);

    writeFileSync(join(paths.outDir, `prompt-selected-${String(totalProcessed).padStart(5, "0")}.txt`), prompt);
    writeFileSync(join(paths.outDir, `prompt-selected-${String(totalProcessed).padStart(5, "0")}.sha256`), `${promptHash}\n`);

    const result = noAi ? emptySemanticResult() : await callSelectedXmlProvider(prompt);
    const outputText = JSON.stringify(result, null, 2);
    const outputHash = sha256Text(outputText);

    writeFileSync(join(paths.outDir, `result-selected-${String(totalProcessed).padStart(5, "0")}.json`), outputText);
    writeFileSync(join(paths.outDir, `result-selected-${String(totalProcessed).padStart(5, "0")}.sha256`), `${outputHash}\n`);

    const spanRows = await writeSelectedSemanticResult({ semanticRun, window, result, promptHash, outputHash });
    totalMeaningSpans += spanRows.length;

    writeFileSync(
      join(paths.outDir, `meaning-spans-selected-${String(totalProcessed).padStart(5, "0")}.jsonl`),
      spanRows.map((r) => JSON.stringify(r)).join("\n") + (spanRows.length ? "\n" : "")
    );

    totalProcessed += 1;

    console.log(JSON.stringify({
      run_id: semanticRun.id,
      selected_xml_driver: true,
      old_semantic_table_writes: "blocked",
      primary_lane: "semantic_meaning_spans",
      window: window.scene_window_key,
      folder: window.folder,
      processed_windows: totalProcessed,
      total_windows: windows.length,
      meaning_spans: totalMeaningSpans,
      no_ai: noAi,
      write_mode: writeMode,
      prompt_hash: promptHash,
      output_hash: outputHash,
    }));
  }

  if (writeMode) {
    await patchRow("semantic_runs", semanticRun.id, {
      status: "completed",
      completed_at: new Date().toISOString(),
      metadata: {
        ...(semanticRun.metadata || {}),
        total_processed_windows: totalProcessed,
        total_meaning_spans: totalMeaningSpans,
        selected_xml_driver: true,
        primary_hash_lane: "semantic_meaning_spans",
        old_semantic_table_writes: "blocked_on_first_run",
      },
    });
  }

  writeFileSync(join(paths.outDir, "run-summary.json"), JSON.stringify({
    run_id: semanticRun.id,
    write_mode: writeMode,
    no_ai: noAi,
    selected_xml_driver: true,
    primary_hash_lane: "semantic_meaning_spans",
    old_semantic_table_writes: "blocked_on_first_run",
    total_processed_windows: totalProcessed,
    total_meaning_spans: totalMeaningSpans,
    narrative_context_sha256: NARRATIVE_CONTEXT_SHA256,
    xml_manifest_sha256: XML_MANIFEST_SHA256,
    provider: noAi ? "none" : SELECTED_XML_PROVIDER,
    model: noAi ? "no-ai" : SELECTED_XML_MODEL,
    sourceSummary,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
