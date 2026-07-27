const assert = require("node:assert/strict");
const { after, before, mock, test } = require("node:test");
const http = require("node:http");

process.env.NODE_ENV = "test";

const db = require("../src/database/db");
const app = require("../app");

let server;
let baseUrl;
let queries;

before(
  () =>
    new Promise((resolve) => {
      queries = mock.method(db, "query", async (sql) => {
        if (sql.includes("COUNT(*)::int AS total")) {
          return { rows: [{ total: 1 }], rowCount: 1 };
        }
        return {
          rows: [
            {
              id: 1,
              marca: "Volkswagen",
              modelo: "Fusca 1600",
              secao: "classicos",
              preco: "48900",
            },
          ],
          rowCount: 1,
        };
      });
      server = app.listen(0, "127.0.0.1", () => {
        baseUrl = `http://127.0.0.1:${server.address().port}`;
        resolve();
      });
    }),
);

after(
  () =>
    new Promise((resolve, reject) => {
      mock.restoreAll();
      server.close((error) => (error ? reject(error) : resolve()));
    }),
);

function getJson(path) {
  return new Promise((resolve, reject) => {
    http
      .get(`${baseUrl}${path}`, (response) => {
        let body = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          body += chunk;
        });
        response.on("end", () =>
          resolve({ status: response.statusCode, body: JSON.parse(body) }),
        );
      })
      .on("error", reject);
  });
}

test("listagem aplica categoria, busca, ordenação e paginação", async () => {
  const response = await getJson(
    "/carros?secao=classicos&q=fusca&sort=price_asc&page=1&limit=5",
  );

  assert.equal(response.status, 200);
  assert.equal(response.body.carros.length, 1);
  assert.deepEqual(response.body.pagination, {
    page: 1,
    limit: 5,
    total: 1,
    pages: 1,
  });

  const listCall = queries.mock.calls[0].arguments;
  assert.match(listCall[0], /secao = \$1/);
  assert.match(listCall[0], /marca ILIKE \$2/);
  assert.match(listCall[0], /ORDER BY preco ASC/);
  assert.match(listCall[0], /LIMIT \$3 OFFSET \$4/);
  assert.deepEqual(listCall[1], ["classicos", "%fusca%", 5, 0]);
});

test("categoria inválida retorna erro sem consultar o banco", async () => {
  const callsBefore = queries.mock.callCount();
  const response = await getJson("/carros?secao=inexistente");

  assert.equal(response.status, 400);
  assert.equal(response.body.error, "Categoria inválida.");
  assert.equal(queries.mock.callCount(), callsBefore);
});
