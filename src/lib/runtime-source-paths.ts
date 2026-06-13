// Canonical runtime source paths for Weight of the Sky.
//
// These are active runtime documents, not archives.
// The typography engine and layer-to-cinema renderer may read from these paths.
//
// src/ is application source code.
// data/runtime_sources/weight_of_the_sky/ is runtime manuscript/source data.

export const RUNTIME_SOURCE_ROOT = "data/runtime_sources/weight_of_the_sky";

export const RUNTIME_SOURCE_PATHS = {
  protocols: "data/runtime_sources/weight_of_the_sky/00_protocols",
  rendererActiveInputs: "data/runtime_sources/weight_of_the_sky/01_renderer_active_inputs",
  typographySources: "data/runtime_sources/weight_of_the_sky/02_typography_sources",
  layerToCinemaSources: "data/runtime_sources/weight_of_the_sky/03_layer_to_cinema_sources",
  currentFinalDrafts: "data/runtime_sources/weight_of_the_sky/04_current_final_drafts",
  revisionSnapshots: "data/runtime_sources/weight_of_the_sky/05_revision_snapshots",
  currentOoxml: "data/runtime_sources/weight_of_the_sky/06_ooxml_current",
  revisionOoxml: "data/runtime_sources/weight_of_the_sky/07_ooxml_revision_exports",
  worldbuildingLore: "data/runtime_sources/weight_of_the_sky/08_worldbuilding_lore",
  synopsisCompendiums: "data/runtime_sources/weight_of_the_sky/09_synopsis_compendiums",
  ingestionBaselines: "data/runtime_sources/weight_of_the_sky/10_ingestion_baselines",
  agentContext: "data/runtime_sources/weight_of_the_sky/11_agent_context",
  supabaseIndexes: "data/runtime_sources/weight_of_the_sky/12_supabase_indexes",
  manualSortInbox: "data/runtime_sources/weight_of_the_sky/99_manual_sort_inbox",
  quarantineDoNotIngest: "data/runtime_sources/weight_of_the_sky/99_quarantine_do_not_ingest",
} as const;

export const LEGACY_INGESTION_BUFFER_PATHS = {
  gdriveRawTextBaseline: "src/data-layer/ingestion-buffer/gdrive_raw",
  gdriveDocxIntake: "src/data-layer/ingestion-buffer/gdrive_docx_intake",
  gdriveOoxmlRaw: "src/data-layer/ingestion-buffer/gdrive_ooxml_raw",
  readmeDocs: "src/data-layer/ingestion-buffer/readme_docs",
} as const;
