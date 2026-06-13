#!/usr/bin/env python3
from pathlib import Path
import json
import re

ROOT = Path("data/runtime_sources/weight_of_the_sky")
REPORT = Path("reports/runtime_sources")
REPORT.mkdir(parents=True, exist_ok=True)

BUCKETS = {
    "typography_sources": re.compile(r"(typography|font|glyph|line height|typeset|text rhythm|visual rhythm)", re.I),
    "layer_to_cinema_sources": re.compile(r"(cinema|cinematic|renderer|render|layer|viewport|camera|scene|canvas|motion|animation|panel)", re.I),
    "worldbuilding_lore": re.compile(r"(lore|myth|cosmology|worldbuilding|god|daemon|metaphysics|beelzebub|hermon|megiddo)", re.I),
    "synopsis_compendiums": re.compile(r"(synopsis|compendium|summary|outline|table of contents|chapter list|overview)", re.I),
    "protocols": re.compile(r"(protocol|guide|rule|mandate|instruction|prompt|constraint|rubric)", re.I),
    "revision_snapshots": re.compile(r"(revision|version history|snapshot|draft|final|copy|edited)", re.I),
}

rows = []

for p in sorted(ROOT.rglob("*")):
    if not p.is_file():
        continue

    try:
        text = p.read_text(errors="ignore")
    except Exception:
        text = ""

    haystack = f"{p.name}\n{text[:20000]}"
    scores = {}
    for bucket, rx in BUCKETS.items():
        scores[bucket] = len(rx.findall(haystack))

    best = max(scores.items(), key=lambda x: x[1])
    suggested = best[0] if best[1] > 0 else "manual_sort_inbox"

    rows.append({
        "path": str(p),
        "bytes": p.stat().st_size,
        "suggested_bucket": suggested,
        "scores": scores,
    })

rows.sort(key=lambda r: (r["suggested_bucket"], r["path"]))

(REPORT / "manual_sort_suggestions.json").write_text(json.dumps(rows, indent=2), encoding="utf-8")

md = [
    "# Manual Sort Suggestions",
    "",
    "These are suggestions only. They do not move files.",
    "Use this to hand-pick typography, layer-to-cinema, lore, synopsis, compendium, and revision files.",
    "",
]

current = None
for r in rows:
    if r["suggested_bucket"] != current:
        current = r["suggested_bucket"]
        md.append(f"## {current}")
        md.append("")
    md.append(f"- `{r['path']}` — {r['bytes']} bytes — scores `{r['scores']}`")

(REPORT / "manual_sort_suggestions.md").write_text("\n".join(md), encoding="utf-8")

print(json.dumps({
    "files_classified": len(rows),
    "report": "reports/runtime_sources/manual_sort_suggestions.md",
}, indent=2))
