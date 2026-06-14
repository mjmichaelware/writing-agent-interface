import fs from "fs";
import path from "path";
import crypto from "crypto";
import { google } from "googleapis";
import JSZip from "jszip";


const DRIVE_DOC_CANDIDATE_Q = "trashed = false and (mimeType = 'application/vnd.google-apps.document' or mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' or mimeType = 'application/msword')";

const TARGET_DIRS = process.argv.slice(2);
if (TARGET_DIRS.length === 0) {
  TARGET_DIRS.push("docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw");
  TARGET_DIRS.push("/sdcard/Download");
}

const STAMP = new Date().toISOString().replace(/[:.]/g, "-");
const ARCHIVE_ROOT = `data/source_archive/name_matched_google_docs/${STAMP}`;

function mkdirp(p) {
  fs.mkdirSync(p, { recursive: true });
}

function sha256(buf) {
  return crypto.createHash("sha256").update(buf).digest("hex");
}

function writeJson(file, data) {
  mkdirp(path.dirname(file));
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function safeName(s) {
  return String(s || "untitled")
    .normalize("NFKD")
    .replace(/[^\w.\-]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 140) || "untitled";
}

function stripExt(name) {
  return String(name)
    .replace(/\.docx\.txt$/i, "")
    .replace(/\.(txt|md|json|docx|doc|gdoc|rtf|pdf|zip)$/i, "");
}

function normalizeName(name) {
  return stripExt(name)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/^\uFEFF/, "")
    .replace(/^[•*\-\s]+/g, "")
    .replace(/^\([a-z0-9]+\)[_\s-]*/i, "")
    .replace(/^\((final|notes|revisions|revision prompt|prompt guide)\)[_\s-]*/i, "")
    .replace(/^(final|notes|revisions|revision prompt|prompt guide)[_\s-]+/i, "")
    .replace(/[_\-:／/]+/g, " ")
    .replace(/[^\w\s]/g, "")
    .replace(/\b(copy|final|draft|edited|revision|revisions|prompt|guide|notes|version|v\d+|definitive)\b/g, "")
    .replace(/\bchapter\s*0*(\d+)\b/g, "chapter $1")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(s) {
  return new Set(normalizeName(s).split(/\s+/).filter(t => t.length >= 2));
}

function scoreName(localName, driveName) {
  const a = normalizeName(localName);
  const b = normalizeName(driveName);
  if (!a || !b) return 0;
  if (a === b) return 1;
  if (a.includes(b) || b.includes(a)) return 0.94;

  const ta = tokens(a);
  const tb = tokens(b);
  if (!ta.size || !tb.size) return 0;

  let overlap = 0;
  for (const t of ta) if (tb.has(t)) overlap++;

  const union = new Set([...ta, ...tb]).size;
  const jaccard = overlap / union;
  const containment = overlap / Math.min(ta.size, tb.size);

  return Math.max(jaccard, containment * 0.88);
}

function shouldIncludeLocalFile(file) {
  const base = path.basename(file);
  if (base.startsWith(".")) return true;
  return /\.(txt|md|json|docx|doc|rtf|pdf|zip)$/i.test(base);
}

function collectLocalTargets() {
  const targets = [];

  for (const dir of TARGET_DIRS) {
    if (!fs.existsSync(dir)) {
      console.error(`Skipping missing target dir: ${dir}`);
      continue;
    }

    const stat = fs.statSync(dir);

    if (stat.isFile()) {
      if (shouldIncludeLocalFile(dir)) {
        const buf = fs.readFileSync(dir);
        targets.push({
          source_root: path.dirname(dir),
          local_path: dir,
          local_name: path.basename(dir),
          normalized_name: normalizeName(path.basename(dir)),
          bytes: buf.length,
          local_sha256: sha256(buf),
        });
      }
      continue;
    }

    const recursive = !dir.includes("/sdcard/Download");

    function walk(d) {
      for (const item of fs.readdirSync(d)) {
        const full = path.join(d, item);
        let st;
        try { st = fs.statSync(full); } catch { continue; }

        if (st.isDirectory()) {
          if (recursive) walk(full);
          continue;
        }

        if (!shouldIncludeLocalFile(full)) continue;

        let buf;
        try { buf = fs.readFileSync(full); } catch { continue; }

        targets.push({
          source_root: dir,
          local_path: full,
          local_name: path.basename(full),
          normalized_name: normalizeName(path.basename(full)),
          bytes: buf.length,
          local_sha256: sha256(buf),
        });
      }
    }

    walk(dir);
  }

  const seen = new Set();
  return targets.filter(t => {
    const key = `${t.normalized_name}|${t.bytes}|${t.local_sha256}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).sort((a, b) => a.local_name.localeCompare(b.local_name));
}

async function listDriveDocuments(drive) {
  const all = [];
  let pageToken;

  const q = [
    "trashed=false",
    "(",
    "mimeType='application/vnd.google-apps.document'",
    "or mimeType='application/vnd.openxmlformats-officedocument.wordprocessingml.document'",
    "or mimeType='application/msword'",
    ")",
  ].join(" ");

  do {
    const res = await drive.files.list({
      q: DRIVE_DOC_CANDIDATE_Q,
      pageSize: 1000,
      pageToken,
      corpora: "allDrives",
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
      fields:
        "nextPageToken,files(id,name,mimeType,size,createdTime,modifiedTime,version,md5Checksum,sha1Checksum,sha256Checksum,webViewLink,parents,owners(displayName,emailAddress),lastModifyingUser(displayName,emailAddress))",
    });

    all.push(...(res.data.files || []));
    pageToken = res.data.nextPageToken;
  } while (pageToken);

  return all;
}

function matchTargets(targets, driveDocs) {
  return targets.map(target => {
    const candidates = driveDocs
      .map(doc => ({ ...doc, score: scoreName(target.local_name, doc.name) }))
      .filter(c => c.score >= 0.55)
      .sort((a, b) => b.score - a.score || String(b.modifiedTime).localeCompare(String(a.modifiedTime)))
      .slice(0, 10);

    const best = candidates[0] || null;

    return {
      ...target,
      best,
      candidates,
      status: !best ? "unmatched" : best.score >= 0.82 ? "matched" : "weak_match_review",
    };
  });
}

async function exportGoogleDocx(drive, fileId) {
  const res = await drive.files.export(
    {
      fileId,
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    },
    { responseType: "arraybuffer" }
  );
  return Buffer.from(res.data);
}

async function downloadBinary(drive, fileId) {
  const res = await drive.files.get(
    { fileId, alt: "media", supportsAllDrives: true },
    { responseType: "arraybuffer" }
  );
  return Buffer.from(res.data);
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
      date: entry.date || null,
    });
  }

  return entries.sort((a, b) => a.path.localeCompare(b.path));
}

async function saveDocsApi(docs, fileId, outDir) {
  mkdirp(outDir);
  const modes = [
    "SUGGESTIONS_INLINE",
    "PREVIEW_SUGGESTIONS_ACCEPTED",
    "PREVIEW_WITHOUT_SUGGESTIONS",
  ];

  const results = [];

  for (const mode of modes) {
    try {
      const res = await docs.documents.get({
        documentId: fileId,
        suggestionsViewMode: mode,
        includeTabsContent: true,
      });

      const file = path.join(outDir, `docs-api-${mode}.json`);
      writeJson(file, res.data);
      results.push({ mode, ok: true, file, revisionId: res.data.revisionId || null });
    } catch (e) {
      results.push({ mode, ok: false, error: e.message });
    }
  }

  return results;
}

async function saveComments(drive, fileId, outDir) {
  mkdirp(outDir);
  const comments = [];
  let pageToken;

  do {
    try {
      const res = await drive.comments.list({
        fileId,
        pageSize: 100,
        pageToken,
        includeDeleted: true,
        fields:
          "nextPageToken,comments(id,content,quotedFileContent,anchor,author(displayName,emailAddress),createdTime,modifiedTime,deleted,resolved,replies(id,content,author(displayName,emailAddress),createdTime,modifiedTime,deleted,action))",
      });

      comments.push(...(res.data.comments || []));
      pageToken = res.data.nextPageToken;
    } catch (e) {
      writeJson(path.join(outDir, "comments.error.json"), { error: e.message, comments });
      return { ok: false, error: e.message, count: comments.length };
    }
  } while (pageToken);

  writeJson(path.join(outDir, "comments.list.json"), comments);
  return { ok: true, count: comments.length };
}

async function saveRevisions(drive, fileId, outDir) {
  mkdirp(outDir);
  const revisions = [];
  let pageToken;

  do {
    try {
      const res = await drive.revisions.list({
        fileId,
        pageSize: 1000,
        pageToken,
        fields:
          "nextPageToken,revisions(id,mimeType,modifiedTime,keepForever,published,lastModifyingUser(displayName,emailAddress),originalFilename,md5Checksum,size)",
      });

      revisions.push(...(res.data.revisions || []));
      pageToken = res.data.nextPageToken;
    } catch (e) {
      writeJson(path.join(outDir, "revisions.error.json"), { error: e.message, revisions });
      return { ok: false, error: e.message, revision_count: revisions.length, revision_results: [] };
    }
  } while (pageToken);

  writeJson(path.join(outDir, "revisions.list.json"), revisions);

  const revisionResults = [];

  for (const rev of revisions) {
    const r = { revisionId: rev.id, metadata_ok: false, media_ok: false };

    try {
      const meta = await drive.revisions.get({
        fileId,
        revisionId: rev.id,
        fields: "*",
      });
      writeJson(path.join(outDir, `${rev.id}.metadata.json`), meta.data);
      r.metadata_ok = true;
    } catch (e) {
      r.metadata_error = e.message;
    }

    try {
      const media = await drive.revisions.get(
        { fileId, revisionId: rev.id, alt: "media" },
        { responseType: "arraybuffer" }
      );

      const buf = Buffer.from(media.data);
      const ctype = media.headers?.["content-type"] || "";
      const ext =
        ctype.includes("wordprocessingml") ? "docx" :
        ctype.includes("zip") ? "zip" :
        ctype.includes("json") ? "json" :
        "bin";

      const mediaPath = path.join(outDir, `${rev.id}.media.${ext}`);
      fs.writeFileSync(mediaPath, buf);

      r.media_ok = true;
      r.media_path = mediaPath;
      r.media_bytes = buf.length;
      r.media_sha256 = sha256(buf);
      r.media_content_type = ctype;

      if (ext === "docx" || ext === "zip") {
        const extractDir = path.join(outDir, `${rev.id}.media_extracted`);
        try {
          const entries = await extractDocxZip(buf, extractDir);
          r.media_extracted_entries_count = entries.length;
          writeJson(path.join(outDir, `${rev.id}.media_zip_manifest.json`), entries);
        } catch (e) {
          r.media_extract_error = e.message;
        }
      }
    } catch (e) {
      r.media_error = e.message;
    }

    revisionResults.push(r);
  }

  writeJson(path.join(outDir, "revision-download-results.json"), revisionResults);

  return {
    ok: true,
    revision_count: revisions.length,
    revision_results: revisionResults,
  };
}

async function archiveOne({ drive, docs, doc, matchedTargets, index }) {
  const docDir = path.join(
    ARCHIVE_ROOT,
    "documents",
    `${String(index).padStart(4, "0")}__${safeName(doc.name)}__${doc.id}`
  );

  mkdirp(docDir);

  const record = {
    index,
    drive_file: doc,
    matched_targets: matchedTargets,
    docDir,
    current_docx: null,
    current_docx_sha256: null,
    ooxml_entries_count: 0,
    docs_api: [],
    comments: null,
    revisions: null,
    errors: [],
  };

  writeJson(path.join(docDir, "drive-file-metadata.json"), doc);
  writeJson(path.join(docDir, "matched-local-targets.json"), matchedTargets);

  try {
    let buf;
    if (doc.mimeType === "application/vnd.google-apps.document") {
      buf = await exportGoogleDocx(drive, doc.id);
    } else {
      buf = await downloadBinary(drive, doc.id);
    }

    const currentPath = path.join(docDir, "current", "current.docx");
    mkdirp(path.dirname(currentPath));
    fs.writeFileSync(currentPath, buf);
    fs.writeFileSync(`${currentPath}.sha256`, sha256(buf) + "\n");

    record.current_docx = currentPath;
    record.current_docx_sha256 = sha256(buf);

    const entries = await extractDocxZip(buf, path.join(docDir, "ooxml_current"));
    writeJson(path.join(docDir, "current_docx_zip_manifest.json"), entries);
    record.ooxml_entries_count = entries.length;
  } catch (e) {
    record.errors.push({ stage: "current_docx_export_or_extract", error: e.message });
  }

  if (doc.mimeType === "application/vnd.google-apps.document") {
    try {
      record.docs_api = await saveDocsApi(docs, doc.id, path.join(docDir, "docs_api"));
    } catch (e) {
      record.errors.push({ stage: "docs_api", error: e.message });
    }
  }

  try {
    record.comments = await saveComments(drive, doc.id, path.join(docDir, "comments"));
  } catch (e) {
    record.errors.push({ stage: "comments", error: e.message });
  }

  try {
    record.revisions = await saveRevisions(drive, doc.id, path.join(docDir, "revisions"));
  } catch (e) {
    record.errors.push({ stage: "revisions", error: e.message });
  }

  writeJson(path.join(docDir, "archive-record.json"), record);
  return record;
}

mkdirp(ARCHIVE_ROOT);
mkdirp("reports");

const localTargets = collectLocalTargets();
writeJson(path.join(ARCHIVE_ROOT, "local-name-targets.json"), localTargets);

console.log(`Local name targets: ${localTargets.length}`);
console.log("Listing visible Google Docs/DOCX/DOC files...");

const GOOGLE_APPLICATION_CREDENTIALS =
  process.env.GOOGLE_APPLICATION_CREDENTIALS ||
  "secrets/wos-drive-docs-reader.json";

let auth;
if (process.env.GOOGLE_OAUTH_ACCESS_TOKEN) {
  auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: process.env.GOOGLE_OAUTH_ACCESS_TOKEN });
} else if (fs.existsSync(GOOGLE_APPLICATION_CREDENTIALS)) {
  auth = new google.auth.GoogleAuth({
    keyFile: GOOGLE_APPLICATION_CREDENTIALS,
    scopes: [
      "https://www.googleapis.com/auth/drive.readonly",
      "https://www.googleapis.com/auth/documents.readonly",
    ],
  });
} else {
  auth = await google.auth.getClient({
    scopes: [
      "https://www.googleapis.com/auth/drive.readonly",
      "https://www.googleapis.com/auth/documents.readonly",
    ],
  });
}

const drive = google.drive({ version: "v3", auth });
const docs = google.docs({ version: "v1", auth });

const driveDocs = await listDriveDocuments(drive);
writeJson(path.join(ARCHIVE_ROOT, "all-drive-doc-candidates.json"), driveDocs);

console.log(`Drive document candidates: ${driveDocs.length}`);

const matches = matchTargets(localTargets, driveDocs);
writeJson(path.join(ARCHIVE_ROOT, "name-match-report.json"), matches);

const matched = matches.filter(x => x.status === "matched");
const weak = matches.filter(x => x.status === "weak_match_review");
const unmatched = matches.filter(x => x.status === "unmatched");

console.log(`Matched targets: ${matched.length}`);
console.log(`Weak review targets: ${weak.length}`);
console.log(`Unmatched targets: ${unmatched.length}`);

const docsToArchive = new Map();

for (const m of matched) {
  if (!m.best?.id) continue;
  const existing = docsToArchive.get(m.best.id) || { doc: m.best, matchedTargets: [] };
  existing.matchedTargets.push(m);
  docsToArchive.set(m.best.id, existing);
}

const archiveRecords = [];
let index = 1;

for (const item of docsToArchive.values()) {
  console.log(`[${index}/${docsToArchive.size}] Archiving: ${item.doc.name}`);
  const rec = await archiveOne({ drive, docs, doc: item.doc, matchedTargets: item.matchedTargets, index });
  archiveRecords.push(rec);
  writeJson(path.join(ARCHIVE_ROOT, "archive-manifest.partial.json"), archiveRecords);
  index++;
}

const summary = {
  archive_root: ARCHIVE_ROOT,
  target_dirs: TARGET_DIRS,
  local_name_targets: localTargets.length,
  drive_doc_candidates: driveDocs.length,
  matched_targets: matched.length,
  weak_match_review_targets: weak.length,
  unmatched_targets: unmatched.length,
  unique_drive_docs_archived: archiveRecords.length,
  current_docx_saved: archiveRecords.filter(r => r.current_docx).length,
  total_ooxml_current_entries: archiveRecords.reduce((a, r) => a + (r.ooxml_entries_count || 0), 0),
  total_revision_records: archiveRecords.reduce((a, r) => a + (r.revisions?.revision_count || 0), 0),
  total_comments: archiveRecords.reduce((a, r) => a + (r.comments?.count || 0), 0),
  documents_with_errors: archiveRecords.filter(r => r.errors?.length).length,
};

writeJson(path.join(ARCHIVE_ROOT, "archive-manifest.json"), archiveRecords);
writeJson(path.join(ARCHIVE_ROOT, "archive-summary.json"), summary);
writeJson("reports/name-matched-google-docs-archive-latest.json", summary);

console.log("");
console.log("DONE");
console.log(JSON.stringify(summary, null, 2));
