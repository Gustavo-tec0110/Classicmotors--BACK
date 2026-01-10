const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// CORS — aplicar como middleware (não usar app.options('*', ...))
app.use(cors());

// parse JSON
app.use(express.json());

// servir imagens (garanta que a pasta "imagens" exista na raiz)
app.use("/imagens", express.static(path.join(__dirname, "imagens")));

// rotas
const carrosRoutes = require("./src/routes/carros");
app.use("/carros", carrosRoutes);

// rota teste simples
app.get("/test-cors", (req, res) => {
  res.json({ ok: true });
});

// rota raiz
app.get("/", (req, res) => {
  res.send("API WebMotors rodando 🚗");
});

// fallback 404 (catch-all sem usar '*')
app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

// middleware de erro (básico, útil pra logs)
app.use((err, req, res, next) => {
  console.error("Erro no servidor:", err);
  res.status(500).json({ error: "Erro interno do servidor" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
