# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Source of Truth

The current repository always wins. Old files in `/sdcard/Download`, dump `.txt` files at the repo root, and archived AI-reply documents are historical reference only. Before using any old document, verify it matches current imports, exports, and directory structure. See `docs/ai-context/CONTEXT_PRIORITY.md`.

## Commands

```bash
# Development
npm run dev           # Next.js dev server

# Build
npm run build         # Standard build (Vercel CI)
npx next build --webpack   # Android/Termux ARM64 build (use this locally on phone)

# Deploy
npx vercel --prod

# Lint
npm run lint

# Semantic hashing (runs on GitHub Actions, not locally with Ollama)
node scripts/semantic/xml-selected-meaning-span-rehash.mjs --help
```

### Triggering semantic workflows

Use `workflow_dispatch` via GitHub Actions UI or MCP tool (`mcp__github__actions_run_trigger`). The `semantic-selected-xml-write.yml` workflow is the active pipeline — it installs Ollama on the runner, pulls the model, and runs the rehash script. Typical validation invocation:

```
provider=ollama_actions, model=llama3.2:1b, batch_size=1, limit_docs=1, limit=3, batch_action=sync_write
```

Do not run Ollama locally on Termux — use GitHub Actions free compute.

## Architecture

### UI Layer Stack (`src/app/page.tsx`)

Four composited layers rendered in order; each must preserve z-index and background transparency contract:

| Layer | Component | Role |
|---|---|---|
| Layer1Void | `src/components/layers/Layer1Void.tsx` | Base atmosphere / black void |
| Layer2Cinema | `src/components/layers/Layer2Cinema.tsx` | Visual/cinematic layer behind manuscript |
| Layer3Canvas | `src/components/layers/Layer3Canvas.tsx` | Transparent manuscript layer (must NOT be opaque) |
| Layer4Panel | `src/components/layers/Layer4Panel.tsx` | Top drawer/control overlay |

`ManuscriptCore` lives inside `Layer3Canvas` and receives chapter blocks, chapterSlug, partNumber, and an `onLoadChapter` handler.

### EventBus (`src/core/runtimeEngine.ts`)

Singleton pub/sub bus. Import via `import bus from '@/core/runtimeEngine'`. Runtime listeners in `src/runtime/listeners/` (`audioListener.ts`, `distortionListener.ts`, `thematicListener.ts`) subscribe to events and drive visible UI state changes. Always verify listeners actually cause observable state changes — silent subscriptions are a common bug.

### Data Flow

- **Chapters API** (`src/app/api/chapters/route.ts`): queries `chapters` table via Supabase service role
- **Manuscript API** (`src/app/api/manuscript/route.ts`): queries `paragraphs` with `biblical_references` join, ordered by `chunk_index`
- Fallback: local `.txt` files in `public/data/chapters/` if Supabase is unconfigured
- All production data is Supabase-driven; no `fs.readFileSync` for manuscript content in production

### Semantic Pipeline (`scripts/semantic/xml-selected-meaning-span-rehash.mjs`)

Processes OOXML source documents from `data/runtime_sources/weight_of_the_sky/06_ooxml_current/` through 5 task lanes writing to Supabase via **PostgREST data-plane only** (`${SUPABASE_URL}/rest/v1/<table>`):

| Lane | Target table |
|---|---|
| `meaning_spans` | `semantic_meaning_spans` |
| `biblical_references` | `semantic_biblical_anchors` |
| `archetypes` | `semantic_archetype_anchors` |
| `dualisms` | `semantic_crosslinks` |
| `hyperlinks_parallelisms` | `semantic_crosslinks` |

Also writes `render_paragraphs` and `semantic_runs` / `semantic_run_artifacts`.

**LIMIT semantics**: `--limit=N` counts only semantic windows submitted to AI (prose that passes the gate), NOT raw XML chunks. Headings, bylines, and metadata do not count against the limit.

**Key CLI flags**: `--write`, `--no-ai`, `--full-run-confirm`, `--provider=<name>`, `--limit=N`, `--limit-docs=N`, `--batch-size=N`

**Legacy tables** (`archetype_observations`, `biblical_references`, `dualism_relations`, `hyperlinks`) are intentionally NOT written by the rehash script.

### Supabase Active Tables

