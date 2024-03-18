const jwt = require("jsonwebtoken");
const { SECRET } = require("./config");

module.exports = class UserForToken {
  static secret = SECRET;

  static generate(id, username, name) {
    return jwt.sign(
      {
        username: username,
        id: id,
        name: name,
      },
      UserForToken.secret
    );
  }

  static getPayload(token) {
    return jwt.verify(token, UserForToken.secret);
  }
};
