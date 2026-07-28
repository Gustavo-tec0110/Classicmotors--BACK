const jwt = require("jsonwebtoken");
const User = require("../models/UserSQL");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Não autorizado." });
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    return res.status(401).json({ error: "Não autorizado." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: "Não autorizado." });
    }

    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ error: "Não autorizado." });
  }
};
