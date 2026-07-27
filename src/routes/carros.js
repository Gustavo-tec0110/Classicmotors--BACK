const express = require("express");

const db = require("../database/db");
const upload = require("../config/multer");
const auth = require("../middlewares/auth");
const onlyAdmin = require("../middlewares/onlyadmin");
const {
  deleteManagedImages,
  uploadBuffer,
} = require("../services/uploadToCloudinary");
const { optionalInteger, optionalNumber } = require("../utils/numbers");
const { validateUploadedImages } = require("../utils/images");

const router = express.Router();
const VALID_CATEGORIES = new Set(["ofertas", "classicos", "modernos"]);

const CAR_SELECT = `
  SELECT
    id,
    stable_id          AS "stableId",
    marca,
    modelo,
    ano,
    preco,
    precoantigo        AS "precoAntigo",
    emoferta           AS "emPromocao",
    badge,
    secao,
    prioridade,
    imagem,
    descricao,
    descricaocurta     AS "descricaoCurta",
    km,
    combustivel,
    finalplaca         AS "finalPlaca",
    cambio,
    cor,
    cidade,
    aceitatroca        AS "aceitaTroca",
    imagens
  FROM carros
`;

function normalizeImages(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value !== "string") return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
}

function normalizeBoolean(value) {
  return value === true || value === "true" || value === "1";
}

function normalizeCategory(value, year) {
  const normalized = String(value || "")
    .trim()
    .toLowerCase();
  if (normalized) return VALID_CATEGORIES.has(normalized) ? normalized : null;
  return Number(year) <= 1999 ? "classicos" : "modernos";
}

function vehiclePayload(body) {
  const marca = body.marca?.trim();
  const modelo = body.modelo?.trim();
  const ano = optionalInteger(body.ano);
  const preco = optionalNumber(body.preco);
  const secao = normalizeCategory(body.secao, ano);

  return {
    marca,
    modelo,
    ano,
    preco,
    precoAntigo: optionalNumber(body.precoAntigo),
    emPromocao: normalizeBoolean(body.emPromocao),
    badge: body.badge?.trim() || null,
    secao,
    prioridade: optionalInteger(body.prioridade),
    descricao: body.descricao?.trim() || null,
    descricaoCurta:
      (body.descricaoCurta || body.descricaocurta)?.trim() || null,
    km: optionalInteger(body.km),
    combustivel: body.combustivel?.trim() || null,
    finalPlaca: (body.finalPlaca || body.finalplaca)?.trim() || null,
    cambio: body.cambio?.trim() || null,
    cor: body.cor?.trim() || null,
    cidade: body.cidade?.trim() || null,
    aceitaTroca: normalizeBoolean(body.aceitaTroca ?? body.aceitatroca),
  };
}

function validateVehicle(payload, rawCategory) {
  if (
    !payload.marca ||
    !payload.modelo ||
    !payload.preco ||
    payload.preco <= 0
  ) {
    return "Marca, modelo e preço maior que zero são obrigatórios.";
  }
  if (rawCategory && !payload.secao) {
    return "Categoria inválida. Use ofertas, classicos ou modernos.";
  }
  if (payload.ano !== null && (payload.ano < 1900 || payload.ano > 2100)) {
    return "Informe um ano válido.";
  }
  if (payload.km !== null && payload.km < 0) {
    return "A quilometragem não pode ser negativa.";
  }
  return null;
}

