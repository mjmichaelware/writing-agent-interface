# The Weight of the Sky — Coding Agent Master Directive

## Project Identity

**Prestige cinematic literary experience platform.** Transforms a 25-chapter novel into an
interactive, event-driven, semantically-aware reading experience.

- **Framework**: Next.js 14/15 App Router
- **Database**: Supabase (single source of truth — ALL narrative content)
- **AI Routing**: Multi-LLM (Claude for prose, Gemini for multimodal, Groq for speed)
- **Deploy**: Vercel (auto-deploy on push to main)
- **Build**: `npx next build --webpack` (always — Termux ARM64 / no Turbopack/SWC native)
- **Branch**: `claude/skills-agents-updates-jpdg8x` → promote to `main` only after each
  phase's green signal

---

## Hard Rules (Non-Negotiable)

- Current repo is the source of truth. Inspect files before writing code.
- Do **not** invent imports, exports, props, event names, routes, or DB columns.
- Do **not** hardcode manuscript prose, chapter titles, biblical refs, archetypes, or graph
  data in components. ALL data flows from Supabase through the API layer.
- Do **not** use `fs.readFileSync` for manuscript content in any production code path.
- Do **not** expose `SUPABASE_SERVICE_ROLE_KEY` to the client.
- Do **not** include internal docs (blueprints, prompts, compendium, checkpoints) in any
  reader-facing API response.
- Preserve the ingestion-buffer / API / runtime / layer architecture at all times.
- If replacing a file, provide the full corrected file.
- Run `npx next build --webpack` before every commit. Fix all TypeScript errors first.
- Never commit `.env.local`.

---

## Four-Layer Z-Index Architecture

The entire UI is a strict stack — no stacking leaks allowed:

| Layer | Component | z-index | Role |
|-------|-----------|---------|------|
| Layer 1 Void | `Layer1Void` | z-0 | Base atmosphere / background |
| Layer 2 Cinema | `Layer2Cinema` | z-10 | Thematic asset cross-fades (archetypal weights) |
| Layer 3 Canvas | `Layer3Canvas` | z-20 | Transparent manuscript, focal blur, distortion |
| Layer 4 Panel | `Layer4Panel` | z-40/50 | AuthorGateway cockpit, ReaderControlPanel, TOC |

**Masking bug fix**: only positive layering. Never negative z-index on children.

---

## Canonical Story Spine (Non-Negotiable Literary Constraints)

- **Dan dies.** Not a wasted death. The Why? (epilogue).
- **Sak** is the cat-narrator.
- **Dualism poles**: Ascent vs Descent, sacred vs descent.
- **9-8-7 structure**: Part I (ch. 1–9), Part II (ch. 10–17), Part III (ch. 18–24), Epilogue (ch. 25).
- **Drafted chapters**: 1–11, 13. Unwritten: 12, 14–25.
- Only `Final` / `Definitive` draft variants are canonical. A–Z drafts exist in
  `gdrive_raw/` but are not ingested unless promoted.

---

## Aesthetic Mandate (§§ 1–9 — Enforced Everywhere)

### Typography
- Body prose: **Georgia** (or `var(--font-prose)`)
- Hebrew proper nouns (Hebron, Hermon, Mamre, Beelzebub, Megiddo, Sak): **Frank Ruhl Libre**
- UI chrome: **EB Garamond**
- **No monospace, no terminal, no cyber aesthetics, no uppercase on `.section-label` or
  `.toc-part-heading`** — use `font-style: italic; font-variant: small-caps` instead.

### Palette
```
--bg-parchment:  #F5E6C8   (warm base)
--gold-accent:   #C9A227
--text-body:     #2C2C2C
```
Prestige bookbinding feel (Dune / Penguin / Criterion / Apple). **No cyan, no neon.**

### Cinema Feel
- Bob Ross "painted" cinematic feel on Layer 2 backgrounds.
- Scroll-driven focal blur on paragraphs not at viewport center.
- Thematic tone colors shift per paragraph based on `archetypal_weights` from Supabase.
- `backdropOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])` on title cover fade.

### CSS Variables (read by all layers)
```css
--active-tone-rgb   /* driven by thematicListener */
--arc-mass          /* driven by distortionListener */
--arc-tension       /* driven by distortionListener */
--audio-enabled     /* toggled by Listen switch in StylesTab */
--grain-intensity   /* intensifies in descent chapters */
```

