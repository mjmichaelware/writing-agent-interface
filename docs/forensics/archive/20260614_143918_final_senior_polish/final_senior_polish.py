from pathlib import Path
import os, shutil, subprocess, json, datetime, hashlib

ROOT = Path.cwd()
RUN_ROOT = ROOT / os.environ["RUN_ROOT"]

PRIVATE_ROOT = Path.home() / ".nos_private" / "writing-agent-interface"
PRIVATE_ROOT.mkdir(parents=True, exist_ok=True)

MANIFEST = RUN_ROOT / "polish_move_manifest.tsv"
SKIPLOG = RUN_ROOT / "polish_skip_manifest.tsv"
REFLOG = RUN_ROOT / "polish_reference_hits.tsv"
ROLLBACK = RUN_ROOT / "polish_rollback.sh"

TEXT_SUFFIXES = {
    ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
    ".json", ".jsonc", ".md", ".txt", ".sh", ".py",
    ".yml", ".yaml", ".toml", ".css", ".sql"
}

ACTIVE_PREFIXES = (
    "src/",
    "scripts/",
    "supabase/functions/",
    ".github/workflows/",
)

ACTIVE_EXACT = {
    "package.json",
    "package-lock.json",
    "next.config.js",
    "tsconfig.json",
    "tailwind.config.ts",
    "postcss.config.js",
    "eslint.config.js",
    "vercel.json",
    ".gitignore",
    "AGENTS.md",
    "GEMINI.md",
    "README.md",
}

def rel(p: Path) -> str:
    try:
        return p.relative_to(ROOT).as_posix()
    except ValueError:
        return str(p)

def sh_quote(s: str) -> str:
    return "'" + s.replace("'", "'\"'\"'") + "'"

def run(cmd):
    return subprocess.run(cmd, cwd=ROOT, text=True, capture_output=True)

def is_tracked(p: Path) -> bool:
    if not p.exists():
        return False
    return run(["git", "ls-files", "--error-unmatch", rel(p)]).returncode == 0

def sha256_file(p: Path) -> str:
    if not p.is_file():
        return ""
    h = hashlib.sha256()
    with p.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()

def append(path: Path, line: str):
    with path.open("a", encoding="utf-8") as f:
        f.write(line)

def active_files():
    files = []
    for p in ROOT.rglob("*"):
        if not p.is_file():
            continue
        rp = rel(p)
        if rp.startswith(".git/") or rp.startswith("node_modules/") or rp.startswith(".next/"):
            continue
        if rp.startswith("docs/forensics/archive/"):
            continue
        if rp.startswith("data/source_archive/"):
            continue
        if rp.startswith("secrets/"):
            continue
        if rp in ACTIVE_EXACT or any(rp.startswith(pref) for pref in ACTIVE_PREFIXES):
            if p.suffix.lower() in TEXT_SUFFIXES or p.name in ACTIVE_EXACT:
                try:
                    if p.stat().st_size <= 3_000_000:
                        files.append(p)
                except OSError:
                    pass
    return files

ACTIVE_FILES = active_files()

def references_path(token: str):
    hits = []
    for f in ACTIVE_FILES:
        try:
            txt = f.read_text(encoding="utf-8", errors="ignore")
        except Exception:
            continue
        if token in txt:
            hits.append(rel(f))
    return hits

def unique_dest(dest: Path) -> Path:
    if not dest.exists():
        return dest
    for i in range(1, 10000):
        cand = dest.with_name(dest.name + f"__collision_{i}")
        if not cand.exists():
            return cand
    raise RuntimeError(f"collision overflow for {dest}")

def move_repo_path(src: Path, dest: Path, reason: str):
    if not src.exists():
        append(SKIPLOG, f"SKIP_MISSING\t{rel(src)}\t{rel(dest)}\t{reason}\n")
        return False

    dest = unique_dest(dest)
    dest.parent.mkdir(parents=True, exist_ok=True)

    tracked = is_tracked(src)
    before = sha256_file(src)

    if tracked:
        r = run(["git", "mv", rel(src), rel(dest)])
        if r.returncode != 0:
            append(SKIPLOG, f"SKIP_GIT_MV_FAILED\t{rel(src)}\t{rel(dest)}\t{reason}\t{(r.stderr or r.stdout).strip()}\n")
            return False
    else:
        shutil.move(str(src), str(dest))

    after = sha256_file(dest)

    append(MANIFEST, f"MOVED\t{rel(src)}\t{rel(dest)}\ttracked={tracked}\tbefore_sha256={before}\tafter_sha256={after}\treason={reason}\n")

    if tracked:
        append(ROLLBACK, f"git mv {sh_quote(rel(dest))} {sh_quote(rel(src))}\n")
    else:
        append(ROLLBACK, f"mkdir -p {sh_quote(str(Path(rel(src)).parent))} && mv {sh_quote(rel(dest))} {sh_quote(rel(src))}\n")

    return True

def move_outside_repo(src: Path, dest: Path, reason: str, token: str):
    if not src.exists():
        append(SKIPLOG, f"SKIP_MISSING\t{rel(src)}\t{dest}\t{reason}\n")
        return False

    hits = references_path(token)
    if hits:
        append(SKIPLOG, f"SKIP_REFERENCED\t{rel(src)}\t{dest}\t{reason}\t{json.dumps(hits)}\n")
        for h in hits:
            append(REFLOG, f"{token}\t{h}\n")
        return False

    dest = unique_dest(dest)
    dest.parent.mkdir(parents=True, exist_ok=True)

    if is_tracked(src):
        append(SKIPLOG, f"SKIP_TRACKED_OUTSIDE_REPO\t{rel(src)}\t{dest}\t{reason}\ttracked path not moved outside repo\n")
        return False

    shutil.move(str(src), str(dest))
    append(MANIFEST, f"MOVED_OUTSIDE_REPO\t{rel(src)}\t{dest}\ttracked=False\tbefore_sha256=\tafter_sha256=\treason={reason}\n")
    append(ROLLBACK, f"mkdir -p {sh_quote(str(src.parent))} && mv {sh_quote(str(dest))} {sh_quote(str(src))}\n")
    return True

