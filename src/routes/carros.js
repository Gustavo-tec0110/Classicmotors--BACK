const express = require("express");
const router = express.Router();
const db = require("../database/db");
const upload = require("../config/multer");

// ==========================
// LISTAR CARROS
// ==========================
router.get("/", (req, res) => {
  db.all("SELECT * FROM carros", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    // adapta para o front
    const carros = rows.map(carro => ({
      ...carro,
      imagem: carro.imagem || null
    }));

    res.json(carros);
  });
});

// ==========================
// CRIAR CARRO
// ==========================
router.post("/", upload.single("imagem"), (req, res) => {
  const {
    marca,
    modelo,
    ano,
    preco,
    km,
    combustivel,
    cambio,
    cor,
    cidade,
    descricao
  } = req.body;

  const imagem = req.file ? `/imagens/${req.file.filename}` : null;

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
        imagem
      });
    }
  );
});

// ==========================
// ATUALIZAR CARRO
// ==========================
router.put("/:id", upload.single("imagem"), (req, res) => {
  const { id } = req.params;

  const {
    marca,
    modelo,
    ano,
    preco,
    km,
    combustivel,
    cambio,
    cor,
    cidade,
    descricao
  } = req.body;

  const imagem = req.file ? `/imagens/${req.file.filename}` : null;

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

      res.json({ message: "Carro atualizado" });
    }
  );
});

// ==========================
// DELETE
// ==========================
router.delete("/:id", (req, res) => {
  db.run("DELETE FROM carros WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    res.json({ message: "Carro removido" });
  });
});

module.exports = router;
