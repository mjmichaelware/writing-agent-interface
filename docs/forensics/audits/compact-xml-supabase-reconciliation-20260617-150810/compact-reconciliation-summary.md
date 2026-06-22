# Compact XML / Supabase reconciliation summary

## Root counts

- `gdrive_ooxml_raw`: exists=True files=579 bytes=28706695
- `xml_recovery_reports`: exists=True files=8 bytes=380845
- `supabase_functions`: exists=True files=8 bytes=14572
- `supabase_migrations`: exists=True files=4 bytes=5925
- `actions`: exists=True files=4 bytes=719
- `api`: exists=True files=14 bytes=20068
- `services_ingestion`: exists=True files=1 bytes=6180
- `memory_engine`: exists=True files=8 bytes=9481
- `hasher_context`: exists=True files=7 bytes=59701

## Context pack

- pack_exists: `True`
- pack_bytes: `30316`
- pack_sha256_file: `6e7e306c32940db56e82f1aff23942e6f3d62d7483db8e5735bb2ef2ef75eb8c  docs/agent_context/source_drop/hasher_context_v1/narrative_context_pack_v1.txt`
- manifest_preview:
  - `role	n	sha256	source_path	hasher_path`
  - `archetype_protocol	106	089b3617b7dbc3b46ceb43a7053f55662dd11c5b931bc0b2453d8e66c5568a2d	./docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/3.0_Literary_&_Archetypal_Fusion_Rulebook_(The_Cat_God_&_The_Primal_Self).txt	docs/agent_context/source_drop/hasher_context_v1/01_archetype_protocol_cat_god_primal_self.txt`
  - `archetype_protocol	109	59ed13c0f886611dc08299da8b74306aa860383038e2a645b6436c04c9af25d8	./docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/4.0_Emotional_&_Archetypal_Editing_Rulebook_(Visceral_Empathy_Focus).txt	docs/agent_context/source_drop/hasher_context_v1/02_archetype_protocol_visceral_empathy.txt`
  - `story_compendium	169	7f86ab925e53d48f6e32e07950f30b81b82bd4270b77b826b7392d7d35e86758	./docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/THE_WEIGHT_OF_THE_SKY-_MASTER_COMPENDIUM_(SINGULARITY_v.txt	docs/agent_context/source_drop/hasher_context_v1/03_master_compendium_singularity.txt`
  - `new_synopsis	gdrive_new_synopsis	022c36c6525eda7d3abe4836aa6ca39647c5b7267cd8c2d7234c956a69569fe0	/sdcard/Documents/WeightOfTheSky_Project/00_LORE_VAULT/New_Synopsis-_The_Weight_of_the_Sky.txt	docs/agent_context/source_drop/hasher_context_v1/04_new_synopsis_the_weight_of_the_sky.txt`

## Important files

### reports/xml_recovery/materialized_ooxml_manifest.json
- exists: `True`
- bytes: `362761`
- sha256: `bca8eeacca6a9dd260d50a14a8b2dce9f2f2e759dd16a5cc3ef2ee06d0a1b970`
- first lines:
  - `[`
  - `  {`
  - `    "source": "data/source_archive/name_matched_google_docs/2026-06-13T04-43-18-673Z/documents/0001__-Final_Chapter_1_Revision_Prompt-__1b0h6T2DlMd-5sm1xGdF1e1Qrgddb2D-PU8P8GZ20Hk0/ooxml_current/[Content_Types].xml",`
  - `    "dest": "src/data-layer/ingestion-buffer/gdrive_ooxml_raw/0001_-final_chapter_1_revision_prompt-_1b0h6t2dlmd-5sm1xgdf1e1qrgddb2d-pu8p8gz20hk0/[Content_Types].xml",`
  - `    "doc_folder": "0001_-final_chapter_1_revision_prompt-_1b0h6t2dlmd-5sm1xgdf1e1qrgddb2d-pu8p8gz20hk0",`
  - `    "part_path": "[Content_Types].xml",`
  - `    "bytes": 1172,`
  - `    "sha256": "70100a2bc0a6ff5fcce135d1b8ab0d9f108c4cdd39ead3ce88eda6ca2b6d7581"`
  - `  },`
  - `  {`
  - `    "source": "data/source_archive/name_matched_google_docs/2026-06-13T04-43-18-673Z/documents/0001__-Final_Chapter_1_Revision_Prompt-__1b0h6T2DlMd-5sm1xGdF1e1Qrgddb2D-PU8P8GZ20Hk0/ooxml_current/_rels/.rels",`
  - `    "dest": "src/data-layer/ingestion-buffer/gdrive_ooxml_raw/0001_-final_chapter_1_revision_prompt-_1b0h6t2dlmd-5sm1xgdf1e1qrgddb2d-pu8p8gz20hk0/_rels/.rels",`

