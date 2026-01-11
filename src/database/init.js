const db = require("./db");

async function init() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS carros (
      id SERIAL PRIMARY KEY,
      marca TEXT,
      modelo TEXT,
      ano INTEGER,
      preco NUMERIC,
      precoantigo NUMERIC,
      emoferta BOOLEAN,
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
      aceitatroca TEXT,
      imagens JSONB
    );
  `);

  console.log("✅ Tabela carros criada no Postgres");
  process.exit(0);
}

init().catch(err => {
  console.error("❌ Erro ao criar tabela:", err);
  process.exit(1);
});
