const express = require("express");
const router = express.Router();
const db = require("../database/db");

// LISTAR TODOS OS CARROS
router.get("/", (req, res) => {
  const { marca } = req.query;

  let query = "SELECT * FROM carros";
  let params = [];

  if (marca) {
    query += " WHERE marca = ?";
    params.push(marca);
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// CRIAR NOVO CARRO
router.post("/", (req, res) => {
  const {
    marca,
    modelo,
    ano,
    preco,
    imagem,
    km,
    combustivel,
    cambio,
    cor,
    cidade,
    descricao
  } = req.body;

  const query = `
    INSERT INTO carros
      (marca, modelo, ano, preco, imagem, km, combustivel, cambio, cor, cidade, descricao)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [marca, modelo, ano, preco, imagem, km, combustivel, cambio, cor, cidade, descricao],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      res.status(201).json({
        id: this.lastID,
        marca,
        modelo,
        ano,
        preco,
        imagem,
        km,
        combustivel,
        cambio,
        cor,
        cidade,
        descricao
      });
    }
  );
});

// ATUALIZAR CARRO
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const {
    marca,
    modelo,
    ano,
    preco,
    imagem,
    km,
    combustivel,
    cambio,
    cor,
    cidade,
    descricao
  } = req.body;

  const query = `
    UPDATE carros
    SET marca=?, modelo=?, ano=?, preco=?, imagem=?, km=?, combustivel=?, cambio=?, cor=?, cidade=?, descricao=?
    WHERE id=?
  `;

  db.run(
    query,
    [marca, modelo, ano, preco, imagem, km, combustivel, cambio, cor, cidade, descricao, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      res.json({ message: "Carro atualizado com sucesso" });
    }
  );
});

// DELETAR CARRO
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM carros WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    res.json({ message: "Carro removido com sucesso" });
  });
});

module.exports = router;
