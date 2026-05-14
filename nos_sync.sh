#!/bin/bash
echo '{"nodes": []}' > nos_manifest.json
for file in src/data-layer/ingestion-buffer/gdrive_raw/*.txt; do
    [ -e "$file" ] || continue
    ID=$(basename "$file" | grep -oP 'Chapter_\d+|v\d+' || basename "$file" | cut -c1-10)
    AIM=$(grep -Ei "THEME:|AIM:|CONTEXT:" "$file" | head -n 1 | sed 's/.*: //' | tr -d '"')
    [ -z "$AIM" ] && AIM="[PENDING SEMANTIC ANALYSIS]"
    # Using python3 to safely build JSON if jq is acting up
    python3 -c "import json, sys; d=json.load(open('nos_manifest.json')); d['nodes'].append({'id': '$ID', 'aim': '$AIM', 'file_path': '$file'}); json.dump(d, open('nos_manifest.json', 'w'), indent=2)"
done
echo "BRAIN SYNCED: nos_manifest.json has been created."
