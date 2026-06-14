-- NOS / The Weight of the Sky — Supabase ingestion + archive provenance schema
-- Purpose:
-- 1. Preserve all local source/import identities.
-- 2. Deduplicate byte payloads by SHA-256 without collapsing provenance.
-- 3. Track Drive/XML/revision lineage.
-- 4. Prepare paragraph, token, semantic, biblical, archetypal, dualism, typography, visual, and reader/private search tables.
-- 5. Support NOS runtime reconstruction: source bytes -> XML -> paragraph -> tokens -> semantic weights -> typography vectors -> graph/search/runtime.

create extension if not exists pgcrypto;
create extension if not exists vector;

create schema if not exists nos;

do $$ begin
  create type nos.source_visibility as enum ('reader_public', 'private_internal', 'cloak_protocol', 'forensic_only');
exception when duplicate_object then null; end $$;

do $$ begin
  create type nos.local_import_status as enum ('matched', 'unmatched', 'quarantined');
exception when duplicate_object then null; end $$;

do $$ begin
  create type nos.artifact_kind as enum (
    'local_source_text',
    'import_manifest_json',
    'pairing_manifest_json',
    'drive_metadata_json',
    'docs_api_json',
    'comments_json',
    'current_docx',
    'current_ooxml_document_xml',
    'revision_metadata_json',
    'revision_docx',
    'revision_ooxml_document_xml',
    'revision_export_response_json',
    'summary_tsv',
    'totals_json',
    'audit_json',
    'other'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type nos.xml_payload_kind as enum ('current', 'revision');
exception when duplicate_object then null; end $$;

do $$ begin
  create type nos.semantic_scope as enum ('document', 'chapter', 'paragraph', 'token', 'typography', 'visual', 'graph');
exception when duplicate_object then null; end $$;

create table if not exists nos.archive_batches (
  id uuid primary key default gen_random_uuid(),
  batch_key text not null unique,
  archive_root text not null,
  source_system text not null default 'drive_temporal_xml_reextract',
  local_targets_seen integer,
  matched_imports integer,
  unmatched_imports integer,
  extraction_units integer,
  current_xml_count integer,
  revision_xml_count integer,
  totals jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists nos.content_blobs (
  id uuid primary key default gen_random_uuid(),
  sha256 text not null unique check (sha256 ~ '^[0-9a-f]{64}$'),
  byte_size bigint not null check (byte_size >= 0),
  line_count bigint,
  media_type text,
  content_role text,
  first_seen_batch_id uuid references nos.archive_batches(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists nos.source_artifacts (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references nos.archive_batches(id) on delete cascade,
  blob_id uuid not null references nos.content_blobs(id) on delete restrict,
  artifact_kind nos.artifact_kind not null default 'other',
  visibility nos.source_visibility not null default 'private_internal',
  rel_path text not null,
  abs_hint text,
  byte_size bigint not null,
  sha256 text not null check (sha256 ~ '^[0-9a-f]{64}$'),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (batch_id, rel_path)
);

create table if not exists nos.local_imports (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references nos.archive_batches(id) on delete cascade,
  target_index integer not null,
  status nos.local_import_status not null,
  local_basename text not null,
  local_path text,
  local_artifact_id uuid references nos.source_artifacts(id) on delete set null,
  import_manifest_artifact_id uuid references nos.source_artifacts(id) on delete set null,
  best_match_score numeric,
  drive_file_id text,
  drive_name text,
  import_manifest jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (batch_id, target_index)
);

create table if not exists nos.drive_sources (
  id uuid primary key default gen_random_uuid(),
  drive_file_id text not null unique,
  drive_name text,
  mime_type text,
  web_view_link text,
  created_time timestamptz,
  modified_time timestamptz,
  owners jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists nos.extraction_units (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references nos.archive_batches(id) on delete cascade,
  local_import_id uuid not null references nos.local_imports(id) on delete cascade,
  drive_source_id uuid references nos.drive_sources(id) on delete set null,
  target_index integer not null,
  unit_rel_path text not null,
  pairing_manifest_artifact_id uuid references nos.source_artifacts(id) on delete set null,
  drive_metadata_artifact_id uuid references nos.source_artifacts(id) on delete set null,
  current_docx_artifact_id uuid references nos.source_artifacts(id) on delete set null,
  current_xml_artifact_id uuid references nos.source_artifacts(id) on delete set null,
  docs_api_artifact_id uuid references nos.source_artifacts(id) on delete set null,
  comments_artifact_id uuid references nos.source_artifacts(id) on delete set null,
  extraction_summary jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (batch_id, target_index),
  unique (batch_id, unit_rel_path)
);

create table if not exists nos.xml_payloads (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references nos.archive_batches(id) on delete cascade,
  extraction_unit_id uuid not null references nos.extraction_units(id) on delete cascade,
  artifact_id uuid not null references nos.source_artifacts(id) on delete restrict,
  blob_id uuid not null references nos.content_blobs(id) on delete restrict,
  payload_kind nos.xml_payload_kind not null,
  drive_revision_id text,
  sha256 text not null check (sha256 ~ '^[0-9a-f]{64}$'),
  byte_size bigint not null,
  xml_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (batch_id, artifact_id)
);

create table if not exists nos.revision_exports (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references nos.archive_batches(id) on delete cascade,
  extraction_unit_id uuid not null references nos.extraction_units(id) on delete cascade,
  drive_source_id uuid references nos.drive_sources(id) on delete set null,
  revision_id text not null,
  revision_metadata_artifact_id uuid references nos.source_artifacts(id) on delete set null,
  revision_docx_artifact_id uuid references nos.source_artifacts(id) on delete set null,
  revision_xml_payload_id uuid references nos.xml_payloads(id) on delete set null,
  export_response_artifact_id uuid references nos.source_artifacts(id) on delete set null,
  export_status text not null default 'unknown',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (extraction_unit_id, revision_id)
);

create table if not exists nos.works (
  id uuid primary key default gen_random_uuid(),
  work_key text not null unique,
  title text not null,
  author text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists nos.parts (
  id uuid primary key default gen_random_uuid(),
  work_id uuid not null references nos.works(id) on delete cascade,
  part_index integer not null,
  title text,
  metadata jsonb not null default '{}'::jsonb,
  unique (work_id, part_index)
);

create table if not exists nos.chapters (
  id uuid primary key default gen_random_uuid(),
  work_id uuid references nos.works(id) on delete cascade,
  part_id uuid references nos.parts(id) on delete set null,
  chapter_index integer,
  canonical_key text,
  title text,
  drive_source_id uuid references nos.drive_sources(id) on delete set null,
  extraction_unit_id uuid references nos.extraction_units(id) on delete set null,
  ema_metadata jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists nos.paragraphs (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid references nos.archive_batches(id) on delete cascade,
  xml_payload_id uuid references nos.xml_payloads(id) on delete cascade,
  extraction_unit_id uuid references nos.extraction_units(id) on delete cascade,
  chapter_id uuid references nos.chapters(id) on delete set null,
  paragraph_index integer not null,
  data_para integer,
  paragraph_hash text not null check (paragraph_hash ~ '^[0-9a-f]{64}$'),
  normalized_text_hash text not null check (normalized_text_hash ~ '^[0-9a-f]{64}$'),
  citation_hash text not null check (citation_hash ~ '^[0-9a-f]{64}$'),
  paragraph_text text not null,
  word_count integer not null default 0,
  char_count integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (xml_payload_id, paragraph_index)
);

create table if not exists nos.paragraph_versions (
  id uuid primary key default gen_random_uuid(),
  paragraph_id uuid not null references nos.paragraphs(id) on delete cascade,
  source_revision_id text,
  version_hash text not null check (version_hash ~ '^[0-9a-f]{64}$'),
  paragraph_text text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (paragraph_id, version_hash)
);

create table if not exists nos.tokens (
  id uuid primary key default gen_random_uuid(),
  paragraph_id uuid not null references nos.paragraphs(id) on delete cascade,
  token_index integer not null,
  token_text text not null,
  normalized_token text not null,
  token_hash text not null check (token_hash ~ '^[0-9a-f]{64}$'),
  char_start integer,
  char_end integer,
  metadata jsonb not null default '{}'::jsonb,
  unique (paragraph_id, token_index)
);

create table if not exists nos.embedding_models (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  model_name text not null,
  dimensions integer,
  metadata jsonb not null default '{}'::jsonb,
  unique (provider, model_name, dimensions)
);

create table if not exists nos.paragraph_embeddings (
  id uuid primary key default gen_random_uuid(),
  paragraph_id uuid not null references nos.paragraphs(id) on delete cascade,
  embedding_model_id uuid not null references nos.embedding_models(id) on delete restrict,
  input_hash text not null check (input_hash ~ '^[0-9a-f]{64}$'),
  embedding vector(1536),
  embedding_json jsonb,
  created_at timestamptz not null default now(),
  unique (paragraph_id, embedding_model_id, input_hash)
);

create table if not exists nos.semantic_analysis_runs (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid references nos.archive_batches(id) on delete cascade,
  scope nos.semantic_scope not null,
  provider text,
  model_name text,
  engine_version text,
  input_hash text not null check (input_hash ~ '^[0-9a-f]{64}$'),
  output_hash text check (output_hash ~ '^[0-9a-f]{64}$'),
  prompt_hash text check (prompt_hash ~ '^[0-9a-f]{64}$'),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists nos.paragraph_semantics (
  id uuid primary key default gen_random_uuid(),
  paragraph_id uuid not null references nos.paragraphs(id) on delete cascade,
  analysis_run_id uuid references nos.semantic_analysis_runs(id) on delete set null,
  semantic_output_hash text check (semantic_output_hash ~ '^[0-9a-f]{64}$'),
  archetypal_weights jsonb not null default '{}'::jsonb,
  dualism_map jsonb not null default '{}'::jsonb,
  biblical_reference_candidates jsonb not null default '[]'::jsonb,
  sacred_score numeric,
  descent_score numeric,
  ascent_score numeric,
  shadow_score numeric,
  persona_score numeric,
  anima_score numeric,
  self_score numeric,
  hero_score numeric,
  mass_score numeric,
  tension_score numeric,
  drift_score numeric,
  blur_score numeric,
  tone jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (paragraph_id, semantic_output_hash)
);

create table if not exists nos.biblical_books (
  id uuid primary key default gen_random_uuid(),
  canonical_order integer,
  osis_code text unique,
  name text not null,
  testament text,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists nos.biblical_passages (
  id uuid primary key default gen_random_uuid(),
  book_id uuid references nos.biblical_books(id) on delete cascade,
  chapter integer,
  verse_start integer,
  verse_end integer,
  reference_label text not null,
  passage_text text,
  translation text,
  metadata jsonb not null default '{}'::jsonb,
  unique (reference_label, translation)
);

create table if not exists nos.biblical_references (
  id uuid primary key default gen_random_uuid(),
  paragraph_id uuid references nos.paragraphs(id) on delete cascade,
  passage_id uuid references nos.biblical_passages(id) on delete set null,
  analysis_run_id uuid references nos.semantic_analysis_runs(id) on delete set null,
  detected_reference text not null,
  reference_type text,
  confidence numeric,
  evidence_text text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists nos.archetypes (
  id uuid primary key default gen_random_uuid(),
  archetype_key text not null unique,
  label text not null,
  tradition text,
  description text,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists nos.characters (
  id uuid primary key default gen_random_uuid(),
  character_key text not null unique,
  display_name text not null,
  aliases text[] not null default '{}',
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists nos.paragraph_archetype_links (
  id uuid primary key default gen_random_uuid(),
  paragraph_id uuid not null references nos.paragraphs(id) on delete cascade,
  archetype_id uuid not null references nos.archetypes(id) on delete cascade,
  character_id uuid references nos.characters(id) on delete set null,
  analysis_run_id uuid references nos.semantic_analysis_runs(id) on delete set null,
  weight numeric,
  evidence_text text,
  metadata jsonb not null default '{}'::jsonb,
  unique (paragraph_id, archetype_id, character_id)
);

create table if not exists nos.character_archetype_states (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references nos.characters(id) on delete cascade,
  chapter_id uuid references nos.chapters(id) on delete cascade,
  archetype_id uuid references nos.archetypes(id) on delete set null,
  state_label text,
  state_weight numeric,
  evidence jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists nos.dualism_pairs (
  id uuid primary key default gen_random_uuid(),
  pair_key text not null unique,
  pole_a text not null,
  pole_b text not null,
  label text,
  description text,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists nos.paragraph_dualism_links (
  id uuid primary key default gen_random_uuid(),
  paragraph_id uuid not null references nos.paragraphs(id) on delete cascade,
  dualism_pair_id uuid not null references nos.dualism_pairs(id) on delete cascade,
  analysis_run_id uuid references nos.semantic_analysis_runs(id) on delete set null,
  pole text,
  weight numeric,
  evidence_text text,
  metadata jsonb not null default '{}'::jsonb,
  unique (paragraph_id, dualism_pair_id, pole)
);

create table if not exists nos.structural_parallelisms (
  id uuid primary key default gen_random_uuid(),
  source_paragraph_id uuid references nos.paragraphs(id) on delete cascade,
  target_paragraph_id uuid references nos.paragraphs(id) on delete cascade,
  parallelism_type text,
  weight numeric,
  explanation text,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists nos.graph_nodes (
  id uuid primary key default gen_random_uuid(),
  node_key text not null unique,
  node_type text not null,
  label text not null,
  payload jsonb not null default '{}'::jsonb
);

create table if not exists nos.graph_edges (
  id uuid primary key default gen_random_uuid(),
  source_node_id uuid not null references nos.graph_nodes(id) on delete cascade,
  target_node_id uuid not null references nos.graph_nodes(id) on delete cascade,
  edge_type text not null,
  weight numeric,
  payload jsonb not null default '{}'::jsonb,
  unique (source_node_id, target_node_id, edge_type)
);

create table if not exists nos.typography_engines (
  id uuid primary key default gen_random_uuid(),
  engine_key text not null unique,
  version text not null,
  description text,
  config_hash text check (config_hash ~ '^[0-9a-f]{64}$'),
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists nos.render_profiles (
  id uuid primary key default gen_random_uuid(),
  profile_key text not null unique,
  engine_id uuid references nos.typography_engines(id) on delete set null,
  render_profile_hash text not null check (render_profile_hash ~ '^[0-9a-f]{64}$'),
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists nos.typography_inputs (
  id uuid primary key default gen_random_uuid(),
  paragraph_id uuid references nos.paragraphs(id) on delete cascade,
  token_id uuid references nos.tokens(id) on delete cascade,
  semantic_run_id uuid references nos.semantic_analysis_runs(id) on delete set null,
  input_hash text not null check (input_hash ~ '^[0-9a-f]{64}$'),
  input_payload jsonb not null default '{}'::jsonb,
  unique (paragraph_id, token_id, input_hash)
);

create table if not exists nos.paragraph_typography_vectors (
  id uuid primary key default gen_random_uuid(),
  paragraph_id uuid not null references nos.paragraphs(id) on delete cascade,
  render_profile_id uuid references nos.render_profiles(id) on delete set null,
  semantic_run_id uuid references nos.semantic_analysis_runs(id) on delete set null,
  typography_input_hash text check (typography_input_hash ~ '^[0-9a-f]{64}$'),
  typography_output_hash text check (typography_output_hash ~ '^[0-9a-f]{64}$'),
  arc_mass numeric,
  arc_tension numeric,
  arc_blur numeric,
  arc_drift numeric,
  tone jsonb not null default '{}'::jsonb,
  vector_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists nos.token_typography_vectors (
  id uuid primary key default gen_random_uuid(),
  token_id uuid not null references nos.tokens(id) on delete cascade,
  paragraph_typography_vector_id uuid references nos.paragraph_typography_vectors(id) on delete cascade,
  render_profile_id uuid references nos.render_profiles(id) on delete set null,
  typography_input_hash text check (typography_input_hash ~ '^[0-9a-f]{64}$'),
  typography_output_hash text check (typography_output_hash ~ '^[0-9a-f]{64}$'),
  arc_mass numeric,
  arc_tension numeric,
  arc_blur numeric,
  arc_drift numeric,
  font_weight numeric,
  color_tone jsonb not null default '{}'::jsonb,
  transform_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists nos.visual_assets (
  id uuid primary key default gen_random_uuid(),
  asset_key text not null unique,
  asset_hash text check (asset_hash ~ '^[0-9a-f]{64}$'),
  provider text,
  model_name text,
  prompt_hash text check (prompt_hash ~ '^[0-9a-f]{64}$'),
  rel_path text,
  media_type text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists nos.visual_asset_cache (
  id uuid primary key default gen_random_uuid(),
  cache_key_hash text not null unique check (cache_key_hash ~ '^[0-9a-f]{64}$'),
  paragraph_id uuid references nos.paragraphs(id) on delete cascade,
  visual_asset_id uuid references nos.visual_assets(id) on delete set null,
  cache_basis jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists nos.paragraph_visual_links (
  id uuid primary key default gen_random_uuid(),
  paragraph_id uuid not null references nos.paragraphs(id) on delete cascade,
  visual_asset_id uuid not null references nos.visual_assets(id) on delete cascade,
  cue_type text,
  weight numeric,
  metadata jsonb not null default '{}'::jsonb,
  unique (paragraph_id, visual_asset_id, cue_type)
);

create table if not exists nos.cinema_cues (
  id uuid primary key default gen_random_uuid(),
  paragraph_id uuid references nos.paragraphs(id) on delete cascade,
  chapter_id uuid references nos.chapters(id) on delete cascade,
  layer text not null default 'Layer2Cinema',
  cue_hash text check (cue_hash ~ '^[0-9a-f]{64}$'),
  cue_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists nos.reader_search_chunks (
  id uuid primary key default gen_random_uuid(),
  paragraph_id uuid references nos.paragraphs(id) on delete cascade,
  chunk_hash text not null check (chunk_hash ~ '^[0-9a-f]{64}$'),
  search_text text not null,
  visibility nos.source_visibility not null default 'reader_public',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists nos.private_search_chunks (
  id uuid primary key default gen_random_uuid(),
  source_artifact_id uuid references nos.source_artifacts(id) on delete cascade,
  chunk_hash text not null check (chunk_hash ~ '^[0-9a-f]{64}$'),
  search_text text not null,
  visibility nos.source_visibility not null default 'private_internal',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists nos.cloak_rules (
  id uuid primary key default gen_random_uuid(),
  rule_key text not null unique,
  visibility nos.source_visibility not null,
  path_glob text,
  table_name text,
  rule_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_nos_source_artifacts_batch on nos.source_artifacts(batch_id);
create index if not exists idx_nos_source_artifacts_sha on nos.source_artifacts(sha256);
create index if not exists idx_nos_local_imports_batch_status on nos.local_imports(batch_id, status);
create index if not exists idx_nos_extraction_units_batch on nos.extraction_units(batch_id);
create index if not exists idx_nos_xml_payloads_sha on nos.xml_payloads(sha256);
create index if not exists idx_nos_paragraphs_hash on nos.paragraphs(paragraph_hash);
create index if not exists idx_nos_paragraphs_xml_idx on nos.paragraphs(xml_payload_id, paragraph_index);
create index if not exists idx_nos_tokens_paragraph_idx on nos.tokens(paragraph_id, token_index);
create index if not exists idx_nos_semantics_para on nos.paragraph_semantics(paragraph_id);
create index if not exists idx_nos_biblical_para on nos.biblical_references(paragraph_id);
create index if not exists idx_nos_archetype_para on nos.paragraph_archetype_links(paragraph_id);
create index if not exists idx_nos_dualism_para on nos.paragraph_dualism_links(paragraph_id);
create index if not exists idx_nos_graph_edges_source on nos.graph_edges(source_node_id);
create index if not exists idx_nos_typography_para on nos.paragraph_typography_vectors(paragraph_id);
create index if not exists idx_nos_typography_token on nos.token_typography_vectors(token_id);
create index if not exists idx_nos_reader_search_visibility on nos.reader_search_chunks(visibility);
create index if not exists idx_nos_private_search_visibility on nos.private_search_chunks(visibility);

create index if not exists gin_nos_source_artifacts_metadata on nos.source_artifacts using gin(metadata);
create index if not exists gin_nos_paragraph_semantics_archetypes on nos.paragraph_semantics using gin(archetypal_weights);
create index if not exists gin_nos_paragraph_semantics_dualisms on nos.paragraph_semantics using gin(dualism_map);
create index if not exists gin_nos_typography_payload on nos.paragraph_typography_vectors using gin(vector_payload);

insert into nos.works (work_key, title, author)
values ('weight_of_the_sky', 'The Weight of the Sky', 'Michael Alonza P. Ware')
on conflict (work_key) do update set title = excluded.title, author = excluded.author;

insert into nos.typography_engines (engine_key, version, description, config)
values (
  'nos_semantic_kinetic_typography',
  'v0_schema_ready',
  'Semantic/NOS typography engine placeholder: paragraph and token vectors store arc_mass, arc_tension, arc_blur, arc_drift, tone, and transform payloads derived from narrative flow.',
  '{}'::jsonb
)
on conflict (engine_key) do update set version = excluded.version, description = excluded.description;

insert into nos.cloak_rules (rule_key, visibility, path_glob, table_name, rule_payload)
values
  ('reader_search_chapter_prose_only', 'reader_public', 'public/data/chapters/**', 'nos.reader_search_chunks', '{"rule":"reader search indexes chapter prose only"}'),
  ('internal_docs_private', 'private_internal', 'docs/**', 'nos.private_search_chunks', '{"rule":"docs and engineering context never enter reader search"}'),
  ('forensics_private', 'forensic_only', 'docs/forensics/**', 'nos.source_artifacts', '{"rule":"forensics preserved, not public reader search"}'),
  ('source_archive_private', 'private_internal', 'data/source_archive/**', 'nos.source_artifacts', '{"rule":"source archive provenance, not reader search"}')
on conflict (rule_key) do update
set visibility = excluded.visibility,
    path_glob = excluded.path_glob,
    table_name = excluded.table_name,
    rule_payload = excluded.rule_payload;
