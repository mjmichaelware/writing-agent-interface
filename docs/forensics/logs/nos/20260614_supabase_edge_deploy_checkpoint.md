# NOS Supabase Edge Deploy Checkpoint — 2026-06-14

Repository: mjmichaelware/writing-agent-interface
Branch: cleanup/standard-app-tree
Commit SHA: feed0ffd519de062ca865124d5809dfbfcf59f29

Supabase project ref: yegricugzqbmoziycfnt
Supabase URL: https://yegricugzqbmoziycfnt.supabase.co

GitHub Actions workflow: Deploy Supabase Edge Functions Only
Run ID: 27501742749
Run URL: https://github.com/mjmichaelware/writing-agent-interface/actions/runs/27501742749
Run conclusion: success

## Confirmed deployment

- create-upload-url deployed
- register-uploaded-artifact deployed
- verify-artifact-hash deployed
- enqueue-enrichment deployed
- process-enrichment-batch deployed

All functions returned Supabase Edge Runtime headers.
Empty payload tests returned HTTP 400, which confirms deployed functions are reachable and rejecting invalid payloads.

## Confirmed database/storage state before deploy

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

## Storage

- bucket: nos-manifests
- uploaded shards: 61 / 61
- expected uploaded bytes: 194 MB
- typography_inputs.tsv: 25 shards, 122 MB
- tokens.tsv: 13 shards, 63 MB

## Local logs

HTTP test log:
docs/forensics/logs/nos/20260614_supabase_edge_function_http_tests.log
