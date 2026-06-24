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
