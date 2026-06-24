# Selected XML Corpus Coverage Audit
date: 2026-06-24
branch: fix/selected-xml-ollama-ready-gate
auditor: Claude Code (automated)

## Summary

| Item | Value |
|---|---|
| Selected source folders | 16 |
| `document.xml` files resolved | 16 |
| Catalog source | `reports/xml_recovery/xml_starred_hash_truth.txt` |
| Manifest | `reports/xml_recovery/materialized_ooxml_manifest.json` |
| Manifest sha256 | 6e74a501762c3368a6b3fd421c59d13e0c5da26b5b3e56b8729e0bf29163daf7 |
| Manifest xml_parts count | 195 |
| Unmatched starred keys | 0 |
| Script requires exactly | 16 folders (hard assertion in loadSelectedXmlTruth) |

## Resolution path

Script resolves each folder via `resolveSelectedDocumentPath(folder)`:
1. Primary: `reports/xml_recovery/materialized_ooxml/<folder>/word/document.xml`
2. Legacy fallback: `src/data-layer/ingestion-buffer/gdrive_ooxml_raw/<folder>/word/document.xml`

All 16 folders resolve via the primary path (materialized_ooxml).

## Selected 16 folders

- 0002_r_chapter_1_-_stardust_to_stardust_...
- 0003_g_chapter_2-_living_sacrifice_...
- 0004_g_chapter_3-_lift_up_...
- 0005_final_chapter_5_-_the_snare_...
- 0006_final_chapter_6-_beelzebub_beelzebub_...
- 0007_chapter_8_final_...
- 0008_d_chapter_7_-_the_pit_...
- 0009_final_chapter_9_the_ascent_...
- 0010_final_chapter_4_-_pilgrimage_...
- 0012_notes_p_chapter_1_-_stardust_to_stardust_...
- 0013_prompt_guide_e_chapter_10_forsaken_...
- 0035_chapter1_q_final_...
- 0036_chapter_10.5_...
- 0040_chapter_2nd_to_last_...
- 0052_the_weight_of_the_sky_the_fall_into_megiddo_...
- 0057_wos_ch7_the_pit_...

Explicitly excluded (accidental broad match):
- 0016_10.0_master_system_for_chapter_revision_...

## run_hash semantics (from code, not guesswork)

`run_hash` is computed at line ~6106 of `scripts/semantic/xml-selected-meaning-span-rehash.mjs`:

```js
const runHash = sha256Text(canonicalJson({
  semantic_run_id: semanticRun.id,
  prompt_version: PROMPT_VERSION,
  provider: PROVIDER,
  model: PROVIDER_MODEL,
  selected_truth_sha256: selected.sha256,
  narrative_context_sha256: NARRATIVE_CONTEXT_SHA256,
  xml_manifest_sha256: XML_MANIFEST_SHA256,
  scene_window_packet_size: BATCH_SIZE,
  ai_task_order: TASK_ORDER,
}));
```

Conclusion: `run_hash` is a **provenance/config identity hash** — it identifies
the run's source corpus, prompt version, provider, model, and config inputs.
It is NOT a digest of semantic output rows. Each run with the same config
and same selected truth produces the same `run_hash`.
