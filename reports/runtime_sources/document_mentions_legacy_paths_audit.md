# Document Mentions of Legacy Paths

Generated: Fri Jun 12 22:32:17 MDT 2026

These are references inside staged documents. They are historical/source-context mentions, not necessarily app imports.

src/data-layer/ingestion-buffer/readme_docs/tier_1_core/071__CLAUDE_HONEST_ASSESSMENT_20260513.md:23:- Assumed Chapter 7 was at `src/data-layer/ingestion-buffer/gdrive_raw/(B)_Chapter_7:_The_Pit.txt` inside the writing-agent-interface project — it wasn't.
src/data-layer/ingestion-buffer/readme_docs/tier_1_core/089__First_Future_Feature.txt:254:find ~ -type f -name "*.txt" -path "*/gdrive_raw/*" | head -20
src/data-layer/ingestion-buffer/readme_docs/tier_1_core/160__PROJECT_HANDOFF_COMPLETE_CONTEXT-2.md:36:  - `ingestion-buffer/gdrive_raw/` — Local copies of Drive files (182 files, mostly .txt)
src/data-layer/ingestion-buffer/readme_docs/tier_1_core/160__PROJECT_HANDOFF_COMPLETE_CONTEXT-2.md:65:- **Local App:** 182 files in `ingestion-buffer/gdrive_raw/`
src/data-layer/ingestion-buffer/readme_docs/tier_1_core/160__PROJECT_HANDOFF_COMPLETE_CONTEXT-2.md:90:ls -1 ~/writing-agent-interface/src/data-layer/ingestion-buffer/gdrive_raw > ~/local_all.txt
src/data-layer/ingestion-buffer/readme_docs/tier_1_core/160__PROJECT_HANDOFF_COMPLETE_CONTEXT-2.md:155:User ran: `ls -1 ~/writing-agent-interface/src/data-layer/ingestion-buffer/gdrive_raw | head -50`
src/data-layer/ingestion-buffer/readme_docs/tier_1_core/160__PROJECT_HANDOFF_COMPLETE_CONTEXT-2.md:165:- User confirmed the path: `~/writing-agent-interface/src/data-layer/ingestion-buffer/gdrive_raw`
src/data-layer/ingestion-buffer/readme_docs/tier_1_core/160__PROJECT_HANDOFF_COMPLETE_CONTEXT-2.md:208:   find ~ -name "gdrive_raw" -type d
src/data-layer/ingestion-buffer/readme_docs/tier_1_core/160__PROJECT_HANDOFF_COMPLETE_CONTEXT-2.md:247:| Local files (supposedly) | `~/writing-agent-interface/src/data-layer/ingestion-buffer/gdrive_raw/` |
src/data-layer/ingestion-buffer/readme_docs/tier_1_core/014__Writing_Agent_App._Source_Doc._(8)_[COMBINED]_(1).txt:654: 5. **Corpus Audit:** Run find ./data-layer/ingestion-buffer/gdrive_raw -type f | wc -l to verify 181-file baseline.
src/data-layer/ingestion-buffer/readme_docs/tier_1_core/014__Writing_Agent_App._Source_Doc._(8)_[COMBINED]_(1).txt:659: 10. **Agnostic Mapping:** Start moving gdrive_raw files into src/data-layer/entities/entity-{01..25}.
src/data-layer/ingestion-buffer/readme_docs/tier_1_core/014__Writing_Agent_App._Source_Doc._(8)_[COMBINED]_(1).txt:723: 71. **Citation Verification:** Script to ensure UI chips match physical line numbers in gdrive_raw.
src/data-layer/ingestion-buffer/readme_docs/tier_2_large_universal/123__NEW_SEC_DOC_(1)_(1).txt:200:- 182+ chapter files in src/data-layer/ingestion-buffer/gdrive_raw/
src/data-layer/ingestion-buffer/readme_docs/tier_2_large_universal/123__NEW_SEC_DOC_(1)_(1).txt:434:│   │   │   ├── gdrive_raw
src/data-layer/ingestion-buffer/readme_docs/tier_2_large_universal/124__NEW_SEC_DOC_(1)_(2).txt:200:- 182+ chapter files in src/data-layer/ingestion-buffer/gdrive_raw/
src/data-layer/ingestion-buffer/readme_docs/tier_2_large_universal/124__NEW_SEC_DOC_(1)_(2).txt:434:│   │   │   ├── gdrive_raw
src/data-layer/ingestion-buffer/readme_docs/tier_2_large_universal/124__NEW_SEC_DOC_(1)_(2).txt:796:Every file in the ingestion-buffer/gdrive_raw/ is assigned a **Canonical Weight** based on the ema_history.json.
src/data-layer/ingestion-buffer/readme_docs/tier_2_large_universal/134__NOS_INTEGRATION_BLUEPRINT.txt:182:        - "src/data-layer/ingestion-buffer/gdrive_raw/**"
src/data-layer/ingestion-buffer/readme_docs/tier_2_large_universal/134__NOS_INTEGRATION_BLUEPRINT.txt:598:  Per Project Checkpoint §3, src/data-layer/ingestion-buffer/gdrive_raw/
src/data-layer/ingestion-buffer/readme_docs/tier_2_large_universal/134__NOS_INTEGRATION_BLUEPRINT.txt:635:      "src/data-layer/ingestion-buffer/gdrive_raw"
src/data-layer/ingestion-buffer/readme_docs/tier_2_large_universal/134__NOS_INTEGRATION_BLUEPRINT.txt:691:  1. Click sync. Verify gdrive_raw/ updates with new files.
src/data-layer/ingestion-buffer/readme_docs/tier_2_large_universal/134__NOS_INTEGRATION_BLUEPRINT.txt:694:PHASE 3.2 COMPLETE WHEN: gdrive_raw stays current automatically.
src/data-layer/ingestion-buffer/readme_docs/tier_2_large_universal/134__NOS_INTEGRATION_BLUEPRINT.txt:1298:  3. Export insights to gdrive_raw. The Drive sync from Phase 3.2 pulls them
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:23:31K 	 2026-05-17 16:10 	 ./src/data-layer/ingestion-buffer/gdrive_raw/Could_you_condense_that_chapter_by_500_to_1,000_w....txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:24:31K 	 2026-05-17 16:10 	 ./src/data-layer/ingestion-buffer/gdrive_raw/Chapter_1_Version_O.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:25:31K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(I)_Chapter:_1_Stardust_to_Stardust_.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:26:31K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(I)_(Notes)_Chapter:_1_Stardust_to_Stardust_.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:27:30K 	 2026-05-17 16:10 	 ./src/data-layer/ingestion-buffer/gdrive_raw/4.0_REVISED.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:28:30K 	 2026-05-17 16:10 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(Notes)_Chapter_2-_Living_Sacrifice.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:31:28K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/Chapter_8.1.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:32:28K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/Chapter_10_Forsaken_FINAL_DEFINITIVE.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:33:28K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/*Chapter_9:_The_Ascent.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:36:27K 	 2026-05-13 18:30 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(Final)
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:37:27K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/Chapter_9:_The_Ascent.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:38:27K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/Chapter_10.5.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:39:27K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/*Chapter_7:_The_Pit.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:40:27K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(F)_Chapter_1:_Stardust_to_Stardust_.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:41:27K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(C)_Chapter:_7_-_The_Pit.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:42:26K 	 2026-05-17 16:10 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(Notes)_Chapter_2:_Living_Sacrifice.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:43:26K 	 2026-05-17 16:10 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(Notes)_(P)_Chapter:_1_-_Stardust_to_Stardust.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:44:26K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/Go_ahead_and_write_out_the_chapter_keep_in_mind_t....txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:45:26K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/Chapter_11._Forsaken.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:46:26K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/Chapter_10_Version_F.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:47:26K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(Revision_Prompt_(N)__Chapter_1_-_Stardust_to_Stardust.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:48:25K 	 2026-05-17 16:10 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(P)_Chapter:_1_-_Stardust_to_Stardust.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:49:25K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/chapter_11.2.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:50:24K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/Whole_Book.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:51:24K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/Chapter_8:_Sea_People.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:52:24K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(C)_Chapter_6-_Beelzebub,_Beelzebub.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:53:23K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/•(G)_Chapter_2-_Living_Sacrifice.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:54:23K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/7.0_Nuclear_Edit!!!!_(CRITICAL!_DIRE!_EMERGENCY!!!).txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:55:23K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/*Chapter_8:_Sea_People.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:56:23K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(N)_CHAPTER_1-_STARDUST_TO_STARDUST.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:57:23K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(E)_Chapter_2-_Living_Sacrifice.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:58:23K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(E)_Chapter_1_-_Stardust_to_Stardust.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:59:23K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(D)_Chapter_1_-_Stardust_to_Stardust.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:60:23K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(A)_Chapter_3-_Lift_Up.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:61:23K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(A)Chapter_8:_Sea_People.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:62:22K 	 2026-05-17 16:10 	 ./src/data-layer/ingestion-buffer/gdrive_raw/Chapter:_10_-_MASTER_BRIEFING.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:63:22K 	 2026-05-17 16:10 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(R)_Chapter:_1_-_Stardust_to_Stardust_.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:64:22K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/Chapter_6:_Beelzebub,_Beelzebub.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:65:22K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/Chapter_1:_Stardust_to_Stardust.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:66:22K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/1.0_Revision.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:67:22K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(X)_Chapter_1__Stardust_to_Stardust_(2).txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:68:22K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(R)
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:69:22K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(Prompt_Guide_(E))_Chapter_10:_Forsaken.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:70:22K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(G)_Chapter_2-_Living_Sacrifice.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:71:22K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(F)_Chapter_2-_Living_Sacrifice.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:72:22K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(E)_Chapter_1-_Stardust_to_Stardust.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:73:22K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(C)_Chapter_3_-_Lift_Up.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:74:22K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(C)_Chapter_1-_Stardust_to_Stardust.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:75:22K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(B)_Chapter_6_-_Beelzebub,_Beelzebub.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:76:22K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(B)_Chapter_1:_Stardust_to_Stardust.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:77:22K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(A)_Chapter_6:_Beelzebub,_Beelzebub.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:78:22K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(A)_Chapter_1_-_Stardust_to_Stardust.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:79:21K 	 2026-05-17 16:10 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(SDP)_v2.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:80:21K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/Chapter_11.8.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:81:21K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/Chapter:_1_-_Stardust_to_Stardust.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:82:21K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(Z)_Chapter_1:_Stardust_to_Stardust.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:83:21K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(Revision_Prompt_(D))_Chapter_10:_Forsaken.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:84:21K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(Final)_Chapter_5_-_The_Snare.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:85:21K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(Final)_Chapter_3-_Lift_Up.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:86:21K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(Final)_Chapter_1_-_Stardust_to_Stardust.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:87:21K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(C)_Chapter_1_-_Stardust_to_Stardust.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:88:21K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(C)_Chapter:_Stardust_to_Stardust.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:89:21K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(C)_Chapter:_1_-_Stardust_to_Stardust_.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:90:21K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(B)_Chapter_7:_The_Pit.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:91:21K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(B)_Chapter_5-_The_Snare.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:92:21K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(B)_Chapter_3:_Lift_Up.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:93:21K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(B)_Chapter_3-_Lift_Up.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:94:21K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(B)_Chapter_1_-_Stardust_to_Stardust.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:95:21K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(A)_Chapter_1:_Stardust_to_Stardust.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:96:21K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(A)_Chapter_1-_Stardust_to_Stardust.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:97:20K 	 2026-05-17 16:10 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(Final)_Chapter_2-_Living_Sacrifice.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:98:20K 	 2026-05-17 16:10 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(C)_Chapter_4_-_Pilgrimage.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:99:20K 	 2026-05-17 16:10 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(B)_Chapter_2-_Living_Sacrifice.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:100:20K 	 2026-05-17 16:10 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(A)_Chapter_2-_Living_Sacrifice.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:102:20K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/Version_A.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:103:20K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/Chapter_3:_Lift_Up.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:104:20K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/Chapter_10.1.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:105:20K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/Chapter2_Weight_of_the_Sky.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:106:20K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/6.0_HIGHEST_PRIORITY_(Read_this_first_and_then_again_last)_.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:107:20K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/13.0_GENERAL_PRINCIPLES.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:108:20K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/*Chapter_3:_Lift_Up.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:109:20K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(X)_Chapter_1__Stardust_to_Stardust_(1).txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:110:20K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(X)_Chapter_1_-_Stardust_to_Stardust.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:111:20K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(X)_Chapter_1_-_Stardust_to_Stardust.docx.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:112:20K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(G)_Chapter_1:_Stardust_to_Stardust.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:113:20K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(Final)_Chapter_3:_Lift_Up.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:114:20K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(Final)_Chapter_1:_Stardust_to_Stardust.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:115:20K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(C)_Chapter_3-_Lift_Up.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:116:20K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(B)_Stardust_to_Stardust.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:117:20K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(B)_Chapter_9:_The_Ascent.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:118:20K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(B)_Chapter_1-_Stardust_to_Stardust.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:119:20K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(B)_Chapter:_1_Stardust_to_Stardust.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:120:20K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(B)Chapter_8:_Sea_People.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:121:20K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(A)_Chapter_5_-_The_Snare.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:122:20K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(A)_Chapter_3_-_Lift_Up.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:123:20K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(A)_Chapter:_1_Stardust_to_Stardust.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:124:19K 	 2026-05-17 16:10 	 ./src/data-layer/ingestion-buffer/gdrive_raw/Chapter_4:_Pilgrimage.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:125:19K 	 2026-05-17 16:10 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(D)_Chapter_2-_Living_Sacrifice.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:126:19K 	 2026-05-17 16:10 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(C)_Chapter_2-_Living_Sacrifice.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:127:19K 	 2026-05-17 16:10 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(B)_Chapter_2:_Living_Sacrifice.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:128:19K 	 2026-05-17 16:10 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(A)_Chapter_2:_Living_Sacrifice.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:129:19K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/﻿Chapter_1-_Stardust_to_Stardust.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:130:19K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/•(G)_Chapter:_1_Stardust_to_Stardust_.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:131:19K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/Version_B.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:132:19K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/Chapter_5:_The_Snare.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:133:19K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/Chapter_3_Analysis_&_Guides.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:134:19K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/Chapter_2:_Living_Sacrifice.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:135:19K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/Chapter_1_Integration_2.0.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:136:19K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/Chapter_1_-_Stardust_to_Stardust.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:137:19K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/*Chapter_2-_Living_Sacrifice.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:138:19K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/*Chapter_1:_Stardust_to_Stardust.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:139:19K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(X)_Chapter_1:_Stardust_to_Stardust.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:140:19K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(Revisions)_Chapter_1:_Stardust_to_Stardust.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:141:19K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(G)_Final_)_Chapter:_10_-_Forsaken.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:142:19K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(G)_Chapter_3-_Lift_Up.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:143:19K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(F)_Chapter_3-_Lift_Up.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:144:19K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(D)_Chapter_2_-_Living_Sacrifice.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:145:19K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(D)_Chapter:_7_-_The_Pit.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:146:18K 	 2026-05-17 16:10 	 ./src/data-layer/ingestion-buffer/gdrive_raw/*Chapter_4:_Pilgrimage.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:147:18K 	 2026-05-17 16:10 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(C)_Chapter_4-_Pilgrimage.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:148:18K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/The_scrape.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:149:18K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/Chapter_2_-_Analysis_&_Guides_1.0.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:150:18K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/Chapter:_1_Proof_of_Authorship_1.1.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:151:18K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(O)_Chapter_1-_Stardust_to_Stardust.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:152:18K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(N)_Chapter_1_-_Stardust_to_Stardust.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:154:17K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/WOS_Ch7_The_Pit.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:155:17K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/Chapter_2_-_Commerciality_and_Marketing_3.0.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:156:17K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/Chapter_1_Merge_Prompt.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:157:17K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/Chapter_13:_Exodus.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:158:17K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/Chapter_10:_Forsaken.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:159:17K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/Chapter:_8_(Final).txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:160:17K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(E)_Chapter_3-_Lift_Up.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:161:17K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(C)Chapter_8:_Sea_People.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:163:16K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(F)_Chapter_1_-_Stardust_to_Stardust.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:164:15K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/Chapter_2_-_Master_Revision_Prompt_2.0.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:165:15K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/8.0_Pacing／Redundancy.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:168:14K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/Critique_2.2.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:169:14K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/10.0_Mass_Market.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:170:13K 	 2026-05-17 16:10 	 ./src/data-layer/ingestion-buffer/gdrive_raw/5.0_Psychology_Guide.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:171:13K 	 2026-05-17 16:10 	 ./src/data-layer/ingestion-buffer/gdrive_raw/4.0_Psychology_Guide.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:172:13K 	 2026-05-17 16:10 	 ./src/data-layer/ingestion-buffer/gdrive_raw/10.0_MASTER_SYSTEM_FOR_CHAPTER_REVISION.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:173:13K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/The_Weight_of_the_Sky:_The_Fall_into_Megiddo.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:174:13K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/Chapter:_1_Proof_of_Authorship_1.0.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:175:13K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/2.0_Critique_／_Analysis_Guide.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:176:13K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(F)_Chapter:_1_Stardust_to_Stardust_.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:180:12K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/Narnia_.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:181:12K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/6.0_Supreme_Generative_Constraint.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:182:11K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/Untitled_document.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:183:11K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/(E)_Chapter_2_-_Living_Sacrifice.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:184:9.9K 	 2026-05-17 16:10 	 ./src/data-layer/ingestion-buffer/gdrive_raw/3.0_Scientific_Guide.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:185:9.2K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/5.0_Final_Guide.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:186:8.8K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/-Final_Chapter_1_Revision_Prompt-.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:189:8.3K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/9.0_Aesthetic.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:190:8.3K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/6.0_SYNTHESIS_MANDATE.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:191:8.1K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/13.0_Claude.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:192:7.8K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/11.0_Error_Catalog.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:194:7.5K 	 2026-05-17 16:10 	 ./src/data-layer/ingestion-buffer/gdrive_raw/11.0_Final_Revision.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:195:7.4K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/Chapter_2nd_to_last.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:196:7.1K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/Chapter_3_-_Master_Revision_Prompt_2.0.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:197:7.0K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/Chapter_1_Integration_Prompt.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:198:6.9K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/Final
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:199:6.8K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/3.0_Final_.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:201:6.5K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/THE_WEIGHT_OF_THE_SKY-_MASTER_COMPENDIUM_(SINGULARITY_v.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:204:6.3K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/12.0_Perfection.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:205:6.3K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/11.0_Marketability_.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:208:5.6K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/Chapter_1_Integration.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:213:5.0K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/3.0_Literary_&_Archetypal_Fusion_Rulebook_(The_Cat_God_&_The_Primal_Self).txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:217:4.7K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/Chapter
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:218:4.6K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/10.0_Blueprint_for_The_Ascent_of_Daniel:_The_Archetype_of_Sacrifice_(NYT_Bestseller_Focus).txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:220:4.5K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/2.0_This_is_the_critical_adjustment—the_final_layer_that_elevates_philosophical_storytelling_into_timeless,_devastating_human_tragedy.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:221:4.3K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/Chapter_3_Integration_Prompt.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:222:4.2K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/8._0_This_is_the_final,_most_crucial_step:_ensuring_the_narrative's_structure_is_so_perfectly_weighted_that_the_profound_sadness—the_weeping_of_self-recognition—is_not_a_chance_event,_but_an_earned,_inevitable_catharsis_for_the_reader.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:225:4.0K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/MANUSCRIPT_AUTOPSY.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:226:3.9K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/ToALITTERAS_ECOSYSTEM_v2.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:227:3.9K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/4.0_Emotional_&_Archetypal_Editing_Rulebook_(Visceral_Empathy_Focus).txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:228:3.7K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/6.0_Core_Editing_Rules_for_Thematic_&_Archetypal_Hyperlinking.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:229:3.6K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/7.0_Chapter_Refinery.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:230:3.6K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/4.0_(12_Rules_For_Life).txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:237:3.3K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/9.0_Stones.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:239:3.0K 	 2026-05-17 16:10 	 ./src/data-layer/ingestion-buffer/gdrive_raw/ALITTERAS_SYSTEM_BLUEPRINT_v1.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:245:2.5K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/Purple_Prose_Prompt.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:246:2.4K 	 2026-05-08 03:57 	 ./src/data-layer/ingestion-buffer/gdrive_raw/The_-Version_X-_Meta-Prompt.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/139__NOS_Master_Blueprints.txt:317:185 	 2026-05-12 06:11 	 ./src/data-layer/ingestion-buffer/node_manifest.json
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:339:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(A)Chapter_8:_Sea_People.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:344:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(A)_Chapter:_1_Stardust_to_Stardust.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:349:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(A)_Chapter_1-_Stardust_to_Stardust.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:354:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(A)_Chapter_1:_Stardust_to_Stardust.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:359:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(A)_Chapter_1_-_Stardust_to_Stardust.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:364:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(A)_Chapter_2-_Living_Sacrifice.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:369:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(A)_Chapter_2:_Living_Sacrifice.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:374:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(A)_Chapter_3-_Lift_Up.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:379:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(A)_Chapter_3_-_Lift_Up.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:384:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(A)_Chapter_5_-_The_Snare.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:389:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(A)_Chapter_6:_Beelzebub,_Beelzebub.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:394:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(B)Chapter_8:_Sea_People.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:399:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(B)_Chapter:_1_Stardust_to_Stardust.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:404:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(B)_Chapter_1-_Stardust_to_Stardust.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:409:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(B)_Chapter_1:_Stardust_to_Stardust.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:414:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(B)_Chapter_1_-_Stardust_to_Stardust.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:419:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(B)_Chapter_2-_Living_Sacrifice.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:424:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(B)_Chapter_2:_Living_Sacrifice.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:429:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(B)_Chapter_3-_Lift_Up.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:434:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(B)_Chapter_3:_Lift_Up.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:439:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(B)_Chapter_5-_The_Snare.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:444:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(B)_Chapter_6_-_Beelzebub,_Beelzebub.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:449:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(B)_Chapter_7:_The_Pit.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:454:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(B)_Chapter_9:_The_Ascent.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:459:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(B)_Stardust_to_Stardust.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:464:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(C)Chapter_8:_Sea_People.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:469:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(C)_Chapter:_1_-_Stardust_to_Stardust_.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:474:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(C)_Chapter:_7_-_The_Pit.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:479:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(C)_Chapter:_Stardust_to_Stardust.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:484:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(C)_Chapter_1-_Stardust_to_Stardust.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:489:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(C)_Chapter_1_-_Stardust_to_Stardust.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:494:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(C)_Chapter_2-_Living_Sacrifice.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:499:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(C)_Chapter_3-_Lift_Up.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:504:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(C)_Chapter_3_-_Lift_Up.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:509:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(C)_Chapter_4-_Pilgrimage.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:514:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(C)_Chapter_4_-_Pilgrimage.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:519:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(C)_Chapter_6-_Beelzebub,_Beelzebub.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:524:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(D)_Chapter:_7_-_The_Pit.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:529:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(D)_Chapter_1_-_Stardust_to_Stardust.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:534:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(D)_Chapter_2-_Living_Sacrifice.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:539:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(D)_Chapter_2_-_Living_Sacrifice.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:544:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(E)_Chapter_1-_Stardust_to_Stardust.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:549:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(E)_Chapter_1_-_Stardust_to_Stardust.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:554:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(E)_Chapter_2-_Living_Sacrifice.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:559:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(E)_Chapter_2_-_Living_Sacrifice.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:564:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(E)_Chapter_3-_Lift_Up.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:569:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(F)_Chapter:_1_Stardust_to_Stardust_.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:574:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(F)_Chapter_1:_Stardust_to_Stardust_.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:579:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(F)_Chapter_1_-_Stardust_to_Stardust.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:584:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(F)_Chapter_2-_Living_Sacrifice.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:589:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(F)_Chapter_3-_Lift_Up.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:594:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(Final)_Chapter_1:_Stardust_to_Stardust.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:599:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(Final)_Chapter_1_-_Stardust_to_Stardust.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:604:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(Final)_Chapter_2-_Living_Sacrifice.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:609:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(Final)_Chapter_3-_Lift_Up.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:614:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(Final)_Chapter_3:_Lift_Up.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:619:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(Final)_Chapter_5_-_The_Snare.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:624:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(G)_Chapter_1:_Stardust_to_Stardust.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:629:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(G)_Chapter_2-_Living_Sacrifice.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:634:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(G)_Chapter_3-_Lift_Up.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:639:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(G)_Final_)_Chapter:_10_-_Forsaken.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:644:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(I)_(Notes)_Chapter:_1_Stardust_to_Stardust_.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:649:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(I)_Chapter:_1_Stardust_to_Stardust_.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:654:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(N)_CHAPTER_1-_STARDUST_TO_STARDUST.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:659:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(N)_Chapter_1_-_Stardust_to_Stardust.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:664:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(Notes)_(P)_Chapter:_1_-_Stardust_to_Stardust.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:669:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(Notes)_Chapter_2-_Living_Sacrifice.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:674:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(Notes)_Chapter_2:_Living_Sacrifice.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:679:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(O)_Chapter_1-_Stardust_to_Stardust.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:684:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(P)_Chapter:_1_-_Stardust_to_Stardust.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:689:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(Prompt_Guide_(E))_Chapter_10:_Forsaken.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:694:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(R) Chapter: 1 - Stardust to Stardust .txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:699:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(R)_Chapter:_1_-_Stardust_to_Stardust_.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:704:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(Revision_Prompt_(D))_Chapter_10:_Forsaken.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:709:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(Revision_Prompt_(N)__Chapter_1_-_Stardust_to_Stardust.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:714:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(Revisions)_Chapter_1:_Stardust_to_Stardust.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:719:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(SDP)_v2.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:724:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(X)_Chapter_1:_Stardust_to_Stardust.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:729:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(X)_Chapter_1_-_Stardust_to_Stardust.docx.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:734:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(X)_Chapter_1_-_Stardust_to_Stardust.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:739:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(X)_Chapter_1__Stardust_to_Stardust_(1).txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:744:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(X)_Chapter_1__Stardust_to_Stardust_(2).txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:749:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/(Z)_Chapter_1:_Stardust_to_Stardust.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:754:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/*Chapter_1:_Stardust_to_Stardust.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:759:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/*Chapter_2-_Living_Sacrifice.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:764:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/*Chapter_3:_Lift_Up.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:769:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/*Chapter_4:_Pilgrimage.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:774:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/*Chapter_7:_The_Pit.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:779:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/*Chapter_8:_Sea_People.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:784:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/*Chapter_9:_The_Ascent.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:789:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/-Final_Chapter_1_Revision_Prompt-.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:794:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/1.0_Revision.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:799:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/10.0_Blueprint_for_The_Ascent_of_Daniel:_The_Archetype_of_Sacrifice_(NYT_Bestseller_Focus).txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:804:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/10.0_MASTER_SYSTEM_FOR_CHAPTER_REVISION.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:809:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/10.0_Mass_Market.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:814:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/11.0_Error_Catalog.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:819:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/11.0_Final_Revision.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:824:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/11.0_Marketability_.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:829:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/12.0_Perfection.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:834:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/13.0_Claude.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:839:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/13.0_GENERAL_PRINCIPLES.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:844:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/2.0_Critique_\uff0f_Analysis_Guide.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:849:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/2.0_This_is_the_critical_adjustment\u2014the_final_layer_that_elevates_philosophical_storytelling_into_timeless,_devastating_human_tragedy.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:854:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/3.0_Final_.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:859:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/3.0_Literary_&_Archetypal_Fusion_Rulebook_(The_Cat_God_&_The_Primal_Self).txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:864:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/3.0_Scientific_Guide.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:869:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/4.0_(12_Rules_For_Life).txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:874:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/4.0_Emotional_&_Archetypal_Editing_Rulebook_(Visceral_Empathy_Focus).txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:879:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/4.0_Psychology_Guide.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:884:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/4.0_REVISED.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:889:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/5.0_Final_Guide.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:894:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/5.0_Psychology_Guide.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:899:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/6.0_Core_Editing_Rules_for_Thematic_&_Archetypal_Hyperlinking.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:904:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/6.0_HIGHEST_PRIORITY_(Read_this_first_and_then_again_last)_.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:909:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/6.0_SYNTHESIS_MANDATE.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:914:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/6.0_Supreme_Generative_Constraint.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:919:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/7.0_Chapter_Refinery.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:924:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/7.0_Nuclear_Edit!!!!_(CRITICAL!_DIRE!_EMERGENCY!!!).txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:929:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/8.0_Pacing\uff0fRedundancy.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:934:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/8._0_This_is_the_final,_most_crucial_step:_ensuring_the_narrative's_structure_is_so_perfectly_weighted_that_the_profound_sadness\u2014the_weeping_of_self-recognition\u2014is_not_a_chance_event,_but_an_earned,_inevitable_catharsis_for_the_reader.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:939:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/9.0_Aesthetic.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:944:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/9.0_Stones.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:949:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/ALITTERAS_SYSTEM_BLUEPRINT_v1.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:954:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/Chapter 3 - Commerciality and Marketing 3.0.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:959:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/Chapter2_Weight_of_the_Sky.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:964:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/Chapter:_10_-_MASTER_BRIEFING.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:969:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/Chapter:_1_-_Stardust_to_Stardust.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:974:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/Chapter:_1_Proof_of_Authorship_1.0.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:979:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/Chapter:_1_Proof_of_Authorship_1.1.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:984:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/Chapter:_8_(Final).txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:989:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/Chapter_10.1.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:994:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/Chapter_10.5.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:999:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/Chapter_10:_Forsaken.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:1004:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/Chapter_10_Forsaken_FINAL_DEFINITIVE.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:1009:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/Chapter_10_Version_F.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:1014:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/Chapter_11.8.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:1019:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/Chapter_11._Forsaken.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:1024:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/Chapter_13:_Exodus.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:1029:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/Chapter_1:_Stardust_to_Stardust.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:1034:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/Chapter_1_-_Stardust_to_Stardust.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:1039:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/Chapter_1_Integration.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:1044:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/Chapter_1_Integration_2.0.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:1049:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/Chapter_1_Integration_Prompt.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:1054:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/Chapter_1_Merge_Prompt.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:1059:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/Chapter_1_Version_O.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:1064:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/Chapter_2:_Living_Sacrifice.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:1069:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/Chapter_2_-_Analysis_&_Guides_1.0.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:1074:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/Chapter_2_-_Commerciality_and_Marketing_3.0.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:1079:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/Chapter_2_-_Master_Revision_Prompt_2.0.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:1084:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/Chapter_2nd_to_last.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:1089:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/Chapter_3:_Lift_Up.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:1094:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/Chapter_3_-_Master_Revision_Prompt_2.0.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:1099:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/Chapter_3_Analysis_&_Guides.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:1104:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/Chapter_3_Integration_Prompt.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:1109:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/Chapter_4:_Pilgrimage.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:1114:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/Chapter_5:_The_Snare.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:1119:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/Chapter_6:_Beelzebub,_Beelzebub.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:1124:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/Chapter_8.1.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:1129:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/Chapter_8:_Sea_People.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:1134:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/Chapter_9:_The_Ascent.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:1139:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/Could_you_condense_that_chapter_by_500_to_1,000_w....txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:1144:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/Critique_2.2.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:1149:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/Final Revision (Generalized For All Chapters).txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:1154:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/Go_ahead_and_write_out_the_chapter_keep_in_mind_t....txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:1159:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/MANUSCRIPT_AUTOPSY.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:1164:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/Narnia_.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:1169:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/Purple_Prose_Prompt.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:1174:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/THE_WEIGHT_OF_THE_SKY-_MASTER_COMPENDIUM_(SINGULARITY_v.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:1179:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/The_-Version_X-_Meta-Prompt.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:1184:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/The_Weight_of_the_Sky:_The_Fall_into_Megiddo.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:1189:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/The_scrape.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:1194:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/ToALITTERAS_ECOSYSTEM_v2.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:1199:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/Untitled_document.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:1204:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/Version_A.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:1209:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/Version_B.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:1214:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/WOS_Ch7_The_Pit.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:1219:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/Whole_Book.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:1224:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/chapter_11.2.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:1229:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/\u2022(G)_Chapter:_1_Stardust_to_Stardust_.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:1234:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/\u2022(G)_Chapter_2-_Living_Sacrifice.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/140__NOS_Master_Diagnostic.txt:1239:      "file_path": "src/data-layer/ingestion-buffer/gdrive_raw/\ufeffChapter_1-_Stardust_to_Stardust.txt"
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/154__Project_Checkpoint_2.txt:71: 1. To ensure the API corpus orchestrator handles your data sources correctly without breaking current build links, what are the exact file names of the compendium and new synopsis documents inside gdrive_raw that we need to point the text parser toward?
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/154__Project_Checkpoint_2.txt:143:If your reference data files are empty, the NOS must build the graph programmatically. It does this by cross-analyzing the raw texts inside your gdrive_raw directory against your high-level synopsis structure.
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/154__Project_Checkpoint_2.txt:174:ls -la src/data-layer/ingestion-buffer/
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/154__Project_Checkpoint_2.txt:175:ls -la src/data-layer/ingestion-buffer/gdrive_raw/ 2>/dev/null
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/154__Project_Checkpoint_2.txt:187:drwx------.  2 u0_a448 u0_a448 24576 May 12 12:48 gdrive_raw
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/154__Project_Checkpoint_2.txt:410:./src/data-layer/ingestion-buffer/node_manifest.json
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/154__Project_Checkpoint_2.txt:411:./src/data-layer/ingestion-buffer/gdrive_raw/6.0_Core_Editing_Rules_for_Thematic_&_Archetypal_Hyperlinking.txt
src/data-layer/ingestion-buffer/readme_docs/tier_3_checkpoints/154__Project_Checkpoint_2.txt:637:│   │   │   ├── gdrive_raw
