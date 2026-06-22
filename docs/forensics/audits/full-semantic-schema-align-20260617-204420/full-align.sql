-- Full semantic rehash schema alignment.
-- Idempotent: only adds missing writer-facing columns and normalizes defaults.

alter table if exists public.hyperlinks
  add column if not exists paragraph_id uuid,
  add column if not exists semantic_run_id uuid,
  add column if not exists theme_node_a text,
  add column if not exists theme_node_b text,
  add column if not exists connection_type text,
  add column if not exists chapter_reference text,
  add column if not exists strength numeric,
  add column if not exists source_table text,
  add column if not exists source_id text,
  add column if not exists edge_type text,
  add column if not exists confidence numeric,
  add column if not exists semantic_hash text,
  add column if not exists active boolean,
  add column if not exists metadata jsonb;

alter table if exists public.dualism_relations
  add column if not exists paragraph_id uuid,
  add column if not exists semantic_run_id uuid,
  add column if not exists node_a text,
  add column if not exists node_b text,
  add column if not exists theme_node_a text,
  add column if not exists theme_node_b text,
  add column if not exists relation_type text,
  add column if not exists axis text,
  add column if not exists polarity text,
  add column if not exists evidence text,
  add column if not exists analysis text,
  add column if not exists confidence numeric,
  add column if not exists semantic_hash text,
  add column if not exists active boolean,
  add column if not exists metadata jsonb;

alter table if exists public.dualism_relation_evidence
  add column if not exists paragraph_id uuid,
  add column if not exists semantic_run_id uuid,
  add column if not exists dualism_relation_id uuid,
  add column if not exists relation_id uuid,
  add column if not exists evidence_text text,
  add column if not exists evidence text,
  add column if not exists quote text,
  add column if not exists chapter_reference text,
  add column if not exists confidence numeric,
  add column if not exists semantic_hash text,
  add column if not exists active boolean,
  add column if not exists metadata jsonb;

alter table if exists public.archetype_observations
  add column if not exists paragraph_id uuid,
  add column if not exists semantic_run_id uuid,
  add column if not exists archetype text,
  add column if not exists character_name text,
  add column if not exists character text,
  add column if not exists phase text,
  add column if not exists evidence_text text,
  add column if not exists evidence text,
  add column if not exists analysis text,
  add column if not exists interpretation text,
  add column if not exists confidence numeric,
  add column if not exists semantic_hash text,
  add column if not exists active boolean,
  add column if not exists metadata jsonb;

alter table if exists public.archetype_movements
  add column if not exists paragraph_id uuid,
  add column if not exists semantic_run_id uuid,
  add column if not exists archetype_observation_id uuid,
  add column if not exists character_name text,
  add column if not exists character text,
  add column if not exists archetype text,
  add column if not exists from_phase text,
  add column if not exists to_phase text,
  add column if not exists movement_type text,
  add column if not exists evidence_text text,
  add column if not exists evidence text,
  add column if not exists analysis text,
  add column if not exists confidence numeric,
  add column if not exists semantic_hash text,
  add column if not exists active boolean,
  add column if not exists metadata jsonb;

alter table if exists public.biblical_references
  add column if not exists paragraph_id uuid,
  add column if not exists semantic_run_id uuid,
  add column if not exists reference text,
  add column if not exists book text,
  add column if not exists chapter text,
  add column if not exists verse text,
  add column if not exists motif text,
  add column if not exists allusion_type text,
  add column if not exists evidence_text text,
  add column if not exists evidence text,
  add column if not exists analysis text,
  add column if not exists confidence numeric,
  add column if not exists semantic_hash text,
  add column if not exists active boolean,
  add column if not exists metadata jsonb;

update public.hyperlinks set active = true where active is null;
update public.dualism_relations set active = true where active is null;
update public.dualism_relation_evidence set active = true where active is null;
update public.archetype_observations set active = true where active is null;
update public.archetype_movements set active = true where active is null;
update public.biblical_references set active = true where active is null;

update public.hyperlinks set metadata = '{}'::jsonb where metadata is null;
update public.dualism_relations set metadata = '{}'::jsonb where metadata is null;
update public.dualism_relation_evidence set metadata = '{}'::jsonb where metadata is null;
update public.archetype_observations set metadata = '{}'::jsonb where metadata is null;
update public.archetype_movements set metadata = '{}'::jsonb where metadata is null;
update public.biblical_references set metadata = '{}'::jsonb where metadata is null;

alter table if exists public.hyperlinks alter column active set default true;
alter table if exists public.dualism_relations alter column active set default true;
alter table if exists public.dualism_relation_evidence alter column active set default true;
alter table if exists public.archetype_observations alter column active set default true;
alter table if exists public.archetype_movements alter column active set default true;
alter table if exists public.biblical_references alter column active set default true;

alter table if exists public.hyperlinks alter column metadata set default '{}'::jsonb;
alter table if exists public.dualism_relations alter column metadata set default '{}'::jsonb;
alter table if exists public.dualism_relation_evidence alter column metadata set default '{}'::jsonb;
alter table if exists public.archetype_observations alter column metadata set default '{}'::jsonb;
alter table if exists public.archetype_movements alter column metadata set default '{}'::jsonb;
alter table if exists public.biblical_references alter column metadata set default '{}'::jsonb;
