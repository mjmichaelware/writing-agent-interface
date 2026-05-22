import { Logging } from '@google-cloud/logging';
import { Monitoring } from '@google-cloud/monitoring';
import { NextResponse } from 'next/server';

function getLogging() {
  return new Logging({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    projectId: process.env.GOOGLE_CLOUD_PROJECT,
  });
}

export async function GET() {
  try {
    const logging = getLogging();
    const [entries] = await logging.getEntries({ pageSize: 10 });

    return NextResponse.json({
      status: "HEALED",
      nervous_system: "OPTIMAL",
      recent_synapses: entries.map(e => ({
        timestamp: e.metadata.timestamp,
        event: e.data
      }))
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
