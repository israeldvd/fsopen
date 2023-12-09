const User = require("../models/user");

const usersRouter = require("express").Router();

usersRouter.get("/", async (request, response) => {
  const users = await User.find({});

  response.json(users);
});

usersRouter.post("/", async (request, response) => {
  const { username } = request.body;

  // user is created
  // username validation is done (implicitly) with it
  const newUser = await User.create({
    username,
  });

  response.json(newUser.toJSON());
});

module.exports = usersRouter;
