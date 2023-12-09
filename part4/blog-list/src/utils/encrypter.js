const bcrypt = require("bcrypt");
const { MissingParamError } = require("./errors/params");

module.exports = class Encrypter {
  async encrypt(value) {
    if (!value) {
      throw new MissingParamError("missing value");
    }

    return await bcrypt.hash(value, 12);
  }
};
