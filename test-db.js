const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    const res = await pool.query('SELECT count(*) FROM paragraphs');
    console.log("Paragraphs:", res.rows[0].count);
    const res2 = await pool.query('SELECT count(*) FROM biblical_references');
    console.log("Bib Refs:", res2.rows[0].count);
    const res3 = await pool.query('SELECT count(*) FROM hyperlinks');
    console.log("Hyperlinks:", res3.rows[0].count);
  } catch(e) {
    console.error(e.message);
  } finally {
    pool.end();
  }
}
run();
