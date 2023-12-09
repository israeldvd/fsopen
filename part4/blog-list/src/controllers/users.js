const User = require("../models/user");

const usersRouter = require("express").Router();

usersRouter.get("/", async (request, response) => {
  const users = await User.find({});

  response.json(users);
});

module.exports = usersRouter;
