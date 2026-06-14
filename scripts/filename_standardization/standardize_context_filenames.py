#!/usr/bin/env python3
from pathlib import Path
import json
import re
import unicodedata
import hashlib
import shutil

PROJECT_ROOT = Path(".").resolve()
TARGET_ROOTS = [
    Path("src/data-layer/ingestion-buffer/readme_docs"),
    Path("reports/perfect_weight"),
]

OUT_DIR = Path("reports/filename_standardization")
OUT_DIR.mkdir(parents=True, exist_ok=True)

def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()

def standard_stem(stem: str) -> str:
    s = unicodedata.normalize("NFKD", stem)
    s = "".join(ch for ch in s if not unicodedata.combining(ch))
    s = s.replace("\ufeff", "")
    s = s.replace("&", " and ")
    s = s.replace("+", " plus ")
    s = s.replace("@", " at ")
    s = s.replace("%", " percent ")
    s = s.replace("／", "_")
    s = s.replace("/", "_")
    s = s.lower()
    s = re.sub(r"[^a-z0-9]+", "_", s)
    s = re.sub(r"_+", "_", s).strip("_")
    return s or "unnamed"

def standard_filename(name: str) -> str:
    p = Path(name)
    suffixes = "".join(p.suffixes).lower()
    stem = name
    if suffixes:
        stem = name[:-len(suffixes)]
    stem = standard_stem(stem)
    return stem + suffixes

def unique_target(path: Path) -> Path:
    if not path.exists():
        return path
    stem = path.stem
    suffix = path.suffix
    parent = path.parent
    i = 2
    while True:
        candidate = parent / f"{stem}_dup_{i}{suffix}"
        if not candidate.exists():
            return candidate
        i += 1

renames = []
unchanged = []
collisions = []
missing_roots = []

for root in TARGET_ROOTS:
    if not root.exists():
        missing_roots.append(str(root))
        continue

    for src in sorted(root.rglob("*")):
        if not src.is_file():
            continue

        old_rel = src.relative_to(PROJECT_ROOT)
        new_name = standard_filename(src.name)

        if new_name == src.name:
            unchanged.append(str(old_rel))
            continue

        wanted = src.with_name(new_name)
        dst = unique_target(wanted)

        before_hash = sha256(src)
        before_bytes = src.stat().st_size

        if wanted.exists() and wanted != src:
            collisions.append({
                "source": str(old_rel),
                "wanted": str(wanted.relative_to(PROJECT_ROOT)),
                "actual": str(dst.relative_to(PROJECT_ROOT)),
            })

        src.rename(dst)

        renames.append({
            "old": str(old_rel),
            "new": str(dst.relative_to(PROJECT_ROOT)),
            "bytes": before_bytes,
            "sha256": before_hash,
        })

manifest = {
    "policy": "lowercase_snake_case_for_active_context_and_generated_reports_only",
    "renamed_count": len(renames),
    "unchanged_count": len(unchanged),
    "collision_count": len(collisions),
    "missing_roots": missing_roots,
    "renames": renames,
    "collisions": collisions,
}

(OUT_DIR / "rename_manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")

# Rebuild active staged file list.
readme_root = Path("src/data-layer/ingestion-buffer/readme_docs")
staged = []
if readme_root.exists():
    for p in sorted(readme_root.rglob("*")):
        if p.is_file():
            staged.append({
                "path": str(p),
                "tier": p.parent.name,
                "name": p.name,
                "bytes": p.stat().st_size,
                "sha256": sha256(p),
            })

(OUT_DIR / "standardized_staged_context_files.json").write_text(json.dumps(staged, indent=2), encoding="utf-8")
Path("reports/readme_docs_staged_files.txt").write_text("\n".join(x["path"] for x in staged) + "\n", encoding="utf-8")

# Rebuild readable context index from actual current paths.
lines = [
    "# Agent Read Context Index",
    "",
    "These files are active source/context inputs for CLI agents and ingestion tools.",
    "Filenames have been standardized to lowercase snake_case where safe.",
    "These are staged copies, not disposable archives.",
    "",
    "Root path:",
    "`src/data-layer/ingestion-buffer/readme_docs/`",
    "",
    "## Files",
    "",
]

for item in staged:
    lines.append(f"- `{item['path']}` — {item['bytes']} bytes — sha256 `{item['sha256'][:16]}...`")

lines += [
    "",
    "## Filename Policy",
    "",
    "- Active context filenames should use lowercase snake_case.",
    "- Numeric source prefixes such as `013__` should be preserved.",
    "- Original source files in `/sdcard/Download` are not moved or deleted.",
    "- App source filenames are not automatically renamed because imports may depend on them.",
    "",
]

Path("docs/agent_context/indexes/AGENT_READ_CONTEXT_INDEX.md").write_text("\n".join(lines), encoding="utf-8")

# Write a repo-wide audit of suspicious names, but do not rename code.
bad = []
for p in sorted(Path(".").rglob("*")):
    if not p.is_file():
        continue
    sp = str(p)
    if "/node_modules/" in sp or "/.git/" in sp or "/.next/" in sp:
        continue
    name = p.name
    recommended = standard_filename(name)
    if recommended != name and name not in {"AGENTS.md", "docs/agent_context/indexes/AGENTS_README.md", "docs/agent_context/indexes/AGENT_READ_CONTEXT_INDEX.md", "README.md"}:
        bad.append({
            "path": sp,
            "name": name,
            "recommended_filename": recommended,
            "reason": "non_standard_filename_audit_only_not_renamed",
        })

(OUT_DIR / "repo_wide_filename_audit_do_not_auto_rename.json").write_text(json.dumps(bad, indent=2), encoding="utf-8")

print(json.dumps({
    "renamed": len(renames),
    "unchanged": len(unchanged),
    "collisions": len(collisions),
    "staged_context_files": len(staged),
    "repo_wide_nonstandard_audit_count": len(bad),
    "manifest": str(OUT_DIR / "rename_manifest.json"),
    "audit": str(OUT_DIR / "repo_wide_filename_audit_do_not_auto_rename.json"),
}, indent=2))