Defined by migrations in `supabase/migrations/`:
- `semantic_runs`, `render_paragraphs`, `semantic_meaning_spans`, `semantic_meaning_span_edges`
- `semantic_archetype_anchors`, `semantic_biblical_anchors`, `semantic_crosslinks`, `semantic_run_artifacts`
- `chapters`, `paragraphs` (legacy ingestion tables)

### Environment Variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (client-safe) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role JWT — must be a 3-part JWT with `role: "service_role"` |
| `SUPABASE_PROJECT_REF` | Project ref for management API (non-hot-path only) |
| `SEMANTIC_PROVIDER` | Default AI provider when `--provider` flag is omitted |

`SUPABASE_SERVICE_ROLE_KEY` must be the full JWT, not an `sbp_` PAT or `sb_publishable_` anon key.

## Debug Priorities (from `AGENTS.md`)

1. Import/export correctness
2. Prop signature congruence
3. API payload contracts
4. EventBus event type consistency
5. z-index and background transparency
6. Runtime listeners actually causing visible UI state changes

## Next.js Config Notes

- `typescript.ignoreBuildErrors: true` and `eslint.ignoreDuringBuilds: true` — TypeScript and ESLint errors do not block builds
- Webpack alias `@` → `src/`; top-level await enabled
- Turbopack config present but `--webpack` flag used for ARM64/Termux compatibility

---

## DENSE COMPLETION DIRECTIVE: SELECTED XML HASH PIPELINE

This repository task is not complete until the selected XML hashing/persistence/checkpoint/GitHub Actions pipeline is proven end-to-end by current evidence, not assumptions. Treat all older handoffs, generated dumps, prompts, and partial reports as secondary evidence. Current code, current workflow YAML, current Supabase schema, current run logs, and current artifacts outrank everything. The target is a finished selected XML pipeline that can process the full intended selected corpus, compute stable provenance/hash identifiers, write semantic runtime data to Supabase, resume from checkpoint state, upload useful artifacts, and provide a safe downstream data path for Layer 3 prose rendering later. Do not begin with UI, Layer 3, cinematic layers, visual effects, manuscript styling, or prose rendering unless the data pipeline is already proven. The correct order is: inspect repo state, inspect active branch, inspect workflow YAML, inspect semantic driver, inspect migrations, verify Supabase schema, fix CI shell/setup failures, run tiny verification, inspect compact signals, then run/promote/continue full hash with resume.

Known project root is "/data/data/com.termux/files/home/Workspaces/Hybrid/writing-agent-interface", but verify with "pwd". Active repair branch may be "fix/selected-xml-ollama-ready-gate"; promotion target may be "main"; verify before using either. Important likely files are ".github/workflows/semantic-selected-xml-write-resumable.yml", ".github/workflows/selected-xml-hash-runner.yml", ".github/workflows/apply-selected-xml-meaning-span-migration.yml", "scripts/semantic/xml-selected-meaning-span-rehash.mjs", "supabase/migrations/20260620010000_expand_selected_xml_semantic_runtime.sql", and "supabase/migrations/20260623000000_selected_xml_task_checkpoints.sql"; verify names before editing. High-value directories are ".github/workflows/", "scripts/semantic/", "supabase/migrations/", "src/app/api/", "src/services/", "src/runtime/", "src/core/", "src/data-layer/", "public/data/", "docs/forensics/", and "docs/agent_context/". Never delete "docs/forensics/", never expose internal docs/prompts/blueprints/compendiums/source drops/security docs to public search or client APIs, never invent missing chapters/XML files, never blind-commit raw staging data, never print secrets, never store tokens or DB URLs in tracked files, never treat command echo as command output, never call setup success a semantic success, never promote to "main" without a green verification signal.

