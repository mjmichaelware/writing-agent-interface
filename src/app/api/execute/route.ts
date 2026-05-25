import { BigQuery } from '@google-cloud/bigquery';
import { NextResponse } from 'next/server';

function getClient() {
  const email = process.env.GOOGLE_CLIENT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const project = process.env.GOOGLE_CLOUD_PROJECT;

  if (!email || !key || !project) return null;

  return new BigQuery({
    credentials: {
      client_email: email,
      private_key: key,
    },
    projectId: project,
  });
}

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    const bq = getClient();

    if (!bq) {
      return NextResponse.json({ error: 'Google Cloud credentials not configured' }, { status: 503 });
    }

    // Feature 165: Narrative Analytics via BigQuery
    const [job] = await bq.createQueryJob({
      query: query || "SELECT part_number, count(*) as count FROM `the-weight-of-the-sky.narrative_os.paragraphs` GROUP BY part_number",
    });

    const [rows] = await job.getQueryResults();

    return NextResponse.json(rows);
  } catch (error: any) {
    console.error("BigQuery execution failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
