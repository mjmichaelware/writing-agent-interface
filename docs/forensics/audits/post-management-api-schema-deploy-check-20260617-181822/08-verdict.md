# Post Management API schema/deploy check

Schema migration is proven live if step [4] contains the verified table list.
If deploy conclusion is success, Edge Functions are deployed.

Next blocker for local full XML-grounded rehash:
- current hasher still writes via Supabase REST using SUPABASE_SERVICE_ROLE_KEY
- if you want zero local service-role key handling, revise the hasher to write via Supabase Management API database/query using SUPABASE_ACCESS_TOKEN + SUPABASE_PROJECT_REF

No DB URL or DB password is needed.

audit_dir=docs/forensics/audits/post-management-api-schema-deploy-check-20260617-181822
