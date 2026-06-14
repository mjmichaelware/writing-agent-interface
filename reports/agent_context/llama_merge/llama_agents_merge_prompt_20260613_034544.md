# LLAMA TASK: MERGE AGENT CONTEXT INTO PERFECT PROJECT AGENTS.md

You are operating inside the Writing Agent Interface project.

Project root:
`~/Workspaces/writing-agent-interface`

Primary goal:
Create one verbose, extensive, precise, non-contradictory, production-grade AGENTS.md that tells every CLI/coding agent exactly how to understand this project without wasting context.

Hard rules:
- Do not delete anything.
- Do not move anything.
- Do not invent paths.
- Use the paths shown below as canonical.
- Merge AGENTS.md, docs/agent_context/indexes/AGENTS_README.md, docs/agent_context/indexes/AGENT_READ_CONTEXT_INDEX.md, and the canonical staged context index.
- Explain that agents should read the index first, then selectively read tiered documents.
- Explain that the staged context files are active project memory, not trash.
- Explain that ~/context_files was only the old home-level holding area and is not the project source of truth.
- Explain that dumps/reports are legacy forensic memory and should not be removed until a separate archive pass verifies references.
- Make this useful for Gemini CLI, Claude Code, Codex, Llama/Ollama, and any future CLI agent.
- Be explicit about context economy: read index first, then only relevant tier files; do not repeatedly reread all giant files unless doing full reconstruction.
- Preserve exact canonical paths.

Canonical project path:
`~/Workspaces/writing-agent-interface`

Canonical agent context index:
`data/runtime_sources/weight_of_the_sky/11_agent_context/AGENT_CONTEXT_CANONICAL_INDEX.md`

Canonical staged context root:
`data/runtime_sources/weight_of_the_sky/11_agent_context/staged_read_context/`

Important imported selected context tiers:
- Tier 1: `data/runtime_sources/weight_of_the_sky/11_agent_context/staged_read_context/tier_1_core/`
- Tier 2: `data/runtime_sources/weight_of_the_sky/11_agent_context/staged_read_context/tier_2_large_universal/`
- Tier 3: `data/runtime_sources/weight_of_the_sky/11_agent_context/staged_read_context/tier_3_checkpoints/`

Required output:
Return ONLY the final proposed AGENTS.md content. No commentary before or after.

--- CURRENT AGENTS.md ---
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
- `docs/agent_context/indexes/AGENT_READ_CONTEXT_INDEX.md`
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

`docs/agent_context/indexes/AGENT_READ_CONTEXT_INDEX.md`

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

--- CURRENT docs/agent_context/indexes/AGENTS_README.md ---
# Agent README

The primary instruction file is `AGENTS.md`.

Read it before editing this repo.

Also read:

- `docs/agent_context/indexes/AGENT_READ_CONTEXT_INDEX.md`
- `src/data-layer/ingestion-buffer/readme_docs/`
- `reports/`

Do not delete source context files.

--- CURRENT docs/agent_context/indexes/AGENT_READ_CONTEXT_INDEX.md ---
# Agent Read Context Index

These files were copied from `/sdcard/Download` into active project ingestion/read context.
They are not archives. They are meant to be readable by CLIs and ingestion tools.

Root path:
`src/data-layer/ingestion-buffer/readme_docs/`

## Files

