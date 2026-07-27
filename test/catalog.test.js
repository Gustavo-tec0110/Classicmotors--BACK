const assert = require("node:assert/strict");
const { test } = require("node:test");

const {
  vehicleCatalog,
  vehicleCategories,
} = require("../src/data/vehicleCatalog");

test("catálogo possui cinco veículos completos por categoria", () => {
  const counts = Object.fromEntries(
    vehicleCategories.map((category) => [
      category.slug,
      vehicleCatalog.filter((vehicle) => vehicle.secao === category.slug)
        .length,
    ]),
  );

  for (const category of vehicleCategories) {
    assert.ok(
      counts[category.slug] >= 5,
      `${category.slug} tem apenas ${counts[category.slug]} veículos`,
    );
  }

  for (const vehicle of vehicleCatalog) {
    assert.ok(vehicle.stableId);
    assert.ok(vehicle.marca);
    assert.ok(vehicle.modelo);
    assert.ok(vehicle.ano >= 1900);
    assert.ok(vehicle.preco > 0);
    assert.ok(vehicle.descricao.length >= 60);
    assert.ok(vehicle.km >= 0);
    assert.equal(vehicle.imagens.length, 1);
    assert.match(vehicle.imagem, /^https:\/\/upload\.wikimedia\.org\//);
  }
});

test("identificadores e imagens do catálogo não se repetem", () => {
  assert.equal(
    new Set(vehicleCatalog.map((vehicle) => vehicle.stableId)).size,
    vehicleCatalog.length,
  );
  assert.equal(
    new Set(vehicleCatalog.map((vehicle) => vehicle.imagem)).size,
    vehicleCatalog.length,
  );
});
