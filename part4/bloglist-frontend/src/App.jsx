import { useState, useEffect } from "react"
import Blog from "./components/Blog"
import blogService from "./services/blogs"
import { LoginForm } from "./components/LoginForm"

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  return (
    <div>
      {user === null && <LoginForm setUser={setUser} />}
      {user !== null && (
        <>
          <h2>Welcome!</h2>
          <p>Check all available posts. You are now logged in.</p>
        </>
      )}

      <h2>blogs</h2>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  )
}

export default App
