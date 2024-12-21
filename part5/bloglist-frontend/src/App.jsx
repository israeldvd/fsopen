import { useState, useEffect } from "react"
import Blog from "./components/Blog"
import loginService from "./services/login"
import blogService from "./services/blogs"
import { LoginForm } from "./components/LoginForm"
import { BlogForm } from "./components/BlogForm"
import Notification, { nullishFeedback } from "./components/Notification"
import Togglable from "./components/Togglable"

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [temporaryFeedback, setTemporaryFeedback] = useState(nullishFeedback)

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedAppUser")
    if (loggedUserJSON) {
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
    /** @type {{ title: string; author: string; url: string; }} */ newBlogPost,
  ) => {
    const returnedBlog = await blogService.create(newBlogPost)
    setBlogs(blogs.concat(returnedBlog))

    // new-post feedback
    setTemporaryFeedback({
      class: "success",
      text: `a new blog ${returnedBlog.title} by ${user.name} was added`,
    })

    return true
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
      const userOnResponse = await loginService.login({ username, password })

      // save user data
      blogService.setToken(userOnResponse.access_token)
      window.localStorage.setItem(
        "loggedAppUser",
        JSON.stringify(userOnResponse),
      )

      setUser(userOnResponse)

      setTemporaryFeedback({
        text: "You are now logged in!",
        class: "success",
      })

      return Promise.resolve(true)
    } catch (error) {
      // failed authentication feedback
      setTemporaryFeedback({
        text: "Wrong password or username",
        class: "error",
      })

      return Promise.resolve(false)
    }
  }

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      window.localStorage.removeItem("loggedAppUser")
      setUser(null)

      // logout feedback
      setTemporaryFeedback({
        text: "That is it! You are now logged out.",
        class: "info",
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
          <Togglable buttonLabel='new post' >
            <BlogForm addPost={addPost} />
          </Togglable>
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </>
      )}
    </div>
  )
}

export default App
