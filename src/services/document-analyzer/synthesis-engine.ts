import { llmRouter } from '../orchestration-engine/router';
import type { CorpusMatch } from './corpus-searcher';

function extractTag(text: string, tag: string) {
  const match = text.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match?.[1]?.trim() || '';
}

export async function synthesizeAnalysis(
  extractedText: string,
  corpusMatches: CorpusMatch[]
): Promise<{ the_bad: string; from_your_book: string; your_response: string }> {
  const corpusContext = corpusMatches
    .map(
      (match, index) =>
        `<match rank="${index + 1}" chapter_slug="${match.chapter_slug}" chapter_number="${match.chapter_number ?? ''}" similarity="${match.similarity_score.toFixed(4)}">${match.content}</match>`
    )
    .join("\n");

  const response = await llmRouter.route(
    {
      systemPrompt: [
        'You are the synthesis engine for The Weight of the Sky.',
        'Work in three explicit reasoning stages: critique the external text, ground the critique in the manuscript corpus, then answer in the manuscript voice.',
        'Your response must obey the D-4.0 Physical Substitution Law: do not use abstract emotion labels when writing the response voice; ground claims in objects, pressure, temperature, motion, texture, and bodily sensation.',
        'Return exactly three XML tags and nothing else: <the_bad>, <from_your_book>, <your_response>.',
      ].join(' '),
      prompt: [
        '<external_text>',
        extractedText.slice(0, 12000),
        '</external_text>',
        '<corpus_matches>',
        corpusContext,
        '</corpus_matches>',
        'Write <the_bad> as a critique of the uploaded text relative to the manuscript voice, theology, and narrative logic.',
        'Write <from_your_book> by surfacing the most relevant matching passages from the corpus.',
        'Write <your_response> in the manuscript voice with concrete physical substitution language only.',
      ].join('\n'),
    },
    'anthropic'
  );

  return {
    the_bad: extractTag(response.content, 'the_bad'),
    from_your_book: extractTag(response.content, 'from_your_book'),
    your_response: extractTag(response.content, 'your_response'),
  };
}
