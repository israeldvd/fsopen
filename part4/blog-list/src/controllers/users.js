const User = require("../models/user");
const { MissingParamError } = require("../utils/errors/params");
const HttpResponse = require("../utils/helpers/http-response");

const usersRouter = require("express").Router();

usersRouter.get("/", async (request, response) => {
  const users = await User.find({});

  response.json(users);
});

usersRouter.post("/", async (request, response) => {
  const { username, password } = request.body;

  // this validates username before any other fields
  // so a response is simplified to only it (it may be undesirable)
  if (!username) {
    const badRequestResponse = HttpResponse.badRequest(
      new MissingParamError("username")
    );
    response.status(badRequestResponse.code).json(badRequestResponse.body);
  }

  if (!password) {
    const badRequestResponse = HttpResponse.badRequest(
      new MissingParamError("password")
    );
    response.status(badRequestResponse.code).json(badRequestResponse.body);
  }

  // user is created
  // username validation is done (implicitly) with it
  const newUser = await User.create({
    username,
  });

  response.json(newUser.toJSON());
});

module.exports = usersRouter;
