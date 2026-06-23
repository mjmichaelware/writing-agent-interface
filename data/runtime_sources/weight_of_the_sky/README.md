# Weight of the Sky Active Runtime Sources

This is not an archive.

This is the canonical root-level active runtime source corpus for the writing-agent interface.

`src/` is application code.
`data/runtime_sources/weight_of_the_sky/` is active manuscript, renderer, typography, lore, revision, and ingestion source data.

The typography engine and layer-to-cinema renderer may read from this folder.

Old `src/data-layer/ingestion-buffer/*` folders remain compatibility inputs until every import/script is audited and cut over.

## Folders

- `00_protocols/` — Agent, ingestion, project, and operating protocol documents.
- `01_renderer_active_inputs/` — Documents the typography and layer-to-cinema renderer may actively read.
- `02_typography_sources/` — Typography, visual rhythm, style, and text-presentation source documents.
- `03_layer_to_cinema_sources/` — Layer-to-cinema, scene, viewport, motion, panel, and cinematic rendering documents.
- `04_current_final_drafts/` — Current selected manuscript drafts and final-draft candidates.
- `05_revision_snapshots/` — Historical manually exported revision snapshots.
- `06_ooxml_current/` — OOXML/XML extracted from current DOCX exports.
- `07_ooxml_revision_exports/` — OOXML/XML extracted from historical DOCX revision exports.
- `08_worldbuilding_lore/` — Worldbuilding, lore, mythology, systems, metaphysics, background.
- `09_synopsis_compendiums/` — Synopsis, compendiums, chapter summaries, indexes, overviews.
- `10_ingestion_baselines/` — Machine ingestion baselines, gdrive_raw text targets, extracted raw text.
- `11_agent_context/` — CLI-readable context, generated reports, and agent bootstrap documents.
- `12_supabase_indexes/` — Database snapshots, schema proposals, data maps, import manifests.
- `99_manual_sort_inbox/` — User hand-pick inbox for files not yet classified.
- `99_quarantine_do_not_ingest/` — Known stale, duplicate, unsafe, or broken files.

## Rules

- These files are active runtime source documents, not cold archives.
- Do not delete originals.
- Do not claim current DOCX export contains full revision history.
- Current DOCX exports go into `04_current_final_drafts/` or `10_ingestion_baselines/` depending on purpose.
- Manually recovered historical version exports go into `05_revision_snapshots/`.
- Current OOXML goes into `06_ooxml_current/`.
- Historical OOXML goes into `07_ooxml_revision_exports/`.
- Typography documents go into `02_typography_sources/`.
- Layer-to-cinema renderer documents go into `03_layer_to_cinema_sources/`.
- Worldbuilding and lore go into `08_worldbuilding_lore/`.
- Synopsis and compendiums go into `09_synopsis_compendiums/`.
