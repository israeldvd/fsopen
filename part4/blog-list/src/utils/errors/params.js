class MissingParamError extends Error {
  constructor(param) {
    super(`Missing parameter: ${param}`);
    this.name = "MissingParamError";
  }
}

class InvalidParamError extends Error {
  constructor(param) {
    super(`Invalid parameter: ${param}`);
    this.name = "InvalidParamError";
  }
}

module.exports = {
  MissingParamError,
  InvalidParamError,
};
