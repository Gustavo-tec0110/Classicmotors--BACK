const express = require("express");
const cors = require("cors");
const db = require("./src/database/db"); // conexão SQLite

const app = express();
app.use(cors());
app.use(express.json());

// rota para pegar carros do banco
app.get("/carros", (req, res) => {
  db.all("SELECT * FROM carros", (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao buscar carros" });
      return;
    }
    res.json(rows);
  });
});

// rota raiz só pra teste
app.get("/", (req, res) => {
  res.send("API WebMotors rodando 🚗");
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
