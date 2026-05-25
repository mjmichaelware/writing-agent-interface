const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.query("SELECT NOW()")
  .then(r => console.log("DB CONNECTED:", r.rows[0]))
  .catch(e => console.error("DB FAILED:", e))
  .finally(() => pool.end());
