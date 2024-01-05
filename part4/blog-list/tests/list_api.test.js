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

describe("when there are initially some blogs saved", () => {
  const dummyNewPost = {
    _id: "654aee48fc13ae08472fa60f",
    authorId: "65936a0178a367a01b097430", // "Hieronymus Harsant",
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

  describe("view of blog posts", () => {
    test("a blog has its author field populated", async () => {
      const response = await api.get(api_url);

      // response contains at least the first populated blog in DB
      const populatedBlogs = await helper.blogsInDbPopulated();
      expect(response.body).toContainEqual(populatedBlogs[0]);
    });
  });

  describe("addition of a new blog", () => {
    test("a valid blog post can be added", async () => {
      await api
        .post(api_url)
        .send({
          ...dummyNewPost,
        })
        .set("Content-Type", "application/json")
        .expect(201);

      const blogsAtEnd = await helper.blogsInDb();
      expect(blogsAtEnd).toHaveLength(helper.initialBlogList.length + 1);

      // the new list of blog should contain the title
      const blogTitles = blogsAtEnd.map((blog) => {
        return blog.title;
      });
      expect(blogTitles).toContain(dummyNewPost.title);
    });

    test("when a valid blog is added having the first user as its creator", async () => {
      await api
        .post(api_url)
        .send({
          ...dummyNewPost,
        })
        .set("Content-Type", "application/json");

      const newBlogAtEnd = await Blog.findById(dummyNewPost._id);
      const usersAtEnd = await helper.usersInDb();

      const firstUserID = usersAtEnd[0].id;
      expect(firstUserID).toEqual(newBlogAtEnd.author._id.toString());
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
        .send({ ...dummyNewPost, likes: undefined })
        .set("Content-Type", "application/json")
        .expect(201);

      expect(response.body.likes).toEqual(0);
    });

    test("receiving a blog without a title responds with Bad Request", async () => {
      const newNote = { ...dummyNewPost, title: "" };
      const newNoteHavingUndefinedTitle = { ...dummyNewPost, title: undefined };

      await api.post(api_url).send(newNote).expect(400);
      await api.post(api_url).send(newNoteHavingUndefinedTitle).expect(400);

      const notesAtEnd = await helper.blogsInDb();
      expect(notesAtEnd).toHaveLength(helper.initialBlogList.length);
    });

    test("receiving a blog without an url responds with Bad Request", async () => {
      const newNote = { ...dummyNewPost, url: "" };
      const newNoteHavingUndefinedUrl = { ...dummyNewPost, url: undefined };

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
    test("succeeds with valid title and ID", async () => {
      const firstDummyBlog = helper.initialBlogList[0];
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
      const firstBlog = helper.initialBlogList[0];
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
      const id = helper.initialBlogList[0]._id; // id to be updated

      // either title or url is empty
      await api.patch(`${api_url}/${id}`).send({ title: "" }).expect(400);
      await api.patch(`${api_url}/${id}`).send({ url: "" }).expect(400);
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
