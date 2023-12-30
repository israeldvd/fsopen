class UsernameValidator {
  constructor(username) {
    this.username = username;
  }

  isValid() {
    return (
      this.username &&
      typeof this.username === "string" &&
      this.username.trim().length > 3
    );
  }
}

module.exports = {
  UsernameValidator,
};
