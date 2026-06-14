# Project Structure Standard

Repository root is reserved for application entrypoints, package/build configuration, and first-read agent files.

## Root keepers

- `AGENTS.md`
- `GEMINI.md`
- `README.md`
- package/config files
- `src/`
- `public/`
- `supabase/`
- `scripts/`
- `reports/`
- `docs/`
- `data/runtime_sources/` only while active runtime readers reference it

## Not root keepers

- forensic dumps
- terminal logs
- one-off generated scripts
- local secrets
- raw source archives
- backup files such as `*.bak`
- parallel context systems such as `.agent-context/`

## Canonical homes

- `docs/agent_context/canonical/`: curated project-local truth
- `docs/agent_context/indexes/`: read order, accession maps, cleanup policy, structure standards
- `docs/agent_context/source_drop/`: preserved source docs not yet canonical truth
- `docs/forensics/`: dumps, logs, backups, audits, preserved history
- `reports/`: generated analysis outputs
- `scripts/`: reusable operational scripts only

No symlinks. No raw ingestion promoted to canonical truth without classification.
