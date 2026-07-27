const app = require("./app");
const { ensureDatabaseSchema } = require("./src/database/schema");
const { seedVehicleCatalog } = require("./src/database/seedCatalog");

const port = Number(process.env.PORT) || 3000;

async function start() {
  await ensureDatabaseSchema();
  const seedResult = await seedVehicleCatalog();
  console.log(
    `Catálogo verificado: ${seedResult.added} veículo(s) adicionado(s).`,
  );

  app.listen(port, () => {
    console.log(`Classic Motors API disponível na porta ${port}`);
  });
}

start().catch((error) => {
  console.error("Falha ao inicializar o banco de dados:", error.message);
  process.exit(1);
});
