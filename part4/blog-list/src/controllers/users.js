const usersRouter = require("express").Router();

usersRouter.get("/", (request, response) => {
  const { name, username, password } = request.body;

  response.json({
    message: "ok",
    user: {
      name,
      username,
      password: undefined,
    },
  });
});

module.exports = usersRouter;
