import { useState } from "react"

export const BlogForm = () => {
  const [newBlogPost, setNewBlogPost] = useState({
    title: "",
    author: "",
    url: "",
  })

  const handlePostChange = (
    /** @type {React.ChangeEvent<HTMLInputElement>} */ event,
  ) => {
    if (!(event.target.name in newBlogPost)) {
      return
    }

    setNewBlogPost((prevInfo) => ({
      ...prevInfo,
      [event.target.name]: event.target.value,
    }))
  }

  return (
    <form className="new-blog-form">
      <label htmlFor="new-blog-title">title: </label>
      <input
        id="new-blog-title"
        name="title"
        value={newBlogPost.title}
        onChange={handlePostChange}
      />
      <br />
      <label htmlFor="new-blog-author">author: </label>
      <input
        id="new-blog-author"
        name="author"
        value={newBlogPost.author}
        onChange={handlePostChange}
      />
      <br />
      <label htmlFor="new-blog-url">url: </label>
      <input
        id="new-blog-url"
        name="url"
        value={newBlogPost.url}
        onChange={handlePostChange}
      />
      <button type="submit">create</button>
    </form>
  )
}
