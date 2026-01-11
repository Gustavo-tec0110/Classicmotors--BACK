const express = require("express");
const router = express.Router();
const db = require("../database/db");
const upload = require("../config/multer");

// ==========================
// LISTAR CARROS
// ==========================
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM carros ORDER BY id DESC");

    const carros = result.rows.map(carro => ({
      ...carro,
      imagem: carro.imagem || null
    }));

    res.json(carros);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao listar carros" });
  }
});

// ==========================
// CRIAR CARRO
// ==========================
router.post("/", upload.single("imagem"), async (req, res) => {
  try {
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
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *
    `;

    const values = [
      marca,
      modelo,
      ano || null,
      preco || null,
      imagem,
      km || null,
      combustivel || null,
      cambio || null,
      cor || null,
      cidade || null,
      descricao || null
    ];

    const result = await db.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar carro" });
  }
});

// ==========================
// ATUALIZAR CARRO
// ==========================
router.put("/:id", upload.single("imagem"), async (req, res) => {
  try {
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
      SET marca=$1, modelo=$2, ano=$3, preco=$4, imagem=$5,
          km=$6, combustivel=$7, cambio=$8, cor=$9, cidade=$10, descricao=$11
      WHERE id=$12
    `;

    const values = [
      marca,
      modelo,
      ano || null,
      preco || null,
      imagem,
      km || null,
      combustivel || null,
      cambio || null,
      cor || null,
      cidade || null,
      descricao || null,
      id
    ];

    await db.query(query, values);

    res.json({ message: "Carro atualizado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar carro" });
  }
});

// ==========================
// DELETE
// ==========================
router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM carros WHERE id = $1", [req.params.id]);
    res.json({ message: "Carro removido" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao remover carro" });
  }
});

module.exports = router;
