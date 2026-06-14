#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail
set +H

DEST="${1:-data/source_archive/drive_temporal_xml_reextract/20260614_015110_local182_EXTRACT_UNITS_FULL}"
OUT="$DEST/supabase_manifest"
SHARDS="$OUT/storage_shards"
BATCH_KEY="${BATCH_KEY:-20260614_015110_local182_EXTRACT_UNITS_FULL}"
MAX_BYTES="${MAX_BYTES:-5m}"

mkdir -p "$SHARDS"
rm -f "$SHARDS"/*

INDEX="$SHARDS/shard-index.tsv"
printf 'batch_key\tsource_rel\tshard_index\tshard_count\tbucket\tobject_path\tlocal_path\tsha256\tbyte_size\tcontent_type\n' > "$INDEX"

for f in "$OUT"/*.tsv "$OUT"/run_totals.json; do
  [ -f "$f" ] || continue
  base="$(basename "$f")"
  safe_base="${base// /_}"
  tmp="$SHARDS/${safe_base}.gz"

  gzip -c "$f" > "$tmp"

  mkdir -p "$SHARDS/${safe_base}.parts"
  split -b "$MAX_BYTES" -d -a 4 "$tmp" "$SHARDS/${safe_base}.parts/part_"
  rm -f "$tmp"

  count="$(find "$SHARDS/${safe_base}.parts" -type f | wc -l | tr -d ' ')"
  i=0
  for part in "$SHARDS/${safe_base}.parts"/part_*; do
    sha="$(sha256sum "$part" | awk '{print $1}')"
    bytes="$(wc -c < "$part" | tr -d ' ')"
    object_path="$BATCH_KEY/manifests/$safe_base/part_${i}.gz"
    printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n' \
      "$BATCH_KEY" \
      "supabase_manifest/$base" \
      "$i" \
      "$count" \
      "nos-manifests" \
      "$object_path" \
      "$part" \
      "$sha" \
      "$bytes" \
      "application/gzip" >> "$INDEX"
    i=$((i+1))
  done
done

printf 'shard_index=%s\n' "$INDEX"
printf 'shard_count='
awk 'NR>1{n++} END{print n+0}' "$INDEX"
printf 'total_shard_size='
du -ch "$SHARDS" | awk '/total/{print $1}'
