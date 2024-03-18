const Blog = ({ blog }) => (
  <div>
    {blog.title} {blog.author ? blog.author.name : "(unknown author)"}
  </div>
);

export default Blog;
