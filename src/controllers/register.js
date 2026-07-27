const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/UserSQL");

const adminEmails = process.env.ADMIN_EMAILS
  ? process.env.ADMIN_EMAILS.split(",").map((e) => e.trim())
  : [];

async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Dados incompletos" });
    }

    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(409).json({ error: "Email já cadastrado" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const role = adminEmails.includes(email) ? "admin" : "user";

    const user = await User.createUser({
      name,
      email,
      passwordHash,
      role,
    });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(201).json({ user, token });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ error: "Erro interno" });
  }
}

module.exports = { register };
