#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
mkdir -p reports/perfect_weight

bash scripts/perfect_weight/01_inventory.sh
python3 scripts/perfect_weight/02_context_classifier.py
bash scripts/perfect_weight/03_code_data_map.sh
python3 scripts/perfect_weight/04_uiux_extract.py
python3 scripts/perfect_weight/05_contradiction_fork_map.py
bash scripts/perfect_weight/06_supabase_snapshot.sh || true
python3 scripts/perfect_weight/07_panel_truth_audit.py
python3 scripts/perfect_weight/08_next_100_actions.py
python3 scripts/perfect_weight/09_master_readme_builder.py

echo
echo "DONE. Main report:"
echo "reports/perfect_weight/09_WEIGHT_OF_THE_SKY_PERFECTION_README.md"
echo
ls -lh reports/perfect_weight

