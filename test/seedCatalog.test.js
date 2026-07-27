const assert = require("node:assert/strict");
const { test } = require("node:test");

const { seedVehicleCatalog } = require("../src/database/seedCatalog");

function createFakeDatabase() {
  const records = new Map();

  return {
    records,
    async query(sql, values = []) {
      const normalized = sql.replace(/\s+/g, " ").trim().toUpperCase();
      if (
        normalized === "BEGIN" ||
        normalized === "COMMIT" ||
        normalized === "ROLLBACK"
      ) {
        return { rows: [], rowCount: 0 };
      }
      if (normalized.startsWith("WITH EXISTING AS")) {
        return { rows: [], rowCount: records.has(values[0]) ? 1 : 0 };
      }
      if (normalized.startsWith("INSERT INTO CARROS")) {
        const stableId = values[0];
        if (records.has(stableId)) return { rows: [], rowCount: 0 };
        records.set(stableId, { secao: values[8] });
        return { rows: [{ id: records.size }], rowCount: 1 };
      }
      if (normalized.startsWith("SELECT SECAO, COUNT")) {
        const counts = {};
        for (const record of records.values()) {
          counts[record.secao] = (counts[record.secao] || 0) + 1;
        }
        return {
          rows: Object.entries(counts).map(([secao, quantidade]) => ({
            secao,
            quantidade,
          })),
          rowCount: Object.keys(counts).length,
        };
      }
      throw new Error(`Consulta inesperada no teste: ${normalized}`);
    },
  };
}

test("seed é idempotente e mantém cinco veículos por categoria", async () => {
  const database = createFakeDatabase();

  const firstRun = await seedVehicleCatalog(database);
  const secondRun = await seedVehicleCatalog(database);

  assert.equal(firstRun.added, 15);
  assert.deepEqual(firstRun.after, {
    ofertas: 5,
    classicos: 5,
    modernos: 5,
  });
  assert.equal(secondRun.added, 0);
  assert.deepEqual(secondRun.after, firstRun.after);
  assert.equal(database.records.size, 15);
});
