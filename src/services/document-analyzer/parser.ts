import { VertexAI } from '@google-cloud/vertexai';

const project = process.env.GOOGLE_CLOUD_PROJECT || 'weight-of-the-sky';
const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
const vertexAI = new VertexAI({ project, location });

// System 9: Document Analyzer - Parser (using Gemini 1.5 for multimodal OCR)
export async function parseDocument(fileBase64: string, mimeType: string) {
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