#!/usr/bin/env node

/**
 * Paired Drive XML Re-extraction
 *
 * Local-file-first extraction:
 *   gdrive_raw/<file>.txt
 *   -> targets/<index>__<local_slug>/
 *      -> local_source.txt
 *      -> pairing-manifest.json
 *      -> drive-file-metadata.json
 *      -> current/current.docx
 *      -> ooxml_current/word/document.xml
 *      -> docs_api/*.json
 *
 * Old archive is not renamed by this script.
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import process from "node:process";
import { google } from "googleapis";
import JSZip from "jszip";

const RAW_DIR = "src/data-layer/ingestion-buffer/gdrive_raw";
const DEFAULT_DEST_ROOT = latestDir("data/source_archive/paired_gdrive_xml_reextract");
const DEST_ROOT = argValue("--dest") || DEFAULT_DEST_ROOT;
const LIMIT = Number(argValue("--limit") || "0");
const DRY_RUN = hasArg("--dry-run");
const MIN_SCORE = Number(argValue("--min-score") || "72");

const DOCX_MIME =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const DRIVE_DOC_QUERY =
  "trashed = false and (mimeType = 'application/vnd.google-apps.document' or mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' or mimeType = 'application/msword')";

function hasArg(name) {
  return process.argv.includes(name);
}

function argValue(name) {
  const i = process.argv.indexOf(name);
  if (i === -1) return "";
  return process.argv[i + 1] || "";
}

function mkdirp(p) {
  fs.mkdirSync(p, { recursive: true });
}

function writeJson(file, data) {
  mkdirp(path.dirname(file));
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function latestDir(parent) {
  if (!fs.existsSync(parent)) return "";
  const dirs = fs
    .readdirSync(parent)
    .map(n => path.join(parent, n))
    .filter(p => {
      try {
        return fs.statSync(p).isDirectory();
      } catch {
        return false;
      }
    })
    .sort((a, b) => b.localeCompare(a));
  return dirs[0] || "";
}

function walk(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

function sha256(buf) {
  return crypto.createHash("sha256").update(buf).digest("hex");
}

function stripExt(name) {
  return String(name || "").replace(/\.[^.]+$/i, "");
}

function normalizeName(name) {
  return stripExt(path.basename(String(name || "")))
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/^\uFEFF/, "")
    .replace(/^[•\s]+/, "")
    .replace(/^\(([a-z]|final|notes|prompt guide|revision prompt|old|r|g|p|d|e|f|x)\)\s*/i, "")
    .replace(/^copy\s+of\s+/i, "")
    .replace(/\bcopy\s*\d*\b/gi, "")
    .replace(/\bchapter\s*:\s*/gi, "chapter ")
    .replace(/\bchapter_?/gi, "chapter ")
    .replace(/\bch\s*(\d+)/gi, "chapter $1")
    .replace(/[_\-\s.()[\]{}:;'"“”‘’!?／\\/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function slug(name) {
  return stripExt(path.basename(name))
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/^\uFEFF/, "")
    .replace(/[^A-Za-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 120) || "untitled";
}

function scoreName(localName, driveName) {
  const a = normalizeName(localName);
  const b = normalizeName(driveName);
  if (!a || !b) return 0;
  if (a === b) return 100;
  if (b.includes(a)) return Math.min(96, 78 + Math.floor(a.length / 6));
  if (a.includes(b)) return Math.min(92, 74 + Math.floor(b.length / 6));

  const ta = new Set(a.split(" ").filter(Boolean));
  const tb = new Set(b.split(" ").filter(Boolean));
  let overlap = 0;
  for (const t of ta) if (tb.has(t)) overlap++;
  const union = new Set([...ta, ...tb]).size || 1;
  const minSide = Math.min(ta.size || 1, tb.size || 1);
  const jaccard = overlap / union;
  const containment = overlap / minSide;
  return Math.round(Math.max(jaccard * 70, containment * 82));
}

function collectLocalTargets() {
  const files = walk(RAW_DIR)
    .filter(f => fs.statSync(f).isFile())
    .sort((a, b) => path.basename(a).localeCompare(path.basename(b)));

  return files.map((file, i) => {
    const buf = fs.readFileSync(file);
    return {
      index: i + 1,
      local_path: file,
      local_name: path.basename(file),
      local_title_query: stripExt(path.basename(file)),
      local_sha256: sha256(buf),
      local_bytes: buf.length,
      local_slug: `${String(i + 1).padStart(4, "0")}__${slug(path.basename(file))}`,
      normalized_name: normalizeName(path.basename(file)),
    };
  });
}

async function makeAuth() {
  if (process.env.GOOGLE_OAUTH_ACCESS_TOKEN && !hasArg("--ignore-access-token")) {
    console.error("auth_mode=GOOGLE_OAUTH_ACCESS_TOKEN");
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: process.env.GOOGLE_OAUTH_ACCESS_TOKEN });
    return auth;
  }

  const credentialsFile =
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    "secrets/wos-drive-docs-reader.json";

  if (fs.existsSync(credentialsFile)) {
    console.error("auth_mode=GOOGLE_APPLICATION_CREDENTIALS");
    return new google.auth.GoogleAuth({
      keyFile: credentialsFile,
      scopes: [
        "https://www.googleapis.com/auth/drive.readonly",
        "https://www.googleapis.com/auth/documents.readonly",
      ],
    });
  }

  return new google.auth.GoogleAuth({
    scopes: [
      "https://www.googleapis.com/auth/drive.readonly",
      "https://www.googleapis.com/auth/documents.readonly",
    ],
  });
}

