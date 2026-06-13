# Runtime Source Cutover Status

The runtime source documents are active data, not archives.

Canonical active runtime root:

`data/runtime_sources/weight_of_the_sky/`

Legacy compatibility roots:

- `src/data-layer/ingestion-buffer/gdrive_raw`
- `src/data-layer/ingestion-buffer/readme_docs`
- `src/data-layer/ingestion-buffer/gdrive_docx_intake`
- `src/data-layer/ingestion-buffer/gdrive_ooxml_raw`

Important distinction:

- `code_only_runtime_path_audit.md` shows real app/script references.
- `document_mentions_legacy_paths_audit.md` shows old references inside source documents.

Old mentions inside staged docs should not be treated as active imports.
