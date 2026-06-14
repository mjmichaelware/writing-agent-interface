from pathlib import Path
import os, shutil, subprocess, hashlib, json, datetime, re

ROOT = Path.cwd()
RUN_ROOT = ROOT / os.environ["RUN_ROOT"]

MANIFEST = RUN_ROOT / "absolute_move_manifest.tsv"
SKIPLOG = RUN_ROOT / "absolute_skip_manifest.tsv"
REFLOG = RUN_ROOT / "absolute_reference_rewrites.tsv"
ROLLBACK = RUN_ROOT / "absolute_rollback_moves.sh"
SUMMARY = RUN_ROOT / "absolute_summary.json"

TEXT_SUFFIXES = {
    ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
    ".json", ".jsonc", ".md", ".mdx", ".txt", ".sh",
    ".py", ".yml", ".yaml", ".toml", ".css", ".sql",
}

ROOT_KEEP = {
    ".env.local",
    ".github",
    ".gitignore",
    ".vercel",
    ".vercelignore",
    "AGENTS.md",
    "GEMINI.md",
    "README.md",
    "data",          # ignored local raw staging; preserve exactly, not canonical
    "docs",
    "eslint.config.js",
    "next-env.d.ts",
    "next.config.js",
    "node_modules",
    "package-lock.json",
    "package.json",
    "postcss.config.js",
    "public",
    "reports",
    "scripts",
    "secrets",
    "src",
    "supabase",
    "tailwind.config.ts",
    "tsconfig.json",
    "vercel.json",
}

def rel(p: Path) -> str:
    return p.relative_to(ROOT).as_posix()

def sh_quote(s: str) -> str:
    return "'" + s.replace("'", "'\"'\"'") + "'"

def run(cmd):
    return subprocess.run(cmd, cwd=ROOT, text=True, capture_output=True)

def is_tracked(p: Path) -> bool:
    return run(["git", "ls-files", "--error-unmatch", rel(p)]).returncode == 0

def sha256_file(p: Path) -> str:
    if not p.exists() or not p.is_file():
        return ""
    h = hashlib.sha256()
    with p.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()

def unique_dest(dest: Path) -> Path:
    if not dest.exists():
        return dest
    parent = dest.parent
    name = dest.name
    for i in range(1, 10000):
        cand = parent / f"{name}__collision_{i}"
        if not cand.exists():
            return cand
    raise RuntimeError(f"collision overflow: {dest}")

def append(path: Path, text: str):
    with path.open("a", encoding="utf-8") as f:
        f.write(text)

def ensure_logs():
    RUN_ROOT.mkdir(parents=True, exist_ok=True)
    if not MANIFEST.exists():
        MANIFEST.write_text("action\tsource\tdestination\ttracked\tbefore_sha256\tafter_sha256\treason\n", encoding="utf-8")
    if not SKIPLOG.exists():
        SKIPLOG.write_text("action\tsource\tdestination\treason\tdetail\n", encoding="utf-8")
    if not REFLOG.exists():
        REFLOG.write_text("old_path\tnew_path\tfile\tcount\n", encoding="utf-8")
    if not ROLLBACK.exists():
        ROLLBACK.write_text("#!/usr/bin/env bash\nset -euo pipefail\ncd " + sh_quote(str(ROOT)) + "\n", encoding="utf-8")
        ROLLBACK.chmod(0o700)

def move_any(src_rel: str, dest_rel: str, reason: str):
    src = ROOT / src_rel
    dest = unique_dest(ROOT / dest_rel)

    if not src.exists():
        append(SKIPLOG, f"SKIP_MISSING\t{src_rel}\t{rel(dest)}\t{reason}\tmissing\n")
        return False

    if src_rel in ROOT_KEEP:
        append(SKIPLOG, f"SKIP_ROOT_KEEP\t{src_rel}\t{rel(dest)}\t{reason}\tprotected root keep\n")
        return False

    dest.parent.mkdir(parents=True, exist_ok=True)

    tracked = is_tracked(src)
    before_hash = sha256_file(src)

    if tracked:
        r = run(["git", "mv", src_rel, rel(dest)])
        if r.returncode != 0:
            append(SKIPLOG, f"SKIP_GIT_MV_FAILED\t{src_rel}\t{rel(dest)}\t{reason}\t{(r.stderr or r.stdout).strip()}\n")
            return False
    else:
        shutil.move(str(src), str(dest))

    after_hash = sha256_file(dest)

    append(MANIFEST, f"MOVED\t{src_rel}\t{rel(dest)}\ttracked={tracked}\tbefore_sha256={before_hash}\tafter_sha256={after_hash}\treason={reason}\n")

    if tracked:
        append(ROLLBACK, f"git mv {sh_quote(rel(dest))} {sh_quote(src_rel)}\n")
    else:
        append(ROLLBACK, f"mkdir -p {sh_quote(str(Path(src_rel).parent))} && mv {sh_quote(rel(dest))} {sh_quote(src_rel)}\n")

    return True