async function listDriveDocs(drive) {
  const all = [];
  let pageToken = undefined;

  do {
    const res = await drive.files.list({
      q: DRIVE_DOC_QUERY,
      fields:
        "nextPageToken, files(id,name,mimeType,modifiedTime,createdTime,owners(displayName,emailAddress),webViewLink,size)",
      pageSize: 1000,
      pageToken,
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    });

    all.push(...(res.data.files || []));
    pageToken = res.data.nextPageToken || undefined;
  } while (pageToken);

  return all.sort((a, b) => String(a.name).localeCompare(String(b.name)));
}

function chooseBestDriveDoc(target, driveDocs) {
  const candidates = driveDocs
    .map(doc => ({
      ...doc,
      score: scoreName(target.local_name, doc.name),
    }))
    .filter(doc => doc.score >= MIN_SCORE)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return String(b.modifiedTime || "").localeCompare(String(a.modifiedTime || ""));
    })
    .slice(0, 10);

  return {
    best: candidates[0] || null,
    candidates,
  };
}

async function exportCurrentDocx(drive, doc, outFile) {
  mkdirp(path.dirname(outFile));

  if (doc.mimeType === "application/vnd.google-apps.document") {
    const res = await drive.files.export(
      { fileId: doc.id, mimeType: DOCX_MIME },
      { responseType: "arraybuffer" }
    );
    const buf = Buffer.from(res.data);
    fs.writeFileSync(outFile, buf);
    return buf;
  }

  const res = await drive.files.get(
    { fileId: doc.id, alt: "media", supportsAllDrives: true },
    { responseType: "arraybuffer" }
  );
  const buf = Buffer.from(res.data);
  fs.writeFileSync(outFile, buf);
  return buf;
}

async function extractDocxZip(buf, outDir) {
  mkdirp(outDir);
  const zip = await JSZip.loadAsync(buf);
  const entries = [];

  for (const [name, entry] of Object.entries(zip.files)) {
    if (entry.dir) continue;
    const data = await entry.async("nodebuffer");
    const out = path.join(outDir, name);
    mkdirp(path.dirname(out));
    fs.writeFileSync(out, data);
    entries.push({
      path: name,
      bytes: data.length,
      sha256: sha256(data),
    });
  }

  entries.sort((a, b) => a.path.localeCompare(b.path));
  writeJson(path.join(outDir, "zip-manifest.json"), entries);
  return entries;
}

async function saveDocsApi(docs, fileId, outDir) {
  mkdirp(outDir);
  const modes = [
    "PREVIEW_WITHOUT_SUGGESTIONS",
    "SUGGESTIONS_INLINE",
  ];

  const results = [];

  for (const mode of modes) {
    try {
      const res = await docs.documents.get({
        documentId: fileId,
        suggestionsViewMode: mode,
      });
      const file = path.join(outDir, `docs-api-${mode}.json`);
      writeJson(file, res.data);
      results.push({ mode, ok: true, file });
    } catch (e) {
      results.push({ mode, ok: false, error: e.message });
    }
  }

  writeJson(path.join(outDir, "docs-api-results.json"), results);
  return results;
}

