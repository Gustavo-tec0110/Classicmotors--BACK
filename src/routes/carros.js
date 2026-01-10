const express = require("express");
const router = express.Router();
const db = require("../database/db");
const upload = require("src/config/multer.js"); // 👈 MULTER

// ==========================
// LISTAR TODOS OS CARROS
// ==========================
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

// ==========================
// CRIAR NOVO CARRO (COM IMAGENS)
// ==========================
router.post("/", upload.array("imagens", 10), (req, res) => {
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

  // transforma arquivos em URLs públicas
  const imagens = req.files
    ? JSON.stringify(req.files.map(file => `/imagens/${file.filename}`))
    : JSON.stringify([]);

  const query = `
    INSERT INTO carros
    (marca, modelo, ano, preco, imagens, km, combustivel, cambio, cor, cidade, descricao)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [marca, modelo, ano, preco, imagens, km, combustivel, cambio, cor, cidade, descricao],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      res.status(201).json({
        id: this.lastID,
        marca,
        modelo,
        ano,
        preco,
        imagens: JSON.parse(imagens)
      });
    }
  );
});

// ==========================
// ATUALIZAR CARRO 
// ==========================
router.put("/:id", upload.array("imagens", 10), (req, res) => {
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

  let imagens = req.body.imagens;

  // se novas imagens forem enviadas, substitui
  if (req.files && req.files.length > 0) {
    imagens = JSON.stringify(req.files.map(file => `/imagens/${file.filename}`));
  }

  const query = `
    UPDATE carros
    SET marca=?, modelo=?, ano=?, preco=?, imagens=?, km=?, combustivel=?, cambio=?, cor=?, cidade=?, descricao=?
    WHERE id=?
  `;

  db.run(
    query,
    [marca, modelo, ano, preco, imagens, km, combustivel, cambio, cor, cidade, descricao, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      res.json({ message: "Carro atualizado com sucesso" });
    }
  );
});

// ==========================
// DELETAR CARRO
// ==========================
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM carros WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    res.json({ message: "Carro removido com sucesso" });
  });
});

module.exports = router;
