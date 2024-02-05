class InvalidCredentialsError extends Error {
  constructor(identifier) {
    super(`Invalid credentials for ${identifier}`);
    this.name = "InvalidCredentialsError";
  }
}

class CredentialsRefusedError extends Error {
  constructor(identifier) {
    super(`Credentials are not sufficient for ${identifier}`);
    this.name = "CredentialsRefusedError";
  }
}

module.exports = {
  InvalidCredentialsError,
  CredentialsRefusedError,
};
