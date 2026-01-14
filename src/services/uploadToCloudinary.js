// services/uploadToCloudinary.js
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

/**
 * Sobe um buffer de imagem para o Cloudinary e retorna a URL segura.
 * @param {Buffer} buffer - Buffer da imagem (do multer)
 * @param {string} originalName - Nome original do arquivo
 * @returns {Promise<string>} URL da imagem no Cloudinary
 */
function uploadBuffer(buffer, originalName) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "webmotors",               // pasta no Cloudinary
        resource_type: "image",
        public_id: originalName.split(".")[0] // opcional, evita nomes duplicados
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);         // retorna a URL da imagem
      }
    );

    // transforma o buffer em stream e envia
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

module.exports = {
  uploadBuffer
};
