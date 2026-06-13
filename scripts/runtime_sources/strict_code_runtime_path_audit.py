#!/usr/bin/env python3
from pathlib import Path
import json
import re

REPORT = Path("reports/runtime_sources")
REPORT.mkdir(parents=True, exist_ok=True)

SEARCH_ROOTS = [
    Path("src/app"),
    Path("src/components"),
    Path("src/hooks"),
    Path("src/lib"),
    Path("src/runtime"),
    Path("src/services"),
    Path("scripts"),
    Path("supabase"),
]

CODE_EXTS = {
    ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
    ".py", ".sh", ".sql", ".json",
}

EXCLUDE_PARTS = {
    "node_modules",
    ".git",
    ".next",
    "reports",
    "data",
    "readme_docs",
    "gdrive_raw",
    "gdrive_ooxml_raw",
    "gdrive_docx_intake",
    "runtime_sources",
    "source_corpus",
    "initialization-metadata",
    "ingestion-buffer",
}

PATTERN = re.compile(
    r"(src/data-layer/ingestion-buffer|gdrive_raw|readme_docs|gdrive_ooxml_raw|gdrive_docx_intake|data/runtime_sources|RUNTIME_SOURCE)",
    re.I,
)

hits = []
scanned = 0

for root in SEARCH_ROOTS:
    if not root.exists():
        continue

    for p in sorted(root.rglob("*")):
        if not p.is_file():
            continue

        parts = set(p.parts)
        if parts & EXCLUDE_PARTS:
            continue

        if p.suffix not in CODE_EXTS:
            continue

        scanned += 1

        try:
            lines = p.read_text(errors="ignore").splitlines()
        except Exception:
            continue

        for i, line in enumerate(lines, 1):
            if PATTERN.search(line):
                hits.append({
                    "path": str(p),
                    "line": i,
                    "text": line.strip()[:500],
                })

summary = {
    "scanned_code_files": scanned,
    "real_code_hits": len(hits),
    "hits": hits,
}

(REPORT / "strict_code_runtime_path_audit.json").write_text(json.dumps(summary, indent=2), encoding="utf-8")

md = [
    "# Strict Code Runtime Path Audit",
    "",
    "This excludes staged documents, data-layer manifests, generated reports, copied runtime-source data, and corpus files.",
    "",
    f"- Scanned code files: {scanned}",
    f"- Real code hits: {len(hits)}",
    "",
]

if hits:
    md.append("## Real code references")
    md.append("")
    for h in hits:
        md.append(f"- `{h['path']}` L{h['line']}: `{h['text']}`")
else:
    md.append("## Result")
    md.append("")
    md.append("No real app-code imports of the old ingestion folders were found by this strict audit.")

(REPORT / "strict_code_runtime_path_audit.md").write_text("\n".join(md), encoding="utf-8")

print(json.dumps({
    "scanned_code_files": scanned,
    "real_code_hits": len(hits),
    "report": "reports/runtime_sources/strict_code_runtime_path_audit.md",
}, indent=2))
