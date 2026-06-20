CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS render_paragraphs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  semantic_run_id UUID REFERENCES semantic_runs(id) ON DELETE SET NULL,
  source_doc_folder TEXT NOT NULL,
  source_document_xml_sha256 TEXT NOT NULL,
  render_para_key TEXT NOT NULL UNIQUE,
  render_index INT NOT NULL,
  text TEXT NOT NULL,
  text_sha256 TEXT NOT NULL,
  start_char INT,
  end_char INT,
  source_xml_paragraph_indexes JSONB NOT NULL DEFAULT '[]'::jsonb,
  boundary_method TEXT NOT NULL DEFAULT 'xml_plus_novel_grammar_v4',
  boundary_confidence NUMERIC DEFAULT 0,
  boundary_reason TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS semantic_meaning_spans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  semantic_run_id UUID REFERENCES semantic_runs(id) ON DELETE CASCADE,
  span_key TEXT NOT NULL UNIQUE,
  span_type TEXT NOT NULL DEFAULT 'meaning_span',
  claim_family TEXT NOT NULL DEFAULT 'interpretation',
  label TEXT,
  subject_name TEXT,
  evidence_text TEXT,
  evidence_sha256 TEXT,
  source_span JSONB NOT NULL DEFAULT '{}'::jsonb,
  interpretation TEXT,
  confidence NUMERIC DEFAULT 0,
  prompt_sha256 TEXT,
  model_output_sha256 TEXT,
  semantic_hash TEXT NOT NULL UNIQUE,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS semantic_meaning_span_edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  semantic_run_id UUID REFERENCES semantic_runs(id) ON DELETE CASCADE,
  edge_key TEXT NOT NULL UNIQUE,
  edge_type TEXT NOT NULL,
  from_span_key TEXT,
  to_span_key TEXT,
  relation_type TEXT,
  evidence_text TEXT,
  evidence_sha256 TEXT,
  interpretation TEXT,
  confidence NUMERIC DEFAULT 0,
  prompt_sha256 TEXT,
  model_output_sha256 TEXT,
  semantic_hash TEXT NOT NULL UNIQUE,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS semantic_archetype_anchors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  anchor_key TEXT NOT NULL UNIQUE,
  canonical_label TEXT NOT NULL UNIQUE,
  ontology_family TEXT NOT NULL DEFAULT 'jungian',
  ontology_version TEXT NOT NULL DEFAULT 'jungian_closed_v1',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS semantic_biblical_anchors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  semantic_run_id UUID REFERENCES semantic_runs(id) ON DELETE SET NULL,
  anchor_key TEXT NOT NULL UNIQUE,
  biblical_anchor_label TEXT NOT NULL,
  book TEXT NOT NULL,
  chapter INT NOT NULL,
  verse_start INT NOT NULL,
  verse_end INT,
  motif_family TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT semantic_biblical_anchors_verse_order CHECK (verse_end IS NULL OR verse_end >= verse_start)
);

CREATE TABLE IF NOT EXISTS semantic_crosslinks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  semantic_run_id UUID REFERENCES semantic_runs(id) ON DELETE CASCADE,
  crosslink_key TEXT NOT NULL UNIQUE,
  scene_window_id TEXT NOT NULL,
  source_doc_id TEXT NOT NULL,
  relation_family TEXT NOT NULL,
  relation_type TEXT NOT NULL,
  left_family TEXT NOT NULL,
  left_span_key TEXT REFERENCES semantic_meaning_spans(span_key) ON DELETE CASCADE,
  left_anchor_key TEXT,
  right_family TEXT NOT NULL,
  right_span_key TEXT REFERENCES semantic_meaning_spans(span_key) ON DELETE CASCADE,
  right_anchor_key TEXT,
  evidence_text TEXT,
  evidence_sha256 TEXT,
  source_span JSONB NOT NULL DEFAULT '{}'::jsonb,
  rationale TEXT,
  confidence NUMERIC DEFAULT 0,
  prompt_sha256 TEXT,
  model_output_sha256 TEXT,
  semantic_hash TEXT NOT NULL UNIQUE,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS semantic_run_artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  semantic_run_id UUID REFERENCES semantic_runs(id) ON DELETE CASCADE,
  artifact_key TEXT NOT NULL UNIQUE,
  artifact_type TEXT NOT NULL,
  artifact_path TEXT NOT NULL,
  artifact_sha256 TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE paragraphs
  ADD COLUMN IF NOT EXISTS render_para_key TEXT,
  ADD COLUMN IF NOT EXISTS render_segmentation_sha256 TEXT,
  ADD COLUMN IF NOT EXISTS render_boundary_method TEXT,
  ADD COLUMN IF NOT EXISTS render_boundary_confidence NUMERIC,
  ADD COLUMN IF NOT EXISTS render_source_span JSONB NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE archetype_observations
  ADD COLUMN IF NOT EXISTS meaning_span_id UUID REFERENCES semantic_meaning_spans(id) ON DELETE SET NULL;

ALTER TABLE archetype_movements
  ADD COLUMN IF NOT EXISTS meaning_span_id UUID REFERENCES semantic_meaning_spans(id) ON DELETE SET NULL;

ALTER TABLE biblical_references
  ADD COLUMN IF NOT EXISTS meaning_span_id UUID REFERENCES semantic_meaning_spans(id) ON DELETE SET NULL;

