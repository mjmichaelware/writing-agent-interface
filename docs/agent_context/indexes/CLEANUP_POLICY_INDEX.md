# Cleanup Policy Index

Policy source: IDA handoff and current repository state.

Rules:

1. Do not modify global `~/AGENTS.md` from this repo cleanup.
2. Keep project-local context under `docs/agent_context/{canonical,indexes,source_drop,backups}`.
3. Keep forensic/history evidence under `docs/forensics/`.
4. Keep active code under `src/`.
5. Keep browser-served assets/data under `public/`.
6. Keep active reusable scripts under `scripts/`.
7. Move one-off scripts to `scripts/archive/` or `docs/forensics/archive/`.
8. Do not use symlinks.
9. Do not treat raw ingestion as canonical truth.
10. Verify references after moves.

