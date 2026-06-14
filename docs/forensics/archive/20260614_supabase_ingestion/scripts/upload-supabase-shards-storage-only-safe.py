#!/usr/bin/env python3
from pathlib import Path
from urllib.parse import quote
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError
import csv
import os
import sys
import json
import time

def die(msg, code=1):
    print(msg, file=sys.stderr)
    raise SystemExit(code)

if len(sys.argv) != 2:
    die("usage: upload-supabase-shards-storage-only-safe.py <extract_dest_root>")

root = Path.cwd()
dest = Path(sys.argv[1])
out = dest / "supabase_manifest"
shards_root = out / "storage_shards"
index = shards_root / "shard-index.tsv"
log_dir = out / "storage_upload_logs"
log_dir.mkdir(parents=True, exist_ok=True)

supabase_url = os.environ.get("SUPABASE_URL", "").rstrip("/")
service_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

if not supabase_url:
    die("SUPABASE_URL is missing")
if not service_key:
    die("SUPABASE_SERVICE_ROLE_KEY is missing")
if not index.exists():
    die(f"missing shard index: {index}")

def pick(row, *names):
    for n in names:
        v = row.get(n)
        if v not in ("", None):
            return v
    return ""

def candidates_from_row(row, object_name):
    vals = []
    for k, v in row.items():
        if not v:
            continue
        if "part_" in v or "storage_shards" in v or v.endswith(".gz"):
            vals.append(v)

    source_rel = pick(row, "source_manifest_rel_path", "source_rel_path", "manifest_rel_path")
    part_index = pick(row, "part_index", "part", "shard_index")

    candidates = []

    for v in vals:
        p = Path(v)
        candidates.append(p)
        candidates.append(root / p)
        candidates.append(shards_root / p)
        candidates.append(out / p)
        candidates.append(dest / p)

    if "/manifests/" in object_name:
        rel = object_name.split("/manifests/", 1)[1]
        candidates.append(shards_root / rel)
        if "/part_" in rel:
            base = rel.rsplit("/", 1)[0]
            part = rel.rsplit("/", 1)[1]
            candidates.append(shards_root / f"{base}.parts" / part.replace(".gz", ""))
            if part.startswith("part_") and part.endswith(".gz"):
                n = part[len("part_"):-len(".gz")]
                try:
                    candidates.append(shards_root / f"{base}.parts" / f"part_{int(n):04d}")
                except Exception:
                    pass

    if source_rel and part_index != "":
        try:
            pi = int(part_index)
            candidates.append(shards_root / f"{source_rel}.parts" / f"part_{pi:04d}")
            candidates.append(shards_root / source_rel / f"part_{pi}.gz")
            candidates.append(shards_root / Path(source_rel).name / f"part_{pi}.gz")
        except Exception:
            candidates.append(shards_root / f"{source_rel}.parts" / f"part_{part_index}")
            candidates.append(shards_root / source_rel / f"part_{part_index}.gz")

    seen = set()
    unique = []
    for c in candidates:
        s = str(c)
        if s not in seen:
            seen.add(s)
            unique.append(c)

    return unique

def find_local_file(row, object_name):
    candidates = candidates_from_row(row, object_name)
    for c in candidates:
        if c.exists() and c.is_file():
            return c

    die(
        "could not locate local shard for object:\n"
        f"  object_name={object_name}\n"
        f"  row={json.dumps(row, indent=2)}\n"
        f"  tried={json.dumps([str(c) for c in candidates], indent=2)}"
    )

def upload(bucket, object_name, file_path):
    encoded_object = "/".join(quote(part, safe="") for part in object_name.split("/"))
    url = f"{supabase_url}/storage/v1/object/{quote(bucket, safe='')}/{encoded_object}"

    data = file_path.read_bytes()
    req = Request(
        url,
        data=data,
        method="POST",
        headers={
            "Authorization": f"Bearer {service_key}",
            "apikey": service_key,
            "Content-Type": "application/gzip",
            "Cache-Control": "3600",
            "x-upsert": "true",
        },
    )

    try:
        with urlopen(req, timeout=180) as resp:
            return resp.status, resp.read().decode("utf-8", errors="replace")
    except HTTPError as e:
        return e.code, e.read().decode("utf-8", errors="replace")
    except URLError as e:
        return 0, repr(e)

with index.open("r", newline="", errors="replace") as f:
    rows = list(csv.DictReader(f, delimiter="\t"))

print(f"shards_to_upload={len(rows)}")

ok = 0
for i, row in enumerate(rows, 1):
    bucket = pick(row, "bucket_id", "bucket", "bucket_name") or "nos-manifests"
    object_name = pick(row, "object_name", "object_path", "storage_object_name", "storage_path")

    if not object_name:
        die(f"row {i} has no object name: {row}")

    file_path = find_local_file(row, object_name)
    size = file_path.stat().st_size

    print(f"[{i}/{len(rows)}] upload bucket={bucket} object={object_name} local={file_path} bytes={size}")

    status, body = upload(bucket, object_name, file_path)
    log_path = log_dir / f"upload_{i:05d}.json"
    log_path.write_text(body)

    if 200 <= status < 300:
        ok += 1
        print(f"  OK http={status}")
    else:
        print(f"  FAIL http={status} response_log={log_path}")
        print(body[:1200])
        raise SystemExit(1)

    time.sleep(0.05)

print(f"UPLOAD_DONE ok={ok} failed=0")
