#!/usr/bin/env node
import { createHash } from "node:crypto";
import { readFileSync, existsSync, readdirSync, statSync, mkdirSync, writeFileSync } from "node:fs";
import { join, basename, dirname } from "node:path";

const ROOT = process.cwd();
const RUN_ID = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
const PROMPT_VERSION = "xml-selected-meaning-span-v5";
const NARRATIVE_CONTEXT_SHA256 = "6e7e306c32940db56e82f1aff23942e6f3d62d7483db8e5735bb2ef2ef75eb8c";
const XML_MANIFEST_SHA256 = "6e74a501762c3368a6b3fd421c59d13e0c5da26b5b3e56b8729e0bf29163daf7";
const XML_MANIFEST_COUNT = 195;
const EXPECTED_PUBLIC_CHAPTER_COUNT = 13;
const JUNGIAN_ARCHETYPE_LABELS = [
  "Self",
  "Ego",
  "Shadow",
  "Persona",
  "Anima",
  "Animus",
  "Great Mother",
  "Wise Guide",
  "Trickster",
  "Child",
  "Hero",
  "OrphanExile",
];
const JUNGIAN_MOVEMENTS = [
  "fragmentation",
  "inflation",
  "descent",
  "ordeal",
  "projection",
  "persona_fracture",
  "shadow_confrontation",
  "anima_animus_encounter",
  "integration",
  "emergence_of_self",
];
const BIBLICAL_RELATIONSHIP_TYPES = [
  "direct_citation",
  "explicit_allusion",
  "verbal_echo",
  "narrative_parallel",
  "typological_correspondence",
  "inversion",
  "symbolic_resonance",
];
const CONTROLLED_SUBJECT_PLACEHOLDERS = [
  "unresolved_male_figure",
  "unresolved_female_figure",
  "narrator",
  "collective",
];

const argv = process.argv.slice(2);
const args = new Set(argv);
const writeMode = args.has("--write");
const resumeMode = args.has("--resume");
const registerSources = args.has("--register-sources");
const noAi = args.has("--no-ai");
const submitBatch = args.has("--submit-batch");
const fullRunConfirm = args.has("--full-run-confirm");

const limitArg = argv.find((x) => x.startsWith("--limit="));
const chapterArg = argv.find((x) => x.startsWith("--chapter="));
const batchArg = argv.find((x) => x.startsWith("--batch-size="));
const limitDocsArg = argv.find((x) => x.startsWith("--limit-docs="));
const selectedTruthArg = argv.find((x) => x.startsWith("--selected-truth="));
const providerArg = argv.find((x) => x.startsWith("--provider="));
const pollBatchArg = argv.find((x) => x.startsWith("--poll-batch="));
const importBatchResultsArg = argv.find((x) => x.startsWith("--import-batch-results="));

const LIMIT = limitArg ? Number(limitArg.split("=")[1]) : null;
const CHAPTER_FILTER = chapterArg ? Number(chapterArg.split("=")[1]) : null;
const BATCH_SIZE = batchArg ? Number(batchArg.split("=")[1]) : 8;
const LIMIT_DOCS = limitDocsArg ? Number(limitDocsArg.split("=")[1]) : null;
const SELECTED_TRUTH_OVERRIDE = selectedTruthArg ? selectedTruthArg.split("=").slice(1).join("=") : "";
const PROVIDER = providerArg ? providerArg.split("=").slice(1).join("=") : (process.env.SEMANTIC_PROVIDER || "ollama");
const POLL_BATCH_ID = pollBatchArg ? pollBatchArg.split("=").slice(1).join("=") : "";
const IMPORT_BATCH_RESULTS_PATH = importBatchResultsArg ? importBatchResultsArg.split("=").slice(1).join("=") : "";

const paths = {
  contextPack: join(ROOT, "docs/agent_context/source_drop/hasher_context_v1/narrative_context_pack_v1.txt"),
  archetypeProtocolCatGod: join(ROOT, "docs/agent_context/source_drop/hasher_context_v1/01_archetype_protocol_cat_god_primal_self.txt"),
  archetypeProtocolVisceral: join(ROOT, "docs/agent_context/source_drop/hasher_context_v1/02_archetype_protocol_visceral_empathy.txt"),
  compendium: join(ROOT, "docs/agent_context/source_drop/hasher_context_v1/03_master_compendium_singularity.txt"),
  synopsis: join(ROOT, "docs/agent_context/source_drop/hasher_context_v1/04_new_synopsis_the_weight_of_the_sky.txt"),
  referenceBibleDir: join(ROOT, "docs/agent_context/canonical/reference_corpora/bible"),
  referenceJungDir: join(ROOT, "docs/agent_context/canonical/reference_corpora/jung"),
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
// Data-plane: PostgREST REST API (runtime writes). Falls back to constructing from PROJECT_REF.
const SUPABASE_URL = env("SUPABASE_URL", SUPABASE_PROJECT_REF ? `https://${SUPABASE_PROJECT_REF}.supabase.co` : "");
// Service role key for data-plane writes (not the Management PAT).
const SUPABASE_SERVICE_KEY = env("SUPABASE_SERVICE_ROLE_KEY", env("SUPABASE_SECRET_KEY", ""));
const OLLAMA_BASE_URL = env("OLLAMA_BASE_URL", "http://localhost:11434");
const OLLAMA_MODEL = env("OLLAMA_MODEL", env("SEMANTIC_MODEL", "llama3.2:1b"));
const OLLAMA_CACHE_PATH = env("OLLAMA_CACHE_PATH", join(ROOT, "docs/forensics/audits/ollama-result-cache.json"));
const OLLAMA_CONTEXT_CHARS = Number(process.env.OLLAMA_CONTEXT_CHARS || 2400);
const GEMINI_MODEL = env("SEMANTIC_MODEL", env("VERTEX_MODEL", "gemini-2.5-flash-lite"));
const PROVIDER_MODEL = PROVIDER === "gemini_sync" ? GEMINI_MODEL : OLLAMA_MODEL;

function validateSources() {
  must(existsSync(paths.contextPack), `Missing context pack: ${paths.contextPack}`);
  must(existsSync(paths.archetypeProtocolCatGod), `Missing archetype protocol: ${paths.archetypeProtocolCatGod}`);
  must(existsSync(paths.archetypeProtocolVisceral), `Missing archetype protocol: ${paths.archetypeProtocolVisceral}`);
  must(existsSync(paths.compendium), `Missing compendium: ${paths.compendium}`);
  must(existsSync(paths.synopsis), `Missing synopsis: ${paths.synopsis}`);
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


function isRetryableProviderError(error) {
  const text = String(error?.message || error || "");
  return /(?:\b408\b|\b409\b|\b429\b|\b500\b|\b502\b|\b503\b|\b504\b|rate limit|overloaded|temporar|timeout|ECONNRESET|ETIMEDOUT|fetch failed|network|ollama not running)/i.test(text);
}

function providerRetryDelayMs(attempt) {
  const base = Number(process.env.PROVIDER_RETRY_BASE_MS || 5000);
  const max = Number(process.env.PROVIDER_RETRY_MAX_MS || 60000);
  const jitter = Math.floor(Math.random() * 1500);
  return Math.min(max, base * Math.pow(2, Math.max(0, attempt - 1)) + jitter);
}

function dbRetryDelayMs(attempt) {
  const jitter = Math.floor(Math.random() * 1000);
  return Math.min(30000, 2000 * Math.pow(2, Math.max(0, attempt - 1)) + jitter);
}

// Validates the Supabase service_role key format and returns PostgREST auth headers.
// Throws with explicit guidance if the key is missing or is the wrong credential type.
function classifyServiceKey(key) {
  if (!key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY not set. " +
      "Open Supabase Dashboard → Settings → API Keys → Legacy API Keys → service_role. " +
      "Do NOT use Settings → JWT Keys → Legacy JWT Secret."
    );
  }
  if (key.startsWith("sbp_")) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY looks like a Management API personal access token (starts with sbp_). " +
      "Open Supabase Dashboard → Settings → API Keys → Legacy API Keys → service_role. " +
      "Do NOT use Settings → JWT Keys → Legacy JWT Secret."
    );
  }
  if (key.startsWith("sb_publishable_")) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY looks like an anon/publishable key (starts with sb_publishable_). " +
      "Open Supabase Dashboard → Settings → API Keys → Legacy API Keys → service_role. " +
      "Do NOT use Settings → JWT Keys → Legacy JWT Secret."
    );
  }
  // Expect a JWT: 3 base64url dot-separated parts
  const parts = key.split(".");
  if (parts.length !== 3) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY does not look like a JWT (expected header.payload.signature). " +
      "Open Supabase Dashboard → Settings → API Keys → Legacy API Keys → service_role. " +
      "Do NOT use Settings → JWT Keys → Legacy JWT Secret — that is the HMAC signing secret, not a JWT."
    );
  }
  // Decode payload and verify role without logging the key value
  try {
    const padded = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(Buffer.from(padded, "base64").toString("utf8"));
    if (payload.role && payload.role !== "service_role") {
      throw new Error(
        `SUPABASE_SERVICE_ROLE_KEY JWT has role="${payload.role}", expected "service_role". ` +
        "Open Supabase Dashboard → Settings → API Keys → Legacy API Keys → service_role. " +
        "Do NOT use Settings → JWT Keys → Legacy JWT Secret."
      );
    }
  } catch (err) {
    if (err.message.includes("service_role") || err.message.includes("role=")) throw err;
    // Malformed payload — let it through; PostgREST will 401 with the server's own message
  }
  return {
    "apikey": key,
    "Authorization": `Bearer ${key}`,
  };
}

async function jsonFetch(url, { method = "POST", headers = {}, body = null } = {}) {
  const res = await fetch(url, {
    method,
    headers,
    body,
  });
  const rawText = await res.text();
  let json = null;
  try {
    json = rawText ? JSON.parse(rawText) : null;
  } catch {
    json = null;
  }
  return { res, rawText, json };
}


async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// PostgREST data-plane adapter. Never logs auth header values.
// Retries transient HTTP and network errors with exponential backoff (up to 6 attempts).
// Cloudflare/proxy HTML bodies are detected and classified as transient_gateway_error.
async function dataPlaneRequest(path, { method = "GET", body = null, prefer = null } = {}) {
  must(SUPABASE_URL, "SUPABASE_URL not set and SUPABASE_PROJECT_REF not set — cannot connect to Supabase data plane. Set SUPABASE_URL or SUPABASE_PROJECT_REF secret/var.");
  const authHeaders = classifyServiceKey(SUPABASE_SERVICE_KEY);

  const url = `${SUPABASE_URL}/rest/v1/${path}`;
  const headers = {
    ...authHeaders,
    "Content-Type": "application/json",
    "Accept": "application/json",
  };
  if (prefer) headers["Prefer"] = prefer;

  const MAX_ATTEMPTS = 6;
  let lastError = null;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const t0 = Date.now();
    try {
      const res = await fetch(url, {
        method,
        headers,
        body: body !== null ? JSON.stringify(body) : null,
        signal: AbortSignal.timeout(30000),
      });
      const rawText = await res.text();
      const elapsed = Date.now() - t0;
      const looksLikeHtml = rawText.trimStart().startsWith("<");
      const isTransientStatus = [429, 500, 502, 503, 504].includes(res.status);

      if (looksLikeHtml || isTransientStatus) {
        const reason = looksLikeHtml ? "transient_gateway_error_html" : `http_${res.status}`;
        lastError = new Error(`supabase_data_plane_${reason}: ${method} ${path} status=${res.status}`);
        if (attempt < MAX_ATTEMPTS) {
          console.warn(JSON.stringify({ event: "db_retry", path, operation: method, attempt, elapsed_ms: elapsed, status: res.status, reason, db_adapter: "supabase_data_plane" }));
          await sleep(dbRetryDelayMs(attempt));
          continue;
        }
        throw lastError;
      }

      if (!res.ok) {
        throw new Error(`supabase_data_plane_error: ${method} /rest/v1/${path} → ${res.status}: ${rawText.slice(0, 600)}`);
      }

      if (!rawText || rawText === "null") return [];
      try {
        const json = JSON.parse(rawText);
        return Array.isArray(json) ? json : (json ? [json] : []);
      } catch {
        return [];
      }
    } catch (err) {
      if (err === lastError) throw err;
      const isNet = /ECONNRESET|ETIMEDOUT|fetch failed|network|AbortError|TimeoutError/i.test(String(err.message) + String(err.name || ""));
      if (isNet && attempt < MAX_ATTEMPTS) {
        console.warn(JSON.stringify({ event: "db_retry", path, operation: method, attempt, reason: String(err.message).slice(0, 200), db_adapter: "supabase_data_plane" }));
        await sleep(dbRetryDelayMs(attempt));
        continue;
      }
      throw err;
    }
  }
}

// managementQuery: Supabase Management API SQL endpoint.
// MIGRATION/CONTROL-PLANE ONLY. Must NOT be called in sync_write hot path.
// Runtime data writes use dataPlaneRequest (PostgREST) instead.
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
  semantic_archetype_anchors: {
    anchor_key: "text",
    canonical_label: "text",
    ontology_family: "text",
    ontology_version: "text",
    metadata: "jsonb",
    active: "boolean",
  },
  semantic_biblical_anchors: {
    semantic_run_id: "uuid",
    anchor_key: "text",
    biblical_anchor_label: "text",
    book: "text",
    chapter: "integer",
    verse_start: "integer",
    verse_end: "integer",
    motif_family: "text",
    metadata: "jsonb",
    active: "boolean",
  },
  semantic_crosslinks: {
    semantic_run_id: "uuid",
    crosslink_key: "text",
    scene_window_id: "text",
    source_doc_id: "text",
    relation_family: "text",
    relation_type: "text",
    left_family: "text",
    left_span_key: "text",
    left_anchor_key: "text",
    right_family: "text",
    right_span_key: "text",
    right_anchor_key: "text",
    evidence_text: "text",
    evidence_sha256: "text",
    source_span: "jsonb",
    rationale: "text",
    confidence: "numeric",
    prompt_sha256: "text",
    model_output_sha256: "text",
    semantic_hash: "text",
    metadata: "jsonb",
    active: "boolean",
  },
  semantic_run_artifacts: {
    semantic_run_id: "uuid",
    artifact_key: "text",
    artifact_type: "text",
    artifact_path: "text",
    artifact_sha256: "text",
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
  semantic_window_task_checkpoints: {
    checkpoint_key: "text",
    source_doc_folder: "text",
    source_document_xml_sha256: "text",
    scene_window_id: "text",
    task_name: "text",
    provider: "text",
    model: "text",
    prompt_version: "text",
    prompt_sha256: "text",
    status: "text",
    semantic_run_id: "uuid",
    attempt_count: "integer",
    result_count: "integer",
    last_error_type: "text",
    last_error_message: "text",
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


// Returns the allowed insert columns for a table from the static schema manifest.
// This eliminates Management API information_schema queries from the hot path.
function getStaticTableColumns(tableName) {
  const schema = TABLE_SCHEMAS[tableName];
  return schema ? new Set(Object.keys(schema)) : new Set();
}

// Synchronous — no longer calls Management API. Uses TABLE_SCHEMAS allowlist.
function normalizeRowsForLiveSchema(tableArg, rows) {
  if (!rows?.length) return rows;
  const { tableName } = parseTableArg(tableArg);
  const liveColumns = getStaticTableColumns(tableName);
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

// Runtime insert via PostgREST data plane (NOT Management API).
// Uses TABLE_SCHEMAS allowlist; unknown columns are dropped to metadata.
// Returns inserted rows only for tables that need the generated id (semantic_runs).
async function insertRows(tableArg, rows, _chunkSize = 100) {
  rows = normalizeRowsForLiveSchema(tableArg, rows); // now sync

  if (tableArg === "archetype_observations") {
    rows = rows.map((row) => ({ ...row, active: row.active ?? true }));
  }

  if (!rows.length) return [];

  const { tableName, onConflict } = parseTableArg(tableArg);
  const schema = TABLE_SCHEMAS[tableName];
  if (!schema) throw new Error(`insertRows table not allowed: ${tableName}`);

  const allCols = Object.keys(schema);
  // Only semantic_runs needs return=representation to get the auto-generated id.
  const needsReturn = tableName === "semantic_runs";
  const returnPref = needsReturn ? "return=representation" : "return=minimal";
  const prefer = onConflict ? `resolution=merge-duplicates,${returnPref}` : returnPref;

  const path = onConflict ? `${tableName}?on_conflict=${encodeURIComponent(onConflict)}` : tableName;
  const chunkSize = 100;
  const out = [];

  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize).map((row) => {
      const clean = {};
      for (const col of allCols) {
        const v = coerceForSql(row[col], schema[col]);
        if (v !== null && v !== undefined) clean[col] = v;
      }
      return clean;
    });

    const inserted = await dataPlaneRequest(path, { method: "POST", body: chunk, prefer });
    if (needsReturn && Array.isArray(inserted)) out.push(...inserted);
  }

  return out;
}

// Checkpoint helpers — keyed on (folder, scene_window_id, task, prompt_version, provider, model)
// so changing any of those forces a re-run of the affected windows.
function makeCheckpointKey(folder, sceneWindowId, taskName) {
  return sha256Text([folder, sceneWindowId, taskName, PROMPT_VERSION, CANONICAL_PROVIDER, PROVIDER_MODEL].join("|"));
}

async function loadCompletedCheckpoints() {
  if (!writeMode || !resumeMode) return new Set();
  try {
    const keys = new Set();
    let offset = 0;
    const pageSize = 1000;
    while (true) {
      const path =
        `semantic_window_task_checkpoints` +
        `?prompt_version=eq.${encodeURIComponent(PROMPT_VERSION)}` +
        `&provider=eq.${encodeURIComponent(CANONICAL_PROVIDER)}` +
        `&model=eq.${encodeURIComponent(PROVIDER_MODEL)}` +
        `&status=in.(completed,empty)` +
        `&select=checkpoint_key` +
        `&limit=${pageSize}&offset=${offset}`;
      const rows = await dataPlaneRequest(path);
      for (const r of rows) if (r.checkpoint_key) keys.add(r.checkpoint_key);
      if (rows.length < pageSize) break;
      offset += pageSize;
    }
    console.log(JSON.stringify({
      event: "checkpoint_load",
      resume_mode: true,
      count: keys.size,
      prompt_version: PROMPT_VERSION,
      provider: CANONICAL_PROVIDER,
      model: PROVIDER_MODEL,
    }));
    return keys;
  } catch (err) {
    console.warn(JSON.stringify({ event: "checkpoint_load_warn", error: String(err).slice(0, 300) }));
    return new Set();
  }
}

async function upsertWindowCheckpoints({ semanticRun, window, taskPackets }) {
  if (!writeMode || !resumeMode) return;
  const rows = taskPackets
    .filter((p) => p.status === "ok" || p.status === "empty")
    .map((p) => ({
      checkpoint_key: makeCheckpointKey(window.folder, window.scene_window_id, p.task),
      source_doc_folder: window.folder,
      source_document_xml_sha256: window.document_xml_sha256 ?? "",
      scene_window_id: window.scene_window_id,
      task_name: p.task,
      provider: CANONICAL_PROVIDER,
      model: PROVIDER_MODEL,
      prompt_version: PROMPT_VERSION,
      prompt_sha256: p.promptHash ?? "",
      status: p.status === "ok" ? "completed" : "empty",
      semantic_run_id: semanticRun.id,
      attempt_count: 1,
      result_count: p.accepted_observations.length,
    }));
  if (!rows.length) return;
  await insertRows(
    "semantic_window_task_checkpoints?on_conflict=checkpoint_key",
    rows
  ).catch((err) => {
    console.warn(JSON.stringify({ event: "checkpoint_write_warn", error: String(err).slice(0, 300) }));
  });
}

// Runtime row update via PostgREST data plane (NOT Management API).
async function patchRow(tableName, id, body) {
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableName)) throw new Error(`Unsafe table name: ${tableName}`);
  const schema = PATCH_SCHEMAS[tableName];
  if (!schema) throw new Error(`patchRow table not allowed: ${tableName}`);
  if (!id) throw new Error(`patchRow missing id for ${tableName}`);

  const cols = Object.keys(body).filter((col) => schema[col]);
  if (!cols.length) return [];

  const clean = {};
  for (const col of cols) clean[col] = coerceForSql(body[col], schema[col]);

  const path = `${tableName}?id=eq.${encodeURIComponent(id)}`;
  return dataPlaneRequest(path, { method: "PATCH", body: clean, prefer: "return=minimal" });
}

