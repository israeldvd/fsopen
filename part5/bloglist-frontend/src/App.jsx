import { useState, useEffect } from "react"
import Blog from "./components/Blog"
import loginService from "./services/login"
import blogService from "./services/blogs"
import { LoginForm } from "./components/LoginForm"
import { BlogForm } from "./components/BlogForm"

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

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

  const addPost = async (
    /** @type {{ title: string; author: string; url: string; }} */ newBlogPost,
  ) => {
    const returnedNote = await blogService.create(newBlogPost)
    setBlogs(blogs.concat(returnedNote))

    return true
  }

  const handleLogin = async (
    /** @type {React.FormEvent<HTMLFormElement>} */ e,
    /** @type {string} */ username,
    /** @type {string} */ password,
  ) => {
    e.preventDefault()

    const userOnResponse = await loginService.login({ username, password })

    // save user data
    blogService.setToken(userOnResponse.access_token)
    window.localStorage.setItem("loggedAppUser", JSON.stringify(userOnResponse))

    setUser(userOnResponse)

    window.alert(`user is logged in`)
  }

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      window.localStorage.removeItem("loggedAppUser")
      setUser(null)
    }
  }

  return (
    <div>
      {user === null && <LoginForm handleLogin={handleLogin} />}
      {user !== null && (
        <>
          <h2>blogs</h2>
          <p>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </p>
          <>
            <h2>Create new</h2>

            <BlogForm addPost={addPost} />
          </>
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </>
      )}
    </div>
  )
}

export default App