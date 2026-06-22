You are Codex CLI inside the `writing-agent-interface` repo.

MISSION:
Finish the selected XML semantic write workflow safely.

HARD RULES:
- No broad recursive searches over `/`, `$HOME`, `Workspaces`, `Hybrid`, `/storage`, or parent directories.
- No unbounded `find`.
- No deleting files.
- No symlinks.
- No secrets printed.
- Do not stage unrelated dirty files.
- Do not stage package/UI/graph changes unless directly required.
- XML is source truth.
- Public chapters and context pack are cognition context only.
- Use `gemini-2.5-flash`, not `gemini-2.5-pro`.
- Do not implement Gemini Batch in this pass.

REPO:
`/data/data/com.termux/files/home/Workspaces/Hybrid/writing-agent-interface`

CURRENT BRANCH:
`cleanup/standard-app-tree`

DEFAULT BRANCH:
`master`

WORKFLOW COMMIT ALREADY PUSHED:
`d9a5e63 Add selected XML semantic write workflow`

PROBLEM:
GitHub workflow dispatch returned 404 because the workflow is not on default branch `master`.

IN-SCOPE FILES:
- `.github/workflows/apply-selected-xml-meaning-span-migration.yml`
- `.github/workflows/semantic-selected-xml-write.yml`
- `scripts/semantic/xml-selected-meaning-span-rehash.mjs`
- `supabase/migrations/20260619004000_selected_xml_primary_meaning_span_ledger.sql`
- `docs/agent_context/source_drop/hasher_context_v1/`
- `reports/xml_recovery/xml_starred_hash_truth.txt`
- `reports/xml_recovery/materialized_ooxml_manifest.json`
- `reports/xml_recovery/materialized_ooxml/`
- `reports/xml_recovery/selected_ooxml_repo_payload.json`
- `reports/xml_recovery/selected_ooxml_repo_payload.tsv`

KNOWN EXTERNAL OOXML SOURCE ROOT:
Use this exact root only:
`/data/data/com.termux/files/home/Workspaces/Hybrid/superior-semantic-prompt-context-20260618-092928/src/data-layer/ingestion-buffer/gdrive_ooxml_raw`

TARGET REPO PAYLOAD:
`reports/xml_recovery/materialized_ooxml/<folder>/word/document.xml`

SELECTED 16 HASH TRUTH:
0002_r_chapter_1_-_stardust_to_stardust_1tbodxyu5ezufogmr46f64o9u8fisifvmiaxn6qz_siq a3d94dd098c851050edebc3337929bdc24fbd0c617bac52cdecfb426cb691dcd
0003_g_chapter_2-_living_sacrifice_1liqobbwqqwnybdbuqqoxp9hdt2ddoq8nxzwiycwas0s 62d6fa1da11510d5acf29c4ef539697ecab3f51dbc9ab8e4f70349650a6b8eb0
0004_g_chapter_3-_lift_up_1xobnlljg3yy72d9i_360v-utttubr_5mhgn1ydmsrtk 4c43f128801df7d839bd5fda91fc148c0068a06a98530bf1c45d5fd004db3bcf
0005_final_chapter_5_-_the_snare_1lmmvyvwhmyuexbywewlh-rgpubirdpg7uper4gfh37g 05cffb295e9a217dc9e9eaf4101bddeceac6bf2dee41b9fbf5b7db13c47c9746
0006_final_chapter_6-_beelzebub_beelzebub_126vrnrfcocizrxxqdi8yhhjqym0oddgk772ykll5eqg 75678cddb9b409ece00c0e876788ca6d2c7052ada6225e671ac5766569f6b651
0007_chapter_8_final_1oc5a8cwy91hg-xdfrovutr8ojdcgrlw7lz7cbc_l5ki 8365bf4698d612ac840030130abdb7ab2493e765d8762540331f603dac94c1c2
0008_d_chapter_7_-_the_pit_1n_kgc1nqhcddho0mgy1niam7dvbsou3pgh8d4vcct34 820882dd747911211e140fd9ffd3a1a8a879f65acbdebf692e087077f4a3bf98
0009_final_chapter_9_the_ascent_1pihcifwbnqsvqjbzscu08jpdqzy-ymbjyomtcv_23u0 a1236450ce551d5fbe60d290403b39514678445071ef3208d0f4c0731c3000de
0010_final_chapter_4_-_pilgrimage_1opvdsohmwivq6fgqotsgpffksjcdai2kqtohsqkwwdu e96a02e5791d93a22b796aa6cff56d2ca96d7eae0869a73baa98b249528e7f04
0012_notes_p_chapter_1_-_stardust_to_stardust_1a7wqhttdqn9rxbcmsg2zja-cpkqyu4rqdw2awfjthjs db3da00bd1d210011a312c87dcdde1206cd31d68ce0d91b500ec2689cce5e73c
0013_prompt_guide_e_chapter_10_forsaken_1hgitz_aqyru0299o0n46bd_y_mrj7p33mnt_hxubbto fc0dd98de656c1d6463b59089ddd83f18544e78e1c4a5d1f9dc714bd26ce7fa8
0035_chapter1_q_final_1avkfastxedmov92zfajo2omrfjvbr81iiupgritauvk 47c9c8c0b00a8eea2cfbd536415e09b3f173cf9f0ff2a2b8a6a3693b4b9d7e20
0036_chapter_10.5_1j7uyiu5s0n_vig0-4dyeemsjjgdcqawbnexk9zus7pk 63d53636998c33c161d9b4eafc74c6a88730b3ece53c3aad51ead15b6dd5c261
0040_chapter_2nd_to_last_145l-3ahqh6xnn-lwhzeibm46do2dcuo_5lbcku_y6k4 f06a2b2bbb8a18be6418f403a93a9541f9be3b345642c12b4c9ed6f116205781
0052_the_weight_of_the_sky_the_fall_into_megiddo_1m3wuxh2oij7jb4rjybhjsqnfqxh0sdnv5bababjlzf0 836d48bf999db10ea7b36056c14274087c4433009e211731e037b0ba7c5e5a29
0057_wos_ch7_the_pit_1zmar8nipqxmhsyicxsv3gesidd4pgmqtofeewe0vwwi 2aacc14aac8f0b4dd4f9ada5a9157f999c77694360aedef65c6931af035e0a09

