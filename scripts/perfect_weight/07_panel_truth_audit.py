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

