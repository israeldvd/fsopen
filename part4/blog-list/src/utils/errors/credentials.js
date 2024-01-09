class InvalidCredentialsError extends Error {
  constructor(identifier) {
    super(`Invalid credentials for ${identifier}`);
    this.name = "InvalidCredentialsError";
  }
}

module.exports = {
  InvalidCredentialsError,
};