### reports/xml_recovery/google_xml_extraction_audit.md
- exists: `True`
- bytes: `452`
- sha256: `8f28a797cd550da537717ff130c0f6824bf9765a34b1fd98b3e7da0fe52bc591`
- first lines:
  - `# Google XML / OOXML Extraction Audit`
  - ``
  - `Generated: Fri Jun 12 22:11:44 MDT 2026`
  - ``
  - `## Local gdrive_raw text targets`
  - ``
  - `- gdrive_raw file count: 182`
  - ``
  - `## Active XML folder`
  - `- gdrive_ooxml_raw file count: 0`
  - ``
  - `## Name-matched Google archive report`

### reports/xml_recovery/source_xml_supabase_schema_proposal.sql
- exists: `True`
- bytes: `1335`
- sha256: `a1c060d896fccd9627bc98e75061cb795af0fa5a678aa8d3ee26b9aeecca1850`
- first lines:
  - `-- Proposal only. Do not execute until reviewed.`
  - `-- Best practice: keep raw OOXML files in the repo/storage folder and store metadata/index rows in Supabase.`
  - ``
  - `create table if not exists public.source_documents (`
  - `  id uuid primary key default gen_random_uuid(),`
  - `  source_kind text not null default 'google_drive_docx_ooxml',`
  - `  drive_file_id text,`
  - `  original_name text,`
  - `  normalized_name text,`
  - `  local_source_path text,`
  - `  current_docx_path text,`
  - `  current_docx_sha256 text,`

