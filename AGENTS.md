# AGENTS.md — Writing Agent Interface

## Project Root

Canonical project root:

`~/Workspaces/Hybrid/writing-agent-interface`

Do not use any older or alternate path as the primary project root.

## Purpose

This file is the project-local instruction file for all coding agents working in this repository.

It applies to:
- Claude Code
- Gemini CLI
- Codex
- Ollama / Llama-based terminal agents
- future CLI coding agents

## Read Order

Agents should read in this order:

1. `~/AGENTS.md`
2. this file: `AGENTS.md`
3. `docs/agent_context/indexes/AGENT_CONTEXT_CANONICAL_INDEX.md`
4. only the specific context documents needed for the current task
5. current code, current schema, and current reports

## Canonical Agent Context

Primary project context location:

`docs/agent_context/canonical/`

Primary index location:

`docs/agent_context/indexes/AGENT_CONTEXT_CANONICAL_INDEX.md`

These files are active project context. They are not trash and they are not disposable archive material.

## Context Economy Rules

Do not reread every giant context file on every task.

Use this approach:

1. read the canonical index first
2. identify only the relevant files for the task
3. read Tier 1 / core context first
4. read broader forensic or checkpoint material only when needed
5. prefer current code truth over historical prompts or dumps

## Truth Hierarchy

1. Current working code and current schema
2. Current generated reports from the repo or database
3. Canonical project context in `docs/agent_context/`
4. Historical audits, dumps, prompts, logs, and recovery artifacts
5. Speculation

## Safety Rules

Before editing:

1. verify the current tree
2. verify current code references
3. verify current runtime/data paths
4. prefer reversible changes
5. back up files before overwriting important instruction files
6. do not invent paths
7. do not delete project context without an explicit reference audit

## Important Project Note

Old ingestion-buffer staging paths were intermediate staging locations, not the preferred long-term project-context home.

The senior-standard project-context home is:

`docs/agent_context/`

## Important App Note

`public/data/chapters/` may still be read by the app. Do not delete or relocate chapter files without confirming current code references first.

## Scope Boundary

This file is only for the Writing Agent Interface project.

Machine-wide instructions belong in:

`~/AGENTS.md`
