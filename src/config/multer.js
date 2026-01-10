const multer = require("multer");
const path = require("path");
const fs = require("fs");

// garante que a pasta exista (evita crash no upload)
const uploadDir = path.join(process.cwd(), "imagens");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// onde salvar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const nome = Date.now() + ext;
    cb(null, nome);
  }
});

// filtro (opcional mas profissional)
const fileFilter = (req, file, cb) => {
  if (file.mimetype && file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Arquivo não é uma imagem"), false);
  }
};

module.exports = multer({
  storage,
  fileFilter
});
