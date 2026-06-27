#!/usr/bin/env node
/**
 * Backfill semantic_window_task_checkpoints for llama3.2:3b using the completed
 * llama3.2:1b run (a7d64f11) which processed all 770 windows.
 *
 * Windows with spans in the 1b run → status "completed"
 * Windows processed by 1b but no spans  → status "empty"
 *
 * After running this, trigger the 3b workflow with --resume and it will skip
 * everything already covered.
 *
 * Usage:
 *   SUPABASE_URL=https://... SUPABASE_SERVICE_ROLE_KEY=... node scripts/semantic/backfill-checkpoints-from-1b-run.mjs
 */

import { createHash } from "node:crypto";
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, basename } from "node:path";

const ROOT = process.cwd();
const PROMPT_VERSION     = "xml-selected-meaning-span-v5";
const TARGET_PROVIDER    = "ollama";
const TARGET_MODEL       = "llama3.2:3b";
const SOURCE_RUN_ID      = "a7d64f11-012b-426e-9d65-f2f813a85070"; // complete 1b run
const BATCH_SIZE         = 1;
const TASK_ORDER         = ["meaning_spans","dualisms","archetypes","biblical_references","hyperlinks_parallelisms"];

const SUPABASE_URL  = process.env.SUPABASE_URL || (process.env.SUPABASE_PROJECT_REF ? `https://${process.env.SUPABASE_PROJECT_REF}.supabase.co` : "");
const SERVICE_KEY   = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Set SUPABASE_URL (or SUPABASE_PROJECT_REF) and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const AUTH_HEADERS = {
  "apikey": SERVICE_KEY,
  "Authorization": `Bearer ${SERVICE_KEY}`,
  "Content-Type": "application/json",
  "Accept": "application/json",
};

function sha256Text(text) {
  return createHash("sha256").update(text).digest("hex");
}

function makeCheckpointKey(folder, sceneWindowId, taskName) {
  return sha256Text([folder, sceneWindowId, taskName, PROMPT_VERSION, TARGET_PROVIDER, TARGET_MODEL].join("|"));
}

