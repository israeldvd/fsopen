jest.mock("bcrypt", () => ({
  isValid: true,

  async hash(value, saltOrRounds) {
    this.value = value;
    this.saltOrRounds = saltOrRounds;
    this.hash_value = "hashed_value";
    return this.hash_value;
  },
  async compare(value, hash) {
    this.value = value;
    this.hash = hash;
    return this.isValid;
  },
}));

const Encrypter = require("../src/utils/helpers/encrypter");
const bcrypt = require("bcrypt");
const { MissingParamError } = require("../src/utils/errors/params");

describe("Encrypter", () => {
  const anyValueStr = "any_value";

  describe("when hashing a value", () => {
    test("should return a new hash", async () => {
      const sut = new Encrypter();
      const hash = await sut.encrypt(anyValueStr);
      expect(hash).toBe("hashed_value");
    });
  });

  describe("when comparing value and hash", () => {
    test("should return true when hash value matches", async () => {
      const sut = new Encrypter();
      const isValid = await sut.compare(anyValueStr, "hashed_value");

      expect(isValid).toBe(true);
    });

    test("should return false if hash value does not match", async () => {
      const sut = new Encrypter();
      bcrypt.isValid = false;
      const isValid = await sut.compare("unmatching_value", "hashed_value");

      expect(isValid).toBe(false);
    });

    test("should throw if no params are provided", async () => {
      const sut = new Encrypter();

      expect(sut.compare()).rejects.toThrow(
        new MissingParamError("missing value")
      );
      expect(sut.compare(anyValueStr)).rejects.toThrow(
        new MissingParamError("missing hash")
      );
    });
  });
});
