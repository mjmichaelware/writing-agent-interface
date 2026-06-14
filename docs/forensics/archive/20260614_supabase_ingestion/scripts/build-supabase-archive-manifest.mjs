#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

function argValue(name, fallback = "") {
  const i = process.argv.indexOf(name);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const ARCHIVE = argValue("--archive");
const OUT = argValue("--out", path.join(ARCHIVE, "supabase_manifest"));
const BATCH_KEY = argValue("--batch-key", path.basename(ARCHIVE || "archive"));
const WORK_KEY = argValue("--work-key", "weight_of_the_sky");

if (!ARCHIVE || !fs.existsSync(ARCHIVE)) {
  console.error("usage: node scripts/build-supabase-archive-manifest.mjs --archive <archive_dir> [--out <out_dir>]");
  process.exit(1);
}

fs.mkdirSync(OUT, { recursive: true });

function sha256Bytes(buf) {
  return crypto.createHash("sha256").update(buf).digest("hex");
}

function sha256Text(s) {
  return crypto.createHash("sha256").update(s, "utf8").digest("hex");
}

function stableUuid(input) {
  const h = crypto.createHash("sha256").update(String(input)).digest();
  const b = Buffer.from(h.subarray(0, 16));
  b[6] = (b[6] & 0x0f) | 0x50;
  b[8] = (b[8] & 0x3f) | 0x80;
  const hex = b.toString("hex");
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}

function walk(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walk(p));
    else if (ent.isFile()) out.push(p);
  }
  return out;
}

function rel(p) {
  return path.relative(ARCHIVE, p).split(path.sep).join("/");
}

function tsv(v) {
  if (v === null || v === undefined) return "";
  if (typeof v === "object") v = JSON.stringify(v);
  return String(v).replace(/\r/g, "\\r").replace(/\n/g, "\\n").replace(/\t/g, "\\t");
}

function writeTsv(name, header, rows) {
  const file = path.join(OUT, name);
  const body = [header, ...rows].map((r) => r.map(tsv).join("\t")).join("\n") + "\n";
  fs.writeFileSync(file, body);
  return file;
}

function readJson(file, fallback = null) {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); }
  catch { return fallback; }
}

