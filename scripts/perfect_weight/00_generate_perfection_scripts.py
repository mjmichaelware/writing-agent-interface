from pathlib import Path
import textwrap

ROOT = Path(".")
SCRIPTS = Path("scripts/perfect_weight")
REPORTS = Path("reports/perfect_weight")
SCRIPTS.mkdir(parents=True, exist_ok=True)
REPORTS.mkdir(parents=True, exist_ok=True)

def write(path, text):
    p = Path(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(textwrap.dedent(text).lstrip() + "\n", encoding="utf-8")
    p.chmod(0o755)

write(SCRIPTS / "01_inventory.sh", r'''
#!/usr/bin/env bash
set -euo pipefail
mkdir -p reports/perfect_weight
{
  echo "# Repo Inventory"
  echo
  echo "## Date"
  date
  echo
  echo "## Git Status"
  git status --short || true
  echo
  echo "## Root Files"
  find . -maxdepth 2 -type f \
    -not -path './node_modules/*' \
    -not -path './.git/*' \
    -not -path './.next/*' \
    | sort
  echo
  echo "## Source Context Files"
  find src/data-layer/ingestion-buffer/readme_docs -type f -printf '%p\t%s bytes\n' 2>/dev/null | sort || true
} > reports/perfect_weight/01_repo_inventory.md

find . -type f \
  -not -path './node_modules/*' \
  -not -path './.git/*' \
  -not -path './.next/*' \
  -printf '%p\t%s\n' 2>/dev/null \
  | sort > reports/perfect_weight/01_file_manifest.tsv
''')

write(SCRIPTS / "02_context_classifier.py", r'''
#!/usr/bin/env python3
from pathlib import Path
import json, re

base = Path("src/data-layer/ingestion-buffer/readme_docs")
out = Path("reports/perfect_weight")
out.mkdir(parents=True, exist_ok=True)

categories = {
    "ui_ux": ["ui", "ux", "interface", "visual", "layout", "panel", "canvas", "aesthetic", "viewport"],
    "database": ["supabase", "postgres", "database", "schema", "migration", "paragraphs", "chapters", "embedding"],
    "ingestion": ["ingest", "buffer", "gdrive", "drive", "document", "source", "extract", "parse"],
    "manuscript": ["chapter", "stardust", "living sacrifice", "forsaken", "ascent", "weight of the sky"],
    "contradiction": ["contradiction", "incoherence", "inconsistent", "conflict", "impossible", "mismatch"],
    "agent_ops": ["gemini", "claude", "termux", "terminal", "agent", "cli", "protocol"],
}

rows = []
for p in sorted(base.rglob("*")):
    if not p.is_file():
        continue
    try:
        txt = p.read_text(errors="ignore")
    except Exception as e:
        rows.append({"path": str(p), "error": str(e)})
        continue
    low = txt.lower()
    hits = {cat: sum(low.count(k) for k in keys) for cat, keys in categories.items()}
    top = sorted(hits.items(), key=lambda x: x[1], reverse=True)
    rows.append({
        "path": str(p),
        "bytes": p.stat().st_size,
        "top_categories": top[:3],
        "title_hint": txt[:300].replace("\n", " "),
    })

(out / "02_context_classification.json").write_text(json.dumps(rows, indent=2), encoding="utf-8")

md = ["# Source Context Classification", ""]
for r in rows:
    md.append(f"## {r.get('path')}")
    if "error" in r:
        md.append(f"- ERROR: {r['error']}")
    else:
        md.append(f"- Bytes: {r['bytes']}")
        md.append(f"- Top categories: {r['top_categories']}")
        md.append(f"- Opening: {r['title_hint'][:500]}")
    md.append("")
(out / "02_context_classification.md").write_text("\n".join(md), encoding="utf-8")
print("wrote reports/perfect_weight/02_context_classification.md")
''')

write(SCRIPTS / "03_code_data_map.sh", r'''
#!/usr/bin/env bash
set -euo pipefail
mkdir -p reports/perfect_weight
{
  echo "# Code/Data Map"
  echo
  echo "## Package Scripts"
  node -e 'const p=require("./package.json"); console.log(JSON.stringify(p.scripts||{},null,2))' || true
  echo
  echo "## API Routes"
  find src/app/api -type f 2>/dev/null | sort || true
  echo
  echo "## Components"
  find src/components -type f 2>/dev/null | sort || true
  echo
  echo "## Supabase Migrations"
  find supabase -type f 2>/dev/null | sort || true
  echo
  echo "## Data Field Grep"
  grep -RIn --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git \
    "archetypal_weights\|dualism_map\|hebrew_spans\|biblical_references\|hyperlinks\|paragraphs\|chapters" \
    src supabase scripts 2>/dev/null || true
} > reports/perfect_weight/03_code_data_map.md
''')

write(SCRIPTS / "04_uiux_extract.py", r'''
#!/usr/bin/env python3
from pathlib import Path
import re

base = Path("src/data-layer/ingestion-buffer/readme_docs")
out = Path("reports/perfect_weight")
terms = re.compile(r"(ui|ux|interface|aesthetic|visual|layout|panel|canvas|viewport|front[- ]?matter|typography|graph|archetype|hyperlink|biblical)", re.I)

lines = ["# UI/UX Extracted Requirements", ""]
for p in sorted(base.rglob("*")):
    if not p.is_file():
        continue
    try:
        text = p.read_text(errors="ignore").splitlines()
    except:
        continue
    matches = []
    for i, line in enumerate(text, 1):
        if terms.search(line):
            matches.append((i, line.strip()))
    if matches:
        lines.append(f"## {p}")
        for i, line in matches[:80]:
            lines.append(f"- L{i}: {line[:500]}")
        lines.append("")

(out / "04_uiux_extract.md").write_text("\n".join(lines), encoding="utf-8")
print("wrote reports/perfect_weight/04_uiux_extract.md")
''')

write(SCRIPTS / "05_contradiction_fork_map.py", r'''
#!/usr/bin/env python3
from pathlib import Path
import re

base = Path("src/data-layer/ingestion-buffer/readme_docs")
out = Path("reports/perfect_weight")
terms = re.compile(r"(contradict|incoher|incongru|inconsisten|conflict|impossible|wrong|broken|stale|outdated|superseded|fork)", re.I)

md = ["# Contradiction and Fork Map", ""]
md.append("Use this report to preserve conflicting UI/UX and architecture branches without blindly applying stale context.")
md.append("")
for p in sorted(base.rglob("*")):
    if not p.is_file():
        continue
    try:
        text = p.read_text(errors="ignore").splitlines()
    except:
        continue
    hits = []
    for i, line in enumerate(text, 1):
        if terms.search(line):
            hits.append((i, line.strip()))
    if hits:
        md.append(f"## {p}")
        md.append("- CURRENT_REALITY: verify against repo before acting.")
        md.append("- HISTORICAL_CONTEXT: preserve useful idea even if stale.")
        md.append("- ACTIVE_FORK: choose only after code/schema check.")
        for i, line in hits[:80]:
            md.append(f"- L{i}: {line[:500]}")
        md.append("")
(out / "05_contradiction_fork_map.md").write_text("\n".join(md), encoding="utf-8")
print("wrote reports/perfect_weight/05_contradiction_fork_map.md")
''')

write(SCRIPTS / "06_supabase_snapshot.sh", r'''
#!/usr/bin/env bash
set -euo pipefail
mkdir -p reports/perfect_weight
OUT="reports/perfect_weight/06_supabase_snapshot.md"
{
  echo "# Supabase Snapshot"
  echo
  echo "This script is read-only."
  echo
} > "$OUT"

DBURL="${DATABASE_URL:-}"
if [ -z "$DBURL" ] && command -v gcloud >/dev/null 2>&1; then
  DBURL="$(gcloud secrets versions access latest --project=ai-job-agent-498702 --secret=DATABASE_URL 2>/dev/null || true)"
fi

if [ -z "$DBURL" ]; then
  {
    echo "DATABASE_URL not available. Skipped DB snapshot."
  } >> "$OUT"
  exit 0
fi

{
  echo "## Table Counts"
  psql "$DBURL" -Atc "
    select 'documents=' || count(*) from public.documents
    union all select 'chapters=' || count(*) from public.chapters
    union all select 'paragraphs=' || count(*) from public.paragraphs
    union all select 'biblical_references=' || count(*) from public.biblical_references
    union all select 'hyperlinks=' || count(*) from public.hyperlinks;
  "
  echo
  echo "## Paragraph JSON Enrichment Counts"
  psql "$DBURL" -Atc "
    select 'has_archetypal_weights=' || count(*) from public.paragraphs where archetypal_weights <> '{}'::jsonb
    union all select 'has_dualism_map=' || count(*) from public.paragraphs where dualism_map <> '{}'::jsonb
    union all select 'has_hebrew_spans=' || count(*) from public.paragraphs where hebrew_spans <> '[]'::jsonb
    union all select 'has_metadata=' || count(*) from public.paragraphs where metadata <> '{}'::jsonb;
  "
} >> "$OUT"
''')

write(SCRIPTS / "07_panel_truth_audit.py", r'''
#!/usr/bin/env python3
from pathlib import Path
import re

out = Path("reports/perfect_weight")
targets = [
    "src/app/api/chapters/route.ts",
    "src/app/api/manuscript/route.ts",
    "src/app/api/biblical-references/route.ts",
    "src/app/api/graph/route.ts",
    "src/components/layers/canvas/ManuscriptCore.tsx",
    "src/components/layers/panel/BiblicalReferencesDirectory.tsx",
    "src/components/layers/panel/HyperlinksGraph.tsx",
    "src/components/layers/panel/ArchetypesDirectory.tsx",
]
fields = ["archetypal_weights", "dualism_map", "hebrew_spans", "metadata", "biblical_references", "hyperlinks", "paragraphs", "chapters"]

md = ["# UI Panel Truth Audit", ""]
for t in targets:
    p = Path(t)
    md.append(f"## {t}")
    if not p.exists():
        md.append("- Missing")
        md.append("")
        continue
    txt = p.read_text(errors="ignore")
    present = [f for f in fields if f in txt]
    md.append(f"- Present fields: {present}")
    md.append("- Relevant lines:")
    for i, line in enumerate(txt.splitlines(), 1):
        if any(f in line for f in fields) or "fetch(" in line or ".from(" in line:
            md.append(f"  - L{i}: {line.strip()[:300]}")
    md.append("")
(out / "07_panel_truth_audit.md").write_text("\n".join(md), encoding="utf-8")
print("wrote reports/perfect_weight/07_panel_truth_audit.md")
''')

write(SCRIPTS / "08_next_100_actions.py", r'''
#!/usr/bin/env python3
from pathlib import Path

groups = {
"Foundation and safety": [
"Freeze the staged read-context structure and keep it copy-only.",
"Verify the two formerly missing Writing Agent source docs are staged under visible names.",
"Keep AGENTS.md as the root instruction file for all CLIs.",
"Keep AGENTS_README.md as a short pointer to AGENTS.md.",
"Preserve AGENT_READ_CONTEXT_INDEX.md as the numbered-source map.",
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
''')

write(SCRIPTS / "09_master_readme_builder.py", r'''
#!/usr/bin/env python3
from pathlib import Path

out = Path("reports/perfect_weight")
parts = [
    ("01_repo_inventory.md", "Repo Inventory"),
    ("02_context_classification.md", "Context Classification"),
    ("03_code_data_map.md", "Code/Data Map"),
    ("04_uiux_extract.md", "UI/UX Extract"),
    ("05_contradiction_fork_map.md", "Contradiction Fork Map"),
    ("06_supabase_snapshot.md", "Supabase Snapshot"),
    ("07_panel_truth_audit.md", "Panel Truth Audit"),
    ("08_next_100_actions.md", "Next 100 Actions"),
]

lines = ["# Weight of the Sky — Perfection Control README", ""]
lines.append("This report is generated. It does not replace source documents. It organizes what the next agent should inspect and do.")
lines.append("")
lines.append("Primary source context: `src/data-layer/ingestion-buffer/readme_docs/`")
lines.append("Root agent instructions: `AGENTS.md`")
lines.append("Source index: `AGENT_READ_CONTEXT_INDEX.md`")
lines.append("")

for filename, title in parts:
    p = out / filename
    lines.append(f"---\n\n# {title}\n")
    if p.exists():
        lines.append(p.read_text(errors="ignore"))
    else:
        lines.append(f"Missing `{p}`")
    lines.append("")

(out / "09_WEIGHT_OF_THE_SKY_PERFECTION_README.md").write_text("\n".join(lines), encoding="utf-8")
print("wrote reports/perfect_weight/09_WEIGHT_OF_THE_SKY_PERFECTION_README.md")
''')

write(SCRIPTS / "10_runner.sh", r'''
#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
mkdir -p reports/perfect_weight

bash scripts/perfect_weight/01_inventory.sh
python3 scripts/perfect_weight/02_context_classifier.py
bash scripts/perfect_weight/03_code_data_map.sh
python3 scripts/perfect_weight/04_uiux_extract.py
python3 scripts/perfect_weight/05_contradiction_fork_map.py
bash scripts/perfect_weight/06_supabase_snapshot.sh || true
python3 scripts/perfect_weight/07_panel_truth_audit.py
python3 scripts/perfect_weight/08_next_100_actions.py
python3 scripts/perfect_weight/09_master_readme_builder.py

echo
echo "DONE. Main report:"
echo "reports/perfect_weight/09_WEIGHT_OF_THE_SKY_PERFECTION_README.md"
echo
ls -lh reports/perfect_weight
''')

print("Generated scripts in scripts/perfect_weight/")
