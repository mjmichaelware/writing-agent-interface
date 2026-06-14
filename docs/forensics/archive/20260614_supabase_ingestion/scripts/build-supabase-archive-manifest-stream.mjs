#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const arg = (n, d = "") => {
  const i = process.argv.indexOf(n);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : d;
};

const ARCHIVE = arg("--archive");
const OUT = arg("--out", path.join(ARCHIVE || ".", "supabase_manifest"));
const BATCH_KEY = arg("--batch-key", path.basename(ARCHIVE || "archive"));
const WORK_KEY = arg("--work-key", "weight_of_the_sky");
const LOG_EVERY = Number(arg("--log-every", "25") || "25");

if (!ARCHIVE || !fs.existsSync(ARCHIVE)) {
  console.error("missing --archive");
  process.exit(1);
}

fs.mkdirSync(OUT, { recursive: true });

const shaBuf = (b) => crypto.createHash("sha256").update(b).digest("hex");
const shaTxt = (s) => crypto.createHash("sha256").update(s, "utf8").digest("hex");

function uuid(input) {
  const h = crypto.createHash("sha256").update(String(input)).digest();
  const b = Buffer.from(h.subarray(0, 16));
  b[6] = (b[6] & 0x0f) | 0x50;
  b[8] = (b[8] & 0x3f) | 0x80;
  const x = b.toString("hex");
  return `${x.slice(0,8)}-${x.slice(8,12)}-${x.slice(12,16)}-${x.slice(16,20)}-${x.slice(20)}`;
}

const rel = (p) => path.relative(ARCHIVE, p).split(path.sep).join("/");
const esc = (v) => {
  if (v === null || v === undefined) return "";
  if (typeof v === "object") v = JSON.stringify(v);
  return String(v).replace(/\r/g, "\\r").replace(/\n/g, "\\n").replace(/\t/g, "\\t");
};
const row = (a) => a.map(esc).join("\t") + "\n";

function open(name, header) {
  const s = fs.createWriteStream(path.join(OUT, name), { encoding: "utf8" });
  s.write(row(header));
  return { s, n: 0, write(r) { s.write(row(r)); this.n++; } };
}

function close(w) {
  return new Promise((resolve, reject) => {
    w.s.end(resolve);
    w.s.on("error", reject);
  });
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    const r = rel(p);
    if (r === "supabase_manifest" || r.startsWith("supabase_manifest/")) continue;
    if (e.isDirectory()) walk(p, out);
    else if (e.isFile()) out.push(p);
  }
  return out;
}

function readJson(f, fb = {}) {
  try { return JSON.parse(fs.readFileSync(f, "utf8")); } catch { return fb; }
}

function kind(r) {
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

const vis = (r) => r.includes("cloak") || r.includes("protocol") ? "cloak_protocol" : "private_internal";
const dexml = (s) => s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;/g, "'");
const norm = (s) => s.replace(/\s+/g, " ").trim();

function* paras(xml) {
  const pRe = /<w:p\b[\s\S]*?<\/w:p>/g;
  let pm;
  while ((pm = pRe.exec(xml))) {
    const b = pm[0];
    const tRe = /<w:t\b[^>]*>([\s\S]*?)<\/w:t>/g;
    let text = "", tm;
    while ((tm = tRe.exec(b))) text += dexml(tm[1].replace(/<[^>]+>/g, ""));
    text = norm(text);
    if (text) yield text;
  }
}