Known Supabase project ref is "yegricugzqbmoziycfnt". The user's Supabase Management API token has already been proven valid outside GitHub Actions: project list returned "200", project lookup returned "200", organizations returned "200", and "POST /v1/projects/yegricugzqbmoziycfnt/database/query" with "select 1 as ok;" returned "201" and "[{"ok":1}]". Therefore do not assume the user's actual Management API token is bad. If GitHub Actions sees "401", inspect the workflow secret context, repo/org/environment secret scoping, branch protection/environment permissions, masked secret value, or workflow endpoint usage. Supabase service-role REST is not raw SQL execution; it can query REST-visible tables but cannot execute arbitrary SQL. Management API "/database/query" can execute SQL when authorized. PostgREST schema cache can lag after DDL; after migrations use "notify pgrst, 'reload schema';" and then verify REST visibility. The checkpoint migration has already been applied manually through Management API and direct Postgres checks confirmed "public.semantic_window_task_checkpoints" exists. Confirmed checkpoint columns include "checkpoint_key", "source_doc_folder", "source_document_xml_sha256", "scene_window_id", "task_name", "provider", "model", "prompt_version", "prompt_sha256", "status", "semantic_run_id", "attempt_count", "result_count", "last_error_type", "last_error_message", "metadata", "created_at", and "updated_at". After "notify pgrst, 'reload schema';", REST check for "semantic_window_task_checkpoints" returned "200" with "[]", so the checkpoint table is not missing. Required or likely tables include "semantic_runs", "semantic_meaning_spans", "semantic_biblical_anchors", "semantic_crosslinks", "semantic_run_artifacts", and "semantic_window_task_checkpoints"; verify exact schema before relying on names.

Current known failure is workflow reliability, not missing Supabase schema. Recent failing resumable workflow run was "28120275679". Key signals were "Model response: OK", then "Process completed with exit code 1", then "Print compact run summary", then "syntax error: unexpected end of file", then "Process completed with exit code 2". Interpretation: Ollama installed, model pull worked, model smoke generation returned "OK", but the workflow still failed because shell/YAML logic is broken; the compact summary step also has malformed shell. Do not waste time re-solving Ollama installation unless a fresh run proves a new install/pull failure. Inspect the current YAML around the Ollama smoke step and summary step. Fix the smoke step so a model response containing "OK" cannot fail the workflow. Avoid fragile heredocs inside command substitution. Prefer Node-generated JSON or a temp JSON file, then "curl" with explicit capture. Make "SMOKE_OK=true" only when parsed response contains "OK"; if it does not, write "docs/forensics/audits/ollama-smoke.json", emit a warning, and continue only if the semantic driver has fallback/checkpoint handling. The resumable verification workflow should reach the semantic driver; setup smoke should not block after a valid "OK".

Fix the compact summary step properly. Current "syntax error: unexpected end of file" means malformed shell, usually unclosed quote/heredoc/brace/conditional. Replace brittle summary shell with an "if: always()" and "continue-on-error: true" step that uses Node to safely look for summary JSON candidates, parse if present, print compact keys if found, and print "summary_file=not_found" if absent. The summary step must never make an otherwise successful run fail. It should print useful keys only: "selected_xml_driver", "run_hash", "write_mode", "no_ai", "resume_existing", "checkpoint_cache_enabled", "skipped_due_to_checkpoint", "semantic_windows", "total_meaning_spans", "meaning_spans", "task_ok", "task_empty", "task_failed", "semantic_biblical_anchors", "semantic_crosslinks", "semantic_run_artifacts", "old_semantic_table_writes", and "primary_lane". Preserve artifact upload. Do not suppress true semantic driver failures; only make reporting/summary non-fatal.

After patching, run the smallest meaningful verification: workflow "semantic-selected-xml-write-resumable.yml" on the active branch with "limit_docs=1", "limit=5", "batch_size=1", "batch_action=sync_write", "provider=ollama_actions", "model=llama3.2:1b", "full_run_confirm=false", "apply_migration_first=false", "resume_existing=true", "soft_stop_minutes=30", and "max_task_retries=2". Watch the run. Extract compact logs only. Required evidence from the small verification is that the workflow reaches "Run selected XML semantic write", does not die in setup, sees "resume_existing=true", uses primary lane "semantic_meaning_spans", keeps "old_semantic_table_writes=blocked", produces either "semantic_windows > 0" or "skipped_due_to_checkpoint > 0", has sane "meaning_spans"/"task_ok"/"task_empty"/"task_failed" for the tiny run, writes or verifies checkpoints, and uploads artifacts. If "task_failed > 0", determine whether failures are true runtime failures or valid no-anchor/empty outcomes miscounted. Do not call the run green if the semantic driver never ran.

Verify "run_hash" meaning from code, not from guesswork. Inspect "scripts/semantic/xml-selected-meaning-span-rehash.mjs" around "run_hash", "createHash", "sha256", "selected_xml_driver", "primary_lane", "semantic_meaning_spans", and "old_semantic_table_writes". Document whether "run_hash" hashes source/config/provenance inputs or semantic output rows. Do not claim it hashes all output rows unless the code proves it. The earlier observation was that "run_hash" may be config/source/provenance based, not a digest of every semantic row. Confirm current code.