### reports/gdrive_ooxml_raw_files.txt
- exists: `True`
- bytes: `86157`
- sha256: `b89eedd9f776b5c983570f118f604f2351fb6d624eb844c84c1761d820ff0d00`
- first lines:
  - `src/data-layer/ingestion-buffer/gdrive_ooxml_raw/0001_-final_chapter_1_revision_prompt-_1b0h6t2dlmd-5sm1xgdf1e1qrgddb2d-pu8p8gz20hk0/[Content_Types].xml`
  - `src/data-layer/ingestion-buffer/gdrive_ooxml_raw/0001_-final_chapter_1_revision_prompt-_1b0h6t2dlmd-5sm1xgdf1e1qrgddb2d-pu8p8gz20hk0/_rels/.rels`
  - `src/data-layer/ingestion-buffer/gdrive_ooxml_raw/0001_-final_chapter_1_revision_prompt-_1b0h6t2dlmd-5sm1xgdf1e1qrgddb2d-pu8p8gz20hk0/word/_rels/document.xml.rels`
  - `src/data-layer/ingestion-buffer/gdrive_ooxml_raw/0001_-final_chapter_1_revision_prompt-_1b0h6t2dlmd-5sm1xgdf1e1qrgddb2d-pu8p8gz20hk0/word/document.xml`
  - `src/data-layer/ingestion-buffer/gdrive_ooxml_raw/0001_-final_chapter_1_revision_prompt-_1b0h6t2dlmd-5sm1xgdf1e1qrgddb2d-pu8p8gz20hk0/word/fontTable.xml`
  - `src/data-layer/ingestion-buffer/gdrive_ooxml_raw/0001_-final_chapter_1_revision_prompt-_1b0h6t2dlmd-5sm1xgdf1e1qrgddb2d-pu8p8gz20hk0/word/numbering.xml`
  - `src/data-layer/ingestion-buffer/gdrive_ooxml_raw/0001_-final_chapter_1_revision_prompt-_1b0h6t2dlmd-5sm1xgdf1e1qrgddb2d-pu8p8gz20hk0/word/settings.xml`
  - `src/data-layer/ingestion-buffer/gdrive_ooxml_raw/0001_-final_chapter_1_revision_prompt-_1b0h6t2dlmd-5sm1xgdf1e1qrgddb2d-pu8p8gz20hk0/word/styles.xml`
  - `src/data-layer/ingestion-buffer/gdrive_ooxml_raw/0001_-final_chapter_1_revision_prompt-_1b0h6t2dlmd-5sm1xgdf1e1qrgddb2d-pu8p8gz20hk0/word/theme/theme1.xml`
  - `src/data-layer/ingestion-buffer/gdrive_ooxml_raw/0002_r_chapter_1_-_stardust_to_stardust_1tbodxyu5ezufogmr46f64o9u8fisifvmiaxn6qz_siq/[Content_Types].xml`
  - `src/data-layer/ingestion-buffer/gdrive_ooxml_raw/0002_r_chapter_1_-_stardust_to_stardust_1tbodxyu5ezufogmr46f64o9u8fisifvmiaxn6qz_siq/_rels/.rels`
  - `src/data-layer/ingestion-buffer/gdrive_ooxml_raw/0002_r_chapter_1_-_stardust_to_stardust_1tbodxyu5ezufogmr46f64o9u8fisifvmiaxn6qz_siq/word/_rels/document.xml.rels`

### reports/local-docx-xml-files.txt
- exists: `True`
- bytes: `37`
- sha256: `2423fff27f67335762049b1293e23e87af02db612a846a136ee6bfe156b9a87e`
- first lines:
  - `=== Local doc/docx/zip/xml files ===`

### reports/name-matched-google-docs-archive-latest.json
- exists: `True`
- bytes: `530`
- sha256: `c7205bc61a4edc7f7f74e38bcc0e41c57affa2ed98ae60e592dee54444373885`
- first lines:
  - `{`
  - `  "archive_root": "data/source_archive/name_matched_google_docs/2026-06-13T04-43-18-673Z",`
  - `  "target_dirs": [`
  - `    "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw"`
  - `  ],`
  - `  "local_name_targets": 181,`
  - `  "drive_doc_candidates": 319,`
  - `  "matched_targets": 165,`
  - `  "weak_match_review_targets": 2,`
  - `  "unmatched_targets": 14,`
  - `  "unique_drive_docs_archived": 57,`
  - `  "current_docx_saved": 57,`

### src/actions/ingest.action.ts
- exists: `True`
- bytes: `464`
- sha256: `4550e85d0544948b53f43915852e8fe2a039a7e7240cbc4ca13b4d790e5b87d1`
- first lines:
  - `import { CorpusLoader } from "../services/memory-engine/corpus-loader";`
  - `import * as dotenv from "dotenv";`
  - `import path from "path";`
  - ``
  - `// Load .env.local explicitly`
  - `dotenv.config({ path: path.join(process.cwd(), ".env.local") });`
  - ``
  - `async function main() {`
  - `  const loader = new CorpusLoader();`
  - `  await loader.ingestCorpus();`
  - `  console.log("Ingest complete.");`
  - `  process.exit(0);`

### src/actions/retrieve.action.ts
- exists: `True`
- bytes: `82`
- sha256: `979d72e932a602f57d405aca7fe54ceca24694612d3ad142c442a27b7c9bc20c`
- first lines:
  - `export async function retrieveContext() { "use server"; return { context: [] }; }`

