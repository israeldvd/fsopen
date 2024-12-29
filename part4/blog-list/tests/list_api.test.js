const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../src/app");

const api = supertest(app);
const api_url = "/api/blogs";

const helper = require("./test_helper");
const Blog = require("../src/models/blog");
const UserForToken = require("../src/utils/helpers/user-for-token");
const User = require("../src/models/user");

describe("when there are initially some blogs saved", () => {
  // the blog list used throughout this test file
  const helperBlogs = helper.initialBlogList;

  const dummyNewPost = {
    _id: "654aee48fc13ae08472fa60f",
    authorId: "65936a0178a367a01b097430", // "Hieronymus Harsant",
    title: "Nurse",
    url: "https://slate.com",
    likes: 10,
    __v: 0,
  };

  beforeAll(() => {
    // payload obtained from JWT verify is not tested here
    jest
      .spyOn(UserForToken, "getPayload")
      .mockReturnValue({ id: "a-valid-logged-in-user-id" });

    // select which user is querying the blogs (id of MIchael Chan)
    jest.spyOn(User, "findById").mockReturnValue({ username: "username", name: "name", "blogs": [], "_id": "65936732fc13ae59bafa21f8", save: () => void 0 })
  });

  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helperBlogs);
  });

  test("(response) is returned as json", async () => {
    await api
      .get(api_url)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("returns the correct amount of blog posts", async () => {
    const response = await api.get(api_url);
    expect(response.body).toHaveLength(helperBlogs.length);
  });

  test("(response) blog posts unique identifier property is named id", async () => {
    const response = await api.get(api_url);

    response.body.forEach((blog) => {
      expect(blog.id).toBeDefined();
    });
  });

  describe("addition of a new blog", () => {
    test("an empty blog is not added", async () => {
      const response = await api
        .post(api_url)
        .send({})
        .set("Content-Type", "application/json")
        .expect(400);

      const blogsAtEnd = await helper.blogsInDb();

      expect(response.body.error).toBeDefined();
      expect(blogsAtEnd).toHaveLength(helperBlogs.length);
    });

    test("receiving a blog without a title responds with Bad Request", async () => {
      const newNote = { ...dummyNewPost, title: "" };
      const newNoteHavingUndefinedTitle = { ...dummyNewPost, title: undefined };

      await api.post(api_url).send(newNote).expect(400);
      await api.post(api_url).send(newNoteHavingUndefinedTitle).expect(400);

      const notesAtEnd = await helper.blogsInDb();
      expect(notesAtEnd).toHaveLength(helperBlogs.length);
    });

    test("receiving a blog without an url responds with Bad Request", async () => {
      const newNote = { ...dummyNewPost, url: "" };
      const newNoteHavingUndefinedUrl = { ...dummyNewPost, url: undefined };

      await api.post(api_url).send(newNote).expect(400);
      await api.post(api_url).send(newNoteHavingUndefinedUrl).expect(400);

      const notesAtEnd = await helper.blogsInDb();
      expect(notesAtEnd).toHaveLength(helperBlogs.length);
    });

    test("receiving a blog with the respective user", async () => {
      const newBlog = { ...dummyNewPost, user: dummyNewPost.authorId };

      // sending resquest with a new blog containing a user reference
      const response = await api.post(api_url).send(newBlog).expect(201);

      // check if list size has changed
      // and if blog data is returned
      const notesAtEnd = await helper.blogsInDb();
      expect(notesAtEnd).toHaveLength(helperBlogs.length + 1);

      // response body format
      expect(response.body).toMatchObject({ user: newBlog.user })
    });
  });

  describe("deletion of a blog", () => {
    test("returns status code 400 when id is malformatted", async () => {
      const malformattedId = "123abc";

      await api.delete(`${api_url}/${malformattedId}`).expect(400);

      // nothing is changed from the initial list
      const blogsAtEnd = await helper.blogsInDb();
      expect(blogsAtEnd).toHaveLength(helperBlogs.length);
    });
  });

  describe("updating a blog post", () => {
    test("succeeds with valid title and ID", async () => {
      const firstDummyBlog = helperBlogs[0];
      const blogId = firstDummyBlog._id;

      // new blog information
      // should have its title changed to the same title (there would be no changes at all)
      const patchedBlog = { title: dummyNewPost.title, id: blogId };
      expect(patchedBlog.title).not.toBe(firstDummyBlog.title);

      // make a request patch request
      // make change only to the title
      const blogTitleOnlyPatchPayload = { title: patchedBlog.title };
      await api
        .patch(`${api_url}/${blogId}`)
        .send(blogTitleOnlyPatchPayload)
        .set("Content-Type", "application/json")
        .expect(201);

      // check the latter state
      const blogsAtEnd = await helper.blogsInDb();
      const partialBlogs = blogsAtEnd.map((blog) => {
        return { title: blog.title, id: blog.id };
      });

      // the new title should be stored
      // into the same blog document
      expect(partialBlogs).toContainEqual({
        title: patchedBlog.title,
        id: patchedBlog.id,
      });
    });

    test("succeeds with multiple valid data and ID", async () => {
      const firstBlog = helperBlogs[0];
      const blogId = firstBlog._id; // ID of blog to be updated

      const patchedBlog = {
        title: dummyNewPost.title,
        author: dummyNewPost.authorId,
        likes: dummyNewPost.likes,
        url: dummyNewPost.url,
        id: blogId,
      };

      // blog post data payloads
      // makes up the body for request
      const blogPatchPayload = {
        title: patchedBlog.title,
        author: patchedBlog.author,
        likes: patchedBlog.likes,
        url: patchedBlog.url,
      };

      // send a request for each kind of payload (complete or not)
      await api
        .patch(`${api_url}/${blogId}`)
        .send(blogPatchPayload)
        .set("Content-Type", "application/json")
        .expect(201);

      // check the latter state
      const blogsAtEnd = await helper.blogsInDb();
      const titles = blogsAtEnd.map((blog) => blog.title);

      expect(titles).toContain(blogPatchPayload.title);
      expect(blogsAtEnd).toContainEqual({
        ...patchedBlog,
        author: new mongoose.Types.ObjectId(blogPatchPayload.author), // dummy data's author is pure string, but blogs at database have id as ObjectId
      });
    });

    test("fails with status code 400 when id is invalid", async () => {
      const malformattedId = "123abc";

      await api.patch(`${api_url}/${malformattedId}`).expect(400);
    });

    test("fails with status code 400 when any required field is empty", async () => {
      const id = helperBlogs[0]._id; // id to be updated

      // either title or url is empty
      await api.patch(`${api_url}/${id}`).send({ title: "" }).expect(400);
      await api.patch(`${api_url}/${id}`).send({ url: "" }).expect(400);
    });

    test("with an user ID while defining new likes count", async () => {
      const user = dummyNewPost.authorId;
      const id = helperBlogs[0]._id

      // check if response is successful
      await api.patch(`${api_url}/${id}`).send({ likes: 1, user }).expect(201)

      // check if user is registered
      const res = await api.get(`${api_url}`)

      // check if user id is present
      const listOfUsers = res.body.map((blogs) => (blogs.user))
      expect(listOfUsers).toContain(user)
    })
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
