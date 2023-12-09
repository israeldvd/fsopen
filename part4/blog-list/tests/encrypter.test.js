jest.mock("bcrypt", () => ({
  isValid: true,

  async hash(value, saltOrRounds) {
    this.value = value;
    this.saltOrRounds = saltOrRounds;
    this.hash_value = "hashed_value";
    return this.hash_value;
  },
}));

const Encrypter = require("../src/utils/encrypter");

describe("Encrypter", () => {
  const anyValueStr = "any_value";

  describe("when hashing a value", () => {
    test("should return a new hash", async () => {
      const sut = new Encrypter();
      const hash = await sut.encrypt(anyValueStr);
      expect(hash).toBe("hashed_value");
    });
  });
});
