const assert = require("node:assert/strict");
const { test } = require("node:test");

const {
  hasValidImageSignature,
  validateUploadedImages,
} = require("../src/utils/images");

test("valida a assinatura real de JPEG, PNG e WebP", () => {
  const jpeg = {
    mimetype: "image/jpeg",
    buffer: Buffer.from([0xff, 0xd8, 0xff, 0x00, 0x00, 0x00, 0, 0, 0, 0, 0, 0]),
  };
  const png = {
    mimetype: "image/png",
    buffer: Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0,
    ]),
  };
  const webp = {
    mimetype: "image/webp",
    buffer: Buffer.from("RIFF0000WEBP", "ascii"),
  };

  assert.equal(hasValidImageSignature(jpeg), true);
  assert.equal(hasValidImageSignature(png), true);
  assert.equal(hasValidImageSignature(webp), true);
  assert.doesNotThrow(() => validateUploadedImages([jpeg, png, webp]));
});

test("rejeita arquivo executável disfarçado de imagem", () => {
  const disguised = {
    mimetype: "image/png",
    buffer: Buffer.from("<script>alert(1)</script>"),
  };

  assert.equal(hasValidImageSignature(disguised), false);
  assert.throws(
    () => validateUploadedImages([disguised]),
    /JPEG, PNG ou WebP válidas/,
  );
});
