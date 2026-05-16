#!/bin/bash

# 1. Sync the Authority Manifest to the Nervous System
cp nos_manifest.json src/data-layer/initialization-metadata/node_manifest.json 2>/dev/null

# 2. Define the Output File
OUTFILE="nos_omni_handshake.txt"

{
    echo "--- NOS OMNI-HANDSHAKE AUDIT: $(date) ---"
    
    # [1/6] AUTHORITY MANIFEST CHECK
    MANIFEST="src/data-layer/initialization-metadata/node_manifest.json"
    echo -e "\n[1/6] AUTHORITY MANIFEST CHECK"
    if [ -f "$MANIFEST" ]; then
        NODES=$(jq '.nodes | length' "$MANIFEST")
        echo "MANIFEST FOUND: $MANIFEST"
        echo "TOTAL NODES INDEXED: $NODES"
    else
        echo "CRITICAL FAILURE: Manifest not found at $MANIFEST"
    fi

    # [2/6] PHYSICAL DISK LINKAGE
    echo -e "\n[2/6] PHYSICAL DISK LINKAGE"
    MISSING=0
    if [ -f "$MANIFEST" ]; then
        while IFS= read -r path; do
            [ ! -f "$path" ] && ((MISSING++))
        done < <(jq -r '.nodes[].file_path' "$MANIFEST" 2>/dev/null)
        echo "SUCCESSFUL HANDSHAKES: $((NODES - MISSING))"
        echo "BROKEN LINKS: $MISSING"
    fi

    # [3/6] ENGINE SIGNATURE AUDIT
    echo -e "\n[3/6] ENGINE SIGNATURE AUDIT"
    [ -d "src/services/memory-engine" ] && echo "MEMORY-ENGINE: ONLINE"
    [ -d "src/services/image-engine" ] && echo "IMAGE-ENGINE: ONLINE"
    [ -d "src/services/narrative-graph-engine" ] && echo "NARRATIVE-GRAPH-ENGINE: ONLINE"

    # [4/6] COMMERCE LAYER HANDSHAKE
    echo -e "\n[4/6] COMMERCE LAYER HANDSHAKE"
    CATALOG="src/data-layer/initialization-metadata/commerce_catalog.json"
    if [ -f "$CATALOG" ]; then
        echo "COMMERCE CATALOG: FOUND"
        PREMIUM_COUNT=$(jq '.nodes[] | select(.is_premium == true) | .id' "$MANIFEST" 2>/dev/null | wc -l)
        echo "PAID PRESCRIPTIONS GATED: $PREMIUM_COUNT"
    else
        echo "COMMERCE CATALOG: MISSING"
    fi

    # [5/6] METADATA ENRICHMENT
    echo -e "\n[5/6] METADATA ENRICHMENT"
    [ -f "src/data-layer/initialization-metadata/teasers.json" ] && echo "TEASER REGISTRY: ONLINE"
    if [ -f "$MANIFEST" ]; then
        HAS_PRESCRIPTION=$(jq '.nodes[] | select(.page_prescription != "" and .page_prescription != null) | .id' "$MANIFEST" 2>/dev/null | wc -l)
        echo "ACTIVE PAID PRESCRIPTIONS: $HAS_PRESCRIPTION"
    fi

    # [6/6] API SIMULATION: CHAPTER_10
    echo -e "\n[6/6] API SIMULATION: CHAPTER_10"
    if [ -f "$MANIFEST" ]; then
        NODE_10=$(jq -c '.nodes[] | select(.id | contains("10"))' "$MANIFEST" | head -n 1)
        if [ -n "$NODE_10" ]; then
            echo "ID: $(echo "$NODE_10" | jq -r '.id')"
            echo "COMMERCIAL STATUS: $(echo "$NODE_10" | jq -r '.is_premium')"
            echo "PRICE: $(echo "$NODE_10" | jq -r '.price')"
            echo "PRESCRIPTION BYTES: $(echo "$NODE_10" | jq -r '.page_prescription' | cut -c1-100)..."
        else
            echo "SIMULATION FAILED: Chapter 10 not found in manifest."
        fi
    fi

} > "$OUTFILE"

# 3. Export to Storage and Refresh
cp "$OUTFILE" ~/storage/downloads/
am broadcast -a android.intent.action.MEDIA_SCANNER_SCAN_FILE -d file:///sdcard/Download/"$OUTFILE"
echo "Audit complete. Check your phone's downloads for $OUTFILE"