### src/actions/update-memory.action.ts
- exists: `True`
- bytes: `91`
- sha256: `bb43de21b518052b5b2d291e39bb56561fe8ed85ab8379441d75f8b0bc68cdcd`
- first lines:
  - `export async function updateMemoryStore() { "use server"; return { synchronized: true }; }`

### src/actions/write.action.ts
- exists: `True`
- bytes: `82`
- sha256: `abcee6492b1e9860698464e7fa9fde71406fb3015321250beda6e5fe8bd2679f`
- first lines:
  - `export async function writeChapterDraft() { "use server"; return { draft: "" }; }`

### src/services/ingestion/pipeline.ts
- exists: `True`
- bytes: `6180`
- sha256: `b53dadfe955a26bd4fe7200c7d4dd1381b74abc19560d26bd28cb7d65aaf0599`
- first lines:
  - `import OpenAI from 'openai';`
  - `import { query } from '../../lib/db';`
  - `import { GoogleSwarm } from '../orchestration-engine/google-swarm';`
  - ``
  - `function getOpenAI() {`
  - `  const apiKey = process.env.OPENAI_API_KEY;`
  - `  if (!apiKey) return null;`
  - `  return new OpenAI({ apiKey });`
  - `}`
  - ``
  - `// Extractor for Hebrew typography terms`
  - `function extractHebrewSpans(text: string) {`

### src/services/memory-engine/vector-store.ts
- exists: `True`
- bytes: `5279`
- sha256: `1e9eafc3c4099ac4b3cf29e3d225197fdb227b363392f0b95735fbb31f22d09e`
- first lines:
  - `import { Pool } from "pg";`
  - ``
  - `export class VectorStore {`
  - `  private pool: Pool | null = null;`
  - ``
  - `  constructor() {`
  - `    const connectionString = process.env.DATABASE_URL;`
  - `    if (connectionString) {`
  - `      this.pool = new Pool({`
  - `        connectionString,`
  - `        ssl: { rejectUnauthorized: false },`
  - `        max: 5,`

### supabase/functions/register-uploaded-artifact/index.ts
- exists: `True`
- bytes: `2915`
- sha256: `6ae27df18ae8dcf0027c749881cd3f2dce2ed1f8b507de8a8fa77ebd4c50ec34`
- first lines:
  - `import { handleOptions, jsonResponse } from "../_shared/cors.ts";`
  - `import { adminClient } from "../_shared/supabase.ts";`
  - `import { assertAllowedBucket, assertSafeObjectPath } from "../_shared/hash.ts";`
  - ``
  - `Deno.serve(async (req) => {`
  - `  const opt = handleOptions(req);`
  - `  if (opt) return opt;`
  - ``
  - `  try {`
  - `    if (req.method !== "POST") return jsonResponse({ error: "POST only" }, 405);`
  - ``
  - `    const body = await req.json();`

### supabase/functions/verify-artifact-hash/index.ts
- exists: `True`
- bytes: `3515`
- sha256: `a2624a9a5e860b67207c0e558187e1dc02fddadc26139bc7483e953236c4af9e`
- first lines:
  - `import { handleOptions, jsonResponse } from "../_shared/cors.ts";`
  - `import { adminClient } from "../_shared/supabase.ts";`
  - `import { assertAllowedBucket, assertSafeObjectPath, sha256Hex } from "../_shared/hash.ts";`
  - ``
  - `Deno.serve(async (req) => {`
  - `  const opt = handleOptions(req);`
  - `  if (opt) return opt;`
  - ``
  - `  try {`
  - `    if (req.method !== "POST") return jsonResponse({ error: "POST only" }, 405);`
  - ``
  - `    const body = await req.json();`

