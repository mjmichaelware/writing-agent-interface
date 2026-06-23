# AGENTS.md — Writing Agent Interface Runtime Instructions

This repository is a writing-agent interface, manuscript intelligence system, UI/UX runtime, Supabase-backed narrative database, and source-document recovery workspace.

This file is the first file an AI coding agent should read before making changes. It exists for Gemini CLI, Claude Code, Aider, Codex-style agents, GitHub Copilot-style coding agents, and any future terminal/dev-container agent. The purpose is not to trap the agent in rigid rules. The purpose is to give the agent enough orientation to work intelligently, preserve source context, avoid destructive edits, and reconcile the current application code with the staged writing/recovery documents.

The agent must be careful, evidence-driven, and context-aware. The agent should not blindly obey stale documents. The agent should parse documents against the current repository tree, current Supabase schema, current UI routes, current migrations, current files, and current reports. When documents disagree, the agent should not collapse the disagreement into one false answer. It should preserve alternatives, identify contradictions, and choose the fork that best supports the current product: a high-fidelity writing interface with strong UI/UX, manuscript intelligence, source-document recovery, and future ingestion safety.

---

## 1. Primary Operating Principle

Before changing code, understand the current system.

The agent should first inspect:

- `package.json`
- `src/app`
- `src/components`
- `src/lib`
- `src/services`
- `src/hooks`
- `src/data-layer`
- `src/data-layer/ingestion-buffer`
- `src/data-layer/ingestion-buffer/readme_docs`
- `supabase`
- `supabase/migrations`
- `reports`
- `AGENT_READ_CONTEXT_INDEX.md`
- this `AGENTS.md`

The agent should prefer actual code and actual database schema over old notes. The notes are important, but they are source context, not automatically current truth.

Use this hierarchy:

1. Current working code and current schema.
2. Current reports generated from the repo or database.
3. Staged source/context documents.
4. Old audits, old prompts, old recovery files, old generated dumps.
5. Speculation.

When a staged document says something that conflicts with the current code, keep the useful idea but mark it as historical unless confirmed.

---

## 2. Active Source Context Location

Primary staged source/context documents live here:

`src/data-layer/ingestion-buffer/readme_docs/`

These are active context files. They are not disposable archives.

Priority folders:

1. `src/data-layer/ingestion-buffer/readme_docs/tier_1_core/`
2. `src/data-layer/ingestion-buffer/readme_docs/tier_2_large_universal/`
3. `src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/`
4. `src/data-layer/ingestion-buffer/readme_docs/later_queue/`

Read the index:

`AGENT_READ_CONTEXT_INDEX.md`

The index maps staged files to their original numbered `/sdcard/Download` source list.

---

## 3. What These Source Files Are For

The staged files are meant to help the agent understand:

- project intent
- UI/UX target
- narrative runtime structure
- design language
- ingestion goals
- database lineage
- contradiction maps
- prior implementation attempts
- manuscript draft structure
- missing features
- impossible targets
- high-level recovery goals
- Supabase and NOS integration notes
- CLI operating context

The agent should not treat every staged file as equal. Some files are current. Some are old. Some are contradictory. Some are aspirational. Some describe broken prior attempts. Some are dumps of earlier states. The agent must classify them.

When reading staged docs, record for itself:

- file path
- likely date or generation era if known
- whether it describes current code, desired code, old code, or speculative architecture
- whether it contains UI/UX requirements
- whether it contains ingestion/database requirements
- whether it contains dangerous instructions like deleting, moving, or wiping files
- whether it conflicts with current repo structure

---

## 4. Skills and External Agent Skills

This environment may include agent skills under:

- `/termux-home/.agents/skills/`
- `/termux-home/.agents/skills/supabase/`
- `/termux-home/.agents/skills/supabase-postgres-best-practices/`

When working with Supabase, the agent should inspect the available Supabase skills if it has access to them. Use those skills as guidance for safe database operations, migrations, RLS, indexing, JSONB, connection pooling, and schema discipline.

Do not assume skills are always available. If the agent cannot access them, continue using the repo, migrations, and reports.

The agent should not invent database changes just because a skill exists. It should propose migrations only when the current schema and feature requirement justify them.

---

## 5. Repository Safety Rules

Do these:

