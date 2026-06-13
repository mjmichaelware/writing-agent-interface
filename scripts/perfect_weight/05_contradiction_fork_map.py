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

