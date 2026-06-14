import { corsHeaders, handleOptions, jsonResponse } from "../_shared/cors.ts";
import { adminClient } from "../_shared/supabase.ts";
import { assertAllowedBucket, assertSafeObjectPath } from "../_shared/hash.ts";

Deno.serve(async (req) => {
  const opt = handleOptions(req);
  if (opt) return opt;

  try {
    if (req.method !== "POST") return jsonResponse({ error: "POST only" }, 405);

    const body = await req.json();
    const {
      batch_key,
      storage_prefix,
      bucket,
      object_path,
      local_rel_path,
      artifact_kind,
      sha256_expected,
      byte_size_expected,
      content_type,
    } = body;

    assertAllowedBucket(bucket);
    assertSafeObjectPath(object_path);

    const supabase = adminClient();

    const { data: batch, error: batchError } = await supabase
      .schema("nos")
      .from("cloud_upload_batches")
      .upsert({
        batch_key,
        storage_prefix: storage_prefix ?? batch_key,
        manifest_root: body.manifest_root ?? null,
        local_archive_root: body.local_archive_root ?? null,
        totals: body.totals ?? {},
        status: "open",
      }, { onConflict: "batch_key" })
      .select("id")
      .single();

    if (batchError) throw batchError;

    const { data: signed, error: signedError } = await supabase
      .storage
      .from(bucket)
      .createSignedUploadUrl(object_path);

    if (signedError) throw signedError;

    const { data: storageObject, error: objectError } = await supabase
      .schema("nos")
      .from("storage_objects")
      .upsert({
        upload_batch_id: batch.id,
        bucket_id: bucket,
        object_path,
        local_rel_path: local_rel_path ?? null,
        artifact_kind: artifact_kind ?? null,
        content_type: content_type ?? null,
        sha256_expected: sha256_expected ?? null,
        byte_size_expected: byte_size_expected ?? null,
        verification_status: "signed_url_created",
        storage_metadata: {
          signed_upload_created_at: new Date().toISOString(),
        },
      }, { onConflict: "bucket_id,object_path" })
      .select("id")
      .single();

    if (objectError) throw objectError;

    await supabase.schema("nos").rpc("emit_realtime_event", {
      p_event_type: "signed_upload_url_created",
      p_payload: { bucket, object_path, artifact_kind },
      p_upload_batch_id: batch.id,
      p_storage_object_id: storageObject.id,
    });

    return jsonResponse({
      ok: true,
      upload_batch_id: batch.id,
      storage_object_id: storageObject.id,
      bucket,
      object_path,
      signed_url: signed.signedUrl,
      token: signed.token,
    });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err?.message ?? err) }, 400);
  }
});
