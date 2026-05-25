import { Pool } from "pg";

export class VectorStore {
  private pool: Pool | null = null;

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (connectionString) {
      this.pool = new Pool({
        connectionString,
        ssl: { rejectUnauthorized: false },
        max: 5,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
      });
    }
  }

  private async query(text: string, params?: any[]) {
    if (!this.pool) {
      throw new Error("Postgres connection string not configured (DATABASE_URL)");
    }
    return this.pool.query(text, params);
  }

  async initializeSchema() {
    await this.query(`
      CREATE EXTENSION IF NOT EXISTS vector;
      CREATE EXTENSION IF NOT EXISTS pgcrypto;

      CREATE TABLE IF NOT EXISTS chapters (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        manifest_id TEXT UNIQUE,
        part_number TEXT,
        chapter_number INT,
        status TEXT,
        thematic_embedding vector(1536),
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS paragraphs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
        chunk_index INT,
        content TEXT,
        embedding vector(1536),
        archetypal_weights JSONB DEFAULT '{}',
        dualism_map JSONB DEFAULT '{}',
        hebrew_spans JSONB DEFAULT '[]',
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS biblical_references (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        paragraph_id UUID REFERENCES paragraphs(id) ON DELETE CASCADE,
        reference_text TEXT,
        book TEXT,
        chapter INT,
        verse INT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_paragraphs_chapter_chunk
      ON paragraphs(chapter_id, chunk_index);
    `);
  }

  async insertChapter(manifestId: string, embedding: number[]): Promise<string> {
    const res = await this.query(
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
    await this.query(
      `DELETE FROM paragraphs
       WHERE chapter_id = $1`,
      [chapterId]
    );
  }

  async insertParagraph(chapterId: string, chunkIndex: number, content: string) {
    await this.query(
      `INSERT INTO paragraphs (
         chapter_id,
         chunk_index,
         content
       )
       VALUES ($1, $2, $3)`,
      [chapterId, chunkIndex, content]
    );
  }

  async getChapterByManifestId(manifestId: string): Promise<string | null> {
    const res = await this.query(
      `SELECT id
       FROM chapters
       WHERE manifest_id = $1
       LIMIT 1`,
      [manifestId]
    );

    return res.rows[0]?.id || null;
  }

  async searchTopChapter(embedding: number[]): Promise<string | null> {
    const res = await this.query(
      `SELECT id
       FROM chapters
       ORDER BY thematic_embedding <=> $1
       LIMIT 1`,
      [embedding]
    );

    return res.rows[0]?.id || null;
  }

  async getParagraphsByChapter(chapterId: string): Promise<string[]> {
    const res = await this.query(
      `SELECT content
       FROM paragraphs
       WHERE chapter_id = $1
       ORDER BY chunk_index ASC`,
      [chapterId]
    );

    return res.rows.map((r) => String(r.content || ""));
  }

  async searchParagraphs(query: string): Promise<{
    ref: string;
    title: string;
    note: string;
    content: string;
    para_index: number;
  }[]> {
    const res = await this.query(
      `SELECT
         p.content,
         p.chunk_index,
         c.manifest_id
       FROM paragraphs p
       JOIN chapters c
         ON p.chapter_id = c.id
       WHERE p.content ILIKE $1
       ORDER BY
         c.manifest_id ASC,
         p.chunk_index ASC
       LIMIT 40`,
      [`%${query}%`]
    );

    return res.rows.map((r) => ({
      ref: String(r.manifest_id || "Unknown"),
      title: String(r.content || "").slice(0, 64),
      note: String(r.content || ""),
      content: String(r.content || ""),
      para_index: Number(r.chunk_index ?? 0),
    }));
  }

  async getDualismNodes(): Promise<{
    id: string;
    term: string;
    parallel: string;
    note: string;
    chapters: string;
    para_index: number;
  }[]> {
    const res = await this.query(
      `SELECT
         p.chunk_index,
         p.content,
         c.manifest_id
       FROM paragraphs p
       JOIN chapters c
         ON p.chapter_id = c.id
       WHERE p.content IS NOT NULL
       ORDER BY
         c.manifest_id ASC,
         p.chunk_index ASC
       LIMIT 60`
    );

    return res.rows.map((r, index) => ({
      id: `${r.manifest_id || "chapter"}-${r.chunk_index ?? index}`,
      term: String(r.content || "").slice(0, 42),
      parallel: "Semantic resonance pending",
      note: String(r.content || "").slice(0, 180),
      chapters: String(r.manifest_id || "Unknown"),
      para_index: Number(r.chunk_index ?? 0),
    }));
  }
}