- Inspect before editing.
- Prefer small reversible changes.
- Create reports before modifying data.
- Preserve source files.
- Keep derived output separate from source context.
- Use scripts for repeatable operations.
- Make scripts idempotent where possible.
- Print before/after counts for database backfills.
- Use reports for evidence.
- Keep local staged context readable by all CLIs.
- Add clear indexes and manifests.
- Prefer copy over move.
- Prefer additive changes over destructive changes.
- Preserve alternate versions until the canonical source is proven.
- Use `git status --short` before and after edits.
- Avoid broad rewrites unless the user explicitly asks.

Do not do these:

- Do not delete source context files.
- Do not overwrite staged source documents.
- Do not wipe Google Drive, Supabase, Downloads, or local source buffers.
- Do not collapse duplicate manuscript versions without a lineage report.
- Do not assume `documents` table is canonical just because it exists.
- Do not assume `paragraphs` are clean canonical manuscript truth without checking chapter family.
- Do not move large directories without a dependency scan.
- Do not run `npm audit fix --force` unless explicitly approved.
- Do not expose secrets.
- Do not print Supabase service-role keys, database passwords, or API keys.
- Do not commit secrets.
- Do not rely on memory when the repo can be inspected.

---

## 6. Current Known System State

The system has a Next.js application with API routes and Supabase-backed manuscript data.

Known database facts from current investigation:

- `public.documents` exists but had 0 rows.
- `public.chapters` exists and had 50 rows.
- `public.paragraphs` exists and had about 4,112 rows.
- `public.biblical_references` exists and had 0 rows.
- `public.hyperlinks` exists and had 0 rows.

Known issue:

The app can render chapter/paragaph content, but some UI panels can be empty because derived/index tables are empty. The paragraphs contain JSON enrichment fields such as:

- `archetypal_weights`
- `dualism_map`
- `hebrew_spans`
- `metadata`

The derived tables need safe backfill or ingestion repair before biblical/hyperlink panels can show full content.

The database also appears to contain duplicate chapter families:

- `Chapter_*`
- hash-like manifest IDs
- `man_*`

The agent must not delete or collapse any family until it proves lineage and identifies canonical render path.

---

## 7. Data Lineage Requirements

When asked to fix UI, database, or manuscript behavior, first answer these questions:

1. Which API route feeds the UI?
2. Which table or file does that route read?
3. Which component renders the data?
4. Which fields does the component expect?
5. Are those fields present?
6. Are the relevant tables populated?
7. If multiple versions exist, which one is actually rendered?
8. Is the problem missing data, wrong query, wrong component mapping, or stale source?

Useful files/routes to inspect:

- `src/app/api/chapters/route.ts`
- `src/app/api/manuscript/route.ts`
- `src/app/api/biblical-references/route.ts`
- `src/app/api/graph/route.ts`
- `src/app/api/search/route.ts`
- `src/components/layers/canvas/ManuscriptCore.tsx`
- `src/components/layers/panel/BiblicalReferencesDirectory.tsx`
- `src/components/layers/panel/HyperlinksGraph.tsx`
- `src/components/layers/panel/ArchetypesDirectory.tsx`
- `src/services/ingestion/pipeline.ts`
- `src/services/memory-engine/vector-store.ts`
- `supabase/migrations`

---

## 8. UI/UX Preservation Mandate

The user cares deeply about UI/UX. Preserve every useful UI/UX note unless contradicted by current implementation or by stronger design logic.

The agent should preserve:

- layered manuscript interface ideas
- narrative canvas behavior
- front matter/table of contents behavior
- archetype panels
- biblical reference panels
- hyperlink graph behavior
- manuscript reading flow
- strong visual hierarchy
- elegant typography
- emotionally weighted interface design
- runtime state awareness
- source/document lineage UI
- debugging and ingestion visibility
- user ability to inspect where text came from
- agent-readable context surfaces
- “do not hide the system state” design philosophy

When UI/UX sources conflict, use a fork method:

1. Identify each competing design branch.
2. Preserve each branch in notes or report.
3. Compare it against current code.
4. Choose the branch that best supports current app function, readability, maintainability, and high-fidelity writing workflow.
5. Do not destroy the rejected branch; mark it as superseded or optional.

The agent should choose the UI/UX option that produces the best current product, not merely the newest note or loudest prompt.

---

## 9. Contradiction Handling

