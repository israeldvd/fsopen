import { useState } from 'react'

const defaultBlogpostInput = {
  title: '',
  authorName: '',
  url: '',
}

export const BlogForm = (
  /** @type {{addPost: (arg0: {
    title: string;
    authorName: string;
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
    <div>
      <h2>Create new</h2>
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
          name="authorName"
          value={newBlogPost.authorName}
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
    </div>
  )
}
