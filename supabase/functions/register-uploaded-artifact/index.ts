import { corsHeaders, json, serviceClient } from "../_shared/semantic.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "POST required" }, 405);

  const body = await req.json().catch(() => ({}));
  const supabase = serviceClient();

  const source = body.source_document;
  const parts = Array.isArray(body.parts) ? body.parts : [];

  if (!source?.source_path || !source?.source_sha256) {
    return json({ error: "source_document.source_path and source_document.source_sha256 required" }, 400);
  }

  const { data: doc, error: docError } = await supabase
    .from("source_documents")
    .upsert({
      source_kind: source.source_kind ?? "artifact",
      source_path: source.source_path,
      source_sha256: source.source_sha256,
      title: source.title ?? null,
      byte_count: source.byte_count ?? null,
      metadata: source.metadata ?? {},
    }, { onConflict: "source_sha256" })
    .select("*")
    .single();

  if (docError) return json({ error: docError.message }, 500);

  if (parts.length) {
    const rows = parts.map((part) => ({
      source_document_id: doc.id,
      part_path: part.part_path,
      part_sha256: part.part_sha256,
      byte_count: part.byte_count ?? null,
      text_excerpt: part.text_excerpt ?? null,
      metadata: part.metadata ?? {},
    }));

    const { error: partsError } = await supabase
      .from("source_document_parts")
      .upsert(rows, { onConflict: "source_document_id,part_path,part_sha256" });

    if (partsError) return json({ error: partsError.message }, 500);
  }

  return json({ ok: true, source_document_id: doc.id, parts: parts.length });
});
