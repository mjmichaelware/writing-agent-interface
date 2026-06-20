This directory is the ingestion-ready home for optional Jung reference data.

Current repo truth:
- The selected XML semantic runtime now stores canonical Jungian archetype anchors through a closed local ontology.
- The repo does not currently contain a staged Jung corpus or a checked-in `manifest.json` for one.
- The semantic pipeline therefore uses the closed ontology and deterministic normalization rules already in code, not external corpus retrieval.

Expected future payload shape:
- `manifest.json`
- one or more source files with Jungian reference excerpts or ontology-supporting material
- optional preprocessing notes describing provenance and licensing

This reference corpus is optional narrative support material and does not replace selected XML as source truth.
