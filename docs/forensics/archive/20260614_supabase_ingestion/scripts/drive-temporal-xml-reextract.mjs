#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const GDOC_MIME = "application/vnd.google-apps.document";
const DEFAULT_LOCAL_RAW = "src/data-layer/ingestion-buffer/gdrive_raw";

function argValue(name, fallback = "") {
  const i = process.argv.indexOf(name);
  if (i === -1 || i + 1 >= process.argv.length) return fallback;
  return process.argv[i + 1];
}

function hasArg(name) {
  return process.argv.includes(name);
}

const REMOTE = argValue("--remote", "gdrive");
const LIMIT = Number(argValue("--limit", "0") || "0");
const SLEEP_MS = Number(argValue("--sleep-ms", "250") || "250");
const QUERY_MODE = argValue("--query-mode", "local-imports"); // local-imports | chapters | all
const DEST =
  argValue("--dest") ||
  path.join(
    "data/source_archive/drive_temporal_xml_reextract",
    new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14)
  );
const LOCAL_RAW = argValue("--local-raw", DEFAULT_LOCAL_RAW);
const MIN_TARGET_SCORE = Number(argValue("--min-target-score", "35") || "35");
const START_INDEX = Number(argValue("--start-index", "0") || "0");
const RESUME_EXISTING = hasArg("--resume-existing");
const SKIP_DOCS_API = hasArg("--skip-docs-api");
const SKIP_COMMENTS = hasArg("--skip-comments");

const DRIVE_V3 = "https://www.googleapis.com/drive/v3";
const DRIVE_V2 = "https://www.googleapis.com/drive/v2";
const DOCS_V1 = "https://docs.googleapis.com/v1";

function mkdirp(p) {
  fs.mkdirSync(p, { recursive: true });
}

function safeWriteJson(file, value) {
  mkdirp(path.dirname(file));
  fs.writeFileSync(file, JSON.stringify(value, null, 2));
}

function safeWriteText(file, value) {
  mkdirp(path.dirname(file));
  fs.writeFileSync(file, value);
}

function slugify(s) {
  return String(s || "untitled")
    .normalize("NFKD")
    .replace(/[^\w\s.-]+/g, "")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[._-]{2,}/g, "_")
    .slice(0, 110) || "untitled";
}

function normalizeName(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\b(final|revision|prompt|chapter|chapters|part|txt|docx|doc|google|copy)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenSet(s) {
  return new Set(normalizeName(s).split(/\s+/).filter(Boolean));
}

function scoreNames(a, b) {
  const A = tokenSet(a);
  const B = tokenSet(b);
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  return Math.round((200 * inter) / (A.size + B.size));
}

function listLocalFiles(root) {
  const out = [];
  if (!fs.existsSync(root)) return out;
  const walk = (dir) => {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, ent.name);
      if (ent.isDirectory()) walk(p);
      else out.push(p);
    }
  };
  walk(root);
  return out.sort();
}

function getRcloneAccessToken(remote) {
  try {
    execFileSync("rclone", ["about", `${remote}:`], { stdio: "ignore" });
  } catch {}
  const raw = execFileSync("rclone", ["config", "dump"], { encoding: "utf8" });
  const cfg = JSON.parse(raw);
  const remoteCfg = cfg[remote] || {};
  const tokRaw = remoteCfg.token || "";
  const tok = typeof tokRaw === "string" ? JSON.parse(tokRaw || "{}") : tokRaw;
  const access = tok.access_token || "";
  if (!access) throw new Error(`No rclone access token found for remote "${remote}"`);
  return access;
}

async function fetchBytes(url, token, opts = {}) {
  const method = opts.method || "GET";
  const headers = {
    Authorization: `Bearer ${token}`,
    ...(opts.headers || {}),
  };

  for (let attempt = 0; attempt < 6; attempt++) {
    const res = await fetch(url, { method, headers });
    const buf = Buffer.from(await res.arrayBuffer());
    if ((res.status === 429 || res.status >= 500) && attempt < 5) {
      await sleep((attempt + 1) * 1500);
      continue;
    }
    return {
      ok: res.ok,
      status: res.status,
      statusText: res.statusText,
      contentType: res.headers.get("content-type") || "",
      buffer: buf,
      text: () => buf.toString("utf8"),
    };
  }
  throw new Error(`fetch failed after retries: ${url}`);
}

