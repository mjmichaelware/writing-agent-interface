import { corsHeaders, json, serviceClient } from "../_shared/semantic.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "POST required" }, 405);

  const body = await req.json().catch(() => ({}));
  const supabase = serviceClient();

  const batchId = body.batch_id;
  if (!batchId) return json({ error: "batch_id required" }, 400);

  const { data: batch, error: batchError } = await supabase
    .from("semantic_batches")
    .select("*")
    .eq("id", batchId)
    .single();

  if (batchError) return json({ error: batchError.message }, 500);

  const payload = body.payload_override ?? batch.payload ?? {};

  const { error: updateError } = await supabase
    .from("semantic_batches")
    .update({
      status: "requires_external_processor",
      updated_at: new Date().toISOString(),
      result_summary: {
        message: "This Edge Function is queue-safe. Full XML-grounded Vertex processing runs from GitHub Actions/local script because deployed Edge Functions cannot read repository OOXML files directly.",
        payload_keys: Object.keys(payload),
      },
    })
    .eq("id", batchId);

  if (updateError) return json({ error: updateError.message }, 500);

  return json({
    ok: true,
    batch_id: batchId,
    status: "requires_external_processor",
    processor: "scripts/semantic/xml-grounded-vertex-rehash.mjs",
  });
});
