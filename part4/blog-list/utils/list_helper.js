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
  return favorite;
};

module.exports = {
  dummy,
  favoriteBlog,
  totalLikes,
};