const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const { blogPopulateSelectionOptions } = require("../models/model-options");
const { CredentialsRefusedError } = require("../utils/errors/credentials");
const { InvalidParamError } = require("../utils/errors/params");
const HttpResponse = require("../utils/helpers/http-response");
const middleware = require("../utils/helpers/middleware");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate(
    "author",
    blogPopulateSelectionOptions
  );

  response.json(blogs);
});

blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  // finding the creator of the blog
  const selectedUser = request.user;

  if (!selectedUser) {
    const unauthorizedResponse = HttpResponse.unauthorized(
      new Error("invalid token")
    );
    return response
      .status(unauthorizedResponse.code)
      .json(unauthorizedResponse.body);
  }

  const body = request.body;

  if (!body || !("title" in body)) {
    response.status(400).json({ error: "Blog information cannot be empty." });
    return;
  }

  const blog = new Blog({
    title: body.title,
    likes: body.likes,
    url: body.url,
    author: selectedUser._id,
    _id: body._id,
  });
  const result = await blog.save();

  // update the user document
  selectedUser.blogs = selectedUser.blogs.concat(result._id);
  await selectedUser.save();

  // response
  response.status(201).json(result);
});

blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    const blog = await Blog.findById(request.params.id);

    if (!blog) {
      const badRequestResponse = HttpResponse.badRequest(
        new InvalidParamError("id")
      );

      return response
        .status(badRequestResponse.code)
        .json(badRequestResponse.body);
    }

    if (!request.user) {
      const unauthorizedResponse = HttpResponse.unauthorized(
        new Error("invalid token")
      );

      return response
        .status(unauthorizedResponse.code)
        .json(unauthorizedResponse.body);
    }

    // user is found but is different that the blog's creator
    if (blog.author._id.toString() !== request.user._id.toString()) {
      const forbiddenReceivedResponse = HttpResponse.forbidden(
        new CredentialsRefusedError("user")
      );

      return response
        .status(forbiddenReceivedResponse.code)
        .json(forbiddenReceivedResponse.body);
    }

    await blog.deleteOne();

    response.status(204).end();
  }
);

blogsRouter.patch("/:id", async (request, response) => {
  const { title, url, likes, author } = request.body;

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { title, url, likes, author },
    { runValidators: true, context: "query" }
  );

  if (!updatedBlog) {
    response.status(404).end();
  } else {
    response
      .status(201)
      .json({ message: `Blog post ${updatedBlog.id} updated!` });
  }
});

module.exports = blogsRouter;
