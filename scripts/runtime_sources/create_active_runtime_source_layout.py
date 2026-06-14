#!/usr/bin/env python3
from pathlib import Path
import shutil, hashlib, json, re, datetime

ROOT = Path(".").resolve()
RUNTIME = Path("data/runtime_sources/weight_of_the_sky")
REPORT = Path("reports/runtime_sources")
REPORT.mkdir(parents=True, exist_ok=True)

DIRS = {
    "00_protocols": "Agent, ingestion, project, and operating protocol documents.",
    "01_renderer_active_inputs": "Documents the typography and layer-to-cinema renderer may actively read.",
    "02_typography_sources": "Typography, visual rhythm, style, and text-presentation source documents.",
    "03_layer_to_cinema_sources": "Layer-to-cinema, scene, viewport, motion, panel, and cinematic rendering documents.",
    "04_current_final_drafts": "Current selected manuscript drafts and final-draft candidates.",
    "05_revision_snapshots": "Historical manually exported revision snapshots.",
    "06_ooxml_current": "OOXML/XML extracted from current DOCX exports.",
    "07_ooxml_revision_exports": "OOXML/XML extracted from historical DOCX revision exports.",
    "08_worldbuilding_lore": "Worldbuilding, lore, mythology, systems, metaphysics, background.",
    "09_synopsis_compendiums": "Synopsis, compendiums, chapter summaries, indexes, overviews.",
    "10_ingestion_baselines": "Machine ingestion baselines, gdrive_raw text targets, extracted raw text.",
    "11_agent_context": "CLI-readable context, generated reports, and agent bootstrap documents.",
    "12_supabase_indexes": "Database snapshots, schema proposals, data maps, import manifests.",
    "99_manual_sort_inbox": "User hand-pick inbox for files not yet classified.",
    "99_quarantine_do_not_ingest": "Known stale, duplicate, unsafe, or broken files.",
}

def sha256(p: Path) -> str:
    h = hashlib.sha256()
    with p.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()

def safe_name(name: str) -> str:
    p = Path(name)
    suffix = "".join(p.suffixes).lower()
    stem = name[:-len(suffix)] if suffix else name
    stem = stem.lower().replace("&", " and ")
    stem = re.sub(r"[^a-z0-9]+", "_", stem)
    stem = re.sub(r"_+", "_", stem).strip("_")
    return (stem[:170] or "unnamed") + suffix

def unique_dest(dest: Path) -> Path:
    if not dest.exists():
        return dest
    i = 2
    while True:
        cand = dest.with_name(f"{dest.stem}_copy_{i}{dest.suffix}")
        if not cand.exists():
            return cand
        i += 1

def copy_file(src: Path, dest_dir: Path, label: str, manifest: list):
    if not src.exists() or not src.is_file():
        return
    dest_dir.mkdir(parents=True, exist_ok=True)
    h = sha256(src)
    dest = dest_dir / safe_name(src.name)
    if dest.exists():
        try:
            if sha256(dest) == h:
                manifest.append({
                    "action": "already_present_same_hash",
                    "label": label,
                    "source": str(src),
                    "dest": str(dest),
                    "bytes": src.stat().st_size,
                    "sha256": h,
                })
                return
        except Exception:
            pass
        dest = unique_dest(dest)
    shutil.copy2(src, dest)
    manifest.append({
        "action": "copied",
        "label": label,
        "source": str(src),
        "dest": str(dest),
        "bytes": dest.stat().st_size,
        "sha256": h,
    })

def copy_tree(src_root: Path, dest_root: Path, label: str, manifest: list):
    if not src_root.exists():
        manifest.append({
            "action": "missing_source_tree",
            "label": label,
            "source": str(src_root),
            "dest": str(dest_root),
        })
        return
    for src in sorted(src_root.rglob("*")):
        if src.is_file():
            copy_file(src, dest_root / src.relative_to(src_root).parent, label, manifest)

for name in DIRS:
    (RUNTIME / name).mkdir(parents=True, exist_ok=True)
    (RUNTIME / name / ".gitkeep").touch()

