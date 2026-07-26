const express = require("express");
const router = express.Router();

const db = require("../database/db");
const upload = require("../config/multer");
const {
  deleteManagedImages,
  uploadBuffer
} = require("../services/uploadToCloudinary");

const auth = require("../middlewares/auth");
const onlyAdmin = require("../middlewares/onlyadmin");

function normalizeImages(value) {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// ==========================
// LISTAR CARROS (PÚBLICO)
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
        emoferta         AS "emPromocao",
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
// CRIAR CARRO (ADMIN)
// =========================
router.post(
  "/",
  auth,
  onlyAdmin,
  upload.array("imagens"),
  async (req, res) => {
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
        aceitatroca,
        badge,
        prioridade
      } = req.body;

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
          emoferta,
          km,
          combustivel,
          cambio,
          cor,
          cidade,
          descricao,
          descricaocurta,
          aceitatroca,
          badge,
          prioridade,
          imagens
        )
        VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
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
        badge,
        prioridade ? Number(prioridade) : null,
        JSON.stringify(imagens)
      ];

      const result = await db.query(query, values);
      res.status(201).json(result.rows[0]);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao criar carro" });
    }
  }
);

// ==========================
// ATUALIZAR CARRO (ADMIN)
// =========================
router.put(
  "/:id",
  auth,
  onlyAdmin,
  upload.array("imagens"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const existingResult = await db.query(
        "SELECT imagens FROM carros WHERE id=$1",
        [id]
      );

      if (existingResult.rowCount === 0) {
        return res.status(404).json({ error: "Carro não encontrado" });
      }

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
        aceitatroca,
        badge,
        prioridade
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
          emoferta=$6,
          km=$7,
          combustivel=$8,
          cambio=$9,
          cor=$10,
          cidade=$11,
          descricao=$12,
          descricaocurta=$13,
          aceitatroca=$14,
          badge=$15,
          prioridade=$16,
          imagens = COALESCE($17, imagens)
        WHERE id=$18
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
        badge,
        prioridade ? Number(prioridade) : null,
        novasImagens ? JSON.stringify(novasImagens) : null,
        id
      ];

      const result = await db.query(query, values);

      if (novasImagens) {
        await deleteManagedImages(
          normalizeImages(existingResult.rows[0].imagens)
        );
      }

      res.json(result.rows[0]);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao atualizar carro" });
    }
  }
);

// ==========================
// REMOVER CARRO (ADMIN)
// =========================
router.delete(
  "/:id",
  auth,
  onlyAdmin,
  async (req, res) => {
    try {
      const existingResult = await db.query(
        "SELECT imagens FROM carros WHERE id=$1",
        [req.params.id]
      );

      if (existingResult.rowCount === 0) {
        return res.status(404).json({ error: "Carro não encontrado" });
      }

      await db.query("DELETE FROM carros WHERE id=$1", [req.params.id]);
      const cleanup = await deleteManagedImages(
        normalizeImages(existingResult.rows[0].imagens)
      );

      res.json({
        message: "Carro removido",
        imagensRemovidas: cleanup.removed
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao remover carro" });
    }
  }
);

module.exports = router;
