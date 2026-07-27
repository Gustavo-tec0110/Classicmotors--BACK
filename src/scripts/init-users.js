require("dotenv").config();
const db = require("../database/db");

async function init() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT,
      avatar TEXT,
      google_id TEXT,
      role TEXT DEFAULT 'user',
      created_at TIMESTAMP DEFAULT now()
    );
  `);

  console.log("✅ Tabela users criada");
  process.exit(0);
}

init().catch((err) => {
  console.error("❌ Erro:", err);
  process.exit(1);
});
