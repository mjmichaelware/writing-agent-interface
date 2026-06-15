import { Logging } from '@google-cloud/logging';
import { NextResponse } from 'next/server';

function getGoogleCredentials() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const projectId =
    process.env.GOOGLE_CLOUD_PROJECT ||
    process.env.GOOGLE_PROJECT_ID ||
    process.env.GCLOUD_PROJECT ||
    process.env.GCP_PROJECT;

  if (!clientEmail || !privateKey || !projectId) {
    return {
      configured: false as const,
      reason: {
        GOOGLE_CLIENT_EMAIL: Boolean(clientEmail),
        GOOGLE_PRIVATE_KEY: Boolean(privateKey),
        GOOGLE_PROJECT_ID: Boolean(projectId),
      },
    };
  }

  return {
    configured: true as const,
    projectId,
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
  };
}

export async function GET() {
  const google = getGoogleCredentials();

  if (!google.configured) {
    return NextResponse.json({
      status: 'DEGRADED',
      nervous_system: 'ONLINE_WITHOUT_GOOGLE_LOGGING',
      google_logging: {
        configured: false,
        required_env_present: google.reason,
      },
    });
  }

  try {
    const logging = new Logging({
      credentials: google.credentials,
      projectId: google.projectId,
    });

    const [entries] = await logging.getEntries({ pageSize: 10 });

    return NextResponse.json({
      status: 'HEALED',
      nervous_system: 'OPTIMAL',
      google_logging: {
        configured: true,
        projectId: google.projectId,
      },
      recent_synapses: entries.map((entry) => ({
        timestamp: entry.metadata.timestamp,
        event: entry.data,
      })),
    });
  } catch (error: any) {
    console.error('API Health Google Logging Error:', error);

    return NextResponse.json({
      status: 'DEGRADED',
      nervous_system: 'ONLINE_WITH_GOOGLE_LOGGING_ERROR',
      google_logging: {
        configured: true,
        projectId: google.projectId,
        error: error?.message || 'unknown Google logging error',
      },
    });
  }
}
