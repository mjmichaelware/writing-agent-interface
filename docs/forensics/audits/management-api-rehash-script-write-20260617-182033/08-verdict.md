# Management API rehash script write

Changed:
- scripts/semantic/xml-grounded-vertex-rehash.mjs
- .github/workflows/semantic-rehash-dry-run.yml
- .github/workflows/semantic-rehash-full.yml

Backups:
docs/forensics/backups/management-api-rehash-script-write-20260617-182033

Audit:
docs/forensics/audits/management-api-rehash-script-write-20260617-182033

Local dry run uses:
- SUPABASE_ACCESS_TOKEN
- SUPABASE_PROJECT_REF

No local Supabase DB URL or DB password is required.
No local SUPABASE_SERVICE_ROLE_KEY is required by the rehash script.
