# XML-grounded Vertex semantic rehash target

Do not wipe Supabase.

Keep:
- chapters
- paragraphs
- XML/OOXML archive
- context pack
- public chapter txt
- existing forensic audits

Add/repair:
- source_documents
- source_document_parts
- source_document_revisions
- semantic_runs
- semantic_batches
- dualism_relations
- dualism_relation_evidence
- archetype_observations
- archetype_movements
- expanded biblical_references fields
- hyperlinks as derived graph edges

Provider:
- Vertex/Gemini

Deploy rail:
- GitHub Actions, because Supabase CLI is unavailable in Termux.

Semantic source:
- narrative_context_pack_v1.txt
- materialized_ooxml_manifest.json
- gdrive_ooxml_raw/**
- public/data/chapters/*.txt
- live Supabase paragraphs

Reset policy:
- do not truncate source tables
- only supersede old derived semantic output by semantic_run_id
- old semantic rows may be marked inactive/stale after backup
