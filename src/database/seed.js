const db = require("./db");
const { ensureDatabaseSchema } = require("./schema");
const { seedVehicleCatalog } = require("./seedCatalog");

async function run() {
  await ensureDatabaseSchema();
  const result = await seedVehicleCatalog();
  console.log(
    `Catálogo pronto: ${result.added} veículo(s) adicionado(s).`,
    result.after,
  );
}

run()
  .catch((error) => {
    console.error("Falha ao popular o catálogo:", error.message);
    process.exitCode = 1;
  })
  .finally(() => db.end());