async function pgRest(path, { method = "GET", body = null, prefer = null } = {}) {
  const url = `${SUPABASE_URL}/rest/v1/${path}`;
  const headers = { ...AUTH_HEADERS };
  if (prefer) headers["Prefer"] = prefer;
  const res = await fetch(url, {
    method,
    headers,
    body: body !== null ? JSON.stringify(body) : null,
    signal: AbortSignal.timeout(60000),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`PostgREST ${method} ${path} → ${res.status}: ${text.slice(0,400)}`);
  if (!text || text === "null") return [];
  const json = JSON.parse(text);
  return Array.isArray(json) ? json : [json];
}

async function fetchCompletedWindowsFromSpans() {
  // Get distinct scene_window_id + folder + xml_sha from 1b spans (paginated)
  const windows = new Map(); // scene_window_id → { folder, doc_sha }
  let offset = 0;
  const pageSize = 1000;
  while (true) {
    const rows = await pgRest(
      `semantic_meaning_spans` +
      `?semantic_run_id=eq.${SOURCE_RUN_ID}` +
      `&select=source_span` +
      `&limit=${pageSize}&offset=${offset}`
    );
    for (const row of rows) {
      const ss = row.source_span || {};
      const wid = ss.scene_window_id;
      const folder = ss.source_doc_folder;
      const sha = ss.source_document_xml_sha256 || "";
      if (wid && folder && !windows.has(wid)) {
        windows.set(wid, { folder, doc_sha: sha });
      }
    }
    if (rows.length < pageSize) break;
    offset += pageSize;
  }
  return windows;
}

// Reconstruct scene_window_ids from source XML (same algorithm as main script)
function resolveDocumentPath(folder) {
  const candidates = [
    join(ROOT, "reports/xml_recovery/materialized_ooxml", folder, "word/document.xml"),
    join(ROOT, "reports/xml_recovery/materialized_ooxml", folder, "document.xml"),
    join(ROOT, "src/data-layer/ingestion-buffer/gdrive_ooxml_raw", folder, "word/document.xml"),
  ];
  for (const c of candidates) if (existsSync(c)) return c;
  return null;
}

function loadSelectedFolders() {
  const truthPath = join(ROOT, "reports/xml_recovery/xml_starred_hash_truth.txt");
  if (!existsSync(truthPath)) throw new Error(`Missing: ${truthPath}`);
  return readFileSync(truthPath, "utf8")
    .split("\n")
    .map(l => l.trim())
    .filter(l => l.startsWith("- 0"))   // only folder entries under "Included XML doc folders:"
    .map(l => l.replace(/^-\s+/, ""));  // strip leading "- "
}

function extractParagraphTexts(xmlText) {
  // Minimal paragraph extraction matching main script
  const paragraphs = [];
  const wNs = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
  // Simple regex-based extraction (mirrors main script logic)
  const pRegex = /<w:p[\s>][^]*?<\/w:p>/g;
  const tRegex = /<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>/g;
  let pMatch;
  let idx = 0;
  while ((pMatch = pRegex.exec(xmlText)) !== null) {
    const pXml = pMatch[0];
    let text = "";
    let tMatch;
    const tRe = /<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>/g;
    while ((tMatch = tRe.exec(pXml)) !== null) {
      text += tMatch[1];
    }
    text = text.trim();
    if (text) paragraphs.push({ text, render_index: idx++ });
    idx++;
  }
  return paragraphs;
}

function buildSceneWindowId(folder, renderIndex, text) {
  return "scene_" + sha256Text([folder, renderIndex, text].join("\t")).slice(0, 32);
}

function buildAllSceneWindows(folders) {
  const allWindows = []; // { scene_window_id, folder, doc_sha }
  for (const folder of folders) {
    const docPath = resolveDocumentPath(folder);
    if (!docPath) {
      console.warn(`  [skip] no document.xml for: ${folder}`);
      continue;
    }
    const xmlText = readFileSync(docPath, "utf8");
    const docSha = sha256Text(xmlText);
    const paragraphs = extractParagraphTexts(xmlText);

    // batch_size=1: each paragraph is its own window
    for (let i = 0; i < paragraphs.length; i += BATCH_SIZE) {
      const chunk = paragraphs.slice(i, i + BATCH_SIZE);
      const text = chunk.map(p => p.text).join("\n\n");
      if (!text.trim()) continue;
      const sceneWindowId = buildSceneWindowId(folder, i, text);
      allWindows.push({ scene_window_id: sceneWindowId, folder, doc_sha: docSha });
    }
  }
  return allWindows;
}

async function insertCheckpointBatch(rows) {
  if (!rows.length) return;
  // Chunk into 500-row batches
  for (let i = 0; i < rows.length; i += 500) {
    const chunk = rows.slice(i, i + 500);
    await pgRest(
      `semantic_window_task_checkpoints?on_conflict=checkpoint_key`,
      {
        method: "POST",
        body: chunk,
        prefer: "resolution=merge-duplicates,return=minimal",
      }
    );
    process.stdout.write(`  inserted ${Math.min(i + 500, rows.length)}/${rows.length} rows\r`);
  }
  console.log();
}

async function main() {
  console.log("=== Checkpoint backfill: 1b → 3b ===");
  console.log(`Source run: ${SOURCE_RUN_ID} (llama3.2:1b, completed all 770 windows)`);
  console.log(`Target: provider=${TARGET_PROVIDER} model=${TARGET_MODEL} prompt_version=${PROMPT_VERSION}`);
  console.log();

  // 1. Get windows that actually produced spans in the 1b run
  console.log("Fetching completed windows from semantic_meaning_spans...");
  const spanWindows = await fetchCompletedWindowsFromSpans();
  console.log(`  Found ${spanWindows.size} distinct windows with content in 1b run`);

  // 2. Reconstruct ALL scene_window_ids from source XML
  console.log("Loading selected XML folders...");
  const folders = loadSelectedFolders();
  console.log(`  ${folders.length} selected folders`);

  console.log("Building scene windows from source XML (batch_size=1)...");
  const allWindows = buildAllSceneWindows(folders);
  console.log(`  ${allWindows.length} total scene windows`);

  // 3. Build checkpoint rows for every window × every task
  const completedRows = [];
  const emptyRows = [];

  for (const w of allWindows) {
    const hasSpans = spanWindows.has(w.scene_window_id);
    const status = hasSpans ? "completed" : "empty";
    const rows = hasSpans ? completedRows : emptyRows;

    for (const task of TASK_ORDER) {
      rows.push({
        checkpoint_key: makeCheckpointKey(w.folder, w.scene_window_id, task),
        source_doc_folder: w.folder,
        source_document_xml_sha256: w.doc_sha,
        scene_window_id: w.scene_window_id,
        task_name: task,
        provider: TARGET_PROVIDER,
        model: TARGET_MODEL,
        prompt_version: PROMPT_VERSION,
        prompt_sha256: "",
        status,
        semantic_run_id: null,
        attempt_count: 0,
        result_count: hasSpans ? 1 : 0,
        last_error_type: null,
        last_error_message: null,
        metadata: { backfilled_from_run: SOURCE_RUN_ID, backfilled_at: new Date().toISOString() },
      });
    }
  }

  console.log(`\nCheckpoint rows to insert:`);
  console.log(`  completed: ${completedRows.length} (${completedRows.length / TASK_ORDER.length} windows)`);
  console.log(`  empty:     ${emptyRows.length} (${emptyRows.length / TASK_ORDER.length} windows)`);
  console.log(`  total:     ${completedRows.length + emptyRows.length}`);
  console.log();

  console.log("Inserting completed rows...");
  await insertCheckpointBatch(completedRows);

  console.log("Inserting empty rows...");
  await insertCheckpointBatch(emptyRows);

  console.log("\nDone. Run the 3b workflow with --resume to skip all backfilled windows.");
  console.log(`\nVerify: SELECT count(*) FROM semantic_window_task_checkpoints WHERE model='${TARGET_MODEL}';`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