function* toks(text) {
  const re = /[\p{L}\p{N}'’\-]+|[^\s]/gu;
  let m;
  while ((m = re.exec(text))) yield [m[0], m.index, m.index + m[0].length];
}

function unitIdx(unitRel) {
  return Number((path.basename(unitRel).match(/^(\d+)__/) || [])[1]);
}

function driveFromUnit(unitRel) {
  const m = path.basename(unitRel).match(/__DRIVE__(.*?)__(.*)$/);
  return m ? { id: m[1], name: m[2].replace(/_/g, " ") } : { id: "", name: "" };
}

const batchId = uuid(`batch:${BATCH_KEY}:${ARCHIVE}`);
const totals = readJson(path.join(ARCHIVE, "drive-temporal-totals.json"), {});
const audit = readJson(path.join(ARCHIVE, "local-import-pairing-audit.json"), {});

const W = {
  archive_batches: open("archive_batches.tsv", ["id","batch_key","archive_root","source_system","local_targets_seen","matched_imports","unmatched_imports","extraction_units","current_xml_count","revision_xml_count","totals"]),
  content_blobs: open("content_blobs.tsv", ["id","sha256","byte_size","line_count","media_type","content_role","first_seen_batch_id"]),
  source_artifacts: open("source_artifacts.tsv", ["id","batch_id","blob_id","artifact_kind","visibility","rel_path","abs_hint","byte_size","sha256","metadata"]),
  local_imports: open("local_imports.tsv", ["id","batch_id","target_index","status","local_basename","local_path","local_artifact_id","import_manifest_artifact_id","best_match_score","drive_file_id","drive_name","import_manifest"]),
  drive_sources: open("drive_sources.tsv", ["id","drive_file_id","drive_name","mime_type","web_view_link","created_time","modified_time","owners","metadata"]),
  extraction_units: open("extraction_units.tsv", ["id","batch_id","local_import_id","drive_source_id","target_index","unit_rel_path","pairing_manifest_artifact_id","drive_metadata_artifact_id","current_docx_artifact_id","current_xml_artifact_id","docs_api_artifact_id","comments_artifact_id","extraction_summary"]),
  xml_payloads: open("xml_payloads.tsv", ["id","batch_id","extraction_unit_id","artifact_id","blob_id","payload_kind","drive_revision_id","sha256","byte_size","xml_metadata"]),
  revision_exports: open("revision_exports.tsv", ["id","batch_id","extraction_unit_id","drive_source_id","revision_id","revision_metadata_artifact_id","revision_docx_artifact_id","revision_xml_payload_id","export_response_artifact_id","export_status","metadata"]),
  paragraphs: open("paragraphs.tsv", ["id","batch_id","xml_payload_id","extraction_unit_id","chapter_id","paragraph_index","data_para","paragraph_hash","normalized_text_hash","citation_hash","paragraph_text","word_count","char_count","metadata"]),
  paragraph_versions: open("paragraph_versions.tsv", ["id","paragraph_id","source_revision_id","version_hash","paragraph_text","metadata"]),
  tokens: open("tokens.tsv", ["id","paragraph_id","token_index","token_text","normalized_token","token_hash","char_start","char_end","metadata"]),
  typography_inputs: open("typography_inputs.tsv", ["id","paragraph_id","token_id","semantic_run_id","input_hash","input_payload"]),
  reader_search_chunks: open("reader_search_chunks.tsv", ["id","paragraph_id","chunk_hash","search_text","visibility","metadata"]),
  semantic_analysis_runs: open("semantic_analysis_runs.tsv", ["id","batch_id","scope","provider","model_name","engine_version","input_hash","output_hash","prompt_hash","metadata"]),
  paragraph_semantics: open("paragraph_semantics.tsv", ["id","paragraph_id","analysis_run_id","semantic_output_hash","archetypal_weights","dualism_map","biblical_reference_candidates","sacred_score","descent_score","ascent_score","shadow_score","persona_score","anima_score","self_score","hero_score","mass_score","tension_score","drift_score","blur_score","tone","metadata"]),
  biblical_references: open("biblical_references.tsv", ["id","paragraph_id","passage_id","analysis_run_id","detected_reference","reference_type","confidence","evidence_text","metadata"]),
  paragraph_archetype_links: open("paragraph_archetype_links.tsv", ["id","paragraph_id","archetype_id","character_id","analysis_run_id","weight","evidence_text","metadata"]),
  paragraph_dualism_links: open("paragraph_dualism_links.tsv", ["id","paragraph_id","dualism_pair_id","analysis_run_id","pole","weight","evidence_text","metadata"]),
  paragraph_typography_vectors: open("paragraph_typography_vectors.tsv", ["id","paragraph_id","render_profile_id","semantic_run_id","typography_input_hash","typography_output_hash","arc_mass","arc_tension","arc_blur","arc_drift","tone","vector_payload"]),
  token_typography_vectors: open("token_typography_vectors.tsv", ["id","token_id","paragraph_typography_vector_id","render_profile_id","typography_input_hash","typography_output_hash","arc_mass","arc_tension","arc_blur","arc_drift","font_weight","color_tone","transform_payload"]),
  visual_asset_cache: open("visual_asset_cache.tsv", ["id","cache_key_hash","paragraph_id","visual_asset_id","cache_basis"]),
  graph_nodes: open("graph_nodes.tsv", ["id","node_key","node_type","label","payload"]),
  graph_edges: open("graph_edges.tsv", ["id","source_node_id","target_node_id","edge_type","weight","payload"])
};

W.archive_batches.write([batchId, BATCH_KEY, ARCHIVE, "drive_temporal_xml_reextract", totals.local_targets_seen ?? audit.local_targets_seen ?? "", totals.matched_import_manifests ?? "", totals.unmatched_import_manifests ?? "", totals.extraction_units_written ?? "", totals.current_document_xml ?? "", totals.v2_revision_xml_total ?? "", totals]);

console.error("[1/5] walking");
const files = walk(ARCHIVE).sort();
console.error(`files=${files.length}`);

console.error("[2/5] hashing");
const artifact = new Map();
const blobs = new Set();
for (let i = 0; i < files.length; i++) {
  const f = files[i], r = rel(f), b = fs.readFileSync(f), h = shaBuf(b), st = fs.statSync(f);
  const blobId = uuid(`blob:${h}`), artId = uuid(`artifact:${batchId}:${r}`), k = kind(r);
  artifact.set(r, { id: artId, blobId, sha: h, bytes: st.size });
  if (!blobs.has(h)) {
    blobs.add(h);
    W.content_blobs.write([blobId, h, st.size, String(b).split(/\r?\n/).length - 1, "", k, batchId]);
  }
  W.source_artifacts.write([artId, batchId, blobId, k, vis(r), r, "", st.size, h, {}]);
  if ((i + 1) % LOG_EVERY === 0) console.error(`hashed=${i + 1}/${files.length}`);
}

const aid = (r) => artifact.get(r)?.id || "";
const bid = (r) => artifact.get(r)?.blobId || "";
const ahash = (r) => artifact.get(r)?.sha || "";
const abytes = (r) => artifact.get(r)?.bytes || "";

console.error("[3/5] imports/extraction_units");
const unitRoot = path.join(ARCHIVE, "extraction_units/local_targets");
const unitRels = fs.existsSync(unitRoot) ? fs.readdirSync(unitRoot, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => `extraction_units/local_targets/${d.name}`).sort() : [];
const unitByIdx = new Map(unitRels.map(u => [unitIdx(u), u]));

const seenDrive = new Set();
const importFiles = walk(path.join(ARCHIVE, "imports/local_targets")).filter(f => path.basename(f) === "import-manifest.json").sort();

for (const mf of importFiles) {
  const r = rel(mf), m = readJson(mf), local = m.local_target || {};
  const idx = Number(local.index ?? (path.basename(path.dirname(mf)).match(/^(\d+)__/) || [])[1]);
  const status = m.status === "unmatched" || !m.drive_source ? "unmatched" : "matched";
  const u = unitByIdx.get(idx) || "";
  const ud = u ? driveFromUnit(u) : { id: "", name: "" };
  const ds = m.drive_source || {};
  const driveId = ds.drive_file_id || ds.id || ud.id || m.best_candidate_below_threshold?.best_drive_id || "";
  const driveName = ds.name || ds.drive_name || ud.name || m.best_candidate_below_threshold?.best_drive_name || "";
  const localId = uuid(`local_import:${batchId}:${idx}`);
  const driveSourceId = driveId ? uuid(`drive_source:${driveId}`) : "";

  W.local_imports.write([localId, batchId, idx, status, local.basename || "", local.path || "", "", aid(r), m.best_candidate_below_threshold?.best_score ?? m.score ?? "", driveId, driveName, m]);

  if (driveId && !seenDrive.has(driveId)) {
    seenDrive.add(driveId);
    const meta = u ? readJson(path.join(ARCHIVE, `${u}/drive-file-metadata.json`), {}) : {};
    W.drive_sources.write([driveSourceId, driveId, meta.name || driveName, meta.mimeType || "application/vnd.google-apps.document", meta.webViewLink || "", meta.createdTime || "", meta.modifiedTime || "", meta.owners || [], meta]);
  }

  if (u && status === "matched") {
    const extId = uuid(`extraction_unit:${batchId}:${idx}`);
    const docsApi = files.map(rel).find(x => x.startsWith(`${u}/docs_api/`) && x.endsWith(".json")) || "";
    W.extraction_units.write([extId, batchId, localId, driveSourceId, idx, u, aid(`${u}/pairing-manifest.json`), aid(`${u}/drive-file-metadata.json`), aid(`${u}/current/current.docx`), aid(`${u}/current_ooxml/word/document.xml`), docsApi ? aid(docsApi) : "", aid(`${u}/comments/comments.json`), {}]);
  }
}
console.error(`local_imports=${W.local_imports.n} extraction_units=${W.extraction_units.n}`);

console.error("[4/5] xml/paragraphs/tokens");
const xmlRels = files.map(rel).filter(r => r.endsWith("current_ooxml/word/document.xml") || (r.includes("/v2_revisions/") && r.endsWith("/ooxml/word/document.xml"))).sort();

for (let x = 0; x < xmlRels.length; x++) {
  const xr = xmlRels[x], isRev = xr.includes("/v2_revisions/");
  const u = xr.split(isRev ? "/v2_revisions/" : "/current_ooxml/")[0];
  const idx = unitIdx(u), extId = uuid(`extraction_unit:${batchId}:${idx}`);
  const revId = isRev ? xr.split("/v2_revisions/")[1].split("/")[0] : "";
  const xmlId = uuid(`xml_payload:${batchId}:${xr}`);
  W.xml_payloads.write([xmlId, batchId, extId, aid(xr), bid(xr), isRev ? "revision" : "current", revId, ahash(xr), abytes(xr), { rel_path: xr }]);

  if (isRev) {
    const rr = xr.split("/ooxml/word/document.xml")[0];
    const d = driveFromUnit(u);
    W.revision_exports.write([uuid(`revision_export:${batchId}:${u}:${revId}`), batchId, extId, d.id ? uuid(`drive_source:${d.id}`) : "", revId, aid(`${rr}/revision-metadata.json`), aid(`${rr}/export.docx`), xmlId, aid(`${rr}/export-response.json`), "xml", {}]);
  }

  const xml = fs.readFileSync(path.join(ARCHIVE, xr), "utf8");
  let pi = 0;
  for (const text of paras(xml)) {
    const nt = norm(text), nh = shaTxt(nt), ph = shaTxt(`${xmlId}\n${pi}\n${nt}`), ch = shaTxt(`${BATCH_KEY}\n${xr}\nparagraph:${pi}\n${nh}`), pid = uuid(`paragraph:${ph}`);
    W.paragraphs.write([pid, batchId, xmlId, extId, "", pi, pi, ph, nh, ch, nt, nt ? nt.split(/\s+/).length : 0, nt.length, { source_xml: xr }]);
    W.paragraph_versions.write([uuid(`paragraph_version:${pid}:${nh}`), pid, revId, nh, nt, { payload_kind: isRev ? "revision" : "current" }]);
    W.reader_search_chunks.write([uuid(`reader_search:${pid}:${nh}`), pid, shaTxt(`reader:${pid}:${nh}`), nt, "reader_public", { source_xml: xr }]);

    const pth = shaTxt(JSON.stringify({ paragraph_hash: ph, normalized_text_hash: nh, source_xml: xr, data_para: pi, engine_basis: "nos_semantic_kinetic_typography", required_outputs: ["arc_mass", "arc_tension", "arc_blur", "arc_drift", "tone", "archetype", "dualism_map"] }));
    W.typography_inputs.write([uuid(`typography_input:paragraph:${pid}:${pth}`), pid, "", "", pth, { scope: "paragraph", paragraph_hash: ph, normalized_text_hash: nh, source_xml: xr, data_para: pi, note: "Input identity only. Semantic typography values are populated by enrichment, not invented." }]);

    let ti = 0;
    for (const [tt, cs, ce] of toks(nt)) {
      const th = shaTxt(`${ph}\n${ti}\n${tt.toLowerCase()}\n${cs}\n${ce}`), tid = uuid(`token:${th}`);
      W.tokens.write([tid, pid, ti, tt, tt.toLowerCase(), th, cs, ce, {}]);
      const tih = shaTxt(JSON.stringify({ paragraph_hash: ph, token_hash: th, token_index: ti, token_text: tt, source_xml: xr, data_para: pi, engine_basis: "nos_semantic_kinetic_typography" }));
      W.typography_inputs.write([uuid(`typography_input:token:${tid}:${tih}`), pid, tid, "", tih, { scope: "token", paragraph_hash: ph, token_hash: th, token_index: ti, token_text: tt, source_xml: xr, data_para: pi, note: "Input identity only. Intelligent word morph values require semantic enrichment." }]);
      ti++;
    }
    pi++;
  }
  if ((x + 1) % 10 === 0 || x + 1 === xmlRels.length) console.error(`xml=${x + 1}/${xmlRels.length} paragraphs=${W.paragraphs.n} tokens=${W.tokens.n}`);
}

console.error("[5/5] closing");
for (const w of Object.values(W)) await close(w);

const rt = { archive: ARCHIVE, out: OUT, batch_key: BATCH_KEY, work_key: WORK_KEY, batch_id: batchId, files_hashed: files.length, unique_content_blobs: blobs.size, xml_files_parsed: xmlRels.length };
for (const [k, w] of Object.entries(W)) rt[k] = w.n;
rt.note = "Semantic/biblical/archetype/dualism/vector tables are headers only until enrichment. Paragraph/token/typography input identities are populated.";
fs.writeFileSync(path.join(OUT, "run_totals.json"), JSON.stringify(rt, null, 2));
console.log(JSON.stringify(rt, null, 2));
