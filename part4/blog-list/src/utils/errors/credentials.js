class InvalidCredentialsError extends Error {
  constructor(identifier) {
    super(`Credentials invalid for ${identifier}`);
    this.name = "InvalidCredentialsError";
  }
}

module.exports = {
  InvalidCredentialsError,
};
