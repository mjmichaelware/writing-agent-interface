import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function sb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function GET(req: NextRequest) {
  const client = sb();
  if (!client) return NextResponse.json({ references: [], error: "Supabase not configured" });

  const chapterId = req.nextUrl.searchParams.get("chapterId");
  const motif     = req.nextUrl.searchParams.get("motif");

  let q = client
    .from("semantic_biblical_anchors")
    .select("id, book, chapter, verse_start, verse_end, biblical_anchor_label, motif_family, anchor_key, active, metadata")
    .eq("active", true)
    .order("book")
    .order("chapter")
    .order("verse_start")
    .limit(1000);

  // Filter by bible chapter if requested
  if (chapterId) q = q.eq("chapter", parseInt(chapterId));
  if (motif)     q = q.eq("motif_family", motif);

  const { data, error } = await q;
  if (error) return NextResponse.json({ references: [], error: error.message }, { status: 500 });

  const references = (data || []).map((r: any) => ({
    id:             r.id,
    book:           r.book,
    chapter:        r.chapter,
    verse:          r.verse_start,
    verse_end:      r.verse_end,
    reference_text: r.biblical_anchor_label,
    motif_family:   r.motif_family,
    anchor_key:     r.anchor_key,
    paragraph_id:   r.metadata?.paragraph_id ?? null,
  }));

  return NextResponse.json({ references });
}
