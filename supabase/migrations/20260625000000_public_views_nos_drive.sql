-- Public read-only views into the nos ingestion buffer tables.
-- Allows the service-role Supabase JS client (PostgREST) to query
-- nos.drive_sources and nos.local_imports without exposing the full nos schema.

CREATE OR REPLACE VIEW public.v_drive_sources AS
SELECT
  drive_file_id AS id,
  drive_name    AS name,
  mime_type,
  web_view_link,
  modified_time
FROM nos.drive_sources
ORDER BY drive_name;

CREATE OR REPLACE VIEW public.v_local_imports AS
SELECT
  id,
  target_index,
  status,
  local_basename,
  drive_file_id,
  drive_name
FROM nos.local_imports
ORDER BY target_index;

-- Grant read access to authenticated and service role
GRANT SELECT ON public.v_drive_sources TO anon, authenticated, service_role;
GRANT SELECT ON public.v_local_imports TO anon, authenticated, service_role;