- `tier_1_core/013__Writing_Agent_App._Source_Doc._(4)_[TERMUX].txt.txt` — source item 013 — Writing Agent App. Source Doc. (4) [TERMUX].txt.txt
- `tier_1_core/016__229_(1).txt` — source item 016 — 229 (1).txt
- `tier_1_core/024__Aesthetic___Implementation_Mandate_(1).txt` — source item 024 — Aesthetic & Implementation Mandate (1).txt
- `tier_1_core/026__AI_CHECKPOINT_FINAL.txt` — source item 026 — AI_CHECKPOINT_FINAL.txt
- `tier_1_core/029__AI_INFORMATION_INTUITION.md` — source item 029 — AI_INFORMATION_INTUITION.md
- `tier_1_core/031__AI_READY_CHECKPOINT.txt` — source item 031 — AI_READY_CHECKPOINT.txt
- `tier_1_core/034__AIM_BLUEPRINT.txt` — source item 034 — AIM BLUEPRINT.txt
- `tier_1_core/071__CLAUDE_HONEST_ASSESSMENT_20260513.md` — source item 071 — CLAUDE_HONEST_ASSESSMENT_20260513.md
- `tier_1_core/072__CLAUDE_HONEST_ASSESSMENT_v2_20260513.md` — source item 072 — CLAUDE_HONEST_ASSESSMENT_v2_20260513.md
- `tier_1_core/075__COMPARISON.txt` — source item 075 — COMPARISON.txt
- `tier_1_core/095__gdrive_raw_FULL_inventory.txt` — source item 095 — gdrive_raw_FULL_inventory.txt
- `tier_1_core/097__GEMINI_CLI_PENULTIMATE_OMEGA_PROMPT.txt` — source item 097 — GEMINI CLI PENULTIMATE OMEGA PROMPT.txt
- `tier_1_core/089__First_Future_Feature.txt` — source item 089 — First Future Feature.txt
- `tier_1_core/107__Here_is_the_absolute_technical,_structural,_and_behavioral_inventory_of_every_single_element_that_must_exist_within_your_4-layer_UI-UX_narrative_runtime_environment.txt` — source item 107 — Here is the absolute technical, structural, and behavioral inventory of every single element that must exist within your 4-layer UI-UX narrative runtime environment.txt
- `tier_1_core/111__IMPOSSIBLE_TARGETS.txt` — source item 111 — IMPOSSIBLE_TARGETS.txt
- `tier_1_core/160__PROJECT_HANDOFF_COMPLETE_CONTEXT-2.md` — source item 160 — PROJECT_HANDOFF_COMPLETE_CONTEXT-2.md
- `tier_1_core/014__Writing_Agent_App._Source_Doc._(8)_[COMBINED]_(1).txt` — source item 014 — Writing Agent App. Source Doc. (8) [COMBINED] (1).txt
- `tier_2_large_universal/077__CONTRADICTION_MAP.txt` — source item 077 — CONTRADICTION_MAP.txt
- `tier_2_large_universal/084__DRIVE_NOT_LOCAL_RAW.txt` — source item 084 — DRIVE_NOT_LOCAL_RAW.txt
- `tier_2_large_universal/097__GEMINI_CLI_PENULTIMATE_OMEGA_PROMPT.txt` — source item 097 — GEMINI CLI PENULTIMATE OMEGA PROMPT.txt
- `tier_2_large_universal/104__Give_me_the_terminal_commands_to_f------_get_that.pdf` — source item 104 — Give me the terminal commands to f------ get that.pdf
- `tier_2_large_universal/123__NEW_SEC_DOC_(1)_(1).txt` — source item 123 — NEW SEC DOC (1) (1).txt
- `tier_2_large_universal/124__NEW_SEC_DOC_(1)_(2).txt` — source item 124 — NEW SEC DOC (1) (2).txt
- `tier_2_large_universal/134__NOS_INTEGRATION_BLUEPRINT.txt` — source item 134 — NOS_INTEGRATION_BLUEPRINT.txt
- `tier_3_checkpoints/139__NOS_Master_Blueprints.txt` — source item 139 — NOS_Master_Blueprints.txt
- `tier_3_checkpoints/140__NOS_Master_Diagnostic.txt` — source item 140 — NOS_Master_Diagnostic.txt
- `tier_3_checkpoints/154__Project_Checkpoint_2.txt` — source item 154 — Project Checkpoint 2.txt
- `tier_3_checkpoints/199__Termux_Checkpoint_(w-_Gemini_1_(1).txt` — source item 199 — Termux Checkpoint (w- Gemini 1 (1).txt
- `later_queue/174__REFINED_LORE_SINGULARITY.txt` — source item 174 — REFINED_LORE_SINGULARITY.txt

--- CANONICAL AGENT CONTEXT INDEX ---

--- CURRENT PROJECT TREE SNAPSHOT ---
.
├── AGENTS.md
├── docs/agent_context/indexes/AGENTS_README.md
├── docs/agent_context/indexes/AGENT_READ_CONTEXT_INDEX.md
├── Build
├── GEMINI.md
├── NOS_Core_Engine_Discovery_Dump.txt
├── NOS_Critical_Files_Dump.txt
├── NOS_Layout_Search_Discovery_Dump.txt
├── NOS_Panel_Runtime_EMA_Dump.txt
├── NOS_Remaining_23_Matrix_Dump.txt
├── NOS_Responsive_Style_Config_Dump.txt
├── NOS_Runtime_Discovery_Dump.txt
├── README.md
├── docs/agent_context/source_drop/legacy_root_directives/ULTIMATE_OMEGA_DIRECTIVE.md
├── build.log
├── build_debug.txt
├── data
│   ├── runtime_sources
│   │   └── weight_of_the_sky
│   └── source_archive
│       ├── full_fidelity_google_drive
│       └── name_matched_google_docs
├── docs
│   └── ai-context
│       ├── CONTEXT_PRIORITY.md
│       ├── CURRENT_PROJECT_STATE.md
│       └── DO_NOT_USE_OLD_FILES_BLINDLY.md
├── eslint.config.js
├── export_audit.txt
├── export_blueprints.sh
├── full_codebase_dump.txt
├── import_audit.txt
├── next-env.d.ts
├── next.config.js
├── docs/forensics/nos/nos_manifest.json
├── package-lock.json
├── package.json
├── parse-by-meaning.js.draft
├── postcss.config.js
├── public
│   ├── assets
│   │   ├── bg.png
│   │   ├── boy-and-moon.png
│   │   ├── flies.jpg
│   │   ├── megiddo1.jpg
│   │   └── megiddo2.jpg
│   └── data
│       └── chapters
├── reports
│   ├── agent_context
│   │   └── llama_merge
│   ├── api-route-source-report.txt
│   ├── app-data-source-report.txt
│   ├── chapter-source-references.txt
│   ├── context_import_check
│   │   └── selected_context_import_check.txt
│   ├── data-lineage-audit.txt
│   ├── db-lineage-report.txt
│   ├── derived-panel-references.txt
│   ├── filename_standardization
│   ├── gdrive_ooxml_raw_files.txt
│   ├── ingestion-hash-references.txt
│   ├── json-payload-shapes.txt
│   ├── local-docx-xml-files.txt
│   ├── name-matched-google-docs-archive-latest.json
│   ├── perfect_weight
│   │   ├── 01_file_manifest.tsv
│   │   ├── 01_repo_inventory.md
│   │   ├── 02_context_classification.json
│   │   ├── 02_context_classification.md
│   │   ├── 03_code_data_map.md
│   │   ├── 04_uiux_extract.md
│   │   ├── 05_contradiction_fork_map.md
│   │   ├── 06_supabase_snapshot.md
│   │   ├── 07_panel_truth_audit.md
│   │   ├── 08_next_100_actions.md
│   │   └── 09_WEIGHT_OF_THE_SKY_PERFECTION_README.md
│   ├── readme_docs_missing.json
│   ├── readme_docs_stage_manifest.json
│   ├── readme_docs_staged_files.txt
│   ├── runtime_sources
│   │   ├── active_runtime_source_counts.json
│   │   ├── active_runtime_source_manifest.json
│   │   ├── active_runtime_source_registry.json
│   │   ├── active_runtime_source_registry.md
│   │   ├── build_after_runtime_sources.log
│   │   ├── clean_runtime_import_audit.md
│   │   ├── code_only_runtime_path_audit.md
│   │   ├── document_mentions_legacy_paths_audit.md
│   │   ├── manual_sort_suggestions.json
│   │   ├── manual_sort_suggestions.md
│   │   ├── not_archive_policy.md
│   │   ├── renderer_document_read_report.json
│   │   ├── renderer_document_read_report.md
│   │   ├── runtime_import_path_audit.md
│   │   ├── runtime_source_cutover_status.md
│   │   ├── runtime_source_decoupling_decision.md
│   │   ├── strict_code_runtime_path_audit.json
│   │   └── strict_code_runtime_path_audit.md
│   └── xml_recovery
│       ├── google_archiver_user_oauth_run.log
│       ├── google_export_run.log
│       ├── google_xml_extraction_audit.md
│       ├── materialize_after_user_oauth_run.log
│       ├── materialize_ooxml_run.log
│       ├── materialized_ooxml_manifest.json
│       ├── share_google_docs_with_service_account.md
│       └── source_xml_supabase_schema_proposal.sql
├── run_nos_diagnostics.sh
├── scripts
│   ├── archive-google-docs-by-local-names.mjs
│   ├── archive-google-docs-by-local-names.mjs.bak.20260612_223804
│   ├── build_files.sh
│   ├── data-lineage-audit.sh
│   ├── extract_deep_history.py
│   ├── filename_standardization
│   │   └── standardize_context_filenames.py
│   ├── nos_audit.sh
│   ├── nos_invoke.sh
│   ├── nos_sync.sh
│   ├── perfect_weight
│   │   ├── 00_generate_perfection_scripts.py
│   │   ├── 01_inventory.sh
│   │   ├── 02_context_classifier.py
│   │   ├── 03_code_data_map.sh
│   │   ├── 04_uiux_extract.py
│   │   ├── 05_contradiction_fork_map.py
│   │   ├── 06_supabase_snapshot.sh
│   │   ├── 07_panel_truth_audit.py
│   │   ├── 08_next_100_actions.py
│   │   ├── 09_master_readme_builder.py
│   │   └── 10_runner.sh
│   ├── runtime_sources
│   │   ├── audit_runtime_import_paths.sh
│   │   ├── classify_runtime_documents_for_manual_sort.py
│   │   ├── clean_runtime_import_audit.sh
│   │   ├── code_only_runtime_path_audit.sh
│   │   ├── create_active_runtime_source_layout.py
│   │   ├── read_renderer_documents.py
│   │   ├── strict_code_runtime_path_audit.py
│   │   ├── write_runtime_source_constants.py
│   │   └── write_runtime_source_registry.py
│   ├── stage-numbered-download-readme-docs.py
│   └── xml_recovery
│       ├── audit_google_xml_extraction.sh
│       └── materialize_ooxml_raw.py
├── secrets
│   └── wos-drive-docs-reader.json
├── src
│   ├── actions
│   │   ├── ingest.action.ts
│   │   ├── retrieve.action.ts
│   │   ├── update-memory.action.ts
│   │   └── write.action.ts
│   ├── app
│   │   ├── analyze
│   │   ├── api
│   │   ├── characters
│   │   ├── dashboard
│   │   ├── globals.css
│   │   ├── globals.css.bak
│   │   ├── graph
│   │   ├── head.tsx
│   │   ├── layout.tsx
│   │   ├── layout.tsx.bak
│   │   ├── loading.tsx
│   │   ├── memory
│   │   ├── page.tsx
│   │   ├── page.tsx.bak
│   │   ├── search
│   │   └── timeline
│   ├── components
│   │   ├── ReaderLayout.tsx
│   │   ├── RuntimeInitializer.tsx
│   │   ├── layers
│   │   └── ui
│   ├── context
│   │   ├── NarrativeContext.tsx
│   │   └── SidebarContext.tsx
│   ├── core
│   │   ├── IMemoryEngine.ts
│   │   ├── INarrativeGraphEngine.ts
│   │   ├── IRetrievalEngine.ts
│   │   ├── IWritingAgent.ts
│   │   ├── document-types.ts
│   │   ├── engine-constants.ts
│   │   ├── narrative-types.ts
│   │   ├── runtimeEngine.ts
│   │   ├── system-utils.ts
│   │   └── types.ts
│   ├── data
│   │   ├── canon
│   │   ├── chapter7-raw.txt
│   │   └── cinema.ts
│   ├── data-layer
│   │   ├── 07_Build_Manifests
│   │   ├── aggregation-engine
│   │   ├── disposal-bin
│   │   ├── entities
│   │   ├── ingestion-buffer
│   │   ├── initialization-metadata
│   │   ├── logic-governance
│   │   ├── reference-data
│   │   ├── singularity
│   │   ├── static-assets
│   │   └── version-archive
│   ├── hooks
│   │   ├── useAgent.ts
│   │   ├── useChapterLoader.ts
│   │   ├── useChapterRoute.ts
│   │   ├── useGraph.ts
│   │   ├── useListenerBus.ts
│   │   ├── useMemory.ts
│   │   ├── useRetrieval.ts
│   │   ├── useScrollFocus.ts
│   │   └── useScrollTracker.ts
│   ├── lib
│   │   ├── db.ts
│   │   ├── narrative
│   │   ├── runtime-source-paths.ts
│   │   └── runtime-source-reader.ts
│   ├── runtime
│   │   ├── controlPanel.ts
│   │   ├── listeners
│   │   ├── readerControls.ts
│   │   └── runtimeContext.tsx
│   ├── services
│   │   ├── analytics-engine
│   │   ├── bridge
│   │   ├── document-analyzer
│   │   ├── image-engine
│   │   ├── ingestion
│   │   ├── memory-engine
│   │   ├── narrative-graph-engine
│   │   ├── orchestration-engine
│   │   ├── tokenize.ts
│   │   └── writing-agent
│   ├── store
│   │   ├── app.store.ts
│   │   ├── graph.store.ts
│   │   ├── memory.store.ts
│   │   └── session.store.ts
│   ├── styles
│   │   ├── animations.css
│   │   ├── components.css
│   │   ├── tokens.css
│   │   └── typography.css
│   └── utils
│       ├── smoothScroll.ts
│       └── tokenize.ts
├── supabase
│   └── migrations
│       ├── 20260521000000_initial_schema.sql
│       ├── 20260521000001_vector_search.sql
│       ├── 20260521000002_seed_chapters.sql
│       └── 20260602000000_phase1_sync.sql
├── system
│   ├── 07_Build_Manifests
│   │   └── session_logs
│   ├── resource-manager
│   │   ├── active_dualisms.json
│   │   └── manifest.json
│   └── runtime
│       └── active_state.json
├── system_logic_audit.txt
├── tailwind.config.ts
├── test-db.js
├── tsc.log
├── tsconfig.json
├── tsconfig.tsbuildinfo
├── ui_ux_dump.txt
└── vercel.json

82 directories, 191 files
