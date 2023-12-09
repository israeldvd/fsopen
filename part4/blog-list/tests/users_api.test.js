const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const { initialUsersList } = require("./test_helper");
const Encrypter = require("../src/utils/encrypter");

const api = supertest(app);
const api_url = "/api/users";

const helper = require("./test_helper");

describe("when there are many users added", () => {
  beforeAll(async () => {
    await User.deleteMany({});

    const encrypter = new Encrypter();

    const promiseArray = initialUsersList.map(async (user) => {
      const hash = await encrypter.encrypt(user.password);
      return {
        ...user,
        passwordHash: hash,
      };
    });

    const initialUsersListWithHashes = await Promise.all(promiseArray);
    await User.insertMany(initialUsersListWithHashes);
  });

  test("users are returned as json", async () => {
    await api
      .get(api_url)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all users are returned", async () => {
    const response = await api.get(api_url);

    // the response length is the same as the initial list
    expect(response.body).toHaveLength(helper.initialUsersList.length);
  });

  test("a specific username is withing the users", async () => {
    const response = await api.get(api_url);

    const usernames = response.body.map((user) => user.username);
    expect(usernames).toContain(helper.initialUsersList[0].username);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
