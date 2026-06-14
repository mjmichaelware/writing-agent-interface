# Supabase Ingestion Archive — 2026-06-14

This folder preserves one-off NOS Supabase ingestion artifacts from the 2026-06-14 cloud-ingestion session.

## Live state already achieved

- Supabase DB connected
- NOS schema installed
- Cloud integration schema installed
- Core manifest imported
- Paragraphs imported: 9508
- Tokens imported: 886490
- Paragraph-level typography inputs imported: 9508
- Manifest shards registered: 61
- Manifest shards uploaded to Supabase Storage: 61
- Edge Functions deployed through GitHub Actions:
  - create-upload-url
  - register-uploaded-artifact
  - verify-artifact-hash
  - enqueue-enrichment
  - process-enrichment-batch

## Kept live in repo

- `supabase/functions/**`
- `.github/workflows/deploy-supabase-functions-only.yml`

## Archived here

- one-off extraction scripts
- one-off manifest import scripts
- one-off Storage upload scripts
- applied Supabase migration SQL files
- forensic audit/log outputs
- unvetted context handoff drop
- tracked dirty-file diffs preserved as patch files

## Rule

This archive is evidence. Do not delete. If a script is needed again, copy it out deliberately and re-review it first.
