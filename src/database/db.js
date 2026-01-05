const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// caminho do banco
const dbPath = path.resolve(__dirname, "database.sqlite");

// conexão
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Erro ao conectar no banco", err);
  } else {
    console.log("Banco de dados conectado");
  }
});

// criar tabela de carros
db.run(`
  CREATE TABLE IF NOT EXISTS carros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    marca TEXT,
    modelo TEXT,
    ano INTEGER,
    preco REAL,
    imagem TEXT
  )
`);

module.exports = db;
