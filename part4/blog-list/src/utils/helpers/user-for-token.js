const jwt = require("jsonwebtoken");
const { SECRET } = require("./config");

module.exports = class UserForToken {
  static secret = SECRET;

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
    return jwt.verify(token, UserForToken.secret).payload;
  }
};
