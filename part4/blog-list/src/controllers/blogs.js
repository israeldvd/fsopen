const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const { blogPopulateSelectionOptions } = require("../models/model-options");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate(
    "author",
    blogPopulateSelectionOptions
  );

  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const body = request.body;

  if (!body || !("title" in body)) {
    response.status(400).json({ error: "Blog information cannot be empty." });
    return;
  }

  // picking an user for this blog
  const foundUsersList = await User.find({});
  const selectedUser = foundUsersList[0];
  body.author = selectedUser._id; // the first one

  const blog = new Blog(body);

  const result = await blog.save();

  // update the user document
  selectedUser.blogs = selectedUser.blogs.concat(result._id);
  await selectedUser.save();

  // response
  response.status(201).json(result);
});

blogsRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id);

  response.status(204).end();
});

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
