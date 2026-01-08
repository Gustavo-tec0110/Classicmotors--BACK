const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// rotas
const carrosRoutes = require("./src/routes/carros");
app.use("/carros", carrosRoutes);

// rota raiz
app.get("/", (req, res) => {
  res.send("API WebMotors rodando 🚗");
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
