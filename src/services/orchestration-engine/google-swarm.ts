import { BigQuery } from '@google-cloud/bigquery';
import { Storage } from '@google-cloud/storage';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { VertexAI } from '@google-cloud/vertexai';
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Feature 190: Google Cloud Swarm Infusion
 * This class orchestrates the entire suite of Google APIs
 * enabled for the project.
 */
export class GoogleSwarm {
  private static getCredentials() {
    const email = process.env.GOOGLE_CLIENT_EMAIL;
    const key = process.env.GOOGLE_PRIVATE_KEY;
    if (!email || !key) return null;
    return {
      client_email: email,
      private_key: key.replace(/\\n/g, '\n'),
    };
  }

  static getBigQuery() {
    const creds = this.getCredentials();
    if (!creds) return null;
    return new BigQuery({ credentials: creds, projectId: "the-weight-of-the-sky" });
  }

  static getStorage() {
    const creds = this.getCredentials();
    if (!creds) return null;
    return new Storage({ credentials: creds, projectId: "the-weight-of-the-sky" });
  }

  static getSecrets() {
    const creds = this.getCredentials();
    if (!creds) return null;
    return new SecretManagerServiceClient({ credentials: creds, projectId: "the-weight-of-the-sky" });
  }

  static getTTS() {
    const creds = this.getCredentials();
    if (!creds) return null;
    return new TextToSpeechClient({ credentials: creds, projectId: "the-weight-of-the-sky" });
  }

  static getVertexAI() {
    const creds = this.getCredentials();
    if (!creds) return null;
    return new VertexAI({ 
      project: "the-weight-of-the-sky",
      location: 'us-central1',
      googleAuthOptions: {
        credentials: creds
      }
    });
  }

  static getGoogleAI() {
    const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!key) return null;
    return new GoogleGenerativeAI(key);
  }

  static async getSecret(name: string) {
    const client = this.getSecrets();
    if (!client) return null;
    const [version] = await client.accessSecretVersion({
      name: `projects/the-weight-of-the-sky/secrets/${name}/versions/latest`,
    });
    return version.payload?.data?.toString();
  }

  // Feature 195: System Integrity Monitoring
  static async logIntegrity(event: string, metadata: any) {
    const bq = this.getBigQuery();
    if (!bq) return;
    try {
      await bq.dataset('narrative_os').table('integrity_logs').insert([{
        event,
        metadata: JSON.stringify(metadata),
        timestamp: new Date().toISOString()
      }]);
    } catch (e) {
      // Silently fail if BigQuery is not ready
    }
  }

  static async mirrorChapter(chapter: any) {
    const bq = this.getBigQuery();
    if (!bq) return;
    try {
      await bq.dataset('narrative_os').table('chapters').insert([{
        id: chapter.id,
        manifest_id: chapter.manifest_id,
        part_number: chapter.part_number,
        chapter_number: chapter.chapter_number,
        status: chapter.status,
        created_at: new Date().toISOString()
      }]);
    } catch (e) {
      // Silent
    }
  }

  static async mirrorParagraph(para: any) {
    const bq = this.getBigQuery();
    if (!bq) return;
    try {
      await bq.dataset('narrative_os').table('paragraphs').insert([{
        id: para.id,
        chapter_id: para.chapter_id,
        chapter_number: para.chapter_number,
        part_number: para.part_number,
        chunk_index: para.chunk_index,
        content: para.content,
        archetypal_weights: JSON.stringify(para.archetypal_weights),
        dualism_map: JSON.stringify(para.dualism_map),
        created_at: new Date().toISOString()
      }]);
    } catch (e) {
      // Silent
    }
  }
}
