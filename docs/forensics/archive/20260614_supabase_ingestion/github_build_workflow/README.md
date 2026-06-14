# GitHub Build Workflow Limitation — 2026-06-14

`build-and-deploy` exists and is active, but it does not have a `workflow_dispatch` trigger.

Attempting to manually dispatch it from `cleanup/standard-app-tree` failed with:

`HTTP 422: Workflow does not have 'workflow_dispatch' trigger`

Conclusion:

- Supabase Edge function deploy is already verified through `Deploy Supabase Edge Functions Only`.
- Existing `build-and-deploy` cannot be used as manual CI verification until its YAML is intentionally updated.
- Do not treat this as archive-cleanup fallout.
