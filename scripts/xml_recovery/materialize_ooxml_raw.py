#!/usr/bin/env python3
from pathlib import Path
import shutil
import json
import hashlib
import re

PROJECT = Path(".").resolve()
DEST = Path("src/data-layer/ingestion-buffer/gdrive_ooxml_raw")
REPORT = Path("reports/xml_recovery")
DEST.mkdir(parents=True, exist_ok=True)
REPORT.mkdir(parents=True, exist_ok=True)

def sha256(p: Path) -> str:
    h = hashlib.sha256()
    with p.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()

def safe(s: str) -> str:
    s = s.lower()
    s = re.sub(r"[^a-z0-9._/-]+", "_", s)
    s = re.sub(r"_+", "_", s).strip("_")
    return s[:180] or "unnamed"

archives = sorted(Path("data/source_archive/name_matched_google_docs").glob("*/documents/*/ooxml_current"))
manifest = []
copied = 0

for ox in archives:
    doc_dir = ox.parent
    doc_name = safe(doc_dir.name)
    target_doc_root = DEST / doc_name
    for src in sorted(ox.rglob("*")):
        if not src.is_file():
            continue
        rel = src.relative_to(ox)
        dst = target_doc_root / rel
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dst)
        copied += 1
        manifest.append({
            "source": str(src),
            "dest": str(dst),
            "doc_folder": doc_name,
            "part_path": str(rel),
            "bytes": dst.stat().st_size,
            "sha256": sha256(dst),
        })

(REPORT / "materialized_ooxml_manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
Path("reports/gdrive_ooxml_raw_files.txt").write_text("\n".join(m["dest"] for m in manifest) + "\n", encoding="utf-8")

print(json.dumps({
    "archives_found": len(archives),
    "ooxml_files_copied": copied,
    "destination": str(DEST),
    "manifest": "reports/xml_recovery/materialized_ooxml_manifest.json"
}, indent=2))

if copied == 0:
    print("")
    print("NO OOXML COPIED: Google export/extraction has not produced ooxml_current folders yet.")