router.get("/categorias", async (_req, res) => {
  try {
    const result = await db.query(`
      SELECT categories.slug, categories.nome, COUNT(carros.id)::int AS quantidade
      FROM (
        VALUES
          ('ofertas', 'Ofertas do dia'),
          ('classicos', 'Clássicos brasileiros'),
          ('modernos', 'Novos e modernos')
      ) AS categories(slug, nome)
      LEFT JOIN carros ON carros.secao = categories.slug
      GROUP BY categories.slug, categories.nome
      ORDER BY CASE categories.slug
        WHEN 'ofertas' THEN 1
        WHEN 'classicos' THEN 2
        ELSE 3
      END
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar categorias." });
  }
});

router.get("/", async (req, res) => {
  try {
    const values = [];
    const conditions = [];
    const addValue = (value) => {
      values.push(value);
      return `$${values.length}`;
    };

    if (req.query.secao) {
      const secao = normalizeCategory(req.query.secao);
      if (!secao || !VALID_CATEGORIES.has(req.query.secao.toLowerCase())) {
        return res.status(400).json({ error: "Categoria inválida." });
      }
      conditions.push(`secao = ${addValue(secao)}`);
    }

    if (req.query.q?.trim()) {
      const term = `%${req.query.q.trim()}%`;
      const placeholder = addValue(term);
      conditions.push(`(
        marca ILIKE ${placeholder}
        OR modelo ILIKE ${placeholder}
        OR descricao ILIKE ${placeholder}
        OR cidade ILIKE ${placeholder}
      )`);
    }

    const minPrice = optionalNumber(req.query.precoMin);
    const maxPrice = optionalNumber(req.query.precoMax);
    if (minPrice !== null) conditions.push(`preco >= ${addValue(minPrice)}`);
    if (maxPrice !== null) conditions.push(`preco <= ${addValue(maxPrice)}`);

    const where = conditions.length ? ` WHERE ${conditions.join(" AND ")}` : "";
    const sortOptions = {
      price_asc: "preco ASC NULLS LAST, id ASC",
      price_desc: "preco DESC NULLS LAST, id ASC",
      year_desc: "ano DESC NULLS LAST, id ASC",
      priority: "prioridade DESC NULLS LAST, id ASC",
    };
    const orderBy = sortOptions[req.query.sort] || sortOptions.priority;
    const wantsPagination =
      req.query.page !== undefined || req.query.limit !== undefined;
    const page = Math.max(optionalInteger(req.query.page) || 1, 1);
    const limit = Math.min(
      Math.max(optionalInteger(req.query.limit) || 20, 1),
      50,
    );

    let paginationSql = "";
    if (wantsPagination) {
      paginationSql = ` LIMIT ${addValue(limit)} OFFSET ${addValue((page - 1) * limit)}`;
    }

    const result = await db.query(
      `${CAR_SELECT}${where} ORDER BY ${orderBy}${paginationSql}`,
      values,
    );

    if (!wantsPagination) return res.json(result.rows);

    const filterValueCount = values.length - 2;
    const countResult = await db.query(
      `SELECT COUNT(*)::int AS total FROM carros${where}`,
      values.slice(0, filterValueCount),
    );
    const total = countResult.rows[0].total;
    return res.json({
      carros: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar carros." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = optionalInteger(req.params.id);
    if (!id) return res.status(400).json({ error: "Identificador inválido." });

    const result = await db.query(`${CAR_SELECT} WHERE id = $1`, [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Carro não encontrado." });
    }
    return res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao buscar o carro." });
  }
});

router.post("/", auth, onlyAdmin, upload.array("imagens"), async (req, res) => {
  let uploadedImages = [];
  try {
    validateUploadedImages(req.files);
    const payload = vehiclePayload(req.body);
    const validationError = validateVehicle(payload, req.body.secao);
    if (validationError)
      return res.status(400).json({ error: validationError });

    uploadedImages = await Promise.all(
      (req.files || []).map((file) =>
        uploadBuffer(file.buffer, file.originalname),
      ),
    );

    const result = await db.query(
      `
        INSERT INTO carros (
          marca, modelo, ano, preco, precoantigo, emoferta, badge, secao,
          prioridade, imagem, descricao, descricaocurta, km, combustivel,
          finalplaca, cambio, cor, cidade, aceitatroca, imagens
        )
        VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20
        )
        RETURNING id
      `,
      [
        payload.marca,
        payload.modelo,
        payload.ano,
        payload.preco,
        payload.precoAntigo,
        payload.emPromocao,
        payload.badge,
        payload.secao,
        payload.prioridade,
        uploadedImages[0] || null,
        payload.descricao,
        payload.descricaoCurta,
        payload.km,
        payload.combustivel,
        payload.finalPlaca,
        payload.cambio,
        payload.cor,
        payload.cidade,
        payload.aceitaTroca,
        JSON.stringify(uploadedImages),
      ],
    );
    const created = await db.query(`${CAR_SELECT} WHERE id = $1`, [
      result.rows[0].id,
    ]);
    return res.status(201).json(created.rows[0]);
  } catch (error) {
    if (uploadedImages.length) await deleteManagedImages(uploadedImages);
    console.error(error);
    return res
      .status(error.status || 500)
      .json({ error: error.status ? error.message : "Erro ao criar carro." });
  }
});

router.put(
  "/:id",
  auth,
  onlyAdmin,
  upload.array("imagens"),
  async (req, res) => {
    let uploadedImages = [];
    try {
      const id = optionalInteger(req.params.id);
      if (!id)
        return res.status(400).json({ error: "Identificador inválido." });

      const existingResult = await db.query(
        "SELECT imagem, imagens FROM carros WHERE id = $1",
        [id],
      );
      if (existingResult.rowCount === 0) {
        return res.status(404).json({ error: "Carro não encontrado." });
      }

      validateUploadedImages(req.files);
      const payload = vehiclePayload(req.body);
      const validationError = validateVehicle(payload, req.body.secao);
      if (validationError)
        return res.status(400).json({ error: validationError });

      uploadedImages = await Promise.all(
        (req.files || []).map((file) =>
          uploadBuffer(file.buffer, file.originalname),
        ),
      );
      const replacementImages = uploadedImages.length ? uploadedImages : null;

      await db.query(
        `
        UPDATE carros SET
          marca=$1, modelo=$2, ano=$3, preco=$4, precoantigo=$5,
          emoferta=$6, badge=$7, secao=$8, prioridade=$9,
          imagem=COALESCE($10, imagem), descricao=$11, descricaocurta=$12,
          km=$13, combustivel=$14, finalplaca=$15, cambio=$16, cor=$17,
          cidade=$18, aceitatroca=$19, imagens=COALESCE($20, imagens)
        WHERE id=$21
      `,
        [
          payload.marca,
          payload.modelo,
          payload.ano,
          payload.preco,
          payload.precoAntigo,
          payload.emPromocao,
          payload.badge,
          payload.secao,
          payload.prioridade,
          replacementImages?.[0] || null,
          payload.descricao,
          payload.descricaoCurta,
          payload.km,
          payload.combustivel,
          payload.finalPlaca,
          payload.cambio,
          payload.cor,
          payload.cidade,
          payload.aceitaTroca,
          replacementImages ? JSON.stringify(replacementImages) : null,
          id,
        ],
      );

      if (replacementImages) {
        await deleteManagedImages(
          normalizeImages(existingResult.rows[0].imagens).concat(
            existingResult.rows[0].imagem || [],
          ),
        );
      }

      const updated = await db.query(`${CAR_SELECT} WHERE id = $1`, [id]);
      return res.json(updated.rows[0]);
    } catch (error) {
      if (uploadedImages.length) await deleteManagedImages(uploadedImages);
      console.error(error);
      return res.status(error.status || 500).json({
        error: error.status ? error.message : "Erro ao atualizar carro.",
      });
    }
  },
);

router.delete("/:id", auth, onlyAdmin, async (req, res) => {
  try {
    const id = optionalInteger(req.params.id);
    if (!id) return res.status(400).json({ error: "Identificador inválido." });

    const existingResult = await db.query(
      "SELECT imagem, imagens FROM carros WHERE id = $1",
      [id],
    );
    if (existingResult.rowCount === 0) {
      return res.status(404).json({ error: "Carro não encontrado." });
    }

    await db.query("DELETE FROM carros WHERE id = $1", [id]);
    const cleanup = await deleteManagedImages(
      normalizeImages(existingResult.rows[0].imagens).concat(
        existingResult.rows[0].imagem || [],
      ),
    );
    return res.json({
      message: "Carro removido.",
      imagensRemovidas: cleanup.removed,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao remover carro." });
  }
});

module.exports = router;
