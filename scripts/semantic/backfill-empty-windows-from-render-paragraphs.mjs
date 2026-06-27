#!/usr/bin/env node
/**
 * Backfill "empty" checkpoints for windows not covered by the 1b completed-spans backfill.
 *
 * The render_paragraphs table has all 770 render paragraphs (one per window at batch_size=1).
 * We can compute their exact scene_window_ids and checkpoint any that aren't already in
 * semantic_window_task_checkpoints for llama3.2:3b.
 *
 * scene_window_id = "scene_" + sha256(folder + "\t" + (render_index - 1) + "\t" + text).slice(0,32)
 *
 * Usage:
 *   SUPABASE_URL=https://... SUPABASE_SERVICE_ROLE_KEY=... node scripts/semantic/backfill-empty-windows-from-render-paragraphs.mjs
 */

import { createHash } from "node:crypto";

const PROMPT_VERSION  = "xml-selected-meaning-span-v5";
const TARGET_PROVIDER = "ollama";
const TARGET_MODEL    = "llama3.2:3b";
const SOURCE_RUN_ID   = "a7d64f11-012b-426e-9d65-f2f813a85070";
const TASK_ORDER      = ["meaning_spans","dualisms","archetypes","biblical_references","hyperlinks_parallelisms"];

const SUPABASE_URL = process.env.SUPABASE_URL || (process.env.SUPABASE_PROJECT_REF ? `https://${process.env.SUPABASE_PROJECT_REF}.supabase.co` : "");
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

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

async function fetchAllRenderParagraphs() {
  const rows = [];
  let offset = 0;
  const pageSize = 1000;
  while (true) {
    const page = await pgRest(
      `render_paragraphs` +
      `?select=source_doc_folder,source_document_xml_sha256,render_index,text` +
      `&limit=${pageSize}&offset=${offset}`
    );
    rows.push(...page);
    if (page.length < pageSize) break;
    offset += pageSize;
  }
  return rows;
}

async function fetchExistingCheckpointKeys() {
  const keys = new Set();
  let offset = 0;
  const pageSize = 1000;
  while (true) {
    const page = await pgRest(
      `semantic_window_task_checkpoints` +
      `?prompt_version=eq.${PROMPT_VERSION}` +
      `&provider=eq.${TARGET_PROVIDER}` +
      `&model=eq.${TARGET_MODEL}` +
      `&status=in.(completed,empty)` +
      `&select=checkpoint_key` +
      `&limit=${pageSize}&offset=${offset}`
    );
    for (const r of page) keys.add(r.checkpoint_key);
    if (page.length < pageSize) break;
    offset += pageSize;
  }
  return keys;
}

async function insertCheckpointBatch(rows) {
  if (!rows.length) return;
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
  console.log("=== Backfill empty windows from render_paragraphs ===");
  console.log(`Target: provider=${TARGET_PROVIDER} model=${TARGET_MODEL} prompt_version=${PROMPT_VERSION}`);
  console.log();

  console.log("Fetching all render paragraphs (770 expected)...");
  const renderParagraphs = await fetchAllRenderParagraphs();
  console.log(`  Found ${renderParagraphs.length} render paragraphs`);

  console.log("Fetching existing completed/empty checkpoints for 3b...");
  const existingKeys = await fetchExistingCheckpointKeys();
  console.log(`  Found ${existingKeys.size} existing checkpoint keys`);

  const backfilledAt = new Date().toISOString();
  const rows = [];
  let alreadyDone = 0;

  for (const rp of renderParagraphs) {
    const folder = rp.source_doc_folder;
    const docSha = rp.source_document_xml_sha256 || "";
    const arrayIndex = rp.render_index - 1; // convert 1-based render_index to 0-based loop index
    const text = rp.text || "";

    // This is the exact formula from buildSceneWindows in the main script
    const sceneWindowId = "scene_" + sha256Text([folder, arrayIndex, text].join("\t")).slice(0, 32);

    for (const task of TASK_ORDER) {
      const ck = makeCheckpointKey(folder, sceneWindowId, task);
      if (existingKeys.has(ck)) {
        alreadyDone++;
        continue;
      }
      rows.push({
        checkpoint_key: ck,
        source_doc_folder: folder,
        source_document_xml_sha256: docSha,
        scene_window_id: sceneWindowId,
        task_name: task,
        provider: TARGET_PROVIDER,
        model: TARGET_MODEL,
        prompt_version: PROMPT_VERSION,
        prompt_sha256: "",
        status: "empty",
        semantic_run_id: null,
        attempt_count: 0,
        result_count: 0,
        last_error_type: null,
        last_error_message: null,
        metadata: { backfilled_from_render_paragraphs: true, source_run_id: SOURCE_RUN_ID, backfilled_at: backfilledAt },
      });
    }
  }

  console.log(`\nAlready checkpointed: ${alreadyDone / TASK_ORDER.length} windows (${alreadyDone} keys)`);
  console.log(`Missing checkpoints:  ${rows.length / TASK_ORDER.length} windows (${rows.length} keys)`);
  console.log();

  if (!rows.length) {
    console.log("Nothing to insert — all windows already checkpointed.");
    return;
  }

  console.log("Inserting empty checkpoints...");
  await insertCheckpointBatch(rows);

  const totalWindows = renderParagraphs.length;
  console.log(`\nDone. All ${totalWindows} windows are now checkpointed for llama3.2:3b.`);
  console.log(`Run the 3b workflow with --resume — it will skip all ${totalWindows} windows instantly.`);
  console.log(`\nVerify: SELECT status, count(*) FROM semantic_window_task_checkpoints WHERE model='${TARGET_MODEL}' GROUP BY status;`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