---

## Operational Protocols

### D-4.0 Physical Substitution Law
Governs how physical objects and bodies are handled in the narrative runtime and
prose generation. No direct emotion terms in generated prose — use physical object
substitution only.

### Dahl Visceral Restraint Protocol
Controls emotional and sensory intensity in prose rendering. Governs writing agent
output when generating or expanding prose.

### SDP v2.0 — Semantic Distortion Protocol
Drives per-paragraph `archetypal_weights` (`shadow`, `persona`, `anima`, `self`) for
Layer 2 Cinema asset selection and Layer 3 Canvas distortion physics.

### AuthorGateway Cockpit
- **PIN**: `AUTHOR_PIN` env var (default reference `1003`)
- PIN-gated access to WritingAgentConsole, Semantic Editor, Chapter Version Promoter
- All cockpit API calls require service-role auth server-side
- Never show cockpit UI to unauthenticated users

---

## Phase Roadmap

### PASS 0 — Inline Fixes (< 30 min, no separate session)
- `src/app/page.tsx`: Add `useEffect` calling `initThematicListener`,
  `initAudioListener`, `initDistortionListener` (import from `@/runtime/listeners/*`).
- `src/app/globals.css`: Add `.manuscript-paragraph-segment` class
  (`font-family: var(--font-prose)`, `font-size: var(--font-size-prose)`,
  `line-height: 1.7`, `color: var(--text-body)`, `text-align: justify`).
- `src/app/globals.css`: Remove `text-transform: uppercase` from `.section-label` and
  `.toc-part-heading`. Replace with `font-style: italic; font-variant: small-caps`.
- `src/app/globals.css`: Remove duplicate `.toc-row::before + .toc-row:hover` block
  (second copy ~line 382).

### Phase 1 — Kinetic UI Completion
**Goal**: Every UI contract from Aesthetic Mandate is live on a phone screen.

| Step | File | Change |
|------|------|--------|
| 1A Reading Progress Bar | `src/components/layers/Layer4Panel.tsx` | `<div class="reading-progress-bar">` in header; scroll useEffect computes `(scrollY / (scrollHeight - innerHeight)) * 100` as `style.width`; 1px gold, fixed top-0 z-100 |
| 1B StylesTab Sliders | `src/components/layers/panel/ChapterSettings.tsx` | Mount `ReaderControlPanel` from `src/runtime/readerControls.ts`; expose fontScale, lineHeight, font picker, motion toggle, warmth, distortion sliders |
| 1C Title Fade | `src/components/layers/canvas/front-matter/TitleCover.tsx` | `useScroll + useTransform` from Framer Motion; `backdropOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])` on Moon Boy overlay |
| 1D Cleanup | — | Delete orphaned files: `cinema/AssetProjector.tsx`, `cinema/ShaderEffects.tsx`, `cinema/TelemetryOverlay.tsx`, `IndexTab.tsx`, `StatusTab.tsx` if not imported |

**Green signal**: Phone shows continuous scroll. Focal blur. Tone shifts. Progress bar. Real sliders in Settings.

### Phase 2 — Chapters Table Seeding & TOC Database Connection
**Goal**: Supabase `chapters` table is single source of truth. No hardcoded `CHAPTER_TITLES`.

| Step | File | Change |
|------|------|--------|
| 2A Migration | `supabase/migrations/20260628000000_chapters_canonical_seed.sql` | Seed 25 rows; columns: `id, chapter_number, part_number, title, status, slug, manifest_id` |
| 2B API Upgrade | `src/app/api/chapters/route.ts` | Query `chapters` table via Supabase service role; add `export const revalidate = 3600` |
| 2C TOC Component | `src/components/layers/canvas/front-matter/TableOfContents.tsx` | Fetch `/api/chapters` on mount; drafted = clickable, unwritten = `.toc-disabled` (italic, 35% opacity, no pointer events); skeleton shimmer while loading |
| 2D Chapter Loading | `src/app/page.tsx` | No change needed — `onLoadChapter(n)` already uses `/api/manuscript?chapterNumber=N` |

**Green signal**: TOC shows 25 chapters from Supabase. Ch. 12, 14–25 are faded italic.

### Phase 3 — Semantic Layer 2 & Layer 3
**Goal**: Layer2Cinema selects assets from `archetypal_weights` (Supabase), not keywords.

