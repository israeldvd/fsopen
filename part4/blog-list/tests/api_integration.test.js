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
const { CredentialsRefusedError } = require("../src/utils/errors/credentials");
const { JsonWebTokenError } = require("jsonwebtoken");

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

  let authTokenOfLoggedinUser = "";

  // the first blog has the second author as its creator/author
  const helperBlogB0WithAnAuthor = helper.initialIntegrationBlogs[0];
  const helperAuthorOfBlogB0 = helper.initialIntegrationUsers[1]; // this is chosen by hand

  let authTokenOfAuthorOfB0 = "";
  let blogB0Id = "";

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

    // find the ID attributd to B0
    const blogB0FromDb = await Blog.findOne({
      title: helperBlogB0WithAnAuthor.title,
    });
    blogB0Id = blogB0FromDb._id;

    // login the author of B0
    const loginResponse = await api
      .post(api_login_url)
      .send(helperAuthorOfBlogB0);

    // the token should be 'mocked'
    expect(loginResponse.body.access_token).toEqual(expect.any(String));
    authTokenOfAuthorOfB0 = loginResponse.body.access_token;

    // login of the 'logged-in' user
    const dummyUserLoginResponse = await api
      .post(api_login_url)
      .send(loggedInUserData);

    // response definition
    authTokenOfLoggedinUser = dummyUserLoginResponse.body.access_token;
  }, 100000);

  afterEach(async () => {
    jest.restoreAllMocks();
  });

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
    test("a valid blog post can be added", async () => {
      await api
        .post(api_blogs_url)
        .send({
          ...dummyNewPost,
        })
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${authTokenOfLoggedinUser}`)
        .expect(201);

      const blogsAtEnd = await helper.blogsInDb();
      expect(blogsAtEnd).toHaveLength(helperBlogs.length + 1);

      // the new list of blog should contain the title
      const blogTitles = blogsAtEnd.map((blog) => {
        return blog.title;
      });
      expect(blogTitles).toContain(dummyNewPost.title);
    });

    test("missing property 'likes' is default to value 0", async () => {
      const response = await api
        .post(api_blogs_url)
        .send({ ...dummyNewPost, likes: undefined })
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${authTokenOfLoggedinUser}`)
        .expect(201);

      expect(response.body.likes).toEqual(0);
    });

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

      const blogsAtEnd = await helper.blogsInDbPopulated();
      const blogsAndAuthors = blogsAtEnd
        .filter((blog) => {
          return blog.author !== null;
        })
        .map((blog) => {
          return {
            title: blog.title,
            url: blog.url,
            author: blog.author, // ObjectID (but populated)
          };
        });

      // test when a valid blog is added having an user as its creator (identified by the auth token)
      expect(blogsAndAuthors).toContainEqual({
        title: dummyNewPost.title,
        url: dummyNewPost.url,
        author: {
          username: loggedInUserData.username,
          id: expect.any(String),
        },
      });
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

    it("fails with the code 401 Unauthorized if a token is not provided", async () => {
      const unauthorizedErrorResponse = HttpResponse.unauthorized(
        new JsonWebTokenError("jwt must be provided")
      );

      const response = await api
        .post(api_blogs_url)
        .send(dummyNewPost)
        // .set("Authorization", "") // Missing auth token
        .expect(unauthorizedErrorResponse.code);

      expect(response.body).toEqual(unauthorizedErrorResponse.body);
    });
  });

  describe("deleting a blog post after checking auth status", () => {
    test("a Bad Request response is sent when id is invalid", async () => {
      const inexistentID = await helper.nonExistingId();

      await api
        .delete(`${api_blogs_url}/${inexistentID}`)
        .set("Authorization", `Bearer ${authTokenOfLoggedinUser}`)
        .expect(400);

      // nothing is changed from the initial list
      const blogsAtEnd = await helper.blogsInDb();
      expect(blogsAtEnd).toHaveLength(helperBlogs.length);
    });

    test("a blog can be deleted by its creator", async () => {
      // send a delete request (user is supposed to be logged in)
      const response = await api
        .delete(`${api_blogs_url}/${blogB0Id._id.toString()}`)
        .set("Authorization", `Bearer ${authTokenOfAuthorOfB0}`)
        .expect(204);

      expect(response.body).toStrictEqual({});

      // the blog list (end) should have one less blog
      const blogsAtEnd = await helper.blogsInDb();
      expect(blogsAtEnd).toHaveLength(helperBlogs.length - 1);

      // the title should be in the (end) list anymore
      const titlesAtEnd = blogsAtEnd.map((blog) => {
        return blog.title;
      });
      expect(titlesAtEnd).not.toContain(helperBlogB0WithAnAuthor.title);
    });

    test("a blog cannot be deleted another user other than its creator", async () => {
      // the user token (different that the blog's author)
      const authToken = authTokenOfLoggedinUser;
      expect(authToken).not.toEqual(authTokenOfAuthorOfB0);

      // an unauthorized request is expect
      const forbiddenReceivedResponse = HttpResponse.forbidden(
        new CredentialsRefusedError("user")
      );

      // send a delete request (user is supposed to be logged in)
      await api
        .delete(`${api_blogs_url}/${blogB0Id._id.toString()}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(forbiddenReceivedResponse.code);

      // the blog list (end) should NOT change in size
      const blogsAtEnd = await helper.blogsInDb();
      expect(blogsAtEnd).toHaveLength(helperBlogs.length);

      // the title should NOT be removed from the (end) list
      const titlesAtEnd = blogsAtEnd.map((blog) => {
        return blog.title;
      });
      expect(titlesAtEnd).toContain(helperBlogB0WithAnAuthor.title);
    });

    test("an unauthorized response is sent for a request without an auth token", async () => {
      // an unauthorized request is expected
      const unauthorizedResponse = HttpResponse.unauthorized(
        new JsonWebTokenError("jwt must be provided") // assumes jsonwebtoken is the token provider and verifier
      );

      const response = await api
        .delete(`${api_blogs_url}/${blogB0Id._id.toString()}`)
        // .set("Authorization", "") // equivalent to...
        .expect(unauthorizedResponse.code);

      expect(response.body).toEqual(unauthorizedResponse.body);
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
