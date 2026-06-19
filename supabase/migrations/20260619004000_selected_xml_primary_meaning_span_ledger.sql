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
