const db = require("../database/db");

async function findByEmail(email) {
  const result = await db.query(
    "SELECT * FROM users WHERE LOWER(email) = LOWER($1)",
    [email],
  );
  return result.rows[0] || null;
}

async function findById(id) {
  const result = await db.query(
    "SELECT id, name, email, role FROM users WHERE id = $1",
    [id],
  );
  return result.rows[0] || null;
}

async function createUser({ name, email, passwordHash, role = "user" }) {
  const result = await db.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role`,
    [name, email, passwordHash, role],
  );
  return result.rows[0];
}

module.exports = {
  findByEmail,
  findById,
  createUser,
};