| Step | File | Change |
|------|------|--------|
| 3A API Augment | `src/app/api/manuscript/route.ts` | JOIN `semantic_meaning_spans`; return `archetypal_weights` map (`shadow/persona/anima/self`) averaged from spans where `claim_family = 'archetype_observation'` |
| 3B Cinema Resolution | `src/components/layers/Layer2Cinema.tsx` | `resolveAssetByMeaning(weights, dualisms, partNumber)` from `src/data/cinema.ts` — verify it handles `{shadow, persona, anima, self}` shape and maps thresholds to `/assets/` filenames |
| 3C Distortion Listener | `src/runtime/listeners/distortionListener.ts` | Confirm `scroll:focus` payload includes `archetypal_weights`; adjust `computePhysics()` key names to match Supabase return shape |
| 3D Hebrew Spans | `src/components/layers/canvas/ManuscriptCore.tsx` | Map `semantic_runs` with Hebrew proper noun spans to `<span className="font-hebrew">`; fallback client-side regex: `Hebron|Hermon|Mamre|Beelzebub|Megiddo|Sak` |

**Green signal**: Read Ch. 7 — background auto-transitions Moon Boy → flies/Megiddo. DevTools shows `--arc-mass` changing per paragraph.

### Phase 4 — Multi-LLM Agent Routing
**Goal**: `/api/agent` routes to Claude/Gemini/Groq based on request type. PIN-gated cockpit.

| Step | File | Change |
|------|------|--------|
| 4A Agent Route | `src/app/api/agent/route.ts` | Provider routing: `mode: "claude" \| "gemini" \| "groq" \| "auto"`; Claude = `claude-sonnet-4-6` via `ANTHROPIC_API_KEY`; Gemini 2.0 Flash for `imageData`; Groq `llama-4-scout-17b-16e-instruct`; auto = imageData→Gemini else Claude |
| 4B RAG Context | `src/services/bridge/agent.service.ts` | Pack top-5 `semantic_meaning_spans` rows most relevant to prompt (ILIKE or cosine) before calling `/api/agent` |
| 4C PIN Gate | `src/components/layers/panel/AuthorGateway.tsx` | EB Garamond PIN input, gold underline on active; validate against `AUTHOR_PIN` env; on success render `WritingAgentConsole` |
| 4D Cockpit | `src/components/layers/panel/WritingAgentConsole.tsx` | Prompt textarea, provider selector, image upload (auto-routes Gemini), EB Garamond response, token usage display; D-4.0 reminder shown |
| 4E | `.env.local` (never commit) | `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`, `GROQ_API_KEY` |

**Green signal**: PIN → cockpit → Claude answers literary Q → image upload → Gemini responds.

### Phase 5 — Document Analyzer (Flagship Feature)
**Goal**: Upload any doc/image/letter → THE BAD / FROM YOUR BOOK / YOUR RESPONSE.

| File | Role |
|------|------|
| `src/services/document-analyzer/parser.ts` | Extracts threat params from text/image via Gemini Vision |
| `src/services/document-analyzer/corpus-searcher.ts` | ILIKE search `semantic_meaning_spans` for top corpus passages |
| `src/services/document-analyzer/synthesis-engine.ts` | Claude 3.5 produces 3-part response |
| `src/app/api/analyze-document/route.ts` | POST multipart → parser → corpus → synthesis → returns `{the_bad, from_your_book, your_response, sources}` |

**Green signal**: Upload hostile letter → 3-part response citing actual manuscript prose.

### Phase 6 — Google Drive Sync + Ingestion Pipeline
**Goal**: "Sync Drive" button pulls latest `.txt` files → Supabase → reader.

