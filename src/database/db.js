const { Pool } = require("pg");

const useSsl = process.env.DATABASE_SSL === "true";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSsl ? { rejectUnauthorized: false } : false,
});

module.exports = {
  connect: () => pool.connect(),
  end: () => pool.end(),
  query: (text, params) => pool.query(text, params),
};
