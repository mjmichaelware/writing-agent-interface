This directory is the ingestion-ready home for optional verse-addressable biblical reference data.

Current repo truth:
- The selected XML semantic runtime can store canonical biblical anchors with `book`, `chapter`, `verse_start`, and `verse_end`.
- The repo does not currently contain a full staged Bible corpus or a checked-in `manifest.json` for one.
- The semantic pipeline must therefore rely on provider-supplied anchor identification plus deterministic normalization, not on local corpus lookup.

Expected future payload shape:
- `manifest.json`
- one or more source files containing verse-addressable biblical reference data
- optional preprocessing notes describing provenance and licensing

The runtime treats this corpus as optional reference material, not as selected XML source truth.
