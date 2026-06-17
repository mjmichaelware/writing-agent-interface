import { corsHeaders, EXPECTED_CONTEXT_SHA, EXPECTED_XML_MANIFEST_COUNT, EXPECTED_XML_MANIFEST_SHA, json } from "../_shared/semantic.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "POST required" }, 405);

  const body = await req.json().catch(() => ({}));

  const checks = {
    narrative_context_sha256: {
      expected: EXPECTED_CONTEXT_SHA,
      actual: body.narrative_context_sha256,
      ok: body.narrative_context_sha256 === EXPECTED_CONTEXT_SHA,
    },
    xml_manifest_sha256: {
      expected: EXPECTED_XML_MANIFEST_SHA,
      actual: body.xml_manifest_sha256,
      ok: body.xml_manifest_sha256 === EXPECTED_XML_MANIFEST_SHA,
    },
    xml_manifest_count: {
      expected: EXPECTED_XML_MANIFEST_COUNT,
      actual: Number(body.xml_manifest_count),
      ok: Number(body.xml_manifest_count) === EXPECTED_XML_MANIFEST_COUNT,
    },
  };

  const ok = Object.values(checks).every((x) => x.ok);
  return json({ ok, checks }, ok ? 200 : 409);
});
