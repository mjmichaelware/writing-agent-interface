import { promises as fs } from 'fs';
import path from 'path';
import { google } from 'googleapis';

const DEFAULT_SYNC_DIR = path.join(
  process.cwd(),
  'docs/agent_context/source_drop/gdrive_raw_manuscript_staging/gdrive_raw'
);

function requireDriveClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Google Drive OAuth credentials are not configured');
  }

  const auth = new google.auth.OAuth2(clientId, clientSecret, redirectUri || undefined);
  auth.setCredentials({ refresh_token: refreshToken });

  return google.drive({ version: 'v3', auth });
}

async function streamToText(data: any): Promise<string> {
  if (typeof data === 'string') return data;
  if (Buffer.isBuffer(data)) return data.toString('utf8');

  if (data && typeof data[Symbol.asyncIterator] === 'function') {
    const chunks: Buffer[] = [];
    for await (const chunk of data as AsyncIterable<Buffer | string>) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks).toString('utf8');
  }

  if (data && typeof data.on === 'function') {
    return await new Promise<string>((resolve, reject) => {
      const chunks: Buffer[] = [];
      data.on('data', (chunk: Buffer | string) => {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      });
      data.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      data.on('error', reject);
    });
  }

  return String(data ?? '');
}

async function downloadDriveText(
  drive: ReturnType<typeof google.drive>,
  fileId: string,
  mimeType?: string | null
): Promise<string> {
  if (mimeType === 'application/vnd.google-apps.document') {
    const exported = await drive.files.export(
      { fileId, mimeType: 'text/plain' },
      { responseType: 'stream' }
    );
    return streamToText(exported.data);
  }

  const media = await drive.files.get(
    { fileId, alt: 'media', supportsAllDrives: true },
    { responseType: 'stream' }
  );
  return streamToText(media.data);
}

export function createDriveClient() {
  return requireDriveClient();
}

export async function getDriveFileMetadata(fileId: string) {
  const drive = requireDriveClient();
  const response = await drive.files.get({
    fileId,
    fields: 'id, name, mimeType',
    supportsAllDrives: true,
  });

  const file = response.data;
  if (!file?.id) {
    throw new Error('Drive file not found or not accessible');
  }

  return {
    id: String(file.id),
    name: String(file.name ?? file.id),
    mimeType: String(file.mimeType ?? ''),
  };
}

export async function fetchDriveFileText(fileId: string) {
  const metadata = await getDriveFileMetadata(fileId);
  const drive = requireDriveClient();
  const text = await downloadDriveText(drive, fileId, metadata.mimeType);

  return {
    ...metadata,
    text,
  };
}

export async function syncDriveFolder(): Promise<{
  synced: string[];
  errors: string[];
}> {
  const folderId = process.env.GDRIVE_MANUSCRIPT_FOLDER_ID;
  if (!folderId) {
    return {
      synced: [],
      errors: ['GDRIVE_MANUSCRIPT_FOLDER_ID not configured'],
    };
  }

  const drive = requireDriveClient();
  const response = await drive.files.list({
    q: `'${folderId}' in parents and trashed=false`,
    fields: 'files(id, name, mimeType, modifiedTime)',
    pageSize: 1000,
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });

  const files = response.data.files ?? [];
  const synced: string[] = [];
  const errors: string[] = [];

  await fs.mkdir(DEFAULT_SYNC_DIR, { recursive: true });

  for (const file of files) {
    const fileId = file.id ?? '';
    const fileName = String(file.name ?? fileId ?? 'untitled');

    if (!fileId) {
      errors.push(`${fileName}: missing file id`);
      continue;
    }

    try {
      const text = await downloadDriveText(drive, fileId, file.mimeType ?? null);
      const safeName = fileName.replace(/[\\/]/g, '_');
      await fs.writeFile(path.join(DEFAULT_SYNC_DIR, safeName), text, 'utf8');
      synced.push(fileName);
    } catch (error: any) {
      errors.push(`${fileName}: ${error?.message ?? String(error)}`);
    }
  }

  return { synced, errors };
}
