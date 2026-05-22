import { BigQuery } from '@google-cloud/bigquery';
import { Storage } from '@google-cloud/storage';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { VertexAI } from '@google-cloud/vertexai';

/**
 * Feature 190: Google Cloud Swarm Infusion
 * This class orchestrates the entire suite of Google APIs
 * enabled for the project.
 */
export class GoogleSwarm {
  private static getCredentials() {
    return {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };
  }

  private static projectId = process.env.GOOGLE_CLOUD_PROJECT;

  static getBigQuery() {
    return new BigQuery({ credentials: this.getCredentials(), projectId: this.projectId });
  }

  static getStorage() {
    return new Storage({ credentials: this.getCredentials(), projectId: this.projectId });
  }

  static getSecrets() {
    return new SecretManagerServiceClient({ credentials: this.getCredentials(), projectId: this.projectId });
  }

  static getTTS() {
    return new TextToSpeechClient({ credentials: this.getCredentials(), projectId: this.projectId });
  }

  static getVertexAI() {
    return new VertexAI({ project: this.projectId!, location: 'us-central1' });
  }

  static async getSecret(name: string) {
    const client = this.getSecrets();
    const [version] = await client.accessSecretVersion({
      name: `projects/${this.projectId}/secrets/${name}/versions/latest`,
    });
    return version.payload?.data?.toString();
  }

  // Feature 195: System Integrity Monitoring
  static async logIntegrity(event: string, metadata: any) {
    const bq = this.getBigQuery();
    try {
      await bq.dataset('narrative_os').table('integrity_logs').insert([{
        event,
        metadata: JSON.stringify(metadata),
        timestamp: new Date().toISOString()
      }]);
    } catch (e) {
      console.warn("Integrity logging failed:", e.message);
    }
  }

  static async mirrorChapter(chapter: any) {
    const bq = this.getBigQuery();
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
      console.warn("Chapter mirroring failed:", e.message);
    }
  }

  static async mirrorParagraph(para: any) {
    const bq = this.getBigQuery();
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
      console.warn("Paragraph mirroring failed:", e.message);
    }
  }
}
