const User = require("../../models/user");
const HttpResponse = require("./http-response");
const logger = require("./logger");
const UserForToken = require("./user-for-token");

const tokenExtractor = (request, _response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    request.token = authorization.replace("Bearer ", "");
  }
  next();
};

const userExtractor = async (request, response, next) => {
  const decodedToken = UserForToken.getPayload(request.token);

  // check if the token was succesfully decoded and has an id field
  // serves as an authentication checker
  if (!decodedToken.id) {
    const unauthorizedResponse = HttpResponse.unauthorized(
      new Error("invalid token")
    );
    return response
      .status(unauthorizedResponse.code)
      .json(unauthorizedResponse.body);
  }

  // set user to the user attribute
  const user = await User.findById(decodedToken.id);
  request.user = user;

  next();
};

const unknownEndpoint = (_request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, _request, response, next) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    let uniqueKindPaths = [];
    const _errors = error.errors;
    const errorKeys = Object.keys(_errors);
    const firstPathKey = Object.keys(_errors)[0];

    errorKeys.forEach((key) => {
      if (
        _errors[key].path === firstPathKey &&
        _errors[key].kind === "unique"
      ) {
        uniqueKindPaths.push(key);
      }
    });

    if (uniqueKindPaths.length > 0) {
      return response.status(409).json({
        error: _errors[firstPathKey].message,
        params: uniqueKindPaths,
      });
    }

    return response.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: error.message });
  }

  next(error);
};

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
};