TASKS:
1. Prove current repo state with bounded commands:
   `pwd`
   `git branch --show-current`
   `gh repo view --json defaultBranchRef --jq '.defaultBranchRef.name'`
   `git status --short`
   `find .github/workflows -maxdepth 1 -type f -print | sort`

2. Prove required files exist:
   `scripts/semantic/xml-selected-meaning-span-rehash.mjs`
   `supabase/migrations/20260619004000_selected_xml_primary_meaning_span_ledger.sql`
   `docs/agent_context/source_drop/hasher_context_v1/narrative_context_pack_v1.txt`
   `reports/xml_recovery/xml_starred_hash_truth.txt`
   `reports/xml_recovery/materialized_ooxml_manifest.json`

3. Prove source root exists with:
   `test -d /data/data/com.termux/files/home/Workspaces/Hybrid/superior-semantic-prompt-context-20260618-092928/src/data-layer/ingestion-buffer/gdrive_ooxml_raw`

4. Copy only the selected 16 `word/document.xml` files by direct path into:
   `reports/xml_recovery/materialized_ooxml/<folder>/word/document.xml`

5. Verify copied count is 16 and all SHA-256 hashes match.

6. Inspect and minimally patch `scripts/semantic/xml-selected-meaning-span-rehash.mjs` if needed:
   - repo-local `reports/xml_recovery/materialized_ooxml` must be first/preferred source root.
   - API key should prefer:
     `const key = env("GOOGLE_API_KEY", env("GEMINI_API_KEY", ""));`
   - Preserve selected XML driver and blocked old semantic table writes.

7. Run:
   `node --check scripts/semantic/xml-selected-meaning-span-rehash.mjs`
   `VERTEX_MODEL=gemini-2.5-flash node scripts/semantic/xml-selected-meaning-span-rehash.mjs --no-ai --limit-docs=1 --limit=1 --batch-size=2`

8. Verify workflows:
   - `semantic-selected-xml-write.yml` has `workflow_dispatch`
   - uses `SUPABASE_ACCESS_TOKEN`
   - uses `SUPABASE_PROJECT_REF`
   - uses `GOOGLE_API_KEY`
   - defaults to `gemini-2.5-flash`
   - calls selected XML script
   - runs `--write`
   - runs no-AI canary before paid Gemini
   - applies/can apply selected migration.

9. Stage only in-scope files. Print:
   `git diff --cached --name-only`
   `git diff --check --cached`

10. Commit:
    `Add selected XML semantic source payload`

11. Push current branch.

12. Create PR to `master`, or create clean branch from `master` and cherry-pick only:
    - `d9a5e63`
    - new payload commit

FINAL REPORT:
Files changed, payload count, hash verification, canary result, workflow verification, commit hash, PR URL, blockers.
