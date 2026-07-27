const { after, before, test } = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");

process.env.NODE_ENV = "test";

const app = require("../app");

let server;
let baseUrl;

function get(path, headers = {}) {
  return new Promise((resolve, reject) => {
    http
      .get(`${baseUrl}${path}`, { headers }, (response) => {
        let body = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          body += chunk;
        });
        response.on("end", () => {
          resolve({
            status: response.statusCode,
            headers: response.headers,
            body: JSON.parse(body),
          });
        });
      })
      .on("error", reject);
  });
}

before(
  () =>
    new Promise((resolve) => {
      server = app.listen(0, "127.0.0.1", () => {
        const address = server.address();
        baseUrl = `http://127.0.0.1:${address.port}`;
        resolve();
      });
    }),
);

after(
  () =>
    new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    }),
);

test("GET /health informa que o serviço está disponível", async () => {
  const response = await get("/health");

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { status: "ok" });
});

test("rota inexistente responde com 404 estruturado", async () => {
  const response = await get("/nao-existe");

  assert.equal(response.status, 404);
  assert.deepEqual(response.body, { error: "Rota não encontrada" });
});

test("CORS permite o frontend oficial publicado", async () => {
  const origin = "https://classicmotors-front.onrender.com";
  const response = await get("/health", { Origin: origin });

  assert.equal(response.status, 200);
  assert.equal(response.headers["access-control-allow-origin"], origin);
});
