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

class PasswordValidator {
  constructor(password) {
    this.password = password;
  }

  isValid() {
    return (
      this.password &&
      typeof this.password === "string" &&
      this.password.trim().length > 3
    );
  }
}

module.exports = {
  UsernameValidator,
  PasswordValidator,
};
