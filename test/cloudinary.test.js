const assert = require("node:assert/strict");
const test = require("node:test");

const { getManagedPublicId } = require("../src/services/uploadToCloudinary");

test("extrai apenas public IDs gerenciados pelo projeto", () => {
  assert.equal(
    getManagedPublicId(
      "https://res.cloudinary.com/demo/image/upload/v123/webmotors/opala-abcd.webp",
    ),
    "webmotors/opala-abcd",
  );
  assert.equal(
    getManagedPublicId(
      "https://res.cloudinary.com/demo/image/upload/v123/outro/opala.webp",
    ),
    null,
  );
  assert.equal(getManagedPublicId("https://example.com/opala.webp"), null);
});
