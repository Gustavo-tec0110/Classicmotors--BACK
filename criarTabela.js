const db = require("./src/database/db.js");

db.serialize(() => {
  db.run("DROP TABLE IF EXISTS carros");

  db.run(`
    CREATE TABLE carros (
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
  `, (err) => {
    if (err) console.error("Erro ao criar tabela:", err.message);
    else console.log("Tabela carros criada com sucesso!");
  });
});

db.close();
