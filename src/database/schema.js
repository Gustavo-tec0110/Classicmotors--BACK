const db = require("./db");

async function ensureDatabaseSchema() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      avatar TEXT,
      google_id TEXT,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS carros (
      id SERIAL PRIMARY KEY,
      stable_id TEXT,
      marca TEXT,
      modelo TEXT,
      ano INTEGER,
      preco NUMERIC,
      precoantigo NUMERIC,
      emoferta BOOLEAN NOT NULL DEFAULT FALSE,
      badge TEXT,
      secao TEXT,
      prioridade INTEGER,
      imagem TEXT,
      descricao TEXT,
      descricaocurta TEXT,
      km INTEGER,
      combustivel TEXT,
      finalplaca TEXT,
      cambio TEXT,
      cor TEXT,
      cidade TEXT,
      aceitatroca BOOLEAN NOT NULL DEFAULT FALSE,
      imagens JSONB NOT NULL DEFAULT '[]'::jsonb
    );
  `);

  await db.query("ALTER TABLE carros ADD COLUMN IF NOT EXISTS stable_id TEXT");
  await db.query(
    "CREATE UNIQUE INDEX IF NOT EXISTS carros_stable_id_unique_full ON carros (stable_id)",
  );
  await db.query(
    "CREATE INDEX IF NOT EXISTS carros_secao_idx ON carros (secao)",
  );
  await db.query(
    "CREATE INDEX IF NOT EXISTS carros_preco_idx ON carros (preco)",
  );
}

module.exports = { ensureDatabaseSchema };
