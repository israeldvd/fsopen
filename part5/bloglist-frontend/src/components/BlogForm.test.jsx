import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { BlogForm } from './BlogForm'
import userEvent from '@testing-library/user-event'

describe('<BlogForm />', () => {
  /** @type HTMLElement */
  let formContainer

  const addPostImplt = vi.fn()

  beforeEach(() => {
    formContainer = render(<BlogForm addPost={addPostImplt} />).container
  })

  it('should send correct data when submitting', async () => {
    // add post data
    const blogData = {
      author: 'Any Name',
      title: 'Any Title',
      url: 'anyurl.com'
    }

    const user = userEvent.setup()

    // form elements
    const titleField = formContainer.querySelector('#new-blog-title')
    const authorField = formContainer.querySelector('#new-blog-author')
    const urlField = formContainer.querySelector('#new-blog-url')
    const subButton = formContainer.querySelector('.create-action')

    // fill data
    await user.type(titleField, blogData.title)
    await user.type(authorField, blogData.author)
    await user.type(urlField, blogData.url)

    // click form submit buton
    await user.click(subButton)

    expect(addPostImplt).toHaveBeenCalledWith({ authorName: blogData.author, title: blogData.title, url: blogData.url })
  })
})