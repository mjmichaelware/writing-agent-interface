-- Proposal only. Do not execute until reviewed.
-- Best practice: keep raw OOXML files in the repo/storage folder and store metadata/index rows in Supabase.

create table if not exists public.source_documents (
  id uuid primary key default gen_random_uuid(),
  source_kind text not null default 'google_drive_docx_ooxml',
  drive_file_id text,
  original_name text,
  normalized_name text,
  local_source_path text,
  current_docx_path text,
  current_docx_sha256 text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.source_document_parts (
  id uuid primary key default gen_random_uuid(),
  source_document_id uuid references public.source_documents(id) on delete cascade,
  part_path text not null,
  local_path text not null,
  content_type text,
  bytes integer,
  sha256 text,
  text_preview text,
  created_at timestamptz default now(),
  unique(source_document_id, part_path)
);

create table if not exists public.source_document_revisions (
  id uuid primary key default gen_random_uuid(),
  source_document_id uuid references public.source_documents(id) on delete cascade,
  drive_revision_id text,
  modified_time timestamptz,
  metadata jsonb default '{}'::jsonb,
  local_media_path text,
  media_sha256 text,
  created_at timestamptz default now()
);
