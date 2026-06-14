#!/bin/bash
OUTPUT_FILE="$HOME/storage/downloads/NOS_Master_Diagnostic.txt"

echo "Running 25-Point Narrative OS Diagnostic..."
echo "Generating report at $OUTPUT_FILE"

echo "=== NARRATIVE OS MASTER DIAGNOSTIC REPORT ===" > "$OUTPUT_FILE"
echo "Timestamp: $(date)" >> "$OUTPUT_FILE"

echo -e "\n\n=== PHASE 1: SKELETON (Structure & Weight) ===" >> "$OUTPUT_FILE"
echo ">>> npm run build" >> "$OUTPUT_FILE"
npm run build >> "$OUTPUT_FILE" 2>&1
echo -e "\n>>> du -sh ./* | sort -hr" >> "$OUTPUT_FILE"
du -sh ./* | sort -hr >> "$OUTPUT_FILE" 2>&1
echo -e "\n>>> Lines of Code" >> "$OUTPUT_FILE"
find src -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.css" \) -exec wc -l {} + | sort -n >> "$OUTPUT_FILE" 2>&1
echo -e "\n>>> Dependency Tree (React/Next)" >> "$OUTPUT_FILE"
npm ls | grep -E "react|next|typescript" >> "$OUTPUT_FILE" 2>&1
echo -e "\n>>> Next.js Info" >> "$OUTPUT_FILE"
npx next info >> "$OUTPUT_FILE" 2>&1

echo -e "\n\n=== PHASE 2: NERVOUS SYSTEM (Events & Memory Leaks) ===" >> "$OUTPUT_FILE"
echo ">>> Rogue EventBus Instances" >> "$OUTPUT_FILE"
grep -rn "new EventBus" src/ >> "$OUTPUT_FILE" 2>&1
echo -e "\n>>> Rogue DOM Listeners" >> "$OUTPUT_FILE"
grep -rn "addEventListener" src/components/ >> "$OUTPUT_FILE" 2>&1
echo -e "\n>>> Leaking useState in 3D Canvas" >> "$OUTPUT_FILE"
grep -rn "useState" src/components/layers/ src/app/ | grep -v "SystemTab" >> "$OUTPUT_FILE" 2>&1
echo -e "\n>>> Active Event Subscribers (bus.on)" >> "$OUTPUT_FILE"
grep -rn "bus.on" src/ >> "$OUTPUT_FILE" 2>&1
echo -e "\n>>> Active Event Triggers (bus.emit)" >> "$OUTPUT_FILE"
grep -rn "bus.emit" src/ >> "$OUTPUT_FILE" 2>&1

echo -e "\n\n=== PHASE 3: BRAIN (APIs & Memory Engine) ===" >> "$OUTPUT_FILE"
echo ">>> Database Connection Test" >> "$OUTPUT_FILE"
node test-db.js >> "$OUTPUT_FILE" 2>&1
echo -e "\n>>> Groq API Ping" >> "$OUTPUT_FILE"
curl -s -I https://api.groq.com/openai/v1/models | head -n 1 >> "$OUTPUT_FILE" 2>&1
echo -e "\n>>> Supabase API Ping" >> "$OUTPUT_FILE"
curl -s -I https://api.supabase.com | head -n 1 >> "$OUTPUT_FILE" 2>&1
echo -e "\n>>> Environment Variable Injections" >> "$OUTPUT_FILE"
grep -rn "process.env" src/ >> "$OUTPUT_FILE" 2>&1
echo -e "\n>>> Vercel Cloud Environment" >> "$OUTPUT_FILE"
vercel env ls >> "$OUTPUT_FILE" 2>&1

echo -e "\n\n=== PHASE 4: PULSE (Internal Compass & Logic) ===" >> "$OUTPUT_FILE"
echo ">>> Manifest Node Verification" >> "$OUTPUT_FILE"
cat docs/forensics/nos/nos_manifest.json >> "$OUTPUT_FILE" 2>&1
echo -e "\n>>> API Route Audits" >> "$OUTPUT_FILE"
grep -rn "export async function" src/app/api/ >> "$OUTPUT_FILE" 2>&1
echo -e "\n>>> Package Scripts" >> "$OUTPUT_FILE"
cat package.json | grep -A 10 '"scripts"' >> "$OUTPUT_FILE" 2>&1

echo -e "\n\n=== PHASE 5: GLASS (Viewport & Interactions) ===" >> "$OUTPUT_FILE"
echo ">>> Hardware-Accelerated Observers" >> "$OUTPUT_FILE"
grep -rn "IntersectionObserver" src/ >> "$OUTPUT_FILE" 2>&1
echo -e "\n>>> Touch Targets (onClick)" >> "$OUTPUT_FILE"
grep -rn "onClick" src/components/ >> "$OUTPUT_FILE" 2>&1
echo -e "\n>>> Git Status" >> "$OUTPUT_FILE"
git status >> "$OUTPUT_FILE" 2>&1
echo -e "\n>>> Latest Commit Timeline" >> "$OUTPUT_FILE"
git log -1 >> "$OUTPUT_FILE" 2>&1

echo "Diagnostic complete. Triggering Android media scanner..."
termux-media-scan "$OUTPUT_FILE"
echo "Done! Open your phone's file manager and check the Downloads folder for 'NOS_Master_Diagnostic.txt'."
