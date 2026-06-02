import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const { rows: references } = await query(
      `SELECT * FROM biblical_references ORDER BY book ASC, chapter ASC, verse ASC`
    );
    return NextResponse.json({ references });
  } catch (e: any) {
    console.error("Biblical References API Error:", e);
    return NextResponse.json({ error: e.message, references: [] }, { status: 500 });
  }
}
