// index.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();

app.use((req, res, next) => {
  console.log("➡️", req.method, req.url);
  next();
});

app.use(cors());
app.use(express.json());

const imagensPath = path.join(process.cwd(), "imagens");
if (!fs.existsSync(imagensPath)) {
  fs.mkdirSync(imagensPath, { recursive: true });
}

app.use(
  "/imagens",
  express.static(imagensPath, {
    setHeaders: (res, filePath) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      res.setHeader("Access-Control-Allow-Origin", "*");
      const ext = path.extname(filePath).toLowerCase();
      if (ext === ".webp") res.setHeader("Content-Type", "image/webp");
      if (ext === ".jpg" || ext === ".jpeg") res.setHeader("Content-Type", "image/jpeg");
      if (ext === ".png") res.setHeader("Content-Type", "image/png");
    }
  })
);

// rotas
const carrosRoutes = require("./src/routes/carros");
app.use("/carros", carrosRoutes);

if (process.env.GOOGLE_AUTH_ENABLED === "true") {
  const authGoogleRoutes = require("./src/routes/auth.js");
  app.use("/auth", authGoogleRoutes);
} else {
  const authRoutes = require("./src/routes/authRoutes");
  app.use("/auth", authRoutes);
}

app.get("/", (req, res) => res.send("API WebMotors rodando 🚗"));

app.use((req, res) => res.status(404).json({ error: "Rota não encontrada" }));
app.use((err, req, res, next) => {
  console.error("🔥 Erro:", err);
  res.status(500).json({ error: "Erro interno" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("🚀 Servidor rodando na porta", PORT));
