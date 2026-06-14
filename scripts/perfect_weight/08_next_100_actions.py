#!/usr/bin/env python3
from pathlib import Path

groups = {
"Foundation and safety": [
"Freeze the staged read-context structure and keep it copy-only.",
"Verify the two formerly missing Writing Agent source docs are staged under visible names.",
"Keep AGENTS.md as the root instruction file for all CLIs.",
"Keep docs/agent_context/indexes/docs/agent_context/indexes/AGENTS_README.md as a short pointer to AGENTS.md.",
"Preserve docs/agent_context/indexes/docs/agent_context/indexes/AGENT_READ_CONTEXT_INDEX.md as the numbered-source map.",
"Write a no-delete policy into every destructive-capable script.",
"Keep reports in reports/perfect_weight instead of mixing them with source context.",
"Record git status before every major change.",
"Record build output after every major change.",
"Do not collapse duplicate chapter families until lineage is proven.",
],
"Source document intelligence": [
"Classify every staged source document by purpose and freshness.",
"Build a source-context digest that separates current truth from historical notes.",
"Extract all UI/UX requirements from staged docs.",
"Extract all ingestion/database requirements from staged docs.",
"Extract all manuscript/canon requirements from staged docs.",
"Extract all contradiction and impossible-target notes.",
"Create a stale-document detector based on code/schema mismatch.",
"Create source-file hashes so later edits are detectable.",
"Create a staged-source manifest with byte counts and priority tier.",
"Create a deferred parsing plan for the large lore file 174.",
],
"Code and tree reality": [
"Map every API route to its frontend consumer.",
"Map every UI panel to required data fields.",
"Map every Supabase table to routes and components.",
"Map every ingestion script to target tables.",
"Identify dead or unused components.",
"Identify UI components with empty states.",
"Identify routes returning unshaped or unstable data.",
"Identify duplicate chapter resolution logic.",
"Identify hidden assumptions about canonical manuscript families.",
"Create a current-tree-vs-source-doc report.",
],
"Supabase and data lineage": [
"Snapshot table counts before any backfill.",
"Snapshot paragraph JSON enrichment counts.",
"Inspect chapter families without deleting anything.",
"Identify canonical chapter candidates.",
"Create a chapter-family-lineage report.",
"Backfill hyperlinks only after mapping dualism_map shape.",
"Backfill biblical references only after confirming extraction rules.",
"Add idempotent derived-table scripts with dry-run mode.",
"Add before/after count reports for every backfill.",
"Never expose service role or DATABASE_URL in logs.",
],
"UI/UX perfection path": [
"Make empty panels explain whether data is absent or failed.",
"Show counts in archetype/reference/hyperlink panels.",
"Keep manuscript reading central and analysis secondary.",
"Add source lineage hints where practical.",
"Preserve the layered UI metaphor.",
"Improve mobile/Termux/iPhone resilience.",
"Make graph panel degrade gracefully when hyperlinks table is empty.",
"Make biblical references panel distinguish unindexed from none found.",
"Make archetype panel use paragraph JSON without requiring derived tables.",
"Create a UI panel data-health indicator.",
],
"Manuscript quality system": [
"Determine which chapter family renders in the UI now.",
"Create a chapter canonicality report.",
"Compare rendered chapters against staged source inventories.",
"Identify missing chapters and duplicate drafts.",
"Build a manuscript completeness matrix.",
"Preserve all alternate drafts until canonical map is approved.",
"Create paragraph-level source lineage where available.",
"Create metadata summaries per chapter.",
"Create archetypal distribution summaries per chapter.",
"Create contradiction/coherence audit hooks for later prose work.",
],
"Ingestion and recovery": [
"Separate active source context from generated archive output.",
"Keep gdrive_raw intact.",
"Keep readme_docs intact.",
"Create an ingestion-buffer index that agents can read quickly.",
"Create a JSONL derived context format for future embedding.",
"Create chunking scripts that preserve source filename and offsets.",
"Create checksum-based duplicate detection.",
"Create weak-match review reports for Google Drive matching.",
"Keep Google auth work separate from local staging.",
"Do not claim full Google revision recovery unless API proves it.",
],
"Build and runtime reliability": [
"Capture current build warnings.",
"Fix invalid Next config only after reading next.config.js.",
"Avoid npm audit force fixes.",
"Check Node version mismatch separately from app logic.",
"Run build logs into reports.",
"Add targeted lint/type scripts if package supports them.",
"Check API route runtime errors before UI rewrites.",
"Check environment variable requirements.",
"Create a local startup checklist.",
"Create a deploy readiness checklist.",
],
"Agent operations": [
"Make Gemini/Claude/Aider read AGENTS.md first.",
"Create task-specific reports before code edits.",
"Keep prompts mostly directive but not over-constraining.",
"Require agents to inspect code before applying staged notes.",
"Require contradiction fork handling.",
"Require source preservation.",
"Require reversible changes.",
"Require evidence in reports.",
"Require exact file paths in recommendations.",
"Require no fake certainty.",
],
"Execution roadmap": [
"Run the inventory scripts.",
"Run the context classifier.",
"Run the code/data map.",
"Run the UI/UX extractor.",
"Run the contradiction fork mapper.",
"Run the Supabase snapshot if credentials exist.",
"Run the panel truth audit.",
"Generate the master perfection README.",
"Review reports before writing app code.",
"Then implement the smallest safe UI/data fix first.",
],
}

lines = ["# Next 100 Actions for Weight of the Sky + Writing Agent Interface", ""]
n = 1
for group, items in groups.items():
    lines.append(f"## {group}")
    for item in items:
        lines.append(f"{n:03d}. {item}")
        n += 1
    lines.append("")
Path("reports/perfect_weight/08_next_100_actions.md").write_text("\n".join(lines), encoding="utf-8")
print("wrote reports/perfect_weight/08_next_100_actions.md with", n-1, "actions")

