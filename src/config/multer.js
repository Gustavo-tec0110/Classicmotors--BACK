const multer = require("multer");
const { ALLOWED_IMAGE_TYPES } = require("../utils/images");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (ALLOWED_IMAGE_TYPES.has(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error("Envie apenas imagens JPEG, PNG ou WebP.");
    error.status = 400;
    cb(error, false);
  }
};

module.exports = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 8,
  },
});
