from pathlib import Path
import shutil
import hashlib
import json
import re

DOWNLOAD = Path("/sdcard/Download")
DEST_ROOT = Path("src/data-layer/ingestion-buffer/readme_docs")

FILES = [
    # Tier 1 core
    ("tier_1_core", "013", "Writing Agent App. Source Doc. (4) [TERMUX].txt.txt"),
    ("tier_1_core", "016", "229 (1).txt"),
    ("tier_1_core", "024", "Aesthetic & Implementation Mandate (1).txt"),
    ("tier_1_core", "026", "AI_CHECKPOINT_FINAL.txt"),
    ("tier_1_core", "029", "AI_INFORMATION_INTUITION.md"),
    ("tier_1_core", "031", "AI_READY_CHECKPOINT.txt"),
    ("tier_1_core", "034", "AIM BLUEPRINT.txt"),
    ("tier_1_core", "071", "CLAUDE_HONEST_ASSESSMENT_20260513.md"),
    ("tier_1_core", "072", "CLAUDE_HONEST_ASSESSMENT_v2_20260513.md"),
    ("tier_1_core", "075", "COMPARISON.txt"),
    ("tier_1_core", "095", "gdrive_raw_FULL_inventory.txt"),
    ("tier_1_core", "097", "GEMINI CLI PENULTIMATE OMEGA PROMPT.txt"),
    ("tier_1_core", "089", "First Future Feature.txt"),
    ("tier_1_core", "107", "Here is the absolute technical, structural, and behavioral inventory of every single element that must exist within your 4-layer UI-UX narrative runtime environment.txt"),
    ("tier_1_core", "111", "IMPOSSIBLE_TARGETS.txt"),
    ("tier_1_core", "160", "PROJECT_HANDOFF_COMPLETE_CONTEXT-2.md"),

    # Explicit extra
    ("tier_1_core", "014", "Writing Agent App. Source Doc. (8) [COMBINED] (1).txt"),

    # Tier 2 large/universal
    ("tier_2_large_universal", "077", "CONTRADICTION_MAP.txt"),
    ("tier_2_large_universal", "084", "DRIVE_NOT_LOCAL_RAW.txt"),
    ("tier_2_large_universal", "097", "GEMINI CLI PENULTIMATE OMEGA PROMPT.txt"),
    ("tier_2_large_universal", "104", "Give me the terminal commands to f------ get that.pdf"),
    ("tier_2_large_universal", "123", "NEW SEC DOC (1) (1).txt"),
    ("tier_2_large_universal", "124", "NEW SEC DOC (1) (2).txt"),
    ("tier_2_large_universal", "134", "NOS_INTEGRATION_BLUEPRINT.txt"),

    # Tier 3 checkpoints
    ("tier_3_checkpoints", "139", "NOS_Master_Blueprints.txt"),
    ("tier_3_checkpoints", "140", "NOS_Master_Diagnostic.txt"),
    ("tier_3_checkpoints", "154", "Project Checkpoint 2.txt"),
    ("tier_3_checkpoints", "199", "Termux Checkpoint (w- Gemini 1 (1).txt"),

    # Later queue: copied for preservation, not parsed now
    ("later_queue", "174", "REFINED_LORE_SINGULARITY.txt"),
]

def safe_name(name: str) -> str:
    cleaned = name.replace("\ufeff", "")
    cleaned = re.sub(r"[^\w.\-()+=,@\[\] ]+", "_", cleaned)
    cleaned = re.sub(r"\s+", "_", cleaned).strip("_")
    return cleaned[:180]

def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()

manifest = []
missing = []

for tier, num, filename in FILES:
    src = DOWNLOAD / filename
    dest_dir = DEST_ROOT / tier
    dest_dir.mkdir(parents=True, exist_ok=True)

    if not src.exists():
        missing.append({"num": num, "tier": tier, "name": filename, "expected_path": str(src)})
        continue

    dest = dest_dir / f"{num}__{safe_name(filename)}"

    try:
        if not dest.exists():
            shutil.copy2(src, dest)

        manifest.append({
            "num": num,
            "tier": tier,
            "original_name": filename,
            "source": str(src),
            "dest": str(dest),
            "bytes": dest.stat().st_size,
            "sha256": sha256(dest),
        })
    except PermissionError as e:
        missing.append({
            "num": num,
            "tier": tier,
            "name": filename,
            "expected_path": str(src),
            "error": "PermissionError",
            "detail": str(e),
        })
    except Exception as e:
        missing.append({
            "num": num,
            "tier": tier,
            "name": filename,
            "expected_path": str(src),
            "error": type(e).__name__,
            "detail": str(e),
        })

Path("reports").mkdir(exist_ok=True)
Path("reports/readme_docs_stage_manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
Path("reports/readme_docs_missing.json").write_text(json.dumps(missing, indent=2), encoding="utf-8")

index_lines = [
    "# Agent Read Context Index",
    "",
    "These files were copied from `/sdcard/Download` into active project ingestion/read context.",
    "They are not archives. They are meant to be readable by CLIs and ingestion tools.",
    "",
    "Root path:",
    "`src/data-layer/ingestion-buffer/readme_docs/`",
    "",
    "## Files",
    "",
]

for item in manifest:
    index_lines.append(f"- `{item['tier']}/{Path(item['dest']).name}` — source item {item['num']} — {item['original_name']}")

if missing:
    index_lines += ["", "## Missing", ""]
    for item in missing:
        index_lines.append(f"- {item['num']} — {item['name']}")

Path("AGENT_READ_CONTEXT_INDEX.md").write_text("\n".join(index_lines) + "\n", encoding="utf-8")

print(f"Copied/staged: {len(manifest)}")
print(f"Missing: {len(missing)}")
print("Wrote reports/readme_docs_stage_manifest.json")
print("Wrote reports/readme_docs_missing.json")
print("Wrote AGENT_READ_CONTEXT_INDEX.md")
