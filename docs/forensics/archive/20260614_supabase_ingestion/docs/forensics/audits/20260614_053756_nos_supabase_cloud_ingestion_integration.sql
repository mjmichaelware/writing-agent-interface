-- NOS Supabase cloud ingestion integration:
-- Storage buckets, upload tracking, pgmq queues, cron hooks, realtime event tables,
-- and Edge Function support tables.

create extension if not exists pgcrypto;
create extension if not exists pgmq;
create extension if not exists pg_cron;
create extension if not exists pg_net;

create schema if not exists nos;

do $$ begin
  create type nos.cloud_upload_status as enum (
    'planned',
    'signed_url_created',
    'uploaded',
    'verified',
    'hash_mismatch',
    'failed'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type nos.ingest_job_status as enum (
    'queued',
    'running',
    'completed',
    'failed',
    'cancelled'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type nos.ingest_job_kind as enum (
    'verify_artifact_hash',
    'register_manifest_shard',
    'ingest_manifest_tsv',
    'parse_xml_payload',
    'embed_paragraph',
    'detect_biblical_references',
    'score_archetypes',
    'map_dualisms',
    'vectorize_typography',
    'plan_visual_asset',
    'refresh_reader_search',
    'drift_audit'
  );
exception when duplicate_object then null; end $$;

create table if not exists nos.cloud_upload_batches (
  id uuid primary key default gen_random_uuid(),
  batch_key text not null unique,
  archive_batch_id uuid references nos.archive_batches(id) on delete set null,
  storage_prefix text not null,
  status text not null default 'open',
  local_archive_root text,
  manifest_root text,
  totals jsonb not null default '{}'::jsonb,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists nos.storage_objects (
  id uuid primary key default gen_random_uuid(),
  upload_batch_id uuid references nos.cloud_upload_batches(id) on delete cascade,
  archive_batch_id uuid references nos.archive_batches(id) on delete set null,
  bucket_id text not null,
  object_path text not null,
  local_rel_path text,
  artifact_kind text,
  content_type text,
  sha256_expected text check (sha256_expected is null or sha256_expected ~ '^[0-9a-f]{64}$'),
  sha256_actual text check (sha256_actual is null or sha256_actual ~ '^[0-9a-f]{64}$'),
  byte_size_expected bigint check (byte_size_expected is null or byte_size_expected >= 0),
  byte_size_actual bigint check (byte_size_actual is null or byte_size_actual >= 0),
  verification_status nos.cloud_upload_status not null default 'planned',
  storage_metadata jsonb not null default '{}'::jsonb,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (bucket_id, object_path)
);

create table if not exists nos.ingest_jobs (
  id uuid primary key default gen_random_uuid(),
  queue_name text not null,
  job_kind nos.ingest_job_kind not null,
  status nos.ingest_job_status not null default 'queued',
  upload_batch_id uuid references nos.cloud_upload_batches(id) on delete cascade,
  archive_batch_id uuid references nos.archive_batches(id) on delete cascade,
  storage_object_id uuid references nos.storage_objects(id) on delete cascade,
  paragraph_id uuid references nos.paragraphs(id) on delete cascade,
  token_id uuid references nos.tokens(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  result jsonb not null default '{}'::jsonb,
  error text,
  attempts integer not null default 0,
  available_at timestamptz not null default now(),
  started_at timestamptz,
  completed_at timestamptz,
  failed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists nos.realtime_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  upload_batch_id uuid references nos.cloud_upload_batches(id) on delete cascade,
  archive_batch_id uuid references nos.archive_batches(id) on delete cascade,
  ingest_job_id uuid references nos.ingest_jobs(id) on delete set null,
  storage_object_id uuid references nos.storage_objects(id) on delete set null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists nos.edge_function_invocations (
  id uuid primary key default gen_random_uuid(),
  function_name text not null,
  request_id text,
  upload_batch_id uuid references nos.cloud_upload_batches(id) on delete set null,
  ingest_job_id uuid references nos.ingest_jobs(id) on delete set null,
  status text not null default 'started',
  input jsonb not null default '{}'::jsonb,
  output jsonb not null default '{}'::jsonb,
  error text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists nos.manifest_shards (
  id uuid primary key default gen_random_uuid(),
  upload_batch_id uuid references nos.cloud_upload_batches(id) on delete cascade,
  bucket_id text not null default 'nos-manifests',
  object_path text not null,
  source_manifest_rel_path text not null,
  shard_index integer not null,
  shard_count integer,
  sha256 text not null check (sha256 ~ '^[0-9a-f]{64}$'),
  byte_size bigint not null,
  content_encoding text not null default 'gzip',
  imported_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  unique (upload_batch_id, source_manifest_rel_path, shard_index)
);

create or replace function nos.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_cloud_upload_batches_touch on nos.cloud_upload_batches;
create trigger trg_cloud_upload_batches_touch
before update on nos.cloud_upload_batches
for each row execute function nos.touch_updated_at();

drop trigger if exists trg_storage_objects_touch on nos.storage_objects;
create trigger trg_storage_objects_touch
before update on nos.storage_objects
for each row execute function nos.touch_updated_at();

drop trigger if exists trg_ingest_jobs_touch on nos.ingest_jobs;
create trigger trg_ingest_jobs_touch
before update on nos.ingest_jobs
for each row execute function nos.touch_updated_at();

create or replace function nos.emit_realtime_event(
  p_event_type text,
  p_payload jsonb default '{}'::jsonb,
  p_upload_batch_id uuid default null,
  p_archive_batch_id uuid default null,
  p_ingest_job_id uuid default null,
  p_storage_object_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = nos, public
as $$
declare
  v_id uuid;
begin
  insert into nos.realtime_events (
    event_type,
    payload,
    upload_batch_id,
    archive_batch_id,
    ingest_job_id,
    storage_object_id
  )
  values (
    p_event_type,
    coalesce(p_payload, '{}'::jsonb),
    p_upload_batch_id,
    p_archive_batch_id,
    p_ingest_job_id,
    p_storage_object_id
  )
  returning id into v_id;

  return v_id;
end;
$$;

create or replace function nos.enqueue_job(
  p_queue_name text,
  p_job_kind nos.ingest_job_kind,
  p_payload jsonb default '{}'::jsonb,
  p_upload_batch_id uuid default null,
  p_archive_batch_id uuid default null,
  p_storage_object_id uuid default null,
  p_paragraph_id uuid default null,
  p_token_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = nos, public
as $$
declare
  v_job_id uuid;
begin
  insert into nos.ingest_jobs (
    queue_name,
    job_kind,
    payload,
    upload_batch_id,
    archive_batch_id,
    storage_object_id,
    paragraph_id,
    token_id
  )
  values (
    p_queue_name,
    p_job_kind,
    coalesce(p_payload, '{}'::jsonb),
    p_upload_batch_id,
    p_archive_batch_id,
    p_storage_object_id,
    p_paragraph_id,
    p_token_id
  )
  returning id into v_job_id;

  perform pgmq.send(
    p_queue_name,
    jsonb_build_object(
      'job_id', v_job_id,
      'job_kind', p_job_kind,
      'payload', coalesce(p_payload, '{}'::jsonb),
      'upload_batch_id', p_upload_batch_id,
      'archive_batch_id', p_archive_batch_id,
      'storage_object_id', p_storage_object_id,
      'paragraph_id', p_paragraph_id,
      'token_id', p_token_id
    )
  );

  perform nos.emit_realtime_event(
    'job_queued',
    jsonb_build_object('queue_name', p_queue_name, 'job_kind', p_job_kind),
    p_upload_batch_id,
    p_archive_batch_id,
    v_job_id,
    p_storage_object_id
  );

  return v_job_id;
end;
$$;

create or replace function nos.mark_job_status(
  p_job_id uuid,
  p_status nos.ingest_job_status,
  p_result jsonb default '{}'::jsonb,
  p_error text default null
)
returns void
language plpgsql
security definer
set search_path = nos, public
as $$
declare
  v_job nos.ingest_jobs;
begin
  update nos.ingest_jobs
  set status = p_status,
      result = coalesce(p_result, result),
      error = p_error,
      attempts = case when p_status = 'running' then attempts + 1 else attempts end,
      started_at = case when p_status = 'running' then now() else started_at end,
      completed_at = case when p_status = 'completed' then now() else completed_at end,
      failed_at = case when p_status = 'failed' then now() else failed_at end
  where id = p_job_id
  returning * into v_job;

  if found then
    perform nos.emit_realtime_event(
      'job_' || p_status::text,
      jsonb_build_object('job_kind', v_job.job_kind, 'result', coalesce(p_result, '{}'::jsonb), 'error', p_error),
      v_job.upload_batch_id,
      v_job.archive_batch_id,
      v_job.id,
      v_job.storage_object_id
    );
  end if;
end;
$$;

create or replace function nos.cron_enqueue_pending_hash_verification()
returns integer
language plpgsql
security definer
set search_path = nos, public
as $$
declare
  r record;
  n integer := 0;
begin
  for r in
    select *
    from nos.storage_objects
    where verification_status in ('uploaded', 'failed')
    order by updated_at asc
    limit 50
  loop
    perform nos.enqueue_job(
      'nos_hash_verify',
      'verify_artifact_hash',
      jsonb_build_object('bucket', r.bucket_id, 'object_path', r.object_path),
      r.upload_batch_id,
      r.archive_batch_id,
      r.id
    );
    n := n + 1;
  end loop;

  return n;
end;
$$;

create or replace function nos.cron_enqueue_pending_typography_inputs()
returns integer
language plpgsql
security definer
set search_path = nos, public
as $$
declare
  r record;
  n integer := 0;
begin
  for r in
    select ti.*
    from nos.typography_inputs ti
    left join nos.paragraph_typography_vectors ptv
      on ptv.typography_input_hash = ti.input_hash
    where ti.token_id is null
      and ptv.id is null
    order by ti.id
    limit 50
  loop
    perform nos.enqueue_job(
      'nos_typography_vectorize',
      'vectorize_typography',
      jsonb_build_object('typography_input_id', r.id, 'scope', 'paragraph'),
      null,
      null,
      null,
      r.paragraph_id,
      null
    );
    n := n + 1;
  end loop;

  return n;
end;
$$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('nos-raw-local-imports', 'nos-raw-local-imports', false, 52428800, null),
  ('nos-drive-xml', 'nos-drive-xml', false, 52428800, array['text/xml','application/xml','text/plain']),
  ('nos-drive-docx', 'nos-drive-docx', false, 52428800, array['application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/zip','application/octet-stream']),
  ('nos-manifests', 'nos-manifests', false, 52428800, array['application/gzip','application/json','text/tab-separated-values','text/plain','application/octet-stream']),
  ('nos-derived', 'nos-derived', false, 52428800, array['application/json','text/plain','text/tab-separated-values','application/gzip','application/octet-stream']),
  ('nos-visual-assets', 'nos-visual-assets', false, 52428800, null)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

alter table nos.cloud_upload_batches enable row level security;
alter table nos.storage_objects enable row level security;
alter table nos.ingest_jobs enable row level security;
alter table nos.realtime_events enable row level security;
alter table nos.edge_function_invocations enable row level security;
alter table nos.manifest_shards enable row level security;

drop policy if exists "nos authenticated read upload batches" on nos.cloud_upload_batches;
create policy "nos authenticated read upload batches"
on nos.cloud_upload_batches for select
to authenticated
using (true);

drop policy if exists "nos authenticated read storage objects" on nos.storage_objects;
create policy "nos authenticated read storage objects"
on nos.storage_objects for select
to authenticated
using (true);

drop policy if exists "nos authenticated read ingest jobs" on nos.ingest_jobs;
create policy "nos authenticated read ingest jobs"
on nos.ingest_jobs for select
to authenticated
using (true);

drop policy if exists "nos authenticated read realtime events" on nos.realtime_events;
create policy "nos authenticated read realtime events"
on nos.realtime_events for select
to authenticated
using (true);

drop policy if exists "nos authenticated read manifest shards" on nos.manifest_shards;
create policy "nos authenticated read manifest shards"
on nos.manifest_shards for select
to authenticated
using (true);

drop policy if exists "nos private storage authenticated read visual assets" on storage.objects;
create policy "nos private storage authenticated read visual assets"
on storage.objects for select
to authenticated
using (bucket_id = 'nos-visual-assets');

do $$
declare
  q text;
begin
  foreach q in array array[
    'nos_hash_verify',
    'nos_manifest_ingest',
    'nos_xml_parse',
    'nos_paragraph_embed',
    'nos_biblical_detect',
    'nos_archetype_score',
    'nos_dualism_map',
    'nos_typography_vectorize',
    'nos_visual_asset_plan',
    'nos_reader_index_refresh',
    'nos_drift_audit'
  ]
  loop
    begin
      perform pgmq.create(q);
    exception when others then
      null;
    end;
  end loop;
end $$;

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'nos'
        and tablename = 'ingest_jobs'
    ) then
      alter publication supabase_realtime add table nos.ingest_jobs;
    end if;

    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'nos'
        and tablename = 'realtime_events'
    ) then
      alter publication supabase_realtime add table nos.realtime_events;
    end if;

    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'nos'
        and tablename = 'storage_objects'
    ) then
      alter publication supabase_realtime add table nos.storage_objects;
    end if;
  end if;
end $$;

select cron.unschedule('nos-hash-verify-every-5-min')
where exists (select 1 from cron.job where jobname = 'nos-hash-verify-every-5-min');

select cron.schedule(
  'nos-hash-verify-every-5-min',
  '*/5 * * * *',
  $$select nos.cron_enqueue_pending_hash_verification();$$
);

select cron.unschedule('nos-typography-vectorize-every-15-min')
where exists (select 1 from cron.job where jobname = 'nos-typography-vectorize-every-15-min');

select cron.schedule(
  'nos-typography-vectorize-every-15-min',
  '*/15 * * * *',
  $$select nos.cron_enqueue_pending_typography_inputs();$$
);

create index if not exists idx_nos_cloud_upload_batches_key on nos.cloud_upload_batches(batch_key);
create index if not exists idx_nos_storage_objects_status on nos.storage_objects(verification_status);
create index if not exists idx_nos_storage_objects_object on nos.storage_objects(bucket_id, object_path);
create index if not exists idx_nos_ingest_jobs_status_kind on nos.ingest_jobs(status, job_kind);
create index if not exists idx_nos_ingest_jobs_queue_status on nos.ingest_jobs(queue_name, status);
create index if not exists idx_nos_realtime_events_created on nos.realtime_events(created_at desc);
create index if not exists idx_nos_manifest_shards_batch on nos.manifest_shards(upload_batch_id);
