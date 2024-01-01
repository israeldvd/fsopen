const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const { initialUsersList } = require("./test_helper");
const Encrypter = require("../src/utils/helpers/encrypter");

const api = supertest(app);
const api_url = "/api/users";

const helper = require("./test_helper");
const {
  MissingParamError,
  InvalidParamError,
} = require("../src/utils/errors/params");
const HttpResponse = require("../src/utils/helpers/http-response");
const ConflictError = require("../src/utils/errors/resources");

describe("when there are many users added", () => {
  let dummyUserData;

  beforeEach(async () => {
    dummyUserData = {
      username: "any_username",
      name: "Any Name",
      password: "any_Password",
    };

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
    const httpOkResponse = HttpResponse.ok({ message: "any message" });

    await api
      .get(api_url)
      .expect(httpOkResponse.code)
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

      const response = await api
        .post(api_url)
        .send({
          username: emptyUserName,
          name: "Any Name",
          password: "any_password",
        })
        .expect(badRequestResponse.code);
      expect(response.body).toEqual(badRequestResponse.body);

      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd).toHaveLength(helper.initialUsersList.length);
    });

    test("should respond with a Bad Request for an invalid password", async () => {
      const emptyPassword = "";
      dummyUserData.password = emptyPassword;

      const badRequestResponse = HttpResponse.badRequest(
        new MissingParamError("password")
      );

      // api request-response cycle
      const response = await api
        .post(api_url)
        .send(dummyUserData)
        .expect(badRequestResponse.code);

      expect(response.body).toEqual(badRequestResponse.body);

      // query the database for users
      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd).toHaveLength(helper.initialUsersList.length);
    });

    test("succeeds with valid user data", async () => {
      const createdResponse = HttpResponse.created({
        ...dummyUserData,
        password: undefined,
        blogs: [],
      });

      // send new user data
      // ignore any ID that is generated on-the-fly
      const response = await api
        .post(api_url)
        .send(dummyUserData)
        .expect(createdResponse.code);

      expect({ ...response.body, id: "user_generated_id" }).toEqual({
        ...createdResponse.body,
        id: "user_generated_id",
      });

      // query the database for users
      // there should be one more user
      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd).toHaveLength(helper.initialUsersList.length + 1);

      // username is stored
      const usernames = usersAtEnd.map((user) => {
        return user.username;
      });
      expect(usernames).toContain(dummyUserData.username);
    });

    test("fails with a Conflict response when username is already taken", async () => {
      const conflictResponse = HttpResponse.conflict(
        new ConflictError("user", ["username"])
      );

      // the user is saved here
      await api.post(api_url).send(dummyUserData);

      // a bad attempt (resquest sending the same username) is done then
      // username must be unique
      const secondResponse = await api
        .post(api_url)
        .send({
          name: "Another Name",
          password: "any_password_but_different",
          username: dummyUserData.username.toUpperCase(),
        })
        .expect(conflictResponse.code);

      expect(secondResponse.body).toEqual(conflictResponse.body);
    });

    test("fails with a Bad Request when username has less than 3 characters", async () => {
      dummyUserData.username = "sh"; // has a short username

      const response = await api.post(api_url).send(dummyUserData);

      const badRequestResponse = HttpResponse.badRequest(
        new InvalidParamError("username")
      );

      expect(response.body).toEqual(badRequestResponse.body);
    });

    test("fails with a Bad Request when password has less than 3 characters", async () => {
      dummyUserData.password = "sh"; // has a hhort password

      const badRequestResponse = HttpResponse.badRequest(
        new InvalidParamError("password")
      );

      const response = await api
        .post(api_url)
        .send(dummyUserData)
        .expect(badRequestResponse.code);

      expect(response.body).toEqual(badRequestResponse.body);
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
