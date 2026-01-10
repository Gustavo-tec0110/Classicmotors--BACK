const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

// Railway só permite escrita segura em /tmp
const dbDir = "/tmp";
const dbPath = path.join(dbDir, "database.sqlite");

// garante que o diretório existe
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Erro ao conectar no banco:", err.message);
  } else {
    console.log("✅ Banco conectado em", dbPath);
  }
});

// cria tabela se não existir
db.run(`
  CREATE TABLE IF NOT EXISTS carros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    marca TEXT,
    modelo TEXT,
    ano INTEGER,
    preco REAL,
    precoAntigo REAL,
    emOferta INTEGER,
    badge TEXT,
    secao TEXT,
    prioridade INTEGER,
    imagem TEXT,
    descricao TEXT,
    descricaoCurta TEXT,
    km INTEGER,
    combustivel TEXT,
    finalPlaca TEXT,
    cambio TEXT,
    cor TEXT,
    cidade TEXT,
    aceitaTroca TEXT,
    imagens TEXT
  )
`);

module.exports = db;