function xmlDecode(s) {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function stripXmlTags(s) {
  return s.replace(/<[^>]+>/g, "");
}

function normalizeText(s) {
  return s.replace(/\s+/g, " ").trim();
}

function paragraphTextsFromDocXml(xml) {
  const paras = [];
  const pRe = /<w:p\b[\s\S]*?<\/w:p>/g;
  const tRe = /<w:t\b[^>]*>([\s\S]*?)<\/w:t>/g;
  let pm;
  while ((pm = pRe.exec(xml))) {
    const block = pm[0];
    let text = "";
    let tm;
    while ((tm = tRe.exec(block))) text += xmlDecode(stripXmlTags(tm[1]));
    text = normalizeText(text);
    if (text) paras.push(text);
  }
  return paras;
}

function tokenize(text) {
  const out = [];
  const re = /[\p{L}\p{N}'’\-]+|[^\s]/gu;
  let m;
  while ((m = re.exec(text))) {
    out.push({ text: m[0], start: m.index, end: m.index + m[0].length });
  }
  return out;
}

function artifactKind(r) {
  if (r.endsWith("local_source.txt")) return "local_source_text";
  if (r.endsWith("import-manifest.json")) return "import_manifest_json";
  if (r.endsWith("pairing-manifest.json")) return "pairing_manifest_json";
  if (r.endsWith("drive-file-metadata.json")) return "drive_metadata_json";
  if (r.includes("/docs_api/") && r.endsWith(".json")) return "docs_api_json";
  if (r.endsWith("comments/comments.json")) return "comments_json";
  if (r.endsWith("current/current.docx")) return "current_docx";
  if (r.endsWith("current_ooxml/word/document.xml")) return "current_ooxml_document_xml";
  if (r.endsWith("revision-metadata.json")) return "revision_metadata_json";
  if (r.endsWith("export.docx")) return "revision_docx";
  if (r.includes("/v2_revisions/") && r.endsWith("/ooxml/word/document.xml")) return "revision_ooxml_document_xml";
  if (r.endsWith("export-response.json")) return "revision_export_response_json";
  if (r.endsWith("drive-temporal-summary.tsv")) return "summary_tsv";
  if (r.endsWith("drive-temporal-totals.json")) return "totals_json";
  if (r.endsWith("local-import-pairing-audit.json")) return "audit_json";
  return "other";
}

function visibilityForRelPath(r) {
  if (r.includes("cloak") || r.includes("protocol")) return "cloak_protocol";
  if (r.includes("forensics")) return "forensic_only";
  return "private_internal";
}

const batchId = stableUuid(`batch:${BATCH_KEY}:${ARCHIVE}`);
const totals = readJson(path.join(ARCHIVE, "drive-temporal-totals.json"), {});
const pairingAudit = readJson(path.join(ARCHIVE, "local-import-pairing-audit.json"), {});

const allFiles = walk(ARCHIVE).filter((f) => !rel(f).startsWith("supabase_manifest/"));

const contentBlobRows = [];
const sourceArtifactRows = [];
const blobBySha = new Map();
const artifactByRel = new Map();

for (const file of allFiles) {
  const buf = fs.readFileSync(file);
  const s = sha256Bytes(buf);
  const stat = fs.statSync(file);
  const r = rel(file);
  const blobId = stableUuid(`blob:${s}`);
  const artifactId = stableUuid(`artifact:${batchId}:${r}`);
  if (!blobBySha.has(s)) {
    blobBySha.set(s, blobId);
    contentBlobRows.push([
      blobId, s, stat.size, String(buf).split(/\r?\n/).length - 1, "", artifactKind(r), batchId
    ]);
  }
  artifactByRel.set(r, { id: artifactId, blobId, sha256: s, bytes: stat.size, rel: r, kind: artifactKind(r) });
  sourceArtifactRows.push([
    artifactId, batchId, blobId, artifactKind(r), visibilityForRelPath(r), r, "", stat.size, s, {}
  ]);
}

function artifactId(r) {
  return artifactByRel.get(r)?.id || "";
}

function blobIdForRel(r) {
  return artifactByRel.get(r)?.blobId || "";
}

const localImportRows = [];
const driveSourceRows = new Map();
const extractionUnitRows = [];
const xmlPayloadRows = [];
const revisionExportRows = [];
const paragraphRows = [];
const paragraphVersionRows = [];
const tokenRows = [];
const typographyInputRows = [];
const readerSearchRows = [];

const importManifestFiles = walk(path.join(ARCHIVE, "imports", "local_targets"))
  .filter((f) => path.basename(f) === "import-manifest.json")
  .sort();

const unitDirs = walk(path.join(ARCHIVE, "extraction_units", "local_targets"))
  .filter((f) => path.basename(f) === "pairing-manifest.json")
  .map((f) => path.dirname(f));

function extractDriveFromUnitDir(unitDir) {
  const base = path.basename(unitDir);
  const m = base.match(/__DRIVE__(.*?)__(.*)$/);
  return m ? { drive_file_id: m[1], drive_name: m[2].replace(/_/g, " ") } : {};
}

const unitByTargetIndex = new Map();
for (const unitDir of unitDirs) {
  const base = path.basename(unitDir);
  const idx = Number((base.match(/^(\d+)__/) || [])[1]);
  if (Number.isFinite(idx)) unitByTargetIndex.set(idx, unitDir);
}

for (const manifestFile of importManifestFiles) {
  const manifest = readJson(manifestFile, {});
  const r = rel(manifestFile);
  const local = manifest.local_target || {};
  const idx = Number(local.index ?? manifest.target_index ?? (path.basename(path.dirname(manifestFile)).match(/^(\d+)__/) || [])[1]);
  const status = manifest.status === "unmatched" || !manifest.drive_source ? "unmatched" : "matched";
  const drive = manifest.drive_source || {};
  const driveFileId = drive.drive_file_id || drive.id || manifest.best_candidate_below_threshold?.best_drive_id || "";
  const driveName = drive.name || drive.drive_name || manifest.best_candidate_below_threshold?.best_drive_name || "";
  const localImportId = stableUuid(`local_import:${batchId}:${idx}`);
  const unitDir = unitByTargetIndex.get(idx);
  const unitRel = unitDir ? rel(unitDir) : "";
  const unitDrive = unitDir ? extractDriveFromUnitDir(unitDir) : {};
  const finalDriveId = driveFileId || unitDrive.drive_file_id || "";
  const finalDriveName = driveName || unitDrive.drive_name || "";
  const driveSourceId = finalDriveId ? stableUuid(`drive_source:${finalDriveId}`) : "";

  localImportRows.push([
    localImportId,
    batchId,
    idx,
    status,
    local.basename || manifest.local_basename || "",
    local.path || manifest.local_path || "",
    "",
    artifactId(r),
    manifest.best_candidate_below_threshold?.best_score ?? manifest.score ?? "",
    finalDriveId,
    finalDriveName,
    manifest
  ]);

  if (finalDriveId) {
    const metadataRel = unitRel ? `${unitRel}/drive-file-metadata.json` : "";
    const metadata = metadataRel ? readJson(path.join(ARCHIVE, metadataRel), {}) : {};
    driveSourceRows.set(finalDriveId, [
      driveSourceId,
      finalDriveId,
      metadata.name || finalDriveName,
      metadata.mimeType || "application/vnd.google-apps.document",
      metadata.webViewLink || "",
      metadata.createdTime || "",
      metadata.modifiedTime || "",
      metadata.owners || [],
      metadata
    ]);
  }

  if (unitDir && status === "matched") {
    const extractionUnitId = stableUuid(`extraction_unit:${batchId}:${idx}`);
    const unitRelPath = rel(unitDir);
    const currentXmlRel = `${unitRelPath}/current_ooxml/word/document.xml`;
    const currentDocxRel = `${unitRelPath}/current/current.docx`;
    const pairingRel = `${unitRelPath}/pairing-manifest.json`;
    const driveMetaRel = `${unitRelPath}/drive-file-metadata.json`;
    const commentsRel = `${unitRelPath}/comments/comments.json`;
    const docsApiRelCandidates = allFiles.map(rel).filter((x) => x.startsWith(`${unitRelPath}/docs_api/`) && x.endsWith(".json"));

    extractionUnitRows.push([
      extractionUnitId,
      batchId,
      localImportId,
      driveSourceId,
      idx,
      unitRelPath,
      artifactId(pairingRel),
      artifactId(driveMetaRel),
      artifactId(currentDocxRel),
      artifactId(currentXmlRel),
      docsApiRelCandidates.map(artifactId).filter(Boolean)[0] || "",
      artifactId(commentsRel),
      {}
    ]);
  }
}

const xmlFiles = allFiles
  .map(rel)
  .filter((r) => r.endsWith("current_ooxml/word/document.xml") || (r.includes("/v2_revisions/") && r.endsWith("/ooxml/word/document.xml")))
  .sort();

for (const xmlRel of xmlFiles) {
  const isRevision = xmlRel.includes("/v2_revisions/");
  const unitRel = xmlRel.split(isRevision ? "/v2_revisions/" : "/current_ooxml/")[0];
  const unitBase = path.basename(unitRel);
  const idx = Number((unitBase.match(/^(\d+)__/) || [])[1]);
  const extractionUnitId = stableUuid(`extraction_unit:${batchId}:${idx}`);
  const payloadKind = isRevision ? "revision" : "current";
  const revId = isRevision ? xmlRel.split("/v2_revisions/")[1].split("/")[0] : "";
  const artifact = artifactByRel.get(xmlRel);
  if (!artifact) continue;
  const xmlPayloadId = stableUuid(`xml_payload:${batchId}:${xmlRel}`);

  xmlPayloadRows.push([
    xmlPayloadId,
    batchId,
    extractionUnitId,
    artifact.id,
    artifact.blobId,
    payloadKind,
    revId,
    artifact.sha256,
    artifact.bytes,
    { rel_path: xmlRel }
  ]);

  if (isRevision) {
    const revRoot = xmlRel.split("/ooxml/word/document.xml")[0];
    const drive = extractDriveFromUnitDir(path.join(ARCHIVE, unitRel));
    const driveSourceId = drive.drive_file_id ? stableUuid(`drive_source:${drive.drive_file_id}`) : "";
    revisionExportRows.push([
      stableUuid(`revision_export:${batchId}:${unitRel}:${revId}`),
      batchId,
      extractionUnitId,
      driveSourceId,
      revId,
      artifactId(`${revRoot}/revision-metadata.json`),
      artifactId(`${revRoot}/export.docx`),
      xmlPayloadId,
      artifactId(`${revRoot}/export-response.json`),
      "xml",
      {}
    ]);
  }

  const xmlText = fs.readFileSync(path.join(ARCHIVE, xmlRel), "utf8");
  const paras = paragraphTextsFromDocXml(xmlText);
  paras.forEach((text, i) => {
    const normalized = normalizeText(text);
    const normalizedHash = sha256Text(normalized);
    const paragraphHash = sha256Text(`${xmlPayloadId}\n${i}\n${normalized}`);
    const citationHash = sha256Text(`${BATCH_KEY}\n${xmlRel}\nparagraph:${i}\n${normalizedHash}`);
    const paragraphId = stableUuid(`paragraph:${paragraphHash}`);
    const words = normalized ? normalized.split(/\s+/).length : 0;

    paragraphRows.push([
      paragraphId,
      batchId,
      xmlPayloadId,
      extractionUnitId,
      "",
      i,
      i,
      paragraphHash,
      normalizedHash,
      citationHash,
      normalized,
      words,
      normalized.length,
      { source_xml: xmlRel }
    ]);

    paragraphVersionRows.push([
      stableUuid(`paragraph_version:${paragraphId}:${normalizedHash}`),
      paragraphId,
      revId,
      normalizedHash,
      normalized,
      { payload_kind: payloadKind }
    ]);

    readerSearchRows.push([
      stableUuid(`reader_search:${paragraphId}:${normalizedHash}`),
      paragraphId,
      sha256Text(`reader:${paragraphId}:${normalizedHash}`),
      normalized,
      "reader_public",
      { source_xml: xmlRel }
    ]);

    const typographyInputHash = sha256Text(JSON.stringify({
      paragraph_hash: paragraphHash,
      normalized_text_hash: normalizedHash,
      source_xml: xmlRel,
      data_para: i,
      engine_basis: "nos_semantic_kinetic_typography",
      required_outputs: ["arc_mass", "arc_tension", "arc_blur", "arc_drift", "tone", "archetype", "dualism_map"]
    }));

    typographyInputRows.push([
      stableUuid(`typography_input:paragraph:${paragraphId}:${typographyInputHash}`),
      paragraphId,
      "",
      "",
      typographyInputHash,
      {
        scope: "paragraph",
        paragraph_hash: paragraphHash,
        normalized_text_hash: normalizedHash,
        source_xml: xmlRel,
        data_para: i,
        note: "Input identity only. Semantic typography values are populated by enrichment, not invented by the manifest builder."
      }
    ]);

    tokenize(normalized).forEach((tok, ti) => {
      const normTok = tok.text.toLowerCase();
      const tokenHash = sha256Text(`${paragraphHash}\n${ti}\n${normTok}\n${tok.start}\n${tok.end}`);
      const tokenId = stableUuid(`token:${tokenHash}`);
      tokenRows.push([
        tokenId,
        paragraphId,
        ti,
        tok.text,
        normTok,
        tokenHash,
        tok.start,
        tok.end,
        {}
      ]);

      const tokenTypographyInputHash = sha256Text(JSON.stringify({
        paragraph_hash: paragraphHash,
        token_hash: tokenHash,
        token_index: ti,
        token_text: tok.text,
        source_xml: xmlRel,
        data_para: i,
        engine_basis: "nos_semantic_kinetic_typography"
      }));

      typographyInputRows.push([
        stableUuid(`typography_input:token:${tokenId}:${tokenTypographyInputHash}`),
        paragraphId,
        tokenId,
        "",
        tokenTypographyInputHash,
        {
          scope: "token",
          paragraph_hash: paragraphHash,
          token_hash: tokenHash,
          token_index: ti,
          token_text: tok.text,
          source_xml: xmlRel,
          data_para: i,
          note: "Input identity only. Intelligent word morph values require semantic enrichment."
        }
      ]);
    });
  });
}

const emptyHeaderRows = {
  "semantic_analysis_runs.tsv": ["id","batch_id","scope","provider","model_name","engine_version","input_hash","output_hash","prompt_hash","metadata"],
  "paragraph_semantics.tsv": ["id","paragraph_id","analysis_run_id","semantic_output_hash","archetypal_weights","dualism_map","biblical_reference_candidates","sacred_score","descent_score","ascent_score","shadow_score","persona_score","anima_score","self_score","hero_score","mass_score","tension_score","drift_score","blur_score","tone","metadata"],
  "biblical_references.tsv": ["id","paragraph_id","passage_id","analysis_run_id","detected_reference","reference_type","confidence","evidence_text","metadata"],
  "paragraph_archetype_links.tsv": ["id","paragraph_id","archetype_id","character_id","analysis_run_id","weight","evidence_text","metadata"],
  "paragraph_dualism_links.tsv": ["id","paragraph_id","dualism_pair_id","analysis_run_id","pole","weight","evidence_text","metadata"],
  "paragraph_typography_vectors.tsv": ["id","paragraph_id","render_profile_id","semantic_run_id","typography_input_hash","typography_output_hash","arc_mass","arc_tension","arc_blur","arc_drift","tone","vector_payload"],
  "token_typography_vectors.tsv": ["id","token_id","paragraph_typography_vector_id","render_profile_id","typography_input_hash","typography_output_hash","arc_mass","arc_tension","arc_blur","arc_drift","font_weight","color_tone","transform_payload"],
  "visual_asset_cache.tsv": ["id","cache_key_hash","paragraph_id","visual_asset_id","cache_basis"],
  "graph_nodes.tsv": ["id","node_key","node_type","label","payload"],
  "graph_edges.tsv": ["id","source_node_id","target_node_id","edge_type","weight","payload"]
};

writeTsv("archive_batches.tsv",
  ["id","batch_key","archive_root","source_system","local_targets_seen","matched_imports","unmatched_imports","extraction_units","current_xml_count","revision_xml_count","totals"],
  [[batchId, BATCH_KEY, ARCHIVE, "drive_temporal_xml_reextract", totals.local_targets_seen ?? pairingAudit.local_targets_seen ?? "", totals.matched_import_manifests ?? "", totals.unmatched_import_manifests ?? "", totals.extraction_units_written ?? "", totals.current_document_xml ?? "", totals.v2_revision_xml_total ?? "", totals]]
);

writeTsv("content_blobs.tsv",
  ["id","sha256","byte_size","line_count","media_type","content_role","first_seen_batch_id"],
  contentBlobRows
);

writeTsv("source_artifacts.tsv",
  ["id","batch_id","blob_id","artifact_kind","visibility","rel_path","abs_hint","byte_size","sha256","metadata"],
  sourceArtifactRows
);

writeTsv("local_imports.tsv",
  ["id","batch_id","target_index","status","local_basename","local_path","local_artifact_id","import_manifest_artifact_id","best_match_score","drive_file_id","drive_name","import_manifest"],
  localImportRows.sort((a,b) => Number(a[2]) - Number(b[2]))
);

writeTsv("drive_sources.tsv",
  ["id","drive_file_id","drive_name","mime_type","web_view_link","created_time","modified_time","owners","metadata"],
  [...driveSourceRows.values()].sort((a,b) => String(a[1]).localeCompare(String(b[1])))
);

writeTsv("extraction_units.tsv",
  ["id","batch_id","local_import_id","drive_source_id","target_index","unit_rel_path","pairing_manifest_artifact_id","drive_metadata_artifact_id","current_docx_artifact_id","current_xml_artifact_id","docs_api_artifact_id","comments_artifact_id","extraction_summary"],
  extractionUnitRows.sort((a,b) => Number(a[4]) - Number(b[4]))
);

writeTsv("xml_payloads.tsv",
  ["id","batch_id","extraction_unit_id","artifact_id","blob_id","payload_kind","drive_revision_id","sha256","byte_size","xml_metadata"],
  xmlPayloadRows
);

writeTsv("revision_exports.tsv",
  ["id","batch_id","extraction_unit_id","drive_source_id","revision_id","revision_metadata_artifact_id","revision_docx_artifact_id","revision_xml_payload_id","export_response_artifact_id","export_status","metadata"],
  revisionExportRows
);

writeTsv("paragraphs.tsv",
  ["id","batch_id","xml_payload_id","extraction_unit_id","chapter_id","paragraph_index","data_para","paragraph_hash","normalized_text_hash","citation_hash","paragraph_text","word_count","char_count","metadata"],
  paragraphRows
);

writeTsv("paragraph_versions.tsv",
  ["id","paragraph_id","source_revision_id","version_hash","paragraph_text","metadata"],
  paragraphVersionRows
);

writeTsv("tokens.tsv",
  ["id","paragraph_id","token_index","token_text","normalized_token","token_hash","char_start","char_end","metadata"],
  tokenRows
);

writeTsv("typography_inputs.tsv",
  ["id","paragraph_id","token_id","semantic_run_id","input_hash","input_payload"],
  typographyInputRows
);

writeTsv("reader_search_chunks.tsv",
  ["id","paragraph_id","chunk_hash","search_text","visibility","metadata"],
  readerSearchRows
);

for (const [file, header] of Object.entries(emptyHeaderRows)) {
  writeTsv(file, header, []);
}

const runTotals = {
  archive: ARCHIVE,
  out: OUT,
  batch_key: BATCH_KEY,
  batch_id: batchId,
  files_hashed: allFiles.length,
  unique_content_blobs: contentBlobRows.length,
  source_artifacts: sourceArtifactRows.length,
  local_imports: localImportRows.length,
  drive_sources: driveSourceRows.size,
  extraction_units: extractionUnitRows.length,
  xml_payloads: xmlPayloadRows.length,
  revision_exports: revisionExportRows.length,
  paragraphs: paragraphRows.length,
  tokens: tokenRows.length,
  typography_inputs: typographyInputRows.length,
  reader_search_chunks: readerSearchRows.length,
  empty_semantic_tables_created_as_headers: Object.keys(emptyHeaderRows),
  note: "Semantic, biblical, archetype, dualism, and final typography vector rows are not invented here. They are populated by enrichment jobs using these hashed source/paragraph/token inputs."
};

fs.writeFileSync(path.join(OUT, "run_totals.json"), JSON.stringify(runTotals, null, 2));
console.log(JSON.stringify(runTotals, null, 2));
