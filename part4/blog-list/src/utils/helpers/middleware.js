const logger = require("./logger");

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
  }

  next(error);
};

module.exports = {
  unknownEndpoint,
  errorHandler,
};
