const db = require("./db");
const { vehicleCatalog } = require("../data/vehicleCatalog");

function countsToObject(rows = []) {
  return Object.fromEntries(
    rows.map((row) => [row.secao, Number(row.quantidade)]),
  );
}

async function seedVehicleCatalog(database = db) {
  const client =
    typeof database.connect === "function"
      ? await database.connect()
      : database;
  const shouldRelease =
    client !== database && typeof client.release === "function";

  try {
    await client.query("BEGIN");
    const beforeResult = await client.query(
      "SELECT secao, COUNT(*)::int AS quantidade FROM carros GROUP BY secao",
    );

    let added = 0;
    for (const vehicle of vehicleCatalog) {
      await client.query(
        `
          WITH existing AS (
            SELECT id
            FROM carros
            WHERE stable_id = $1
               OR (
                 stable_id IS NULL
                 AND LOWER(marca) = LOWER($2)
                 AND LOWER(modelo) = LOWER($3)
                 AND ano = $4
               )
            ORDER BY (stable_id = $1) DESC, id
            LIMIT 1
          )
          UPDATE carros
          SET stable_id = $1
          WHERE id IN (SELECT id FROM existing)
        `,
        [vehicle.stableId, vehicle.marca, vehicle.modelo, vehicle.ano],
      );

      const insertResult = await client.query(
        `
          INSERT INTO carros (
            stable_id, marca, modelo, ano, preco, precoantigo, emoferta,
            badge, secao, prioridade, imagem, descricao, descricaocurta,
            km, combustivel, finalplaca, cambio, cor, cidade, aceitatroca,
            imagens
          )
          VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,
            $14, $15, $16, $17, $18, $19, $20, $21::jsonb
          )
          ON CONFLICT (stable_id) DO NOTHING
          RETURNING id
        `,
        [
          vehicle.stableId,
          vehicle.marca,
          vehicle.modelo,
          vehicle.ano,
          vehicle.preco,
          vehicle.precoAntigo,
          vehicle.emPromocao,
          vehicle.badge,
          vehicle.secao,
          vehicle.prioridade,
          vehicle.imagem,
          vehicle.descricao,
          vehicle.descricaoCurta,
          vehicle.km,
          vehicle.combustivel,
          vehicle.finalPlaca,
          vehicle.cambio,
          vehicle.cor,
          vehicle.cidade,
          vehicle.aceitaTroca,
          JSON.stringify(vehicle.imagens),
        ],
      );
      added += insertResult.rowCount || 0;
    }

    const afterResult = await client.query(
      "SELECT secao, COUNT(*)::int AS quantidade FROM carros GROUP BY secao",
    );
    await client.query("COMMIT");

    return {
      added,
      before: countsToObject(beforeResult.rows),
      after: countsToObject(afterResult.rows),
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    if (shouldRelease) client.release();
  }
}

module.exports = { countsToObject, seedVehicleCatalog };