def active_text_files():
    files = []
    for p in ROOT.rglob("*"):
        if not p.is_file():
            continue
        rp = rel(p)
        if rp.startswith(".git/") or rp.startswith("node_modules/") or rp.startswith(".next/"):
            continue
        if rp.startswith("docs/forensics/archive/"):
            continue
        if rp.startswith("data/") or rp.startswith("secrets/"):
            continue
        if p.suffix.lower() in TEXT_SUFFIXES or p.name in {"package.json", "tsconfig.json", "next.config.js", ".gitignore"}:
            try:
                if p.stat().st_size <= 3_000_000:
                    files.append(p)
            except OSError:
                pass
    return files

def rewrite_refs(mapping):
    files = active_text_files()
    for old, new in mapping.items():
        for p in files:
            try:
                txt = p.read_text(encoding="utf-8", errors="ignore")
            except Exception:
                continue
            if old not in txt:
                continue
            new_txt = txt.replace(old, new)
            if new_txt != txt:
                try:
                    p.write_text(new_txt, encoding="utf-8")
                    append(REFLOG, f"{old}\t{new}\t{rel(p)}\t{txt.count(old)}\n")
                except Exception as e:
                    append(SKIPLOG, f"SKIP_REF_REWRITE_FAILED\t{old}\t{new}\trewrite\t{rel(p)} {type(e).__name__}: {e}\n")

def mkdirs():
    dirs = [
        "docs/agent_context/indexes",
        "docs/agent_context/canonical",
        "docs/agent_context/source_drop/android_downloads_handpick_20260521",
        "docs/agent_context/source_drop/legacy_agent_context",
        "docs/agent_context/source_drop/legacy_ai_context",
        "docs/agent_context/source_drop/legacy_root_directives",
        "docs/agent_context/source_drop/gdrive_raw_manuscript_staging",
        "docs/agent_context/source_drop/large_compendiums",
        "docs/agent_context/source_drop/legacy_build_manifests",
        "docs/forensics/backups",
        "docs/forensics/dumps",
        "docs/forensics/logs",
        "docs/forensics/nos",
        "docs/forensics/audits",
        "scripts/diagnostics",
        "scripts/ingestion/google_drive",
        "scripts/ingestion/context",
        "scripts/nos",
        f"scripts/archive/{RUN_ROOT.name}",
    ]
    for d in dirs:
        (ROOT / d).mkdir(parents=True, exist_ok=True)

def classify_root_misc():
    moves = [
        # Context/read-order roots.
        ("AGENT_READ_CONTEXT_INDEX.md", "docs/agent_context/indexes/AGENT_READ_CONTEXT_INDEX.md", "project-local context index belongs under docs/agent_context/indexes"),
        ("AGENTS_README.md", "docs/agent_context/indexes/AGENTS_README.md", "small project-local agent readme pointer belongs under docs/agent_context/indexes"),
        ("ULTIMATE_OMEGA_DIRECTIVE.md", "docs/agent_context/source_drop/legacy_root_directives/ULTIMATE_OMEGA_DIRECTIVE.md", "legacy directive source-drop; not active root config"),

        # Root local forensic/runtime clutter.
        (".agent-context", "docs/agent_context/source_drop/legacy_agent_context/.agent-context", "legacy parallel agent context source-drop"),
        (".sandbox", f"{rel(RUN_ROOT)}/root_sandbox", "root sandbox evidence preserved in forensics archive"),
        (".nos", f"{rel(RUN_ROOT)}/root_nos", "root NOS local runtime/archive evidence preserved in forensics archive"),
        ("system", f"{rel(RUN_ROOT)}/legacy_system_root", "legacy root system surface preserved in forensics archive"),
        ("Build", f"{rel(RUN_ROOT)}/root_misc/Build", "nonstandard root file preserved in forensics archive"),
        ("parse-by-meaning.js.draft", f"{rel(RUN_ROOT)}/root_drafts/parse-by-meaning.js.draft", "draft root file preserved in forensics archive"),
        ("tsconfig.tsbuildinfo", f"{rel(RUN_ROOT)}/generated/tsconfig.tsbuildinfo", "generated TypeScript cache removed from root"),
        ("nos_manifest.json", "docs/forensics/nos/nos_manifest.json", "NOS manifest evidence belongs under docs/forensics/nos"),
    ]
    moved = 0
    for src, dest, reason in moves:
        if move_any(src, dest, reason):
            moved += 1
    return moved

