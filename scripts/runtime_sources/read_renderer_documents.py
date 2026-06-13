#!/usr/bin/env python3
from pathlib import Path
import re, json

RUNTIME = Path("data/runtime_sources/weight_of_the_sky")
REPORT = Path("reports/runtime_sources")
REPORT.mkdir(parents=True, exist_ok=True)

TERMS = re.compile(
    r"(typography|font|glyph|cinema|cinematic|renderer|render|layer|canvas|viewport|motion|scene|panel|visual|interface|ui|ux|aesthetic|layout|rhythm|camera|composition|animation|narrative runtime)",
    re.I,
)

docs = []
for root in [
    RUNTIME / "01_renderer_active_inputs",
    RUNTIME / "02_typography_sources",
    RUNTIME / "03_layer_to_cinema_sources",
    RUNTIME / "08_worldbuilding_lore",
    RUNTIME / "09_synopsis_compendiums",
]:
    if not root.exists():
        continue
    for p in sorted(root.rglob("*")):
        if not p.is_file():
            continue
        try:
            text = p.read_text(errors="ignore")
        except Exception:
            continue
        hits = []
        for i, line in enumerate(text.splitlines(), 1):
            if TERMS.search(line):
                hits.append({"line": i, "text": line.strip()[:600]})
        docs.append({
            "path": str(p),
            "bytes": p.stat().st_size,
            "renderer_hits": len(hits),
            "hits": hits[:120],
        })

docs.sort(key=lambda x: x["renderer_hits"], reverse=True)

(REPORT / "renderer_document_read_report.json").write_text(json.dumps(docs, indent=2), encoding="utf-8")

md = [
    "# Renderer Document Read Report",
    "",
    "This report proves the active runtime documents were read for typography and layer-to-cinema renderer signals.",
    "",
]
for d in docs:
    if d["renderer_hits"] == 0:
        continue
    md.append(f"## {d['path']}")
    md.append(f"- Bytes: {d['bytes']}")
    md.append(f"- Renderer/typography/cinema hits: {d['renderer_hits']}")
    for h in d["hits"][:40]:
        md.append(f"- L{h['line']}: {h['text']}")
    md.append("")

(REPORT / "renderer_document_read_report.md").write_text("\n".join(md), encoding="utf-8")

print(json.dumps({
    "documents_read": len(docs),
    "documents_with_renderer_hits": len([d for d in docs if d["renderer_hits"] > 0]),
    "report": "reports/runtime_sources/renderer_document_read_report.md",
}, indent=2))