Contradictions are expected. Do not panic. Do not erase them.

When documents conflict:

- quote or summarize the conflict in a report
- name the files involved
- identify the current code reality
- identify the current database reality if relevant
- mark one option as “active recommendation”
- mark other options as “preserved alternate”
- explain why the chosen fork is safer or more useful

Use this language in reports:

- `CURRENT_REALITY`
- `HISTORICAL_CONTEXT`
- `DESIRED_TARGET`
- `CONFLICT`
- `ACTIVE_FORK`
- `PRESERVED_ALTERNATE`
- `REQUIRES_USER_DECISION`

---

## 10. Source Context Parsing Strategy

When parsing staged documents, do not load everything blindly into one giant prompt.

Recommended approach:

1. Read file list and manifest first.
2. Classify files into categories.
3. Read smaller high-priority files first.
4. For large files, sample beginning, end, and structured internal sections.
5. Build an index before summarizing.
6. Compare claims against repo tree.
7. Create a report of useful current instructions.
8. Only then modify code.

Suggested categories:

- current project bootstrap
- UI/UX mandate
- database/Supabase truth
- ingestion pipeline notes
- manuscript/canon content
- contradiction/incoherence audit
- recovery logs
- old generated dumps
- prompts/guides
- large lore or singularity files
- deferred large files

The large file in `later_queue` should be treated carefully. Do not full-parse it unless the task requires it. For later coherent-prose work, sample it systematically and record offsets.

---

## 11. Ingestion and Database Rules

When creating ingestion scripts:

- keep source files unchanged
- write derived files into a derived output folder
- include source path, hash, byte count, and timestamp
- keep a manifest
- preserve original filenames
- normalize only in derived data
- never erase old source versions
- make scripts rerunnable
- avoid duplicate inserts
- print counts before and after
- report unmatched records

When writing to Supabase:

- use existing schema unless a migration is justified
- avoid destructive SQL
- prefer `where not exists` when no unique constraints exist
- do not create migrations without explaining why
- inspect RLS and policies before frontend access changes
- never expose service role keys
- never put secrets in committed files
- use `DATABASE_URL` from secret/env only
- test with `select now();` before data operations

For the derived panels:

- `paragraphs.archetypal_weights` can support archetype UI.
- `paragraphs.dualism_map` can support graph/hyperlink derivation.
- `paragraphs.hebrew_spans` and content regex may support biblical/named reference extraction.
- `biblical_references` and `hyperlinks` should be populated idempotently.

---

## 12. File Movement and Copying Rules

The staged read context exists at:

`src/data-layer/ingestion-buffer/readme_docs/`

This is the active CLI-readable project context.

Do not rename these staged files unless creating an additional index. The numeric prefixes are intentional because they preserve the original hand-picked list.

Allowed:

- copy files into source context
- create manifests
- create derived summaries
- create searchable indexes
- create reports
- create embeddings or JSONL outputs
- create database backfill scripts

Not allowed without explicit user approval:

- moving original files out of `/sdcard/Download`
- deleting source files
- deleting `gdrive_raw`
- deleting staged read context
- deleting duplicate chapters from Supabase
- deleting large lore files
- overwriting source context with summaries

---

## 13. Code Change Rules

Before code changes:

1. Run `git status --short`.
2. Inspect relevant files.
3. Identify the specific bug or feature.
4. Make the smallest coherent change.
5. Run a targeted test or at least a build/typecheck if feasible.
6. Show changed files.

Prefer:

- clear API routes
- typed data shapes
- small utilities
- readable components
- explicit loading/error states
- traceable data flow
- simple SQL
- reports over guesses

Avoid:

- rewriting unrelated UI
- adding heavy dependencies without need
- changing app architecture mid-debug
- swallowing errors silently
- inventing data fields not present in schema
- assuming one chapter family is canonical without proof

---

## 14. UI/UX Implementation Guidance

Mostly do these:

- Make panels tell the user why they are empty.
- Show counts where useful.
- Show source lineage when possible.
- Keep manuscript reading central.
- Keep analysis panels secondary but accessible.
- Keep graph/reference/archetype panels tied to actual paragraph IDs.
- Use progressive disclosure for dense metadata.
- Preserve the aesthetic mandate while keeping functionality inspectable.
- Prefer legible typography over decorative noise.
- Preserve emotional tone without sacrificing usability.
- Make failed data states visible.
- Let the user distinguish “no data exists” from “data failed to load.”
- Make ingestion status visible in admin/debug surfaces.
- Keep layout resilient for mobile/Termux/iPhone workflows where relevant.