### supabase/functions/enqueue-enrichment/index.ts
- exists: `True`
- bytes: `1989`
- sha256: `e53b137ae93d74c5a611ef94814b59b78c73fbe6eaa18c908f87fd7310e7362e`
- first lines:
  - `import { handleOptions, jsonResponse } from "../_shared/cors.ts";`
  - `import { adminClient } from "../_shared/supabase.ts";`
  - ``
  - `const allowedKinds = new Set([`
  - `  "ingest_manifest_tsv",`
  - `  "parse_xml_payload",`
  - `  "embed_paragraph",`
  - `  "detect_biblical_references",`
  - `  "score_archetypes",`
  - `  "map_dualisms",`
  - `  "vectorize_typography",`
  - `  "plan_visual_asset",`

### supabase/functions/process-enrichment-batch/index.ts
- exists: `True`
- bytes: `1679`
- sha256: `59932ff50e08a51d3463597ee3d9d574029ac94acd16de217909b43370ffa53c`
- first lines:
  - `import { handleOptions, jsonResponse } from "../_shared/cors.ts";`
  - `import { adminClient } from "../_shared/supabase.ts";`
  - ``
  - `Deno.serve(async (req) => {`
  - `  const opt = handleOptions(req);`
  - `  if (opt) return opt;`
  - ``
  - `  try {`
  - `    if (req.method !== "POST") return jsonResponse({ error: "POST only" }, 405);`
  - ``
  - `    const body = await req.json();`
  - `    const limit = Math.min(Number(body.limit ?? 10), 50);`

### supabase/migrations/20260521000000_initial_schema.sql
- exists: `True`
- bytes: `2474`
- sha256: `013ac1e2efc14b859523c2004de60a2ace3aac08c0b28bfc2b389978b5975926`
- first lines:
  - `-- Phase A: Database schema + ingestion pipeline`
  - ``
  - `-- Enable vector extension for embeddings`
  - `CREATE EXTENSION IF NOT EXISTS vector;`
  - ``
  - `-- System 11: Canonical Novel Structure`
  - `CREATE TABLE chapters (`
  - `    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`
  - `    part_number TEXT NOT NULL, -- 1, 2, 3, or 'epilogue'`
  - `    chapter_number INT NOT NULL,`
  - `    status TEXT NOT NULL DEFAULT 'unwritten', -- 'drafted', 'unwritten'`
  - `    manifest_id TEXT UNIQUE,`

### supabase/migrations/20260602000000_phase1_sync.sql
- exists: `True`
- bytes: `1678`
- sha256: `78512ac65a01ec23227885291342083636e8074555c658b302a4f9fa5106aef4`
- first lines:
  - `-- Phase 1 Delta Sync`
  - `-- Ensure hyperlinks table exists`
  - `CREATE TABLE IF NOT EXISTS hyperlinks (`
  - `    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),`
  - `    paragraph_id UUID REFERENCES paragraphs(id) ON DELETE CASCADE,`
  - `    theme_node_a TEXT NOT NULL,`
  - `    theme_node_b TEXT,`
  - `    link_type TEXT DEFAULT 'dualism', -- e.g. 'dualism', 'foreshadowing', 'motif'`
  - `    weight FLOAT DEFAULT 1.0,`
  - `    created_at TIMESTAMPTZ DEFAULT NOW()`
  - `);`
  - ``


## Term hits by file

