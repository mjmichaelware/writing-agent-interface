Repo truth summary for `expand-full-semantic-runtime`:

- The selected XML semantic writer already had provider adapters and batch primitives.
- The repo loads all 13 public chapter files plus the two archetype protocol files, compendium, and synopsis into narrative context.
- The repo did not yet have normalized graph-grade tables for canonical archetype anchors, canonical biblical anchors, crosslinks, or run artifacts.
- The repo did not contain a staged Bible corpus or Jung corpus under a canonical reference-corpora path.
- The batch lifecycle had a real gap: later poll/import runs could produce result files without a colocated manifest, which blocked deterministic import in GitHub Actions.

This audit pass adds:
- normalized runtime tables and migration hooks
- deterministic crosslink emission from accepted semantic observations
- semantic run artifact rows
- explicit workflow actions for prepare, submit, poll, and import
- ingestion-ready reference-corpus directories documenting the missing external payloads honestly
