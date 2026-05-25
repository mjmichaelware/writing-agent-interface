import { VertexAI } from '@google-cloud/vertexai';

function getVertexAI() {
  const project = process.env.GOOGLE_CLOUD_PROJECT;
  const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
  if (!project) return null;
  return new VertexAI({ project, location });
}

// System 9: Document Analyzer - Parser (using Gemini 1.5 for multimodal OCR)
export async function parseDocument(fileBase64: string, mimeType: string) {
  const vertexAI = getVertexAI();
  if (!vertexAI) {
    throw new Error("Google Cloud Project not configured for Vertex AI");
  }

  const model = vertexAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
  const result = await model.generateContent([
    {
      inlineData: {
        data: fileBase64,
        mimeType: mimeType
      }
    },
    'Extract all text from this document as accurately as possible, preserving layout where significant.'
  ]);

  const response = await result.response;
  return response.text();
}