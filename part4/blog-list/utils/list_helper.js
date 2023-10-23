const last = require("lodash.last");
const toPairs = require("lodash.topairs");
const maxBy = require("lodash.maxby");
const countBy = require("lodash.countby");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const total = blogs.reduce((sum, blog) => {
    return sum + blog.likes;
  }, 0);
  return total;
};

const favoriteBlog = (blogs) => {
  const favorite = blogs.reduce((mostVotedBlog, blog) => {
    return blog.likes > mostVotedBlog.likes ? blog : mostVotedBlog;
  });
  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  };
};

const mostBlogs = (blogs) => {
  const authorsPostCount = countBy(blogs, "author");
  const pairs = toPairs(authorsPostCount);

  if (pairs.length === 0) {
    return { author: "", blogs: 0 };
  }

  const [author, numOfBlogs] = maxBy(pairs, last);

  return { author, blogs: numOfBlogs };
};

module.exports = {
  dummy,
  favoriteBlog,
  mostBlogs,
  totalLikes,
};
