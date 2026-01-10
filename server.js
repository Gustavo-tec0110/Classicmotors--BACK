const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// CORS (libera acesso do front)
app.use(cors({
  origin: "*"
}));

app.use(express.json());

// SERVIR IMAGENS
app.use("/imagens", express.static(path.join(__dirname, "imagens")));

// rotas
const carrosRoutes = require("./src/routes/carros");
app.use("/carros", carrosRoutes);

// rota raiz
app.get("/", (req, res) => {
  res.send("API WebMotors rodando 🚗");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