def init_logs():
    MANIFEST.write_text("action\tsource\tdestination\ttracked\tbefore_sha256\tafter_sha256\treason\n", encoding="utf-8")
    SKIPLOG.write_text("action\tsource\tdestination\treason\tdetail\n", encoding="utf-8")
    REFLOG.write_text("token\tactive_ref_file\n", encoding="utf-8")
    ROLLBACK.write_text("#!/usr/bin/env bash\nset -euo pipefail\ncd " + sh_quote(str(ROOT)) + "\n", encoding="utf-8")
    ROLLBACK.chmod(0o700)

def polish_backups():
    moved = 0
    backup_root = ROOT / "docs/forensics/backups" / RUN_ROOT.name
    backup_root.mkdir(parents=True, exist_ok=True)

    for p in list((ROOT / "src").rglob("*.bak")) + list((ROOT / "src").rglob("*.bak.*")):
        dest = backup_root / "src" / rel(p)
        if move_repo_path(p, dest, "backup file should not live in active src tree"):
            moved += 1

    for p in list((ROOT / "scripts").glob("*.bak*")):
        dest = backup_root / "scripts" / p.name
        if move_repo_path(p, dest, "backup file should not live in active scripts root"):
            moved += 1

    return moved

def polish_local_private():
    moved = 0

    # Preserve active runtime data. Move only bulky source archive if active code does not reference it.
    source_archive = ROOT / "data/source_archive"
    if source_archive.exists():
        if move_outside_repo(
            source_archive,
            PRIVATE_ROOT / "source_archive",
            "local raw/source archive should not pollute visible repo root tree",
            "data/source_archive",
        ):
            moved += 1

    # Keep data/runtime_sources if present; current runtime-source path may depend on it.
    # Move secrets out of repo only if active code/scripts do not reference secrets/.
    secrets = ROOT / "secrets"
    if secrets.exists():
        if move_outside_repo(
            secrets,
            PRIVATE_ROOT / "secrets",
            "local credentials/secrets should not sit in repo tree",
            "secrets/",
        ):
            moved += 1

    return moved

def write_standard_doc():
    p = ROOT / "docs/agent_context/indexes/PROJECT_STRUCTURE_STANDARD.md"
    p.write_text(
        "# Project Structure Standard\n\n"
        "Repository root is reserved for application entrypoints, package/build configuration, and first-read agent files.\n\n"
        "## Root keepers\n\n"
        "- `AGENTS.md`\n"
        "- `GEMINI.md`\n"
        "- `README.md`\n"
        "- package/config files\n"
        "- `src/`\n"
        "- `public/`\n"
        "- `supabase/`\n"
        "- `scripts/`\n"
        "- `reports/`\n"
        "- `docs/`\n"
        "- `data/runtime_sources/` only while active runtime readers reference it\n\n"
        "## Not root keepers\n\n"
        "- forensic dumps\n"
        "- terminal logs\n"
        "- one-off generated scripts\n"
        "- local secrets\n"
        "- raw source archives\n"
        "- backup files such as `*.bak`\n"
        "- parallel context systems such as `.agent-context/`\n\n"
        "## Canonical homes\n\n"
        "- `docs/agent_context/canonical/`: curated project-local truth\n"
        "- `docs/agent_context/indexes/`: read order, accession maps, cleanup policy, structure standards\n"
        "- `docs/agent_context/source_drop/`: preserved source docs not yet canonical truth\n"
        "- `docs/forensics/`: dumps, logs, backups, audits, preserved history\n"
        "- `reports/`: generated analysis outputs\n"
        "- `scripts/`: reusable operational scripts only\n\n"
        "No symlinks. No raw ingestion promoted to canonical truth without classification.\n",
        encoding="utf-8"
    )

def update_gitignore():
    p = ROOT / ".gitignore"
    txt = p.read_text(encoding="utf-8", errors="ignore") if p.exists() else ""
    block = """
# Senior cleanup local/private/generated surfaces
.env.local
.vercel/
.next/
node_modules/
tsconfig.tsbuildinfo
*.tsbuildinfo
Build
parse-by-meaning.js.draft

# Local private material
secrets/
data/source_archive/
"""
    if "# Senior cleanup local/private/generated surfaces" not in txt:
        p.write_text(txt.rstrip() + "\n\n" + block.strip() + "\n", encoding="utf-8")

def main():
    init_logs()

    moved_backups = polish_backups()
    moved_private = polish_local_private()
    write_standard_doc()
    update_gitignore()

    summary = {
        "generated_utc": datetime.datetime.now(datetime.UTC).isoformat(),
        "run_root": rel(RUN_ROOT),
        "moved_backup_files": moved_backups,
        "moved_local_private_surfaces": moved_private,
        "private_root": str(PRIVATE_ROOT),
        "manifest": rel(MANIFEST),
        "skiplog": rel(SKIPLOG),
        "reflog": rel(REFLOG),
        "rollback": rel(ROLLBACK),
    }
    (RUN_ROOT / "polish_summary.json").write_text(json.dumps(summary, indent=2), encoding="utf-8")
    print(json.dumps(summary, indent=2))

if __name__ == "__main__":
    main()