async function processOne({ target, drive, docs, driveDocs }) {
  const targetDir = path.join(DEST_ROOT, "targets", target.local_slug);
  mkdirp(targetDir);

  fs.copyFileSync(target.local_path, path.join(targetDir, "local_source.txt"));

  const { best, candidates } = chooseBestDriveDoc(target, driveDocs);

  const manifest = {
    status: "initialized",
    index: target.index,
    local_path: target.local_path,
    local_name: target.local_name,
    local_title_query: target.local_title_query,
    local_sha256: target.local_sha256,
    local_bytes: target.local_bytes,
    normalized_name: target.normalized_name,
    target_dir: targetDir,
    min_score: MIN_SCORE,
    selected_drive_id: best?.id || null,
    selected_drive_name: best?.name || null,
    selected_drive_mimeType: best?.mimeType || null,
    selected_drive_modifiedTime: best?.modifiedTime || null,
    selected_score: best?.score || 0,
    candidates: candidates.map(c => ({
      id: c.id,
      name: c.name,
      mimeType: c.mimeType,
      modifiedTime: c.modifiedTime,
      score: c.score,
      webViewLink: c.webViewLink || null,
    })),
    current_docx_path: null,
    document_xml_path: null,
    docs_api_dir: null,
    error: null,
  };

  writeJson(path.join(targetDir, "pairing-manifest.json"), manifest);

  if (!best) {
    manifest.status = "no_drive_match";
    writeJson(path.join(targetDir, "pairing-manifest.json"), manifest);
    return manifest;
  }

  writeJson(path.join(targetDir, "drive-file-metadata.json"), best);

  if (DRY_RUN) {
    manifest.status = "dry_run_matched";
    writeJson(path.join(targetDir, "pairing-manifest.json"), manifest);
    return manifest;
  }

  try {
    const currentDocxPath = path.join(targetDir, "current", "current.docx");
    const buf = await exportCurrentDocx(drive, best, currentDocxPath);
    const extractDir = path.join(targetDir, "ooxml_current");
    await extractDocxZip(buf, extractDir);

    const documentXml = path.join(extractDir, "word", "document.xml");
    const hasDocumentXml = fs.existsSync(documentXml);

    const docsApiDir = path.join(targetDir, "docs_api");
    await saveDocsApi(docs, best.id, docsApiDir);

    manifest.status = hasDocumentXml ? "paired_xml_ok" : "exported_docx_missing_document_xml";
    manifest.current_docx_path = currentDocxPath;
    manifest.document_xml_path = hasDocumentXml ? documentXml : null;
    manifest.docs_api_dir = docsApiDir;
    writeJson(path.join(targetDir, "pairing-manifest.json"), manifest);
    return manifest;
  } catch (e) {
    manifest.status = "export_failed";
    manifest.error = e && e.stack ? e.stack : String(e);
    writeJson(path.join(targetDir, "pairing-manifest.json"), manifest);
    return manifest;
  }
}

async function main() {
  if (!DEST_ROOT) {
    console.error("fatal=no_paired_destination_found");
    console.error("Create data/source_archive/paired_gdrive_xml_reextract/<timestamp> first.");
    process.exit(1);
  }

  mkdirp(path.join(DEST_ROOT, "targets"));

  const targetsAll = collectLocalTargets();
  const targets = LIMIT > 0 ? targetsAll.slice(0, LIMIT) : targetsAll;

  const auth = await makeAuth();
  const drive = google.drive({ version: "v3", auth });
  const docs = google.docs({ version: "v1", auth });

  const driveDocs = await listDriveDocs(drive);

  const run = {
    started_at: new Date().toISOString(),
    raw_dir: RAW_DIR,
    dest_root: DEST_ROOT,
    dry_run: DRY_RUN,
    min_score: MIN_SCORE,
    total_local_targets_available: targetsAll.length,
    total_local_targets_attempted: targets.length,
    total_drive_docs_seen: driveDocs.length,
    results: [],
  };

  writeJson(path.join(DEST_ROOT, "paired-reextract-run.started.json"), run);

  for (const target of targets) {
    const result = await processOne({ target, drive, docs, driveDocs });
    run.results.push({
      index: result.index,
      local_name: result.local_name,
      status: result.status,
      selected_score: result.selected_score,
      selected_drive_name: result.selected_drive_name,
      selected_drive_id: result.selected_drive_id,
      document_xml_path: result.document_xml_path,
    });

    if (result.index % 10 === 0 || result.index === targets.length) {
      const ok = run.results.filter(r => r.status === "paired_xml_ok").length;
      const matched = run.results.filter(r => r.selected_drive_id).length;
      console.error(`progress=${result.index}/${targets.length} matched=${matched} paired_xml_ok=${ok}`);
    }
  }

  run.finished_at = new Date().toISOString();

  const counts = {};
  for (const r of run.results) counts[r.status] = (counts[r.status] || 0) + 1;
  run.counts = counts;

  writeJson(path.join(DEST_ROOT, "paired-reextract-run.finished.json"), run);

  const tsv =
    "index\tstatus\tselected_score\tlocal_name\tselected_drive_name\tselected_drive_id\tdocument_xml_path\n" +
    run.results.map(r => [
      r.index,
      r.status,
      r.selected_score,
      r.local_name,
      r.selected_drive_name || "",
      r.selected_drive_id || "",
      r.document_xml_path || "",
    ].join("\t")).join("\n") +
    "\n";

  fs.writeFileSync(path.join(DEST_ROOT, "paired-reextract-summary.tsv"), tsv);

  console.log("dest_root=" + DEST_ROOT);
  console.log("dry_run=" + DRY_RUN);
  console.log("local_targets_attempted=" + targets.length);
  console.log("drive_docs_seen=" + driveDocs.length);
  console.log("paired_xml_ok=" + (counts.paired_xml_ok || 0));
  console.log("no_drive_match=" + (counts.no_drive_match || 0));
  console.log("export_failed=" + (counts.export_failed || 0));
  console.log("summary_tsv=" + path.join(DEST_ROOT, "paired-reextract-summary.tsv"));
}

main().catch(e => {
  console.error("fatal=" + (e && e.stack ? e.stack : String(e)));
  process.exit(1);
});
