const mongoose = require("mongoose");
const User = require("../src/models/user");
const helper = require("./test_helper");
const app = require("../src/app");
const supertest = require("supertest");
const HttpResponse = require("../src/utils/helpers/http-response");
const { InvalidCredentialsError } = require("../src/utils/errors/credentials");

// api object and info
const api = supertest(app);
const api_url = "/api/login";

describe("when there are some users signed up", () => {
  // dummy data used for all log-in tests
  let dummyLoginData = {
    username: "invalid_username",
    password: "invalid_password",
  };

  let dummyLoginResponse = {
    username: dummyLoginData.username,
    access_token: "jwt_access_token",
  };

  beforeEach(async () => {
    await User.deleteMany({});
    const initialUsersListForDb = await helper.getInitialUserListForDb();
    await User.insertMany(initialUsersListForDb);

    // dummy generic data stems from the first user
    dummyLoginData.username = initialUsersListForDb[0].username;
    dummyLoginData.password = initialUsersListForDb[0].password;

    // username
    dummyLoginResponse.username = dummyLoginData.username;
  });

  describe("Login route", () => {
    it("should successfully login a user with valid credentials", async () => {
      const okResponse = HttpResponse.ok();

      await api.post(api_url).send(dummyLoginData).expect(okResponse.code);
    });

    it("should return 401 Unauthorized if invalid credentials are provided", async () => {
      dummyLoginData.password = "invalid_credential";
      const unauthorizedResponse = HttpResponse.unauthorized(
        new InvalidCredentialsError(dummyLoginData.username)
      );

      await api
        .post(api_url)
        .send(dummyLoginData)
        .expect(unauthorizedResponse.code);
    });

    it("should return 401 Unauthorized if a username that is not signed up is provided", async () => {
      dummyLoginData.username = "inexistent_username";
      const unauthorizedResponse = HttpResponse.unauthorized(
        new InvalidCredentialsError(dummyLoginData.username)
      );

      await api
        .post(api_url)
        .send(dummyLoginData)
        .expect(unauthorizedResponse.code);
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