Verify selected XML corpus coverage from actual files, manifests, or current script catalog. The intended coverage has been described as 16 sources / 45+ XML files, but do not invent or assert it without verification. Search for ".xml"/".XML" files, selected manifests, source catalogs, XML catalog code, and script-selected document lists. Produce a forensic audit file under "docs/forensics/audits/xml-hash-completion/" with discovered source count, XML file count, catalog source, and any mismatch. Preserve old audits. If raw staging dirs are local/gitignored, do not blind-commit them. If the script reads selected XML from a generated cache/manifest rather than raw XML files, document that and verify all selected source entries are addressable.

After small resumable verification passes, inspect "selected-xml-hash-runner.yml". Fix any copied shell/YAML problems there before full execution. Then decide branch flow: either run hash runner on repair branch for additional verification, or promote repair branch to "main" first and run from "main". Do not run a full non-resumable job if resume exists. Full/continuation run should use "resume_existing=true", "full_run_confirm=true", appropriate soft stop, current provider/model, and artifact upload. Expected final hash signals include "selected_xml_driver", "run_hash", "write_mode", "resume_existing", "checkpoint", "skipped_due_to_checkpoint", "semantic_windows", "meaning_spans", "task_ok", "task_empty", "task_failed", "semantic_biblical_anchors" when applicable, "semantic_crosslinks" when applicable, "semantic_run_artifacts", "old_semantic_table_writes", and "primary_lane".

Biblical references are not globally broken. Earlier old logs showed zero accepted biblical references and failures; later runs showed "semantic_biblical_anchors=14", "semantic_crosslinks=1465", and "task_failed=0". Inspect current code and counters. Desired accounting separates "ok", "empty", "no_anchor", "rejected", "failed", and "skipped_due_to_checkpoint". No explicit biblical anchor should not automatically count as runtime failure unless the task contract says so. Preserve deterministic source-grounded fallback behavior where it already exists. Do not replace source-grounded fallbacks with hallucinated data.

Protect the public/private boundary. Internal docs, prompts, compendiums, blueprints, and security/cloak docs must not be included in reader-facing search, public APIs, public static data, or Layer 3 runtime payloads. Reader-facing search should cover approved chapter/prose nodes only unless explicitly redesigned. Layer 3 rendering is downstream; before touching it, prove the source path from Supabase/static/API to renderer, preserve paragraph identity such as "data-para", preserve clean prose rendering, keep missing semantic metadata fallback-safe, and avoid client-thread choke points. Do not use "dangerouslySetInnerHTML" without explicit review and justification.

Commit discipline: one logical fix per commit. Before edits inspect files; before commits show "git diff" and "git status --short". Commit workflow fix separately from audit docs if possible. Do not commit secrets. Do not delete untracked forensic directories. Do not promote until green. If untracked forensic dirs exist, leave them unless explicitly asked; they are evidence. Use clear commit messages such as "ci: fix selected XML resumable smoke and summary steps", "ci: harden selected XML hash runner resume path", or "docs: record selected XML hash completion audit".

Final acceptance criteria: repo state inspected; active branch and target branch verified; Supabase tables verified in Postgres and REST where needed; checkpoint table verified and schema cache handled; workflow shell/setup failures fixed; small resumable workflow succeeds and reaches semantic driver; compact signals captured; selected XML corpus coverage verified; "run_hash" semantics documented from current code; old semantic table writes remain blocked; artifacts upload; selected XML hash runner continues or completes with resume; repair branch promoted only after green verification; final report includes verified facts, files changed, run IDs, conclusions, key signals, Supabase table/checkpoint status, XML/source count, run_hash meaning, resume/checkpoint status, remaining risks, and exact next command.

Final report format must be:
- **Verified**: concise bullets.
- **Changed**: file/path and reason.
- **GitHub Actions**: run id, conclusion, key compact signals.
- **Supabase**: table existence, checkpoint table, REST visibility, schema reload status.
- **XML/hash**: source count, XML file count, run_hash meaning, resume/checkpoint status.
- **Remaining risks**: concrete unresolved items only.
- **Next command**: one exact command or "none; awaiting approval to promote/run full hash."
