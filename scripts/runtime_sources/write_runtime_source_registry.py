#!/usr/bin/env python3
from pathlib import Path
import json
import hashlib

ROOT = Path("data/runtime_sources/weight_of_the_sky")
REPORT = Path("reports/runtime_sources")
REPORT.mkdir(parents=True, exist_ok=True)

def sha256(p):
    h = hashlib.sha256()
    with p.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()

def kind(rel):
    s = str(rel).replace("\\", "/")
    if s.startswith("00_protocols/"): return "protocol"
    if s.startswith("01_renderer_active_inputs/"): return "renderer_active_input"
    if s.startswith("02_typography_sources/"): return "typography_source"
    if s.startswith("03_layer_to_cinema_sources/"): return "layer_to_cinema_source"
    if s.startswith("04_current_final_drafts/"): return "current_final_draft"
    if s.startswith("05_revision_snapshots/"): return "revision_snapshot"
    if s.startswith("06_ooxml_current/"): return "current_ooxml"
    if s.startswith("07_ooxml_revision_exports/"): return "revision_ooxml"
    if s.startswith("08_worldbuilding_lore/"): return "worldbuilding_lore"
    if s.startswith("09_synopsis_compendiums/"): return "synopsis_compendium"
    if s.startswith("10_ingestion_baselines/"): return "ingestion_baseline"
    if s.startswith("11_agent_context/"): return "agent_context"
    if s.startswith("12_supabase_indexes/"): return "supabase_index"
    if s.startswith("99_manual_sort_inbox/"): return "manual_sort_inbox"
    if s.startswith("99_quarantine_do_not_ingest/"): return "quarantine_do_not_ingest"
    return "unknown"

rows = []
for p in sorted(ROOT.rglob("*")):
    if not p.is_file():
        continue
    rel = p.relative_to(ROOT)
    rows.append({
        "path": str(p),
        "relative_path": str(rel),
        "kind": kind(rel),
        "bytes": p.stat().st_size,
        "sha256": sha256(p),
    })

by_kind = {}
for row in rows:
    k = row["kind"]
    by_kind.setdefault(k, {"files": 0, "bytes": 0})
    by_kind[k]["files"] += 1
    by_kind[k]["bytes"] += row["bytes"]

registry = {
    "active_runtime_sources": True,
    "archive": False,
    "root": str(ROOT),
    "total_files": len(rows),
    "total_bytes": sum(r["bytes"] for r in rows),
    "by_kind": by_kind,
    "files": rows,
}

(REPORT / "active_runtime_source_registry.json").write_text(json.dumps(registry, indent=2), encoding="utf-8")

md = [
    "# Active Runtime Source Registry",
    "",
    "These files are active runtime source documents, not archives.",
    "",
    f"- Root: `{ROOT}`",
    f"- Total files: {registry['total_files']}",
    f"- Total bytes: {registry['total_bytes']}",
    "",
    "## Counts by kind",
    "",
]
for k, v in sorted(by_kind.items()):
    md.append(f"- `{k}` — {v['files']} files — {v['bytes']} bytes")

md += ["", "## Files", ""]
for row in rows:
    md.append(f"- `{row['relative_path']}` — `{row['kind']}` — {row['bytes']} bytes — `{row['sha256'][:16]}...`")

(REPORT / "active_runtime_source_registry.md").write_text("\n".join(md), encoding="utf-8")

print(json.dumps({
    "files": registry["total_files"],
    "bytes": registry["total_bytes"],
    "report": "reports/runtime_sources/active_runtime_source_registry.md",
}, indent=2))