async function fetchJson(url, token) {
  const r = await fetchBytes(url, token);
  const text = r.text();
  try {
    const json = JSON.parse(text);
    if (!r.ok && !json.error) json.error = { message: `${r.status} ${r.statusText}` };
    return json;
  } catch {
    return {
      error: {
        message: `NON_JSON_RESPONSE ${r.status} ${r.statusText}`,
        contentType: r.contentType,
        sample: text.slice(0, 500),
      },
    };
  }
}

function urlWith(base, params) {
  const u = new URL(base);
  for (const [k, v] of Object.entries(params || {})) {
    if (v !== undefined && v !== null && v !== "") u.searchParams.set(k, String(v));
  }
  return u.toString();
}

async function listDriveDocs(token) {
  const files = [];
  let pageToken = "";
  const q =
    (QUERY_MODE === "all" || QUERY_MODE === "local-imports")
      ? `mimeType='${GDOC_MIME}' and trashed=false`
      : `mimeType='${GDOC_MIME}' and trashed=false and (` +
        `name contains 'Chapter' or name contains 'chapter' or ` +
        `name contains 'Part' or name contains 'part' or ` +
        `name contains 'Weight' or name contains 'Sky' or name contains 'WOS')`;

  do {
    const u = urlWith(`${DRIVE_V3}/files`, {
      q,
      pageSize: 100,
      pageToken,
      fields:
        "nextPageToken,files(id,name,mimeType,createdTime,modifiedTime,owners(displayName,emailAddress),parents,webViewLink)",
      orderBy: "modifiedTime desc",
      includeItemsFromAllDrives: "true",
      supportsAllDrives: "true",
    });
    const j = await fetchJson(u, token);
    if (j.error) throw new Error(`Drive files.list failed: ${j.error.message}`);
    files.push(...(j.files || []));
    pageToken = j.nextPageToken || "";
    if (QUERY_MODE !== "local-imports" && LIMIT && files.length >= LIMIT) break;
    await sleep(SLEEP_MS);
  } while (pageToken);

  return QUERY_MODE !== "local-imports" && LIMIT ? files.slice(0, LIMIT) : files;
}

async function exportCurrentDocx(doc, dir, token) {
  const out = path.join(dir, "current", "current.docx");
  mkdirp(path.dirname(out));
  const u = urlWith(`${DRIVE_V3}/files/${doc.id}/export`, { mimeType: DOCX_MIME });
  const r = await fetchBytes(u, token);
  fs.writeFileSync(out, r.buffer);

  const meta = {
    ok: r.ok,
    status: r.status,
    contentType: r.contentType,
    bytes: r.buffer.length,
    file: "current/current.docx",
  };
  safeWriteJson(path.join(dir, "current", "current-export-response.json"), meta);

  const xmlDir = path.join(dir, "current_ooxml");
  const ok = unzipIfDocx(out, xmlDir);
  return { ...meta, ooxml_ok: ok, document_xml: fs.existsSync(path.join(xmlDir, "word", "document.xml")) };
}

function isZipFile(file) {
  if (!fs.existsSync(file)) return false;
  const fd = fs.openSync(file, "r");
  const b = Buffer.alloc(4);
  fs.readSync(fd, b, 0, 4, 0);
  fs.closeSync(fd);
  return b[0] === 0x50 && b[1] === 0x4b;
}

function unzipIfDocx(file, dest) {
  mkdirp(dest);
  if (!isZipFile(file)) return false;
  try {
    execFileSync("unzip", ["-q", "-o", file, "-d", dest], { stdio: "ignore" });
    return fs.existsSync(path.join(dest, "word", "document.xml"));
  } catch {
    return false;
  }
}

