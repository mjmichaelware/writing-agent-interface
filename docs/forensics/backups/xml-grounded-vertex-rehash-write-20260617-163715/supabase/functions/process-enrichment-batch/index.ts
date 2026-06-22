import { handleOptions, jsonResponse } from "../_shared/cors.ts";
import { adminClient } from "../_shared/supabase.ts";

Deno.serve(async (req) => {
  const opt = handleOptions(req);
  if (opt) return opt;

  try {
    if (req.method !== "POST") return jsonResponse({ error: "POST only" }, 405);

    const body = await req.json();
    const limit = Math.min(Number(body.limit ?? 10), 50);
    const job_kind = body.job_kind ?? null;

    const supabase = adminClient();

    let q = supabase
      .schema("nos")
      .from("ingest_jobs")
      .select("*")
      .eq("status", "queued")
      .lte("available_at", new Date().toISOString())
      .order("created_at", { ascending: true })
      .limit(limit);

    if (job_kind) q = q.eq("job_kind", job_kind);

    const { data: jobs, error } = await q;
    if (error) throw error;

    const processed = [];

    for (const job of jobs ?? []) {
      await supabase.schema("nos").rpc("mark_job_status", {
        p_job_id: job.id,
        p_status: "running",
        p_result: {},
        p_error: null,
      });

      const result = {
        note: "Placeholder processor: no semantic/biblical/archetype/dualism/typography value invented here.",
        job_kind: job.job_kind,
        payload: job.payload,
      };

      await supabase.schema("nos").rpc("mark_job_status", {
        p_job_id: job.id,
        p_status: "completed",
        p_result: result,
        p_error: null,
      });

      processed.push({ id: job.id, job_kind: job.job_kind });
    }

    return jsonResponse({ ok: true, processed });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err?.message ?? err) }, 400);
  }
});
