#!/usr/bin/env node
/**
 * Backfill semantic_window_task_checkpoints for llama3.2:3b using the completed
 * llama3.2:1b run (a7d64f11) which processed all 770 windows.
 *
 * Strategy: query the 719 real scene_window_ids directly from semantic_meaning_spans
 * (where source_span->>'scene_window_id' is stored). No XML reconstruction needed.
 * Windows that produced spans → "completed". The ~51 empty windows (no spans in 1b)
 * are not checkpointed here and will be re-processed by the 3b run (acceptable).
 *
 * Usage:
 *   SUPABASE_URL=https://... SUPABASE_SERVICE_ROLE_KEY=... node scripts/semantic/backfill-checkpoints-from-1b-run.mjs
 */

import { createHash } from "node:crypto";

const PROMPT_VERSION  = "xml-selected-meaning-span-v5";
const TARGET_PROVIDER = "ollama";
const TARGET_MODEL    = "llama3.2:3b";
const SOURCE_RUN_ID   = "a7d64f11-012b-426e-9d65-f2f813a85070"; // complete 1b run
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

async function fetchCompletedWindowsFromSpans() {
  // Query distinct (scene_window_id, folder, doc_sha) from spans produced by 1b run.
  // source_span JSON contains the real scene_window_id written by the main script.
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
  console.log("=== Checkpoint backfill: 1b → 3b ===");
  console.log(`Source run: ${SOURCE_RUN_ID} (llama3.2:1b)`);
  console.log(`Target: provider=${TARGET_PROVIDER} model=${TARGET_MODEL} prompt_version=${PROMPT_VERSION}`);
  console.log();

  // Fetch the 719 real scene_window_ids directly from semantic_meaning_spans.
  // These IDs are exactly what the main script wrote — no reconstruction needed.
  console.log("Fetching completed windows from semantic_meaning_spans...");
  const spanWindows = await fetchCompletedWindowsFromSpans();
  console.log(`  Found ${spanWindows.size} distinct windows with spans`);

  if (spanWindows.size === 0) {
    console.error("ERROR: No windows found. Check SOURCE_RUN_ID and source_span column.");
    process.exit(1);
  }

  // Build checkpoint rows: one per (window × task), all status="completed"
  const backfilledAt = new Date().toISOString();
  const rows = [];
  for (const [sceneWindowId, { folder, doc_sha }] of spanWindows) {
    for (const task of TASK_ORDER) {
      rows.push({
        checkpoint_key: makeCheckpointKey(folder, sceneWindowId, task),
        source_doc_folder: folder,
        source_document_xml_sha256: doc_sha,
        scene_window_id: sceneWindowId,
        task_name: task,
        provider: TARGET_PROVIDER,
        model: TARGET_MODEL,
        prompt_version: PROMPT_VERSION,
        prompt_sha256: "",
        status: "completed",
        semantic_run_id: null,
        attempt_count: 0,
        result_count: 1,
        last_error_type: null,
        last_error_message: null,
        metadata: { backfilled_from_run: SOURCE_RUN_ID, backfilled_at: backfilledAt },
      });
    }
  }

  console.log(`\nCheckpoint rows to insert: ${rows.length} (${spanWindows.size} windows × ${TASK_ORDER.length} tasks)`);
  console.log(`Note: ~51 empty windows (no spans in 1b) are NOT backfilled and will be re-processed.\n`);

  await insertCheckpointBatch(rows);

  console.log(`\nDone. ${spanWindows.size} windows checkpointed as completed.`);
  console.log(`Run the 3b workflow with --resume to skip these windows.`);
  console.log(`\nVerify: SELECT count(*) FROM semantic_window_task_checkpoints WHERE model='${TARGET_MODEL}' AND status='completed';`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
