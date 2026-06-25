import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  if (!apiKey) {
    return NextResponse.json({ files: [] });
  }

  try {
    const query = folderId
      ? `'${folderId}' in parents and trashed = false`
      : "mimeType != 'application/vnd.google-apps.folder' and trashed = false";

    const url = new URL('https://www.googleapis.com/drive/v3/files');
    url.searchParams.set('key', apiKey);
    url.searchParams.set('q', query);
    url.searchParams.set('fields', 'files(id,name,mimeType,modifiedTime)');
    url.searchParams.set('orderBy', 'name');
    url.searchParams.set('pageSize', '100');

    const res = await fetch(url.toString());
    if (!res.ok) {
      return NextResponse.json({ files: [], error: `Drive API ${res.status}` });
    }

    const data = await res.json();
    return NextResponse.json({ files: data.files ?? [] });
  } catch (e: any) {
    return NextResponse.json({ files: [], error: e.message });
  }
}
