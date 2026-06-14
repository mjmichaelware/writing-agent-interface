# Context Priority Rules

The current repository is the source of truth.

Priority order:
1. Current files in src/
2. Current package.json, next.config.js, tsconfig.json
3. Current deployed/build behavior
4. Recent diagnostics after May 17
5. Architecture docs only when they match current code
6. Old dumps, old AI replies, old PDFs, and old source-doc exports are historical reference only

Never blindly apply older code from Downloads.
Always compare old documents against the current repo before generating code.
If a document conflicts with current imports/exports, current repo wins unless explicitly instructed.
