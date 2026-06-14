#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail
set +H

DEST="${1:-data/source_archive/drive_temporal_xml_reextract/20260614_015110_local182_EXTRACT_UNITS_FULL}"
OUT="$DEST/supabase_manifest"
INDEX="$OUT/storage_shards/shard-index.tsv"
SQL_OUT="$OUT/register_manifest_shards.sql"

: "${SUPABASE_DB_URL:?Set SUPABASE_DB_URL to your Supabase Postgres connection string with sslmode=require}"

test -f "$INDEX" || { echo "Missing shard index: $INDEX"; exit 1; }

python - <<PY
from pathlib import Path
import csv, hashlib, json

index = Path("$INDEX")
sql_out = Path("$SQL_OUT")

def q(s):
    if s is None:
        return "null"
    return "'" + str(s).replace("'", "''") + "'"

rows = list(csv.DictReader(index.open(), delimiter="\t"))

batch_key = rows[0]["batch_key"] if rows else "unknown"
storage_prefix = batch_key

sql = []
sql.append("begin;")
sql.append("""
insert into nos.cloud_upload_batches (batch_key, storage_prefix, manifest_root, local_archive_root, status, totals)
values ({batch_key}, {storage_prefix}, 'supabase_manifest', {archive}, 'uploaded', '{{}}'::jsonb)
on conflict (batch_key) do update
set storage_prefix = excluded.storage_prefix,
    manifest_root = excluded.manifest_root,
    local_archive_root = excluded.local_archive_root,
    status = excluded.status;
""".format(
    batch_key=q(batch_key),
    storage_prefix=q(storage_prefix),
    archive=q("$DEST"),
))

for r in rows:
    sql.append("""
with b as (
  select id from nos.cloud_upload_batches where batch_key = {batch_key}
)
insert into nos.storage_objects (
  upload_batch_id,
  bucket_id,
  object_path,
  local_rel_path,
  artifact_kind,
  content_type,
  sha256_expected,
  byte_size_expected,
  verification_status,
  storage_metadata
)
select
  b.id,
  {bucket},
  {object_path},
  {source_rel},
  'manifest_shard',
  {content_type},
  {sha256},
  {byte_size},
  'uploaded',
  jsonb_build_object(
    'source_manifest_rel_path', {source_rel},
    'shard_index', {shard_index},
    'shard_count', {shard_count},
    'registered_by', 'register-shards-via-psql'
  )
from b
on conflict (bucket_id, object_path) do update
set upload_batch_id = excluded.upload_batch_id,
    local_rel_path = excluded.local_rel_path,
    artifact_kind = excluded.artifact_kind,
    content_type = excluded.content_type,
    sha256_expected = excluded.sha256_expected,
    byte_size_expected = excluded.byte_size_expected,
    verification_status = excluded.verification_status,
    storage_metadata = excluded.storage_metadata;

with b as (
  select id from nos.cloud_upload_batches where batch_key = {batch_key}
)
insert into nos.manifest_shards (
  upload_batch_id,
  bucket_id,
  object_path,
  source_manifest_rel_path,
  shard_index,
  shard_count,
  sha256,
  byte_size,
  content_encoding,
  metadata
)
select
  b.id,
  {bucket},
  {object_path},
  {source_rel},
  {shard_index},
  {shard_count},
  {sha256},
  {byte_size},
  'gzip',
  jsonb_build_object('local_path', {local_path})
from b
on conflict (upload_batch_id, source_manifest_rel_path, shard_index) do update
set bucket_id = excluded.bucket_id,
    object_path = excluded.object_path,
    shard_count = excluded.shard_count,
    sha256 = excluded.sha256,
    byte_size = excluded.byte_size,
    content_encoding = excluded.content_encoding,
    metadata = excluded.metadata;
""".format(
    batch_key=q(r["batch_key"]),
    bucket=q(r["bucket"]),
    object_path=q(r["object_path"]),
    source_rel=q(r["source_rel"]),
    content_type=q(r["content_type"]),
    sha256=q(r["sha256"]),
    byte_size=int(r["byte_size"]),
    shard_index=int(r["shard_index"]),
    shard_count=int(r["shard_count"]),
    local_path=q(r["local_path"]),
))

sql.append("commit;")
sql_out.write_text("\n".join(sql))
print(sql_out)
print("rows", len(rows))
PY

psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f "$SQL_OUT"

printf 'registered_shards_sql=%s\n' "$SQL_OUT"
