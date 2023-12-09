class MissingParamError extends Error {
  constructor(param) {
    super(`Missing parameter: ${param}`);
    this.name = "MissingParamError";
  }
}

module.exports = {
  MissingParamError,
};
