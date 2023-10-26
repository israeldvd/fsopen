const last = require("lodash.last");
const toPairs = require("lodash.topairs");
const maxBy = require("lodash.maxby");
const countBy = require("lodash.countby");
const groupBy = require("lodash.groupby");
const sumBy = require("lodash.sumby");
const lodashMap = require("lodash.map");

const dummy = () => {
  return 1;
};

const totalLikes = (blogs) => {
  const total = blogs.reduce((sum, blog) => {
    return sum + blog.likes;
  }, 0);
  return total;
};

const favoriteBlog = (blogs) => {
  if (!blogs || blogs.length === 0) {
    return null;
  }

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
    return null;
  }

  const [author, numOfBlogs] = maxBy(pairs, last);

  return { author, blogs: numOfBlogs };
};

const mostLikes = (blogs) => {
  if (!blogs || blogs.length === 0) {
    return null;
  }

  const postsGroupedByAuthor = groupBy(blogs, "author");

  const mostLikesPosts = lodashMap(
    postsGroupedByAuthor,
    (authorPosts, author) => {
      const likes = sumBy(authorPosts, "likes");

      return {
        author,
        likes,
      };
    }
  );

  const mostLikesResult = maxBy(mostLikesPosts, "likes");

  return mostLikesResult;
};

module.exports = {
  dummy,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  totalLikes,
};