async function createSemanticRun(sourceSummary) {
  if (!writeMode) {
    return {
      id: `dry-run-${RUN_ID}`,
      status: "dry_run",
      provider: PROVIDER,
      model: PROVIDER_MODEL,
      prompt_version: PROMPT_VERSION,
      narrative_context_sha256: NARRATIVE_CONTEXT_SHA256,
      xml_manifest_sha256: XML_MANIFEST_SHA256,
      xml_manifest_count: XML_MANIFEST_COUNT,
    };
  }

  const rows = await insertRows("semantic_runs", [{
    status: "running",
    provider: PROVIDER,
    model: PROVIDER_MODEL,
    prompt_version: PROMPT_VERSION,
    narrative_context_sha256: NARRATIVE_CONTEXT_SHA256,
    xml_manifest_sha256: XML_MANIFEST_SHA256,
    xml_manifest_count: XML_MANIFEST_COUNT,
    source_summary: sourceSummary,
    reset_policy: "supersede_by_semantic_run_id",
    metadata: { run_id: RUN_ID, script: "scripts/semantic/xml-selected-meaning-span-rehash.mjs", derived_from: "xml-grounded-vertex-rehash.mjs", db_write_mode: "supabase_data_plane", db_adapter: "supabase_data_plane", management_api_hot_path: false, selected_xml_driver: true, primary_hash_lane: "semantic_meaning_spans", old_semantic_table_writes: "blocked_on_first_run", semantic_provider: ORIGINAL_PROVIDER, canonical_provider: CANONICAL_PROVIDER },
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

function loadNarrativeContextSources() {
  return [
    { role: "archetype_protocol", key: "cat_god_primal_self", path: paths.archetypeProtocolCatGod },
    { role: "archetype_protocol", key: "visceral_empathy", path: paths.archetypeProtocolVisceral },
    { role: "story_compendium", key: "master_compendium", path: paths.compendium },
    { role: "new_synopsis", key: "new_synopsis", path: paths.synopsis },
  ].map((entry) => ({
    ...entry,
    sha256: sha256File(entry.path),
    content: readText(entry.path),
  }));
}

function optionalReferenceCorpusStatus() {
  const manifests = [
    {
      corpus: "bible",
      expected_dir: paths.referenceBibleDir,
      expected_manifest: join(paths.referenceBibleDir, "manifest.json"),
    },
    {
      corpus: "jung",
      expected_dir: paths.referenceJungDir,
      expected_manifest: join(paths.referenceJungDir, "manifest.json"),
    },
  ];

  return manifests.map((entry) => ({
    corpus: entry.corpus,
    expected_dir: entry.expected_dir,
    expected_manifest: entry.expected_manifest,
    manifest_present: existsSync(entry.expected_manifest),
    dir_present: existsSync(entry.expected_dir),
  }));
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
    const clean = normalizeContextSnippet(chapter.content);
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
This is not the full manuscript text. It contains the available public chapter corpus
loaded from public/data/chapters at runtime.
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


const TASK_ORDER = [
  "meaning_spans",
  "dualisms",
  "archetypes",
  "biblical_references",
  "hyperlinks_parallelisms",
];

const ALLOW_FAILURE_CONTINUE = args.has("--allow-failure-continue");
const MIN_SEMANTIC_WINDOW_WORDS = Number(process.env.MIN_SEMANTIC_WINDOW_WORDS || 4);
const MIN_SEMANTIC_WINDOW_CHARS = Number(process.env.MIN_SEMANTIC_WINDOW_CHARS || 20);
const FAIL_FAST_INITIAL_SEMANTIC_WINDOWS = 10;
const FAIL_FAST_INITIAL_FAILED_TASKS = 20;
const FAIL_FAST_CONSECUTIVE_FAILED_WINDOWS = 5;
const FAIL_FAST_TASK_SAMPLE = 20;
const FAIL_FAST_TASK_FAILURE_RATE = 0.5;
const PROVIDER_CHOICES = new Set(["ollama", "ollama_actions", "local_actions_ollama", "free_local", "free_local_ollama", "gemini_sync", "openai_batch", "openai_sync", "anthropic_batch", "anthropic_sync"]);
const BATCH_COMPLETION_WINDOW = env("SEMANTIC_BATCH_COMPLETION_WINDOW", "24h");

must(PROVIDER_CHOICES.has(PROVIDER), `Unsupported provider: ${PROVIDER}. Supported: ${[...PROVIDER_CHOICES].join(", ")}`);

function isBatchProvider(provider = PROVIDER) {
  return provider.endsWith("_batch");
}

const OLLAMA_PROVIDERS = new Set(["ollama", "ollama_actions", "local_actions_ollama", "free_local", "free_local_ollama"]);
// Canonical model runner (routing); preserve original for metadata/display.
const ORIGINAL_PROVIDER = PROVIDER;
const CANONICAL_PROVIDER = OLLAMA_PROVIDERS.has(PROVIDER) ? "ollama" : PROVIDER;

function isSyncProvider(provider = PROVIDER) {
  return OLLAMA_PROVIDERS.has(provider) || provider.endsWith("_sync");
}

function batchOperationMode() {
  if (POLL_BATCH_ID) return "poll";
  if (IMPORT_BATCH_RESULTS_PATH) return "import";
  if (submitBatch) return "submit";
  if (isBatchProvider()) return "prepare";
  return "sync";
}

const CONTEXT_STOPWORDS = new Set([
  "about", "after", "again", "against", "almost", "along", "also", "among", "another", "because",
  "before", "being", "between", "could", "every", "first", "from", "great", "their", "there",
  "these", "those", "through", "under", "until", "where", "which", "while", "would", "shall",
  "should", "might", "still", "into", "over", "with", "that", "this", "have", "were", "them",
  "they", "then", "than", "only", "when", "what", "your", "ours", "ourselves", "himself",
  "herself", "because", "whose", "been", "being", "some", "more", "most", "much", "many",
  "each", "such", "very", "here", "upon", "into", "said", "says", "dont", "does", "did",
]);

function compactWhitespace(value, max = 400) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  return text.length > max ? text.slice(0, max).trim() : text;
}

function clamp01(value, fallback = 0.5) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  if (n < 0) return 0;
  if (n > 1) return 1;
  return n;
}

function maybeText(value, max = 240) {
  const text = compactWhitespace(value, max);
  return text || null;
}

function requiredText(value, label, max = 240) {
  const text = compactWhitespace(value, max);
  if (!text) throw new Error(`Missing ${label}`);
  return text;
}

function slugifyToken(value, fallback = "unspecified") {
  const slug = String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return slug || fallback;
}

function normalizeEnum(value, allowed, fallback, aliases = {}) {
  const key = slugifyToken(value, "");
  const mapped = aliases[key] || key;
  if (mapped && allowed.includes(mapped)) return mapped;
  return fallback;
}

function maybeInteger(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = Number.parseInt(String(value), 10);
  return Number.isFinite(n) ? n : null;
}

function uniqueBy(items, keyFn) {
  const seen = new Set();
  const out = [];
  for (const item of items) {
    const key = keyFn(item);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function normalizeSmartPunctuationChar(ch) {
  return ({
    "\u2018": "'",
    "\u2019": "'",
    "\u201c": '"',
    "\u201d": '"',
    "\u2013": "-",
    "\u2014": "-",
    "\u00a0": " ",
  })[ch] || ch;
}

function normalizeEdgePunctuation(text) {
  return String(text || "")
    .replace(/^[\s"'“”‘’.,;:!?()[\]{}-]+/g, "")
    .replace(/[\s"'“”‘’.,;:!?()[\]{}-]+$/g, "")
    .trim();
}

function buildSearchableText(text, { lowercase = false } = {}) {
  let out = "";
  const map = [];
  let pendingSpace = false;

  for (let i = 0; i < String(text || "").length; i++) {
    let ch = normalizeSmartPunctuationChar(String(text || "")[i]);
    if (/\s/.test(ch)) {
      pendingSpace = out.length > 0;
      continue;
    }
    if (pendingSpace) {
      out += " ";
      map.push(i);
      pendingSpace = false;
    }
    if (lowercase) ch = ch.toLowerCase();
    out += ch;
    map.push(i);
  }

  return { text: out.trimEnd(), map };
}

function resolveNormalizedQuoteMatch(hay, quote) {
  const variants = uniqueBy([
    String(quote || ""),
    normalizeEdgePunctuation(quote),
  ].filter(Boolean), (value) => value);

  for (const variant of variants) {
    const exact = hay.indexOf(variant);
    if (exact >= 0) {
      return { start: exact, end: exact + variant.length, exactQuote: hay.slice(exact, exact + variant.length) };
    }

    const exactLower = hay.toLowerCase().indexOf(variant.toLowerCase());
    if (exactLower >= 0) {
      return {
        start: exactLower,
        end: exactLower + variant.length,
        exactQuote: hay.slice(exactLower, exactLower + variant.length),
      };
    }

    for (const lowercase of [false, true]) {
      const haySearch = buildSearchableText(hay, { lowercase });
      const quoteSearch = buildSearchableText(variant, { lowercase });
      const idx = haySearch.text.indexOf(quoteSearch.text);
      if (idx < 0) continue;

      const start = haySearch.map[idx];
      const endMapIndex = idx + quoteSearch.text.length - 1;
      const end = haySearch.map[endMapIndex] + 1;
      return { start, end, exactQuote: hay.slice(start, end) };
    }
  }

  return null;
}

function semanticWordCount(text) {
  return String(text || "")
    .split(/\s+/)
    .map((word) => word.replace(/[^A-Za-z0-9']/g, ""))
    .filter((word) => word.length > 0)
    .length;
}

const GENERIC_SUBJECT_SLUGS = new Set([
  "the_man",
  "the_woman",
  "the_boy",
  "the_girl",
  "the_child",
  "the_father",
  "the_mother",
  "the_son",
  "the_daughter",
  "the_traveler",
  "the_vendor",
  "the_narrator",
  "a_man",
  "a_woman",
  "a_boy",
  "a_girl",
  "a_child",
  "man",
  "woman",
  "boy",
  "girl",
  "child",
  "traveler",
  "vendor",
  "father",
  "mother",
  "son",
  "daughter",
]);

const SUBJECT_STOPWORDS = new Set([
  "Chapter",
  "The",
  "This",
  "That",
  "These",
  "Those",
  "And",
  "But",
  "For",
  "With",
  "From",
  "Into",
  "Upon",
  "When",
  "Where",
  "While",
  "After",
  "Before",
  "Narrative",
  "Context",
  "Source",
  "Packet",
  "He",
  "His",
  "Her",
  "Him",
  "She",
  "They",
  "Them",
  "Their",
  "All",
  "Every",
  "Here",
  "Not",
  "Internal",
  "Father",
  "Mother",
  "Lord",
  "Lords",
  "God",
  "Goddess",
  "King",
  "Queen",
  "Dreamscape",
  "Earth",
  "Pit",
  "Flies",
  "Sacrifice",
  "Pride",
]);

const JUNGIAN_ARCHETYPE_ALIASES = {
  self: "Self",
  true_self: "Self",
  integrated_self: "Self",
  ego: "Ego",
  selfhood: "Self",
  shadow: "Shadow",
  dark_shadow: "Shadow",
  consuming_shadow: "Shadow",
  persona: "Persona",
  mask: "Persona",
  anima: "Anima",
  animus: "Animus",
  great_mother: "Great Mother",
  mother: "Great Mother",
  wise_guide: "Wise Guide",
  guide: "Wise Guide",
  mentor: "Wise Guide",
  witness_guide: "Wise Guide",
  trickster: "Trickster",
  child: "Child",
  shadow_child: "Child",
  hero: "Hero",
  redeemer: "Hero",
  healer: "Hero",
  orphan: "OrphanExile",
  exile: "OrphanExile",
  orphan_exile: "OrphanExile",
};

const JUNGIAN_MOVEMENT_ALIASES = {
  confrontation: "shadow_confrontation",
  ascent: "emergence_of_self",
  sacrifice: "ordeal",
  rebirth: "emergence_of_self",
  revelation: "emergence_of_self",
  judgment: "ordeal",
  return: "integration",
  fragmentation: "fragmentation",
  integration: "integration",
  descent: "descent",
  inflation: "inflation",
  projection: "projection",
  persona_fracture: "persona_fracture",
  shadow_confrontation: "shadow_confrontation",
  anima_animus_encounter: "anima_animus_encounter",
  emergence_of_self: "emergence_of_self",
};

const BIBLICAL_RELATIONSHIP_ALIASES = {
  direct: "direct_citation",
  direct_citation: "direct_citation",
  citation: "direct_citation",
  explicit: "explicit_allusion",
  explicit_allusion: "explicit_allusion",
  allusion: "explicit_allusion",
  verbal_echo: "verbal_echo",
  echo: "verbal_echo",
  narrative_parallel: "narrative_parallel",
  parallel: "narrative_parallel",
  typological: "typological_correspondence",
  typological_allusion: "typological_correspondence",
  typological_correspondence: "typological_correspondence",
  type_antitype: "typological_correspondence",
  inversion: "inversion",
  symbolic: "symbolic_resonance",
  symbolic_allusion: "symbolic_resonance",
  symbolic_resonance: "symbolic_resonance",
};

const BIBLICAL_BOOK_ALIASES = {
  genesis: "Genesis",
  gen: "Genesis",
  ge: "Genesis",
  exodus: "Exodus",
  exod: "Exodus",
  ex: "Exodus",
  leviticus: "Leviticus",
  lev: "Leviticus",
  numbers: "Numbers",
  num: "Numbers",
  nums: "Numbers",
  deuteronomy: "Deuteronomy",
  deut: "Deuteronomy",
  deutero: "Deuteronomy",
  joshua: "Joshua",
  josh: "Joshua",
  judges: "Judges",
  judg: "Judges",
  jdg: "Judges",
  ruth: "Ruth",
  ru: "Ruth",
  "1_samuel": "1 Samuel",
  "1_sam": "1 Samuel",
  "1sa": "1 Samuel",
  "2_samuel": "2 Samuel",
  "2_sam": "2 Samuel",
  "2sa": "2 Samuel",
  "1_kings": "1 Kings",
  "1_kgs": "1 Kings",
  "1_ki": "1 Kings",
  "2_kings": "2 Kings",
  "2_kgs": "2 Kings",
  "2_ki": "2 Kings",
  "1_chronicles": "1 Chronicles",
  "1_chr": "1 Chronicles",
  "2_chronicles": "2 Chronicles",
  "2_chr": "2 Chronicles",
  psalm: "Psalm",
  psalms: "Psalm",
  psa: "Psalm",
  ps: "Psalm",
  proverbs: "Proverbs",
  prov: "Proverbs",
  ecclesiastes: "Ecclesiastes",
  eccl: "Ecclesiastes",
  ecc: "Ecclesiastes",
  isaiah: "Isaiah",
  isa: "Isaiah",
  jeremiah: "Jeremiah",
  jer: "Jeremiah",
  ezek: "Ezekiel",
  ezekiel: "Ezekiel",
  daniel: "Daniel",
  dan: "Daniel",
  hosea: "Hosea",
  hos: "Hosea",
  joel: "Joel",
  amos: "Amos",
  obadiah: "Obadiah",
  obad: "Obadiah",
  jonah: "Jonah",
  jon: "Jonah",
  micah: "Micah",
  mic: "Micah",
  nahum: "Nahum",
  nah: "Nahum",
  habakkuk: "Habakkuk",
  hab: "Habakkuk",
  zephaniah: "Zephaniah",
  zeph: "Zephaniah",
  haggai: "Haggai",
  hag: "Haggai",
  zechariah: "Zechariah",
  zech: "Zechariah",
  malachi: "Malachi",
  mal: "Malachi",
  matthew: "Matthew",
  matt: "Matthew",
  mt: "Matthew",
  mark: "Mark",
  mk: "Mark",
  luke: "Luke",
  lk: "Luke",
  john: "John",
  jn: "John",
  acts: "Acts",
  act: "Acts",
  romans: "Romans",
  rom: "Romans",
  "1_corinthians": "1 Corinthians",
  "1_cor": "1 Corinthians",
  "2_corinthians": "2 Corinthians",
  "2_cor": "2 Corinthians",
  corinthians: "Corinthians",
  galatians: "Galatians",
  gal: "Galatians",
  ephesians: "Ephesians",
  eph: "Ephesians",
  philippians: "Philippians",
  phil: "Philippians",
  colossians: "Colossians",
  col: "Colossians",
  "1_thessalonians": "1 Thessalonians",
  "1_thess": "1 Thessalonians",
  "2_thessalonians": "2 Thessalonians",
  "2_thess": "2 Thessalonians",
  thessalonians: "Thessalonians",
  "1_timothy": "1 Timothy",
  "1_tim": "1 Timothy",
  "2_timothy": "2 Timothy",
  "2_tim": "2 Timothy",
  timothy: "Timothy",
  titus: "Titus",
  tit: "Titus",
  philemon: "Philemon",
  phlm: "Philemon",
  phm: "Philemon",
  hebrews: "Hebrews",
  heb: "Hebrews",
  james: "James",
  jas: "James",
  "1_peter": "1 Peter",
  "1_pet": "1 Peter",
  "2_peter": "2 Peter",
  "2_pet": "2 Peter",
  peter: "Peter",
  "1_john": "1 John",
  "1_jn": "1 John",
  "2_john": "2 John",
  "2_jn": "2 John",
  "3_john": "3 John",
  "3_jn": "3 John",
  jude: "Jude",
  revelation: "Revelation",
  rev: "Revelation",
};

let cachedStaticSubjectResolutionCounts = null;

function extractNamedEntities(text) {
  return uniqueBy((String(text || "").match(/\b[A-Z][a-z]{2,}(?:'[A-Za-z]+)?\b/g) || [])
    .map((token) => token.replace(/'s$/i, ""))
    .filter((token) => !SUBJECT_STOPWORDS.has(token)), (token) => token);
}

function countNamedEntities(text) {
  const counts = new Map();
  for (const token of extractNamedEntities(text)) {
    counts.set(token, (counts.get(token) || 0) + 1);
  }
  return counts;
}

function getStaticSubjectResolutionCounts({ chapters, narrativeSources, contextPack }) {
  if (cachedStaticSubjectResolutionCounts) return cachedStaticSubjectResolutionCounts;
  const counts = new Map();
  const texts = [
    ...chapters.map((chapter) => chapter.content),
    ...narrativeSources.map((source) => source.content),
    contextPack,
  ];
  for (const text of texts) {
    const localCounts = countNamedEntities(text);
    for (const [token, tokenCount] of localCounts.entries()) {
      counts.set(token, (counts.get(token) || 0) + tokenCount);
    }
  }
  cachedStaticSubjectResolutionCounts = counts;
  return cachedStaticSubjectResolutionCounts;
}

function buildSubjectResolutionCandidates({ window, chapters, narrativeSources, contextPack }) {
  const counts = new Map(getStaticSubjectResolutionCounts({ chapters, narrativeSources, contextPack }));
  const windowCounts = countNamedEntities(String(window?.text || ""));
  for (const [token, tokenCount] of windowCounts.entries()) {
    counts.set(token, (counts.get(token) || 0) + tokenCount);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 24)
    .map(([name, mentions]) => ({ name, mentions }));
}

function normalizeSubjectPlaceholder(raw) {
  const text = String(raw || "").toLowerCase();
  if (/\b(narrator|voice)\b/.test(text)) return "narrator";
  if (/\b(people|crowd|children|villagers|they|we|them|collective)\b/.test(text)) return "collective";
  if (/\b(woman|mother|daughter|girl|bride|wife|queen)\b/.test(text)) return "unresolved_female_figure";
  return "unresolved_male_figure";
}

function isRelationalSubjectDescriptor(value) {
  return /\b(son|daughter|child|wife|husband|mother|father|bride|widow|brother|sister)\b/i.test(String(value || ""));
}

function normalizeResolvedSubject(raw, contextCapsule) {
  const value = requiredText(raw, "character", 120);
  if (CONTROLLED_SUBJECT_PLACEHOLDERS.includes(value)) return { subject: value, unresolved: true };
  const directNames = extractNamedEntities(value);
  if (directNames.length >= 1 && !GENERIC_SUBJECT_SLUGS.has(slugifyToken(value)) && !isRelationalSubjectDescriptor(value)) {
    return { subject: directNames[0], unresolved: false };
  }
  const candidates = safeArray(contextCapsule?.subject_resolution_candidates);
  if (GENERIC_SUBJECT_SLUGS.has(slugifyToken(value)) && candidates.length === 1) {
    return { subject: candidates[0].name, unresolved: false };
  }
  return { subject: normalizeSubjectPlaceholder(value), unresolved: true };
}

function normalizeJungianArchetype(rawArchetype, summary = "") {
  const value = requiredText(rawArchetype, "archetype", 120);
  const slug = slugifyToken(value, "");
  const mapped = JUNGIAN_ARCHETYPE_ALIASES[slug];
  if (!mapped) throw new Error(`Descriptive archetype has no Jungian mapping: ${value}`);
  const gloss = value === mapped ? null : maybeText(`${value}${summary ? ` | ${summary}` : ""}`, 240);
  return { archetype: mapped, archetype_gloss: gloss };
}

function normalizeBiblicalBookKey(value) {
  return slugifyToken(String(value || "").replace(/\./g, "").trim(), "");
}

function parseBiblicalAddress(value) {
  const text = compactWhitespace(value, 160);
  if (!text) return null;
  const match = text.match(/^((?:[1-3]\s*)?[A-Za-z][A-Za-z.]*(?:\s+[A-Za-z][A-Za-z.]*)*)\s+(\d+):(\d+)(?:-(\d+))?$/);
  if (!match) return null;
  const book = BIBLICAL_BOOK_ALIASES[normalizeBiblicalBookKey(match[1])];
  if (!book) return null;
  return {
    biblical_anchor_label: `${book} ${match[2]}:${match[3]}${match[4] ? `-${match[4]}` : ""}`,
    book,
    chapter: Number.parseInt(match[2], 10),
    verse_start: Number.parseInt(match[3], 10),
    verse_end: match[4] ? Number.parseInt(match[4], 10) : null,
  };
}

function normalizeBiblicalBook(value) {
  const key = normalizeBiblicalBookKey(value);
  return BIBLICAL_BOOK_ALIASES[key] || null;
}

function normalizeMotifFamily(value) {
  return slugifyToken(requiredText(value, "motif_family", 120), "motif");
}

function hasTypologicalRationale(text) {
  const rationale = String(text || "").toLowerCase();
  return /\b(type|antitype|pattern(?:s)?|correspond(?:s|ed|ence|ing)?|fulfill(?:s|ed|ment)?|prefigure(?:s|d|ment)?|recapitulat(?:e|es|ed|ing|ion)?|as\s+.+?\s+so)\b/.test(rationale);
}

function archetypeAnchorKey(label) {
  return `jungian_${slugifyToken(label, "unknown")}`;
}

function biblicalAnchorKey({ book, chapter, verse_start, verse_end, motif_family }) {
  return `bibanchor_${sha256Text(canonicalJson({
    book,
    chapter,
    verse_start,
    verse_end: verse_end ?? null,
    motif_family,
  })).slice(0, 32)}`;
}

function tightenConfidence(confidence, { unresolvedSubject = false, symbolicResonance = false, targetHintOnly = false } = {}) {
  let value = clamp01(confidence, 0.5);
  if (unresolvedSubject) value = Math.min(value, 0.55);
  if (symbolicResonance) value = Math.min(value, 0.6);
  if (targetHintOnly) value = Math.min(value, 0.55);
  return value;
}

function isVagueTargetHint(value) {
  const text = slugifyToken(value, "");
  return !text || /^(healing|redemption|grief|loss|shadow|light|love|truth|spirit|psyche|soul|mystery)$/.test(text);
}

function observationEvidenceRefs(task, observation) {
  switch (task) {
    case "meaning_spans":
    case "archetypes":
    case "biblical_references":
      return safeArray(observation.evidence);
    case "dualisms":
      return [
        ...safeArray(observation.left_evidence),
        ...safeArray(observation.right_evidence),
        ...safeArray(observation.bridge_evidence),
      ];
    case "hyperlinks_parallelisms":
      return [
        ...safeArray(observation.source_evidence),
        ...safeArray(observation.target_evidence),
      ];
    default:
      return [];
  }
}

function evidenceOverlap(leftRefs, rightRefs) {
  const rightMap = new Map(rightRefs.map((ref) => [`${ref.render_para_key}:${ref.start_char}:${ref.end_char}:${ref.quote}`, ref]));
  const overlap = [];
  for (const ref of leftRefs) {
    const key = `${ref.render_para_key}:${ref.start_char}:${ref.end_char}:${ref.quote}`;
    if (rightMap.has(key)) overlap.push(ref);
  }
  return overlap.sort(compareEvidenceRefs);
}

function observationIdentityHash(observation) {
  return sha256Text(canonicalJson(observation));
}

function classifySemanticWindow(window) {
  const text = String(window?.text || "").trim();
  const compact = text.replace(/\s+/g, " ").trim();
  const charCount = compact.length;
  const wordCount = semanticWordCount(compact);
  const alphaChars = (compact.match(/[A-Za-z]/g) || []).length;
  const alphaRatio = charCount ? alphaChars / charCount : 0;
  const sentenceLike = /[A-Za-z][^.!?]*[.!?]/.test(compact) || /[A-Za-z]{3,}\s+[A-Za-z]{3,}/.test(compact);
  const headingLike = /^(chapter|part|prologue|epilogue)\b/i.test(compact) && wordCount <= 10;
  const punctHeavy = charCount > 0 && (compact.match(/[A-Za-z0-9]/g) || []).length / charCount < 0.45;

  if (!compact) return { status: "skipped", reason: "empty_window", wordCount, charCount };
  if (headingLike) return { status: "skipped", reason: "heading_window", wordCount, charCount };
  if (charCount < MIN_SEMANTIC_WINDOW_CHARS) return { status: "skipped", reason: "below_min_chars", wordCount, charCount };
  if (wordCount < MIN_SEMANTIC_WINDOW_WORDS) return { status: "skipped", reason: "below_min_words", wordCount, charCount };
  if (alphaRatio < 0.5 || punctHeavy) return { status: "skipped", reason: "low_prose_density", wordCount, charCount };
  if (!sentenceLike) return { status: "skipped", reason: "not_sentence_like", wordCount, charCount };

  return { status: "semantic", reason: "semantic_window", wordCount, charCount };
}

function compareEvidenceRefs(a, b) {
  return (
    String(a.render_para_key || "").localeCompare(String(b.render_para_key || "")) ||
    Number(a.start_char || 0) - Number(b.start_char || 0) ||
    Number(a.end_char || 0) - Number(b.end_char || 0) ||
    String(a.quote || "").localeCompare(String(b.quote || ""))
  );
}

function compareObservations(a, b) {
  return (
    String(a.summary || a.label || "").localeCompare(String(b.summary || b.label || "")) ||
    String(a.kind || a.axis || a.archetype || a.biblical_anchor_label || a.reference || a.relationship_type || "").localeCompare(
      String(b.kind || b.axis || b.archetype || b.biblical_anchor_label || b.reference || b.relationship_type || "")
    ) ||
    String(a.character || "").localeCompare(String(b.character || "")) ||
    Number(b.confidence || 0) - Number(a.confidence || 0)
  );
}

function strictObjectSchema(properties) {
  return {
    type: "OBJECT",
    properties,
    required: Object.keys(properties),
    additionalProperties: false,
  };
}

function strictArraySchema(items) {
  return {
    type: "ARRAY",
    items,
  };
}

function nullableSchema(schema) {
  return {
    ...schema,
    nullable: true,
  };
}

function evidenceRefResponseSchema() {
  return strictObjectSchema({
    render_para_key: { type: "STRING" },
    quote: { type: "STRING" },
  });
}

function taskResponseSchema(task) {
  const evidence = evidenceRefResponseSchema();
  const packet = (properties) => strictObjectSchema({
    observations: strictArraySchema(strictObjectSchema(properties)),
  });

  switch (task) {
    case "meaning_spans":
      return packet({
        kind: { type: "STRING" },
        summary: { type: "STRING" },
        evidence: strictArraySchema(evidence),
        thematic_weight: { type: "NUMBER" },
        gravity: { type: "NUMBER" },
        tension: { type: "NUMBER" },
        confidence: { type: "NUMBER" },
        notes: nullableSchema({ type: "STRING" }),
      });
    case "dualisms":
      return packet({
        axis: { type: "STRING" },
        polarity: { type: "STRING" },
        summary: { type: "STRING" },
        left_evidence: strictArraySchema(evidence),
        right_evidence: strictArraySchema(evidence),
        bridge_evidence: strictArraySchema(evidence),
        confidence: { type: "NUMBER" },
      });
    case "archetypes":
      return packet({
        character: { type: "STRING" },
        archetype: { type: "STRING" },
        archetype_gloss: nullableSchema({ type: "STRING" }),
        movement: { type: "STRING" },
        summary: { type: "STRING" },
        evidence: strictArraySchema(evidence),
        confidence: { type: "NUMBER" },
      });
    case "biblical_references":
      return packet({
        biblical_anchor_label: { type: "STRING" },
        book: { type: "STRING" },
        chapter: { type: "INTEGER" },
        verse_start: { type: "INTEGER" },
        verse_end: nullableSchema({ type: "INTEGER" }),
        motif_family: { type: "STRING" },
        relationship_type: { type: "STRING" },
        correspondence_rationale: { type: "STRING" },
        summary: { type: "STRING" },
        evidence: strictArraySchema(evidence),
        confidence: { type: "NUMBER" },
      });
    case "hyperlinks_parallelisms":
      return packet({
        relationship_type: { type: "STRING" },
        summary: { type: "STRING" },
        source_evidence: strictArraySchema(evidence),
        target_hint: nullableSchema({ type: "STRING" }),
        target_evidence: strictArraySchema(evidence),
        confidence: { type: "NUMBER" },
      });
    default:
      throw new Error(`Unknown task schema: ${task}`);
  }
}

function taskRubric(task) {
  switch (task) {
    case "meaning_spans":
      return [
        "Identify the smallest strong semantic claims or motif-bearing spans in the source packet.",
        "A meaning span is not a database row. It is a grounded observation tied to source evidence.",
        "Use empty observations when evidence is weak.",
      ].join("\n");
    case "dualisms":
      return [
        "Extract active conceptual tensions, mirrors, inversions, or oppositions.",
        "Each dualism must include left and right evidence anchors from the source packet.",
        "Do not emit a dualism if the pairing is only keyword-level and not narratively active.",
      ].join("\n");
    case "archetypes":
      return [
        `Use Jungian ontology first. Accepted archetype labels must be one of: ${JUNGIAN_ARCHETYPE_LABELS.join(", ")}.`,
        "Descriptive labels may appear only as archetype_gloss and must not replace the canonical Jungian archetype field.",
        `Movement must be one of: ${JUNGIAN_MOVEMENTS.join(", ")}.`,
        "Resolve subject identity using the wider narrative corpus when possible. Do not leave generic labels like 'the man' as accepted subjects.",
        "If the subject remains unresolved after context resolution, use only controlled placeholders.",
      ].join("\n");
    case "biblical_references":
      return [
        `Accepted relationship_type must be one of: ${BIBLICAL_RELATIONSHIP_TYPES.join(", ")}.`,
        "Do not call something typological unless the correspondence structure is explicit and defensible.",
        "Every accepted biblical packet must include biblical_anchor_label, book, chapter, verse_start, verse_end when needed, motif_family, relationship_type, correspondence_rationale, evidence, and confidence.",
        "If evidence is only atmospheric or symbolic, use symbolic_resonance only when a real biblical anchor is still identifiable; otherwise return empty observations.",
        "Do not output broad biblical vibes, broad grief motifs, or generic symbolism without a canonical anchor and verse-level address.",
      ].join("\n");
    case "hyperlinks_parallelisms":
      return [
        "Extract derived motif echoes, callbacks, mirrors, parallelisms, and foreshadowing signals.",
        "At least the source side must be anchored in the source packet.",
        "Use target_hint only when target evidence is absent but cross-context consistency is still strong and specific.",
        "Do not emit vague psycho-spiritual target_hint labels without strong cross-context support.",
      ].join("\n");
    default:
      return "";
  }
}

function excerptAroundMatch(text, needle, radius = 600) {
  const source = String(text || "");
  const target = String(needle || "").toLowerCase();
  if (!target) return compactWhitespace(source.slice(0, radius * 2), radius * 2);
  const idx = source.toLowerCase().indexOf(target);
  if (idx < 0) return compactWhitespace(source.slice(0, radius * 2), radius * 2);
  const start = Math.max(0, idx - radius);
  const end = Math.min(source.length, idx + target.length + radius);
  return compactWhitespace(source.slice(start, end), radius * 2);
}

function inferChapterHintsFromFolder(folder) {
  const matches = [...String(folder || "").matchAll(/chapter[_\s-]?(\d+(?:\.\d+)?)/gi)];
  return uniqueBy(matches.map((m) => Number.parseInt(m[1], 10)).filter(Number.isFinite), (n) => String(n));
}

function windowKeywords(window) {
  const words = String(window?.text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length >= 5 && !CONTEXT_STOPWORDS.has(word));

  const counts = new Map();
  for (const word of words) counts.set(word, (counts.get(word) || 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 12)
    .map(([word]) => word);
}

function buildNarrativeContextCapsule({ contextPack, chapters, narrativeSources, availableNarrativeContextMap, window }) {
  const chapterHints = inferChapterHintsFromFolder(window.folder);
  const keywords = windowKeywords(window);
  const contextNeedle = keywords[0] || chapterHints[0] || "";
  const scored = chapters.map((chapter) => {
    const hay = chapter.content.toLowerCase();
    const keywordHits = keywords.reduce((sum, keyword) => sum + (hay.includes(keyword) ? 1 : 0), 0);
    const chapterBoost = chapterHints.includes(chapter.chapter_number) ? 3 : 0;
    return { chapter, score: chapterBoost + keywordHits, keywordHits, chapterBoost };
  });

  const selectedChapters = scored
    .sort((a, b) => b.score - a.score || a.chapter.chapter_number - b.chapter.chapter_number)
    .map(({ chapter, score, keywordHits, chapterBoost }) => ({
      chapter_number: chapter.chapter_number,
      sha256: chapter.sha256,
      score,
      keyword_hits: keywordHits,
      chapter_hint_boost: chapterBoost,
      excerpt: excerptAroundMatch(chapter.content, contextNeedle, 320),
    }));

  const sourceContexts = narrativeSources.map((source) => ({
    role: source.role,
    key: source.key,
    sha256: source.sha256,
    excerpt: excerptAroundMatch(source.content, contextNeedle, 520),
  }));
  const subjectResolutionCandidates = buildSubjectResolutionCandidates({ window, chapters, narrativeSources, contextPack });
  const capsule = {
    mode: "narrative_context_only",
    expected_public_chapter_count: EXPECTED_PUBLIC_CHAPTER_COUNT,
    loaded_public_chapter_count: chapters.length,
    chapter_hints: chapterHints,
    keywords,
    full_public_chapter_corpus_loaded: chapters.length >= EXPECTED_PUBLIC_CHAPTER_COUNT,
    public_chapter_corpus: selectedChapters,
    narrative_protocol_sources: sourceContexts,
    subject_resolution_candidates: subjectResolutionCandidates,
    available_narrative_context_map_excerpt: excerptAroundMatch(availableNarrativeContextMap, String(contextNeedle), 900),
    context_pack_excerpt: excerptAroundMatch(contextPack, String(contextNeedle), 1400),
  };

  return {
    ...capsule,
    context_capsule_sha256: sha256Text(canonicalJson(capsule)),
  };
}

function buildSourcePacket(window) {
  return {
    source_doc_id: window.source_doc_id,
    scene_window_id: window.scene_window_id,
    source_document_xml_sha256: window.document_xml_sha256,
    folder: window.folder,
    render_paragraphs: window.render_paragraphs.map((paragraph) => ({
      render_para_key: paragraph.render_para_key,
      render_index: paragraph.render_index,
      start_char: paragraph.start_char,
      end_char: paragraph.end_char,
      source_xml_paragraph_indexes: paragraph.source_xml_paragraph_indexes,
      text_sha256: paragraph.text_sha256,
      text: paragraph.text,
    })),
  };
}

function buildCompactNarrativeContext(contextCapsule) {
  const parts = [];

  if (contextCapsule.context_pack_excerpt) {
    parts.push("NARRATIVE OVERVIEW:\n" + clip(contextCapsule.context_pack_excerpt, 500));
  }

  const topChapters = (contextCapsule.public_chapter_corpus || []).slice(0, 2);
  if (topChapters.length) {
    parts.push("RELEVANT CHAPTERS:\n" + topChapters
      .map((ch) => `Ch.${ch.chapter_number}: ${clip(ch.excerpt, 220)}`)
      .join("\n"));
  }

  const sources = (contextCapsule.narrative_protocol_sources || []).slice(0, 2);
  if (sources.length) {
    parts.push("NARRATIVE PROTOCOLS:\n" + sources
      .map((s) => `[${s.role}]: ${clip(s.excerpt, 220)}`)
      .join("\n"));
  }

  const subjects = (contextCapsule.subject_resolution_candidates || []).slice(0, 12);
  if (subjects.length) {
    parts.push("KNOWN SUBJECTS: " + subjects.map((s) => s.name).join(", "));
  }

  return clip(parts.join("\n\n"), OLLAMA_CONTEXT_CHARS);
}

function buildSemanticTaskPrompt({ task, window, contextCapsule }) {
  const narrativeContext = PROVIDER === "ollama"
    ? buildCompactNarrativeContext(contextCapsule)
    : JSON.stringify(contextCapsule, null, 2);

  return [
    "You are a semantic analyst, not a JSON/DB row generator.",
    "Return only valid JSON matching the requested schema.",
    "No markdown. No explanation. No extra keys.",
    "Selected XML render paragraphs are source truth.",
    "Narrative context is interpretive context only, never source truth.",
    "",
    `TASK: ${task}`,
    "",
    "TASK RUBRIC:",
    taskRubric(task),
    "",
    "EVIDENCE REQUIREMENTS:",
    "- Every observation must cite source evidence using render_para_key plus an exact quote.",
    "- Omit low-confidence claims instead of padding output.",
    "- Empty observations are valid.",
    '- Valid empty response is: {"observations":[]}',
    "- Do not force a claim.",
    "",
    "SOURCE PACKET:",
    JSON.stringify(buildSourcePacket(window), null, 2),
    "",
    "NARRATIVE CONTEXT:",
    narrativeContext,
    "",
    "OUTPUT CONTRACT:",
    JSON.stringify(taskResponseSchema(task), null, 2),
  ].join("\n");
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

function parseJsonish(raw) {
  const attempts = [
    String(raw || ""),
    stripFence(raw),
    balancedSlice(raw),
    cleanJson(raw),
  ];

  for (const attempt of attempts) {
    try {
      return { ok: true, value: JSON.parse(attempt), parser: attempt === attempts[0] ? "direct" : "recovered" };
    } catch {}
  }

  return { ok: false, error: "Unable to parse JSON payload." };
}

async function saveBadAiJson(raw, phase, extra = {}) {
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const dir = path.join("docs", "forensics", "audits", "ai-bad-json");
  await fs.mkdir(dir, { recursive: true });

  const hash = sha256Text(String(raw || "")).slice(0, 16);
  const file = path.join(dir, `${new Date().toISOString().replace(/[:.]/g, "-")}-${phase}-${hash}.json`);

  await fs.writeFile(file, JSON.stringify({
    phase,
    provider: PROVIDER,
    model: PROVIDER_MODEL,
    raw,
    ...extra,
  }, null, 2), "utf-8");

  return file;
}

const ollamaResultCache = new Map();

function loadOllamaResultCache() {
  if (!existsSync(OLLAMA_CACHE_PATH)) return;
  try {
    const data = JSON.parse(readFileSync(OLLAMA_CACHE_PATH, "utf8"));
    for (const [key, val] of Object.entries(data || {})) ollamaResultCache.set(key, val);
    console.warn(JSON.stringify({ event: "ollama_cache_loaded", entries: ollamaResultCache.size, path: OLLAMA_CACHE_PATH }));
  } catch {}
}

function checkOllamaCache(key) {
  return ollamaResultCache.get(key) ?? null;
}

function setOllamaCache(key, rawText) {
  ollamaResultCache.set(key, rawText);
  try {
    mkdirSync(join(ROOT, "docs/forensics/audits"), { recursive: true });
    writeFileSync(OLLAMA_CACHE_PATH, JSON.stringify(Object.fromEntries(ollamaResultCache), null, 2));
  } catch {}
}

async function callOllamaSync(prompt) {
  const url = `${OLLAMA_BASE_URL}/api/generate`;
  const timeoutMs = Number(process.env.OLLAMA_TIMEOUT_MS || 600000);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  let res;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt,
        format: "json",
        stream: false,
        keep_alive: process.env.OLLAMA_KEEP_ALIVE ?? 0,
        options: { temperature: 0, num_ctx: Number(process.env.OLLAMA_NUM_CTX || 512) },
      }),
      signal: controller.signal,
    });
  } catch (err) {
    const isTimeout = err.name === "AbortError";
    throw new Error(
      isTimeout
        ? `ollama not running at ${OLLAMA_BASE_URL}: request timed out after ${timeoutMs}ms`
        : `ollama not running at ${OLLAMA_BASE_URL}: ${err.message}`
    );
  } finally {
    clearTimeout(timeoutId);
  }
  const rawText = await res.text();
  if (!res.ok) throw new Error(`ollama error (${res.status}): ${rawText.slice(0, 800)}`);
  let json;
  try {
    json = JSON.parse(rawText);
  } catch {
    throw new Error(`ollama returned non-JSON response: ${rawText.slice(0, 400)}`);
  }
  return json.response || "";
}

async function callGeminiSync(prompt) {
  const apiKey = env("GOOGLE_API_KEY", "");
  if (!apiKey) throw new Error("GOOGLE_API_KEY is required for gemini_sync provider");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
  const timeoutMs = Number(process.env.GEMINI_TIMEOUT_MS || process.env.OLLAMA_TIMEOUT_MS || 120000);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  let res;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0, responseMimeType: "application/json" },
      }),
      signal: controller.signal,
    });
  } catch (err) {
    const isTimeout = err.name === "AbortError";
    throw new Error(
      isTimeout
        ? `gemini_sync timed out after ${timeoutMs}ms`
        : `gemini_sync fetch error: ${err.message}`
    );
  } finally {
    clearTimeout(timeoutId);
  }
  const rawText = await res.text();
  if (!res.ok) throw new Error(`gemini_sync error (${res.status}): ${rawText.slice(0, 800)}`);
  let envelope;
  try {
    envelope = JSON.parse(rawText);
  } catch {
    throw new Error(`gemini_sync non-JSON envelope: ${rawText.slice(0, 400)}`);
  }
  return envelope?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

async function callSemanticProviderSync({ task, prompt, schema }) {
  if (OLLAMA_PROVIDERS.has(PROVIDER)) {
    const cacheKey = sha256Text(`${OLLAMA_MODEL}:${prompt}`);
    const cached = checkOllamaCache(cacheKey);
    if (cached !== null) {
      console.warn(JSON.stringify({ event: "ollama_cache_hit", task, key: cacheKey.slice(0, 16) }));
      return cached;
    }
    const maxRetries = Number(process.env.PROVIDER_RETRY_MAX || 5);
    let lastError = null;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await callOllamaSync(prompt);
        setOllamaCache(cacheKey, result);
        return result;
      } catch (error) {
        lastError = error;
        if (!isRetryableProviderError(error) || attempt >= maxRetries) throw error;
        const delay = providerRetryDelayMs(attempt + 1);
        console.warn(JSON.stringify({ event: "provider_retry", provider: PROVIDER, task, attempt: attempt + 1, max_retries: maxRetries, delay_ms: delay, error: String(error?.message || error).slice(0, 1200) }));
        await sleep(delay);
      }
    }
    throw lastError || new Error(`${PROVIDER} retry loop failed without captured error`);
  }

  const callFn = PROVIDER === "gemini_sync" ? callGeminiSync : null;
  if (!callFn) throw new Error(`No sync call function for provider: ${PROVIDER} — supported: ${[...PROVIDER_CHOICES].join(", ")}`);
  const maxRetries = Number(process.env.PROVIDER_RETRY_MAX || 5);
  let lastError = null;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await callFn(prompt);
    } catch (error) {
      lastError = error;
      if (!isRetryableProviderError(error) || attempt >= maxRetries) throw error;
      const delay = providerRetryDelayMs(attempt + 1);
      console.warn(JSON.stringify({ event: "provider_retry", provider: PROVIDER, task, attempt: attempt + 1, max_retries: maxRetries, delay_ms: delay, error: String(error?.message || error).slice(0, 1200) }));
      await sleep(delay);
    }
  }
  throw lastError || new Error(`${PROVIDER} retry loop failed without captured error`);
}

function batchRequestsFileExtension(provider = PROVIDER) {
  return provider === "anthropic_batch" ? "json" : "jsonl";
}

function batchProviderOutputPrefix(provider = PROVIDER) {
  return provider.replace(/[^a-z0-9]+/gi, "-");
}

function buildBatchCustomId({ window, task, promptHash, contextHash }) {
  return [window.source_doc_id, window.scene_window_id, task, promptHash, contextHash].join("__");
}

function buildBatchManifestEntry({ customId, task, window, contextCapsule, prompt, promptHash, schema }) {
  return {
    custom_id: customId,
    provider: PROVIDER,
    model: PROVIDER_MODEL,
    source_doc_id: window.source_doc_id,
    scene_window_id: window.scene_window_id,
    task_type: task,
    prompt_hash: promptHash,
    context_hash: contextCapsule.context_capsule_sha256,
    schema,
    prompt,
  };
}

function writeBatchArtifacts(_entries) {
  throw new Error("Batch mode is not supported. Use the ollama provider for synchronous processing.");
}

async function submitPreparedBatch(_artifacts) {
  throw new Error("Batch mode is not supported. Use the ollama provider for synchronous processing.");
}

async function pollProviderBatch(_batchId) {
  throw new Error("Batch polling is not supported. Use the ollama provider for synchronous processing.");
}

function parseImportedBatchResults(_resultsPath) {
  throw new Error("Batch import is not supported. Use the ollama provider for synchronous processing.");
}


function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function resolveEvidenceRef(ref, window, roleHint = null) {
  const renderParaKey = requiredText(ref?.render_para_key, "render_para_key");
  const quote = requiredText(ref?.quote, "quote", 500);
  const paragraph = window.render_paragraphs.find((item) => item.render_para_key === renderParaKey || item.id === renderParaKey);
  if (!paragraph) throw new Error(`Unknown render_para_key: ${renderParaKey}`);

  const hay = paragraph.text;
  const match = resolveNormalizedQuoteMatch(hay, quote);
  if (!match) throw new Error(`Quote not found in render paragraph ${renderParaKey}`);

  const resolved = {
    render_para_key: paragraph.render_para_key,
    render_index: paragraph.render_index,
    quote: match.exactQuote,
    role: maybeText(ref?.role || roleHint, 80),
    start_char: paragraph.start_char + match.start,
    end_char: paragraph.start_char + match.end,
    source_doc_id: window.source_doc_id,
    scene_window_id: window.scene_window_id,
    source_document_xml_sha256: window.document_xml_sha256,
    source_xml_paragraph_indexes: paragraph.source_xml_paragraph_indexes,
    evidence_sha256: sha256Text(match.exactQuote),
  };

  return resolved;
}

function resolveEvidenceArray(items, window, roleHint = null) {
  const resolved = safeArray(items).map((item) => resolveEvidenceRef(item, window, roleHint));
  const deduped = uniqueBy(resolved, (item) => `${item.render_para_key}:${item.start_char}:${item.end_char}:${item.quote}`);
  deduped.sort(compareEvidenceRefs);
  if (!deduped.length) throw new Error("Missing evidence anchors");
  return deduped;
}

function normalizeMeaningSpanObservation(raw, window) {
  return {
    task: "meaning_spans",
    kind: normalizeEnum(raw?.kind, ["claim", "motif", "image", "identity", "tension", "transition"], "claim", { theme: "motif" }),
    summary: requiredText(raw?.summary, "summary", 240),
    evidence: resolveEvidenceArray(raw?.evidence, window),
    thematic_weight: clamp01(raw?.thematic_weight, 0.5),
    gravity: clamp01(raw?.gravity, 0.5),
    tension: clamp01(raw?.tension, 0.5),
    confidence: clamp01(raw?.confidence, 0.5),
    notes: maybeText(raw?.notes, 240),
  };
}

function normalizeDualismObservation(raw, window) {
  return {
    task: "dualisms",
    axis: slugifyToken(requiredText(raw?.axis, "axis", 120)),
    polarity: normalizeEnum(raw?.polarity, ["mirror", "opposition", "inversion", "tension", "fusion"], "tension"),
    summary: requiredText(raw?.summary, "summary", 240),
    left_evidence: resolveEvidenceArray(raw?.left_evidence, window, "left"),
    right_evidence: resolveEvidenceArray(raw?.right_evidence, window, "right"),
    bridge_evidence: uniqueBy(safeArray(raw?.bridge_evidence).flatMap((item) => {
      try {
        return [resolveEvidenceRef(item, window, "bridge")];
      } catch {
        return [];
      }
    }), (item) => `${item.render_para_key}:${item.start_char}:${item.end_char}:${item.quote}`),
    confidence: clamp01(raw?.confidence, 0.5),
  };
}

function normalizeArchetypeObservation(raw, window, contextCapsule) {
  const subject = normalizeResolvedSubject(raw?.character, contextCapsule);
  const archetype = normalizeJungianArchetype(raw?.archetype, raw?.summary);
  return {
    task: "archetypes",
    character: subject.subject,
    archetype: archetype.archetype,
    archetype_anchor_key: archetypeAnchorKey(archetype.archetype),
    archetype_gloss: archetype.archetype_gloss,
    movement: normalizeEnum(raw?.movement, JUNGIAN_MOVEMENTS, "fragmentation", JUNGIAN_MOVEMENT_ALIASES),
    summary: requiredText(raw?.summary, "summary", 240),
    evidence: resolveEvidenceArray(raw?.evidence, window),
    confidence: tightenConfidence(raw?.confidence, { unresolvedSubject: subject.unresolved }),
    unresolved_subject: subject.unresolved,
  };
}

function normalizeBiblicalObservation(raw, window) {
  const anchor = requiredText(raw?.biblical_anchor_label || raw?.reference, "biblical_anchor_label", 160);
  const parsedAnchor = parseBiblicalAddress(anchor);
  const relationshipType = normalizeEnum(raw?.relationship_type, BIBLICAL_RELATIONSHIP_TYPES, "", BIBLICAL_RELATIONSHIP_ALIASES);
  if (!relationshipType) throw new Error(`Unsupported biblical relationship_type: ${String(raw?.relationship_type || "")}`);
  const book = normalizeBiblicalBook(raw?.book) || parsedAnchor?.book;
  const chapter = maybeInteger(raw?.chapter) ?? parsedAnchor?.chapter ?? null;
  const verseStart = maybeInteger(raw?.verse_start) ?? parsedAnchor?.verse_start ?? null;
  const verseEnd = maybeInteger(raw?.verse_end) ?? parsedAnchor?.verse_end ?? null;
  const rationale = requiredText(raw?.correspondence_rationale || raw?.summary, "correspondence_rationale", 320);
  if (!book || !chapter || !verseStart) throw new Error(`Biblical anchor must be verse-addressable: ${anchor}`);
  if (relationshipType === "typological_correspondence" && !hasTypologicalRationale(rationale)) {
    throw new Error(`Typological correspondence requires explicit rationale: ${anchor}`);
  }
  const motifFamily = normalizeMotifFamily(raw?.motif_family || raw?.motif);
  return {
    task: "biblical_references",
    biblical_anchor_label: parsedAnchor?.biblical_anchor_label || `${book} ${chapter}:${verseStart}${verseEnd ? `-${verseEnd}` : ""}`,
    book,
    chapter,
    verse_start: verseStart,
    verse_end: verseEnd,
    motif_family: motifFamily,
    biblical_anchor_key: biblicalAnchorKey({
      book,
      chapter,
      verse_start: verseStart,
      verse_end: verseEnd,
      motif_family: motifFamily,
    }),
    relationship_type: relationshipType,
    correspondence_rationale: rationale,
    summary: requiredText(raw?.summary, "summary", 240),
    evidence: resolveEvidenceArray(raw?.evidence, window),
    confidence: tightenConfidence(raw?.confidence, { symbolicResonance: relationshipType === "symbolic_resonance" }),
    reference: parsedAnchor?.biblical_anchor_label || `${book} ${chapter}:${verseStart}${verseEnd ? `-${verseEnd}` : ""}`,
    motif: motifFamily,
  };
}

function normalizeHyperlinkObservation(raw, window) {
  const targetEvidence = uniqueBy(safeArray(raw?.target_evidence).flatMap((item) => {
    try {
      return [resolveEvidenceRef(item, window, "target")];
    } catch {
      return [];
    }
  }), (item) => `${item.render_para_key}:${item.start_char}:${item.end_char}:${item.quote}`);
  let targetHint = maybeText(raw?.target_hint, 200);
  if (!targetEvidence.length && isVagueTargetHint(targetHint)) targetHint = null;
  return {
    task: "hyperlinks_parallelisms",
    relationship_type: normalizeEnum(raw?.relationship_type, ["parallelism", "mirror", "foreshadow", "motif_echo", "character_echo", "scene_callback"], "parallelism"),
    summary: requiredText(raw?.summary, "summary", 240),
    source_evidence: resolveEvidenceArray(raw?.source_evidence, window, "source"),
    target_hint: targetHint,
    target_evidence: targetEvidence,
    confidence: tightenConfidence(raw?.confidence, { targetHintOnly: Boolean(targetHint) && !targetEvidence.length }),
  };
}

function normalizeTaskPayload(task, payload, window, contextCapsule) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { ok: false, errors: ["Top-level payload must be an object."] };
  }
  if (!Array.isArray(payload.observations)) {
    return { ok: false, errors: ["Top-level payload must contain an observations array."] };
  }

  const acceptedObservations = [];
  const rejectedObservations = [];
  const validationErrors = [];
  const evidenceErrors = [];

  for (let i = 0; i < payload.observations.length; i++) {
    const raw = payload.observations[i];
    try {
      let normalized;
      switch (task) {
        case "meaning_spans":
          normalized = normalizeMeaningSpanObservation(raw, window);
          break;
        case "dualisms":
          normalized = normalizeDualismObservation(raw, window);
          break;
        case "archetypes":
          normalized = normalizeArchetypeObservation(raw, window, contextCapsule);
          break;
        case "biblical_references":
          normalized = normalizeBiblicalObservation(raw, window);
          break;
        case "hyperlinks_parallelisms":
          normalized = normalizeHyperlinkObservation(raw, window);
          break;
        default:
          throw new Error(`Unknown task: ${task}`);
      }
      acceptedObservations.push(normalized);
    } catch (error) {
      const message = `observation[${i}]: ${String(error?.message || error)}`;
      rejectedObservations.push({ index: i, raw, error: message });
      validationErrors.push(message);
      if (/render_para_key|Quote not found|Missing evidence anchors/i.test(message)) {
        evidenceErrors.push(message);
      }
    }
  }

  acceptedObservations.sort(compareObservations);
  return {
    ok: true,
    observations: payload.observations,
    acceptedObservations,
    rejectedObservations,
    validationErrors,
    evidenceErrors,
  };
}

async function repairStructuredTaskOutput({ task, rawText, schema, validationErrors }) {
  const prompt = [
    "Return ONLY valid JSON.",
    `Repair this ${task} JSON payload.`,
    "Do not add commentary.",
    "Do not invent evidence.",
    "If an observation cannot be repaired to schema, omit it.",
    'A valid empty response is {"observations":[]}.',
    "",
    "SCHEMA:",
    JSON.stringify(schema, null, 2),
    "",
    "VALIDATION ERRORS:",
    JSON.stringify(validationErrors, null, 2),
    "",
    "INVALID OUTPUT:",
    String(rawText || "").slice(0, 24000),
  ].join("\n");

  if (!isSyncProvider(PROVIDER)) return JSON.stringify({ observations: [] });
  const text = await callSemanticProviderSync({ task, prompt, schema });
  return text;
}

function makeWindowFragment(window, paragraph) {
  const text = paragraph.text;
  return {
    ...window,
    scene_window_id: "scene_" + sha256Text(`${window.scene_window_id}\t${paragraph.render_para_key}`).slice(0, 32),
    scene_window_key: "scene_" + sha256Text(`${window.scene_window_key}\t${paragraph.render_para_key}`).slice(0, 32),
    render_paragraphs: [paragraph],
    text,
    text_sha256: sha256Text(text),
  };
}

function normalizeTaskPacketHashable(packet) {
  return {
    status: packet.status,
    task_type: packet.task_type,
    window_id: packet.window_id,
    accepted_observations: packet.accepted_observations,
    rejected_observations: packet.rejected_observations,
    validation_errors: packet.validation_errors,
    evidence_errors: packet.evidence_errors,
  };
}

function buildTaskPacket({
  task,
  window,
  contextCapsule,
  prompt,
  promptHash,
  outputText,
  observations = [],
  acceptedObservations = [],
  rejectedObservations = [],
  validationErrors = [],
  evidenceErrors = [],
  status,
  failureReason = null,
}) {
  const rawOutputHash = sha256Text(String(outputText || ""));
  const normalizedOutputHash = sha256Text(canonicalJson({
    accepted_observations: acceptedObservations,
    rejected_observations: rejectedObservations,
    status,
    task_type: task,
    validation_errors: validationErrors,
    evidence_errors: evidenceErrors,
  }));

  return {
    task,
    status,
    task_type: task,
    window_id: window.scene_window_id,
    observations,
    accepted_observations: acceptedObservations,
    rejected_observations: rejectedObservations,
    failure_reason: failureReason,
    validation_errors: validationErrors,
    evidence_errors: evidenceErrors,
    raw_output_hash: rawOutputHash,
    normalized_output_hash: normalizedOutputHash,
    prompt,
    promptHash,
    outputText,
    outputHash: rawOutputHash,
    contextCapsuleHash: contextCapsule.context_capsule_sha256,
  };
}

function classifyTaskPacketStatus(normalized) {
  if (normalized.acceptedObservations.length > 0) return "ok";
  if (normalized.observations.length === 0 && normalized.rejectedObservations.length === 0) return "empty";
  if (normalized.rejectedObservations.length > 0) return "failed";
  return "empty";
}

async function finalizeTaskPacketFromRaw({ task, window, contextCapsule, prompt, promptHash, rawText, allowRepair = true }) {
  const schema = taskResponseSchema(task);
  const parsed = parseJsonish(rawText);

  if (!parsed.ok) {
    if (!allowRepair || !isSyncProvider(PROVIDER)) {
      const badPath = await saveBadAiJson(rawText, "initial-parse-failed", { task, scene_window_id: window.scene_window_id, provider: PROVIDER });
      return buildTaskPacket({
        task,
        window,
        contextCapsule,
        prompt,
        promptHash,
        outputText: rawText,
        observations: [],
        acceptedObservations: [],
        rejectedObservations: [],
        validationErrors: [parsed.error, `bad_json_path=${badPath}`],
        evidenceErrors: [],
        status: "failed",
        failureReason: "parse_failed",
      });
    }

    const badPath = await saveBadAiJson(rawText, "initial-parse-failed", { task, scene_window_id: window.scene_window_id, provider: PROVIDER });
    rawText = await repairStructuredTaskOutput({ task, rawText, schema, validationErrors: [parsed.error, `bad_json_path=${badPath}`] });
  } else {
    const validated = normalizeTaskPayload(task, parsed.value, window, contextCapsule);
    if (validated.ok) {
      const status = classifyTaskPacketStatus(validated);
      if (status !== "failed") {
        return buildTaskPacket({
          task,
          window,
          contextCapsule,
          prompt,
          promptHash,
          outputText: rawText,
          observations: validated.observations,
          acceptedObservations: validated.acceptedObservations,
          rejectedObservations: validated.rejectedObservations,
          validationErrors: validated.validationErrors,
          evidenceErrors: validated.evidenceErrors,
          status,
        });
      }

      if (!allowRepair || !isSyncProvider(PROVIDER)) {
        return buildTaskPacket({
          task,
          window,
          contextCapsule,
          prompt,
          promptHash,
          outputText: rawText,
          observations: validated.observations,
          acceptedObservations: validated.acceptedObservations,
          rejectedObservations: validated.rejectedObservations,
          validationErrors: validated.validationErrors,
          evidenceErrors: validated.evidenceErrors,
          status: "failed",
          failureReason: "all_observations_rejected",
        });
      }

      rawText = await repairStructuredTaskOutput({
        task,
        rawText,
        schema,
        validationErrors: validated.validationErrors,
      });
    } else {
      if (!allowRepair || !isSyncProvider(PROVIDER)) {
        return buildTaskPacket({
          task,
          window,
          contextCapsule,
          prompt,
          promptHash,
          outputText: rawText,
          observations: [],
          acceptedObservations: [],
          rejectedObservations: [],
          validationErrors: validated.errors,
          evidenceErrors: [],
          status: "failed",
          failureReason: "schema_invalid",
        });
      }

      rawText = await repairStructuredTaskOutput({
        task,
        rawText,
        schema,
        validationErrors: validated.errors,
      });
    }
  }

  const repairedParsed = parseJsonish(rawText);
  if (!repairedParsed.ok) {
    return buildTaskPacket({
      task,
      window,
      contextCapsule,
      prompt,
      promptHash,
      outputText: rawText,
      observations: [],
      acceptedObservations: [],
      rejectedObservations: [],
      validationErrors: [repairedParsed.error],
      evidenceErrors: [],
      status: "failed",
      failureReason: "parse_failed_after_repair",
    });
  }

  const repairedValidated = normalizeTaskPayload(task, repairedParsed.value, window, contextCapsule);
  if (!repairedValidated.ok) {
    return buildTaskPacket({
      task,
      window,
      contextCapsule,
      prompt,
      promptHash,
      outputText: rawText,
      observations: [],
      acceptedObservations: [],
      rejectedObservations: [],
      validationErrors: repairedValidated.errors,
      evidenceErrors: [],
      status: "failed",
      failureReason: "schema_invalid_after_repair",
    });
  }

  const status = classifyTaskPacketStatus(repairedValidated);

  // Smaller models (e.g. llama3.2:3b) sometimes hallucinate a render_para_key whose value
  // is derived from the repair prompt text ("repair_json_payload" etc.).  When ALL evidence
  // errors are "Unknown render_para_key" the model genuinely found no content — downgrade
  // from "failed" to "empty" so the window is not counted against fail-fast thresholds.
  const effectiveStatus = (
    status === "failed" &&
    repairedValidated.evidenceErrors.length > 0 &&
    repairedValidated.evidenceErrors.every(e => String(e).includes("Unknown render_para_key"))
  ) ? "empty" : status;

  if (effectiveStatus === "empty") {
    saveBadAiJson(rawText, "task-empty", {
      task,
      scene_window_id: window.scene_window_id,
      provider: PROVIDER,
      model: PROVIDER_MODEL,
      prompt_chars: prompt.length,
    }).catch(() => {});
    console.warn(JSON.stringify({
      event: "task_empty",
      task,
      provider: PROVIDER,
      model: PROVIDER_MODEL,
      prompt_chars: prompt.length,
      raw_chars: String(rawText).length,
      raw_preview: String(rawText).slice(0, 600),
    }));
  }

  return buildTaskPacket({
    task,
    window,
    contextCapsule,
    prompt,
    promptHash,
    outputText: rawText,
    observations: repairedValidated.observations,
    acceptedObservations: repairedValidated.acceptedObservations,
    rejectedObservations: repairedValidated.rejectedObservations,
    validationErrors: repairedValidated.validationErrors,
    evidenceErrors: repairedValidated.evidenceErrors,
    status: effectiveStatus,
    failureReason: effectiveStatus === "failed" ? "all_observations_rejected_after_repair" : null,
  });
}

async function runSemanticTaskPacket({ task, window, contextCapsule, noAi, allowDecompose = true, importedRawText = null, allowRepair = true }) {
  const schema = taskResponseSchema(task);
  const prompt = buildSemanticTaskPrompt({ task, window, contextCapsule });
  const promptHash = sha256Text(prompt);

  if (noAi) {
    const rawText = JSON.stringify({ observations: [] }, null, 2);
    return buildTaskPacket({
      task,
      window,
      contextCapsule,
      prompt,
      promptHash,
      outputText: rawText,
      observations: [],
      acceptedObservations: [],
      rejectedObservations: [],
      validationErrors: [],
      evidenceErrors: [],
      status: "empty",
    });
  }

  try {
    const rawText = importedRawText !== null
      ? importedRawText
      : await callSemanticProviderSync({ task, prompt, schema });

    return await finalizeTaskPacketFromRaw({
      task,
      window,
      contextCapsule,
      prompt,
      promptHash,
      rawText,
      allowRepair,
    });
  } catch (error) {
    const failureReason = String(error?.message || error);

    if (allowDecompose && window.render_paragraphs.length > 1) {
      const accepted = [];
      const rejected = [];
      const validationErrors = [];
      const evidenceErrors = [];
      for (const paragraph of window.render_paragraphs) {
        const fragment = await runSemanticTaskPacket({
          task,
          window: makeWindowFragment(window, paragraph),
          contextCapsule,
          noAi,
          allowDecompose: false,
          importedRawText: null,
          allowRepair,
        });
        accepted.push(...fragment.accepted_observations);
        rejected.push(...fragment.rejected_observations);
        validationErrors.push(...fragment.validation_errors);
        evidenceErrors.push(...fragment.evidence_errors);
      }
      accepted.sort(compareObservations);
      return buildTaskPacket({
        task,
        window,
        contextCapsule,
        prompt,
        promptHash,
        outputText: JSON.stringify({ observations: [] }),
        observations: [],
        acceptedObservations: accepted,
        rejectedObservations: rejected,
        validationErrors,
        evidenceErrors,
        status: accepted.length > 0 ? "ok" : "failed",
        failureReason: accepted.length > 0 ? "decomposed_after_packet_failure" : failureReason,
      });
    }

    await saveBadAiJson("", "task-failed", { task, scene_window_id: window.scene_window_id, error: failureReason, provider: PROVIDER });
    return buildTaskPacket({
      task,
      window,
      contextCapsule,
      prompt,
      promptHash,
      outputText: JSON.stringify({ observations: [] }),
      observations: [],
      acceptedObservations: [],
      rejectedObservations: [],
      validationErrors: [failureReason],
      evidenceErrors: /render_para_key|Quote not found|Missing evidence anchors/i.test(failureReason) ? [failureReason] : [],
      status: "failed",
      failureReason,
    });
  }
}

function makeObservationSpanRow({ semanticRun, window, observation, taskPacket, runHash }) {
  let family = "meaning";
  let spanType = "meaning_span";
  let label = observation.summary || null;
  let subjectName = null;
  let evidence = [];
  let interpretation = observation.notes || observation.summary || null;

  switch (taskPacket.task) {
    case "meaning_spans":
      family = "meaning";
      spanType = observation.kind;
      label = observation.summary;
      evidence = observation.evidence;
      interpretation = observation.notes || observation.summary;
      break;
    case "dualisms":
      family = "dualism";
      spanType = "dualism_relation";
      label = observation.axis;
      subjectName = observation.polarity;
      evidence = [...observation.left_evidence, ...observation.right_evidence, ...observation.bridge_evidence];
      interpretation = observation.summary;
      break;
    case "archetypes":
      family = "archetype";
      spanType = "archetype_observation";
      label = observation.archetype;
      subjectName = observation.character;
      evidence = observation.evidence;
      interpretation = `${observation.movement}: ${observation.summary}${observation.archetype_gloss ? ` | gloss=${observation.archetype_gloss}` : ""}`;
      break;
    case "biblical_references":
      family = "biblical";
      spanType = "biblical_reference";
      label = observation.biblical_anchor_label;
      subjectName = observation.motif_family;
      evidence = observation.evidence;
      interpretation = `${observation.relationship_type}: ${observation.correspondence_rationale}`;
      break;
    case "hyperlinks_parallelisms":
      family = "hyperlink";
      spanType = observation.relationship_type;
      label = observation.summary;
      subjectName = observation.target_hint || null;
      evidence = [...observation.source_evidence, ...observation.target_evidence];
      interpretation = observation.summary;
      break;
  }

  evidence.sort(compareEvidenceRefs);
  const evidenceText = evidence.map((item) => item.quote).join("\n---\n");
  const evidenceHash = sha256Text(canonicalJson(evidence));
  const normalizedObservationHash = observationIdentityHash(observation);
  const semanticHash = sha256Text(canonicalJson({
    selected_xml_driver: true,
    semantic_run_id: semanticRun.id,
    scene_window_id: window.scene_window_id,
    source_doc_id: window.source_doc_id,
    task: taskPacket.task,
    context_capsule_sha256: taskPacket.contextCapsuleHash,
    prompt_sha256: taskPacket.promptHash,
    model_output_sha256: taskPacket.outputHash,
    evidence_hash: evidenceHash,
    normalized_observation_hash: normalizedObservationHash,
    model: PROVIDER_MODEL,
  }));

  return {
    semantic_run_id: semanticRun.id,
    span_key: "mspan_" + semanticHash.slice(0, 32),
    span_type: spanType,
    claim_family: family,
    label: label || null,
    subject_name: subjectName || null,
    evidence_text: evidenceText || null,
    evidence_sha256: evidenceText ? sha256Text(evidenceText) : null,
    source_span: {
      source_doc_id: window.source_doc_id,
      scene_window_id: window.scene_window_id,
      source_document_xml_sha256: window.document_xml_sha256,
      evidence,
    },
    interpretation: interpretation || null,
    confidence: clamp01(observation.confidence, 0.5),
    prompt_sha256: taskPacket.promptHash,
    model_output_sha256: taskPacket.outputHash,
    semantic_hash: semanticHash,
    metadata: {
      selected_xml_driver: true,
      primary_lane: "semantic_meaning_spans",
      old_table_mirror_blocked_on_first_run: true,
      prompt_version: PROMPT_VERSION,
      model: PROVIDER_MODEL,
      task: taskPacket.task,
      run_hash: runHash,
      evidence_hash: evidenceHash,
      context_capsule_sha256: taskPacket.contextCapsuleHash,
      normalized_observation_hash: normalizedObservationHash,
      canonical_anchor_key: observation.archetype_anchor_key || observation.biblical_anchor_key || null,
      observation,
    },
    active: true,
  };
}

function buildMeaningSpanRowsFromTaskPackets({ semanticRun, window, taskPackets, runHash }) {
  return taskPackets.flatMap((packet) =>
    packet.accepted_observations.map((observation) => makeObservationSpanRow({ semanticRun, window, observation, taskPacket: packet, runHash }))
  );
}

function buildArchetypeAnchorRowsFromTaskPackets(taskPackets) {
  const rows = [];
  for (const packet of taskPackets) {
    if (packet.task !== "archetypes") continue;
    for (const observation of packet.accepted_observations) {
      rows.push({
        anchor_key: observation.archetype_anchor_key,
        canonical_label: observation.archetype,
        ontology_family: "jungian",
        ontology_version: "jungian_closed_v1",
        metadata: {
          selected_xml_driver: true,
          prompt_version: PROMPT_VERSION,
        },
        active: true,
      });
    }
  }
  return uniqueBy(rows, (row) => row.anchor_key).sort((a, b) => a.anchor_key.localeCompare(b.anchor_key));
}

function buildBiblicalAnchorRowsFromTaskPackets({ semanticRun, taskPackets }) {
  const rows = [];
  for (const packet of taskPackets) {
    if (packet.task !== "biblical_references") continue;
    for (const observation of packet.accepted_observations) {
      rows.push({
        semantic_run_id: semanticRun.id,
        anchor_key: observation.biblical_anchor_key,
        biblical_anchor_label: observation.biblical_anchor_label,
        book: observation.book,
        chapter: observation.chapter,
        verse_start: observation.verse_start,
        verse_end: observation.verse_end,
        motif_family: observation.motif_family,
        metadata: {
          selected_xml_driver: true,
          relationship_type: observation.relationship_type,
          prompt_version: PROMPT_VERSION,
        },
        active: true,
      });
    }
  }
  return uniqueBy(rows, (row) => row.anchor_key).sort((a, b) => a.anchor_key.localeCompare(b.anchor_key));
}

function crosslinkRelationType(leftTask, rightTask) {
  const pair = [leftTask, rightTask].sort().join("|");
  switch (pair) {
    case "archetypes|biblical_references":
      return "archetype_biblical_alignment";
    case "archetypes|dualisms":
      return "dualism_archetype_alignment";
    case "archetypes|hyperlinks_parallelisms":
      return "hyperlink_archetype_alignment";
    case "biblical_references|dualisms":
      return "dualism_biblical_alignment";
    case "biblical_references|hyperlinks_parallelisms":
      return "hyperlink_biblical_alignment";
    default:
      return null;
  }
}

function crosslinkNodesFromTaskPackets(taskPackets, spanRows) {
  const spanMap = new Map(spanRows.map((row) => [
    `${row.metadata?.task || ""}|${row.metadata?.normalized_observation_hash || ""}`,
    row,
  ]));

  const nodes = [];
  for (const packet of taskPackets) {
    for (const observation of packet.accepted_observations) {
      const spanRow = spanMap.get(`${packet.task}|${observationIdentityHash(observation)}`);
      if (!spanRow) continue;
      nodes.push({
        task: packet.task,
        family: spanRow.claim_family,
        observation,
        spanRow,
        evidence: observationEvidenceRefs(packet.task, observation),
        anchor_key: observation.archetype_anchor_key || observation.biblical_anchor_key || null,
      });
    }
  }
  return nodes;
}

function buildSemanticCrosslinkRowsFromTaskPackets({ semanticRun, window, taskPackets, spanRows }) {
  const nodes = crosslinkNodesFromTaskPackets(taskPackets, spanRows);
  const rows = [];

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const left = nodes[i];
      const right = nodes[j];
      const relationType = crosslinkRelationType(left.task, right.task);
      if (!relationType) continue;

      const overlap = evidenceOverlap(left.evidence, right.evidence);
      if (!overlap.length) continue;

      const evidenceText = overlap.map((ref) => ref.quote).join("\n---\n");
      const evidenceHash = sha256Text(canonicalJson(overlap));
      const rationale = [
        `Deterministic crosslink from shared selected XML evidence within scene_window_id=${window.scene_window_id}.`,
        `left=${left.task}:${left.spanRow.span_key}`,
        `right=${right.task}:${right.spanRow.span_key}`,
        `shared_render_para_keys=${uniqueBy(overlap.map((ref) => ref.render_para_key), (value) => value).join(",")}`,
      ].join(" ");
      const semanticHash = sha256Text(canonicalJson({
        selected_xml_driver: true,
        semantic_run_id: semanticRun.id,
        scene_window_id: window.scene_window_id,
        left_span_key: left.spanRow.span_key,
        right_span_key: right.spanRow.span_key,
        left_anchor_key: left.anchor_key,
        right_anchor_key: right.anchor_key,
        relation_type: relationType,
        overlap,
      }));

      rows.push({
        semantic_run_id: semanticRun.id,
        crosslink_key: `sx_${semanticHash.slice(0, 32)}`,
        scene_window_id: window.scene_window_id,
        source_doc_id: window.source_doc_id,
        relation_family: "shared_source_evidence",
        relation_type: relationType,
        left_family: left.family,
        left_span_key: left.spanRow.span_key,
        left_anchor_key: left.anchor_key,
        right_family: right.family,
        right_span_key: right.spanRow.span_key,
        right_anchor_key: right.anchor_key,
        evidence_text: evidenceText,
        evidence_sha256: evidenceHash,
        source_span: {
          source_doc_id: window.source_doc_id,
          scene_window_id: window.scene_window_id,
          source_document_xml_sha256: window.document_xml_sha256,
          evidence: overlap,
        },
        rationale,
        confidence: clamp01(Math.min(left.observation.confidence || 0, right.observation.confidence || 0), 0.5),
        prompt_sha256: left.spanRow.prompt_sha256,
        model_output_sha256: left.spanRow.model_output_sha256,
        semantic_hash: semanticHash,
        metadata: {
          selected_xml_driver: true,
          primary_lane: "semantic_meaning_spans",
          old_table_mirror_blocked_on_first_run: true,
          prompt_version: PROMPT_VERSION,
          left_task: left.task,
          right_task: right.task,
        },
        active: true,
      });
    }
  }

  return uniqueBy(rows, (row) => row.semantic_hash).sort((a, b) => a.crosslink_key.localeCompare(b.crosslink_key));
}

function buildSemanticRunArtifactRows({ semanticRun, pathsOutDir, importedBatch = null }) {
  const candidates = [
    { type: "source_summary", path: join(pathsOutDir, "source-summary.json") },
    { type: "selected_truth", path: join(pathsOutDir, "selected-truth.json") },
    { type: "selected_documents", path: join(pathsOutDir, "selected-documents.jsonl") },
    { type: "render_paragraphs", path: join(pathsOutDir, "render-paragraphs.jsonl") },
    { type: "scene_windows", path: join(pathsOutDir, "scene-windows.jsonl") },
    { type: "skipped_packets", path: join(pathsOutDir, "skipped-packets.jsonl") },
    { type: "fail_fast_summary", path: join(pathsOutDir, "fail-fast-summary.json") },
    { type: "run_summary", path: join(pathsOutDir, "run-summary.json") },
  ];

  if (importedBatch?.resultFile) candidates.push({ type: "batch_output_import", path: importedBatch.resultFile });
  if (importedBatch?.manifestPath) candidates.push({ type: "batch_manifest_import", path: importedBatch.manifestPath });

  return candidates
    .filter((entry) => existsSync(entry.path))
    .map((entry) => ({
      semantic_run_id: semanticRun.id,
      artifact_key: `artifact_${sha256Text(`${semanticRun.id}\t${entry.type}\t${entry.path}`).slice(0, 32)}`,
      artifact_type: entry.type,
      artifact_path: entry.path,
      artifact_sha256: sha256File(entry.path),
      metadata: {
        selected_xml_driver: true,
        prompt_version: PROMPT_VERSION,
      },
      active: true,
    }));
}

function createSkippedTaskPacket({ task, window, contextCapsule, reason }) {
  const prompt = "";
  const promptHash = sha256Text(prompt);
  const outputText = JSON.stringify({ observations: [] });
  return buildTaskPacket({
    task,
    window,
    contextCapsule,
    prompt,
    promptHash,
    outputText,
    observations: [],
    acceptedObservations: [],
    rejectedObservations: [],
    validationErrors: [],
    evidenceErrors: [],
    status: "skipped",
    failureReason: reason,
  });
}

function taskPacketSummary(taskPackets) {
  return Object.fromEntries(TASK_ORDER.map((task) => {
    const packet = taskPackets.find((item) => item.task === task);
    return [task, packet ? packet.accepted_observations.length : 0];
  }));
}

function taskFailureDetails(taskPackets) {
  return taskPackets
    .filter((packet) => packet.status === "failed")
    .map((packet) => ({
      task_type: packet.task_type,
      window_id: packet.window_id,
      failure_reason: packet.failure_reason,
      validation_errors: packet.validation_errors,
      evidence_errors: packet.evidence_errors,
    }));
}

function isFullSelectedRun() {
  return !LIMIT_DOCS && !LIMIT;
}

function buildSemanticBatchEntries({ windowPlans, contextPack, chapters, narrativeSources, availableNarrativeContextMap }) {
  const entries = [];

  for (const windowPlan of windowPlans) {
    const { window, semanticPlan } = windowPlan;
    if (semanticPlan.status !== "semantic") continue;
    const contextCapsule = buildNarrativeContextCapsule({ contextPack, chapters, narrativeSources, availableNarrativeContextMap, window });
    for (const task of TASK_ORDER) {
      const prompt = buildSemanticTaskPrompt({ task, window, contextCapsule });
      const promptHash = sha256Text(prompt);
      const schema = taskResponseSchema(task);
      const customId = buildBatchCustomId({ window, task, promptHash, contextHash: contextCapsule.context_capsule_sha256 });
      entries.push(buildBatchManifestEntry({ customId, task, window, contextCapsule, prompt, promptHash, schema }));
    }
  }

  return entries;
}

async function failFastRun({ semanticRun, pathsOutDir, summary }) {
  writeFileSync(join(pathsOutDir, "fail-fast-summary.json"), JSON.stringify(summary, null, 2));

  if (writeMode) {
    await patchRow("semantic_runs", semanticRun.id, {
      status: "failed",
      completed_at: new Date().toISOString(),
      metadata: {
        ...(semanticRun.metadata || {}),
        fail_fast: true,
        fail_fast_summary: summary,
        selected_xml_driver: true,
        primary_hash_lane: "semantic_meaning_spans",
        old_semantic_table_writes: "blocked_on_first_run",
      },
    }).catch(() => []);

    const artifactRows = buildSemanticRunArtifactRows({ semanticRun, pathsOutDir });
    if (artifactRows.length) {
      await insertRows("semantic_run_artifacts?on_conflict=artifact_key", artifactRows).catch(() => []);
    }
  }

  console.error(JSON.stringify({ event: "fail_fast", ...summary }));
  throw new Error(`Fail-fast: ${summary.reason}`);
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
      model: PROVIDER_MODEL,
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
          model: PROVIDER_MODEL,
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
    const sceneWindowId = "scene_" + sha256Text([chunk[0]?.folder || "", i, text].join("\t")).slice(0, 32);
    out.push({
      scene_window_id: sceneWindowId,
      scene_window_key: sceneWindowId,
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
    const sourceDocId = "srcdoc_" + sha256Text(`${folder}\t${docSha}`).slice(0, 32);
    const xmlParagraphs = extractOoxmlParagraphs(readText(documentPath), folder, docSha);
    const renderParagraphs = buildRenderParagraphs(xmlParagraphs, folder, docSha);
    for (const paragraph of renderParagraphs) paragraph.source_doc_id = sourceDocId;
    const sceneWindows = buildSceneWindows(renderParagraphs);
    for (const window of sceneWindows) window.source_doc_id = sourceDocId;
    const fullText = renderParagraphs.map((p) => p.text).join("\n\n");

    docs.push({
      folder,
      source_doc_id: sourceDocId,
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
  // Returns ALL windows across loaded docs.
  // LIMIT is enforced at the semantic-window level inside the main processing loop,
  // so heading/byline/junk windows do not consume the semantic budget.
  return docs.flatMap((doc) =>
    doc.scene_windows.map((w) => ({
      ...w,
      folder: doc.folder,
      document_xml_sha256: doc.document_xml_sha256,
    }))
  );
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
      model: PROVIDER_MODEL,
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

async function writeSelectedSemanticRows({ semanticRun, window, spanRows, taskPackets }) {
  const archetypeAnchorRows = buildArchetypeAnchorRowsFromTaskPackets(taskPackets);
  const biblicalAnchorRows = buildBiblicalAnchorRowsFromTaskPackets({ semanticRun, taskPackets });
  const crosslinkRows = buildSemanticCrosslinkRowsFromTaskPackets({ semanticRun, window, taskPackets, spanRows });

  if (!writeMode) {
    console.log(JSON.stringify({
      dry_run_selected_window: window.scene_window_id,
      render_para_keys: window.render_paragraphs.map((p) => p.render_para_key),
      old_semantic_table_writes: "blocked",
      primary_lane: "semantic_meaning_spans",
      task_counts: taskPacketSummary(taskPackets),
      task_failures: taskPackets.filter((packet) => packet.status === "failed").length,
      semantic_meaning_spans: spanRows.length,
      semantic_archetype_anchors: archetypeAnchorRows.length,
      semantic_biblical_anchors: biblicalAnchorRows.length,
      semantic_crosslinks: crosslinkRows.length,
    }, null, 2));
    return;
  }

  if (spanRows.length) await insertRows("semantic_meaning_spans?on_conflict=semantic_hash", spanRows);
  if (archetypeAnchorRows.length) await insertRows("semantic_archetype_anchors?on_conflict=anchor_key", archetypeAnchorRows);
  if (biblicalAnchorRows.length) await insertRows("semantic_biblical_anchors?on_conflict=anchor_key", biblicalAnchorRows);
  if (crosslinkRows.length) await insertRows("semantic_crosslinks?on_conflict=semantic_hash", crosslinkRows);
}

async function main() {
  validateSources();
  const contextPack = readText(paths.contextPack);
  const chapters = loadPublicChapters();
  const narrativeSources = loadNarrativeContextSources();
  const availableNarrativeContextMap = buildAvailableNarrativeContextMap(chapters);
  const { selected, docs } = loadSelectedXmlDocuments();
  const windows = selectedXmlWindows(docs);
  const windowPlans = windows.map((window) => ({ window, semanticPlan: classifySemanticWindow(window) }));
  const plannedSemanticWindows = windowPlans.filter((entry) => entry.semanticPlan.status === "semantic").length;
  const plannedSkippedWindows = windowPlans.length - plannedSemanticWindows;
  const batchMode = batchOperationMode();

  if (isFullSelectedRun() && (writeMode || submitBatch) && !fullRunConfirm && !noAi && batchMode !== "poll") {
    throw new Error("Full selected XML semantic runs require --full-run-confirm.");
  }

  // Fail early if data-plane credentials are missing or wrong type in write mode.
  if (writeMode) {
    must(SUPABASE_URL, "SUPABASE_URL not set (and SUPABASE_PROJECT_REF not set). Cannot write to Supabase data plane. Set SUPABASE_URL or SUPABASE_PROJECT_REF secret/var.");
    classifyServiceKey(SUPABASE_SERVICE_KEY); // throws with explicit guidance on wrong key type
    console.log(JSON.stringify({ event: "db_adapter_init", db_adapter: "supabase_data_plane", management_api_hot_path: false, supabase_url_set: true, service_key_set: true }));
  }

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
    planned_semantic_window_count: plannedSemanticWindows,
    planned_skipped_window_count: plannedSkippedWindows,
    expected_public_chapter_context_count: EXPECTED_PUBLIC_CHAPTER_COUNT,
    public_chapter_context_count: chapters.length,
    narrative_protocol_source_count: narrativeSources.length,
    narrative_protocol_sources: narrativeSources.map((source) => ({
      role: source.role,
      key: source.key,
      sha256: source.sha256,
    })),
    available_narrative_context_map: true,
    available_narrative_context_map_sha256: sha256Text(availableNarrativeContextMap),
    optional_reference_corpus_status: optionalReferenceCorpusStatus(),
    selected_xml_driver: true,
    render_segmentation: "xml_plus_novel_grammar_v4",
    scene_window_packet_size: BATCH_SIZE,
    ai_task_order: TASK_ORDER,
    primary_hash_lane: "semantic_meaning_spans",
    old_semantic_table_writes: "blocked_on_first_run",
    semantic_provider: PROVIDER,
    semantic_model: PROVIDER_MODEL,
    batch_mode: batchMode,
    write_mode: writeMode,
    no_ai: noAi,
  };

  console.log(JSON.stringify({
    event: "startup_config",
    selected_xml_driver: true,
    provider: ORIGINAL_PROVIDER,
    canonical_provider: CANONICAL_PROVIDER,
    provider_model: noAi ? "no-ai" : PROVIDER_MODEL,
    db_adapter: "supabase_data_plane",
    management_api_hot_path: false,
    batch_mode: batchMode,
    submit_batch: submitBatch,
    poll_batch_id: POLL_BATCH_ID || null,
    import_batch_results_path: IMPORT_BATCH_RESULTS_PATH || null,
    full_run_confirm: fullRunConfirm,
    effective_limit_docs: LIMIT_DOCS,
    effective_limit: LIMIT,
    effective_batch_size: BATCH_SIZE,
    selected_docs_count: docs.length,
    expected_public_chapter_count: EXPECTED_PUBLIC_CHAPTER_COUNT,
    public_chapter_context_count: chapters.length,
    narrative_protocol_source_count: narrativeSources.length,
    optional_reference_corpus_status: optionalReferenceCorpusStatus(),
    total_windows: windows.length,
    semantic_windows_planned: plannedSemanticWindows,
    skipped_windows_planned: plannedSkippedWindows,
    min_semantic_window_words: MIN_SEMANTIC_WINDOW_WORDS,
    min_semantic_window_chars: MIN_SEMANTIC_WINDOW_CHARS,
    allow_failure_continue: ALLOW_FAILURE_CONTINUE,
    no_ai: noAi,
    write_mode: writeMode,
  }));

  writeFileSync(join(paths.outDir, "source-summary.json"), JSON.stringify(sourceSummary, null, 2));
  writeFileSync(join(paths.outDir, "selected-truth.json"), JSON.stringify(selected, null, 2));
  writeFileSync(join(paths.outDir, "selected-documents.jsonl"), docs.map((doc) => JSON.stringify({
    source_doc_id: doc.source_doc_id,
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
    scene_window_id: w.scene_window_id,
    scene_window_key: w.scene_window_key,
    source_doc_id: w.source_doc_id,
    folder: w.folder,
    document_xml_sha256: w.document_xml_sha256,
    render_para_keys: w.render_paragraphs.map((p) => p.render_para_key),
    text_sha256: w.text_sha256,
  })).join("\n") + "\n");

  if (batchMode === "poll") {
    const batch = await pollProviderBatch(POLL_BATCH_ID);
    writeFileSync(join(paths.outDir, `batch-poll-${POLL_BATCH_ID}.json`), JSON.stringify(batch, null, 2));
    console.log(JSON.stringify({ event: "batch_poll", provider: PROVIDER, batch_id: POLL_BATCH_ID, output_path: batch.output_path || null, status: batch.processing_status || batch.status || null }));
    return;
  }

  const batchEntries = isBatchProvider(PROVIDER) ? buildSemanticBatchEntries({ windowPlans, contextPack, chapters, narrativeSources, availableNarrativeContextMap }) : [];
  if (isBatchProvider(PROVIDER) && batchMode !== "import") {
    const artifacts = writeBatchArtifacts(batchEntries);
    const summary = {
      event: "batch_prepared",
      provider: PROVIDER,
      model: PROVIDER_MODEL,
      entry_count: batchEntries.length,
      manifest_path: artifacts.manifestPath,
      requests_path: artifacts.requestsPath,
      submit_batch: submitBatch,
    };
    if (submitBatch) {
      const batch = await submitPreparedBatch(artifacts);
      summary.batch_id = batch.id;
      summary.batch_status = batch.processing_status || batch.status || null;
      summary.output_file_id = batch.output_file_id || null;
    }
    console.log(JSON.stringify(summary));
    return;
  }

  const importedBatch = isBatchProvider(PROVIDER) && batchMode === "import"
    ? parseImportedBatchResults(IMPORT_BATCH_RESULTS_PATH)
    : null;
  if (importedBatch?.manifest?.provider && importedBatch.manifest.provider !== PROVIDER) {
    throw new Error(`Imported batch manifest provider mismatch: expected ${PROVIDER}, got ${importedBatch.manifest.provider}`);
  }

  loadOllamaResultCache();

  const semanticRun = await createSemanticRun(sourceSummary);

  if (writeMode) {
    await insertRows("render_paragraphs?on_conflict=render_para_key", renderParagraphRowsForDb(semanticRun, docs));
  }

  const runHash = sha256Text(canonicalJson({
    semantic_run_id: semanticRun.id,
    prompt_version: PROMPT_VERSION,
    provider: PROVIDER,
    model: PROVIDER_MODEL,
    selected_truth_sha256: selected.sha256,
    narrative_context_sha256: NARRATIVE_CONTEXT_SHA256,
    xml_manifest_sha256: XML_MANIFEST_SHA256,
    scene_window_packet_size: BATCH_SIZE,
    ai_task_order: TASK_ORDER,
  }));

  const completedCheckpoints = await loadCompletedCheckpoints();

  let totalProcessed = 0;
  let rawWindowsSeen = 0;
  let totalMeaningSpans = 0;
  let totalTaskFailures = 0;
  let skippedWindows = 0;
  let skippedDueToCheckpoint = 0;
  let semanticWindows = 0;
  let totalBiblical = 0;
  let totalArchetypes = 0;
  let totalDualisms = 0;
  let totalHyperlinks = 0;
  let taskOk = 0;
  let taskEmpty = 0;
  let taskSkipped = 0;
  let taskFailed = 0;
  let observationsAccepted = 0;
  let observationsRejected = 0;
  let consecutiveFailedWindows = 0;
  const skippedPackets = [];
  const skipReasonCounts = {};
  const perTaskFailures = Object.fromEntries(TASK_ORDER.map((task) => [task, 0]));
  const taskCounts = Object.fromEntries(TASK_ORDER.map((task) => [task, { ok: 0, empty: 0, failed: 0, skipped: 0 }]));

  for (const [windowIndex, windowPlan] of windowPlans.entries()) {
    const { window, semanticPlan } = windowPlan;
    rawWindowsSeen += 1;

    // Pre-AI skip gate: heading/byline/junk windows do not consume the semantic LIMIT budget.
    if (semanticPlan.status === "skipped") {
      skippedWindows += 1;
      skipReasonCounts[semanticPlan.reason] = (skipReasonCounts[semanticPlan.reason] || 0) + 1;
      console.warn(JSON.stringify({
        event: "window_skipped",
        window_index: windowIndex,
        scene_window_id: window.scene_window_id,
        folder: window.folder,
        skip_reason: semanticPlan.reason,
        word_count: semanticPlan.wordCount,
        char_count: semanticPlan.charCount,
        text_preview: String(window.text || "").slice(0, 200),
        min_words: MIN_SEMANTIC_WINDOW_WORDS,
        min_chars: MIN_SEMANTIC_WINDOW_CHARS,
        raw_windows_seen: rawWindowsSeen,
        semantic_windows_so_far: semanticWindows,
        semantic_windows_target: LIMIT || null,
      }));
      continue; // skip all AI and artifact I/O for pre-classified junk windows
    }

    // Checkpoint-skip: if every task for this window is already done, skip entirely.
    if (resumeMode && completedCheckpoints.size > 0) {
      const allDone = TASK_ORDER.every((task) =>
        completedCheckpoints.has(makeCheckpointKey(window.folder, window.scene_window_id, task))
      );
      if (allDone) {
        skippedDueToCheckpoint += 1;
        semanticWindows += 1; // counts toward LIMIT so we don't re-process indefinitely
        console.log(JSON.stringify({
          event: "window_checkpoint_skip",
          window_index: windowIndex,
          scene_window_id: window.scene_window_id,
          folder: window.folder,
          skipped_due_to_checkpoint: skippedDueToCheckpoint,
          semantic_windows_so_far: semanticWindows,
        }));
        if (LIMIT && semanticWindows >= LIMIT) break;
        continue;
      }
    }

    // Semantic window: build context, run tasks, write artifacts
    semanticWindows += 1;
    const contextCapsule = buildNarrativeContextCapsule({ contextPack, chapters, narrativeSources, availableNarrativeContextMap, window });
    writeFileSync(
      join(paths.outDir, `context-capsule-selected-${String(windowIndex).padStart(5, "0")}.json`),
      JSON.stringify(contextCapsule, null, 2)
    );

    const taskPackets = [];
    for (const task of TASK_ORDER) {
        // Per-task checkpoint: skip AI call if this (window, task) is already persisted.
        if (resumeMode && completedCheckpoints.has(makeCheckpointKey(window.folder, window.scene_window_id, task))) {
          taskPackets.push({
            task,
            task_type: task,
            status: "checkpoint_skip",
            prompt: "",
            promptHash: "",
            outputText: "",
            outputHash: "",
            contextCapsuleHash: "",
            observations: [],
            accepted_observations: [],
            rejected_observations: [],
            failure_reason: null,
            validation_errors: [],
            evidence_errors: [],
            raw_output_hash: "",
            normalized_output_hash: "",
          });
          continue;
        }
        if (importedBatch) {
          const prompt = buildSemanticTaskPrompt({ task, window, contextCapsule });
          const promptHash = sha256Text(prompt);
          const customId = buildBatchCustomId({ window, task, promptHash, contextHash: contextCapsule.context_capsule_sha256 });
          const imported = importedBatch.outputs.get(customId);
          if (!imported?.ok || !imported.rawText) {
            taskPackets.push(buildTaskPacket({
              task,
              window,
              contextCapsule,
              prompt,
              promptHash,
              outputText: JSON.stringify({ observations: [] }),
              observations: [],
              acceptedObservations: [],
              rejectedObservations: [],
              validationErrors: [imported?.error ? String(imported.error) : `Missing imported batch result for ${customId}`],
              evidenceErrors: [],
              status: "failed",
              failureReason: imported?.error ? "batch_result_error" : "missing_batch_result",
            }));
          } else {
            taskPackets.push(await runSemanticTaskPacket({
              task,
              window,
              contextCapsule,
              noAi,
              importedRawText: imported.rawText,
              allowRepair: false,
            }));
          }
        } else {
          taskPackets.push(await runSemanticTaskPacket({ task, window, contextCapsule, noAi }));
        }
      }

    for (const packet of taskPackets) {
      if (packet.status === "ok") taskOk += 1;
      if (packet.status === "empty") taskEmpty += 1;
      if (packet.status === "skipped") taskSkipped += 1;
      if (packet.status === "failed") {
        taskFailed += 1;
        totalTaskFailures += 1;
        perTaskFailures[packet.task] += 1;
      }
      taskCounts[packet.task][packet.status] = (taskCounts[packet.task][packet.status] || 0) + 1;
      const acceptedCount = packet.accepted_observations.length;
      observationsAccepted += acceptedCount;
      observationsRejected += packet.rejected_observations.length;
      if (packet.task === "biblical_references") totalBiblical += acceptedCount;
      else if (packet.task === "archetypes") totalArchetypes += acceptedCount;
      else if (packet.task === "dualisms") totalDualisms += acceptedCount;
      else if (packet.task === "hyperlinks_parallelisms") totalHyperlinks += acceptedCount;

      const stem = `${String(windowIndex).padStart(5, "0")}-${packet.task}`;
      writeFileSync(join(paths.outDir, `prompt-selected-${stem}.txt`), packet.prompt);
      writeFileSync(join(paths.outDir, `prompt-selected-${stem}.sha256`), `${packet.promptHash}
`);
      writeFileSync(join(paths.outDir, `result-selected-${stem}.json`), packet.outputText);
      writeFileSync(join(paths.outDir, `result-selected-${stem}.sha256`), `${packet.outputHash}
`);
      writeFileSync(
        join(paths.outDir, `normalized-selected-${stem}.json`),
        JSON.stringify({
          status: packet.status,
          task_type: packet.task_type,
          scene_window_id: window.scene_window_id,
          source_doc_id: window.source_doc_id,
          context_capsule_sha256: packet.contextCapsuleHash,
          observations: packet.observations,
          accepted_observations: packet.accepted_observations,
          rejected_observations: packet.rejected_observations,
          failure_reason: packet.failure_reason,
          validation_errors: packet.validation_errors,
          evidence_errors: packet.evidence_errors,
          raw_output_hash: packet.raw_output_hash,
          normalized_output_hash: packet.normalized_output_hash,
        }, null, 2)
      );

      if (packet.status === "failed" || packet.status === "skipped") {
        skippedPackets.push({
          task_type: packet.task_type,
          status: packet.status,
          failure_reason: packet.failure_reason,
          validation_errors: packet.validation_errors,
          evidence_errors: packet.evidence_errors,
          window_index: windowIndex,
          folder: window.folder,
          source_doc_id: window.source_doc_id,
        });
      }
    }

    const spanRows = buildMeaningSpanRowsFromTaskPackets({ semanticRun, window, taskPackets, runHash });
    await writeSelectedSemanticRows({ semanticRun, window, spanRows, taskPackets });
    await upsertWindowCheckpoints({ semanticRun, window, taskPackets });
    totalMeaningSpans += spanRows.length;

    writeFileSync(
      join(paths.outDir, `meaning-spans-selected-${String(windowIndex).padStart(5, "0")}.jsonl`),
      spanRows.map((r) => JSON.stringify(r)).join("\n") + (spanRows.length ? "\n" : "")
    );

    totalProcessed += 1;
    const windowAccepted = taskPackets.reduce((sum, packet) => sum + packet.accepted_observations.length, 0);
    const windowFailedTasks = taskPackets.filter((packet) => packet.status === "failed").length;
    consecutiveFailedWindows = windowAccepted === 0 && windowFailedTasks > 0
      ? consecutiveFailedWindows + 1
      : 0;

    console.log(JSON.stringify({
      run_id: semanticRun.id,
      selected_xml_driver: true,
      primary_lane: "semantic_meaning_spans",
      db_adapter: "supabase_data_plane",
      provider: ORIGINAL_PROVIDER,
      canonical_provider: CANONICAL_PROVIDER,
      provider_model: noAi ? "no-ai" : PROVIDER_MODEL,
      window: window.scene_window_id,
      folder: window.folder,
      raw_windows_seen: rawWindowsSeen,
      processed_windows: totalProcessed,
      total_windows: windows.length,
      skipped_windows: skippedWindows,
      semantic_windows_target: LIMIT || null,
      semantic_windows_attempted: semanticWindows,
      semantic_windows: semanticWindows,
      skipped_due_to_checkpoint: skippedDueToCheckpoint,
      meaning_spans: totalMeaningSpans,
      task_failures: totalTaskFailures,
      task_ok: taskOk,
      task_empty: taskEmpty,
      task_skipped: taskSkipped,
      task_failed: taskFailed,
      observations_accepted: observationsAccepted,
      observations_rejected: observationsRejected,
      consecutive_failed_windows: consecutiveFailedWindows,
      task_counts: taskPacketSummary(taskPackets),
      per_task_failures: perTaskFailures,
      no_ai: noAi,
      write_mode: writeMode,
      resume_mode: resumeMode,
      run_hash: runHash,
    }));

    if (!ALLOW_FAILURE_CONTINUE) {
      const semanticTaskSample = taskOk + taskEmpty + taskFailed;
      const initialNoSignal = semanticWindows >= FAIL_FAST_INITIAL_SEMANTIC_WINDOWS &&
        observationsAccepted === 0 &&
        taskFailed > FAIL_FAST_INITIAL_FAILED_TASKS;
      const consecutiveWindowFailure = consecutiveFailedWindows >= FAIL_FAST_CONSECUTIVE_FAILED_WINDOWS;
      const highFailureRate = semanticTaskSample >= FAIL_FAST_TASK_SAMPLE &&
        (taskFailed / semanticTaskSample) > FAIL_FAST_TASK_FAILURE_RATE;

      if (initialNoSignal || consecutiveWindowFailure || highFailureRate) {
        await failFastRun({
          semanticRun,
          pathsOutDir: paths.outDir,
          summary: {
            reason: initialNoSignal
              ? "no_accepted_observations_in_first_semantic_windows"
              : consecutiveWindowFailure
                ? "consecutive_failed_windows_threshold"
                : "task_failure_rate_threshold",
            provider: ORIGINAL_PROVIDER,
            canonical_provider: CANONICAL_PROVIDER,
            processed_windows: totalProcessed,
            raw_windows_seen: rawWindowsSeen,
            total_windows: windows.length,
            skipped_windows: skippedWindows,
            skip_reason_counts: skipReasonCounts,
            semantic_windows_target: LIMIT || null,
            semantic_windows_attempted: semanticWindows,
            semantic_windows: semanticWindows,
            task_ok: taskOk,
            task_empty: taskEmpty,
            task_skipped: taskSkipped,
            task_failed: taskFailed,
            observations_accepted: observationsAccepted,
            observations_rejected: observationsRejected,
            consecutive_failed_windows: consecutiveFailedWindows,
            per_task_failures: perTaskFailures,
            latest_window: window.scene_window_id,
            latest_window_failure_details: taskFailureDetails(taskPackets),
          },
        });
      }
    }

    // Semantic LIMIT reached — stop scanning further windows
    if (LIMIT && semanticWindows >= LIMIT) break;
  }

  const sourceExhaustedBeforeSemanticLimit = LIMIT ? semanticWindows < LIMIT : false;

  writeFileSync(
    join(paths.outDir, "skipped-packets.jsonl"),
    skippedPackets.map((record) => JSON.stringify(record)).join("\n") + (skippedPackets.length ? "\n" : "")
  );

  // Fail loudly: write mode exhausted all loaded source windows without finding any semantic content.
  // Check window_skipped events in the log for skip_reason + text_preview.
  // Likely cause: batch_size=1 with short paragraphs, or selected doc has only front matter.
  if (writeMode && !noAi && windows.length > 0 && semanticWindows === 0) {
    const allSkippedMsg = [
      `All ${rawWindowsSeen} window(s) were classified as non-semantic and skipped — no AI tasks ran.`,
      `raw_windows_seen=${rawWindowsSeen} skip_reason_counts=${JSON.stringify(skipReasonCounts)}`,
      `min_chars=${MIN_SEMANTIC_WINDOW_CHARS} min_words=${MIN_SEMANTIC_WINDOW_WORDS} batch_size=${BATCH_SIZE}`,
      `Check the window_skipped log events above for skip_reason and text_preview.`,
      `Fix: lower MIN_SEMANTIC_WINDOW_CHARS/MIN_SEMANTIC_WINDOW_WORDS env vars, or increase batch_size`,
      `so windows contain more prose per packet.`,
    ].join(" ");
    console.error(JSON.stringify({
      event: "run_failed_all_windows_skipped",
      provider: ORIGINAL_PROVIDER,
      canonical_provider: CANONICAL_PROVIDER,
      model: PROVIDER_MODEL,
      raw_windows_seen: rawWindowsSeen,
      total_windows: windows.length,
      skipped_windows: skippedWindows,
      skip_reason_counts: skipReasonCounts,
      semantic_windows: 0,
      semantic_windows_target: LIMIT || null,
      source_exhausted_before_semantic_limit: true,
      min_chars: MIN_SEMANTIC_WINDOW_CHARS,
      min_words: MIN_SEMANTIC_WINDOW_WORDS,
      batch_size: BATCH_SIZE,
      error: allSkippedMsg,
    }));
    await patchRow("semantic_runs", semanticRun.id, {
      status: "failed",
      error: allSkippedMsg,
      completed_at: new Date().toISOString(),
    }).catch(() => {});
    writeFileSync(join(paths.outDir, "run-summary.json"), JSON.stringify({
      run_id: semanticRun.id, write_mode: writeMode, no_ai: noAi,
      provider: ORIGINAL_PROVIDER, canonical_provider: CANONICAL_PROVIDER, model: PROVIDER_MODEL,
      raw_windows_seen: rawWindowsSeen, total_windows: windows.length,
      skipped_windows: skippedWindows, skip_reason_counts: skipReasonCounts, semantic_windows: 0,
      semantic_windows_target: LIMIT || null, source_exhausted_before_semantic_limit: true,
      total_meaning_spans: 0, task_skipped: taskSkipped,
      min_chars: MIN_SEMANTIC_WINDOW_CHARS, min_words: MIN_SEMANTIC_WINDOW_WORDS,
      batch_size: BATCH_SIZE, error: allSkippedMsg, failed: true, sourceSummary,
    }, null, 2));
    process.exit(1);
  }

  // Fail loudly: write mode with AI ran semantic windows but produced zero meaning_spans.
  // This indicates the model is too small, prompts are truncated, or the model returned empty JSON.
  // Raw model responses are saved in docs/forensics/audits/ai-bad-json/ for inspection.
  if (writeMode && !noAi && semanticWindows > 0 && totalMeaningSpans === 0 && skippedDueToCheckpoint < semanticWindows) {
    const emptyRunMsg = [
      `Zero meaning_spans written after processing ${semanticWindows} semantic window(s).`,
      `task_empty=${taskEmpty} task_failed=${taskFailed} task_ok=${taskOk}`,
      `Provider=${ORIGINAL_PROVIDER} canonical=${CANONICAL_PROVIDER} model=${PROVIDER_MODEL}`,
      `Check docs/forensics/audits/ai-bad-json/ for raw model output.`,
      `If model is too small, set a larger model (e.g. llama3.2:3b) or increase OLLAMA_NUM_CTX.`,
    ].join(" ");
    console.error(JSON.stringify({
      event: "run_failed_zero_spans",
      provider: ORIGINAL_PROVIDER, canonical_provider: CANONICAL_PROVIDER, model: PROVIDER_MODEL,
      raw_windows_seen: rawWindowsSeen, semantic_windows: semanticWindows,
      task_empty: taskEmpty, task_failed: taskFailed, error: emptyRunMsg,
    }));
    await patchRow("semantic_runs", semanticRun.id, {
      status: "failed",
      error: emptyRunMsg,
      completed_at: new Date().toISOString(),
    }).catch(() => {});
    writeFileSync(join(paths.outDir, "run-summary.json"), JSON.stringify({
      run_id: semanticRun.id,
      write_mode: writeMode,
      no_ai: noAi,
      provider: ORIGINAL_PROVIDER,
      canonical_provider: CANONICAL_PROVIDER,
      model: PROVIDER_MODEL,
      raw_windows_seen: rawWindowsSeen,
      total_meaning_spans: 0,
      meaning_spans: 0,
      semantic_windows: semanticWindows,
      semantic_windows_attempted: semanticWindows,
      semantic_windows_target: LIMIT || null,
      source_exhausted_before_semantic_limit: sourceExhaustedBeforeSemanticLimit,
      task_empty: taskEmpty,
      task_failed: taskFailed,
      task_ok: taskOk,
      error: emptyRunMsg,
      failed: true,
      sourceSummary,
    }, null, 2));
    process.exit(1);
  }

  if (writeMode) {
    await patchRow("semantic_runs", semanticRun.id, {
      status: "completed",
      completed_at: new Date().toISOString(),
      metadata: {
        ...(semanticRun.metadata || {}),
        raw_windows_seen: rawWindowsSeen,
        total_processed_windows: totalProcessed,
        total_meaning_spans: totalMeaningSpans,
        total_task_failures: totalTaskFailures,
        skipped_windows: skippedWindows,
        skipped_due_to_checkpoint: skippedDueToCheckpoint,
        skip_reason_counts: skipReasonCounts,
        semantic_windows_target: LIMIT || null,
        semantic_windows_attempted: semanticWindows,
        semantic_windows: semanticWindows,
        source_exhausted_before_semantic_limit: sourceExhaustedBeforeSemanticLimit,
        task_ok: taskOk,
        task_empty: taskEmpty,
        task_skipped: taskSkipped,
        task_failed: taskFailed,
        observations_accepted: observationsAccepted,
        observations_rejected: observationsRejected,
        per_task_failures: perTaskFailures,
        run_hash: runHash,
        ai_task_order: TASK_ORDER,
        selected_xml_driver: true,
        primary_hash_lane: "semantic_meaning_spans",
        db_adapter: "supabase_data_plane",
        management_api_hot_path: false,
        resume_mode: resumeMode,
        provider: ORIGINAL_PROVIDER,
        canonical_provider: CANONICAL_PROVIDER,
        semantic_model: PROVIDER_MODEL,
      },
    });
  }

  writeFileSync(join(paths.outDir, "run-summary.json"), JSON.stringify({
    run_id: semanticRun.id,
    write_mode: writeMode,
    no_ai: noAi,
    selected_xml_driver: true,
    primary_hash_lane: "semantic_meaning_spans",
    db_adapter: "supabase_data_plane",
    management_api_hot_path: false,
    provider: ORIGINAL_PROVIDER,
    canonical_provider: CANONICAL_PROVIDER,
    original_provider: ORIGINAL_PROVIDER,
    model: noAi ? "no-ai" : PROVIDER_MODEL,
    raw_windows_seen: rawWindowsSeen,
    processed_windows: totalProcessed,
    total_processed_windows: totalProcessed,
    skipped_windows: skippedWindows,
    skipped_due_to_checkpoint: skippedDueToCheckpoint,
    skip_reason_counts: skipReasonCounts,
    semantic_windows_target: LIMIT || null,
    semantic_windows_attempted: semanticWindows,
    semantic_windows: semanticWindows,
    source_exhausted_before_semantic_limit: sourceExhaustedBeforeSemanticLimit,
    meaning_spans: totalMeaningSpans,
    total_meaning_spans: totalMeaningSpans,
    biblical_references: totalBiblical,
    archetypes: totalArchetypes,
    dualisms: totalDualisms,
    hyperlinks_parallelisms: totalHyperlinks,
    total_task_failures: totalTaskFailures,
    task_ok: taskOk,
    task_empty: taskEmpty,
    task_skipped: taskSkipped,
    task_failed: taskFailed,
    task_counts: taskCounts,
    observations_accepted: observationsAccepted,
    observations_rejected: observationsRejected,
    per_task_failures: perTaskFailures,
    resume_mode: resumeMode,
    run_hash: runHash,
    narrative_context_sha256: NARRATIVE_CONTEXT_SHA256,
    xml_manifest_sha256: XML_MANIFEST_SHA256,
    batch_mode: batchMode,
    sourceSummary,
  }, null, 2));

  if (writeMode) {
    const runArtifactRows = buildSemanticRunArtifactRows({ semanticRun, pathsOutDir: paths.outDir, importedBatch });
    if (runArtifactRows.length) {
      await insertRows("semantic_run_artifacts?on_conflict=artifact_key", runArtifactRows);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
