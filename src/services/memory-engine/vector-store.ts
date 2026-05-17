import { Pool } from "pg";

export class VectorStore {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
  }

  async initializeSchema() {
    await this.pool.query(`
      CREATE EXTENSION IF NOT EXISTS vector;
      CREATE EXTENSION IF NOT EXISTS pgcrypto;

      CREATE TABLE IF NOT EXISTS chapters (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        manifest_id TEXT UNIQUE,
        thematic_embedding vector(1536),
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS paragraphs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
        chunk_index INT,
        content TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_paragraphs_chapter_chunk
      ON paragraphs(chapter_id, chunk_index);
    `);
  }

  async insertChapter(
    manifestId: string,
    embedding: number[]
  ): Promise<string> {
    const res = await this.pool.query(
      `INSERT INTO chapters (manifest_id, thematic_embedding)
       VALUES ($1, $2)
       ON CONFLICT (manifest_id)
       DO UPDATE SET thematic_embedding = EXCLUDED.thematic_embedding
       RETURNING id`,
      [manifestId, embedding]
    );

    return res.rows[0].id;
  }

  async clearParagraphs(chapterId: string) {
    await this.pool.query(
      `DELETE FROM paragraphs
       WHERE chapter_id = $1`,
      [chapterId]
    );
  }

  async insertParagraph(
    chapterId: string,
    chunkIndex: number,
    content: string
  ) {
    await this.pool.query(
      `INSERT INTO paragraphs (
         chapter_id,
         chunk_index,
         content
       )
       VALUES ($1, $2, $3)`,
      [chapterId, chunkIndex, content]
    );
  }

  async getChapterByManifestId(
    manifestId: string
  ): Promise<string | null> {
    const res = await this.pool.query(
      `SELECT id
       FROM chapters
       WHERE manifest_id = $1
       LIMIT 1`,
      [manifestId]
    );

    return res.rows[0]?.id || null;
  }

  async searchTopChapter(
    embedding: number[]
  ): Promise<string | null> {
    const res = await this.pool.query(
      `SELECT id
       FROM chapters
       ORDER BY thematic_embedding <=> $1
       LIMIT 1`,
      [embedding]
    );

    return res.rows[0]?.id || null;
  }

  async getParagraphsByChapter(
    chapterId: string
  ): Promise<string[]> {
    const res = await this.pool.query(
      `SELECT content
       FROM paragraphs
       WHERE chapter_id = $1
       ORDER BY chunk_index ASC`,
      [chapterId]
    );

    return res.rows.map((r) => r.content);
  }
}
