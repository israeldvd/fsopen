const mongoose = require("mongoose");
const User = require("../src/models/user");
const helper = require("./test_helper");
const app = require("../src/app");
const supertest = require("supertest");
const HttpResponse = require("../src/utils/helpers/http-response");

// api object and info
const api = supertest(app);
const api_url = "/api/login";

describe("when there are some users signed up", () => {
  // dummy data used for all log-in tests
  let dummyLoginData;

  beforeEach(async () => {
    await User.deleteMany({});
    const initialUsersListForDb = await helper.getInitialUserListForDb();
    await User.insertMany(initialUsersListForDb);

    // dummy generic data is from the first user
    dummyLoginData = {
      usename: initialUsersListForDb[0].username,
      password: initialUsersListForDb[0].password,
    };
  });

  describe("Login route", () => {
    it("should successfully login a user with valid credentials", async () => {
      const okResponse = HttpResponse.ok();
      await api.post(api_url).send(dummyLoginData).expect(okResponse.code);
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});