- `reports/agent_context/llama_merge/llama_agents_merge_prompt_20260613_034544.md`: archetypal_weights, archetype, biblical, biblical_references, dualism, dualism_map, gdrive_ooxml, hyperlinks, materialized_ooxml, runtime_sources
- `reports/api-route-source-report.txt`: archetypal_weights, archetype, biblical, biblical_references, dualism, dualism_map, hyperlinks, theme_node_a, theme_node_b
- `reports/app-data-source-report.txt`: biblical
- `reports/chapter-source-references.txt`: archetypal_weights, archetype, biblical, biblical_references, dualism, dualism_map, embedding, hyperlinks
- `reports/context_import_check/selected_context_import_check.txt`: runtime_sources
- `reports/data-lineage-audit.txt`: archetype, biblical
- `reports/db-lineage-report.txt`: archetypal_weights, biblical, biblical_references, dualism, dualism_map, hyperlinks
- `reports/derived-panel-references.txt`: Jungian, allusion, archetypal_weights, archetype, biblical, biblical_references, dualism, dualism_map, hyperlinks, parallelism, theme_node_a, theme_node_b
- `reports/gdrive_ooxml_raw_files.txt`: document.xml, gdrive_ooxml, word/document.xml
- `reports/ingestion-hash-references.txt`: allusion, archetypal_weights, archetype, biblical, biblical_references, dualism, embedding, hyperlinks, parallelism, theme_node_a, theme_node_b
- `reports/json-payload-shapes.txt`: archetypal_weights, dualism, dualism_map
- `reports/perfect_weight/01_file_manifest.tsv`: archetype, biblical, dualism, embedding, hyperlinks
- `reports/perfect_weight/03_code_data_map.md`: Jungian, archetypal_weights, archetype, biblical, biblical_references, dualism, dualism_map, embedding, hyperlinks, parallelism, theme_node_a, theme_node_b
- `reports/perfect_weight/04_uiux_extract.md`: Jungian, allusion, archetypal_weights, archetype, artifact, biblical, biblical_references, document.xml, dualism, dualism_map, embedding, hyperlinks, parallelism, word/document.xml
- `reports/perfect_weight/05_contradiction_fork_map.md`: archetype, biblical
- `reports/perfect_weight/06_supabase_snapshot.md`: archetypal_weights, biblical, biblical_references, dualism, dualism_map, hyperlinks
- `reports/perfect_weight/07_panel_truth_audit.md`: archetypal_weights, archetype, biblical, biblical_references, dualism, dualism_map, hyperlinks
- `reports/perfect_weight/08_next_100_actions.md`: archetype, biblical, dualism, dualism_map, embedding, hyperlinks
- `reports/perfect_weight/09_WEIGHT_OF_THE_SKY_PERFECTION_README.md`: Jungian, allusion, archetypal_weights, archetype, artifact, biblical, biblical_references, document.xml, dualism, dualism_map, embedding, hyperlinks, parallelism, theme_node_a, theme_node_b, word/document.xml
- `reports/readme_docs_stage_manifest.json`: sha256
- `reports/runtime_sources/active_runtime_source_counts.json`: runtime_sources
- `reports/runtime_sources/active_runtime_source_manifest.json`: archetype, materialized_ooxml, runtime_sources, sha256, source_documents
- `reports/runtime_sources/active_runtime_source_registry.json`: archetype, materialized_ooxml, runtime_sources, sha256
- `reports/runtime_sources/active_runtime_source_registry.md`: archetype, materialized_ooxml, runtime_sources
- `reports/runtime_sources/build_after_runtime_sources.log`: biblical
- `reports/runtime_sources/clean_runtime_import_audit.md`: archetype, gdrive_ooxml, runtime_sources
- `reports/runtime_sources/code_only_runtime_path_audit.md`: archetype, gdrive_ooxml, runtime_sources
- `reports/runtime_sources/document_mentions_legacy_paths_audit.md`: archetype
- `reports/runtime_sources/manual_sort_suggestions.json`: archetype, materialized_ooxml, runtime_sources
- `reports/runtime_sources/manual_sort_suggestions.md`: archetype, materialized_ooxml, runtime_sources
- `reports/runtime_sources/not_archive_policy.md`: gdrive_ooxml, runtime_sources
- `reports/runtime_sources/renderer_document_read_report.json`: Jungian, allusion, archetypal_weights, archetype, artifact, biblical, document.xml, dualism, embedding, hyperlinks, parallelism, runtime_sources, word/document.xml
- `reports/runtime_sources/renderer_document_read_report.md`: Jungian, allusion, archetypal_weights, archetype, artifact, biblical, document.xml, dualism, embedding, hyperlinks, parallelism, runtime_sources, word/document.xml
- `reports/runtime_sources/runtime_import_path_audit.md`: Jungian, allusion, archetypal_weights, archetype, artifact, biblical, biblical_references, dualism, dualism_map, embedding, gdrive_ooxml, hyperlinks, parallelism, runtime_sources
- `reports/runtime_sources/runtime_source_cutover_status.md`: gdrive_ooxml, runtime_sources
- `reports/runtime_sources/runtime_source_decoupling_decision.md`: gdrive_ooxml, runtime_sources
- `reports/runtime_sources/strict_code_runtime_path_audit.json`: gdrive_ooxml, runtime_sources
- `reports/runtime_sources/strict_code_runtime_path_audit.md`: gdrive_ooxml, runtime_sources
- `reports/xml_recovery/google_export_run.log`: sha256
- `reports/xml_recovery/google_xml_extraction_audit.md`: gdrive_ooxml
- `reports/xml_recovery/materialize_after_user_oauth_run.log`: gdrive_ooxml, materialized_ooxml
- `reports/xml_recovery/materialize_ooxml_run.log`: gdrive_ooxml, materialized_ooxml
- `reports/xml_recovery/materialized_ooxml_manifest.json`: document.xml, gdrive_ooxml, sha256, word/document.xml
- `reports/xml_recovery/share_google_docs_with_service_account.md`: gdrive_ooxml
- `reports/xml_recovery/source_xml_supabase_schema_proposal.sql`: sha256, source_document_parts, source_document_revisions, source_documents
- `src/app/api/biblical-references/route.ts`: biblical, biblical_references
- `src/app/api/chapters/route.ts`: archetypal_weights, dualism, dualism_map
- `src/app/api/graph/route.ts`: archetypal_weights, archetype, biblical, biblical_references, dualism, dualism_map, hyperlinks, theme_node_a, theme_node_b
- `src/app/api/manuscript/route.ts`: biblical, biblical_references
- `src/app/api/search/route.ts`: archetypal_weights, dualism, dualism_map, embedding
- `src/services/analytics-engine/logic/coefficient_engine.ts`: dualism
- `src/services/analytics-engine/mapping/dualism_logic.ts`: dualism
- `src/services/bridge/agent.service.ts`: archetype, dualism
- `src/services/document-analyzer/corpus-searcher.ts`: archetypal_weights, dualism, dualism_map, embedding
- `src/services/image-engine/executor.ts`: archetype, dualism
- `src/services/image-engine/prompter.ts`: archetype, dualism
- `src/services/ingestion/pipeline.ts`: archetypal_weights, biblical, biblical_references, dualism, dualism_map, embedding, hyperlinks, theme_node_a, theme_node_b
- `src/services/memory-engine/embedding-processor.ts`: embedding
- `src/services/memory-engine/vector-store.ts`: archetypal_weights, biblical, biblical_references, dualism, dualism_map, embedding
- `src/services/orchestration-engine/google-swarm.ts`: archetypal_weights, dualism, dualism_map
- `src/services/tokenize.ts`: biblical
- `supabase/functions/_shared/hash.ts`: sha256
- `supabase/functions/create-upload-url/index.ts`: artifact, sha256
- `supabase/functions/enqueue-enrichment/index.ts`: archetype, biblical, biblical_references, dualism, dualism_map
- `supabase/functions/process-enrichment-batch/index.ts`: archetype, biblical, dualism
- `supabase/functions/register-uploaded-artifact/index.ts`: artifact, sha256
- `supabase/functions/verify-artifact-hash/index.ts`: artifact, sha256, verify-artifact-hash
- `supabase/migrations/20260521000000_initial_schema.sql`: archetypal_weights, biblical, biblical_references, dualism, dualism_map, embedding
- `supabase/migrations/20260521000001_vector_search.sql`: archetypal_weights, dualism, dualism_map, embedding
- `supabase/migrations/20260602000000_phase1_sync.sql`: biblical, biblical_references, dualism, hyperlinks, theme_node_a, theme_node_b
