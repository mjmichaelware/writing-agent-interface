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