Avoid:

- beautiful empty panels with no explanation
- hiding database failure
- hiding source lineage
- hardcoding fake references
- pretending derived tables are populated
- making graph UI depend on unavailable data without fallback
- replacing manuscript content with summaries
- losing paragraph identity
- losing chapter identity

---

## 15. Reports the Agent Should Create

When doing serious work, write reports into `reports/`.

Useful report names:

- `reports/data-lineage-final.md`
- `reports/ui-panel-data-map.md`
- `reports/supabase-derived-table-backfill.md`
- `reports/readme_docs_context_digest.md`
- `reports/contradiction-resolution.md`
- `reports/source-file-classification.md`
- `reports/chapter-family-lineage.md`
- `reports/current-tree-vs-context.md`

Reports should include:

- what was inspected
- what was found
- what is current
- what is stale
- what conflicts
- what action was taken
- what remains uncertain

---

## 16. Testing and Verification

Use the tests/tools available in the repo. If unknown, inspect `package.json`.

Common commands may include:

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm test`
- targeted script execution

Do not invent success. If a command is not available or fails, report it.

For database:

- verify connection before queries
- use count queries before and after
- sample rows after inserts
- avoid destructive operations

For UI:

- verify API route output
- verify component expected shape
- verify empty states
- verify console errors if available

---

## 17. Handling Google Docs / DOCX / XML Recovery

The project may need high-fidelity Google Docs or DOCX recovery.

Important distinctions:

- Supabase paragraphs currently contain cleaned prose and JSON analysis, not original compressed DOCX XML.
- DOCX files are ZIP packages with OOXML parts.
- Google Docs API exposes document structure, suggestions modes, styles, comments, and revision IDs where available.
- Google Drive revision APIs may not expose every historical keystroke or every editor-visible revision.

The agent should be honest about what can and cannot be recovered.

Do:

- export current DOCX packages when authorized
- extract all OOXML parts from DOCX packages
- preserve raw exported files
- preserve Docs API JSON
- preserve comments and revision metadata where available
- hash files
- write manifests

Do not:

- claim Google exposes every keystroke if it does not
- wipe Google Drive
- overwrite local source documents
- treat recovered current DOCX as complete historical truth
- lose local filenames

---

## 18. Recommended First Actions for Any New Agent

When a new AI agent opens this repo, it should run or mentally perform:

1. Read `AGENTS.md`.
2. Read `AGENT_READ_CONTEXT_INDEX.md`.
3. Run `git status --short`.
4. Inspect `package.json`.
5. Inspect `src/app/api/chapters/route.ts`.
6. Inspect `src/app/api/manuscript/route.ts`.
7. Inspect UI panel components.
8. Inspect Supabase migrations.
9. Inspect `reports/` for existing truth reports.
10. Inspect staged read context only as needed.
11. Create a task-specific plan.
12. Ask before destructive operations.

---

## 19. User Intent Summary

The user wants a powerful writing-agent system that can:

- read and reason over manuscript drafts
- preserve version history and source context
- maintain strong UI/UX
- render manuscript content cleanly
- expose biblical references, hyperlinks, archetypes, dualisms, metadata, and graph intelligence
- recover source documents and compressed document structure where possible
- keep CLI agents aware of project context
- avoid losing files
- avoid stale assumptions
- compare current code against old documents
- fork contradictory requirements intelligently
- preserve every useful UI/UX idea unless contradicted
- choose the best current implementation path

The user does not want:

- deletion
- careless moving
- fake certainty
- empty panels pretending to work
- stale documents blindly applied
- source files overwritten
- secrets exposed
- Google Drive wiped
- database rows destroyed
- agents that ignore current code structure

---

## 20. Final Agent Rule

Be smart, but prove it.

The correct behavior is not to follow this file blindly. The correct behavior is to use this file as orientation, inspect the current repository, inspect the current schema, inspect the current staged context, and then make the smallest safe change that moves the system toward a better writing-agent interface.

When uncertain, preserve data, write a report, and choose the reversible path.
