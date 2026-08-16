import { NextResponse } from "next/server";

// Server-side PIN validation. Accepts POST {pin: string}.
// On success sets an httpOnly session cookie; on failure returns 401.
export async function POST(request: Request) {
  const { pin } = await request.json().catch(() => ({ pin: "" }));
  const expected = process.env.AUTHOR_PIN || "9187";
  if (!pin || pin !== expected) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set("nos-author-session", "1", {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });
  return response;
}

// Clear the session cookie on logout.
export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete("nos-author-session");
  return response;
}
