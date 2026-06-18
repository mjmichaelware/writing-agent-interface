-- XML-grounded semantic rehash schema.
-- Non-destructive: keeps chapters, paragraphs, XML/source archives, and existing rows.
-- Adds source-truth tables and run-ledger tables so old derived semantics can be superseded by semantic_run_id.

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS source_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_kind TEXT NOT NULL DEFAULT 'unknown',
  source_path TEXT NOT NULL,
  source_sha256 TEXT NOT NULL,
  title TEXT,
  byte_count BIGINT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (source_sha256)
);

CREATE TABLE IF NOT EXISTS source_document_parts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_document_id UUID REFERENCES source_documents(id) ON DELETE CASCADE,
  part_path TEXT NOT NULL,
  part_sha256 TEXT NOT NULL,
  byte_count BIGINT,
  text_excerpt TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (source_document_id, part_path, part_sha256)
);

CREATE TABLE IF NOT EXISTS source_document_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_document_id UUID REFERENCES source_documents(id) ON DELETE CASCADE,
  revision_label TEXT,
  revision_sha256 TEXT,
  revision_path TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS semantic_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status TEXT NOT NULL DEFAULT 'queued',
  provider TEXT NOT NULL DEFAULT 'vertex',
  model TEXT,
  prompt_version TEXT NOT NULL,
  narrative_context_sha256 TEXT NOT NULL,
  xml_manifest_sha256 TEXT,
  xml_manifest_count INT,
  source_summary JSONB NOT NULL DEFAULT '{}'::jsonb,
  reset_policy TEXT NOT NULL DEFAULT 'supersede_by_semantic_run_id',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  error TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS semantic_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  semantic_run_id UUID REFERENCES semantic_runs(id) ON DELETE CASCADE,
  batch_index INT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued',
  chapter_number INT,
  paragraph_ids UUID[] DEFAULT ARRAY[]::UUID[],
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  result_summary JSONB NOT NULL DEFAULT '{}'::jsonb,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (semantic_run_id, batch_index)
);

