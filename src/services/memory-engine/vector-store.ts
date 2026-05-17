import { Pool } from "pg";

export class VectorStore {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
  }

  async insertDocument(
    file_name: string,
    chunk_index: number,
    content: string,
    embedding: number[]
  ) {
    await this.pool.query(
      `INSERT INTO documents (file_name, chunk_index, content, embedding)
       VALUES ($1, $2, $3, $4)`,
      [file_name, chunk_index, content, embedding]
    );
  }

  async search(embedding: number[], limit = 5) {
    const res = await this.pool.query(
      `SELECT file_name, chunk_index, content,
      1 - (embedding <=> $1) AS similarity
      FROM documents
      ORDER BY embedding <=> $1
      LIMIT $2`,
      [embedding, limit]
    );

    return res.rows;
  }
}
