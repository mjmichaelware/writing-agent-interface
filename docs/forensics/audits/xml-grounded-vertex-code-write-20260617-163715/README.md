# XML-grounded Vertex semantic code write

Wrote:
- supabase/migrations/20260617000100_xml_grounded_semantic_rehash.sql
- scripts/semantic/verify-context-and-xml-hashes.mjs
- scripts/semantic/xml-grounded-vertex-rehash.mjs
- supabase/functions/_shared/semantic.ts
- supabase/functions/enqueue-enrichment/index.ts
- supabase/functions/process-enrichment-batch/index.ts
- supabase/functions/verify-artifact-hash/index.ts
- supabase/functions/register-uploaded-artifact/index.ts
- .github/workflows/deploy-supabase.yml
- .github/workflows/semantic-rehash-dry-run.yml
- .github/workflows/semantic-rehash-full.yml

Backups:
docs/forensics/backups/xml-grounded-vertex-rehash-write-20260617-163715

Source hashes:
6e7e306c32940db56e82f1aff23942e6f3d62d7483db8e5735bb2ef2ef75eb8c  docs/agent_context/source_drop/hasher_context_v1/narrative_context_pack_v1.txt
bca8eeacca6a9dd260d50a14a8b2dce9f2f2e759dd16a5cc3ef2ee06d0a1b970  reports/xml_recovery/materialized_ooxml_manifest.json
