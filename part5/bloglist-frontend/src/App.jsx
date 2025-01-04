import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import loginService from './services/login'
import blogService from './services/blogs'
import { LoginForm } from './components/LoginForm'
import { BlogForm } from './components/BlogForm'
import Notification, { nullishFeedback } from './components/Notification'
import Togglable from './components/Togglable'

/**
 * The User data returned after the log-in event.
 * @typedef {Object} UserLogin
 * @property {string} name - Refers to proper name.
 * @property {string} username - Refers to the global user nickname.
 * @property {string} _id - Refers to the back-end user ID.
 * @property {string} access_token - Refers to authentication token.
 */

/**
 * The Author object
 * @typedef Author
 * @property {string} id
 * @property {string} name
 */

/**
 * The Blog post information.
 * @typedef {Object} BlogPost
 * @property {string} id - Refers to application-context blog's ID.
 * @property {string} title - Refers to the blog title.
 * @property {Author} author - Refers to its author.
 * @property {string} [user] - Refers to user that has changed it (or when has liked it).
 * @property {string} url - Refers to the post URI.
 * @property {number} likes - Indicates the amount of likes it currently has.
 */

/**
 * The DTO For Blog post information.
 * @typedef {Object} CreateBlogPostDto
 * @property {BlogPost["id"]} id - Refers to application-context blog's ID.
 * @property {BlogPost["title"]} title - Refers to the blog title.
 * @property {Author["name"]} authorName - Refers to the name of the author.
 * @property {BlogPost["user"]} [user] - Refers to user that has changed it (or when has liked it).
 * @property {BlogPost["url"]} url - Refers to the post URI.
 * @property {BlogPost["likes"]} likes - Indicates the amount of likes it currently has.
 */

/**
  @function
 * @param {BlogPost[]} blogs
 * @param {{ (updatedBlogPost: import("./components/Blog").BlogPostUpdateDto): Promise<boolean>; (blog: import("./components/Blog").BlogPostUpdateDto): any; }} updatePost
 * @param {string} userId
 */
function displayBlogList(blogs, updatePost, deletePost, userId) {
  // sort blog posts and display them with respective component
  return blogs.sort((blogA, blogB) => {
    // sort posts by number of likes in descending order
    return blogB.likes - blogA.likes
  }).map((blog) => (
    <Blog key={blog.id} blog={blog} updatePost={updatePost} deletePost={deletePost} userId={userId} />
  ))
}

/** @type { UserLogin } */
const initialUser = null

/** @type {BlogPost[]} */
const initialBlogList = []

const App = () => {
  const [blogs, setBlogs] = useState(initialBlogList)
  const [user, setUser] = useState(initialUser)
  const [temporaryFeedback, setTemporaryFeedback] = useState(nullishFeedback)

  // blog-form reference used to hide it again, kept throughout re-renders of the component
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedAppUser')
    if (loggedUserJSON) {
      /** @type { UserLogin } */
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.access_token)
    }
  }, [])

  useEffect(() => {
    // set every feedback (message) to be temporary
    return () => {
      setTimeout(() => {
        setTemporaryFeedback(nullishFeedback)
      }, 5000)
    }
  }, [temporaryFeedback])

  const addPost = async (
    /** @type {CreateBlogPostDto} */ newBlogPost,
  ) => {
    const returnedBlog = await blogService.create({ ...newBlogPost, author: newBlogPost.authorName })
    setBlogs(blogs.concat(returnedBlog))

    // new-post feedback
    setTemporaryFeedback({
      class: 'success',
      text: `a new blog ${returnedBlog.title} by ${user.name} was added`,
    })

    // toggle form visibility by using the same reference
    blogFormRef.current?.toggleVisibility()

    return true
  }

  const updatePost = async (/** @type {import("./components/Blog").BlogPostUpdateDto} */ updatedBlogPost) => {
    try {
      const response = await blogService.update(updatedBlogPost, user._id)
      const success = (response)

      if (!success) {
        setTemporaryFeedback(
          {
            class: 'error',
            text: 'something went wrong at updating the post'
          }
        )
        return false
      }

      // update feedback
      setTemporaryFeedback(
        {
          class: 'success',
          text: 'you have liked the post'
        }
      )
    } catch (error) {
      setTemporaryFeedback(
        {
          class: 'error',
          text: 'check your internet connection: you may be offline'
        }
      )

      return false
    }


    return true
  }

  const deletePost = async (/** @type {BlogPost} */ { author, id, title }) => {
    // confirm deletion
    if (!window.confirm(`Remove blog ${title} by ${author.name}?`)) {
      return false
    }

    try {
      const deletedResponse = await blogService.deleteBlog(id)
      if (deletedResponse === true) {
        setBlogs((prevBlogs) => {
          return prevBlogs.filter((blog) => blog.id !== id)
        })

        setTemporaryFeedback(
          {
            class: 'success',
            text: 'blog post deleted succesfully'
          }
        )

        return true
      }

      // if null comes from the delete service
      setTemporaryFeedback(
        {
          class: 'error',
          text: 'you are not able to delete this blog now'
        }
      )
    } catch (error) {
      setTemporaryFeedback(
        {
          class: 'error',
          text: (error.response.status === 403) ?
            'you cannot delete this blog post' : 'something went wrong'
        }
      )

      return false
    }
  }

  /** @type (e: React.FormEvent<HTMLFormElement>, username: string,
  password: string) => Promise<boolean> */
  const handleLogin = async (
    /** @type {React.FormEvent<HTMLFormElement>} */ e,
    /** @type {string} */ username,
    /** @type {string} */ password,
  ) => {
    e.preventDefault()

    try {
      /** @type {UserLogin} */
      const userOnResponse = await loginService.login({ username, password })

      // save user data
      blogService.setToken(userOnResponse.access_token)
      window.localStorage.setItem(
        'loggedAppUser',
        JSON.stringify(userOnResponse),
      )

      setUser(userOnResponse)

      setTemporaryFeedback({
        text: 'You are now logged in!',
        class: 'success',
      })

      return Promise.resolve(true)
    } catch (error) {
      // failed authentication feedback
      setTemporaryFeedback({
        text: 'Wrong password or username',
        class: 'error',
      })

      return Promise.resolve(false)
    }
  }

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      window.localStorage.removeItem('loggedAppUser')
      setUser(null)

      // logout feedback
      setTemporaryFeedback({
        text: 'That is it! You are now logged out.',
        class: 'info',
      })
    }
  }

  return (
    <div>
      <Notification message={temporaryFeedback} />
      {user === null && <LoginForm handleLogin={handleLogin} />}
      {user !== null && (
        <>
          <h2>blogs</h2>
          <p>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </p>
          <Togglable buttonLabel='new post' ref={blogFormRef} >
            <BlogForm addPost={addPost} />
          </Togglable>
          {displayBlogList(blogs, updatePost, deletePost, user?._id)}
        </>
      )}
    </div>
  )
}

export default App