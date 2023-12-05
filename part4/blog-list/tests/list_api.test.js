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

describe("when there is initially some blogs saved", () => {
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

  describe("addition of a new blog", () => {
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

    test("an empty blog is not added", async () => {
      const response = await api
        .post(api_url)
        .send({})
        .set("Content-Type", "application/json")
        .expect(400);

      const blogsAtEnd = await helper.blogsInDb();

      expect(response.body.error).toBeDefined();
      expect(blogsAtEnd).toHaveLength(helper.initialBlogList.length);
    });

    test("missing property 'likes' is default to value 0", async () => {
      const response = await api
        .post(api_url)
        .send({ ...newMockPost, likes: undefined })
        .set("Content-Type", "application/json")
        .expect(201);

      expect(response.body.likes).toEqual(0);
    });

    test("receiving a blog without a title responds with Bad Request", async () => {
      const newNote = { ...newMockPost, title: "" };
      const newNoteHavingUndefinedTitle = { ...newMockPost, title: undefined };

      await api.post(api_url).send(newNote).expect(400);
      await api.post(api_url).send(newNoteHavingUndefinedTitle).expect(400);

      const notesAtEnd = await helper.blogsInDb();
      expect(notesAtEnd).toHaveLength(helper.initialBlogList.length);
    });

    test("receiving a blog without an url responds with Bad Request", async () => {
      const newNote = { ...newMockPost, url: "" };
      const newNoteHavingUndefinedUrl = { ...newMockPost, url: undefined };

      await api.post(api_url).send(newNote).expect(400);
      await api.post(api_url).send(newNoteHavingUndefinedUrl).expect(400);

      const notesAtEnd = await helper.blogsInDb();
      expect(notesAtEnd).toHaveLength(helper.initialBlogList.length);
    });
  });

  describe("deletion of a blog", () => {
    test("succeeds with status code 204 when id is valid", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToDelete = blogsAtStart[0];

      if (!blogToDelete) {
        return false;
      }

      await api.delete(`${api_url}/${blogToDelete.id}`).expect(204);

      const blogsAtEnd = await helper.blogsInDb();
      expect(blogsAtEnd).toHaveLength(helper.initialBlogList.length - 1);
    });

    test("still returns status code 204 when id is invalid", async () => {
      const inexistentID = await helper.nonExistingId();

      await api.delete(`${api_url}/${inexistentID}`).expect(204);

      // nothing is changed from the initial list
      const blogsAtEnd = await helper.blogsInDb();
      expect(blogsAtEnd).toHaveLength(helper.initialBlogList.length);
    });

    test("returns status code 400 when id is malformatted", async () => {
      const malformattedId = "123abc";

      await api.delete(`${api_url}/${malformattedId}`).expect(400);

      // nothing is changed from the initial list
      const blogsAtEnd = await helper.blogsInDb();
      expect(blogsAtEnd).toHaveLength(helper.initialBlogList.length);
    });
  });

  describe("updating a blog post", () => {
    test("succeeds with valid data and id", async () => {
      const id = helper.initialBlogList[0]._id;
      const newTitle = "A new version is coming";

      const payload = { title: newTitle };

      await api.patch(`${api_url}/${id}`)
        .send(payload)
        .set("Content-Type", "application/json").expect(201);
    });

    test("fails with status code 400 when id is invalid", async () => {
      const malformattedId = "123abc";

      await api.patch(`${api_url}/${malformattedId}`).expect(400);
    })
  })
});

afterAll(async () => {
  await mongoose.connection.close();
});
