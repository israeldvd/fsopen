const supertest = require("supertest");
const app = require("../src/app");

const api = supertest(app);
const api_blogs_url = "/api/blogs";
const api_users_url = "/api/users";

const helper = require("./test_helper");
const Blog = require("../src/models/blog");
const User = require("../src/models/user");
const mongoose = require("mongoose");

describe("when there are some blogs and users saved", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const initialUsersListForDb = await helper.getInitialUserListForDb();
    await User.insertMany(initialUsersListForDb);

    await Blog.deleteMany({});
    const dbSavesPromiseArray = helper.initialBlogList.map(
      async (blogInfoObject) => {
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
      }
    );

    await Promise.all(dbSavesPromiseArray);
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

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
