import { handleOptions, jsonResponse } from "../_shared/cors.ts";
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
      bucket,
      object_path,
      local_rel_path,
      artifact_kind,
      sha256_expected,
      byte_size_expected,
      content_type,
      enqueue_verify = true,
    } = body;

    assertAllowedBucket(bucket);
    assertSafeObjectPath(object_path);

    const supabase = adminClient();

    const { data: batch, error: batchError } = await supabase
      .schema("nos")
      .from("cloud_upload_batches")
      .upsert({
        batch_key,
        storage_prefix: body.storage_prefix ?? batch_key,
        manifest_root: body.manifest_root ?? null,
        local_archive_root: body.local_archive_root ?? null,
        totals: body.totals ?? {},
        status: "uploading",
      }, { onConflict: "batch_key" })
      .select("id")
      .single();

    if (batchError) throw batchError;

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
        verification_status: "uploaded",
        storage_metadata: {
          registered_at: new Date().toISOString(),
        },
      }, { onConflict: "bucket_id,object_path" })
      .select("id")
      .single();

    if (objectError) throw objectError;

    let job_id = null;
    if (enqueue_verify) {
      const { data: job, error: jobError } = await supabase.schema("nos").rpc("enqueue_job", {
        p_queue_name: "nos_hash_verify",
        p_job_kind: "verify_artifact_hash",
        p_payload: { bucket, object_path },
        p_upload_batch_id: batch.id,
        p_storage_object_id: storageObject.id,
      });

      if (jobError) throw jobError;
      job_id = job;
    }

    await supabase.schema("nos").rpc("emit_realtime_event", {
      p_event_type: "artifact_uploaded_registered",
      p_payload: { bucket, object_path, artifact_kind, job_id },
      p_upload_batch_id: batch.id,
      p_storage_object_id: storageObject.id,
    });

    return jsonResponse({
      ok: true,
      upload_batch_id: batch.id,
      storage_object_id: storageObject.id,
      job_id,
    });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err?.message ?? err) }, 400);
  }
});
