import { VertexAI } from '@google-cloud/vertexai';

function getVertexAI() {
  const project = process.env.GOOGLE_CLOUD_PROJECT;
  const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
  const email = process.env.GOOGLE_CLIENT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!project) return null;

  return new VertexAI({
    project,
    location,
    googleAuthOptions:
      email && key
        ? {
            credentials: {
              client_email: email,
              private_key: key,
            },
          }
        : undefined,
  });
}

export async function embedText(text: string): Promise<number[]> {
  const vertexAI = getVertexAI();

  if (!vertexAI) {
    throw new Error('Vertex AI not configured');
  }

  const model = vertexAI.getGenerativeModel({ model: 'text-embedding-005' });
  const response = await model.embedContent(text);
  const values = (response.embedding?.values ?? []).map((value) => Number(value));

  if (values.length === 1536) {
    return values;
  }

  if (values.length > 1536) {
    return values.slice(0, 1536);
  }

  return [...values, ...Array.from({ length: 1536 - values.length }, () => 0)];
}
