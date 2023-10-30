const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../src/app");

const api = supertest(app);
const api_url = "/api/blogs";

const helper = require("./test_helper");
const Blog = require("../src/models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogList);
});

describe("blog list API", () => {
  test("(response) is returned as json", async () => {
    await api
      .get(api_url)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("returns the correct amount of blog posts", async () => {
    const response = await api.get(api_url);
    expect(response.body).toHaveLength(helper.initialBlogList.length);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
