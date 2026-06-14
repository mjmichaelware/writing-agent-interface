import { handleOptions, jsonResponse } from "../_shared/cors.ts";
import { adminClient } from "../_shared/supabase.ts";
import { assertAllowedBucket, assertSafeObjectPath, sha256Hex } from "../_shared/hash.ts";

Deno.serve(async (req) => {
  const opt = handleOptions(req);
  if (opt) return opt;

  try {
    if (req.method !== "POST") return jsonResponse({ error: "POST only" }, 405);

    const body = await req.json();
    const { bucket, object_path, storage_object_id, job_id } = body;

    assertAllowedBucket(bucket);
    assertSafeObjectPath(object_path);

    const supabase = adminClient();

    if (job_id) {
      await supabase.schema("nos").rpc("mark_job_status", {
        p_job_id: job_id,
        p_status: "running",
        p_result: {},
        p_error: null,
      });
    }

    const { data: file, error: downloadError } = await supabase
      .storage
      .from(bucket)
      .download(object_path);

    if (downloadError) throw downloadError;

    const bytes = await file.arrayBuffer();
    const sha = await sha256Hex(bytes);
    const byteSize = bytes.byteLength;

    let query = supabase
      .schema("nos")
      .from("storage_objects")
      .select("*");

    if (storage_object_id) query = query.eq("id", storage_object_id);
    else query = query.eq("bucket_id", bucket).eq("object_path", object_path);

    const { data: current, error: currentError } = await query.single();
    if (currentError) throw currentError;

    const expected = current.sha256_expected;
    const ok = !expected || expected === sha;
    const status = ok ? "verified" : "hash_mismatch";

    const { error: updateError } = await supabase
      .schema("nos")
      .from("storage_objects")
      .update({
        sha256_actual: sha,
        byte_size_actual: byteSize,
        verification_status: status,
        verified_at: new Date().toISOString(),
        storage_metadata: {
          ...(current.storage_metadata ?? {}),
          verified_at: new Date().toISOString(),
          verifier: "verify-artifact-hash",
        },
      })
      .eq("id", current.id);

    if (updateError) throw updateError;

    await supabase
      .schema("nos")
      .from("content_blobs")
      .upsert({
        sha256: sha,
        byte_size: byteSize,
        media_type: current.content_type ?? null,
        content_role: current.artifact_kind ?? "storage_object",
      }, { onConflict: "sha256" });

    await supabase.schema("nos").rpc("emit_realtime_event", {
      p_event_type: ok ? "artifact_hash_verified" : "artifact_hash_mismatch",
      p_payload: {
        bucket,
        object_path,
        sha256_actual: sha,
        sha256_expected: expected,
        byte_size_actual: byteSize,
      },
      p_upload_batch_id: current.upload_batch_id,
      p_archive_batch_id: current.archive_batch_id,
      p_ingest_job_id: job_id ?? null,
      p_storage_object_id: current.id,
    });

    if (job_id) {
      await supabase.schema("nos").rpc("mark_job_status", {
        p_job_id: job_id,
        p_status: ok ? "completed" : "failed",
        p_result: { sha256_actual: sha, byte_size_actual: byteSize, ok },
        p_error: ok ? null : "hash_mismatch",
      });
    }

    return jsonResponse({
      ok,
      bucket,
      object_path,
      storage_object_id: current.id,
      sha256_actual: sha,
      sha256_expected: expected,
      byte_size_actual: byteSize,
    });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err?.message ?? err) }, 400);
  }
});