ALTER TABLE dualism_relation_evidence
  ADD COLUMN IF NOT EXISTS meaning_span_id UUID REFERENCES semantic_meaning_spans(id) ON DELETE SET NULL;

ALTER TABLE hyperlinks
  ADD COLUMN IF NOT EXISTS meaning_span_id UUID REFERENCES semantic_meaning_spans(id) ON DELETE SET NULL;

INSERT INTO semantic_archetype_anchors (anchor_key, canonical_label, ontology_family, ontology_version, metadata, active)
VALUES
  ('jungian_self', 'Self', 'jungian', 'jungian_closed_v1', '{}'::jsonb, TRUE),
  ('jungian_ego', 'Ego', 'jungian', 'jungian_closed_v1', '{}'::jsonb, TRUE),
  ('jungian_shadow', 'Shadow', 'jungian', 'jungian_closed_v1', '{}'::jsonb, TRUE),
  ('jungian_persona', 'Persona', 'jungian', 'jungian_closed_v1', '{}'::jsonb, TRUE),
  ('jungian_anima', 'Anima', 'jungian', 'jungian_closed_v1', '{}'::jsonb, TRUE),
  ('jungian_animus', 'Animus', 'jungian', 'jungian_closed_v1', '{}'::jsonb, TRUE),
  ('jungian_great_mother', 'Great Mother', 'jungian', 'jungian_closed_v1', '{}'::jsonb, TRUE),
  ('jungian_wise_guide', 'Wise Guide', 'jungian', 'jungian_closed_v1', '{}'::jsonb, TRUE),
  ('jungian_trickster', 'Trickster', 'jungian', 'jungian_closed_v1', '{}'::jsonb, TRUE),
  ('jungian_child', 'Child', 'jungian', 'jungian_closed_v1', '{}'::jsonb, TRUE),
  ('jungian_hero', 'Hero', 'jungian', 'jungian_closed_v1', '{}'::jsonb, TRUE),
  ('jungian_orphanexile', 'OrphanExile', 'jungian', 'jungian_closed_v1', '{}'::jsonb, TRUE)
ON CONFLICT (anchor_key) DO UPDATE
SET canonical_label = EXCLUDED.canonical_label,
    ontology_family = EXCLUDED.ontology_family,
    ontology_version = EXCLUDED.ontology_version,
    active = TRUE;

CREATE INDEX IF NOT EXISTS idx_render_paragraphs_run ON render_paragraphs(semantic_run_id);
CREATE INDEX IF NOT EXISTS idx_render_paragraphs_key ON render_paragraphs(render_para_key);
CREATE INDEX IF NOT EXISTS idx_render_paragraphs_folder_index ON render_paragraphs(source_doc_folder, render_index);
CREATE INDEX IF NOT EXISTS idx_meaning_spans_run ON semantic_meaning_spans(semantic_run_id);
CREATE INDEX IF NOT EXISTS idx_meaning_spans_hash ON semantic_meaning_spans(semantic_hash);
CREATE INDEX IF NOT EXISTS idx_meaning_spans_family ON semantic_meaning_spans(claim_family);
CREATE INDEX IF NOT EXISTS idx_meaning_spans_active ON semantic_meaning_spans(active);
CREATE INDEX IF NOT EXISTS idx_meaning_span_edges_run ON semantic_meaning_span_edges(semantic_run_id);
CREATE INDEX IF NOT EXISTS idx_meaning_span_edges_hash ON semantic_meaning_span_edges(semantic_hash);
CREATE INDEX IF NOT EXISTS idx_meaning_span_edges_type ON semantic_meaning_span_edges(edge_type);
CREATE INDEX IF NOT EXISTS idx_semantic_archetype_anchors_label ON semantic_archetype_anchors(canonical_label);
CREATE INDEX IF NOT EXISTS idx_semantic_biblical_anchors_run ON semantic_biblical_anchors(semantic_run_id);
CREATE INDEX IF NOT EXISTS idx_semantic_biblical_anchors_book_verse ON semantic_biblical_anchors(book, chapter, verse_start, COALESCE(verse_end, verse_start));
CREATE INDEX IF NOT EXISTS idx_semantic_biblical_anchors_motif ON semantic_biblical_anchors(motif_family);
CREATE INDEX IF NOT EXISTS idx_semantic_crosslinks_run ON semantic_crosslinks(semantic_run_id);
CREATE INDEX IF NOT EXISTS idx_semantic_crosslinks_scene ON semantic_crosslinks(scene_window_id);
CREATE INDEX IF NOT EXISTS idx_semantic_crosslinks_left ON semantic_crosslinks(left_span_key);
CREATE INDEX IF NOT EXISTS idx_semantic_crosslinks_right ON semantic_crosslinks(right_span_key);
CREATE INDEX IF NOT EXISTS idx_semantic_crosslinks_type ON semantic_crosslinks(relation_type);
CREATE INDEX IF NOT EXISTS idx_semantic_crosslinks_hash ON semantic_crosslinks(semantic_hash);
CREATE INDEX IF NOT EXISTS idx_semantic_run_artifacts_run ON semantic_run_artifacts(semantic_run_id);
CREATE INDEX IF NOT EXISTS idx_semantic_run_artifacts_type ON semantic_run_artifacts(artifact_type);
