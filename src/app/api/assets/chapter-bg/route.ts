import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isAuthorized } from "@/lib/auth";

function sb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// GET /api/assets/chapter-bg — returns all chapter bg assignments
export async function GET() {
  const client = sb();
  if (!client) return NextResponse.json({ assignments: {} });

  const { data } = await client
    .from("chapters")
    .select("chapter_number, bg_image_url")
    .not("bg_image_url", "is", null);

  const assignments: Record<number, string> = {};
  for (const row of data ?? []) {
    if (row.chapter_number && row.bg_image_url) {
      assignments[row.chapter_number] = row.bg_image_url;
    }
  }

  return NextResponse.json({ assignments });
}

// POST /api/assets/chapter-bg — assign a URL to a chapter
export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { chapterNumber, url } = await request.json().catch(() => ({}));
  if (!chapterNumber || typeof url !== "string") {
    return NextResponse.json({ error: "chapterNumber and url required" }, { status: 400 });
  }

  const client = sb();
  if (!client) {
    // No Supabase — return ok so the client can store locally
    return NextResponse.json({ ok: true, persisted: false });
  }

  const { error } = await client
    .from("chapters")
    .update({ bg_image_url: url || null })
    .eq("chapter_number", chapterNumber);

  if (error) {
    // Column may not exist yet — return ok for client-side storage
    return NextResponse.json({ ok: true, persisted: false, warning: error.message });
  }

  return NextResponse.json({ ok: true, persisted: true, chapterNumber, url });
}
