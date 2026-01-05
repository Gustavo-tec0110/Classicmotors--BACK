const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "database.sqlite");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Erro ao conectar no banco", err);
  } else {
    console.log("Banco de dados conectado");
  }
});

db.run(`
  CREATE TABLE IF NOT EXISTS carros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    marca TEXT,
    modelo TEXT,
    ano INTEGER,
    preco REAL,
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