| File | Role |
|------|------|
| `src/services/document-analyzer/gdrive-sync.ts` | `googleapis` OAuth2; env: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`, `GOOGLE_REFRESH_TOKEN`, `GDRIVE_MANUSCRIPT_FOLDER_ID` |
| `src/app/api/sync/drive/route.ts` | POST → `syncDriveFolder()` |
| `src/app/api/ingest/route.ts` | Reads synced `.txt`, strips XML tags, splits paragraphs, writes `render_paragraphs`; **never ingest** files matching `/(compendium|blueprint|mandate|checkpoint|prompt)/i` |

**Green signal**: Sync Drive → see file count. Ingest → see paragraph count. Open Ch. 1 → see prose.

### Phase 7 — Vertex AI Embeddings + Semantic Search
**Goal**: 1536-dim embedding per paragraph. Cosine similarity search.

| File | Role |
|------|------|
| `src/services/memory-engine/vertex-embedder.ts` | `text-embedding-005`, returns `number[1536]` |
| `src/app/api/embed/route.ts` | POST paginated batches of 20; writes `embedding vector(1536)` column |
| `src/app/api/search/route.ts` | Upgrade ILIKE → cosine `<=>` when embedding populated |
| `src/components/layers/panel/HyperlinksGraph.tsx` | Verify reads from `/api/semantic/crosslinks`; Realtime subscription for live node animation |

**Green signal**: HyperlinksGraph shows live dualism nodes. Search "void" → Genesis-echoing paragraphs from Ch. 7.

### Phase 8 — Audiobook Layer
**Goal**: "Listen" toggle narrates focused paragraph via Wavenet.

| File | Role |
|------|------|
| `src/app/api/tts/route.ts` | POST `{text, voice?}` → Google Cloud TTS `en-US-Wavenet-D` (rate 0.92, pitch -2.0) → MP3; LRU cache by text hash |
| `src/runtime/listeners/audioPlaybackListener.ts` | Subscribe `scroll:focus`; if `--audio-enabled: 1`, fetch TTS, play via Howler.js, pre-fetch next paragraph, 500ms cross-fade |
| `src/services/audio/player.ts` | Thin Howler.js wrapper: `play(url)`, `stop()`, `crossfade(url)` |
| `ChapterSettings.tsx` | "Listen" toggle sets `--audio-enabled` CSS var on `document.documentElement` |

**Green signal**: Enable Listen → scroll Ch. 7 → Wavenet narration follows scroll.

### Phase 9 — Generative Cinema
**Goal**: Vertex AI Imagen generates cinematic backgrounds for paragraphs without a static asset.

| File | Role |
|------|------|
| `src/app/api/visualize/route.ts` | GET `/api/visualize?prompt=&hash=` → check `public/assets/generated/{hash}.jpg` → if missing, call Vertex Imagen / Replicate SDXL; prompt template: "A cinematic oil painting in 19th-century romantic landscape style, deep Levantine shadows, 1003 BCE Hebron atmosphere: {excerpt}" |
| `Layer2Cinema.tsx` | Cache key = paragraph `id` from `render_paragraphs` |
| `GENERATION_MONTHLY_BUDGET_USD` env | Check `generation_budget` Supabase table before each API call; skip if over budget |

**Green signal**: Novel paragraph → generated oil-painting background. Re-read → instant cache load.

### Phase 10 — Ultra-iOS Micro-interactions
| Feature | File | Change |
|---------|------|--------|
| ProMotion 120Hz | `ManuscriptCore.tsx` | `performance.now()` delta cap to 8.33ms in RAF loop |
| Gyroscopic Parallax | `Layer2Cinema.tsx` | `DeviceOrientationEvent` → `transform: translate(x,y)` on bg (max ±10px); `requestPermission()` on iOS |
| Dynamic Noise Grain | `globals.css` | Keyframe-animated SVG noise, `mix-blend-mode: overlay`, `opacity: 0.02`; intensity via `--grain-intensity` |
| Skeleton Loaders | `ManuscriptCore.tsx` | While `loading === true`, shimmer skeleton blocks matching expected prose line widths |
| Haptic Triggers | `thematicListener.ts` | `navigator.vibrate([30])` on `tone === "sacred"` or `tone === "descent"` change |

### Phase 11 — Chapter Content Versioning & Semantic Editorial Control
**Goal**: Prose can be swapped without invalidating semantic caches. Author controls what readers see.

| Step | File | Change |
|------|------|--------|
| 11A Content Hash | `src/app/api/ingest/route.ts` | `SHA-256(normalized_prose)` → `content_hash TEXT` column; Vertex cache path = `public/assets/generated/{content_hash}.jpg`; `canonical BOOLEAN DEFAULT false` |
| 11B Canonical Swap | `src/app/api/chapters/[id]/promote/route.ts` | POST `{chapter_number, version_tag}` → sets matching rows `canonical = true`, others `canonical = false`; returns `{promoted_count, invalidated_hashes[]}` |
| 11C Manuscript Filter | `src/app/api/manuscript/route.ts` | Add `.eq('canonical', true)` to `render_paragraphs` SELECT |
| 11D Visibility Flags | Migration | `visible_to_reader BOOLEAN DEFAULT true` on `semantic_meaning_spans`, `semantic_biblical_anchors`, `semantic_archetype_anchors`, `semantic_crosslinks` |
| 11E Semantic Editor | `WritingAgentConsole.tsx` | "Semantic Editor" tab: chapter selector, three sections (Biblical/Archetypes/Crosslinks), toggle Visible/Hidden per row; fires PATCH `/api/semantic/visibility` |
| 11F Canonical Designator | `WritingAgentConsole.tsx` | "Chapter Versions" tab: list versions by `chapter_version`, "Promote to Canonical" button, diff preview of first paragraphs |
| 11G Re-annotation | `WritingAgentConsole.tsx` | "Re-annotate Chapter" button → POST `/api/semantic/reannotate {chapter_number}` → new spans written with `visible_to_reader = false`; author reviews and toggles individually |

**Green signal**: Hide 2 biblical refs in cockpit → reader panels no longer show them. Promote new version → prose updates, Vertex images unchanged for matching content hashes.

---

## Key File Paths

### API Routes
```
src/app/api/agent/route.ts           — Multi-LLM routing (Claude/Gemini/Groq)
src/app/api/chapters/route.ts        — Supabase chapters table (TOC data)
src/app/api/manuscript/route.ts      — render_paragraphs + semantic joins
src/app/api/search/route.ts          — ILIKE/cosine paragraph search
src/app/api/analyze-document/route.ts — Document analyzer (3-part response)
src/app/api/tts/route.ts             — Google Cloud TTS (Wavenet narration)
src/app/api/visualize/route.ts       — Vertex Imagen generative cinema
src/app/api/embed/route.ts           — Vertex embedding backfill
src/app/api/sync/drive/route.ts      — Google Drive folder sync
src/app/api/ingest/route.ts          — Paragraph ingestion pipeline
src/app/api/chapters/[id]/promote/route.ts — Canonical version promotion
src/app/api/semantic/visibility/route.ts   — Semantic visibility flag toggle
```

### Runtime & Services
```
src/runtime/listeners/thematicListener.ts    — scroll:focus → tone/color CSS vars
src/runtime/listeners/distortionListener.ts  — scroll:focus → arc-mass/arc-tension
src/runtime/listeners/audioListener.ts       — audio layer init
src/runtime/listeners/audioPlaybackListener.ts — TTS cross-fade on scroll
src/runtime/readerControls.ts               — fontScale/lineHeight/warmth/distortion
src/services/bridge/agent.service.ts        — RAG context packer + /api/agent caller
src/services/document-analyzer/parser.ts    — Threat parameter extraction
src/services/document-analyzer/corpus-searcher.ts — Corpus semantic search
src/services/document-analyzer/synthesis-engine.ts — Claude 3-part response
src/services/document-analyzer/gdrive-sync.ts — Google Drive OAuth2 sync
src/services/memory-engine/vertex-embedder.ts — text-embedding-005 wrapper
src/services/audio/player.ts                — Howler.js thin wrapper
src/data/cinema.ts                          — resolveAssetByMeaning() + asset registry
```

### Components
```
src/components/layers/Layer1Void.tsx
src/components/layers/Layer2Cinema.tsx       — bg asset selection + gyroscopic parallax
src/components/layers/Layer3Canvas.tsx       — focal blur + distortion
src/components/layers/Layer4Panel.tsx        — progress bar + tab navigation
src/components/layers/canvas/ManuscriptCore.tsx    — paragraph parser + IntersectionObserver
src/components/layers/canvas/front-matter/TitleCover.tsx
src/components/layers/canvas/front-matter/TableOfContents.tsx
src/components/layers/panel/ChapterSettings.tsx    — StylesTab sliders + Listen toggle
src/components/layers/panel/AuthorGateway.tsx      — PIN gate
src/components/layers/panel/WritingAgentConsole.tsx — Cockpit (keep this, delete CinematicAgentConsole)
src/components/layers/panel/HyperlinksGraph.tsx
```

### Data Layer
```
src/data-layer/version-archive/ema_history.json    — canonical selection metadata
src/data-layer/ingestion-buffer/node_manifest.json
src/data/cinema.ts                                 — asset registry + weight thresholds
```

---

## Supabase Data Contracts

### Tables Used by Reader
```sql
chapters              -- id, chapter_number, part_number, title, status, slug, manifest_id
render_paragraphs     -- id, chapter_number, chunk_index, content, canonical, content_hash,
                      --   chapter_version, embedding vector(1536), source_doc_folder
