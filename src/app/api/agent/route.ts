import { NextResponse } from 'next/server';
import { llmRouter } from '@/services/orchestration-engine/router';
import { searchCorpus } from '@/services/document-analyzer/corpus-searcher';

type AgentMode = "manuscript_query" | "write" | "edit" | "chat";

function normalizeMode(value: unknown): AgentMode {
  if (
    value === "manuscript_query" ||
    value === "write" ||
    value === "edit" ||
    value === "chat"
  ) {
    return value;
  }

  return "chat";
}

function xmlContext(matches: Awaited<ReturnType<typeof searchCorpus>>) {
  const body = matches
    .slice(0, 3)
    .map(
      (match, index) =>
        `<match rank="${index + 1}" chapter_slug="${match.chapter_slug}" chapter_number="${match.chapter_number ?? ''}" similarity="${match.similarity_score.toFixed(4)}">${match.content}</match>`
    )
    .join("\n");

  return body ? `<manuscript_context>\n${body}\n</manuscript_context>` : "";
}

export async function POST(request: Request) {
  try {
    const { prompt, context, role, preferredProvider, mode } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'prompt is required' }, { status: 400 });
    }

    const normalizedMode = normalizeMode(mode);
    const ragActive = normalizedMode === "manuscript_query" || normalizedMode === "write";
    const matches = ragActive ? await searchCorpus(String(prompt)) : [];
    const ragContext = ragActive ? xmlContext(matches) : "";
    const mergedContext = [ragContext, context].filter(Boolean).join("\n\n");

    let resolvedProvider = preferredProvider;
    if (!resolvedProvider) {
      if (normalizedMode === "chat") {
        resolvedProvider = "groq";
      } else if (normalizedMode === "manuscript_query" || normalizedMode === "write") {
        resolvedProvider = "anthropic";
      }
    }

    const response = await llmRouter.route({
      systemPrompt: role || "You are the Autonomous Principal Systems Architect and UI/UX Engineer for the Narrative Operating System.",
      context: mergedContext || undefined,
      prompt,
    }, resolvedProvider);

    return NextResponse.json({ 
      result: response.content,
      provider: response.provider,
      model: response.model,
      ragActive,
      matchCount: matches.length,
    });
  } catch (error: any) {
    console.error("Agent execution failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
