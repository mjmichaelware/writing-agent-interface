import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { llmRouter } from "@/services/orchestration-engine/router";
import { isAuthorized } from "@/lib/auth";

const BUFFER_DIR = path.join(process.cwd(), "src/data-layer/ingestion-buffer/gdrive_raw");

function sb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// Keyword search through local buffer files — no OpenAI embeddings needed
async function searchLocalFiles(query: string, maxFiles = 3): Promise<string> {
  try {
    const entries = await fs.readdir(BUFFER_DIR);
    const queryWords = query.toLowerCase().split(/\W+/).filter(w => w.length > 3);
    if (queryWords.length === 0) return "";

    const scored: { name: string; score: number }[] = [];
    for (const name of entries.slice(0, 200)) {
      const nameLower = name.toLowerCase();
      const score = queryWords.reduce((s, w) => s + (nameLower.includes(w) ? 2 : 0), 0);
      scored.push({ name, score });
    }

    // Take top files by filename score, then read and score by content
    const candidates = scored.filter(f => f.score > 0).slice(0, 10);
    if (candidates.length === 0) {
      // If no filename match, just take first few files
      candidates.push(...scored.slice(0, 5));
    }

    const contentScored: { name: string; excerpt: string; score: number }[] = [];
    for (const { name } of candidates) {
      try {
        const text = await fs.readFile(path.join(BUFFER_DIR, name), "utf-8");
        const lower = text.toLowerCase();
        const score = queryWords.reduce((s, w) => s + (lower.split(w).length - 1), 0);
        // Extract relevant excerpt
        let excerpt = "";
        for (const word of queryWords) {
          const idx = lower.indexOf(word);
          if (idx !== -1) {
            const start = Math.max(0, idx - 200);
            const end = Math.min(text.length, idx + 600);
            excerpt = text.slice(start, end).replace(/\s+/g, " ").trim();
            break;
          }
        }
        if (!excerpt) excerpt = text.slice(0, 600).replace(/\s+/g, " ").trim();
        contentScored.push({ name, excerpt, score });
      } catch { /* skip unreadable */ }
    }

    contentScored.sort((a, b) => b.score - a.score);
    const top = contentScored.slice(0, maxFiles);
    if (top.length === 0) return "";

    return `<local_manuscript_files>\n${top.map(f =>
      `<file name="${f.name}">${f.excerpt}…</file>`
    ).join("\n")}\n</local_manuscript_files>`;
  } catch {
    return "";
  }
}

// Search Supabase render_paragraphs by keyword (no vector needed)
async function searchSupabaseParagraphs(query: string): Promise<string> {
  const client = sb();
  if (!client) return "";
  try {
    const terms = query.split(/\W+/).filter(w => w.length > 3).slice(0, 5);
    if (terms.length === 0) return "";
    // Use ilike for simple text search
    const { data } = await client
      .from("render_paragraphs")
      .select("text, chapter_number, chapter_version")
      .eq("canonical", true)
      .ilike("text", `%${terms[0]}%`)
      .limit(5);

    if (!data || data.length === 0) return "";
    return `<supabase_paragraphs>\n${data.map((r: any) =>
      `<paragraph chapter="${r.chapter_number}">${r.text}</paragraph>`
    ).join("\n")}\n</supabase_paragraphs>`;
  } catch {
    return "";
  }
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { prompt, context, role, preferredProvider, imageData, mimeType } = body;

    if (!prompt && !imageData) {
      return NextResponse.json({ error: "prompt is required" }, { status: 400 });
    }

    // Build manuscript context: try Supabase first, then local files
    let manuscriptContext = "";
    if (prompt) {
      const [supabaseCtx, localCtx] = await Promise.all([
        searchSupabaseParagraphs(String(prompt)),
        searchLocalFiles(String(prompt)),
      ]);
      manuscriptContext = [supabaseCtx, localCtx].filter(Boolean).join("\n\n");
    }

    const mergedContext = [manuscriptContext, context].filter(Boolean).join("\n\n");

    const systemPrompt = role ||
      "You are a manuscript analysis assistant for \"The Weight of the Sky\" by Michael Alonza Prentice Ware. " +
      "You have access to the manuscript prose and semantic data. Answer questions about the text, characters, themes, and structure. " +
      "When prose excerpts are provided in <supabase_paragraphs> or <local_manuscript_files>, quote and reference them directly.";

    const response = await llmRouter.route({
      systemPrompt,
      context: mergedContext || undefined,
      prompt: prompt || "Describe this image in the context of the manuscript.",
    }, preferredProvider || "anthropic");

    return NextResponse.json({
      response: response.content,
      result: response.content,
      provider: response.provider,
      model: response.model,
      usage: response.usage ? {
        input: response.usage.promptTokens,
        output: response.usage.completionTokens,
      } : null,
      contextUsed: !!mergedContext,
    });
  } catch (error: any) {
    console.error("Agent failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
