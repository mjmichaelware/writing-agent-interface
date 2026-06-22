import { handleOptions, jsonResponse } from "../_shared/cors.ts";
import { adminClient } from "../_shared/supabase.ts";

const allowedKinds = new Set([
  "ingest_manifest_tsv",
  "parse_xml_payload",
  "embed_paragraph",
  "detect_biblical_references",
  "score_archetypes",
  "map_dualisms",
  "vectorize_typography",
  "plan_visual_asset",
  "refresh_reader_search",
  "drift_audit",
]);

const queueForKind: Record<string, string> = {
  ingest_manifest_tsv: "nos_manifest_ingest",
  parse_xml_payload: "nos_xml_parse",
  embed_paragraph: "nos_paragraph_embed",
  detect_biblical_references: "nos_biblical_detect",
  score_archetypes: "nos_archetype_score",
  map_dualisms: "nos_dualism_map",
  vectorize_typography: "nos_typography_vectorize",
  plan_visual_asset: "nos_visual_asset_plan",
  refresh_reader_search: "nos_reader_index_refresh",
  drift_audit: "nos_drift_audit",
};

Deno.serve(async (req) => {
  const opt = handleOptions(req);
  if (opt) return opt;

  try {
    if (req.method !== "POST") return jsonResponse({ error: "POST only" }, 405);

    const body = await req.json();
    const job_kind = body.job_kind;

    if (!allowedKinds.has(job_kind)) {
      return jsonResponse({ ok: false, error: `Unsupported job_kind: ${job_kind}` }, 400);
    }

    const supabase = adminClient();

    const { data: jobId, error } = await supabase.schema("nos").rpc("enqueue_job", {
      p_queue_name: body.queue_name ?? queueForKind[job_kind],
      p_job_kind: job_kind,
      p_payload: body.payload ?? {},
      p_upload_batch_id: body.upload_batch_id ?? null,
      p_archive_batch_id: body.archive_batch_id ?? null,
      p_storage_object_id: body.storage_object_id ?? null,
      p_paragraph_id: body.paragraph_id ?? null,
      p_token_id: body.token_id ?? null,
    });

    if (error) throw error;

    return jsonResponse({ ok: true, job_id: jobId, job_kind });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err?.message ?? err) }, 400);
  }
});
