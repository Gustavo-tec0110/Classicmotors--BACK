const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function hasValidImageSignature(file) {
  const buffer = file?.buffer;
  if (!Buffer.isBuffer(buffer) || buffer.length < 12) return false;

  if (file.mimetype === "image/jpeg") {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  if (file.mimetype === "image/png") {
    return buffer
      .subarray(0, 8)
      .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  }

  if (file.mimetype === "image/webp") {
    return (
      buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
      buffer.subarray(8, 12).toString("ascii") === "WEBP"
    );
  }

  return false;
}

function validateUploadedImages(files = []) {
  for (const file of files) {
    if (
      !ALLOWED_IMAGE_TYPES.has(file.mimetype) ||
      !hasValidImageSignature(file)
    ) {
      const error = new Error(
        "Envie apenas imagens JPEG, PNG ou WebP válidas.",
      );
      error.status = 400;
      throw error;
    }
  }
}

module.exports = {
  ALLOWED_IMAGE_TYPES,
  hasValidImageSignature,
  validateUploadedImages,
};
