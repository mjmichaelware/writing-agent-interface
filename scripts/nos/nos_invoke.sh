#!/bin/bash
NODE_ID=$1
DATA=$(python3 -c "import json, sys; d=json.load(open('docs/forensics/nos/docs/forensics/nos/nos_manifest.json')); print(next((n for n in d['nodes'] if n['id'] == '$NODE_ID'), 'None'))")
if [ "$DATA" == "None" ]; then echo "ERROR: NODE NOT FOUND"; exit 1; fi
clear
echo -e "\033[1;34m[NOS INVOCATION: $NODE_ID]\033[0m"
read -p "PRESS ENTER TO RELEASE PAYLOAD"
# Payload execution...
