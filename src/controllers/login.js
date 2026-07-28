const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/UserSQL");

const INVALID_CREDENTIALS = "E-mail ou senha inválidos.";

async function login(req, res) {
  try {
    const email =
      typeof req.body?.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";
    const password =
      typeof req.body?.password === "string" ? req.body.password : "";

    const user = await User.findByEmail(email);
    if (!user || user.role !== "admin") {
      return res.status(401).json({ error: INVALID_CREDENTIALS });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: INVALID_CREDENTIALS });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    return res.json({ token });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res
      .status(500)
      .json({ error: "Não foi possível concluir o acesso." });
  }
}

module.exports = { login };