ALTER TABLE paragraphs
  ADD COLUMN IF NOT EXISTS content_sha256 TEXT,
  ADD COLUMN IF NOT EXISTS source_document_part_id UUID REFERENCES source_document_parts(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS active_semantic_run_id UUID REFERENCES semantic_runs(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS archetype_observations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paragraph_id UUID REFERENCES paragraphs(id) ON DELETE CASCADE,
  semantic_run_id UUID REFERENCES semantic_runs(id) ON DELETE CASCADE,
  archetype TEXT NOT NULL,
  subject_name TEXT,
  movement_stage TEXT,
  evidence_text TEXT,
  interpretation TEXT,
  confidence NUMERIC DEFAULT 0,
  semantic_hash TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS archetype_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  semantic_run_id UUID REFERENCES semantic_runs(id) ON DELETE CASCADE,
  subject_name TEXT NOT NULL,
  arc_label TEXT,
  from_state TEXT,
  to_state TEXT,
  start_paragraph_id UUID REFERENCES paragraphs(id) ON DELETE SET NULL,
  end_paragraph_id UUID REFERENCES paragraphs(id) ON DELETE SET NULL,
  evidence_summary TEXT,
  interpretation TEXT,
  confidence NUMERIC DEFAULT 0,
  semantic_hash TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dualism_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  semantic_run_id UUID REFERENCES semantic_runs(id) ON DELETE CASCADE,
  relation_type TEXT NOT NULL,
  shared_substrate TEXT,
  pole_a JSONB NOT NULL DEFAULT '{}'::jsonb,
  pole_b JSONB NOT NULL DEFAULT '{}'::jsonb,
  interpretation TEXT,
  confidence NUMERIC DEFAULT 0,
  semantic_relation_sha256 TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (semantic_relation_sha256)
);

CREATE TABLE IF NOT EXISTS dualism_relation_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dualism_relation_id UUID REFERENCES dualism_relations(id) ON DELETE CASCADE,
  paragraph_id UUID REFERENCES paragraphs(id) ON DELETE SET NULL,
  evidence_role TEXT,
  evidence_text TEXT,
  source_span JSONB NOT NULL DEFAULT '{}'::jsonb,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE biblical_references
  ADD COLUMN IF NOT EXISTS semantic_run_id UUID REFERENCES semantic_runs(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS allusion_type TEXT,
  ADD COLUMN IF NOT EXISTS evidence_text TEXT,
  ADD COLUMN IF NOT EXISTS interpretation TEXT,
  ADD COLUMN IF NOT EXISTS confidence NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS source_label TEXT,
  ADD COLUMN IF NOT EXISTS source_span JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS semantic_hash TEXT,
  ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}'::jsonb;

CREATE TABLE IF NOT EXISTS hyperlinks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paragraph_id UUID REFERENCES paragraphs(id) ON DELETE CASCADE,
  theme_node_a TEXT,
  theme_node_b TEXT,
  connection_type TEXT,
  chapter_reference TEXT,
  strength NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE hyperlinks
  ADD COLUMN IF NOT EXISTS semantic_run_id UUID REFERENCES semantic_runs(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS source_table TEXT,
  ADD COLUMN IF NOT EXISTS source_id UUID,
  ADD COLUMN IF NOT EXISTS edge_type TEXT,
  ADD COLUMN IF NOT EXISTS confidence NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS semantic_hash TEXT,
  ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_source_documents_sha ON source_documents(source_sha256);
CREATE INDEX IF NOT EXISTS idx_source_document_parts_sha ON source_document_parts(part_sha256);
CREATE INDEX IF NOT EXISTS idx_semantic_runs_context ON semantic_runs(narrative_context_sha256);
CREATE INDEX IF NOT EXISTS idx_semantic_batches_run_status ON semantic_batches(semantic_run_id, status);
CREATE INDEX IF NOT EXISTS idx_paragraphs_content_sha ON paragraphs(content_sha256);
CREATE INDEX IF NOT EXISTS idx_paragraphs_active_semantic_run ON paragraphs(active_semantic_run_id);
CREATE INDEX IF NOT EXISTS idx_archetype_observations_paragraph ON archetype_observations(paragraph_id);
CREATE INDEX IF NOT EXISTS idx_archetype_observations_run ON archetype_observations(semantic_run_id);
CREATE INDEX IF NOT EXISTS idx_archetype_movements_run ON archetype_movements(semantic_run_id);
CREATE INDEX IF NOT EXISTS idx_dualism_relations_run ON dualism_relations(semantic_run_id);
CREATE INDEX IF NOT EXISTS idx_dualism_relations_hash ON dualism_relations(semantic_relation_sha256);
CREATE INDEX IF NOT EXISTS idx_dualism_evidence_relation ON dualism_relation_evidence(dualism_relation_id);
CREATE INDEX IF NOT EXISTS idx_biblical_references_run ON biblical_references(semantic_run_id);
CREATE INDEX IF NOT EXISTS idx_biblical_references_active ON biblical_references(active);
CREATE INDEX IF NOT EXISTS idx_hyperlinks_run ON hyperlinks(semantic_run_id);
CREATE INDEX IF NOT EXISTS idx_hyperlinks_active ON hyperlinks(active);

ALTER TABLE source_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE source_document_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE source_document_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE semantic_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE semantic_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE archetype_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE archetype_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE dualism_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE dualism_relation_evidence ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read-only archetype observations') THEN
    CREATE POLICY "Allow public read-only archetype observations" ON archetype_observations FOR SELECT USING (active = true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read-only archetype movements') THEN
    CREATE POLICY "Allow public read-only archetype movements" ON archetype_movements FOR SELECT USING (active = true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read-only dualism relations') THEN
    CREATE POLICY "Allow public read-only dualism relations" ON dualism_relations FOR SELECT USING (active = true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read-only dualism evidence') THEN
    CREATE POLICY "Allow public read-only dualism evidence" ON dualism_relation_evidence FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow service role source documents') THEN
    CREATE POLICY "Allow service role source documents" ON source_documents FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow service role source document parts') THEN
    CREATE POLICY "Allow service role source document parts" ON source_document_parts FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow service role source document revisions') THEN
    CREATE POLICY "Allow service role source document revisions" ON source_document_revisions FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow service role semantic runs') THEN
    CREATE POLICY "Allow service role semantic runs" ON semantic_runs FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow service role semantic batches') THEN
    CREATE POLICY "Allow service role semantic batches" ON semantic_batches FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
  END IF;
END $$;


-- Ensure Vertex semantic archetype observations default to active rows.
alter table if exists public.archetype_observations
  alter column active set default true;

alter table if exists public.hyperlinks add column if not exists connection_type text;
alter table if exists public.hyperlinks add column if not exists chapter_reference text;
alter table if exists public.hyperlinks add column if not exists strength numeric;
alter table if exists public.hyperlinks alter column active set default true;
alter table if exists public.hyperlinks alter column metadata set default '{}'::jsonb;
alter table if exists public.dualism_relations add column if not exists paragraph_id uuid;
alter table if exists public.dualism_relations add column if not exists node_a text;
alter table if exists public.dualism_relations add column if not exists node_b text;
alter table if exists public.dualism_relations add column if not exists theme_node_a text;
alter table if exists public.dualism_relations add column if not exists theme_node_b text;
alter table if exists public.dualism_relations add column if not exists axis text;
alter table if exists public.dualism_relations add column if not exists polarity text;
alter table if exists public.dualism_relations add column if not exists evidence text;
alter table if exists public.dualism_relations add column if not exists analysis text;
alter table if exists public.dualism_relations add column if not exists semantic_hash text;
alter table if exists public.dualism_relations alter column active set default true;
alter table if exists public.dualism_relations alter column metadata set default '{}'::jsonb;
alter table if exists public.dualism_relation_evidence add column if not exists semantic_run_id uuid;
alter table if exists public.dualism_relation_evidence add column if not exists relation_id uuid;
alter table if exists public.dualism_relation_evidence add column if not exists evidence text;
alter table if exists public.dualism_relation_evidence add column if not exists quote text;
alter table if exists public.dualism_relation_evidence add column if not exists chapter_reference text;
alter table if exists public.dualism_relation_evidence add column if not exists confidence numeric default 0;
alter table if exists public.dualism_relation_evidence add column if not exists semantic_hash text;
alter table if exists public.dualism_relation_evidence add column if not exists active boolean default true;
alter table if exists public.dualism_relation_evidence alter column metadata set default '{}'::jsonb;
alter table if exists public.archetype_observations add column if not exists character_name text;
alter table if exists public.archetype_observations add column if not exists character text;
alter table if exists public.archetype_observations add column if not exists phase text;
alter table if exists public.archetype_observations add column if not exists evidence text;
alter table if exists public.archetype_observations add column if not exists analysis text;
alter table if exists public.archetype_observations alter column active set default true;
alter table if exists public.archetype_observations alter column metadata set default '{}'::jsonb;
alter table if exists public.archetype_movements add column if not exists paragraph_id uuid;
alter table if exists public.archetype_movements add column if not exists archetype_observation_id uuid;
alter table if exists public.archetype_movements add column if not exists character_name text;
alter table if exists public.archetype_movements add column if not exists character text;
alter table if exists public.archetype_movements add column if not exists archetype text;
alter table if exists public.archetype_movements add column if not exists from_phase text;
alter table if exists public.archetype_movements add column if not exists to_phase text;
alter table if exists public.archetype_movements add column if not exists movement_type text;
alter table if exists public.archetype_movements add column if not exists evidence_text text;
alter table if exists public.archetype_movements add column if not exists evidence text;
alter table if exists public.archetype_movements add column if not exists analysis text;
alter table if exists public.archetype_movements alter column active set default true;
alter table if exists public.archetype_movements alter column metadata set default '{}'::jsonb;
alter table if exists public.biblical_references add column if not exists reference text;
alter table if exists public.biblical_references add column if not exists motif text;
alter table if exists public.biblical_references add column if not exists evidence text;
alter table if exists public.biblical_references add column if not exists analysis text;
alter table if exists public.biblical_references alter column active set default true;
alter table if exists public.biblical_references alter column metadata set default '{}'::jsonb;
