const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const express = require("express");
const router = express.Router();

const client = new OAuth2Client(
  "900520090831-abk5o444b79mfegivkmc0adofpcmqgi2.apps.googleusercontent.com"
);

router.post("/google", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "900520090831-tocd8s3mis8o5jo4tsgs4nim9vs96ugh.apps.googleusercontent.com"
    });

    const payload = ticket.getPayload();

    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name;
    const avatar = payload.picture;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        avatar
      });
    }

    const systemToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ token: systemToken });

  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: "Token Google inválido" });
  }
});

module.exports = router;
