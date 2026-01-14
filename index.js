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
const imagensPath = path.join(process.cwd(), "imagens");

if (!fs.existsSync(imagensPath)) {
  fs.mkdirSync(imagensPath, { recursive: true });
}

/*
  Serve a pasta de imagens com headers apropriados para evitar
  ERR_BLOCKED_BY_ORB e garantir que o browser trate a resposta como imagem.
  Deve ficar ANTES das rotas que podem interceptar requisições.
*/
app.use(
  "/imagens",
  express.static(imagensPath, {
    // setHeaders tem assinatura (res, filePath, stat)
    setHeaders: (res, filePath) => {
      // Permite que o recurso de imagem seja carregado cross-origin
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      // CORS permissivo para recursos estáticos (ajuda em dev e em hospedagens)
      res.setHeader("Access-Control-Allow-Origin", "*");

      // Garante content-type correto caso algo esteja sobrescrevendo
      const ext = path.extname(filePath).toLowerCase();
      if (ext === ".webp") res.setHeader("Content-Type", "image/webp");
      if (ext === ".jpg" || ext === ".jpeg") res.setHeader("Content-Type", "image/jpeg");
      if (ext === ".png") res.setHeader("Content-Type", "image/png");

      // Recomendo caching para imagens em produção (opcional)
      // res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  })
);

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
