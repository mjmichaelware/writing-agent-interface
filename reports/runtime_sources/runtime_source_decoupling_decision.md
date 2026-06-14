# Runtime Source Decoupling Decision

The staged documents and `gdrive_raw` materials are active runtime source data, not archives.

Canonical runtime source root:

`data/runtime_sources/weight_of_the_sky/`

Legacy compatibility roots remain in place for safety:

- `docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw`
- `src/data-layer/ingestion-buffer/readme_docs`
- `src/data-layer/ingestion-buffer/gdrive_docx_intake`
- `src/data-layer/ingestion-buffer/gdrive_ooxml_raw`

Decision:

- Do not delete legacy roots yet.
- Do not move originals.
- Use the root-level runtime source corpus for new renderer/typography/layer-to-cinema code.
- Treat old references inside staged documents as historical document content, not imports.
- Treat `src/data-layer/initialization-metadata/node_manifest.json` as generated metadata, not a live import.
- New app code should import from `src/lib/runtime-source-reader.ts` or `src/lib/runtime-source-paths.ts`.
