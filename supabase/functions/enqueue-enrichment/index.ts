import { corsHeaders, EXPECTED_CONTEXT_SHA, EXPECTED_XML_MANIFEST_COUNT, EXPECTED_XML_MANIFEST_SHA, json, PROMPT_VERSION, serviceClient } from "../_shared/semantic.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "POST required" }, 405);

  const body = await req.json().catch(() => ({}));
  const supabase = serviceClient();

  const provider = body.provider ?? "vertex";
  const model = body.model ?? "gemini-2.0-flash-001";
  const batchSize = Number(body.batch_size ?? 8);
  const maxParagraphs = body.max_paragraphs ? Number(body.max_paragraphs) : null;

  const { data: run, error: runError } = await supabase
    .from("semantic_runs")
    .insert({
      status: "queued",
      provider,
      model,
      prompt_version: PROMPT_VERSION,
      narrative_context_sha256: EXPECTED_CONTEXT_SHA,
      xml_manifest_sha256: EXPECTED_XML_MANIFEST_SHA,
      xml_manifest_count: EXPECTED_XML_MANIFEST_COUNT,
      source_summary: body.source_summary ?? {},
      metadata: {
        origin: "enqueue-enrichment-edge-function",
        reset_policy: "supersede_by_semantic_run_id",
      },
    })
    .select("*")
    .single();

  if (runError) return json({ error: runError.message }, 500);

  let query = supabase
    .from("paragraphs")
    .select("id, chapter_id, chunk_index")
    .order("chapter_id", { ascending: true })
    .order("chunk_index", { ascending: true });

  if (maxParagraphs) query = query.limit(maxParagraphs);

  const { data: paragraphs, error: paragraphError } = await query;
  if (paragraphError) return json({ error: paragraphError.message }, 500);

  const batches = [];
  for (let i = 0; i < (paragraphs ?? []).length; i += batchSize) {
    const slice = (paragraphs ?? []).slice(i, i + batchSize);
    batches.push({
      semantic_run_id: run.id,
      batch_index: batches.length,
      status: "queued",
      paragraph_ids: slice.map((p) => p.id),
      payload: {
        chapter_ids: [...new Set(slice.map((p) => p.chapter_id))],
        note: "Processing requires XML/context payload from GitHub/local processor or process-enrichment-batch payload.",
      },
    });
  }

  if (batches.length) {
    const { error: batchError } = await supabase.from("semantic_batches").insert(batches);
    if (batchError) return json({ error: batchError.message }, 500);
  }

  return json({
    ok: true,
    semantic_run_id: run.id,
    batches: batches.length,
    paragraphs: paragraphs?.length ?? 0,
  });
});
