const express = require("express");

const { login } = require("../controllers/login");
const auth = require("../middlewares/auth");
const onlyAdmin = require("../middlewares/onlyadmin");

const router = express.Router();

router.post("/login", login);
router.get("/session", auth, onlyAdmin, (req, res) => {
  res.json({
    authenticated: true,
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

module.exports = router;
