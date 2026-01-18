const express = require("express");
const router = express.Router();
const db = require("../database/db");
const upload = require("../config/multer");
const { uploadBuffer } = require("../services/uploadToCloudinary");

// ==========================
// LISTAR CARROS
// =========================
router.get("/", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        id,
        marca,
        modelo,
        ano,
        preco,
        precoantigo      AS "precoAntigo",
        emPromocao        AS "emPromocao",
        badge,
        secao,
        prioridade,
        imagem,
        descricao,
        descricaocurta   AS "descricaoCurta",
        km,
        combustivel,
        finalplaca       AS "finalPlaca",
        cambio,
        cor,
        cidade,
        aceitatroca      AS "aceitaTroca",
        imagens
      FROM carros
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar carros" });
  }
});

// ==========================
// CRIAR CARRO
// =========================
router.post("/", upload.array("imagens"), async (req, res) => {
  try {
    const {
      marca,
      modelo,
      ano,
      preco,
      precoAntigo,
      emPromocao,
      km,
      combustivel,
      cambio,
      cor,
      cidade,
      descricao,
      descricaocurta,
      aceitatroca
    } = req.body;

    // Upload imagens (Cloudinary)
    let imagens = [];
    if (req.files && req.files.length > 0) {
      imagens = await Promise.all(
        req.files.map(file =>
          uploadBuffer(file.buffer, file.originalname)
        )
      );
    }

    const query = `
      INSERT INTO carros
      (
        marca,
        modelo,
        ano,
        preco,
        precoantigo,
        emPromocao,
        km,
        combustivel,
        cambio,
        cor,
        cidade,
        descricao,
        descricaocurta,
        aceitatroca,
        imagens
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
      RETURNING *
    `;

    const values = [
      marca,
      modelo,
      ano,
      preco,
      precoAntigo || null,
      emPromocao === "true",
      km,
      combustivel,
      cambio,
      cor,
      cidade,
      descricao,
      descricaocurta,
      aceitatroca === "true",
      JSON.stringify(imagens)
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
// =========================
router.put("/:id", upload.array("imagens"), async (req, res) => {
  try {
    const { id } = req.params;

    const {
      marca,
      modelo,
      ano,
      preco,
      precoAntigo,
      emPromocao,
      km,
      combustivel,
      cambio,
      cor,
      cidade,
      descricao,
      descricaocurta,
      aceitatroca
    } = req.body;

    let novasImagens = null;
    if (req.files && req.files.length > 0) {
      novasImagens = await Promise.all(
        req.files.map(file =>
          uploadBuffer(file.buffer, file.originalname)
        )
      );
    }

    const query = `
      UPDATE carros SET
        marca=$1,
        modelo=$2,
        ano=$3,
        preco=$4,
        precoantigo=$5,
        emPromocao=$6,
        km=$7,
        combustivel=$8,
        cambio=$9,
        cor=$10,
        cidade=$11,
        descricao=$12,
        descricaocurta=$13,
        aceitatroca=$14,
        imagens = COALESCE($15, imagens)
      WHERE id=$16
      RETURNING *
    `;

    const values = [
      marca,
      modelo,
      ano,
      preco,
      precoAntigo || null,
      emPromocao === "true",
      km,
      combustivel,
      cambio,
      cor,
      cidade,
      descricao,
      descricaocurta,
      aceitatroca === "true",
      novasImagens ? JSON.stringify(novasImagens) : null,
      id
    ];

    const result = await db.query(query, values);
    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar carro" });
  }
});

// ==========================
// DELETE
// =========================
router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM carros WHERE id=$1", [req.params.id]);
    res.json({ message: "Carro removido" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao remover carro" });
  }
});

module.exports = router;
