const { Router } = require("express");
const User = require("../models/user");
const Encrypter = require("../utils/helpers/encrypter");
const HttpResponse = require("../utils/helpers/http-response");
const { InvalidCredentialsError } = require("../utils/errors/credentials");
const UserForToken = require("../utils/helpers/user-for-token");

const loginRoute = Router();

loginRoute.post("/", async (request, response) => {
  const { username, password } = request.body;
  const encrypter = new Encrypter();

  const user = await User.findOne({ username });

  // unauthorized response object instance
  const unauthorizedResponse = HttpResponse.unauthorized(
    new InvalidCredentialsError(username)
  );

  // check if any user was found
  if (user === null) {
    return response
      .status(unauthorizedResponse.code)
      .json(unauthorizedResponse.body);
  }

  // check credentials validity for this user...
  // when not, responds with Unauthorized -- same response code
  const validCredentials = await encrypter.compare(password, user.passwordHash);
  if (!validCredentials) {
    const unauthorizedResponse = HttpResponse.unauthorized(
      new InvalidCredentialsError(username)
    );

    return response
      .status(unauthorizedResponse.code)
      .json(unauthorizedResponse.body);
  }

  // otherwise, ok
  const access_token = UserForToken.generate(
    user._id.toString(),
    user.username,
    user.name
  );

  response.json({
    username: user.username,
    name: user.name,
    access_token: access_token,
  });
});

module.exports = loginRoute;
