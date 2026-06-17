import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

export function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

export function serviceClient() {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, key, {
    auth: { persistSession: false },
    global: { headers: { "X-Client-Info": "xml-grounded-semantic-rehash" } },
  });
}

export const EXPECTED_CONTEXT_SHA =
  Deno.env.get("EXPECTED_NARRATIVE_CONTEXT_SHA256") ??
  "6e7e306c32940db56e82f1aff23942e6f3d62d7483db8e5735bb2ef2ef75eb8c";

export const EXPECTED_XML_MANIFEST_SHA =
  Deno.env.get("EXPECTED_XML_MANIFEST_SHA256") ??
  "bca8eeacca6a9dd260d50a14a8b2dce9f2f2e759dd16a5cc3ef2ee06d0a1b970";

export const EXPECTED_XML_MANIFEST_COUNT =
  Number(Deno.env.get("EXPECTED_XML_MANIFEST_COUNT") ?? "579");

export const PROMPT_VERSION = "xml-grounded-semantic-v1";
