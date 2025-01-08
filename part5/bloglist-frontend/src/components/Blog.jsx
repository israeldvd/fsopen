import { useState } from 'react'
import PropTypes from 'prop-types'


/**
 * The Blog post information.
 * @typedef {Partial<import("App").CreateBlogPostDto> & Pick<import("App").BlogPost, "id">} BlogPostUpdateDto
 */

/**
 * The Blog DTO used to delete a post.
 * @typedef {import("App").BlogPost} BlogPostDeleteDto
 */

const Blog = (
  /** @type {{ blog: any, updatePost: (blog: BlogPostUpdateDto) => any, deletePost: (blog: BlogPostDeleteDto) => boolean, userId: string }} **/
  { blog, updatePost, deletePost, userId }
) => {
  // visibility status (state, text and display mode)
  const [visible, setVisible] = useState(false)
  const showWhenVisible = { display: (visible) ? '' : 'none' }
  const visibilityTextButton = (visible) ? 'hide' : 'details'

  // delete button status
  const showDeleteButtonWhenCreator = { display: (blog?.user?.id === userId) ? '' : 'none' }

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
      <section style={headerStyle} className='blog-header'>
        {blog.title} {blog.author ? blog.author.name : '(unknown author)'}
        <button onClick={toggleVisibility}>
          {visibilityTextButton}
        </button>
      </section>
      <section style={showWhenVisible} className='details'>
        <p>
          {blog.url}
        </p>
        <p>
          {displayLikes} <button onClick={giveLike}>like</button>
        </p>
        <p>
          {blog?.user?.name}
        </p>
        <button onClick={() => deletePost(blog)} style={showDeleteButtonWhenCreator}>delete</button>
      </section>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updatePost: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired
}

export default Blog