async function saveDocsApi(doc, dir, token) {
  if (SKIP_DOCS_API) return { skipped: true };
  const outDir = path.join(dir, "docs_api");
  mkdirp(outDir);

  const modes = [
    "DEFAULT_FOR_CURRENT_ACCESS",
    "PREVIEW_WITHOUT_SUGGESTIONS",
    "SUGGESTIONS_INLINE",
  ];
  const result = {};
  for (const mode of modes) {
    const u = urlWith(`${DOCS_V1}/documents/${doc.id}`, { suggestionsViewMode: mode });
    const j = await fetchJson(u, token);
    safeWriteJson(path.join(outDir, `${mode}.json`), j);
    result[mode] = j.error ? `ERROR: ${j.error.message}` : "OK";
    await sleep(SLEEP_MS);
  }
  return result;
}

async function saveComments(doc, dir, token) {
  if (SKIP_COMMENTS) return { skipped: true };
  const all = [];
  let pageToken = "";
  do {
    const u = urlWith(`${DRIVE_V3}/files/${doc.id}/comments`, {
      pageSize: 100,
      pageToken,
      fields:
        "nextPageToken,comments(id,content,createdTime,modifiedTime,deleted,author(displayName,emailAddress),quotedFileContent,replies(id,content,createdTime,modifiedTime,deleted,author(displayName,emailAddress)))",
      includeDeleted: "true",
    });
    const j = await fetchJson(u, token);
    if (j.error) {
      safeWriteJson(path.join(dir, "comments", "comments-error.json"), j);
      return { error: j.error.message, comments: 0 };
    }
    all.push(...(j.comments || []));
    pageToken = j.nextPageToken || "";
    await sleep(SLEEP_MS);
  } while (pageToken);
  safeWriteJson(path.join(dir, "comments", "comments.json"), { comments: all });
  return { comments: all.length };
}

async function saveV2Revisions(doc, dir, token) {
  const outDir = path.join(dir, "v2_revisions");
  mkdirp(outDir);

  const items = [];
  let pageToken = "";
  do {
    const u = urlWith(`${DRIVE_V2}/files/${doc.id}/revisions`, {
      maxResults: 1000,
      pageToken,
      fields:
        "nextPageToken,items(id,modifiedDate,mimeType,exportLinks,published,pinned,fileSize,md5Checksum,downloadUrl)",
    });
    const j = await fetchJson(u, token);
    if (j.error) {
      safeWriteJson(path.join(outDir, "revisions-error.json"), j);
      return { revision_count: 0, export_links: 0, xml_yes: 0, xml_no: 0, error: j.error.message };
    }
    items.push(...(j.items || []));
    pageToken = j.nextPageToken || "";
    await sleep(SLEEP_MS);
  } while (pageToken);

  safeWriteJson(path.join(outDir, "revisions.json"), { items });

  let exportLinks = 0;
  let xmlYes = 0;
  let xmlNo = 0;
  let jsonResponses = 0;
  const rows = ["revision_id\tmodifiedDate\tbytes\tdocx_link\txml_ok\tcontent_type"];

  for (const rev of items) {
    const revDir = path.join(outDir, String(rev.id || "unknown"));
    mkdirp(revDir);
    safeWriteJson(path.join(revDir, "revision-metadata.json"), rev);

    const link = rev.exportLinks?.[DOCX_MIME] || "";
    if (!link) {
      rows.push(`${rev.id}\t${rev.modifiedDate || ""}\t0\tNO\tNO\t`);
      continue;
    }
    exportLinks++;

    const r = await fetchBytes(link, token);
    const docxFile = path.join(revDir, "export.docx");
    fs.writeFileSync(docxFile, r.buffer);

    const xmlDir = path.join(revDir, "ooxml");
    const ok = unzipIfDocx(docxFile, xmlDir);
    if (ok) xmlYes++;
    else {
      xmlNo++;
      const text = r.text();
      let parsed = null;
      try { parsed = JSON.parse(text); } catch {}
      if (parsed) {
        jsonResponses++;
        safeWriteJson(path.join(revDir, "export-response.json"), parsed);
      } else {
        safeWriteText(path.join(revDir, "export-response.txt"), text.slice(0, 20000));
      }
    }

    rows.push(`${rev.id}\t${rev.modifiedDate || ""}\t${r.buffer.length}\tYES\t${ok ? "YES" : "NO"}\t${r.contentType}`);
    await sleep(SLEEP_MS);
  }

  safeWriteText(path.join(outDir, "revision-export-results.tsv"), rows.join("\n") + "\n");
  return {
    revision_count: items.length,
    export_links: exportLinks,
    xml_yes: xmlYes,
    xml_no: xmlNo,
    json_responses: jsonResponses,
  };
}

