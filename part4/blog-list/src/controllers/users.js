const { userPopulateSelectionOptions } = require("../models/model-options");
const User = require("../models/user");
const {
  MissingParamError,
  InvalidParamError,
} = require("../utils/errors/params");
const Encrypter = require("../utils/helpers/encrypter");
const HttpResponse = require("../utils/helpers/http-response");
const {
  UsernameValidator,
  PasswordValidator,
} = require("../utils/helpers/validators");

const usersRouter = require("express").Router();

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate(
    "blogs",
    userPopulateSelectionOptions
  );

  response.json(users);
});

usersRouter.post("/", async (request, response) => {
  const { username, password, name } = request.body;

  // this validates username before any other fields
  // so a response is simplified to only it (it may be undesirable)
  if (!username) {
    const badRequestResponse = HttpResponse.badRequest(
      new MissingParamError("username")
    );
    return response
      .status(badRequestResponse.code)
      .json(badRequestResponse.body);
  }

  if (!password) {
    const badRequestResponse = HttpResponse.badRequest(
      new MissingParamError("password")
    );
    return response
      .status(badRequestResponse.code)
      .json(badRequestResponse.body);
  }

  // validate username
  const usernameValidator = new UsernameValidator(username);
  if (!usernameValidator.isValid()) {
    const usernameRequestResponse = HttpResponse.badRequest(
      new InvalidParamError("username")
    );
    return response
      .status(usernameRequestResponse.code)
      .json(usernameRequestResponse.body);
  }

  // validate password length
  const passwordValidator = new PasswordValidator(password);
  if (!passwordValidator.isValid()) {
    const passwordBadRequestResponse = HttpResponse.badRequest(
      new InvalidParamError("password")
    );

    return response
      .status(passwordBadRequestResponse.code)
      .json(passwordBadRequestResponse.body);
  }

  // generate hash
  const passwordHash = await new Encrypter().encrypt(password);

  // user is created
  // username validation is done (implicitly) with it
  const user = new User({
    username,
    passwordHash,
    name,
  });
  const savedUser = await user.save();

  const httpCreated = HttpResponse.created(savedUser.toJSON());
  response.status(httpCreated.code).json(httpCreated.body);
});

module.exports = usersRouter;
