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
  const newMockPost = {
    _id: "654aee48fc13ae08472fa60f",
    name: "Hieronymus Harsant",
    title: "Nurse",
    url: "https://slate.com",
    likes: 10,
    __v: 0,
  };

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

  test("(response) blog posts unique identifier property is named id", async () => {
    const response = await api.get(api_url);

    response.body.forEach((blog) => {
      expect(blog.id).toBeDefined();
    });
  });

  test("a valid blog post can be added", async () => {
    await api
      .post(api_url)
      .send({
        ...newMockPost,
      })
      .set("Content-Type", "application/json")
      .expect(201);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogList.length + 1);

    // the new list of blog should contain the title
    const blogTitles = blogsAtEnd.map((blog) => {
      return blog.title;
    });
    expect(blogTitles).toContain(newMockPost.title);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