function pairLocalTargets(doc, dir, localFiles) {
  const scored = localFiles
    .map((file) => ({
      local_path: file,
      basename: path.basename(file),
      score: scoreNames(doc.name, path.basename(file)),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.basename.localeCompare(b.basename))
    .slice(0, 12);

  const pairing = {
    note: "Drive-doc-first evidence only. Local files are not extraction source authority.",
    drive_id: doc.id,
    drive_name: doc.name,
    local_raw_root: LOCAL_RAW,
    matches: scored,
  };

  const pairDir = path.join(dir, "local_pairings");
  mkdirp(pairDir);
  safeWriteJson(path.join(pairDir, "matched-local-targets.json"), pairing);

  const srcDir = path.join(pairDir, "source_copies");
  mkdirp(srcDir);
  for (const m of scored.slice(0, 3)) {
    if (m.score < 55) continue;
    try {
      fs.copyFileSync(m.local_path, path.join(srcDir, `${m.score}__${slugify(m.basename)}`));
    } catch {}
  }

  return scored[0] || null;
}


function buildLocalImportPairs(localFiles, driveDocs) {
  const pairs = [];
  const noMatch = [];

  for (let i = 0; i < localFiles.length; i++) {
    const localPath = localFiles[i];
    const localBasename = path.basename(localPath);

    const ranked = driveDocs
      .map((doc) => ({ doc, score: scoreNames(localBasename, doc.name) }))
      .sort((a, b) => b.score - a.score || String(a.doc.name).localeCompare(String(b.doc.name)));

    const best = ranked[0] || null;

    if (!best || best.score < MIN_TARGET_SCORE) {
      noMatch.push({
        target_index: i + 1,
        local_path: localPath,
        local_basename: localBasename,
        best_score: best?.score ?? 0,
        best_drive_id: best?.doc?.id ?? "",
        best_drive_name: best?.doc?.name ?? "",
        alternates: ranked.slice(0, 8).map((x) => ({
          drive_id: x.doc.id,
          drive_name: x.doc.name,
          score: x.score,
        })),
      });
      continue;
    }

    pairs.push({
      target_index: i + 1,
      local_path: localPath,
      local_basename: localBasename,
      match_score: best.score,
      drive_doc: best.doc,
      alternates: ranked.slice(1, 8).map((x) => ({
        drive_id: x.doc.id,
        drive_name: x.doc.name,
        score: x.score,
      })),
    });
  }

  return { pairs, noMatch };
}

function driveDocRelDir(doc) {
  return path.join("drive_docs", `${doc.id}__${slugify(doc.name)}`);
}

function writeImportManifest(destRoot, pair, extractionSummary = null) {
  const importDir = path.join(
    destRoot,
    "imports",
    "local_targets",
    `${String(pair.target_index).padStart(3, "0")}__${slugify(pair.local_basename)}`
  );
  mkdirp(importDir);

  const relDocDir = driveDocRelDir(pair.drive_doc);
  const manifest = {
    import_manifest_version: 1,
    note: "Local gdrive_raw file is an import target/provenance anchor only. Extracted XML remains in drive_docs.",
    local_target: {
      index: pair.target_index,
      path: pair.local_path,
      basename: pair.local_basename,
    },
    drive_source: {
      id: pair.drive_doc.id,
      name: pair.drive_doc.name,
      mimeType: pair.drive_doc.mimeType,
      modifiedTime: pair.drive_doc.modifiedTime,
      match_score: pair.match_score,
      alternates: pair.alternates,
    },
    imports_from: {
      drive_doc_dir: relDocDir,
      drive_metadata: path.join(relDocDir, "drive-file-metadata.json"),
      current_docx: path.join(relDocDir, "current", "current.docx"),
      current_document_xml: path.join(relDocDir, "current_ooxml", "word", "document.xml"),
      docs_api_dir: path.join(relDocDir, "docs_api"),
      comments_file: path.join(relDocDir, "comments", "comments.json"),
      v2_revisions_dir: path.join(relDocDir, "v2_revisions"),
      v2_revision_results: path.join(relDocDir, "v2_revisions", "revision-export-results.tsv"),
    },
    extraction_summary: extractionSummary,
  };

  safeWriteJson(path.join(importDir, "import-manifest.json"), manifest);
  return importDir;
}


function extractionUnitRelDir(pair) {
  return path.join(
    "extraction_units",
    "local_targets",
    `${String(pair.target_index).padStart(3, "0")}__${slugify(pair.local_basename)}__DRIVE__${pair.drive_doc.id}__${slugify(pair.drive_doc.name)}`
  );
}

function write182ImportManifest(destRoot, pair, extractionSummary = null) {
  const importDir = path.join(
    destRoot,
    "imports",
    "local_targets",
    `${String(pair.target_index).padStart(3, "0")}__${slugify(pair.local_basename)}`
  );
  mkdirp(importDir);

  const relUnitDir = extractionUnitRelDir(pair);
  const manifest = {
    import_manifest_version: 2,
    note: "One local gdrive_raw file maps to one extraction unit. XML/data payload is not stored in the project source folder; it lives in extraction_units and points back to both local target and Drive source.",
    local_target: {
      index: pair.target_index,
      path: pair.local_path,
      basename: pair.local_basename,
    },
    drive_source: {
      id: pair.drive_doc.id,
      name: pair.drive_doc.name,
      mimeType: pair.drive_doc.mimeType,
      modifiedTime: pair.drive_doc.modifiedTime,
      match_score: pair.match_score,
      alternates: pair.alternates,
    },
    imports_from: {
      extraction_unit_dir: relUnitDir,
      drive_metadata: path.join(relUnitDir, "drive-file-metadata.json"),
      current_docx: path.join(relUnitDir, "current", "current.docx"),
      current_document_xml: path.join(relUnitDir, "current_ooxml", "word", "document.xml"),
      docs_api_dir: path.join(relUnitDir, "docs_api"),
      comments_file: path.join(relUnitDir, "comments", "comments.json"),
      v2_revisions_dir: path.join(relUnitDir, "v2_revisions"),
      v2_revision_results: path.join(relUnitDir, "v2_revisions", "revision-export-results.tsv"),
    },
    extraction_summary: extractionSummary,
  };

  safeWriteJson(path.join(importDir, "import-manifest.json"), manifest);
  return importDir;
}

async function main() {
  mkdirp(DEST);
  mkdirp(path.join(DEST, "drive_docs"));
  mkdirp(path.join(DEST, "imports", "local_targets"));

  const readme = [
    "Drive-doc-first temporal XML extraction with local import manifests.",
    "",
    "Extraction authority: Google Docs / Drive.",
    "Target set: local files under src/data-layer/ingestion-buffer/gdrive_raw.",
    "Storage rule: XML payloads live under drive_docs; local target imports live under imports/local_targets.",
    "No XML is dumped into local project/data folders.",
    "",
    "Current OOXML: Drive v3 files.export -> DOCX -> unzip.",
    "Historical OOXML: Drive v2 revision exportLinks -> DOCX -> unzip when Google returns valid DOCX.",
    "Failed revision exports are preserved as JSON/text evidence.",
    "",
    `remote=${REMOTE}`,
    `query_mode=${QUERY_MODE}`,
    `local_raw=${LOCAL_RAW}`,
    `min_target_score=${MIN_TARGET_SCORE}`,
    `created_at=${new Date().toISOString()}`,
  ].join("\n");
  safeWriteText(path.join(DEST, "README.md"), readme + "\n");

  const token = getRcloneAccessToken(REMOTE);
  const localFiles = listLocalFiles(LOCAL_RAW);
  const driveDocs = await listDriveDocs(token);

  safeWriteJson(path.join(DEST, "drive-docs-list.json"), {
    count: driveDocs.length,
    query_mode: QUERY_MODE,
    files: driveDocs,
  });

  const built = QUERY_MODE === "local-imports"
    ? buildLocalImportPairs(localFiles, driveDocs)
    : { pairs: driveDocs.map((doc, i) => ({
        target_index: i + 1,
        local_path: "",
        local_basename: "",
        match_score: "",
        drive_doc: doc,
        alternates: [],
      })), noMatch: [] };

  const targetPairs = LIMIT ? built.pairs.slice(0, LIMIT) : built.pairs;
  const noMatch = built.noMatch;

  safeWriteJson(path.join(DEST, "local-import-pairing-audit.json"), {
    query_mode: QUERY_MODE,
    local_targets_seen: localFiles.length,
    drive_docs_seen: driveDocs.length,
    min_target_score: MIN_TARGET_SCORE,
    targets_selected_for_this_run: targetPairs.length,
    paired_targets_total_before_limit: built.pairs.length,
    no_match_count: noMatch.length,
    no_match: noMatch,
    pairs: built.pairs.map((p) => ({
      target_index: p.target_index,
      local_path: p.local_path,
      local_basename: p.local_basename,
      match_score: p.match_score,
      drive_id: p.drive_doc.id,
      drive_name: p.drive_doc.name,
    })),
  });

  const summaryRows = [
    [
      "target_index",
      "local_basename",
      "local_path",
      "match_score",
      "drive_id",
      "drive_name",
      "current_docx_bytes",
      "current_document_xml",
      "v2_revision_count",
      "v2_export_links",
      "v2_revision_xml_yes",
      "v2_revision_xml_no",
      "docs_api_status",
      "comments_count",
      "extraction_unit_dir",
    ].join("\t"),
  ];

  let currentXmlCount = 0;
  let revXmlTotal = 0;
  let revCountTotal = 0;
  let importManifestCount = 0;
  const extractionByTarget = {};

  for (let i = 0; i < targetPairs.length; i++) {
    const pair = targetPairs[i];
    const doc = pair.drive_doc;

    const unitRel = extractionUnitRelDir(pair);
    const unitDir = path.join(DEST, unitRel);
    mkdirp(unitDir);

    safeWriteJson(path.join(unitDir, "pairing-manifest.json"), {
      note: "This is a per-local-file extraction unit. It is intentionally not collapsed/deduped by Drive doc.",
      target_index: pair.target_index,
      local_path: pair.local_path,
      local_basename: pair.local_basename,
      match_score: pair.match_score,
      drive_id: doc.id,
      drive_name: doc.name,
      alternates: pair.alternates,
    });

    try {
      fs.copyFileSync(pair.local_path, path.join(unitDir, "local_source.txt"));
    } catch (err) {
      safeWriteJson(path.join(unitDir, "local-source-copy-error.json"), {
        local_path: pair.local_path,
        error: err?.message || String(err),
      });
    }

    safeWriteJson(path.join(unitDir, "drive-file-metadata.json"), doc);

    const current = await exportCurrentDocx(doc, unitDir, token);
    if (current.document_xml) currentXmlCount++;

    const docsApi = await saveDocsApi(doc, unitDir, token);
    const comments = await saveComments(doc, unitDir, token);
    const revisions = await saveV2Revisions(doc, unitDir, token);

    revCountTotal += revisions.revision_count || 0;
    revXmlTotal += revisions.xml_yes || 0;

    const docsApiStatus = Object.values(docsApi).some((v) => String(v).startsWith("OK"))
      ? "OK_OR_PARTIAL"
      : docsApi.skipped
        ? "SKIPPED"
        : "ERROR_OR_UNAVAILABLE";

    const extractionSummary = {
      current_docx_bytes: current.bytes || 0,
      current_document_xml: current.document_xml ? "YES" : "NO",
      v2_revision_count: revisions.revision_count || 0,
      v2_export_links: revisions.export_links || 0,
      v2_revision_xml_yes: revisions.xml_yes || 0,
      v2_revision_xml_no: revisions.xml_no || 0,
      docs_api_status: docsApiStatus,
      comments_count: comments.comments ?? 0,
      extraction_unit_dir: unitRel,
    };

    write182ImportManifest(DEST, pair, extractionSummary);
    importManifestCount++;

    extractionByTarget[String(pair.target_index).padStart(3, "0")] = {
      local_path: pair.local_path,
      local_basename: pair.local_basename,
      match_score: pair.match_score,
      drive_id: doc.id,
      drive_name: doc.name,
      extraction_summary: extractionSummary,
    };

    summaryRows.push([
      pair.target_index,
      pair.local_basename.replace(/\t/g, " "),
      pair.local_path.replace(/\t/g, " "),
      pair.match_score,
      doc.id,
      doc.name.replace(/\t/g, " "),
      current.bytes || 0,
      current.document_xml ? "YES" : "NO",
      revisions.revision_count || 0,
      revisions.export_links || 0,
      revisions.xml_yes || 0,
      revisions.xml_no || 0,
      docsApiStatus,
      comments.comments ?? 0,
      unitRel,
    ].join("\t"));

    safeWriteText(path.join(DEST, "drive-temporal-summary.tsv"), summaryRows.join("\n") + "\n");

    console.error(
      `progress=${i + 1}/${targetPairs.length} imports=${importManifestCount} current_xml=${currentXmlCount} revision_xml=${revXmlTotal} local="${pair.local_basename}" drive="${doc.name}"`
    );
    await sleep(SLEEP_MS);
  }

  safeWriteJson(path.join(DEST, "extraction-by-target-index.json"), extractionByTarget);
  safeWriteJson(path.join(DEST, "extraction-by-target-index.json"), extractionByTarget);
  safeWriteText(path.join(DEST, "drive-temporal-summary.tsv"), summaryRows.join("\n") + "\n");

  const totals = {
    dest_root: DEST,
    remote: REMOTE,
    query_mode: QUERY_MODE,
    local_targets_seen: localFiles.length,
    drive_docs_seen: driveDocs.length,
    min_target_score: MIN_TARGET_SCORE,
    paired_targets_total_before_limit: built.pairs.length,
    no_match_count: noMatch.length,
    import_targets_processed: targetPairs.length,
    extraction_units_written: targetPairs.length,
    import_manifests_written: importManifestCount,
    current_document_xml: currentXmlCount,
    v2_revision_count_total: revCountTotal,
    v2_revision_xml_total: revXmlTotal,
    summary_tsv: path.join(DEST, "drive-temporal-summary.tsv"),
    import_pairing_audit: path.join(DEST, "local-import-pairing-audit.json"),
  };
  safeWriteJson(path.join(DEST, "drive-temporal-totals.json"), totals);

  console.log(`local_targets_seen=${totals.local_targets_seen}`);
  console.log(`drive_docs_seen=${totals.drive_docs_seen}`);
  console.log(`paired_targets_total_before_limit=${totals.paired_targets_total_before_limit}`);
  console.log(`no_match_count=${totals.no_match_count}`);
  console.log(`import_targets_processed=${totals.import_targets_processed}`);
  console.log(`extraction_units_written=${totals.extraction_units_written}`);
  console.log(`import_manifests_written=${totals.import_manifests_written}`);
  console.log(`current_document_xml=${totals.current_document_xml}`);
  console.log(`v2_revision_count_total=${totals.v2_revision_count_total}`);
  console.log(`v2_revision_xml_total=${totals.v2_revision_xml_total}`);
  console.log(`summary_tsv=${totals.summary_tsv}`);
}

main().catch((err) => {
  console.error("fatal=" + (err?.stack || err?.message || String(err)));
  process.exit(1);
});