def classify_docs_and_source_drops():
    moves = [
        ("docs/ai-context", "docs/agent_context/source_drop/legacy_ai_context/docs_ai_context", "legacy AI context preserved as source_drop"),
        ("src/data-layer/ingestion-buffer/gdrive_raw", "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw", "raw manuscript staging belongs in source_drop, not src"),
        ("src/data-layer/singularity/REFINED_LORE_SINGULARITY.txt", "docs/agent_context/source_drop/large_compendiums/REFINED_LORE_SINGULARITY.txt", "large compendium source-drop, not active src code"),
        ("src/data-layer/07_Build_Manifests", "docs/agent_context/source_drop/legacy_build_manifests/07_Build_Manifests", "legacy build manifests belong in source_drop"),
    ]
    moved = 0
    for src, dest, reason in moves:
        if move_any(src, dest, reason):
            moved += 1
    return moved

def classify_scripts():
    moves = [
        ("run_nos_diagnostics.sh", "scripts/diagnostics/run_nos_diagnostics.sh", "diagnostic script belongs under scripts/diagnostics"),
        ("test-db.js", "scripts/diagnostics/test-db.js", "diagnostic script belongs under scripts/diagnostics"),
        ("export_blueprints.sh", f"scripts/archive/{RUN_ROOT.name}/export_blueprints.sh", "one-off blueprint export script belongs under scripts/archive"),
        ("scripts/archive-google-docs-by-local-names.mjs", "scripts/ingestion/google_drive/archive-google-docs-by-local-names.mjs", "Google Drive ingestion script belongs under scripts/ingestion/google_drive"),
        ("scripts/extract_deep_history.py", "scripts/ingestion/google_drive/extract_deep_history.py", "Google Drive extraction script belongs under scripts/ingestion/google_drive"),
        ("scripts/stage-numbered-download-readme-docs.py", "scripts/ingestion/context/stage-numbered-download-readme-docs.py", "Android Downloads/readme staging script belongs under scripts/ingestion/context"),
        ("scripts/data-lineage-audit.sh", "scripts/diagnostics/data-lineage-audit.sh", "diagnostic audit script belongs under scripts/diagnostics"),
        ("scripts/nos_audit.sh", "scripts/diagnostics/nos_audit.sh", "NOS diagnostic script belongs under scripts/diagnostics"),
        ("scripts/nos_invoke.sh", "scripts/nos/nos_invoke.sh", "NOS operational script belongs under scripts/nos"),
        ("scripts/nos_sync.sh", "scripts/nos/nos_sync.sh", "NOS operational script belongs under scripts/nos"),
        ("scripts/build_files.sh", f"scripts/archive/{RUN_ROOT.name}/build_files.sh", "one-off generated build/export script belongs under scripts/archive"),
    ]
    moved = 0
    for src, dest, reason in moves:
        if move_any(src, dest, reason):
            moved += 1
    return moved

def classify_root_dump_like_files():
    # Move leftover root files that are clearly dumps/audits/logs/exports if present.
    patterns = [
        "full_codebase_dump.txt",
        "build.log",
        "build_debug.txt",
        "export_audit.txt",
        "import_audit.txt",
        "system_logic_audit.txt",
        "ui_ux_dump.txt",
        "tsc.log",
        "NOS_Core_Engine_Discovery_Dump.txt",
        "NOS_Critical_Files_Dump.txt",
        "NOS_Layout_Search_Discovery_Dump.txt",
        "NOS_Panel_Runtime_EMA_Dump.txt",
        "NOS_Remaining_23_Matrix_Dump.txt",
        "NOS_Responsive_Style_Config_Dump.txt",
        "NOS_Runtime_Discovery_Dump.txt",
    ]
    moved = 0
    for name in patterns:
        p = ROOT / name
        if not p.exists():
            continue
        if "Dump" in name or "dump" in name:
            dest = f"docs/forensics/dumps/{name}"
        elif "log" in name.lower():
            dest = f"docs/forensics/logs/{name}"
        else:
            dest = f"docs/forensics/audits/{name}"
        if move_any(name, dest, "leftover root forensic/audit/dump/log file"):
            moved += 1
    return moved

