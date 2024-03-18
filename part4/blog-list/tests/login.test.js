const mongoose = require("mongoose");
const User = require("../src/models/user");
const helper = require("./test_helper");
const app = require("../src/app");
const supertest = require("supertest");
const HttpResponse = require("../src/utils/helpers/http-response");
const { InvalidCredentialsError } = require("../src/utils/errors/credentials");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../src/utils/helpers/config");

// api object and info
const api = supertest(app);
const api_url = "/api/login";

describe("when there are some users signed up", () => {
  // user list used throughout this test file
  const helperUsers = helper.initialLoginUserList;

  // dummy data used for all log-in tests
  let dummyLoginData = {
    id: null, // dummy list does not have an ID field (it is DB-generated)
    username: "invalid_username",
    password: "invalid_password",
  };

  let dummyLoginResponse = {
    username: dummyLoginData.username,
    access_token: "jwt_access_token",
    name: "Invalid name",
  };

  beforeEach(async () => {
    await User.deleteMany({});
    await User.insertMany(await helper.transformUserListForDb(helperUsers));

    // dummy generic data stems from the first user
    dummyLoginData.username = helperUsers[0].username;
    dummyLoginData.password = helperUsers[0].password;

    // username
    dummyLoginResponse.username = dummyLoginData.username;
    dummyLoginResponse.name = helperUsers[0].name;
  });

  describe("Login route", () => {
    it("should successfully login a user with valid credentials", async () => {
      // JWT-related configuration
      expect(SECRET).toBeDefined();
      const jwtSignSpy = jest
        .spyOn(jwt, "sign")
        .mockReturnValue("jwt_access_token");

      // response definition
      const okResponse = HttpResponse.ok({
        access_token: dummyLoginResponse.access_token,
        username: dummyLoginData.username,
        name: dummyLoginResponse.name,
      });

      // request-response cycle
      const response = await api
        .post(api_url)
        .send(dummyLoginData)
        .expect(okResponse.code);

      expect(response.body).toEqual(okResponse.body);

      // verification on JWT-related method spy
      expect(jwtSignSpy).toHaveBeenCalledWith(
        {
          id: expect.any(String),
          username: dummyLoginData.username,
          name: dummyLoginResponse.name,
        },
        SECRET
      );
      jwtSignSpy.mockRestore();
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
