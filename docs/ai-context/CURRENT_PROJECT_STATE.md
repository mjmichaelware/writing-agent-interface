# Current Project State

This is a Next.js 16 App Router project.

Build command on Android/Termux:
npx next build --webpack

Deployment:
npx vercel --prod

Current architecture:
- src/app/page.tsx renders ReaderLayout, Layer2Cinema, Layer3Canvas, Layer4Panel
- src/app/api/chapters/route.ts is the active manuscript loader
- src/data-layer/ingestion-buffer is the intended raw source path
- src/core/runtimeEngine.ts is the EventBus
- src/runtime/listeners should close the loop from scroll/runtime state back into visible UI
- Layer3Canvas must not cover Layer2Cinema with opaque background
- Layer4Panel must stay top overlay
