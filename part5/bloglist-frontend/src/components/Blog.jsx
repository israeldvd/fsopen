import { useState } from "react"

const Blog = (
  /** @type {{ blog: any, updatePost: (blog: { id: string; title?: string; author?: string; url?: string; likes: number;}) => any }} **/
  { blog, updatePost }
) => {
  // visibility status (state, text and display mode)
  const [visible, setVisible] = useState(false);
  const showWhenVisible = { display: (visible) ? '' : 'none' }
  const visibilityTextButton = (visible) ? 'hide' : 'details'

  // dynamic blog detail
  const [displayLikes, setDisplayLikes] = useState(blog.likes)

  // styles
  const blogStyle = {
    border: 'solid',
    borderRadius: '0.2rem',
    borderWidth: '0.1rem',
    padding: '20px',
    marginBottom: '1rem',
    width: '50%',
    minHeight: '20px',
    overflow: 'hidden'
  }

  const headerStyle = { fontWeight: '600', display: 'flex', justifyContent: 'space-between' }

  // event handlers
  // detail visiblity button
  const toggleVisibility = () => {
    setVisible(!visible)
  }

  // like button
  const giveLike = () => {
    const success = updatePost(
      {
        id: blog.id,
        likes: blog?.likes + 1 || 0
      }
    )

    if (success) {
      setDisplayLikes((/** @type {number} */ currLikes) => currLikes + 1)
    }
  }

  return (
    <div style={blogStyle}>
      <section style={headerStyle}>
        {blog.title} {blog.author ? blog.author.name : "(unknown author)"}
        <button onClick={toggleVisibility}>
          {visibilityTextButton}
        </button>
      </section>
      <section style={showWhenVisible}>
        <p>
          {blog.url}
        </p>
        <p>
          {displayLikes} <button onClick={giveLike}>like</button>
        </p>
        <p>
          {blog?.user?.name}
        </p>
      </section>
    </div>
  )
}

export default Blog
