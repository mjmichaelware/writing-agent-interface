# Coding Agent Rules for writing-agent-interface

You are working inside the real repository. Inspect files before code.

Hard rules:
- Current repo is source of truth.
- Do not invent imports, exports, props, event names, routes, or database columns.
- Do not paste old code from Downloads unless it matches the current repo.
- Do not hardcode fake manuscript, references, archetypes, or graph data.
- Preserve ingestion-buffer/API/runtime/layer architecture.
- If replacing a file, provide the full corrected file.
- Build before commit.
- Android build command: npx next build --webpack
- Deploy command: npx vercel --prod

Layer rules:
- Layer1Void: base atmosphere
- Layer2Cinema: visual layer behind manuscript
- Layer3Canvas: transparent manuscript layer above cinema
- Layer4Panel: top drawer/control layer

Debug priorities:
1. import/export correctness
2. prop signature congruence
3. API payload contracts
4. EventBus event type consistency
5. z-index and background transparency
6. runtime listeners actually causing visible UI state changes

See GEMINI.md "STANDING AUTHORIZATION" section for the pre-approved
command list. Apply it every session.
