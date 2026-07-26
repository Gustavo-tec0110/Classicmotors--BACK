// services/uploadToCloudinary.js
const cloudinary = require("../config/cloudinary");
const { randomUUID } = require("crypto");
const path = require("path");
const streamifier = require("streamifier");

/**
 * Sobe um buffer de imagem para o Cloudinary e retorna a URL segura.
 * @param {Buffer} buffer - Buffer da imagem (do multer)
 * @param {string} originalName - Nome original do arquivo
 * @returns {Promise<string>} URL da imagem no Cloudinary
 */
function uploadBuffer(buffer, originalName) {
  return new Promise((resolve, reject) => {
    const safeBaseName = path
      .parse(originalName)
      .name
      .normalize("NFKD")
      .replace(/[^\w-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase() || "imagem";

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "webmotors",
        resource_type: "image",
        public_id: `${safeBaseName}-${randomUUID()}`,
        overwrite: false
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

function getManagedPublicId(imageUrl) {
  try {
    const parsedUrl = new URL(imageUrl);
    if (parsedUrl.hostname !== "res.cloudinary.com") return null;

    const segments = parsedUrl.pathname.split("/").filter(Boolean);
    const uploadIndex = segments.indexOf("upload");
    if (uploadIndex === -1) return null;

    const publicIdParts = segments.slice(uploadIndex + 1);
    if (/^v\d+$/.test(publicIdParts[0] || "")) publicIdParts.shift();
    if (publicIdParts.length === 0) return null;

    publicIdParts[publicIdParts.length - 1] = path.parse(
      publicIdParts[publicIdParts.length - 1]
    ).name;

    const publicId = publicIdParts.map(decodeURIComponent).join("/");
    return publicId.startsWith("webmotors/") ? publicId : null;
  } catch {
    return null;
  }
}

async function deleteManagedImages(imageUrls = []) {
  const publicIds = imageUrls
    .map(getManagedPublicId)
    .filter(Boolean);

  const results = await Promise.allSettled(
    publicIds.map((publicId) =>
      cloudinary.uploader.destroy(publicId, {
        resource_type: "image",
        invalidate: true
      })
    )
  );

  return {
    requested: publicIds.length,
    removed: results.filter(
      (result) =>
        result.status === "fulfilled" &&
        ["ok", "not found"].includes(result.value.result)
    ).length
  };
}

module.exports = {
  deleteManagedImages,
  getManagedPublicId,
  uploadBuffer
};
