# NOS Supabase Ingestion Checkpoint — 2026-06-14

Project ref: yegricugzqbmoziycfnt
Supabase URL: https://yegricugzqbmoziycfnt.supabase.co

Archive root:
data/source_archive/drive_temporal_xml_reextract/20260614_015110_local182_EXTRACT_UNITS_FULL

Database state:
- archive_batches: 1
- cloud_upload_batches: 1
- content_blobs: 1190
- drive_sources: 100
- extraction_units: 174
- local_imports: 182
- manifest_shards: 61
- paragraph_versions: 9508
- paragraphs: 9508
- reader_search_chunks: 9508
- revision_exports: 174
- source_artifacts: 5442
- storage_objects: 61
- tokens: 886490
- typography_inputs: 9508
- xml_payloads: 236

Storage state:
- bucket: nos-manifests
- uploaded shards: 61 / 61
- expected uploaded byte total: 194 MB
- typography_inputs.tsv: 25 shards, 122 MB
- tokens.tsv: 13 shards, 63 MB

Notes:
- Full typography_inputs.tsv is stored as Storage shards, not fully imported into Postgres.
- Only paragraph-level typography inputs are imported into nos.typography_inputs.
- Empty enrichment TSVs are preserved as shards; semantic/biblical/archetype/dualism/vector rows are not invented.
- Next stage: deploy/activate Edge Functions or create SQL queue jobs for enrichment.
