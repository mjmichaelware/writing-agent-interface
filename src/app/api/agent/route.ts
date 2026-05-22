import { NextResponse } from 'next/server';
import { llmRouter } from '@/services/orchestration-engine/router';

export async function POST(request: Request) {
  try {
    const { prompt, context, role, preferredProvider } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'prompt is required' }, { status: 400 });
    }

    const response = await llmRouter.route({
      systemPrompt: role || "You are the Autonomous Principal Systems Architect and UI/UX Engineer for the Narrative Operating System.",
      context,
      prompt,
    }, preferredProvider);

    return NextResponse.json({ 
      result: response.content,
      provider: response.provider,
      model: response.model
    });
  } catch (error: any) {
    console.error("Agent execution failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}