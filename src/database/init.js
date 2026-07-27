const db = require("./db");
const { ensureDatabaseSchema } = require("./schema");

ensureDatabaseSchema()
  .then(() => console.log("Schema do Classic Motors pronto."))
  .catch((error) => {
    console.error("Erro ao preparar o schema:", error.message);
    process.exitCode = 1;
  })
  .finally(() => db.end());
