const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

// log de request (debug)
app.use((req, res, next) => {
  console.log("➡️", req.method, req.url);
  next();
});

// CORS
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.json());

// pasta imagens (garante que existe)
const imagensPath = path.join(__dirname, "imagens");
if (!fs.existsSync(imagensPath)) {
  fs.mkdirSync(imagensPath);
}
app.use("/imagens", express.static(imagensPath));

// rotas
const carrosRoutes = require("./src/routes/carros");
app.use("/carros", carrosRoutes);

// raiz
app.get("/", (req, res) => {
  res.send("API WebMotors rodando 🚗");
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

// erro
app.use((err, req, res, next) => {
  console.error("🔥 Erro:", err);
  res.status(500).json({ error: "Erro interno" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Servidor rodando na porta", PORT);
});
