const { Router } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Encrypter = require("../utils/helpers/encrypter");

const loginRoute = Router();

loginRoute.post("/", async (request, response) => {
  const { username, password } = request.body;
  const encrypter = new Encrypter();

  const user = await User.findOne({ username });
  const validCredentials =
    user === null
      ? false
      : await encrypter.compare(password, user.passwordHash);

  response.json({
    passwordMatches: validCredentials,
    access_token: jwt.sign(password || "password", process.env.GENERIC_SECRET),
  });
});

module.exports = loginRoute;
