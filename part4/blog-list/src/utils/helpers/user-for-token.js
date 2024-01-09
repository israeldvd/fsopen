const jwt = require("jsonwebtoken");

module.exports = class UserForToken {
  static secret = process.env.GENERIC_SECRET;

  static generate(id, username) {
    return jwt.sign(
      {
        username: username,
        id: id,
      },
      UserForToken.secret
    );
  }

  static getPayload(token) {
    return jwt.verify(token, UserForToken.secret);
  }
};
