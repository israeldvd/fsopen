const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});

  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const body = request.body;

  if (!body || !("title" in body)) {
    response.status(400).json({ error: "Blog information cannot be empty." });
    return;
  }

  const blog = new Blog(body);

  const result = await blog.save();
  response.status(201).json(result);
});

module.exports = blogsRouter;