readme = [
    "# Weight of the Sky Active Runtime Sources",
    "",
    "This is not an archive.",
    "",
    "This is the canonical root-level active runtime source corpus for the writing-agent interface.",
    "",
    "`src/` is application code.",
    "`data/runtime_sources/weight_of_the_sky/` is active manuscript, renderer, typography, lore, revision, and ingestion source data.",
    "",
    "The typography engine and layer-to-cinema renderer may read from this folder.",
    "",
    "Old `src/data-layer/ingestion-buffer/*` folders remain compatibility inputs until every import/script is audited and cut over.",
    "",
    "## Folders",
    "",
]
for name, desc in DIRS.items():
    readme.append(f"- `{name}/` — {desc}")

readme += [
    "",
    "## Rules",
    "",
    "- These files are active runtime source documents, not cold archives.",
    "- Do not delete originals.",
    "- Do not claim current DOCX export contains full revision history.",
    "- Current DOCX exports go into `04_current_final_drafts/` or `10_ingestion_baselines/` depending on purpose.",
    "- Manually recovered historical version exports go into `05_revision_snapshots/`.",
    "- Current OOXML goes into `06_ooxml_current/`.",
    "- Historical OOXML goes into `07_ooxml_revision_exports/`.",
    "- Typography documents go into `02_typography_sources/`.",
    "- Layer-to-cinema renderer documents go into `03_layer_to_cinema_sources/`.",
    "- Worldbuilding and lore go into `08_worldbuilding_lore/`.",
    "- Synopsis and compendiums go into `09_synopsis_compendiums/`.",
    "",
]
(RUNTIME / "README.md").write_text("\n".join(readme), encoding="utf-8")

manifest = []

# Root protocol docs.
for f in ["AGENTS.md", "docs/agent_context/indexes/docs/agent_context/indexes/AGENTS_README.md", "docs/agent_context/indexes/docs/agent_context/indexes/AGENT_READ_CONTEXT_INDEX.md"]:
    copy_file(Path(f), RUNTIME / "00_protocols", "root_protocol", manifest)

# Active renderer-readable staged context.
copy_tree(
    Path("src/data-layer/ingestion-buffer/readme_docs"),
    RUNTIME / "01_renderer_active_inputs/staged_read_context",
    "renderer_active_staged_context",
    manifest,
)

# Also expose same active context to agent context.
copy_tree(
    Path("src/data-layer/ingestion-buffer/readme_docs"),
    RUNTIME / "11_agent_context/staged_read_context",
    "agent_context_staged_context",
    manifest,
)

# Current 182 text baseline.
copy_tree(
    Path("docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw"),
    RUNTIME / "10_ingestion_baselines/gdrive_raw_text_baseline",
    "gdrive_raw_text_baseline",
    manifest,
)

# Local DOCX intake if present.
copy_tree(
    Path("src/data-layer/ingestion-buffer/gdrive_docx_intake"),
    RUNTIME / "10_ingestion_baselines/docx_intake",
    "docx_intake",
    manifest,
)

# Current OOXML if present.
copy_tree(
    Path("src/data-layer/ingestion-buffer/gdrive_ooxml_raw"),
    RUNTIME / "06_ooxml_current/gdrive_ooxml_current",
    "current_ooxml",
    manifest,
)

# XML recovery and perfection reports are active agent context, not renderer source.
for report_dir in [
    "reports/perfect_weight",
    "reports/xml_recovery",
    "reports/filename_standardization",
    "reports/source_corpus",
]:
    copy_tree(
        Path(report_dir),
        RUNTIME / "11_agent_context/reports" / Path(report_dir).name,
        f"report_context_{report_dir}",
        manifest,
    )

summary = {
    "generated_at": datetime.datetime.now().isoformat(),
    "runtime_root": str(RUNTIME),
    "policy": "active_runtime_source_documents_copy_only_no_delete",
    "manifest_entries": len(manifest),
    "manifest": manifest,
}
(REPORT / "active_runtime_source_manifest.json").write_text(json.dumps(summary, indent=2), encoding="utf-8")

counts = []
for d in sorted(RUNTIME.iterdir()):
    if d.is_dir():
        files = [p for p in d.rglob("*") if p.is_file()]
        counts.append({
            "directory": str(d),
            "files": len(files),
            "bytes": sum(p.stat().st_size for p in files),
        })
(REPORT / "active_runtime_source_counts.json").write_text(json.dumps(counts, indent=2), encoding="utf-8")

print(json.dumps({
    "runtime_root": str(RUNTIME),
    "manifest_entries": len(manifest),
    "directories": len(DIRS),
}, indent=2))