def write_indexes():
    # Keep these small, factual, and traceable.
    accession = ROOT / "docs/agent_context/indexes/ANDROID_DOWNLOADS_HANDPICK_ACCESSION_INDEX.md"
    accession.write_text(
        "# Android Downloads Hand-Pick Accession Index\n\n"
        "Source authority: `docs/agent_context/indexes/GOOGLE_CLI_AND_TERMUX_TERMINAL_README_DOCUMENTS.txt` when present.\n\n"
        "Purpose: map hand-picked internal-storage Downloads documents into project-local context homes.\n\n"
        "Canonical rule:\n\n"
        "- Verbatim originals belong in `docs/agent_context/source_drop/android_downloads_handpick_20260521/` or an equivalent source_drop folder.\n"
        "- Curated, stable truth belongs in `docs/agent_context/canonical/`.\n"
        "- Forensic dumps/logs belong in `docs/forensics/`.\n"
        "- Active code belongs in `src/` only.\n"
        "- No symlinks.\n\n"
        "Tier list from uploaded CLI/Termux document:\n\n"
        "- Tier 1: 013, 016, 024, 026, 029, 031, 034, 071, 072, 075, 095, 097, 089, 107, 111, 160\n"
        "- Tier 2: 077, 084, 097, 104, 123, 124, 134\n"
        "- Tier 3: 139, 140, 154, 199\n\n",
        encoding="utf-8"
    )

    cleanup_policy = ROOT / "docs/agent_context/indexes/CLEANUP_POLICY_INDEX.md"
    cleanup_policy.write_text(
        "# Cleanup Policy Index\n\n"
        "Policy source: IDA handoff and current repository state.\n\n"
        "Rules:\n\n"
        "1. Do not modify global `~/AGENTS.md` from this repo cleanup.\n"
        "2. Keep project-local context under `docs/agent_context/{canonical,indexes,source_drop,backups}`.\n"
        "3. Keep forensic/history evidence under `docs/forensics/`.\n"
        "4. Keep active code under `src/`.\n"
        "5. Keep browser-served assets/data under `public/`.\n"
        "6. Keep active reusable scripts under `scripts/`.\n"
        "7. Move one-off scripts to `scripts/archive/` or `docs/forensics/archive/`.\n"
        "8. Do not use symlinks.\n"
        "9. Do not treat raw ingestion as canonical truth.\n"
        "10. Verify references after moves.\n\n",
        encoding="utf-8"
    )

def rewrite_known_paths():
    mapping = {
        "AGENT_READ_CONTEXT_INDEX.md": "docs/agent_context/indexes/AGENT_READ_CONTEXT_INDEX.md",
        "AGENTS_README.md": "docs/agent_context/indexes/AGENTS_README.md",
        "ULTIMATE_OMEGA_DIRECTIVE.md": "docs/agent_context/source_drop/legacy_root_directives/ULTIMATE_OMEGA_DIRECTIVE.md",
        ".agent-context": "docs/agent_context/source_drop/legacy_agent_context/.agent-context",
        "docs/ai-context": "docs/agent_context/source_drop/legacy_ai_context/docs_ai_context",
        "src/data-layer/ingestion-buffer/gdrive_raw": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
        "src/data-layer/singularity/REFINED_LORE_SINGULARITY.txt": "docs/agent_context/source_drop/large_compendiums/REFINED_LORE_SINGULARITY.txt",
        "src/data-layer/07_Build_Manifests": "docs/agent_context/source_drop/legacy_build_manifests/07_Build_Manifests",
        "nos_manifest.json": "docs/forensics/nos/nos_manifest.json",
    }
    rewrite_refs(mapping)

def write_root_policy_report():
    rows = []
    for p in sorted(ROOT.iterdir(), key=lambda x: x.name.lower()):
        name = p.name
        if name == ".git":
            continue
        rows.append({
            "name": name,
            "type": "dir" if p.is_dir() else "file",
            "size": p.stat().st_size if p.exists() else None,
            "root_policy": "keep" if name in ROOT_KEEP else "review",
        })
    (RUN_ROOT / "root_policy_after_absolute_cleanup.json").write_text(json.dumps(rows, indent=2), encoding="utf-8")

def main():
    ensure_logs()
    mkdirs()

    counts = {}
    counts["root_misc_moved"] = classify_root_misc()
    counts["docs_source_drop_moved"] = classify_docs_and_source_drops()
    counts["scripts_moved"] = classify_scripts()
    counts["root_dump_like_moved"] = classify_root_dump_like_files()

    write_indexes()
    rewrite_known_paths()
    write_root_policy_report()

    summary = {
        "generated_utc": datetime.datetime.now(datetime.UTC).isoformat(),
        "run_root": rel(RUN_ROOT),
        **counts,
        "manifest": rel(MANIFEST),
        "skiplog": rel(SKIPLOG),
        "rewrites": rel(REFLOG),
        "rollback": rel(ROLLBACK),
    }
    SUMMARY.write_text(json.dumps(summary, indent=2), encoding="utf-8")
    print(json.dumps(summary, indent=2))

if __name__ == "__main__":
    main()
