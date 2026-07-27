const { test } = require("node:test");
const assert = require("node:assert/strict");

const { optionalInteger, optionalNumber } = require("../src/utils/numbers");

test("campos numéricos opcionais vazios são convertidos para null", () => {
  assert.equal(optionalNumber(""), null);
  assert.equal(optionalInteger(""), null);
  assert.equal(optionalInteger(undefined), null);
});

test("campos numéricos válidos são normalizados", () => {
  assert.equal(optionalNumber("31900.50"), 31900.5);
  assert.equal(optionalInteger("1986"), 1986);
});

test("inteiros inválidos não chegam ao PostgreSQL", () => {
  assert.equal(optionalInteger("1986.5"), null);
  assert.equal(optionalInteger("não numérico"), null);
});
