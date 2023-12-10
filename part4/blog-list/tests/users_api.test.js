const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const { initialUsersList } = require("./test_helper");
const Encrypter = require("../src/utils/helpers/encrypter");

const api = supertest(app);
const api_url = "/api/users";

const helper = require("./test_helper");
const { MissingParamError } = require("../src/utils/errors/params");
const HttpResponse = require("../src/utils/helpers/http-response");

describe("when there are many users added", () => {
  beforeEach(async () => {
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

  describe("adding a specific user", () => {
    test("should respond with a Bad Request for an invalid username", async () => {
      const emptyUserName = "";
      const badRequestResponse = HttpResponse.badRequest(
        new MissingParamError("username")
      );

      await api
        .post(api_url)
        .send({
          username: emptyUserName,
          name: "Any Name",
          password: "any_password",
        })
        .expect(badRequestResponse.code);

      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd).toHaveLength(helper.initialUsersList.length);
    });

    test("should respond with a Bad Request for an invalid password", async () => {
      const emptyPassword = "";
      const badRequestResponse = HttpResponse.badRequest(
        new MissingParamError("password")
      );

      // api request-response cycle
      const response = await api
        .post(api_url)
        .send({
          username: "any_username",
          name: "Any Name",
          password: emptyPassword,
        })
        .expect(badRequestResponse.code);

      expect(response.body).toEqual(badRequestResponse.body);

      // query the database for users
      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd).toHaveLength(helper.initialUsersList.length);
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
