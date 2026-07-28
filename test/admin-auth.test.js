const test = require("node:test");
const assert = require("node:assert/strict");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

process.env.JWT_SECRET = "test-only-secret";

const User = require("../src/models/UserSQL");
const { login } = require("../src/controllers/login");
const auth = require("../src/middlewares/auth");
const onlyAdmin = require("../src/middlewares/onlyadmin");

function responseRecorder() {
  return {
    statusCode: 200,
    payload: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    },
  };
}

test("login administrativo aceita apenas admin e usa erro genérico", async () => {
  const originalFindByEmail = User.findByEmail;
  const originalCompare = bcrypt.compare;

  try {
    User.findByEmail = async () => ({
      id: 7,
      role: "user",
      password: "hash",
    });
    let response = responseRecorder();
    await login(
      { body: { email: "visitor@example.com", password: "secret" } },
      response,
    );
    assert.equal(response.statusCode, 401);
    assert.deepEqual(response.payload, {
      error: "E-mail ou senha inválidos.",
    });

    User.findByEmail = async () => ({
      id: 9,
      role: "admin",
      password: "hash",
    });
    bcrypt.compare = async () => false;
    response = responseRecorder();
    await login(
      { body: { email: "admin@example.com", password: "wrong" } },
      response,
    );
    assert.equal(response.statusCode, 401);
    assert.deepEqual(response.payload, {
      error: "E-mail ou senha inválidos.",
    });

    bcrypt.compare = async () => true;
    response = responseRecorder();
    await login(
      { body: { email: " ADMIN@EXAMPLE.COM ", password: "correct" } },
      response,
    );
    assert.equal(response.statusCode, 200);
    const decoded = jwt.verify(response.payload.token, process.env.JWT_SECRET);
    assert.equal(decoded.id, 9);
    assert.equal(decoded.role, "admin");
  } finally {
    User.findByEmail = originalFindByEmail;
    bcrypt.compare = originalCompare;
  }
});

test("middleware rejeita ausência de token antes de consultar o banco", async () => {
  const response = responseRecorder();
  let nextCalled = false;

  await auth({ headers: {} }, response, () => {
    nextCalled = true;
  });

  assert.equal(response.statusCode, 401);
  assert.deepEqual(response.payload, { error: "Não autorizado." });
  assert.equal(nextCalled, false);
});

test("autorização administrativa rejeita usuário autenticado sem papel admin", () => {
  const response = responseRecorder();
  let nextCalled = false;

  onlyAdmin({ user: { role: "user" } }, response, () => {
    nextCalled = true;
  });

  assert.equal(response.statusCode, 403);
  assert.equal(nextCalled, false);
});
