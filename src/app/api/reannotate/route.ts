import { NextResponse } from 'next/server';

function isAuthorized(request: Request) {
  const expected = process.env.AUTHOR_PIN || '9187';
  const provided = request.headers.get('x-author-pin');
  return Boolean(expected && provided && provided === expected);
}

function getRepository() {
  return process.env.GITHUB_REPOSITORY || 'mjmichaelware/writing-agent-interface';
}

function getRef() {
  return process.env.REANNOTATE_WORKFLOW_REF || 'claude/skills-agents-updates-jpdg8x';
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) {
    return NextResponse.json({ error: 'GITHUB_TOKEN not configured' }, { status: 503 });
  }

  let body: any = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const chapterNumber = Number(body?.chapter_number);
  const fullCorpus = Boolean(body?.full_corpus);
  const workflow = fullCorpus ? 'semantic-rehash-full.yml' : 'semantic-rehash-dry-run.yml';
  const [owner, repo] = getRepository().split('/');

  if (!owner || !repo) {
    return NextResponse.json({ error: 'Invalid GITHUB_REPOSITORY' }, { status: 500 });
  }

  const inputs = fullCorpus
    ? { confirm: 'FULL_REHASH' }
    : {
        chapter: Number.isInteger(chapterNumber) && chapterNumber > 0 ? String(chapterNumber) : '',
        limit: '12',
      };

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflow}/dispatches`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ref: getRef(),
        inputs,
      }),
    }
  );

  if (!response.ok) {
    const details = await response.text();
    return NextResponse.json(
      { error: details || 'GitHub workflow dispatch failed' },
      { status: response.status }
    );
  }

  return NextResponse.json({
    dispatched: true,
    workflow,
  });
}
