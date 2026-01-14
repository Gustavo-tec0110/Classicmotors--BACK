const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

// log simples de requisições
app.use((req, res, next) => {
  console.log("➡️", req.method, req.url);
  next();
});

app.use(cors());
app.use(express.json());

// garante existência da pasta onde o multer salva
const imagensPath = path.join(process.cwd(), "imagens");
if (!fs.existsSync(imagensPath)) {
  fs.mkdirSync(imagensPath, { recursive: true });
}

// serve arquivos estáticos da pasta de imagens com headers para evitar ORB
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

app.get("/__reset-imagens", async (req, res) => {
  try {
    const db = require("./src/database/db");

    await db.query("UPDATE carros SET imagens = NULL");

    res.json({ ok: true, msg: "Campo imagens resetado com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao resetar imagens" });
  }
});


// rotas da API
const carrosRoutes = require("./src/routes/carros");
app.use("/carros", carrosRoutes);

// rota raiz
app.get("/", (req, res) => res.send("API WebMotors rodando 🚗"));

/* handlers mínimos */
app.use((req, res) => res.status(404).json({ error: "Rota não encontrada" }));
app.use((err, req, res, next) => {
  console.error("🔥 Erro:", err);
  res.status(500).json({ error: "Erro interno" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("🚀 Servidor rodando na porta", PORT));
