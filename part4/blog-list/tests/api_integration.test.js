const supertest = require("supertest");
const app = require("../src/app");

const api = supertest(app);
const api_blogs_url = "/api/blogs";
const api_users_url = "/api/users";
const api_login_url = "/api/login";

const helper = require("./test_helper");
const Blog = require("../src/models/blog");
const User = require("../src/models/user");
const mongoose = require("mongoose");
const HttpResponse = require("../src/utils/helpers/http-response");
const UserForToken = require("../src/utils/helpers/user-for-token");

describe("when there are some blogs and users saved", () => {
  // the (user and blog) lists used throughout this test file
  const helperUsers = helper.initialIntegrationUsers;
  const helperBlogs = helper.initialIntegrationBlogs;

  const dummyAuthorIdOfNewPost = "65936a0178a367a01b097430";

  let dummyNewPost = {
    _id: "inval1dID",
    authorId: "inval1dAuthorID", // "Hieronymus Harsant",
    title: "Invalid title",
    url: "https://invalid.com/",
    likes: 3,
    __v: 0,
  };

  // dummy data used for all log-in tests
  const loggedInUserData = {
    id: null, // dummy list does not have an ID field (it is DB-generated)
    username: "login_username",
    password: "login_password",
  };

  beforeEach(async () => {
    // save a new set of valid data
    dummyNewPost = {
      _id: "654aee48fc13ae08472fa60f",
      authorId: dummyAuthorIdOfNewPost, // "Hieronymus Harsant",
      title: "Learning a new lesson",
      url: "https://learn.com/new-lesson",
      likes: 201,
      __v: 0,
    };

    // update user collection
    await User.deleteMany({});
    await User.insertMany(
      await helper.transformUserListForDb(helperUsers.concat(loggedInUserData))
    );

    await Blog.deleteMany({});
    const dbSavesPromiseArray = helperBlogs.map(async (blogInfoObject) => {
      // save a new blog (having the creator's id)
      const blog = new Blog(blogInfoObject);
      await blog.save();

      // fetch all user (author) information
      // append it to the blogs field
      const user = await User.findById(blog.author);

      if (!user) {
        return null;
      }

      // save user info with this new blog
      user.blogs = user.blogs.concat(blog._id);
      return user.save();
    });

    await Promise.all(dbSavesPromiseArray);
  }, 100000);

  describe("viewing users", () => {
    test("users are returned with their respective blog(s)", async () => {
      const response = await api.get(api_users_url).expect(200);

      // response contains at least the first populated user in DB
      const populatedUsers = await helper.usersInDbPopulated();

      // verify that each user is populated correctly
      populatedUsers.forEach((user) => {
        expect(response.body).toContainEqual(user);
      });
    });
  });

  describe("viewing blog posts", () => {
    test("a blog has its author field populated", async () => {
      const response = await api.get(api_blogs_url);

      // response contains at least the first populated blog in DB
      const populatedBlogs = await helper.blogsInDbPopulated();
      populatedBlogs.forEach((popBlog) => {
        expect(response.body).toContainEqual(popBlog);
      });
    });
  });

  describe("adding a new post checking auth status", () => {
    test("a new post is added having the authenticated user as its creator", async () => {
      const loginResponse = await api
        .post(api_login_url)
        .send(loggedInUserData);

      // response definition
      const authToken = loginResponse.body.access_token;

      // a future response to a creation of a blog is ok
      const createdResponse = HttpResponse.created();

      await api
        .post(api_blogs_url)
        .send(dummyNewPost)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(createdResponse.code);
    });

    test("an error 401 Unauthorized is sent when auth token is invalid", async () => {
      const authToken = "auth-token";
      dummyNewPost.authorId = "invalid id";

      const getPayloadSpy = jest.spyOn(UserForToken, "getPayload");
      getPayloadSpy.mockReturnValue({
        undefined,
      });

      const unauthorizedErrorResponse = HttpResponse.unauthorized(
        new Error("invalid token")
      );

      const response = await api
        .post(api_blogs_url)
        .send(dummyNewPost)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(unauthorizedErrorResponse.code);

      expect(getPayloadSpy).toHaveBeenCalledWith(authToken);
      expect(response.body).toEqual(unauthorizedErrorResponse.body);
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
