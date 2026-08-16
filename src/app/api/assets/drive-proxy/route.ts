import { NextResponse } from "next/server";
import { createDriveClient } from "@/services/document-analyzer/gdrive-sync";

// GET /api/assets/drive-proxy?id=DRIVE_FILE_ID
// Proxies a Google Drive image through the server using existing OAuth credentials.
// This lets Layer 2 display Drive images without making them publicly shared.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get("id")?.trim();

  if (!fileId) {
    return new Response("Missing id parameter", { status: 400 });
  }

  // Basic safety: file IDs are alphanumeric + dash/underscore only
  if (!/^[a-zA-Z0-9_-]+$/.test(fileId)) {
    return new Response("Invalid file id", { status: 400 });
  }

  let drive: ReturnType<typeof createDriveClient>;
  try {
    drive = createDriveClient();
  } catch {
    return new Response("Google Drive not configured", { status: 503 });
  }

  try {
    // Get metadata to determine mime type
    const meta = await drive.files.get({
      fileId,
      fields: "id,name,mimeType",
      supportsAllDrives: true,
    });

    const mimeType = meta.data.mimeType || "image/jpeg";

    // Stream the file content
    const res = await drive.files.get(
      { fileId, alt: "media", supportsAllDrives: true },
      { responseType: "stream" }
    );

    const chunks: Buffer[] = [];
    await new Promise<void>((resolve, reject) => {
      (res.data as any).on("data", (chunk: Buffer) => chunks.push(chunk));
      (res.data as any).on("end", resolve);
      (res.data as any).on("error", reject);
    });

    const buffer = Buffer.concat(chunks);

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=86400", // cache 24h
      },
    });
  } catch (e: any) {
    return new Response(e?.message || "Failed to fetch Drive file", { status: 500 });
  }
}