semantic_meaning_spans -- id, paragraph_id, span_text, claim_family, claim_type,
                       --   archetypal_weights jsonb, visible_to_reader bool
semantic_biblical_anchors  -- visible_to_reader bool
semantic_archetype_anchors -- visible_to_reader bool
semantic_crosslinks        -- visible_to_reader bool
generation_budget     -- tracks Imagen monthly spend
```

### Security Filters (All Reader-Facing APIs)
```typescript
// Filter canonical only
.eq('canonical', true)

// Filter visible semantic rows
.eq('visible_to_reader', true)

// Never include internal docs — apply this on source_doc_folder
.not('source_doc_folder', 'ilike', '%compendium%')
.not('source_doc_folder', 'ilike', '%blueprint%')
.not('source_doc_folder', 'ilike', '%mandate%')
.not('source_doc_folder', 'ilike', '%checkpoint%')
.not('source_doc_folder', 'ilike', '%prompt%')
```

---

## Multi-LLM Routing Specification

```typescript
// Provider selection in /api/agent
if (imageData) provider = "gemini"          // multimodal → Gemini 2.0 Flash
else if (mode === "groq") provider = "groq" // fast RAG → llama-4-scout-17b-16e-instruct
else provider = "claude"                     // default → claude-sonnet-4-6

