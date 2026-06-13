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

