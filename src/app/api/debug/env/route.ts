import { NextResponse } from "next/server";
import { isAuthorized } from "@/lib/auth";

// Protected diagnostics — shows which env vars are SET (never reveals values)
export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const check = (name: string) => ({
    set: !!process.env[name],
    length: process.env[name]?.length ?? 0,
  });

  return NextResponse.json({
    ai: {
      ANTHROPIC_API_KEY: check("ANTHROPIC_API_KEY"),
      GROQ_API_KEY: check("GROQ_API_KEY"),
      GEMINI_API_KEY: check("GEMINI_API_KEY"),
      GOOGLE_API_KEY: check("GOOGLE_API_KEY"),
    },
    google_oauth: {
      GOOGLE_CLIENT_ID: check("GOOGLE_CLIENT_ID"),
      GOOGLE_CLIENT_SECRET: check("GOOGLE_CLIENT_SECRET"),
      GOOGLE_REFRESH_TOKEN: check("GOOGLE_REFRESH_TOKEN"),
    },
    supabase: {
      NEXT_PUBLIC_SUPABASE_URL: check("NEXT_PUBLIC_SUPABASE_URL"),
      SUPABASE_SERVICE_ROLE_KEY: check("SUPABASE_SERVICE_ROLE_KEY"),
    },
    auth: {
      AUTHOR_PIN: check("AUTHOR_PIN"),
    },
  });
}
