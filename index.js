const app = require("./app");

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`Classic Motors API disponível na porta ${port}`);
});
