import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";

const target = "scripts/semantic/xml-selected-meaning-span-rehash.mjs";
const injectPath = process.argv[2];
const mainPath = process.argv[3];

let s = readFileSync(target, "utf8");
const beforeHash = createHash("sha256").update(s).digest("hex");

function requireText(text) {
  if (!s.includes(text)) throw new Error(`Patch target missing required text: ${text}`);
}

for (const text of [
  'const PROMPT_VERSION = "xml-grounded-semantic-v1";',
  'outDir: join(ROOT, "docs/forensics/audits/xml-grounded-vertex-rehash-runs", RUN_ID),',
  'const batchArg = process.argv.find((x) => x.startsWith("--batch-size="));',
  'const BATCH_SIZE = batchArg ? Number(batchArg.split("=")[1]) : 8;',
  'const TABLE_SCHEMAS = {',
  'async function main() {',
  '\nmain().catch',
  'function buildPrompt',
  'DUALISM:',
  'ARCHETYPE:',
  'BIBLICAL REFERENCE:',
  'HYPERLINK:',
  'async function callVertexOnce',
  'repairWithVertex',
  'async function writeSemanticResult',
]) requireText(text);

s = s.replace(
  'const PROMPT_VERSION = "xml-grounded-semantic-v1";',
  'const PROMPT_VERSION = "xml-selected-meaning-span-v4";'
);

s = s.replace(
  'outDir: join(ROOT, "docs/forensics/audits/xml-grounded-vertex-rehash-runs", RUN_ID),',
  'outDir: join(ROOT, "docs/forensics/audits/xml-selected-meaning-span-rehash-runs", RUN_ID),'
);

s = s.replace(
  'const batchArg = process.argv.find((x) => x.startsWith("--batch-size="));',
  `const batchArg = process.argv.find((x) => x.startsWith("--batch-size="));
const limitDocsArg = process.argv.find((x) => x.startsWith("--limit-docs="));
const selectedTruthArg = process.argv.find((x) => x.startsWith("--selected-truth="));`
);

s = s.replace(
  'const BATCH_SIZE = batchArg ? Number(batchArg.split("=")[1]) : 8;',
  `const BATCH_SIZE = batchArg ? Number(batchArg.split("=")[1]) : 8;
const LIMIT_DOCS = limitDocsArg ? Number(limitDocsArg.split("=")[1]) : null;
const SELECTED_TRUTH_OVERRIDE = selectedTruthArg ? selectedTruthArg.split("=").slice(1).join("=") : "";`
);

s = s.replace(
  'metadata: { run_id: RUN_ID, script: "scripts/semantic/xml-grounded-vertex-rehash.mjs", db_write_mode: "supabase_management_api" },',
  'metadata: { run_id: RUN_ID, script: "scripts/semantic/xml-selected-meaning-span-rehash.mjs", derived_from: "xml-grounded-vertex-rehash.mjs", db_write_mode: "supabase_management_api", selected_xml_driver: true, primary_hash_lane: "semantic_meaning_spans", old_semantic_table_writes: "blocked_on_first_run" },'
);

s = s.replace(
  'const TABLE_SCHEMAS = {',
  `const TABLE_SCHEMAS = {
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
  },`
);

s = s.replace(
  'You must use the NARRATIVE CONTEXT PACK as the interpretive lens, and the CHAPTER PROSE / XML EVIDENCE / LIVE PARAGRAPHS as evidence.',
  'You must use the NARRATIVE CONTEXT PACK as the interpretive lens. Selected XML render paragraphs are the source/hash evidence. Public chapter prose is narrative context, not the source driver.'
);

s = s.replace('LIVE PARAGRAPHS TO HASH:', 'SELECTED XML RENDER PARAGRAPHS TO HASH:');

const inject = readFileSync(injectPath, "utf8");
const mainReplacement = readFileSync(mainPath, "utf8");

const mainStart = s.indexOf("async function main() {");
const catchStart = s.indexOf("\nmain().catch", mainStart);
if (mainStart < 0 || catchStart < 0) throw new Error("Could not locate main() block.");

s = s.slice(0, mainStart) + inject + "\n" + mainReplacement + s.slice(catchStart);

writeFileSync(target, s);

const afterHash = createHash("sha256").update(s).digest("hex");
writeFileSync(
  "docs/forensics/audits/SELECTED_XML_PRIMARY_MEANING_SPAN_PATCH_HASHES.txt",
  `before_sha256=${beforeHash}\nafter_sha256=${afterHash}\n`
);
