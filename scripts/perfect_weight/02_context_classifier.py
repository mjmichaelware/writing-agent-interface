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

