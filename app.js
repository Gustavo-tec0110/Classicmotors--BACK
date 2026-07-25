const cors = require("cors");
const express = require("express");
const fs = require("fs");
const path = require("path");

require("dotenv").config();

const carrosRoutes = require("./src/routes/carros");
const authRoutes = require("./src/routes/authRoutes");

const app = express();
const allowedOrigins = (
  process.env.CORS_ORIGINS ||
  "http://localhost:3000,http://127.0.0.1:3000,http://localhost:5500,http://127.0.0.1:5500"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (process.env.NODE_ENV !== "test") {
  app.use((req, _res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Origem não permitida pela política CORS."));
    },
  }),
);
app.use(express.json({ limit: "1mb" }));

const imagensPath = path.join(process.cwd(), "imagens");
if (!fs.existsSync(imagensPath)) {
  fs.mkdirSync(imagensPath, { recursive: true });
}

app.use(
  "/imagens",
  express.static(imagensPath, {
    setHeaders: (response, filePath) => {
      response.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      const extension = path.extname(filePath).toLowerCase();
      if (extension === ".webp") response.setHeader("Content-Type", "image/webp");
      if ([".jpg", ".jpeg"].includes(extension)) {
        response.setHeader("Content-Type", "image/jpeg");
      }
      if (extension === ".png") response.setHeader("Content-Type", "image/png");
    },
  }),
);

app.get("/", (_req, res) => {
  res.json({ service: "classic-motors-api", status: "ok" });
});
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/carros", carrosRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});
app.use((error, _req, res, _next) => {
  console.error("Erro não tratado:", error.message);
  const status = error.message.includes("CORS") ? 403 : 500;
  res.status(status).json({ error: status === 403 ? error.message : "Erro interno" });
});

module.exports = app;
