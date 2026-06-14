# Code-Only Runtime Path Audit

Generated: Fri Jun 12 22:32:05 MDT 2026

This searches app/source/script config files only.
It excludes staged source documents, generated reports, runtime corpus copies, node_modules, .next, and .git.

## App code and script references
src/data-layer/initialization-metadata/node_manifest.json:6:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)Chapter_8:_Sea_People.txt"
src/data-layer/initialization-metadata/node_manifest.json:11:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter:_1_Stardust_to_Stardust.txt"
src/data-layer/initialization-metadata/node_manifest.json:16:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_1-_Stardust_to_Stardust.txt"
src/data-layer/initialization-metadata/node_manifest.json:21:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_1:_Stardust_to_Stardust.txt"
src/data-layer/initialization-metadata/node_manifest.json:26:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_1_-_Stardust_to_Stardust.txt"
src/data-layer/initialization-metadata/node_manifest.json:31:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_2-_Living_Sacrifice.txt"
src/data-layer/initialization-metadata/node_manifest.json:36:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_2:_Living_Sacrifice.txt"
src/data-layer/initialization-metadata/node_manifest.json:41:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_3-_Lift_Up.txt"
src/data-layer/initialization-metadata/node_manifest.json:46:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_3_-_Lift_Up.txt"
src/data-layer/initialization-metadata/node_manifest.json:51:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_5_-_The_Snare.txt"
src/data-layer/initialization-metadata/node_manifest.json:56:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_6:_Beelzebub,_Beelzebub.txt"
src/data-layer/initialization-metadata/node_manifest.json:61:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)Chapter_8:_Sea_People.txt"
src/data-layer/initialization-metadata/node_manifest.json:66:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter:_1_Stardust_to_Stardust.txt"
src/data-layer/initialization-metadata/node_manifest.json:71:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_1-_Stardust_to_Stardust.txt"
src/data-layer/initialization-metadata/node_manifest.json:76:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_1:_Stardust_to_Stardust.txt"
src/data-layer/initialization-metadata/node_manifest.json:81:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_1_-_Stardust_to_Stardust.txt"
src/data-layer/initialization-metadata/node_manifest.json:86:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_2-_Living_Sacrifice.txt"
src/data-layer/initialization-metadata/node_manifest.json:91:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_2:_Living_Sacrifice.txt"
src/data-layer/initialization-metadata/node_manifest.json:96:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_3-_Lift_Up.txt"
src/data-layer/initialization-metadata/node_manifest.json:101:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_3:_Lift_Up.txt"
src/data-layer/initialization-metadata/node_manifest.json:106:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_5-_The_Snare.txt"
src/data-layer/initialization-metadata/node_manifest.json:111:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_6_-_Beelzebub,_Beelzebub.txt"
src/data-layer/initialization-metadata/node_manifest.json:116:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_7:_The_Pit.txt"
src/data-layer/initialization-metadata/node_manifest.json:121:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_9:_The_Ascent.txt"
src/data-layer/initialization-metadata/node_manifest.json:126:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Stardust_to_Stardust.txt"
src/data-layer/initialization-metadata/node_manifest.json:131:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)Chapter_8:_Sea_People.txt"
src/data-layer/initialization-metadata/node_manifest.json:136:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter:_1_-_Stardust_to_Stardust_.txt"
src/data-layer/initialization-metadata/node_manifest.json:141:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter:_7_-_The_Pit.txt"
src/data-layer/initialization-metadata/node_manifest.json:146:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter:_Stardust_to_Stardust.txt"
src/data-layer/initialization-metadata/node_manifest.json:151:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter_1-_Stardust_to_Stardust.txt"
src/data-layer/initialization-metadata/node_manifest.json:156:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter_1_-_Stardust_to_Stardust.txt"
src/data-layer/initialization-metadata/node_manifest.json:161:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter_2-_Living_Sacrifice.txt"
src/data-layer/initialization-metadata/node_manifest.json:166:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter_3-_Lift_Up.txt"
src/data-layer/initialization-metadata/node_manifest.json:171:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter_3_-_Lift_Up.txt"
src/data-layer/initialization-metadata/node_manifest.json:176:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter_4-_Pilgrimage.txt"
src/data-layer/initialization-metadata/node_manifest.json:181:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter_4_-_Pilgrimage.txt"
src/data-layer/initialization-metadata/node_manifest.json:186:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter_6-_Beelzebub,_Beelzebub.txt"
src/data-layer/initialization-metadata/node_manifest.json:191:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(D)_Chapter:_7_-_The_Pit.txt"
src/data-layer/initialization-metadata/node_manifest.json:196:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(D)_Chapter_1_-_Stardust_to_Stardust.txt"
src/data-layer/initialization-metadata/node_manifest.json:201:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(D)_Chapter_2-_Living_Sacrifice.txt"
src/data-layer/initialization-metadata/node_manifest.json:206:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(D)_Chapter_2_-_Living_Sacrifice.txt"
src/data-layer/initialization-metadata/node_manifest.json:211:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(E)_Chapter_1-_Stardust_to_Stardust.txt"
src/data-layer/initialization-metadata/node_manifest.json:216:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(E)_Chapter_1_-_Stardust_to_Stardust.txt"
src/data-layer/initialization-metadata/node_manifest.json:221:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(E)_Chapter_2-_Living_Sacrifice.txt"
src/data-layer/initialization-metadata/node_manifest.json:226:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(E)_Chapter_2_-_Living_Sacrifice.txt"
src/data-layer/initialization-metadata/node_manifest.json:231:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(E)_Chapter_3-_Lift_Up.txt"
src/data-layer/initialization-metadata/node_manifest.json:236:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(F)_Chapter:_1_Stardust_to_Stardust_.txt"
src/data-layer/initialization-metadata/node_manifest.json:241:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(F)_Chapter_1:_Stardust_to_Stardust_.txt"
src/data-layer/initialization-metadata/node_manifest.json:246:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(F)_Chapter_1_-_Stardust_to_Stardust.txt"
src/data-layer/initialization-metadata/node_manifest.json:251:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(F)_Chapter_2-_Living_Sacrifice.txt"
src/data-layer/initialization-metadata/node_manifest.json:256:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(F)_Chapter_3-_Lift_Up.txt"
src/data-layer/initialization-metadata/node_manifest.json:261:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Final)_Chapter_1:_Stardust_to_Stardust.txt"
src/data-layer/initialization-metadata/node_manifest.json:266:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Final)_Chapter_1_-_Stardust_to_Stardust.txt"
src/data-layer/initialization-metadata/node_manifest.json:271:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Final)_Chapter_2-_Living_Sacrifice.txt"
src/data-layer/initialization-metadata/node_manifest.json:276:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Final)_Chapter_3-_Lift_Up.txt"
src/data-layer/initialization-metadata/node_manifest.json:281:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Final)_Chapter_3:_Lift_Up.txt"
src/data-layer/initialization-metadata/node_manifest.json:286:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Final)_Chapter_5_-_The_Snare.txt"
src/data-layer/initialization-metadata/node_manifest.json:291:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(G)_Chapter_1:_Stardust_to_Stardust.txt"
src/data-layer/initialization-metadata/node_manifest.json:296:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(G)_Chapter_2-_Living_Sacrifice.txt"
src/data-layer/initialization-metadata/node_manifest.json:301:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(G)_Chapter_3-_Lift_Up.txt"
src/data-layer/initialization-metadata/node_manifest.json:306:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(G)_Final_)_Chapter:_10_-_Forsaken.txt"
src/data-layer/initialization-metadata/node_manifest.json:311:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(I)_(Notes)_Chapter:_1_Stardust_to_Stardust_.txt"
src/data-layer/initialization-metadata/node_manifest.json:316:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(I)_Chapter:_1_Stardust_to_Stardust_.txt"
src/data-layer/initialization-metadata/node_manifest.json:321:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(N)_CHAPTER_1-_STARDUST_TO_STARDUST.txt"
src/data-layer/initialization-metadata/node_manifest.json:326:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(N)_Chapter_1_-_Stardust_to_Stardust.txt"
src/data-layer/initialization-metadata/node_manifest.json:331:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Notes)_(P)_Chapter:_1_-_Stardust_to_Stardust.txt"
src/data-layer/initialization-metadata/node_manifest.json:336:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Notes)_Chapter_2-_Living_Sacrifice.txt"
src/data-layer/initialization-metadata/node_manifest.json:341:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Notes)_Chapter_2:_Living_Sacrifice.txt"
src/data-layer/initialization-metadata/node_manifest.json:346:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(O)_Chapter_1-_Stardust_to_Stardust.txt"
src/data-layer/initialization-metadata/node_manifest.json:351:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(P)_Chapter:_1_-_Stardust_to_Stardust.txt"
src/data-layer/initialization-metadata/node_manifest.json:356:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Prompt_Guide_(E))_Chapter_10:_Forsaken.txt"
src/data-layer/initialization-metadata/node_manifest.json:361:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(R) Chapter: 1 - Stardust to Stardust .txt"
src/data-layer/initialization-metadata/node_manifest.json:366:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(R)_Chapter:_1_-_Stardust_to_Stardust_.txt"
src/data-layer/initialization-metadata/node_manifest.json:371:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Revision_Prompt_(D))_Chapter_10:_Forsaken.txt"
src/data-layer/initialization-metadata/node_manifest.json:376:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Revision_Prompt_(N)__Chapter_1_-_Stardust_to_Stardust.txt"
src/data-layer/initialization-metadata/node_manifest.json:381:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Revisions)_Chapter_1:_Stardust_to_Stardust.txt"
src/data-layer/initialization-metadata/node_manifest.json:386:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(SDP)_v2.txt"
src/data-layer/initialization-metadata/node_manifest.json:391:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(X)_Chapter_1:_Stardust_to_Stardust.txt"
src/data-layer/initialization-metadata/node_manifest.json:396:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(X)_Chapter_1_-_Stardust_to_Stardust.docx.txt"
src/data-layer/initialization-metadata/node_manifest.json:401:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(X)_Chapter_1_-_Stardust_to_Stardust.txt"
src/data-layer/initialization-metadata/node_manifest.json:406:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(X)_Chapter_1__Stardust_to_Stardust_(1).txt"
src/data-layer/initialization-metadata/node_manifest.json:411:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(X)_Chapter_1__Stardust_to_Stardust_(2).txt"
src/data-layer/initialization-metadata/node_manifest.json:416:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Z)_Chapter_1:_Stardust_to_Stardust.txt"
src/data-layer/initialization-metadata/node_manifest.json:421:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/*Chapter_1:_Stardust_to_Stardust.txt"
src/data-layer/initialization-metadata/node_manifest.json:426:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/*Chapter_2-_Living_Sacrifice.txt"
src/data-layer/initialization-metadata/node_manifest.json:431:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/*Chapter_3:_Lift_Up.txt"
src/data-layer/initialization-metadata/node_manifest.json:436:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/*Chapter_4:_Pilgrimage.txt"
src/data-layer/initialization-metadata/node_manifest.json:441:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/*Chapter_7:_The_Pit.txt"
src/data-layer/initialization-metadata/node_manifest.json:446:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/*Chapter_8:_Sea_People.txt"
src/data-layer/initialization-metadata/node_manifest.json:451:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/*Chapter_9:_The_Ascent.txt"
src/data-layer/initialization-metadata/node_manifest.json:456:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/-Final_Chapter_1_Revision_Prompt-.txt"
src/data-layer/initialization-metadata/node_manifest.json:461:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/1.0_Revision.txt"
src/data-layer/initialization-metadata/node_manifest.json:466:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/10.0_Blueprint_for_The_Ascent_of_Daniel:_The_Archetype_of_Sacrifice_(NYT_Bestseller_Focus).txt"
src/data-layer/initialization-metadata/node_manifest.json:471:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/10.0_MASTER_SYSTEM_FOR_CHAPTER_REVISION.txt"
src/data-layer/initialization-metadata/node_manifest.json:476:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/10.0_Mass_Market.txt"
src/data-layer/initialization-metadata/node_manifest.json:481:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/11.0_Error_Catalog.txt"
src/data-layer/initialization-metadata/node_manifest.json:486:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/11.0_Final_Revision.txt"
src/data-layer/initialization-metadata/node_manifest.json:491:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/11.0_Marketability_.txt"
src/data-layer/initialization-metadata/node_manifest.json:496:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/12.0_Perfection.txt"
src/data-layer/initialization-metadata/node_manifest.json:501:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/13.0_Claude.txt"
src/data-layer/initialization-metadata/node_manifest.json:506:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/13.0_GENERAL_PRINCIPLES.txt"
src/data-layer/initialization-metadata/node_manifest.json:511:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/2.0_Critique_\uff0f_Analysis_Guide.txt"
src/data-layer/initialization-metadata/node_manifest.json:516:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/2.0_This_is_the_critical_adjustment\u2014the_final_layer_that_elevates_philosophical_storytelling_into_timeless,_devastating_human_tragedy.txt"
src/data-layer/initialization-metadata/node_manifest.json:521:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/3.0_Final_.txt"
src/data-layer/initialization-metadata/node_manifest.json:526:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/3.0_Literary_&_Archetypal_Fusion_Rulebook_(The_Cat_God_&_The_Primal_Self).txt"
src/data-layer/initialization-metadata/node_manifest.json:531:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/3.0_Scientific_Guide.txt"
src/data-layer/initialization-metadata/node_manifest.json:536:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/4.0_(12_Rules_For_Life).txt"
src/data-layer/initialization-metadata/node_manifest.json:541:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/4.0_Emotional_&_Archetypal_Editing_Rulebook_(Visceral_Empathy_Focus).txt"
src/data-layer/initialization-metadata/node_manifest.json:546:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/4.0_Psychology_Guide.txt"
src/data-layer/initialization-metadata/node_manifest.json:551:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/4.0_REVISED.txt"
src/data-layer/initialization-metadata/node_manifest.json:556:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/5.0_Final_Guide.txt"
src/data-layer/initialization-metadata/node_manifest.json:561:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/5.0_Psychology_Guide.txt"
src/data-layer/initialization-metadata/node_manifest.json:566:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/6.0_Core_Editing_Rules_for_Thematic_&_Archetypal_Hyperlinking.txt"
src/data-layer/initialization-metadata/node_manifest.json:571:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/6.0_HIGHEST_PRIORITY_(Read_this_first_and_then_again_last)_.txt"
src/data-layer/initialization-metadata/node_manifest.json:576:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/6.0_SYNTHESIS_MANDATE.txt"
src/data-layer/initialization-metadata/node_manifest.json:581:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/6.0_Supreme_Generative_Constraint.txt"
src/data-layer/initialization-metadata/node_manifest.json:586:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/7.0_Chapter_Refinery.txt"
src/data-layer/initialization-metadata/node_manifest.json:591:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/7.0_Nuclear_Edit!!!!_(CRITICAL!_DIRE!_EMERGENCY!!!).txt"
src/data-layer/initialization-metadata/node_manifest.json:596:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/8.0_Pacing\uff0fRedundancy.txt"
src/data-layer/initialization-metadata/node_manifest.json:601:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/8._0_This_is_the_final,_most_crucial_step:_ensuring_the_narrative's_structure_is_so_perfectly_weighted_that_the_profound_sadness\u2014the_weeping_of_self-recognition\u2014is_not_a_chance_event,_but_an_earned,_inevitable_catharsis_for_the_reader.txt"
src/data-layer/initialization-metadata/node_manifest.json:606:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/9.0_Aesthetic.txt"
src/data-layer/initialization-metadata/node_manifest.json:611:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/9.0_Stones.txt"
src/data-layer/initialization-metadata/node_manifest.json:616:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/ALITTERAS_SYSTEM_BLUEPRINT_v1.txt"
src/data-layer/initialization-metadata/node_manifest.json:621:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter 3 - Commerciality and Marketing 3.0.txt"
src/data-layer/initialization-metadata/node_manifest.json:626:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter2_Weight_of_the_Sky.txt"
src/data-layer/initialization-metadata/node_manifest.json:631:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter:_10_-_MASTER_BRIEFING.txt"
src/data-layer/initialization-metadata/node_manifest.json:636:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter:_1_-_Stardust_to_Stardust.txt"
src/data-layer/initialization-metadata/node_manifest.json:641:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter:_1_Proof_of_Authorship_1.0.txt"
src/data-layer/initialization-metadata/node_manifest.json:646:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter:_1_Proof_of_Authorship_1.1.txt"
src/data-layer/initialization-metadata/node_manifest.json:651:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter:_8_(Final).txt"
src/data-layer/initialization-metadata/node_manifest.json:656:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_10.1.txt"
src/data-layer/initialization-metadata/node_manifest.json:661:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_10.5.txt"
src/data-layer/initialization-metadata/node_manifest.json:666:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_10:_Forsaken.txt"
src/data-layer/initialization-metadata/node_manifest.json:671:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_10_Forsaken_FINAL_DEFINITIVE.txt"
src/data-layer/initialization-metadata/node_manifest.json:676:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_10_Version_F.txt"
src/data-layer/initialization-metadata/node_manifest.json:681:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_11.8.txt"
src/data-layer/initialization-metadata/node_manifest.json:686:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_11._Forsaken.txt"
src/data-layer/initialization-metadata/node_manifest.json:691:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_13:_Exodus.txt"
src/data-layer/initialization-metadata/node_manifest.json:696:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_1:_Stardust_to_Stardust.txt"
src/data-layer/initialization-metadata/node_manifest.json:701:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_1_-_Stardust_to_Stardust.txt"
src/data-layer/initialization-metadata/node_manifest.json:706:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_1_Integration.txt"
src/data-layer/initialization-metadata/node_manifest.json:711:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_1_Integration_2.0.txt"
src/data-layer/initialization-metadata/node_manifest.json:716:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_1_Integration_Prompt.txt"
src/data-layer/initialization-metadata/node_manifest.json:721:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_1_Merge_Prompt.txt"
src/data-layer/initialization-metadata/node_manifest.json:726:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_1_Version_O.txt"
src/data-layer/initialization-metadata/node_manifest.json:731:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_2:_Living_Sacrifice.txt"
src/data-layer/initialization-metadata/node_manifest.json:736:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_2_-_Analysis_&_Guides_1.0.txt"
src/data-layer/initialization-metadata/node_manifest.json:741:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_2_-_Commerciality_and_Marketing_3.0.txt"
src/data-layer/initialization-metadata/node_manifest.json:746:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_2_-_Master_Revision_Prompt_2.0.txt"
src/data-layer/initialization-metadata/node_manifest.json:751:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_2nd_to_last.txt"
src/data-layer/initialization-metadata/node_manifest.json:756:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_3:_Lift_Up.txt"
src/data-layer/initialization-metadata/node_manifest.json:761:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_3_-_Master_Revision_Prompt_2.0.txt"
src/data-layer/initialization-metadata/node_manifest.json:766:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_3_Analysis_&_Guides.txt"
src/data-layer/initialization-metadata/node_manifest.json:771:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_3_Integration_Prompt.txt"
src/data-layer/initialization-metadata/node_manifest.json:776:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_4:_Pilgrimage.txt"
src/data-layer/initialization-metadata/node_manifest.json:781:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_5:_The_Snare.txt"
src/data-layer/initialization-metadata/node_manifest.json:786:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_6:_Beelzebub,_Beelzebub.txt"
src/data-layer/initialization-metadata/node_manifest.json:791:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_8.1.txt"
src/data-layer/initialization-metadata/node_manifest.json:796:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_8:_Sea_People.txt"
src/data-layer/initialization-metadata/node_manifest.json:801:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_9:_The_Ascent.txt"
src/data-layer/initialization-metadata/node_manifest.json:806:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Could_you_condense_that_chapter_by_500_to_1,000_w....txt"
src/data-layer/initialization-metadata/node_manifest.json:811:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Critique_2.2.txt"
src/data-layer/initialization-metadata/node_manifest.json:816:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Final Revision (Generalized For All Chapters).txt"
src/data-layer/initialization-metadata/node_manifest.json:821:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Go_ahead_and_write_out_the_chapter_keep_in_mind_t....txt"
src/data-layer/initialization-metadata/node_manifest.json:826:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/MANUSCRIPT_AUTOPSY.txt"
src/data-layer/initialization-metadata/node_manifest.json:831:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Narnia_.txt"
src/data-layer/initialization-metadata/node_manifest.json:836:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Purple_Prose_Prompt.txt"
src/data-layer/initialization-metadata/node_manifest.json:841:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/THE_WEIGHT_OF_THE_SKY-_MASTER_COMPENDIUM_(SINGULARITY_v.txt"
src/data-layer/initialization-metadata/node_manifest.json:846:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/The_-Version_X-_Meta-Prompt.txt"
src/data-layer/initialization-metadata/node_manifest.json:851:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/The_Weight_of_the_Sky:_The_Fall_into_Megiddo.txt"
src/data-layer/initialization-metadata/node_manifest.json:856:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/The_scrape.txt"
src/data-layer/initialization-metadata/node_manifest.json:861:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/ToALITTERAS_ECOSYSTEM_v2.txt"
src/data-layer/initialization-metadata/node_manifest.json:866:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Untitled_document.txt"
src/data-layer/initialization-metadata/node_manifest.json:871:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Version_A.txt"
src/data-layer/initialization-metadata/node_manifest.json:876:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Version_B.txt"
src/data-layer/initialization-metadata/node_manifest.json:881:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/WOS_Ch7_The_Pit.txt"
src/data-layer/initialization-metadata/node_manifest.json:886:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Whole_Book.txt"
src/data-layer/initialization-metadata/node_manifest.json:891:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/chapter_11.2.txt"
src/data-layer/initialization-metadata/node_manifest.json:896:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/\u2022(G)_Chapter:_1_Stardust_to_Stardust_.txt"
src/data-layer/initialization-metadata/node_manifest.json:901:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/\u2022(G)_Chapter_2-_Living_Sacrifice.txt"
src/data-layer/initialization-metadata/node_manifest.json:906:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/\ufeffChapter_1-_Stardust_to_Stardust.txt"
src/lib/runtime-source-paths.ts:7:// data/runtime_sources/weight_of_the_sky/ is runtime manuscript/source data.
src/lib/runtime-source-paths.ts:9:export const RUNTIME_SOURCE_ROOT = "data/runtime_sources/weight_of_the_sky";
src/lib/runtime-source-paths.ts:11:export const RUNTIME_SOURCE_PATHS = {
src/lib/runtime-source-paths.ts:12:  protocols: "data/runtime_sources/weight_of_the_sky/00_protocols",
src/lib/runtime-source-paths.ts:13:  rendererActiveInputs: "data/runtime_sources/weight_of_the_sky/01_renderer_active_inputs",
src/lib/runtime-source-paths.ts:14:  typographySources: "data/runtime_sources/weight_of_the_sky/02_typography_sources",
src/lib/runtime-source-paths.ts:15:  layerToCinemaSources: "data/runtime_sources/weight_of_the_sky/03_layer_to_cinema_sources",
src/lib/runtime-source-paths.ts:16:  currentFinalDrafts: "data/runtime_sources/weight_of_the_sky/04_current_final_drafts",
src/lib/runtime-source-paths.ts:17:  revisionSnapshots: "data/runtime_sources/weight_of_the_sky/05_revision_snapshots",
src/lib/runtime-source-paths.ts:18:  currentOoxml: "data/runtime_sources/weight_of_the_sky/06_ooxml_current",
src/lib/runtime-source-paths.ts:19:  revisionOoxml: "data/runtime_sources/weight_of_the_sky/07_ooxml_revision_exports",
src/lib/runtime-source-paths.ts:20:  worldbuildingLore: "data/runtime_sources/weight_of_the_sky/08_worldbuilding_lore",
src/lib/runtime-source-paths.ts:21:  synopsisCompendiums: "data/runtime_sources/weight_of_the_sky/09_synopsis_compendiums",
src/lib/runtime-source-paths.ts:22:  ingestionBaselines: "data/runtime_sources/weight_of_the_sky/10_ingestion_baselines",
src/lib/runtime-source-paths.ts:23:  agentContext: "data/runtime_sources/weight_of_the_sky/11_agent_context",
src/lib/runtime-source-paths.ts:24:  supabaseIndexes: "data/runtime_sources/weight_of_the_sky/12_supabase_indexes",
src/lib/runtime-source-paths.ts:25:  manualSortInbox: "data/runtime_sources/weight_of_the_sky/99_manual_sort_inbox",
src/lib/runtime-source-paths.ts:26:  quarantineDoNotIngest: "data/runtime_sources/weight_of_the_sky/99_quarantine_do_not_ingest",
src/lib/runtime-source-paths.ts:30:  gdriveRawTextBaseline: "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
src/lib/runtime-source-paths.ts:31:  gdriveDocxIntake: "src/data-layer/ingestion-buffer/gdrive_docx_intake",
src/lib/runtime-source-paths.ts:32:  gdriveOoxmlRaw: "src/data-layer/ingestion-buffer/gdrive_ooxml_raw",
src/lib/runtime-source-paths.ts:33:  readmeDocs: "src/data-layer/ingestion-buffer/readme_docs",
src/lib/runtime-source-reader.ts:16:export const RUNTIME_SOURCE_ROOT = "data/runtime_sources/weight_of_the_sky";
src/lib/runtime-source-reader.ts:18:export const RUNTIME_SOURCE_PATHS = {
src/lib/runtime-source-reader.ts:19:  protocols: "data/runtime_sources/weight_of_the_sky/00_protocols",
src/lib/runtime-source-reader.ts:20:  rendererActiveInputs: "data/runtime_sources/weight_of_the_sky/01_renderer_active_inputs",
src/lib/runtime-source-reader.ts:21:  typographySources: "data/runtime_sources/weight_of_the_sky/02_typography_sources",
src/lib/runtime-source-reader.ts:22:  layerToCinemaSources: "data/runtime_sources/weight_of_the_sky/03_layer_to_cinema_sources",
src/lib/runtime-source-reader.ts:23:  currentFinalDrafts: "data/runtime_sources/weight_of_the_sky/04_current_final_drafts",
src/lib/runtime-source-reader.ts:24:  revisionSnapshots: "data/runtime_sources/weight_of_the_sky/05_revision_snapshots",
src/lib/runtime-source-reader.ts:25:  currentOoxml: "data/runtime_sources/weight_of_the_sky/06_ooxml_current",
src/lib/runtime-source-reader.ts:26:  revisionOoxml: "data/runtime_sources/weight_of_the_sky/07_ooxml_revision_exports",
src/lib/runtime-source-reader.ts:27:  worldbuildingLore: "data/runtime_sources/weight_of_the_sky/08_worldbuilding_lore",
src/lib/runtime-source-reader.ts:28:  synopsisCompendiums: "data/runtime_sources/weight_of_the_sky/09_synopsis_compendiums",
src/lib/runtime-source-reader.ts:29:  ingestionBaselines: "data/runtime_sources/weight_of_the_sky/10_ingestion_baselines",
src/lib/runtime-source-reader.ts:30:  agentContext: "data/runtime_sources/weight_of_the_sky/11_agent_context",
src/lib/runtime-source-reader.ts:31:  supabaseIndexes: "data/runtime_sources/weight_of_the_sky/12_supabase_indexes",
src/lib/runtime-source-reader.ts:32:  manualSortInbox: "data/runtime_sources/weight_of_the_sky/99_manual_sort_inbox",
src/lib/runtime-source-reader.ts:33:  quarantineDoNotIngest: "data/runtime_sources/weight_of_the_sky/99_quarantine_do_not_ingest",
src/lib/runtime-source-reader.ts:138:  const root = path.resolve(process.cwd(), RUNTIME_SOURCE_ROOT);
src/lib/runtime-source-reader.ts:180:    root: RUNTIME_SOURCE_ROOT,
scripts/nos_sync.sh:5:for file in docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/*.txt; do
scripts/data-lineage-audit.sh:42:find docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw -type f 2>/dev/null | wc -l | tee -a reports/data-lineage-audit.txt
scripts/archive-google-docs-by-local-names.mjs:9:  TARGET_DIRS.push("docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw");
scripts/stage-numbered-download-readme-docs.py:8:DEST_ROOT = Path("src/data-layer/ingestion-buffer/readme_docs")
scripts/stage-numbered-download-readme-docs.py:22:    ("tier_1_core", "095", "gdrive_raw_FULL_inventory.txt"),
scripts/stage-numbered-download-readme-docs.py:111:Path("reports/readme_docs_stage_manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
scripts/stage-numbered-download-readme-docs.py:112:Path("reports/readme_docs_missing.json").write_text(json.dumps(missing, indent=2), encoding="utf-8")
scripts/stage-numbered-download-readme-docs.py:121:    "`src/data-layer/ingestion-buffer/readme_docs/`",
scripts/stage-numbered-download-readme-docs.py:139:print("Wrote reports/readme_docs_stage_manifest.json")
scripts/stage-numbered-download-readme-docs.py:140:print("Wrote reports/readme_docs_missing.json")
scripts/perfect_weight/00_generate_perfection_scripts.py:37:  find src/data-layer/ingestion-buffer/readme_docs -type f -printf '%p\t%s bytes\n' 2>/dev/null | sort || true
scripts/perfect_weight/00_generate_perfection_scripts.py:53:base = Path("src/data-layer/ingestion-buffer/readme_docs")
scripts/perfect_weight/00_generate_perfection_scripts.py:132:base = Path("src/data-layer/ingestion-buffer/readme_docs")
scripts/perfect_weight/00_generate_perfection_scripts.py:163:base = Path("src/data-layer/ingestion-buffer/readme_docs")
scripts/perfect_weight/00_generate_perfection_scripts.py:354:"Keep gdrive_raw intact.",
scripts/perfect_weight/00_generate_perfection_scripts.py:355:"Keep readme_docs intact.",
scripts/perfect_weight/00_generate_perfection_scripts.py:433:lines.append("Primary source context: `src/data-layer/ingestion-buffer/readme_docs/`")
scripts/perfect_weight/01_inventory.sh:21:  find src/data-layer/ingestion-buffer/readme_docs -type f -printf '%p\t%s bytes\n' 2>/dev/null | sort || true
scripts/perfect_weight/02_context_classifier.py:5:base = Path("src/data-layer/ingestion-buffer/readme_docs")
scripts/perfect_weight/04_uiux_extract.py:5:base = Path("src/data-layer/ingestion-buffer/readme_docs")
scripts/perfect_weight/05_contradiction_fork_map.py:5:base = Path("src/data-layer/ingestion-buffer/readme_docs")
scripts/perfect_weight/08_next_100_actions.py:79:"Keep gdrive_raw intact.",
scripts/perfect_weight/08_next_100_actions.py:80:"Keep readme_docs intact.",
scripts/perfect_weight/09_master_readme_builder.py:19:lines.append("Primary source context: `src/data-layer/ingestion-buffer/readme_docs/`")
scripts/filename_standardization/standardize_context_filenames.py:11:    Path("src/data-layer/ingestion-buffer/readme_docs"),
scripts/filename_standardization/standardize_context_filenames.py:118:readme_root = Path("src/data-layer/ingestion-buffer/readme_docs")
scripts/filename_standardization/standardize_context_filenames.py:132:Path("reports/readme_docs_staged_files.txt").write_text("\n".join(x["path"] for x in staged) + "\n", encoding="utf-8")
scripts/filename_standardization/standardize_context_filenames.py:143:    "`src/data-layer/ingestion-buffer/readme_docs/`",
scripts/xml_recovery/audit_google_xml_extraction.sh:13:  echo "## Local gdrive_raw text targets"
scripts/xml_recovery/audit_google_xml_extraction.sh:15:  if [ -d "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw" ]; then
scripts/xml_recovery/audit_google_xml_extraction.sh:16:    echo "- gdrive_raw file count: $(find docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw -type f | wc -l)"
scripts/xml_recovery/audit_google_xml_extraction.sh:18:    echo "- gdrive_raw missing"
scripts/xml_recovery/audit_google_xml_extraction.sh:22:  echo "- gdrive_ooxml_raw file count: $(find src/data-layer/ingestion-buffer/gdrive_ooxml_raw -type f 2>/dev/null | wc -l || echo 0)"
scripts/xml_recovery/materialize_ooxml_raw.py:9:DEST = Path("src/data-layer/ingestion-buffer/gdrive_ooxml_raw")
scripts/xml_recovery/materialize_ooxml_raw.py:53:Path("reports/gdrive_ooxml_raw_files.txt").write_text("\n".join(m["dest"] for m in manifest) + "\n", encoding="utf-8")
scripts/runtime_sources/create_active_runtime_source_layout.py:6:RUNTIME = Path("data/runtime_sources/weight_of_the_sky")
scripts/runtime_sources/create_active_runtime_source_layout.py:21:    "10_ingestion_baselines": "Machine ingestion baselines, gdrive_raw text targets, extracted raw text.",
scripts/runtime_sources/create_active_runtime_source_layout.py:110:    "`data/runtime_sources/weight_of_the_sky/` is active manuscript, renderer, typography, lore, revision, and ingestion source data.",
scripts/runtime_sources/create_active_runtime_source_layout.py:114:    "Old `src/data-layer/ingestion-buffer/*` folders remain compatibility inputs until every import/script is audited and cut over.",
scripts/runtime_sources/create_active_runtime_source_layout.py:149:    Path("src/data-layer/ingestion-buffer/readme_docs"),
scripts/runtime_sources/create_active_runtime_source_layout.py:157:    Path("src/data-layer/ingestion-buffer/readme_docs"),
scripts/runtime_sources/create_active_runtime_source_layout.py:165:    Path("docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw"),
scripts/runtime_sources/create_active_runtime_source_layout.py:166:    RUNTIME / "10_ingestion_baselines/gdrive_raw_text_baseline",
scripts/runtime_sources/create_active_runtime_source_layout.py:167:    "gdrive_raw_text_baseline",
scripts/runtime_sources/create_active_runtime_source_layout.py:173:    Path("src/data-layer/ingestion-buffer/gdrive_docx_intake"),
scripts/runtime_sources/create_active_runtime_source_layout.py:181:    Path("src/data-layer/ingestion-buffer/gdrive_ooxml_raw"),
scripts/runtime_sources/read_renderer_documents.py:5:RUNTIME = Path("data/runtime_sources/weight_of_the_sky")
scripts/runtime_sources/audit_runtime_import_paths.sh:17:    --exclude-dir=data/runtime_sources \
scripts/runtime_sources/audit_runtime_import_paths.sh:20:    "src/data-layer/ingestion-buffer\|gdrive_raw\|readme_docs\|gdrive_ooxml_raw\|gdrive_docx_intake\|data/runtime_sources\|SOURCE_RUNTIME" \
scripts/runtime_sources/audit_runtime_import_paths.sh:26:    docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw \
scripts/runtime_sources/audit_runtime_import_paths.sh:27:    src/data-layer/ingestion-buffer/readme_docs \
scripts/runtime_sources/audit_runtime_import_paths.sh:28:    src/data-layer/ingestion-buffer/gdrive_docx_intake \
scripts/runtime_sources/audit_runtime_import_paths.sh:29:    src/data-layer/ingestion-buffer/gdrive_ooxml_raw \
scripts/runtime_sources/audit_runtime_import_paths.sh:30:    data/runtime_sources/weight_of_the_sky
scripts/runtime_sources/write_runtime_source_constants.py:13:// data/runtime_sources/weight_of_the_sky/ is runtime manuscript/source data.
scripts/runtime_sources/write_runtime_source_constants.py:15:export const RUNTIME_SOURCE_ROOT = "data/runtime_sources/weight_of_the_sky";
scripts/runtime_sources/write_runtime_source_constants.py:17:export const RUNTIME_SOURCE_PATHS = {
scripts/runtime_sources/write_runtime_source_constants.py:18:  protocols: "data/runtime_sources/weight_of_the_sky/00_protocols",
scripts/runtime_sources/write_runtime_source_constants.py:19:  rendererActiveInputs: "data/runtime_sources/weight_of_the_sky/01_renderer_active_inputs",
scripts/runtime_sources/write_runtime_source_constants.py:20:  typographySources: "data/runtime_sources/weight_of_the_sky/02_typography_sources",
scripts/runtime_sources/write_runtime_source_constants.py:21:  layerToCinemaSources: "data/runtime_sources/weight_of_the_sky/03_layer_to_cinema_sources",
scripts/runtime_sources/write_runtime_source_constants.py:22:  currentFinalDrafts: "data/runtime_sources/weight_of_the_sky/04_current_final_drafts",
scripts/runtime_sources/write_runtime_source_constants.py:23:  revisionSnapshots: "data/runtime_sources/weight_of_the_sky/05_revision_snapshots",
scripts/runtime_sources/write_runtime_source_constants.py:24:  currentOoxml: "data/runtime_sources/weight_of_the_sky/06_ooxml_current",
scripts/runtime_sources/write_runtime_source_constants.py:25:  revisionOoxml: "data/runtime_sources/weight_of_the_sky/07_ooxml_revision_exports",
scripts/runtime_sources/write_runtime_source_constants.py:26:  worldbuildingLore: "data/runtime_sources/weight_of_the_sky/08_worldbuilding_lore",
scripts/runtime_sources/write_runtime_source_constants.py:27:  synopsisCompendiums: "data/runtime_sources/weight_of_the_sky/09_synopsis_compendiums",
scripts/runtime_sources/write_runtime_source_constants.py:28:  ingestionBaselines: "data/runtime_sources/weight_of_the_sky/10_ingestion_baselines",
scripts/runtime_sources/write_runtime_source_constants.py:29:  agentContext: "data/runtime_sources/weight_of_the_sky/11_agent_context",
scripts/runtime_sources/write_runtime_source_constants.py:30:  supabaseIndexes: "data/runtime_sources/weight_of_the_sky/12_supabase_indexes",
scripts/runtime_sources/write_runtime_source_constants.py:31:  manualSortInbox: "data/runtime_sources/weight_of_the_sky/99_manual_sort_inbox",
scripts/runtime_sources/write_runtime_source_constants.py:32:  quarantineDoNotIngest: "data/runtime_sources/weight_of_the_sky/99_quarantine_do_not_ingest",
scripts/runtime_sources/write_runtime_source_constants.py:36:  gdriveRawTextBaseline: "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
scripts/runtime_sources/write_runtime_source_constants.py:37:  gdriveDocxIntake: "src/data-layer/ingestion-buffer/gdrive_docx_intake",
scripts/runtime_sources/write_runtime_source_constants.py:38:  gdriveOoxmlRaw: "src/data-layer/ingestion-buffer/gdrive_ooxml_raw",
scripts/runtime_sources/write_runtime_source_constants.py:39:  readmeDocs: "src/data-layer/ingestion-buffer/readme_docs",
scripts/runtime_sources/write_runtime_source_registry.py:6:ROOT = Path("data/runtime_sources/weight_of_the_sky")
scripts/runtime_sources/clean_runtime_import_audit.sh:16:    --exclude-dir=data/runtime_sources \
scripts/runtime_sources/clean_runtime_import_audit.sh:22:    "src/data-layer/ingestion-buffer\|gdrive_raw\|readme_docs\|gdrive_ooxml_raw\|gdrive_docx_intake\|data/runtime_sources\|RUNTIME_SOURCE" \
scripts/runtime_sources/code_only_runtime_path_audit.sh:24:    -not -path './data/runtime_sources/*' \
scripts/runtime_sources/code_only_runtime_path_audit.sh:26:    -not -path './src/data-layer/ingestion-buffer/readme_docs/*' \
scripts/runtime_sources/code_only_runtime_path_audit.sh:28:  | xargs -0 grep -nE "src/data-layer/ingestion-buffer|gdrive_raw|readme_docs|gdrive_ooxml_raw|gdrive_docx_intake|data/runtime_sources|RUNTIME_SOURCE" 2>/dev/null || true
scripts/runtime_sources/code_only_runtime_path_audit.sh:42:    "src/data-layer/ingestion-buffer\|gdrive_raw\|readme_docs\|gdrive_ooxml_raw\|gdrive_docx_intake" \
scripts/runtime_sources/code_only_runtime_path_audit.sh:43:    src/data-layer/ingestion-buffer/readme_docs 2>/dev/null || true
./src/data-layer/initialization-metadata/node_manifest.json:6:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)Chapter_8:_Sea_People.txt"
./src/data-layer/initialization-metadata/node_manifest.json:11:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter:_1_Stardust_to_Stardust.txt"
./src/data-layer/initialization-metadata/node_manifest.json:16:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_1-_Stardust_to_Stardust.txt"
./src/data-layer/initialization-metadata/node_manifest.json:21:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_1:_Stardust_to_Stardust.txt"
./src/data-layer/initialization-metadata/node_manifest.json:26:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_1_-_Stardust_to_Stardust.txt"
./src/data-layer/initialization-metadata/node_manifest.json:31:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_2-_Living_Sacrifice.txt"
./src/data-layer/initialization-metadata/node_manifest.json:36:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_2:_Living_Sacrifice.txt"
./src/data-layer/initialization-metadata/node_manifest.json:41:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_3-_Lift_Up.txt"
./src/data-layer/initialization-metadata/node_manifest.json:46:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_3_-_Lift_Up.txt"
./src/data-layer/initialization-metadata/node_manifest.json:51:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_5_-_The_Snare.txt"
./src/data-layer/initialization-metadata/node_manifest.json:56:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_6:_Beelzebub,_Beelzebub.txt"
./src/data-layer/initialization-metadata/node_manifest.json:61:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)Chapter_8:_Sea_People.txt"
./src/data-layer/initialization-metadata/node_manifest.json:66:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter:_1_Stardust_to_Stardust.txt"
./src/data-layer/initialization-metadata/node_manifest.json:71:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_1-_Stardust_to_Stardust.txt"
./src/data-layer/initialization-metadata/node_manifest.json:76:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_1:_Stardust_to_Stardust.txt"
./src/data-layer/initialization-metadata/node_manifest.json:81:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_1_-_Stardust_to_Stardust.txt"
./src/data-layer/initialization-metadata/node_manifest.json:86:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_2-_Living_Sacrifice.txt"
./src/data-layer/initialization-metadata/node_manifest.json:91:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_2:_Living_Sacrifice.txt"
./src/data-layer/initialization-metadata/node_manifest.json:96:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_3-_Lift_Up.txt"
./src/data-layer/initialization-metadata/node_manifest.json:101:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_3:_Lift_Up.txt"
./src/data-layer/initialization-metadata/node_manifest.json:106:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_5-_The_Snare.txt"
./src/data-layer/initialization-metadata/node_manifest.json:111:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_6_-_Beelzebub,_Beelzebub.txt"
./src/data-layer/initialization-metadata/node_manifest.json:116:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_7:_The_Pit.txt"
./src/data-layer/initialization-metadata/node_manifest.json:121:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_9:_The_Ascent.txt"
./src/data-layer/initialization-metadata/node_manifest.json:126:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Stardust_to_Stardust.txt"
./src/data-layer/initialization-metadata/node_manifest.json:131:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)Chapter_8:_Sea_People.txt"
./src/data-layer/initialization-metadata/node_manifest.json:136:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter:_1_-_Stardust_to_Stardust_.txt"
./src/data-layer/initialization-metadata/node_manifest.json:141:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter:_7_-_The_Pit.txt"
./src/data-layer/initialization-metadata/node_manifest.json:146:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter:_Stardust_to_Stardust.txt"
./src/data-layer/initialization-metadata/node_manifest.json:151:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter_1-_Stardust_to_Stardust.txt"
./src/data-layer/initialization-metadata/node_manifest.json:156:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter_1_-_Stardust_to_Stardust.txt"
./src/data-layer/initialization-metadata/node_manifest.json:161:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter_2-_Living_Sacrifice.txt"
./src/data-layer/initialization-metadata/node_manifest.json:166:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter_3-_Lift_Up.txt"
./src/data-layer/initialization-metadata/node_manifest.json:171:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter_3_-_Lift_Up.txt"
./src/data-layer/initialization-metadata/node_manifest.json:176:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter_4-_Pilgrimage.txt"
./src/data-layer/initialization-metadata/node_manifest.json:181:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter_4_-_Pilgrimage.txt"
./src/data-layer/initialization-metadata/node_manifest.json:186:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter_6-_Beelzebub,_Beelzebub.txt"
./src/data-layer/initialization-metadata/node_manifest.json:191:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(D)_Chapter:_7_-_The_Pit.txt"
./src/data-layer/initialization-metadata/node_manifest.json:196:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(D)_Chapter_1_-_Stardust_to_Stardust.txt"
./src/data-layer/initialization-metadata/node_manifest.json:201:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(D)_Chapter_2-_Living_Sacrifice.txt"
./src/data-layer/initialization-metadata/node_manifest.json:206:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(D)_Chapter_2_-_Living_Sacrifice.txt"
./src/data-layer/initialization-metadata/node_manifest.json:211:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(E)_Chapter_1-_Stardust_to_Stardust.txt"
./src/data-layer/initialization-metadata/node_manifest.json:216:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(E)_Chapter_1_-_Stardust_to_Stardust.txt"
./src/data-layer/initialization-metadata/node_manifest.json:221:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(E)_Chapter_2-_Living_Sacrifice.txt"
./src/data-layer/initialization-metadata/node_manifest.json:226:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(E)_Chapter_2_-_Living_Sacrifice.txt"
./src/data-layer/initialization-metadata/node_manifest.json:231:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(E)_Chapter_3-_Lift_Up.txt"
./src/data-layer/initialization-metadata/node_manifest.json:236:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(F)_Chapter:_1_Stardust_to_Stardust_.txt"
./src/data-layer/initialization-metadata/node_manifest.json:241:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(F)_Chapter_1:_Stardust_to_Stardust_.txt"
./src/data-layer/initialization-metadata/node_manifest.json:246:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(F)_Chapter_1_-_Stardust_to_Stardust.txt"
./src/data-layer/initialization-metadata/node_manifest.json:251:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(F)_Chapter_2-_Living_Sacrifice.txt"
./src/data-layer/initialization-metadata/node_manifest.json:256:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(F)_Chapter_3-_Lift_Up.txt"
./src/data-layer/initialization-metadata/node_manifest.json:261:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Final)_Chapter_1:_Stardust_to_Stardust.txt"
./src/data-layer/initialization-metadata/node_manifest.json:266:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Final)_Chapter_1_-_Stardust_to_Stardust.txt"
./src/data-layer/initialization-metadata/node_manifest.json:271:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Final)_Chapter_2-_Living_Sacrifice.txt"
./src/data-layer/initialization-metadata/node_manifest.json:276:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Final)_Chapter_3-_Lift_Up.txt"
./src/data-layer/initialization-metadata/node_manifest.json:281:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Final)_Chapter_3:_Lift_Up.txt"
./src/data-layer/initialization-metadata/node_manifest.json:286:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Final)_Chapter_5_-_The_Snare.txt"
./src/data-layer/initialization-metadata/node_manifest.json:291:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(G)_Chapter_1:_Stardust_to_Stardust.txt"
./src/data-layer/initialization-metadata/node_manifest.json:296:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(G)_Chapter_2-_Living_Sacrifice.txt"
./src/data-layer/initialization-metadata/node_manifest.json:301:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(G)_Chapter_3-_Lift_Up.txt"
./src/data-layer/initialization-metadata/node_manifest.json:306:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(G)_Final_)_Chapter:_10_-_Forsaken.txt"
./src/data-layer/initialization-metadata/node_manifest.json:311:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(I)_(Notes)_Chapter:_1_Stardust_to_Stardust_.txt"
./src/data-layer/initialization-metadata/node_manifest.json:316:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(I)_Chapter:_1_Stardust_to_Stardust_.txt"
./src/data-layer/initialization-metadata/node_manifest.json:321:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(N)_CHAPTER_1-_STARDUST_TO_STARDUST.txt"
./src/data-layer/initialization-metadata/node_manifest.json:326:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(N)_Chapter_1_-_Stardust_to_Stardust.txt"
./src/data-layer/initialization-metadata/node_manifest.json:331:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Notes)_(P)_Chapter:_1_-_Stardust_to_Stardust.txt"
./src/data-layer/initialization-metadata/node_manifest.json:336:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Notes)_Chapter_2-_Living_Sacrifice.txt"
./src/data-layer/initialization-metadata/node_manifest.json:341:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Notes)_Chapter_2:_Living_Sacrifice.txt"
./src/data-layer/initialization-metadata/node_manifest.json:346:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(O)_Chapter_1-_Stardust_to_Stardust.txt"
./src/data-layer/initialization-metadata/node_manifest.json:351:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(P)_Chapter:_1_-_Stardust_to_Stardust.txt"
./src/data-layer/initialization-metadata/node_manifest.json:356:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Prompt_Guide_(E))_Chapter_10:_Forsaken.txt"
./src/data-layer/initialization-metadata/node_manifest.json:361:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(R) Chapter: 1 - Stardust to Stardust .txt"
./src/data-layer/initialization-metadata/node_manifest.json:366:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(R)_Chapter:_1_-_Stardust_to_Stardust_.txt"
./src/data-layer/initialization-metadata/node_manifest.json:371:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Revision_Prompt_(D))_Chapter_10:_Forsaken.txt"
./src/data-layer/initialization-metadata/node_manifest.json:376:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Revision_Prompt_(N)__Chapter_1_-_Stardust_to_Stardust.txt"
./src/data-layer/initialization-metadata/node_manifest.json:381:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Revisions)_Chapter_1:_Stardust_to_Stardust.txt"
./src/data-layer/initialization-metadata/node_manifest.json:386:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(SDP)_v2.txt"
./src/data-layer/initialization-metadata/node_manifest.json:391:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(X)_Chapter_1:_Stardust_to_Stardust.txt"
./src/data-layer/initialization-metadata/node_manifest.json:396:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(X)_Chapter_1_-_Stardust_to_Stardust.docx.txt"
./src/data-layer/initialization-metadata/node_manifest.json:401:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(X)_Chapter_1_-_Stardust_to_Stardust.txt"
./src/data-layer/initialization-metadata/node_manifest.json:406:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(X)_Chapter_1__Stardust_to_Stardust_(1).txt"
./src/data-layer/initialization-metadata/node_manifest.json:411:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(X)_Chapter_1__Stardust_to_Stardust_(2).txt"
./src/data-layer/initialization-metadata/node_manifest.json:416:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Z)_Chapter_1:_Stardust_to_Stardust.txt"
./src/data-layer/initialization-metadata/node_manifest.json:421:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/*Chapter_1:_Stardust_to_Stardust.txt"
./src/data-layer/initialization-metadata/node_manifest.json:426:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/*Chapter_2-_Living_Sacrifice.txt"
./src/data-layer/initialization-metadata/node_manifest.json:431:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/*Chapter_3:_Lift_Up.txt"
./src/data-layer/initialization-metadata/node_manifest.json:436:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/*Chapter_4:_Pilgrimage.txt"
./src/data-layer/initialization-metadata/node_manifest.json:441:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/*Chapter_7:_The_Pit.txt"
./src/data-layer/initialization-metadata/node_manifest.json:446:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/*Chapter_8:_Sea_People.txt"
./src/data-layer/initialization-metadata/node_manifest.json:451:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/*Chapter_9:_The_Ascent.txt"
./src/data-layer/initialization-metadata/node_manifest.json:456:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/-Final_Chapter_1_Revision_Prompt-.txt"
./src/data-layer/initialization-metadata/node_manifest.json:461:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/1.0_Revision.txt"
./src/data-layer/initialization-metadata/node_manifest.json:466:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/10.0_Blueprint_for_The_Ascent_of_Daniel:_The_Archetype_of_Sacrifice_(NYT_Bestseller_Focus).txt"
./src/data-layer/initialization-metadata/node_manifest.json:471:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/10.0_MASTER_SYSTEM_FOR_CHAPTER_REVISION.txt"
./src/data-layer/initialization-metadata/node_manifest.json:476:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/10.0_Mass_Market.txt"
./src/data-layer/initialization-metadata/node_manifest.json:481:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/11.0_Error_Catalog.txt"
./src/data-layer/initialization-metadata/node_manifest.json:486:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/11.0_Final_Revision.txt"
./src/data-layer/initialization-metadata/node_manifest.json:491:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/11.0_Marketability_.txt"
./src/data-layer/initialization-metadata/node_manifest.json:496:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/12.0_Perfection.txt"
./src/data-layer/initialization-metadata/node_manifest.json:501:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/13.0_Claude.txt"
./src/data-layer/initialization-metadata/node_manifest.json:506:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/13.0_GENERAL_PRINCIPLES.txt"
./src/data-layer/initialization-metadata/node_manifest.json:511:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/2.0_Critique_\uff0f_Analysis_Guide.txt"
./src/data-layer/initialization-metadata/node_manifest.json:516:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/2.0_This_is_the_critical_adjustment\u2014the_final_layer_that_elevates_philosophical_storytelling_into_timeless,_devastating_human_tragedy.txt"
./src/data-layer/initialization-metadata/node_manifest.json:521:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/3.0_Final_.txt"
./src/data-layer/initialization-metadata/node_manifest.json:526:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/3.0_Literary_&_Archetypal_Fusion_Rulebook_(The_Cat_God_&_The_Primal_Self).txt"
./src/data-layer/initialization-metadata/node_manifest.json:531:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/3.0_Scientific_Guide.txt"
./src/data-layer/initialization-metadata/node_manifest.json:536:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/4.0_(12_Rules_For_Life).txt"
./src/data-layer/initialization-metadata/node_manifest.json:541:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/4.0_Emotional_&_Archetypal_Editing_Rulebook_(Visceral_Empathy_Focus).txt"
./src/data-layer/initialization-metadata/node_manifest.json:546:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/4.0_Psychology_Guide.txt"
./src/data-layer/initialization-metadata/node_manifest.json:551:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/4.0_REVISED.txt"
./src/data-layer/initialization-metadata/node_manifest.json:556:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/5.0_Final_Guide.txt"
./src/data-layer/initialization-metadata/node_manifest.json:561:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/5.0_Psychology_Guide.txt"
./src/data-layer/initialization-metadata/node_manifest.json:566:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/6.0_Core_Editing_Rules_for_Thematic_&_Archetypal_Hyperlinking.txt"
./src/data-layer/initialization-metadata/node_manifest.json:571:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/6.0_HIGHEST_PRIORITY_(Read_this_first_and_then_again_last)_.txt"
./src/data-layer/initialization-metadata/node_manifest.json:576:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/6.0_SYNTHESIS_MANDATE.txt"
./src/data-layer/initialization-metadata/node_manifest.json:581:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/6.0_Supreme_Generative_Constraint.txt"
./src/data-layer/initialization-metadata/node_manifest.json:586:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/7.0_Chapter_Refinery.txt"
./src/data-layer/initialization-metadata/node_manifest.json:591:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/7.0_Nuclear_Edit!!!!_(CRITICAL!_DIRE!_EMERGENCY!!!).txt"
./src/data-layer/initialization-metadata/node_manifest.json:596:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/8.0_Pacing\uff0fRedundancy.txt"
./src/data-layer/initialization-metadata/node_manifest.json:601:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/8._0_This_is_the_final,_most_crucial_step:_ensuring_the_narrative's_structure_is_so_perfectly_weighted_that_the_profound_sadness\u2014the_weeping_of_self-recognition\u2014is_not_a_chance_event,_but_an_earned,_inevitable_catharsis_for_the_reader.txt"
./src/data-layer/initialization-metadata/node_manifest.json:606:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/9.0_Aesthetic.txt"
./src/data-layer/initialization-metadata/node_manifest.json:611:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/9.0_Stones.txt"
./src/data-layer/initialization-metadata/node_manifest.json:616:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/ALITTERAS_SYSTEM_BLUEPRINT_v1.txt"
./src/data-layer/initialization-metadata/node_manifest.json:621:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter 3 - Commerciality and Marketing 3.0.txt"
./src/data-layer/initialization-metadata/node_manifest.json:626:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter2_Weight_of_the_Sky.txt"
./src/data-layer/initialization-metadata/node_manifest.json:631:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter:_10_-_MASTER_BRIEFING.txt"
./src/data-layer/initialization-metadata/node_manifest.json:636:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter:_1_-_Stardust_to_Stardust.txt"
./src/data-layer/initialization-metadata/node_manifest.json:641:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter:_1_Proof_of_Authorship_1.0.txt"
./src/data-layer/initialization-metadata/node_manifest.json:646:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter:_1_Proof_of_Authorship_1.1.txt"
./src/data-layer/initialization-metadata/node_manifest.json:651:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter:_8_(Final).txt"
./src/data-layer/initialization-metadata/node_manifest.json:656:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_10.1.txt"
./src/data-layer/initialization-metadata/node_manifest.json:661:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_10.5.txt"
./src/data-layer/initialization-metadata/node_manifest.json:666:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_10:_Forsaken.txt"
./src/data-layer/initialization-metadata/node_manifest.json:671:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_10_Forsaken_FINAL_DEFINITIVE.txt"
./src/data-layer/initialization-metadata/node_manifest.json:676:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_10_Version_F.txt"
./src/data-layer/initialization-metadata/node_manifest.json:681:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_11.8.txt"
./src/data-layer/initialization-metadata/node_manifest.json:686:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_11._Forsaken.txt"
./src/data-layer/initialization-metadata/node_manifest.json:691:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_13:_Exodus.txt"
./src/data-layer/initialization-metadata/node_manifest.json:696:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_1:_Stardust_to_Stardust.txt"
./src/data-layer/initialization-metadata/node_manifest.json:701:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_1_-_Stardust_to_Stardust.txt"
./src/data-layer/initialization-metadata/node_manifest.json:706:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_1_Integration.txt"
./src/data-layer/initialization-metadata/node_manifest.json:711:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_1_Integration_2.0.txt"
./src/data-layer/initialization-metadata/node_manifest.json:716:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_1_Integration_Prompt.txt"
./src/data-layer/initialization-metadata/node_manifest.json:721:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_1_Merge_Prompt.txt"
./src/data-layer/initialization-metadata/node_manifest.json:726:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_1_Version_O.txt"
./src/data-layer/initialization-metadata/node_manifest.json:731:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_2:_Living_Sacrifice.txt"
./src/data-layer/initialization-metadata/node_manifest.json:736:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_2_-_Analysis_&_Guides_1.0.txt"
./src/data-layer/initialization-metadata/node_manifest.json:741:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_2_-_Commerciality_and_Marketing_3.0.txt"
./src/data-layer/initialization-metadata/node_manifest.json:746:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_2_-_Master_Revision_Prompt_2.0.txt"
./src/data-layer/initialization-metadata/node_manifest.json:751:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_2nd_to_last.txt"
./src/data-layer/initialization-metadata/node_manifest.json:756:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_3:_Lift_Up.txt"
./src/data-layer/initialization-metadata/node_manifest.json:761:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_3_-_Master_Revision_Prompt_2.0.txt"
./src/data-layer/initialization-metadata/node_manifest.json:766:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_3_Analysis_&_Guides.txt"
./src/data-layer/initialization-metadata/node_manifest.json:771:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_3_Integration_Prompt.txt"
./src/data-layer/initialization-metadata/node_manifest.json:776:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_4:_Pilgrimage.txt"
./src/data-layer/initialization-metadata/node_manifest.json:781:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_5:_The_Snare.txt"
./src/data-layer/initialization-metadata/node_manifest.json:786:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_6:_Beelzebub,_Beelzebub.txt"
./src/data-layer/initialization-metadata/node_manifest.json:791:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_8.1.txt"
./src/data-layer/initialization-metadata/node_manifest.json:796:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_8:_Sea_People.txt"
./src/data-layer/initialization-metadata/node_manifest.json:801:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_9:_The_Ascent.txt"
./src/data-layer/initialization-metadata/node_manifest.json:806:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Could_you_condense_that_chapter_by_500_to_1,000_w....txt"
./src/data-layer/initialization-metadata/node_manifest.json:811:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Critique_2.2.txt"
./src/data-layer/initialization-metadata/node_manifest.json:816:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Final Revision (Generalized For All Chapters).txt"
./src/data-layer/initialization-metadata/node_manifest.json:821:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Go_ahead_and_write_out_the_chapter_keep_in_mind_t....txt"
./src/data-layer/initialization-metadata/node_manifest.json:826:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/MANUSCRIPT_AUTOPSY.txt"
./src/data-layer/initialization-metadata/node_manifest.json:831:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Narnia_.txt"
./src/data-layer/initialization-metadata/node_manifest.json:836:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Purple_Prose_Prompt.txt"
./src/data-layer/initialization-metadata/node_manifest.json:841:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/THE_WEIGHT_OF_THE_SKY-_MASTER_COMPENDIUM_(SINGULARITY_v.txt"
./src/data-layer/initialization-metadata/node_manifest.json:846:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/The_-Version_X-_Meta-Prompt.txt"
./src/data-layer/initialization-metadata/node_manifest.json:851:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/The_Weight_of_the_Sky:_The_Fall_into_Megiddo.txt"
./src/data-layer/initialization-metadata/node_manifest.json:856:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/The_scrape.txt"
./src/data-layer/initialization-metadata/node_manifest.json:861:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/ToALITTERAS_ECOSYSTEM_v2.txt"
./src/data-layer/initialization-metadata/node_manifest.json:866:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Untitled_document.txt"
./src/data-layer/initialization-metadata/node_manifest.json:871:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Version_A.txt"
./src/data-layer/initialization-metadata/node_manifest.json:876:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Version_B.txt"
./src/data-layer/initialization-metadata/node_manifest.json:881:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/WOS_Ch7_The_Pit.txt"
./src/data-layer/initialization-metadata/node_manifest.json:886:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Whole_Book.txt"
./src/data-layer/initialization-metadata/node_manifest.json:891:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/chapter_11.2.txt"
./src/data-layer/initialization-metadata/node_manifest.json:896:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/\u2022(G)_Chapter:_1_Stardust_to_Stardust_.txt"
./src/data-layer/initialization-metadata/node_manifest.json:901:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/\u2022(G)_Chapter_2-_Living_Sacrifice.txt"
./src/data-layer/initialization-metadata/node_manifest.json:906:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/\ufeffChapter_1-_Stardust_to_Stardust.txt"
./src/lib/runtime-source-paths.ts:7:// data/runtime_sources/weight_of_the_sky/ is runtime manuscript/source data.
./src/lib/runtime-source-paths.ts:9:export const RUNTIME_SOURCE_ROOT = "data/runtime_sources/weight_of_the_sky";
./src/lib/runtime-source-paths.ts:11:export const RUNTIME_SOURCE_PATHS = {
./src/lib/runtime-source-paths.ts:12:  protocols: "data/runtime_sources/weight_of_the_sky/00_protocols",
./src/lib/runtime-source-paths.ts:13:  rendererActiveInputs: "data/runtime_sources/weight_of_the_sky/01_renderer_active_inputs",
./src/lib/runtime-source-paths.ts:14:  typographySources: "data/runtime_sources/weight_of_the_sky/02_typography_sources",
./src/lib/runtime-source-paths.ts:15:  layerToCinemaSources: "data/runtime_sources/weight_of_the_sky/03_layer_to_cinema_sources",
./src/lib/runtime-source-paths.ts:16:  currentFinalDrafts: "data/runtime_sources/weight_of_the_sky/04_current_final_drafts",
./src/lib/runtime-source-paths.ts:17:  revisionSnapshots: "data/runtime_sources/weight_of_the_sky/05_revision_snapshots",
./src/lib/runtime-source-paths.ts:18:  currentOoxml: "data/runtime_sources/weight_of_the_sky/06_ooxml_current",
./src/lib/runtime-source-paths.ts:19:  revisionOoxml: "data/runtime_sources/weight_of_the_sky/07_ooxml_revision_exports",
./src/lib/runtime-source-paths.ts:20:  worldbuildingLore: "data/runtime_sources/weight_of_the_sky/08_worldbuilding_lore",
./src/lib/runtime-source-paths.ts:21:  synopsisCompendiums: "data/runtime_sources/weight_of_the_sky/09_synopsis_compendiums",
./src/lib/runtime-source-paths.ts:22:  ingestionBaselines: "data/runtime_sources/weight_of_the_sky/10_ingestion_baselines",
./src/lib/runtime-source-paths.ts:23:  agentContext: "data/runtime_sources/weight_of_the_sky/11_agent_context",
./src/lib/runtime-source-paths.ts:24:  supabaseIndexes: "data/runtime_sources/weight_of_the_sky/12_supabase_indexes",
./src/lib/runtime-source-paths.ts:25:  manualSortInbox: "data/runtime_sources/weight_of_the_sky/99_manual_sort_inbox",
./src/lib/runtime-source-paths.ts:26:  quarantineDoNotIngest: "data/runtime_sources/weight_of_the_sky/99_quarantine_do_not_ingest",
./src/lib/runtime-source-paths.ts:30:  gdriveRawTextBaseline: "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./src/lib/runtime-source-paths.ts:31:  gdriveDocxIntake: "src/data-layer/ingestion-buffer/gdrive_docx_intake",
./src/lib/runtime-source-paths.ts:32:  gdriveOoxmlRaw: "src/data-layer/ingestion-buffer/gdrive_ooxml_raw",
./src/lib/runtime-source-paths.ts:33:  readmeDocs: "src/data-layer/ingestion-buffer/readme_docs",
./src/lib/runtime-source-reader.ts:16:export const RUNTIME_SOURCE_ROOT = "data/runtime_sources/weight_of_the_sky";
./src/lib/runtime-source-reader.ts:18:export const RUNTIME_SOURCE_PATHS = {
./src/lib/runtime-source-reader.ts:19:  protocols: "data/runtime_sources/weight_of_the_sky/00_protocols",
./src/lib/runtime-source-reader.ts:20:  rendererActiveInputs: "data/runtime_sources/weight_of_the_sky/01_renderer_active_inputs",
./src/lib/runtime-source-reader.ts:21:  typographySources: "data/runtime_sources/weight_of_the_sky/02_typography_sources",
./src/lib/runtime-source-reader.ts:22:  layerToCinemaSources: "data/runtime_sources/weight_of_the_sky/03_layer_to_cinema_sources",
./src/lib/runtime-source-reader.ts:23:  currentFinalDrafts: "data/runtime_sources/weight_of_the_sky/04_current_final_drafts",
./src/lib/runtime-source-reader.ts:24:  revisionSnapshots: "data/runtime_sources/weight_of_the_sky/05_revision_snapshots",
./src/lib/runtime-source-reader.ts:25:  currentOoxml: "data/runtime_sources/weight_of_the_sky/06_ooxml_current",
./src/lib/runtime-source-reader.ts:26:  revisionOoxml: "data/runtime_sources/weight_of_the_sky/07_ooxml_revision_exports",
./src/lib/runtime-source-reader.ts:27:  worldbuildingLore: "data/runtime_sources/weight_of_the_sky/08_worldbuilding_lore",
./src/lib/runtime-source-reader.ts:28:  synopsisCompendiums: "data/runtime_sources/weight_of_the_sky/09_synopsis_compendiums",
./src/lib/runtime-source-reader.ts:29:  ingestionBaselines: "data/runtime_sources/weight_of_the_sky/10_ingestion_baselines",
./src/lib/runtime-source-reader.ts:30:  agentContext: "data/runtime_sources/weight_of_the_sky/11_agent_context",
./src/lib/runtime-source-reader.ts:31:  supabaseIndexes: "data/runtime_sources/weight_of_the_sky/12_supabase_indexes",
./src/lib/runtime-source-reader.ts:32:  manualSortInbox: "data/runtime_sources/weight_of_the_sky/99_manual_sort_inbox",
./src/lib/runtime-source-reader.ts:33:  quarantineDoNotIngest: "data/runtime_sources/weight_of_the_sky/99_quarantine_do_not_ingest",
./src/lib/runtime-source-reader.ts:138:  const root = path.resolve(process.cwd(), RUNTIME_SOURCE_ROOT);
./src/lib/runtime-source-reader.ts:180:    root: RUNTIME_SOURCE_ROOT,
./system/resource-manager/manifest.json:1:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter:_1_-_Stardust_to_Stardust_.txt
./system/resource-manager/manifest.json:2:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)Chapter_8:_Sea_People.txt
./system/resource-manager/manifest.json:3:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter:_1_Stardust_to_Stardust.txt
./system/resource-manager/manifest.json:4:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_1-_Stardust_to_Stardust.txt
./system/resource-manager/manifest.json:5:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_1:_Stardust_to_Stardust.txt
./system/resource-manager/manifest.json:6:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_1_-_Stardust_to_Stardust.txt
./system/resource-manager/manifest.json:7:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_2-_Living_Sacrifice.txt
./system/resource-manager/manifest.json:8:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_2:_Living_Sacrifice.txt
./system/resource-manager/manifest.json:9:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_3-_Lift_Up.txt
./system/resource-manager/manifest.json:10:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_3_-_Lift_Up.txt
./system/resource-manager/manifest.json:11:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_5_-_The_Snare.txt
./system/resource-manager/manifest.json:12:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_6:_Beelzebub,_Beelzebub.txt
./system/resource-manager/manifest.json:13:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)Chapter_8:_Sea_People.txt
./system/resource-manager/manifest.json:14:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter:_1_Stardust_to_Stardust.txt
./system/resource-manager/manifest.json:15:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_1-_Stardust_to_Stardust.txt
./system/resource-manager/manifest.json:16:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_1:_Stardust_to_Stardust.txt
./system/resource-manager/manifest.json:17:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_1_-_Stardust_to_Stardust.txt
./system/resource-manager/manifest.json:18:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_2-_Living_Sacrifice.txt
./system/resource-manager/manifest.json:19:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_2:_Living_Sacrifice.txt
./system/resource-manager/manifest.json:20:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_3-_Lift_Up.txt
./system/resource-manager/manifest.json:21:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_3:_Lift_Up.txt
./system/resource-manager/manifest.json:22:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_5-_The_Snare.txt
./system/resource-manager/manifest.json:23:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_6_-_Beelzebub,_Beelzebub.txt
./system/resource-manager/manifest.json:24:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_7:_The_Pit.txt
./system/resource-manager/manifest.json:25:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_9:_The_Ascent.txt
./system/resource-manager/manifest.json:26:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Stardust_to_Stardust.txt
./system/resource-manager/manifest.json:27:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)Chapter_8:_Sea_People.txt
./system/resource-manager/manifest.json:28:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Final)_Chapter_1:_Stardust_to_Stardust.txt
./system/resource-manager/manifest.json:29:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter:_7_-_The_Pit.txt
./system/resource-manager/manifest.json:30:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter:_Stardust_to_Stardust.txt
./system/resource-manager/manifest.json:31:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter_1-_Stardust_to_Stardust.txt
./system/resource-manager/manifest.json:32:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter_1_-_Stardust_to_Stardust.txt
./system/resource-manager/manifest.json:33:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter_2-_Living_Sacrifice.txt
./system/resource-manager/manifest.json:34:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter_3-_Lift_Up.txt
./system/resource-manager/manifest.json:35:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter_3_-_Lift_Up.txt
./system/resource-manager/manifest.json:36:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter_4-_Pilgrimage.txt
./system/resource-manager/manifest.json:37:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter_4_-_Pilgrimage.txt
./system/resource-manager/manifest.json:38:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter_6-_Beelzebub,_Beelzebub.txt
./system/resource-manager/manifest.json:39:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(D)_Chapter:_7_-_The_Pit.txt
./system/resource-manager/manifest.json:40:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(D)_Chapter_1_-_Stardust_to_Stardust.txt
./system/resource-manager/manifest.json:41:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(D)_Chapter_2-_Living_Sacrifice.txt
./system/resource-manager/manifest.json:42:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(SDP)_v2.txt
./system/resource-manager/manifest.json:43:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(D)_Chapter_2_-_Living_Sacrifice.txt
./system/resource-manager/manifest.json:44:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(E)_Chapter_1-_Stardust_to_Stardust.txt
./system/resource-manager/manifest.json:45:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(E)_Chapter_1_-_Stardust_to_Stardust.txt
./system/resource-manager/manifest.json:46:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(E)_Chapter_2-_Living_Sacrifice.txt
./system/resource-manager/manifest.json:47:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(E)_Chapter_2_-_Living_Sacrifice.txt
./system/resource-manager/manifest.json:48:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(E)_Chapter_3-_Lift_Up.txt
./system/resource-manager/manifest.json:49:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(F)_Chapter:_1_Stardust_to_Stardust_.txt
./system/resource-manager/manifest.json:50:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(F)_Chapter_1:_Stardust_to_Stardust_.txt
./system/resource-manager/manifest.json:51:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(F)_Chapter_1_-_Stardust_to_Stardust.txt
./system/resource-manager/manifest.json:52:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(F)_Chapter_2-_Living_Sacrifice.txt
./system/resource-manager/manifest.json:53:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(F)_Chapter_3-_Lift_Up.txt
./system/resource-manager/manifest.json:54:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Revision_Prompt_(N)__Chapter_1_-_Stardust_to_Stardust.txt
./system/resource-manager/manifest.json:55:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Final)_Chapter_1_-_Stardust_to_Stardust.txt
./system/resource-manager/manifest.json:56:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Final)_Chapter_2-_Living_Sacrifice.txt
./system/resource-manager/manifest.json:57:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Final)_Chapter_3-_Lift_Up.txt
./system/resource-manager/manifest.json:58:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Final)_Chapter_3:_Lift_Up.txt
./system/resource-manager/manifest.json:59:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Final)_Chapter_5_-_The_Snare.txt
./system/resource-manager/manifest.json:60:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(G)_Chapter_1:_Stardust_to_Stardust.txt
./system/resource-manager/manifest.json:61:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(G)_Chapter_2-_Living_Sacrifice.txt
./system/resource-manager/manifest.json:62:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(G)_Chapter_3-_Lift_Up.txt
./system/resource-manager/manifest.json:63:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(G)_Final_)_Chapter:_10_-_Forsaken.txt
./system/resource-manager/manifest.json:64:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(I)_(Notes)_Chapter:_1_Stardust_to_Stardust_.txt
./system/resource-manager/manifest.json:65:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(I)_Chapter:_1_Stardust_to_Stardust_.txt
./system/resource-manager/manifest.json:66:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(N)_CHAPTER_1-_STARDUST_TO_STARDUST.txt
./system/resource-manager/manifest.json:67:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(N)_Chapter_1_-_Stardust_to_Stardust.txt
./system/resource-manager/manifest.json:68:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Notes)_(P)_Chapter:_1_-_Stardust_to_Stardust.txt
./system/resource-manager/manifest.json:69:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Notes)_Chapter_2-_Living_Sacrifice.txt
./system/resource-manager/manifest.json:70:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Notes)_Chapter_2:_Living_Sacrifice.txt
./system/resource-manager/manifest.json:71:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(O)_Chapter_1-_Stardust_to_Stardust.txt
./system/resource-manager/manifest.json:72:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(P)_Chapter:_1_-_Stardust_to_Stardust.txt
./system/resource-manager/manifest.json:73:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Prompt_Guide_(E))_Chapter_10:_Forsaken.txt
./system/resource-manager/manifest.json:74:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(R) Chapter: 1 - Stardust to Stardust .txt
./system/resource-manager/manifest.json:75:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(R)_Chapter:_1_-_Stardust_to_Stardust_.txt
./system/resource-manager/manifest.json:76:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Revision_Prompt_(D))_Chapter_10:_Forsaken.txt
./system/resource-manager/manifest.json:77:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/*Chapter_4:_Pilgrimage.txt
./system/resource-manager/manifest.json:78:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/*Chapter_3:_Lift_Up.txt
./system/resource-manager/manifest.json:79:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Revisions)_Chapter_1:_Stardust_to_Stardust.txt
./system/resource-manager/manifest.json:80:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/1.0_Revision.txt
./system/resource-manager/manifest.json:81:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(X)_Chapter_1:_Stardust_to_Stardust.txt
./system/resource-manager/manifest.json:82:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(X)_Chapter_1_-_Stardust_to_Stardust.docx.txt
./system/resource-manager/manifest.json:83:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(X)_Chapter_1__Stardust_to_Stardust_(1).txt
./system/resource-manager/manifest.json:84:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/*Chapter_1:_Stardust_to_Stardust.txt
./system/resource-manager/manifest.json:85:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/10.0_MASTER_SYSTEM_FOR_CHAPTER_REVISION.txt
./system/resource-manager/manifest.json:86:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/*Chapter_8:_Sea_People.txt
./system/resource-manager/manifest.json:87:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/4.0_(12_Rules_For_Life).txt
./system/resource-manager/manifest.json:88:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/11.0_Final_Revision.txt
./system/resource-manager/manifest.json:89:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/12.0_Perfection.txt
./system/resource-manager/manifest.json:90:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/13.0_Claude.txt
./system/resource-manager/manifest.json:91:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/4.0_Emotional_&_Archetypal_Editing_Rulebook_(Visceral_Empathy_Focus).txt
./system/resource-manager/manifest.json:92:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/4.0_Psychology_Guide.txt
./system/resource-manager/manifest.json:93:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/7.0_Chapter_Refinery.txt
./system/resource-manager/manifest.json:94:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/9.0_Stones.txt
./system/resource-manager/manifest.json:95:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/2.0_This_is_the_critical_adjustment—the_final_layer_that_elevates_philosophical_storytelling_into_timeless,_devastating_human_tragedy.txt
./system/resource-manager/manifest.json:96:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/3.0_Literary_&_Archetypal_Fusion_Rulebook_(The_Cat_God_&_The_Primal_Self).txt
./system/resource-manager/manifest.json:97:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/5.0_Final_Guide.txt
./system/resource-manager/manifest.json:98:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/6.0_Supreme_Generative_Constraint.txt
./system/resource-manager/manifest.json:99:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/8.0_Pacing／Redundancy.txt
./system/resource-manager/manifest.json:100:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/6.0_Core_Editing_Rules_for_Thematic_&_Archetypal_Hyperlinking.txt
./system/resource-manager/manifest.json:101:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/8._0_This_is_the_final,_most_crucial_step:_ensuring_the_narrative's_structure_is_so_perfectly_weighted_that_the_profound_sadness—the_weeping_of_self-recognition—is_not_a_chance_event,_but_an_earned,_inevitable_catharsis_for_the_reader.txt
./system/resource-manager/manifest.json:102:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_10.1.txt
./system/resource-manager/manifest.json:103:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_10.5.txt
./system/resource-manager/manifest.json:104:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/9.0_Aesthetic.txt
./system/resource-manager/manifest.json:105:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/ALITTERAS_SYSTEM_BLUEPRINT_v1.txt
./system/resource-manager/manifest.json:106:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter:_8_(Final).txt
./system/resource-manager/manifest.json:107:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_8.1.txt
./system/resource-manager/manifest.json:108:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter:_10_-_MASTER_BRIEFING.txt
./system/resource-manager/manifest.json:109:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_1_Integration_Prompt.txt
./system/resource-manager/manifest.json:110:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_10_Version_F.txt
./system/resource-manager/manifest.json:111:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_11._Forsaken.txt
./system/resource-manager/manifest.json:112:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_13:_Exodus.txt
./system/resource-manager/manifest.json:113:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_2:_Living_Sacrifice.txt
./system/resource-manager/manifest.json:114:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_1_Version_O.txt
./system/resource-manager/manifest.json:115:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_3:_Lift_Up.txt
./system/resource-manager/manifest.json:116:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/The_scrape.txt
./system/resource-manager/manifest.json:117:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_2_-_Analysis_&_Guides_1.0.txt
./system/resource-manager/manifest.json:118:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_9:_The_Ascent.txt
./system/resource-manager/manifest.json:119:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/MANUSCRIPT_AUTOPSY.txt
./system/resource-manager/manifest.json:120:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/The_-Version_X-_Meta-Prompt.txt
./system/resource-manager/manifest.json:121:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Go_ahead_and_write_out_the_chapter_keep_in_mind_t....txt
./system/resource-manager/manifest.json:122:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Purple_Prose_Prompt.txt
./system/resource-manager/manifest.json:123:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/The_Weight_of_the_Sky:_The_Fall_into_Megiddo.txt
./system/resource-manager/manifest.json:124:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/THE_WEIGHT_OF_THE_SKY-_MASTER_COMPENDIUM_(SINGULARITY_v.txt
./system/resource-manager/manifest.json:125:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Untitled_document.txt
./system/resource-manager/manifest.json:126:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Version_A.txt
./system/resource-manager/manifest.json:127:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/chapter_11.2.txt
./system/resource-manager/manifest.json:128:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/•(G)_Chapter:_1_Stardust_to_Stardust_.txt
./system/resource-manager/manifest.json:129:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/•(G)_Chapter_2-_Living_Sacrifice.txt
./system/resource-manager/manifest.json:130:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(X)_Chapter_1_-_Stardust_to_Stardust.txt
./system/resource-manager/manifest.json:131:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(X)_Chapter_1__Stardust_to_Stardust_(2).txt
./system/resource-manager/manifest.json:132:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Z)_Chapter_1:_Stardust_to_Stardust.txt
./system/resource-manager/manifest.json:133:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/*Chapter_2-_Living_Sacrifice.txt
./system/resource-manager/manifest.json:134:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/*Chapter_7:_The_Pit.txt
./system/resource-manager/manifest.json:135:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/-Final_Chapter_1_Revision_Prompt-.txt
./system/resource-manager/manifest.json:136:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/*Chapter_9:_The_Ascent.txt
./system/resource-manager/manifest.json:137:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/10.0_Blueprint_for_The_Ascent_of_Daniel:_The_Archetype_of_Sacrifice_(NYT_Bestseller_Focus).txt
./system/resource-manager/manifest.json:138:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/10.0_Mass_Market.txt
./system/resource-manager/manifest.json:139:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/11.0_Error_Catalog.txt
./system/resource-manager/manifest.json:140:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/11.0_Marketability_.txt
./system/resource-manager/manifest.json:141:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/3.0_Final_.txt
./system/resource-manager/manifest.json:142:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/3.0_Scientific_Guide.txt
./system/resource-manager/manifest.json:143:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/13.0_GENERAL_PRINCIPLES.txt
./system/resource-manager/manifest.json:144:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/2.0_Critique_／_Analysis_Guide.txt
./system/resource-manager/manifest.json:145:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/5.0_Psychology_Guide.txt
./system/resource-manager/manifest.json:146:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/4.0_REVISED.txt
./system/resource-manager/manifest.json:147:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter 3 - Commerciality and Marketing 3.0.txt
./system/resource-manager/manifest.json:148:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/6.0_SYNTHESIS_MANDATE.txt
./system/resource-manager/manifest.json:149:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/6.0_HIGHEST_PRIORITY_(Read_this_first_and_then_again_last)_.txt
./system/resource-manager/manifest.json:150:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/7.0_Nuclear_Edit!!!!_(CRITICAL!_DIRE!_EMERGENCY!!!).txt
./system/resource-manager/manifest.json:151:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter2_Weight_of_the_Sky.txt
./system/resource-manager/manifest.json:152:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter:_1_Proof_of_Authorship_1.0.txt
./system/resource-manager/manifest.json:153:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter:_1_-_Stardust_to_Stardust.txt
./system/resource-manager/manifest.json:154:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_10:_Forsaken.txt
./system/resource-manager/manifest.json:155:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_11.8.txt
./system/resource-manager/manifest.json:156:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter:_1_Proof_of_Authorship_1.1.txt
./system/resource-manager/manifest.json:157:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_10_Forsaken_FINAL_DEFINITIVE.txt
./system/resource-manager/manifest.json:158:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_1:_Stardust_to_Stardust.txt
./system/resource-manager/manifest.json:159:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_1_Integration_2.0.txt
./system/resource-manager/manifest.json:160:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Critique_2.2.txt
./system/resource-manager/manifest.json:161:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_1_-_Stardust_to_Stardust.txt
./system/resource-manager/manifest.json:162:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_1_Integration.txt
./system/resource-manager/manifest.json:163:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_2_-_Commerciality_and_Marketing_3.0.txt
./system/resource-manager/manifest.json:164:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_1_Merge_Prompt.txt
./system/resource-manager/manifest.json:165:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_2_-_Master_Revision_Prompt_2.0.txt
./system/resource-manager/manifest.json:166:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_2nd_to_last.txt
./system/resource-manager/manifest.json:167:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_3_-_Master_Revision_Prompt_2.0.txt
./system/resource-manager/manifest.json:168:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_3_Analysis_&_Guides.txt
./system/resource-manager/manifest.json:169:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_3_Integration_Prompt.txt
./system/resource-manager/manifest.json:170:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_8:_Sea_People.txt
./system/resource-manager/manifest.json:171:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Narnia_.txt
./system/resource-manager/manifest.json:172:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_4:_Pilgrimage.txt
./system/resource-manager/manifest.json:173:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_5:_The_Snare.txt
./system/resource-manager/manifest.json:174:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Version_B.txt
./system/resource-manager/manifest.json:175:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_6:_Beelzebub,_Beelzebub.txt
./system/resource-manager/manifest.json:176:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Could_you_condense_that_chapter_by_500_to_1,000_w....txt
./system/resource-manager/manifest.json:177:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/WOS_Ch7_The_Pit.txt
./system/resource-manager/manifest.json:178:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Final Revision (Generalized For All Chapters).txt
./system/resource-manager/manifest.json:179:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/ToALITTERAS_ECOSYSTEM_v2.txt
./system/resource-manager/manifest.json:180:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Whole_Book.txt
./system/resource-manager/manifest.json:181:docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/﻿Chapter_1-_Stardust_to_Stardust.txt
./docs/forensics/nos/nos_manifest.json:6:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)Chapter_8:_Sea_People.txt"
./docs/forensics/nos/nos_manifest.json:11:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter:_1_Stardust_to_Stardust.txt"
./docs/forensics/nos/nos_manifest.json:16:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_1-_Stardust_to_Stardust.txt"
./docs/forensics/nos/nos_manifest.json:21:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_1:_Stardust_to_Stardust.txt"
./docs/forensics/nos/nos_manifest.json:26:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_1_-_Stardust_to_Stardust.txt"
./docs/forensics/nos/nos_manifest.json:31:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_2-_Living_Sacrifice.txt"
./docs/forensics/nos/nos_manifest.json:36:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_2:_Living_Sacrifice.txt"
./docs/forensics/nos/nos_manifest.json:41:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_3-_Lift_Up.txt"
./docs/forensics/nos/nos_manifest.json:46:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_3_-_Lift_Up.txt"
./docs/forensics/nos/nos_manifest.json:51:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_5_-_The_Snare.txt"
./docs/forensics/nos/nos_manifest.json:56:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_6:_Beelzebub,_Beelzebub.txt"
./docs/forensics/nos/nos_manifest.json:61:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)Chapter_8:_Sea_People.txt"
./docs/forensics/nos/nos_manifest.json:66:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter:_1_Stardust_to_Stardust.txt"
./docs/forensics/nos/nos_manifest.json:71:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_1-_Stardust_to_Stardust.txt"
./docs/forensics/nos/nos_manifest.json:76:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_1:_Stardust_to_Stardust.txt"
./docs/forensics/nos/nos_manifest.json:81:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_1_-_Stardust_to_Stardust.txt"
./docs/forensics/nos/nos_manifest.json:86:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_2-_Living_Sacrifice.txt"
./docs/forensics/nos/nos_manifest.json:91:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_2:_Living_Sacrifice.txt"
./docs/forensics/nos/nos_manifest.json:96:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_3-_Lift_Up.txt"
./docs/forensics/nos/nos_manifest.json:101:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_3:_Lift_Up.txt"
./docs/forensics/nos/nos_manifest.json:106:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_5-_The_Snare.txt"
./docs/forensics/nos/nos_manifest.json:111:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_6_-_Beelzebub,_Beelzebub.txt"
./docs/forensics/nos/nos_manifest.json:116:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_7:_The_Pit.txt"
./docs/forensics/nos/nos_manifest.json:121:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_9:_The_Ascent.txt"
./docs/forensics/nos/nos_manifest.json:126:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Stardust_to_Stardust.txt"
./docs/forensics/nos/nos_manifest.json:131:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)Chapter_8:_Sea_People.txt"
./docs/forensics/nos/nos_manifest.json:136:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter:_1_-_Stardust_to_Stardust_.txt"
./docs/forensics/nos/nos_manifest.json:141:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter:_7_-_The_Pit.txt"
./docs/forensics/nos/nos_manifest.json:146:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter:_Stardust_to_Stardust.txt"
./docs/forensics/nos/nos_manifest.json:151:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter_1-_Stardust_to_Stardust.txt"
./docs/forensics/nos/nos_manifest.json:156:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter_1_-_Stardust_to_Stardust.txt"
./docs/forensics/nos/nos_manifest.json:161:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter_2-_Living_Sacrifice.txt"
./docs/forensics/nos/nos_manifest.json:166:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter_3-_Lift_Up.txt"
./docs/forensics/nos/nos_manifest.json:171:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter_3_-_Lift_Up.txt"
./docs/forensics/nos/nos_manifest.json:176:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter_4-_Pilgrimage.txt"
./docs/forensics/nos/nos_manifest.json:181:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter_4_-_Pilgrimage.txt"
./docs/forensics/nos/nos_manifest.json:186:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter_6-_Beelzebub,_Beelzebub.txt"
./docs/forensics/nos/nos_manifest.json:191:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(D)_Chapter:_7_-_The_Pit.txt"
./docs/forensics/nos/nos_manifest.json:196:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(D)_Chapter_1_-_Stardust_to_Stardust.txt"
./docs/forensics/nos/nos_manifest.json:201:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(D)_Chapter_2-_Living_Sacrifice.txt"
./docs/forensics/nos/nos_manifest.json:206:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(D)_Chapter_2_-_Living_Sacrifice.txt"
./docs/forensics/nos/nos_manifest.json:211:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(E)_Chapter_1-_Stardust_to_Stardust.txt"
./docs/forensics/nos/nos_manifest.json:216:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(E)_Chapter_1_-_Stardust_to_Stardust.txt"
./docs/forensics/nos/nos_manifest.json:221:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(E)_Chapter_2-_Living_Sacrifice.txt"
./docs/forensics/nos/nos_manifest.json:226:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(E)_Chapter_2_-_Living_Sacrifice.txt"
./docs/forensics/nos/nos_manifest.json:231:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(E)_Chapter_3-_Lift_Up.txt"
./docs/forensics/nos/nos_manifest.json:236:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(F)_Chapter:_1_Stardust_to_Stardust_.txt"
./docs/forensics/nos/nos_manifest.json:241:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(F)_Chapter_1:_Stardust_to_Stardust_.txt"
./docs/forensics/nos/nos_manifest.json:246:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(F)_Chapter_1_-_Stardust_to_Stardust.txt"
./docs/forensics/nos/nos_manifest.json:251:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(F)_Chapter_2-_Living_Sacrifice.txt"
./docs/forensics/nos/nos_manifest.json:256:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(F)_Chapter_3-_Lift_Up.txt"
./docs/forensics/nos/nos_manifest.json:261:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Final)_Chapter_1:_Stardust_to_Stardust.txt"
./docs/forensics/nos/nos_manifest.json:266:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Final)_Chapter_1_-_Stardust_to_Stardust.txt"
./docs/forensics/nos/nos_manifest.json:271:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Final)_Chapter_2-_Living_Sacrifice.txt"
./docs/forensics/nos/nos_manifest.json:276:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Final)_Chapter_3-_Lift_Up.txt"
./docs/forensics/nos/nos_manifest.json:281:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Final)_Chapter_3:_Lift_Up.txt"
./docs/forensics/nos/nos_manifest.json:286:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Final)_Chapter_5_-_The_Snare.txt"
./docs/forensics/nos/nos_manifest.json:291:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(G)_Chapter_1:_Stardust_to_Stardust.txt"
./docs/forensics/nos/nos_manifest.json:296:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(G)_Chapter_2-_Living_Sacrifice.txt"
./docs/forensics/nos/nos_manifest.json:301:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(G)_Chapter_3-_Lift_Up.txt"
./docs/forensics/nos/nos_manifest.json:306:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(G)_Final_)_Chapter:_10_-_Forsaken.txt"
./docs/forensics/nos/nos_manifest.json:311:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(I)_(Notes)_Chapter:_1_Stardust_to_Stardust_.txt"
./docs/forensics/nos/nos_manifest.json:316:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(I)_Chapter:_1_Stardust_to_Stardust_.txt"
./docs/forensics/nos/nos_manifest.json:321:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(N)_CHAPTER_1-_STARDUST_TO_STARDUST.txt"
./docs/forensics/nos/nos_manifest.json:326:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(N)_Chapter_1_-_Stardust_to_Stardust.txt"
./docs/forensics/nos/nos_manifest.json:331:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Notes)_(P)_Chapter:_1_-_Stardust_to_Stardust.txt"
./docs/forensics/nos/nos_manifest.json:336:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Notes)_Chapter_2-_Living_Sacrifice.txt"
./docs/forensics/nos/nos_manifest.json:341:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Notes)_Chapter_2:_Living_Sacrifice.txt"
./docs/forensics/nos/nos_manifest.json:346:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(O)_Chapter_1-_Stardust_to_Stardust.txt"
./docs/forensics/nos/nos_manifest.json:351:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(P)_Chapter:_1_-_Stardust_to_Stardust.txt"
./docs/forensics/nos/nos_manifest.json:356:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Prompt_Guide_(E))_Chapter_10:_Forsaken.txt"
./docs/forensics/nos/nos_manifest.json:361:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(R) Chapter: 1 - Stardust to Stardust .txt"
./docs/forensics/nos/nos_manifest.json:366:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(R)_Chapter:_1_-_Stardust_to_Stardust_.txt"
./docs/forensics/nos/nos_manifest.json:371:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Revision_Prompt_(D))_Chapter_10:_Forsaken.txt"
./docs/forensics/nos/nos_manifest.json:376:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Revision_Prompt_(N)__Chapter_1_-_Stardust_to_Stardust.txt"
./docs/forensics/nos/nos_manifest.json:381:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Revisions)_Chapter_1:_Stardust_to_Stardust.txt"
./docs/forensics/nos/nos_manifest.json:386:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(SDP)_v2.txt"
./docs/forensics/nos/nos_manifest.json:391:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(X)_Chapter_1:_Stardust_to_Stardust.txt"
./docs/forensics/nos/nos_manifest.json:396:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(X)_Chapter_1_-_Stardust_to_Stardust.docx.txt"
./docs/forensics/nos/nos_manifest.json:401:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(X)_Chapter_1_-_Stardust_to_Stardust.txt"
./docs/forensics/nos/nos_manifest.json:406:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(X)_Chapter_1__Stardust_to_Stardust_(1).txt"
./docs/forensics/nos/nos_manifest.json:411:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(X)_Chapter_1__Stardust_to_Stardust_(2).txt"
./docs/forensics/nos/nos_manifest.json:416:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Z)_Chapter_1:_Stardust_to_Stardust.txt"
./docs/forensics/nos/nos_manifest.json:421:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/*Chapter_1:_Stardust_to_Stardust.txt"
./docs/forensics/nos/nos_manifest.json:426:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/*Chapter_2-_Living_Sacrifice.txt"
./docs/forensics/nos/nos_manifest.json:431:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/*Chapter_3:_Lift_Up.txt"
./docs/forensics/nos/nos_manifest.json:436:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/*Chapter_4:_Pilgrimage.txt"
./docs/forensics/nos/nos_manifest.json:441:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/*Chapter_7:_The_Pit.txt"
./docs/forensics/nos/nos_manifest.json:446:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/*Chapter_8:_Sea_People.txt"
./docs/forensics/nos/nos_manifest.json:451:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/*Chapter_9:_The_Ascent.txt"
./docs/forensics/nos/nos_manifest.json:456:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/-Final_Chapter_1_Revision_Prompt-.txt"
./docs/forensics/nos/nos_manifest.json:461:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/1.0_Revision.txt"
./docs/forensics/nos/nos_manifest.json:466:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/10.0_Blueprint_for_The_Ascent_of_Daniel:_The_Archetype_of_Sacrifice_(NYT_Bestseller_Focus).txt"
./docs/forensics/nos/nos_manifest.json:471:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/10.0_MASTER_SYSTEM_FOR_CHAPTER_REVISION.txt"
./docs/forensics/nos/nos_manifest.json:476:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/10.0_Mass_Market.txt"
./docs/forensics/nos/nos_manifest.json:481:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/11.0_Error_Catalog.txt"
./docs/forensics/nos/nos_manifest.json:486:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/11.0_Final_Revision.txt"
./docs/forensics/nos/nos_manifest.json:491:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/11.0_Marketability_.txt"
./docs/forensics/nos/nos_manifest.json:496:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/12.0_Perfection.txt"
./docs/forensics/nos/nos_manifest.json:501:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/13.0_Claude.txt"
./docs/forensics/nos/nos_manifest.json:506:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/13.0_GENERAL_PRINCIPLES.txt"
./docs/forensics/nos/nos_manifest.json:511:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/2.0_Critique_\uff0f_Analysis_Guide.txt"
./docs/forensics/nos/nos_manifest.json:516:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/2.0_This_is_the_critical_adjustment\u2014the_final_layer_that_elevates_philosophical_storytelling_into_timeless,_devastating_human_tragedy.txt"
./docs/forensics/nos/nos_manifest.json:521:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/3.0_Final_.txt"
./docs/forensics/nos/nos_manifest.json:526:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/3.0_Literary_&_Archetypal_Fusion_Rulebook_(The_Cat_God_&_The_Primal_Self).txt"
./docs/forensics/nos/nos_manifest.json:531:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/3.0_Scientific_Guide.txt"
./docs/forensics/nos/nos_manifest.json:536:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/4.0_(12_Rules_For_Life).txt"
./docs/forensics/nos/nos_manifest.json:541:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/4.0_Emotional_&_Archetypal_Editing_Rulebook_(Visceral_Empathy_Focus).txt"
./docs/forensics/nos/nos_manifest.json:546:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/4.0_Psychology_Guide.txt"
./docs/forensics/nos/nos_manifest.json:551:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/4.0_REVISED.txt"
./docs/forensics/nos/nos_manifest.json:556:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/5.0_Final_Guide.txt"
./docs/forensics/nos/nos_manifest.json:561:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/5.0_Psychology_Guide.txt"
./docs/forensics/nos/nos_manifest.json:566:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/6.0_Core_Editing_Rules_for_Thematic_&_Archetypal_Hyperlinking.txt"
./docs/forensics/nos/nos_manifest.json:571:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/6.0_HIGHEST_PRIORITY_(Read_this_first_and_then_again_last)_.txt"
./docs/forensics/nos/nos_manifest.json:576:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/6.0_SYNTHESIS_MANDATE.txt"
./docs/forensics/nos/nos_manifest.json:581:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/6.0_Supreme_Generative_Constraint.txt"
./docs/forensics/nos/nos_manifest.json:586:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/7.0_Chapter_Refinery.txt"
./docs/forensics/nos/nos_manifest.json:591:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/7.0_Nuclear_Edit!!!!_(CRITICAL!_DIRE!_EMERGENCY!!!).txt"
./docs/forensics/nos/nos_manifest.json:596:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/8.0_Pacing\uff0fRedundancy.txt"
./docs/forensics/nos/nos_manifest.json:601:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/8._0_This_is_the_final,_most_crucial_step:_ensuring_the_narrative's_structure_is_so_perfectly_weighted_that_the_profound_sadness\u2014the_weeping_of_self-recognition\u2014is_not_a_chance_event,_but_an_earned,_inevitable_catharsis_for_the_reader.txt"
./docs/forensics/nos/nos_manifest.json:606:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/9.0_Aesthetic.txt"
./docs/forensics/nos/nos_manifest.json:611:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/9.0_Stones.txt"
./docs/forensics/nos/nos_manifest.json:616:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/ALITTERAS_SYSTEM_BLUEPRINT_v1.txt"
./docs/forensics/nos/nos_manifest.json:621:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter 3 - Commerciality and Marketing 3.0.txt"
./docs/forensics/nos/nos_manifest.json:626:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter2_Weight_of_the_Sky.txt"
./docs/forensics/nos/nos_manifest.json:631:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter:_10_-_MASTER_BRIEFING.txt"
./docs/forensics/nos/nos_manifest.json:636:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter:_1_-_Stardust_to_Stardust.txt"
./docs/forensics/nos/nos_manifest.json:641:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter:_1_Proof_of_Authorship_1.0.txt"
./docs/forensics/nos/nos_manifest.json:646:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter:_1_Proof_of_Authorship_1.1.txt"
./docs/forensics/nos/nos_manifest.json:651:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter:_8_(Final).txt"
./docs/forensics/nos/nos_manifest.json:656:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_10.1.txt"
./docs/forensics/nos/nos_manifest.json:661:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_10.5.txt"
./docs/forensics/nos/nos_manifest.json:666:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_10:_Forsaken.txt"
./docs/forensics/nos/nos_manifest.json:671:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_10_Forsaken_FINAL_DEFINITIVE.txt"
./docs/forensics/nos/nos_manifest.json:676:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_10_Version_F.txt"
./docs/forensics/nos/nos_manifest.json:681:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_11.8.txt"
./docs/forensics/nos/nos_manifest.json:686:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_11._Forsaken.txt"
./docs/forensics/nos/nos_manifest.json:691:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_13:_Exodus.txt"
./docs/forensics/nos/nos_manifest.json:696:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_1:_Stardust_to_Stardust.txt"
./docs/forensics/nos/nos_manifest.json:701:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_1_-_Stardust_to_Stardust.txt"
./docs/forensics/nos/nos_manifest.json:706:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_1_Integration.txt"
./docs/forensics/nos/nos_manifest.json:711:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_1_Integration_2.0.txt"
./docs/forensics/nos/nos_manifest.json:716:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_1_Integration_Prompt.txt"
./docs/forensics/nos/nos_manifest.json:721:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_1_Merge_Prompt.txt"
./docs/forensics/nos/nos_manifest.json:726:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_1_Version_O.txt"
./docs/forensics/nos/nos_manifest.json:731:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_2:_Living_Sacrifice.txt"
./docs/forensics/nos/nos_manifest.json:736:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_2_-_Analysis_&_Guides_1.0.txt"
./docs/forensics/nos/nos_manifest.json:741:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_2_-_Commerciality_and_Marketing_3.0.txt"
./docs/forensics/nos/nos_manifest.json:746:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_2_-_Master_Revision_Prompt_2.0.txt"
./docs/forensics/nos/nos_manifest.json:751:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_2nd_to_last.txt"
./docs/forensics/nos/nos_manifest.json:756:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_3:_Lift_Up.txt"
./docs/forensics/nos/nos_manifest.json:761:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_3_-_Master_Revision_Prompt_2.0.txt"
./docs/forensics/nos/nos_manifest.json:766:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_3_Analysis_&_Guides.txt"
./docs/forensics/nos/nos_manifest.json:771:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_3_Integration_Prompt.txt"
./docs/forensics/nos/nos_manifest.json:776:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_4:_Pilgrimage.txt"
./docs/forensics/nos/nos_manifest.json:781:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_5:_The_Snare.txt"
./docs/forensics/nos/nos_manifest.json:786:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_6:_Beelzebub,_Beelzebub.txt"
./docs/forensics/nos/nos_manifest.json:791:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_8.1.txt"
./docs/forensics/nos/nos_manifest.json:796:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_8:_Sea_People.txt"
./docs/forensics/nos/nos_manifest.json:801:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_9:_The_Ascent.txt"
./docs/forensics/nos/nos_manifest.json:806:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Could_you_condense_that_chapter_by_500_to_1,000_w....txt"
./docs/forensics/nos/nos_manifest.json:811:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Critique_2.2.txt"
./docs/forensics/nos/nos_manifest.json:816:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Final Revision (Generalized For All Chapters).txt"
./docs/forensics/nos/nos_manifest.json:821:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Go_ahead_and_write_out_the_chapter_keep_in_mind_t....txt"
./docs/forensics/nos/nos_manifest.json:826:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/MANUSCRIPT_AUTOPSY.txt"
./docs/forensics/nos/nos_manifest.json:831:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Narnia_.txt"
./docs/forensics/nos/nos_manifest.json:836:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Purple_Prose_Prompt.txt"
./docs/forensics/nos/nos_manifest.json:841:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/THE_WEIGHT_OF_THE_SKY-_MASTER_COMPENDIUM_(SINGULARITY_v.txt"
./docs/forensics/nos/nos_manifest.json:846:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/The_-Version_X-_Meta-Prompt.txt"
./docs/forensics/nos/nos_manifest.json:851:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/The_Weight_of_the_Sky:_The_Fall_into_Megiddo.txt"
./docs/forensics/nos/nos_manifest.json:856:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/The_scrape.txt"
./docs/forensics/nos/nos_manifest.json:861:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/ToALITTERAS_ECOSYSTEM_v2.txt"
./docs/forensics/nos/nos_manifest.json:866:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Untitled_document.txt"
./docs/forensics/nos/nos_manifest.json:871:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Version_A.txt"
./docs/forensics/nos/nos_manifest.json:876:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Version_B.txt"
./docs/forensics/nos/nos_manifest.json:881:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/WOS_Ch7_The_Pit.txt"
./docs/forensics/nos/nos_manifest.json:886:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Whole_Book.txt"
./docs/forensics/nos/nos_manifest.json:891:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/chapter_11.2.txt"
./docs/forensics/nos/nos_manifest.json:896:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/\u2022(G)_Chapter:_1_Stardust_to_Stardust_.txt"
./docs/forensics/nos/nos_manifest.json:901:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/\u2022(G)_Chapter_2-_Living_Sacrifice.txt"
./docs/forensics/nos/nos_manifest.json:906:      "file_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/\ufeffChapter_1-_Stardust_to_Stardust.txt"
./scripts/nos_sync.sh:5:for file in docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/*.txt; do
./scripts/data-lineage-audit.sh:42:find docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw -type f 2>/dev/null | wc -l | tee -a reports/data-lineage-audit.txt
./scripts/archive-google-docs-by-local-names.mjs:9:  TARGET_DIRS.push("docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw");
./scripts/stage-numbered-download-readme-docs.py:8:DEST_ROOT = Path("src/data-layer/ingestion-buffer/readme_docs")
./scripts/stage-numbered-download-readme-docs.py:22:    ("tier_1_core", "095", "gdrive_raw_FULL_inventory.txt"),
./scripts/stage-numbered-download-readme-docs.py:111:Path("reports/readme_docs_stage_manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
./scripts/stage-numbered-download-readme-docs.py:112:Path("reports/readme_docs_missing.json").write_text(json.dumps(missing, indent=2), encoding="utf-8")
./scripts/stage-numbered-download-readme-docs.py:121:    "`src/data-layer/ingestion-buffer/readme_docs/`",
./scripts/stage-numbered-download-readme-docs.py:139:print("Wrote reports/readme_docs_stage_manifest.json")
./scripts/stage-numbered-download-readme-docs.py:140:print("Wrote reports/readme_docs_missing.json")
./scripts/perfect_weight/00_generate_perfection_scripts.py:37:  find src/data-layer/ingestion-buffer/readme_docs -type f -printf '%p\t%s bytes\n' 2>/dev/null | sort || true
./scripts/perfect_weight/00_generate_perfection_scripts.py:53:base = Path("src/data-layer/ingestion-buffer/readme_docs")
./scripts/perfect_weight/00_generate_perfection_scripts.py:132:base = Path("src/data-layer/ingestion-buffer/readme_docs")
./scripts/perfect_weight/00_generate_perfection_scripts.py:163:base = Path("src/data-layer/ingestion-buffer/readme_docs")
./scripts/perfect_weight/00_generate_perfection_scripts.py:354:"Keep gdrive_raw intact.",
./scripts/perfect_weight/00_generate_perfection_scripts.py:355:"Keep readme_docs intact.",
./scripts/perfect_weight/00_generate_perfection_scripts.py:433:lines.append("Primary source context: `src/data-layer/ingestion-buffer/readme_docs/`")
./scripts/perfect_weight/01_inventory.sh:21:  find src/data-layer/ingestion-buffer/readme_docs -type f -printf '%p\t%s bytes\n' 2>/dev/null | sort || true
./scripts/perfect_weight/02_context_classifier.py:5:base = Path("src/data-layer/ingestion-buffer/readme_docs")
./scripts/perfect_weight/04_uiux_extract.py:5:base = Path("src/data-layer/ingestion-buffer/readme_docs")
./scripts/perfect_weight/05_contradiction_fork_map.py:5:base = Path("src/data-layer/ingestion-buffer/readme_docs")
./scripts/perfect_weight/08_next_100_actions.py:79:"Keep gdrive_raw intact.",
./scripts/perfect_weight/08_next_100_actions.py:80:"Keep readme_docs intact.",
./scripts/perfect_weight/09_master_readme_builder.py:19:lines.append("Primary source context: `src/data-layer/ingestion-buffer/readme_docs/`")
./scripts/filename_standardization/standardize_context_filenames.py:11:    Path("src/data-layer/ingestion-buffer/readme_docs"),
./scripts/filename_standardization/standardize_context_filenames.py:118:readme_root = Path("src/data-layer/ingestion-buffer/readme_docs")
./scripts/filename_standardization/standardize_context_filenames.py:132:Path("reports/readme_docs_staged_files.txt").write_text("\n".join(x["path"] for x in staged) + "\n", encoding="utf-8")
./scripts/filename_standardization/standardize_context_filenames.py:143:    "`src/data-layer/ingestion-buffer/readme_docs/`",
./scripts/xml_recovery/audit_google_xml_extraction.sh:13:  echo "## Local gdrive_raw text targets"
./scripts/xml_recovery/audit_google_xml_extraction.sh:15:  if [ -d "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw" ]; then
./scripts/xml_recovery/audit_google_xml_extraction.sh:16:    echo "- gdrive_raw file count: $(find docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw -type f | wc -l)"
./scripts/xml_recovery/audit_google_xml_extraction.sh:18:    echo "- gdrive_raw missing"
./scripts/xml_recovery/audit_google_xml_extraction.sh:22:  echo "- gdrive_ooxml_raw file count: $(find src/data-layer/ingestion-buffer/gdrive_ooxml_raw -type f 2>/dev/null | wc -l || echo 0)"
./scripts/xml_recovery/materialize_ooxml_raw.py:9:DEST = Path("src/data-layer/ingestion-buffer/gdrive_ooxml_raw")
./scripts/xml_recovery/materialize_ooxml_raw.py:53:Path("reports/gdrive_ooxml_raw_files.txt").write_text("\n".join(m["dest"] for m in manifest) + "\n", encoding="utf-8")
./scripts/runtime_sources/create_active_runtime_source_layout.py:6:RUNTIME = Path("data/runtime_sources/weight_of_the_sky")
./scripts/runtime_sources/create_active_runtime_source_layout.py:21:    "10_ingestion_baselines": "Machine ingestion baselines, gdrive_raw text targets, extracted raw text.",
./scripts/runtime_sources/create_active_runtime_source_layout.py:110:    "`data/runtime_sources/weight_of_the_sky/` is active manuscript, renderer, typography, lore, revision, and ingestion source data.",
./scripts/runtime_sources/create_active_runtime_source_layout.py:114:    "Old `src/data-layer/ingestion-buffer/*` folders remain compatibility inputs until every import/script is audited and cut over.",
./scripts/runtime_sources/create_active_runtime_source_layout.py:149:    Path("src/data-layer/ingestion-buffer/readme_docs"),
./scripts/runtime_sources/create_active_runtime_source_layout.py:157:    Path("src/data-layer/ingestion-buffer/readme_docs"),
./scripts/runtime_sources/create_active_runtime_source_layout.py:165:    Path("docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw"),
./scripts/runtime_sources/create_active_runtime_source_layout.py:166:    RUNTIME / "10_ingestion_baselines/gdrive_raw_text_baseline",
./scripts/runtime_sources/create_active_runtime_source_layout.py:167:    "gdrive_raw_text_baseline",
./scripts/runtime_sources/create_active_runtime_source_layout.py:173:    Path("src/data-layer/ingestion-buffer/gdrive_docx_intake"),
./scripts/runtime_sources/create_active_runtime_source_layout.py:181:    Path("src/data-layer/ingestion-buffer/gdrive_ooxml_raw"),
./scripts/runtime_sources/read_renderer_documents.py:5:RUNTIME = Path("data/runtime_sources/weight_of_the_sky")
./scripts/runtime_sources/audit_runtime_import_paths.sh:17:    --exclude-dir=data/runtime_sources \
./scripts/runtime_sources/audit_runtime_import_paths.sh:20:    "src/data-layer/ingestion-buffer\|gdrive_raw\|readme_docs\|gdrive_ooxml_raw\|gdrive_docx_intake\|data/runtime_sources\|SOURCE_RUNTIME" \
./scripts/runtime_sources/audit_runtime_import_paths.sh:26:    docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw \
./scripts/runtime_sources/audit_runtime_import_paths.sh:27:    src/data-layer/ingestion-buffer/readme_docs \
./scripts/runtime_sources/audit_runtime_import_paths.sh:28:    src/data-layer/ingestion-buffer/gdrive_docx_intake \
./scripts/runtime_sources/audit_runtime_import_paths.sh:29:    src/data-layer/ingestion-buffer/gdrive_ooxml_raw \
./scripts/runtime_sources/audit_runtime_import_paths.sh:30:    data/runtime_sources/weight_of_the_sky
./scripts/runtime_sources/write_runtime_source_constants.py:13:// data/runtime_sources/weight_of_the_sky/ is runtime manuscript/source data.
./scripts/runtime_sources/write_runtime_source_constants.py:15:export const RUNTIME_SOURCE_ROOT = "data/runtime_sources/weight_of_the_sky";
./scripts/runtime_sources/write_runtime_source_constants.py:17:export const RUNTIME_SOURCE_PATHS = {
./scripts/runtime_sources/write_runtime_source_constants.py:18:  protocols: "data/runtime_sources/weight_of_the_sky/00_protocols",
./scripts/runtime_sources/write_runtime_source_constants.py:19:  rendererActiveInputs: "data/runtime_sources/weight_of_the_sky/01_renderer_active_inputs",
./scripts/runtime_sources/write_runtime_source_constants.py:20:  typographySources: "data/runtime_sources/weight_of_the_sky/02_typography_sources",
./scripts/runtime_sources/write_runtime_source_constants.py:21:  layerToCinemaSources: "data/runtime_sources/weight_of_the_sky/03_layer_to_cinema_sources",
./scripts/runtime_sources/write_runtime_source_constants.py:22:  currentFinalDrafts: "data/runtime_sources/weight_of_the_sky/04_current_final_drafts",
./scripts/runtime_sources/write_runtime_source_constants.py:23:  revisionSnapshots: "data/runtime_sources/weight_of_the_sky/05_revision_snapshots",
./scripts/runtime_sources/write_runtime_source_constants.py:24:  currentOoxml: "data/runtime_sources/weight_of_the_sky/06_ooxml_current",
./scripts/runtime_sources/write_runtime_source_constants.py:25:  revisionOoxml: "data/runtime_sources/weight_of_the_sky/07_ooxml_revision_exports",
./scripts/runtime_sources/write_runtime_source_constants.py:26:  worldbuildingLore: "data/runtime_sources/weight_of_the_sky/08_worldbuilding_lore",
./scripts/runtime_sources/write_runtime_source_constants.py:27:  synopsisCompendiums: "data/runtime_sources/weight_of_the_sky/09_synopsis_compendiums",
./scripts/runtime_sources/write_runtime_source_constants.py:28:  ingestionBaselines: "data/runtime_sources/weight_of_the_sky/10_ingestion_baselines",
./scripts/runtime_sources/write_runtime_source_constants.py:29:  agentContext: "data/runtime_sources/weight_of_the_sky/11_agent_context",
./scripts/runtime_sources/write_runtime_source_constants.py:30:  supabaseIndexes: "data/runtime_sources/weight_of_the_sky/12_supabase_indexes",
./scripts/runtime_sources/write_runtime_source_constants.py:31:  manualSortInbox: "data/runtime_sources/weight_of_the_sky/99_manual_sort_inbox",
./scripts/runtime_sources/write_runtime_source_constants.py:32:  quarantineDoNotIngest: "data/runtime_sources/weight_of_the_sky/99_quarantine_do_not_ingest",
./scripts/runtime_sources/write_runtime_source_constants.py:36:  gdriveRawTextBaseline: "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./scripts/runtime_sources/write_runtime_source_constants.py:37:  gdriveDocxIntake: "src/data-layer/ingestion-buffer/gdrive_docx_intake",
./scripts/runtime_sources/write_runtime_source_constants.py:38:  gdriveOoxmlRaw: "src/data-layer/ingestion-buffer/gdrive_ooxml_raw",
./scripts/runtime_sources/write_runtime_source_constants.py:39:  readmeDocs: "src/data-layer/ingestion-buffer/readme_docs",
./scripts/runtime_sources/write_runtime_source_registry.py:6:ROOT = Path("data/runtime_sources/weight_of_the_sky")
./scripts/runtime_sources/clean_runtime_import_audit.sh:16:    --exclude-dir=data/runtime_sources \
./scripts/runtime_sources/clean_runtime_import_audit.sh:22:    "src/data-layer/ingestion-buffer\|gdrive_raw\|readme_docs\|gdrive_ooxml_raw\|gdrive_docx_intake\|data/runtime_sources\|RUNTIME_SOURCE" \
./scripts/runtime_sources/code_only_runtime_path_audit.sh:24:    -not -path './data/runtime_sources/*' \
./scripts/runtime_sources/code_only_runtime_path_audit.sh:26:    -not -path './src/data-layer/ingestion-buffer/readme_docs/*' \
./scripts/runtime_sources/code_only_runtime_path_audit.sh:28:  | xargs -0 grep -nE "src/data-layer/ingestion-buffer|gdrive_raw|readme_docs|gdrive_ooxml_raw|gdrive_docx_intake|data/runtime_sources|RUNTIME_SOURCE" 2>/dev/null || true
./scripts/runtime_sources/code_only_runtime_path_audit.sh:42:    "src/data-layer/ingestion-buffer\|gdrive_raw\|readme_docs\|gdrive_ooxml_raw\|gdrive_docx_intake" \
./scripts/runtime_sources/code_only_runtime_path_audit.sh:43:    src/data-layer/ingestion-buffer/readme_docs 2>/dev/null || true
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:3:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:4:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/-Final_Chapter_1_Revision_Prompt-.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:19:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:20:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_1_-_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:27:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:28:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_1-_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:35:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:36:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_1:_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:43:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:44:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_2-_Living_Sacrifice.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:51:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:52:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_2:_Living_Sacrifice.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:59:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:60:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_3_-_Lift_Up.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:67:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:68:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_3-_Lift_Up.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:75:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:76:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_5_-_The_Snare.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:83:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:84:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_6:_Beelzebub,_Beelzebub.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:91:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:92:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter:_1_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:99:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:100:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)Chapter_8:_Sea_People.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:107:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:108:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_1_-_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:115:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:116:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_1-_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:123:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:124:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_1:_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:131:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:132:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_2-_Living_Sacrifice.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:139:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:140:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_2:_Living_Sacrifice.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:147:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:148:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_3-_Lift_Up.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:155:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:156:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_3:_Lift_Up.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:163:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:164:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_5-_The_Snare.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:171:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:172:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_6_-_Beelzebub,_Beelzebub.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:179:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:180:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_7:_The_Pit.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:187:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:188:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_9:_The_Ascent.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:195:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:196:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter:_1_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:203:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:204:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:211:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:212:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)Chapter_8:_Sea_People.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:219:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:220:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter_1_-_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:227:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:228:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter_1-_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:235:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:236:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter_2-_Living_Sacrifice.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:243:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:244:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter_3_-_Lift_Up.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:251:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:252:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter_3-_Lift_Up.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:259:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:260:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter_4_-_Pilgrimage.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:267:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:268:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter_4-_Pilgrimage.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:275:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:276:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter_6-_Beelzebub,_Beelzebub.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:283:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:284:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter:_1_-_Stardust_to_Stardust_.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:291:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:292:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter:_7_-_The_Pit.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:299:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:300:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter:_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:307:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:308:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)Chapter_8:_Sea_People.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:315:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:316:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(D)_Chapter_1_-_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:323:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:324:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(D)_Chapter_2_-_Living_Sacrifice.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:331:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:332:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(D)_Chapter_2-_Living_Sacrifice.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:339:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:340:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(D)_Chapter:_7_-_The_Pit.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:347:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:348:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(E)_Chapter_1_-_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:355:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:356:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(E)_Chapter_1-_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:363:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:364:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(E)_Chapter_2_-_Living_Sacrifice.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:371:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:372:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(E)_Chapter_2-_Living_Sacrifice.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:379:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:380:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(E)_Chapter_3-_Lift_Up.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:387:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:388:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(F)_Chapter_1_-_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:395:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:396:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(F)_Chapter_1:_Stardust_to_Stardust_.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:403:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:404:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(F)_Chapter_2-_Living_Sacrifice.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:411:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:412:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(F)_Chapter_3-_Lift_Up.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:419:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:420:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(F)_Chapter:_1_Stardust_to_Stardust_.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:427:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:428:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Final) Chapter: 7 - The Pit.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:435:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:436:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Final)_Chapter_1_-_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:443:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:444:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Final)_Chapter_1:_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:451:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:452:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Final)_Chapter_2-_Living_Sacrifice.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:459:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:460:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Final)_Chapter_3-_Lift_Up.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:467:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:468:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Final)_Chapter_3:_Lift_Up.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:475:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:476:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Final)_Chapter_5_-_The_Snare.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:483:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:484:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(G)_Chapter_1:_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:491:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:492:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(G)_Chapter_2-_Living_Sacrifice.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:499:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:500:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(G)_Chapter_3-_Lift_Up.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:507:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:508:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(G)_Final_)_Chapter:_10_-_Forsaken.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:515:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:516:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(I)_(Notes)_Chapter:_1_Stardust_to_Stardust_.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:523:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:524:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(I)_Chapter:_1_Stardust_to_Stardust_.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:531:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:532:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(N)_Chapter_1_-_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:539:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:540:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(N)_CHAPTER_1-_STARDUST_TO_STARDUST.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:547:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:548:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Notes)_(P)_Chapter:_1_-_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:555:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:556:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Notes)_Chapter_2-_Living_Sacrifice.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:563:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:564:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Notes)_Chapter_2:_Living_Sacrifice.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:571:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:572:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(O)_Chapter_1-_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:579:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:580:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(P)_Chapter:_1_-_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:587:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:588:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Prompt_Guide_(E))_Chapter_10:_Forsaken.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:595:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:596:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(R) Chapter: 1 - Stardust to Stardust .txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:603:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:604:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(R)_Chapter:_1_-_Stardust_to_Stardust_.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:611:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:612:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Revision_Prompt_(D))_Chapter_10:_Forsaken.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:619:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:620:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Revision_Prompt_(N)__Chapter_1_-_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:627:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:628:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Revisions)_Chapter_1:_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:635:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:636:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(SDP)_v2.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:643:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:644:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(X)_Chapter_1__Stardust_to_Stardust_(1).txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:651:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:652:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(X)_Chapter_1__Stardust_to_Stardust_(2).txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:659:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:660:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(X)_Chapter_1_-_Stardust_to_Stardust.docx.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:667:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:668:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(X)_Chapter_1_-_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:675:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:676:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(X)_Chapter_1:_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:683:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:684:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Z)_Chapter_1:_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:691:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:692:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/*Chapter_1:_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:699:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:700:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/*Chapter_2-_Living_Sacrifice.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:707:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:708:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/*Chapter_3:_Lift_Up.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:715:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:716:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/*Chapter_4:_Pilgrimage.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:723:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:724:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/*Chapter_7:_The_Pit.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:731:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:732:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/*Chapter_8:_Sea_People.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:739:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:740:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/*Chapter_9:_The_Ascent.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:747:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:748:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/•(G)_Chapter_2-_Living_Sacrifice.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:755:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:756:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/•(G)_Chapter:_1_Stardust_to_Stardust_.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:763:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:764:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/1.0_Revision.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:771:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:772:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/10.0_Blueprint_for_The_Ascent_of_Daniel:_The_Archetype_of_Sacrifice_(NYT_Bestseller_Focus).txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:779:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:780:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/10.0_Mass_Market.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:787:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:788:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/10.0_MASTER_SYSTEM_FOR_CHAPTER_REVISION.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:795:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:796:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/11.0_Error_Catalog.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:803:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:804:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/11.0_Final_Revision.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:811:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:812:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/11.0_Marketability_.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:819:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:820:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/12.0_Perfection.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:827:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:828:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/13.0_Claude.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:835:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:836:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/13.0_GENERAL_PRINCIPLES.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:843:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:844:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/2.0_Critique_／_Analysis_Guide.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:851:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:852:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/2.0_This_is_the_critical_adjustment—the_final_layer_that_elevates_philosophical_storytelling_into_timeless,_devastating_human_tragedy.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:859:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:860:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/3.0_Final_.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:867:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:868:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/3.0_Literary_&_Archetypal_Fusion_Rulebook_(The_Cat_God_&_The_Primal_Self).txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:875:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:876:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/3.0_Scientific_Guide.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:883:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:884:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/4.0_(12_Rules_For_Life).txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:891:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:892:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/4.0_Emotional_&_Archetypal_Editing_Rulebook_(Visceral_Empathy_Focus).txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:899:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:900:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/4.0_Psychology_Guide.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:907:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:908:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/4.0_REVISED.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:915:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:916:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/5.0_Final_Guide.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:923:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:924:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/5.0_Psychology_Guide.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:931:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:932:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/6.0_Core_Editing_Rules_for_Thematic_&_Archetypal_Hyperlinking.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:939:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:940:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/6.0_HIGHEST_PRIORITY_(Read_this_first_and_then_again_last)_.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:947:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:948:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/6.0_Supreme_Generative_Constraint.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:955:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:956:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/6.0_SYNTHESIS_MANDATE.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:963:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:964:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/7.0_Chapter_Refinery.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:971:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:972:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/7.0_Nuclear_Edit!!!!_(CRITICAL!_DIRE!_EMERGENCY!!!).txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:979:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:980:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/8._0_This_is_the_final,_most_crucial_step:_ensuring_the_narrative's_structure_is_so_perfectly_weighted_that_the_profound_sadness—the_weeping_of_self-recognition—is_not_a_chance_event,_but_an_earned,_inevitable_catharsis_for_the_reader.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:987:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:988:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/8.0_Pacing／Redundancy.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:995:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:996:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/9.0_Aesthetic.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1003:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1004:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/9.0_Stones.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1083:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1084:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/ALITTERAS_SYSTEM_BLUEPRINT_v1.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1107:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1108:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter 3 - Commerciality and Marketing 3.0.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1187:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1188:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_1_-_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1195:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1196:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_1_Integration_2.0.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1203:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1204:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_1_Integration_Prompt.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1211:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1212:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_1_Integration.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1219:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1220:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_1_Merge_Prompt.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1251:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1252:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_1_Version_O.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1259:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1260:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_1:_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1275:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1276:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_10_Forsaken_FINAL_DEFINITIVE.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1283:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1284:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_10_Version_F.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1291:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1292:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_10:_Forsaken.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1299:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1300:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_10.1.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1307:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1308:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_10.5.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1323:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1324:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_11._Forsaken.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1331:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1332:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/chapter_11.2.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1339:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1340:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_11.8.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1363:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1364:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_13:_Exodus.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1419:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1420:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_2_-_Analysis_&_Guides_1.0.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1427:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1428:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_2_-_Commerciality_and_Marketing_3.0.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1435:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1436:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_2_-_Master_Revision_Prompt_2.0.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1443:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1444:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_2:_Living_Sacrifice.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1499:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1500:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_2nd_to_last.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1507:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1508:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_3_-_Master_Revision_Prompt_2.0.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1515:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1516:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_3_Analysis_&_Guides.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1523:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1524:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_3_Integration_Prompt.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1531:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1532:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_3:_Lift_Up.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1539:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1540:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_4:_Pilgrimage.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1547:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1548:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_5:_The_Snare.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1555:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1556:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_6:_Beelzebub,_Beelzebub.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1563:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1564:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_8:_Sea_People.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1571:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1572:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_8.1.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1579:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1580:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_9:_The_Ascent.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1587:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1588:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter:_1_-_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1595:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1596:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter:_1_Proof_of_Authorship_1.0.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1603:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1604:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter:_1_Proof_of_Authorship_1.1.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1611:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1612:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter:_10_-_MASTER_BRIEFING.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1619:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1620:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter:_8_(Final).txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1627:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1628:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter2_Weight_of_the_Sky.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1683:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1684:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Could_you_condense_that_chapter_by_500_to_1,000_w....txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1691:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1692:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Critique_2.2.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1771:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1772:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Final Revision (Generalized For All Chapters).txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1812:    "local_path": "/sdcard/Download/gdrive_raw_FULL_inventory.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1813:    "local_name": "gdrive_raw_FULL_inventory.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1819:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1820:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Go_ahead_and_write_out_the_chapter_keep_in_mind_t....txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1907:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1908:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/MANUSCRIPT_AUTOPSY.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1963:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:1964:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Narnia_.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:2187:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:2188:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Purple_Prose_Prompt.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:2339:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:2340:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/The_-Version_X-_Meta-Prompt.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:2363:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:2364:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/The_scrape.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:2403:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:2404:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/THE_WEIGHT_OF_THE_SKY-_MASTER_COMPENDIUM_(SINGULARITY_v.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:2411:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:2412:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/The_Weight_of_the_Sky:_The_Fall_into_Megiddo.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:2419:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:2420:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/ToALITTERAS_ECOSYSTEM_v2.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:2483:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:2484:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Untitled_document.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:2491:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:2492:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Version_A.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:2499:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:2500:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Version_B.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:2531:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:2532:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Whole_Book.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:2547:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T03-48-42-000Z/local-name-targets.json:2548:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/WOS_Ch7_The_Pit.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:3:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:4:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/-Final_Chapter_1_Revision_Prompt-.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:11:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:12:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_1_-_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:19:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:20:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_1-_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:27:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:28:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_1:_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:35:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:36:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_2-_Living_Sacrifice.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:43:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:44:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_2:_Living_Sacrifice.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:51:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:52:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_3_-_Lift_Up.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:59:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:60:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_3-_Lift_Up.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:67:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:68:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_5_-_The_Snare.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:75:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:76:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter_6:_Beelzebub,_Beelzebub.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:83:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:84:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)_Chapter:_1_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:91:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:92:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(A)Chapter_8:_Sea_People.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:99:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:100:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_1_-_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:107:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:108:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_1-_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:115:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:116:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_1:_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:123:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:124:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_2-_Living_Sacrifice.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:131:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:132:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_2:_Living_Sacrifice.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:139:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:140:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_3-_Lift_Up.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:147:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:148:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_3:_Lift_Up.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:155:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:156:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_5-_The_Snare.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:163:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:164:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_6_-_Beelzebub,_Beelzebub.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:171:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:172:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_7:_The_Pit.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:179:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:180:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter_9:_The_Ascent.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:187:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:188:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Chapter:_1_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:195:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:196:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:203:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:204:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(B)Chapter_8:_Sea_People.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:211:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:212:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter_1_-_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:219:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:220:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter_1-_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:227:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:228:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter_2-_Living_Sacrifice.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:235:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:236:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter_3_-_Lift_Up.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:243:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:244:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter_3-_Lift_Up.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:251:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:252:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter_4_-_Pilgrimage.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:259:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:260:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter_4-_Pilgrimage.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:267:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:268:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter_6-_Beelzebub,_Beelzebub.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:275:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:276:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter:_1_-_Stardust_to_Stardust_.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:283:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:284:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter:_7_-_The_Pit.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:291:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:292:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)_Chapter:_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:299:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:300:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(C)Chapter_8:_Sea_People.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:307:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:308:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(D)_Chapter_1_-_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:315:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:316:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(D)_Chapter_2_-_Living_Sacrifice.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:323:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:324:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(D)_Chapter_2-_Living_Sacrifice.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:331:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:332:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(D)_Chapter:_7_-_The_Pit.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:339:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:340:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(E)_Chapter_1_-_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:347:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:348:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(E)_Chapter_1-_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:355:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:356:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(E)_Chapter_2_-_Living_Sacrifice.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:363:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:364:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(E)_Chapter_2-_Living_Sacrifice.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:371:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:372:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(E)_Chapter_3-_Lift_Up.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:379:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:380:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(F)_Chapter_1_-_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:387:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:388:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(F)_Chapter_1:_Stardust_to_Stardust_.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:395:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:396:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(F)_Chapter_2-_Living_Sacrifice.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:403:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:404:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(F)_Chapter_3-_Lift_Up.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:411:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:412:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(F)_Chapter:_1_Stardust_to_Stardust_.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:419:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:420:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Final) Chapter: 7 - The Pit.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:427:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:428:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Final)_Chapter_1_-_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:435:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:436:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Final)_Chapter_1:_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:443:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:444:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Final)_Chapter_2-_Living_Sacrifice.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:451:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:452:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Final)_Chapter_3-_Lift_Up.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:459:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:460:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Final)_Chapter_3:_Lift_Up.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:467:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:468:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Final)_Chapter_5_-_The_Snare.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:475:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:476:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(G)_Chapter_1:_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:483:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:484:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(G)_Chapter_2-_Living_Sacrifice.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:491:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:492:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(G)_Chapter_3-_Lift_Up.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:499:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:500:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(G)_Final_)_Chapter:_10_-_Forsaken.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:507:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:508:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(I)_(Notes)_Chapter:_1_Stardust_to_Stardust_.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:515:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:516:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(I)_Chapter:_1_Stardust_to_Stardust_.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:523:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:524:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(N)_Chapter_1_-_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:531:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:532:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(N)_CHAPTER_1-_STARDUST_TO_STARDUST.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:539:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:540:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Notes)_(P)_Chapter:_1_-_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:547:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:548:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Notes)_Chapter_2-_Living_Sacrifice.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:555:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:556:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Notes)_Chapter_2:_Living_Sacrifice.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:563:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:564:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(O)_Chapter_1-_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:571:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:572:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(P)_Chapter:_1_-_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:579:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:580:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Prompt_Guide_(E))_Chapter_10:_Forsaken.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:587:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:588:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(R) Chapter: 1 - Stardust to Stardust .txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:595:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:596:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(R)_Chapter:_1_-_Stardust_to_Stardust_.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:603:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:604:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Revision_Prompt_(D))_Chapter_10:_Forsaken.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:611:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:612:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Revision_Prompt_(N)__Chapter_1_-_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:619:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:620:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Revisions)_Chapter_1:_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:627:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:628:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(SDP)_v2.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:635:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:636:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(X)_Chapter_1__Stardust_to_Stardust_(1).txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:643:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:644:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(X)_Chapter_1__Stardust_to_Stardust_(2).txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:651:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:652:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(X)_Chapter_1_-_Stardust_to_Stardust.docx.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:659:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:660:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(X)_Chapter_1_-_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:667:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:668:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(X)_Chapter_1:_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:675:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:676:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/(Z)_Chapter_1:_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:683:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:684:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/*Chapter_1:_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:691:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:692:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/*Chapter_2-_Living_Sacrifice.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:699:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:700:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/*Chapter_3:_Lift_Up.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:707:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:708:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/*Chapter_4:_Pilgrimage.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:715:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:716:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/*Chapter_7:_The_Pit.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:723:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:724:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/*Chapter_8:_Sea_People.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:731:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:732:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/*Chapter_9:_The_Ascent.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:739:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:740:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/•(G)_Chapter_2-_Living_Sacrifice.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:747:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:748:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/•(G)_Chapter:_1_Stardust_to_Stardust_.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:755:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:756:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/1.0_Revision.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:763:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:764:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/10.0_Blueprint_for_The_Ascent_of_Daniel:_The_Archetype_of_Sacrifice_(NYT_Bestseller_Focus).txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:771:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:772:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/10.0_Mass_Market.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:779:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:780:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/10.0_MASTER_SYSTEM_FOR_CHAPTER_REVISION.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:787:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:788:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/11.0_Error_Catalog.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:795:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:796:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/11.0_Final_Revision.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:803:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:804:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/11.0_Marketability_.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:811:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:812:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/12.0_Perfection.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:819:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:820:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/13.0_Claude.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:827:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:828:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/13.0_GENERAL_PRINCIPLES.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:835:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:836:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/2.0_Critique_／_Analysis_Guide.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:843:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:844:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/2.0_This_is_the_critical_adjustment—the_final_layer_that_elevates_philosophical_storytelling_into_timeless,_devastating_human_tragedy.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:851:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:852:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/3.0_Final_.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:859:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:860:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/3.0_Literary_&_Archetypal_Fusion_Rulebook_(The_Cat_God_&_The_Primal_Self).txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:867:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:868:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/3.0_Scientific_Guide.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:875:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:876:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/4.0_(12_Rules_For_Life).txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:883:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:884:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/4.0_Emotional_&_Archetypal_Editing_Rulebook_(Visceral_Empathy_Focus).txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:891:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:892:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/4.0_Psychology_Guide.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:899:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:900:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/4.0_REVISED.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:907:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:908:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/5.0_Final_Guide.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:915:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:916:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/5.0_Psychology_Guide.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:923:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:924:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/6.0_Core_Editing_Rules_for_Thematic_&_Archetypal_Hyperlinking.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:931:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:932:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/6.0_HIGHEST_PRIORITY_(Read_this_first_and_then_again_last)_.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:939:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:940:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/6.0_Supreme_Generative_Constraint.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:947:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:948:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/6.0_SYNTHESIS_MANDATE.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:955:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:956:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/7.0_Chapter_Refinery.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:963:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:964:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/7.0_Nuclear_Edit!!!!_(CRITICAL!_DIRE!_EMERGENCY!!!).txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:971:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:972:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/8._0_This_is_the_final,_most_crucial_step:_ensuring_the_narrative's_structure_is_so_perfectly_weighted_that_the_profound_sadness—the_weeping_of_self-recognition—is_not_a_chance_event,_but_an_earned,_inevitable_catharsis_for_the_reader.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:979:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:980:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/8.0_Pacing／Redundancy.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:987:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:988:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/9.0_Aesthetic.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:995:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:996:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/9.0_Stones.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1003:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1004:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/ALITTERAS_SYSTEM_BLUEPRINT_v1.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1011:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1012:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter 3 - Commerciality and Marketing 3.0.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1019:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1020:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_1_-_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1027:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1028:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_1_Integration_2.0.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1035:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1036:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_1_Integration_Prompt.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1043:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1044:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_1_Integration.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1051:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1052:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_1_Merge_Prompt.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1059:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1060:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_1_Version_O.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1067:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1068:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_1:_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1075:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1076:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_10_Forsaken_FINAL_DEFINITIVE.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1083:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1084:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_10_Version_F.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1091:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1092:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_10:_Forsaken.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1099:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1100:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_10.1.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1107:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1108:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_10.5.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1115:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1116:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_11._Forsaken.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1123:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1124:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/chapter_11.2.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1131:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1132:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_11.8.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1139:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1140:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_13:_Exodus.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1147:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1148:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_2_-_Analysis_&_Guides_1.0.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1155:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1156:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_2_-_Commerciality_and_Marketing_3.0.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1163:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1164:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_2_-_Master_Revision_Prompt_2.0.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1171:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1172:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_2:_Living_Sacrifice.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1179:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1180:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_2nd_to_last.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1187:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1188:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_3_-_Master_Revision_Prompt_2.0.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1195:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1196:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_3_Analysis_&_Guides.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1203:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1204:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_3_Integration_Prompt.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1211:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1212:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_3:_Lift_Up.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1219:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1220:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_4:_Pilgrimage.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1227:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1228:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_5:_The_Snare.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1235:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1236:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_6:_Beelzebub,_Beelzebub.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1243:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1244:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_8:_Sea_People.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1251:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1252:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_8.1.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1259:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1260:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter_9:_The_Ascent.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1267:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1268:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter:_1_-_Stardust_to_Stardust.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1275:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1276:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter:_1_Proof_of_Authorship_1.0.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1283:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1284:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter:_1_Proof_of_Authorship_1.1.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1291:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1292:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter:_10_-_MASTER_BRIEFING.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1299:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1300:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter:_8_(Final).txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1307:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1308:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Chapter2_Weight_of_the_Sky.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1315:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1316:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Could_you_condense_that_chapter_by_500_to_1,000_w....txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1323:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1324:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Critique_2.2.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1331:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1332:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Final Revision (Generalized For All Chapters).txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1339:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1340:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Go_ahead_and_write_out_the_chapter_keep_in_mind_t....txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1347:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1348:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/MANUSCRIPT_AUTOPSY.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1355:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1356:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Narnia_.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1363:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1364:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Purple_Prose_Prompt.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1371:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1372:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/The_-Version_X-_Meta-Prompt.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1379:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1380:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/The_scrape.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1387:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1388:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/THE_WEIGHT_OF_THE_SKY-_MASTER_COMPENDIUM_(SINGULARITY_v.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1395:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1396:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/The_Weight_of_the_Sky:_The_Fall_into_Megiddo.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1403:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1404:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/ToALITTERAS_ECOSYSTEM_v2.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1411:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1412:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Untitled_document.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1419:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1420:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Version_A.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1427:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1428:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Version_B.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1435:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1436:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/Whole_Book.txt",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1443:    "source_root": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw",
./data/source_archive/name_matched_google_docs/2026-06-13T04-18-56-313Z/local-name-targets.json:1444:    "local_path": "docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw/WOS_Ch7_The_Pit.txt",
