import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: "Supabase not configured", references: [] }, { status: 200 });
  }
  try {
    const supabase = createClient(url, key);
    const { data, error } = await supabase
      .from("biblical_references")
      .select("*")
      .order("scripture_book", { ascending: true });
    if (error) {
      return NextResponse.json({ error: error.message, references: [] }, { status: 200 });
    }
    return NextResponse.json({ references: data || [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, references: [] }, { status: 200 });
  }
}