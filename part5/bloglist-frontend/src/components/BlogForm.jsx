import { useState } from "react"

const defaultBlogpostInput = {
  title: "",
  author: "",
  url: "",
}

export const BlogForm = (
  /** @type {{addPost: (arg0: {
    title: string;
    author: string;
    url: string;
}) => Promise<boolean> }} */ { addPost },
) => {
  const [newBlogPost, setNewBlogPost] = useState(defaultBlogpostInput)

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
    <form
      id="new-blog-form"
      onSubmit={(e) => {
        e.preventDefault()

        addPost(newBlogPost)
        setNewBlogPost(defaultBlogpostInput)
      }}
    >
      <label htmlFor="new-blog-title">title: </label>
      <input
        id="new-blog-title"
        name="title"
        value={newBlogPost.title}
        onChange={handlePostChange}
      />
      <label htmlFor="new-blog-author">author: </label>
      <input
        id="new-blog-author"
        name="author"
        value={newBlogPost.author}
        onChange={handlePostChange}
      />
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
