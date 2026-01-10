const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

/* ======================
   CORS (CORRETO)
====================== */
app.use(cors({
  origin: "*", // libera qualquer front (Netlify, localhost, etc)
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// parse JSON
app.use(express.json());

// servir imagens
app.use("/imagens", express.static(path.join(__dirname, "imagens")));

// rotas
const carrosRoutes = require("./src/routes/carros");
app.use("/carros", carrosRoutes);

// rota teste
app.get("/test-cors", (req, res) => {
  res.json({ ok: true });
});

// rota raiz
app.get("/", (req, res) => {
  res.send("API WebMotors rodando 🚗");
});

// fallback 404
app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

// middleware de erro
app.use((err, req, res, next) => {
  console.error("Erro no servidor:", err);
  res.status(500).json({ error: "Erro interno do servidor" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