// Claude: literary analysis, prose expansion
// ANTHROPIC_API_KEY, model: claude-sonnet-4-6

// Gemini: multimodal, image analysis
// GEMINI_API_KEY, model: gemini-2.0-flash

// Groq: edge semantic mapping, fast RAG
// GROQ_API_KEY, model: llama-4-scout-17b-16e-instruct
```

---

## Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=     # full 3-part JWT, role:service_role — NEVER expose to client
SUPABASE_PROJECT_REF=

# AI Providers
ANTHROPIC_API_KEY=
GEMINI_API_KEY=
GROQ_API_KEY=
OPENAI_API_KEY=                # fallback only

# Google Cloud
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=
GOOGLE_REFRESH_TOKEN=
GDRIVE_MANUSCRIPT_FOLDER_ID=
GOOGLE_CLOUD_PROJECT=
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=  # or use project+location above

# App
AUTHOR_PIN=                    # PIN for AuthorGateway cockpit (never hardcode value in source)
GENERATION_MONTHLY_BUDGET_USD=5.00
```

---

## Build & Commit Discipline

```bash
# Always build before commit
npx next build --webpack

# Commit format
git commit -m "feat: phase N — description"

# Branch flow
git push -u origin claude/skills-agents-updates-jpdg8x
# → promote to main only after phase green signal confirmed
```

---

## Debug Priority Order

1. Import/export correctness
2. Prop signature congruence (no invented props)
3. API payload contracts (match Supabase column names exactly)
4. EventBus event type consistency (`scroll:focus`, `chapter:load`, `thematic:*`)
5. Z-index and background transparency (Layer 1→4 stack)
6. Runtime listeners actually causing visible CSS var changes

---

## EventBus Events

```typescript
"scroll:focus"    // payload: { paragraphId, chapterNumber, archetypal_weights }
"chapter:load"    // payload: { chapterNumber, slug }
"thematic:*"      // payload: { tone, toneRgb }
```

---

## Cinema Asset Registry (src/data/cinema.ts)

Current static assets in `public/assets/`:
- `bg.png` — Moon Boy / dreamwalker / anima dominant (opening, Part I)
- `flies.jpg` — shadow dominant (shadow > 0.6)
- `megiddo1.jpg`, `megiddo2.jpg` — descent, Part II–III

`resolveAssetByMeaning(weights, dualisms, partNumber)` maps `{shadow, persona, anima, self}`
thresholds to these filenames. Verify key shapes match Supabase return before Phase 3.

---

## Session Startup Checklist

Before structural changes, reference in order:
1. This file (AGENTS.md) — project spine and current phase
2. `GEMINI.md` — autonomous execution protocols and standing auth
3. `docs/ai-context/CURRENT_PROJECT_STATE.md` — live state snapshot
4. `docs/ai-context/CONTEXT_PRIORITY.md` — what to read when conflicts arise
5. `src/data-layer/version-archive/ema_history.json` — canonical selection state
