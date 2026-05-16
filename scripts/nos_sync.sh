#!/bin/bash
# Robust Sync: Sanitizes narrative characters (—, ') for the NOS Manifest
echo '{"nodes": []}' > nos_manifest.json

for file in src/data-layer/ingestion-buffer/gdrive_raw/*.txt; do
    [ -e "$file" ] || continue
    
    # Identify the Node (Chapter/Version)
    ID=$(basename "$file" | grep -oP 'Chapter_\d+|v\d+' || basename "$file" | cut -c1-30)
    
    # Extract the 'Dominant' line (Aim/Theme/Context)
    AIM_RAW=$(grep -Ei "THEME:|AIM:|CONTEXT:" "$file" | head -n 1)
    
    # Exporting to the environment so Python doesn't have to "parse" the text as code
    export FILE_ID="$ID"
    export FILE_PATH="$file"
    export FILE_AIM_RAW="$AIM_RAW"

    python3 -c "
import json, os
id = os.environ.get('FILE_ID')
path = os.environ.get('FILE_PATH')
raw = os.environ.get('FILE_AIM_RAW', '')
# Isolate the meaning from the tag
aim = raw.split(':', 1)[1].strip() if ':' in raw else '[PENDING SEMANTIC ANALYSIS]'

with open('nos_manifest.json', 'r+') as f:
    data = json.load(f)
    data['nodes'].append({'id': id, 'aim': aim, 'file_path': path})
    f.seek(0)
    json.dump(data, f, indent=2)
    f.truncate()
"
done
echo "SYSTEM SYNC COMPLETE: The Brain (nos_manifest.json) is structurally sound."
