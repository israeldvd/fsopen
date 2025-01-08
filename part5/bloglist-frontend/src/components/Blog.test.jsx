import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import Blog from './Blog'

describe('<Note />', () => {
  /** @type HTMLElement */
  let dummyContainer

  const updatePostImpl = vi.fn()

  beforeEach(() => {
    const blog = {
      author: { name: 'Any Author Name' },
      title: 'Any Valid Title',
      likes: 0,
      url: 'a-valid-url.com'
    }

    dummyContainer = render(<Blog updatePost={updatePostImpl} deletePost={vi.fn()} userId='any-id' blog={blog} />).container
  })

  test('renders title and author', async () => {
    // identify header using class name (movable)
    const tElement = dummyContainer.querySelector('.blog-header')

    // should be defined and contain the author info
    expect(tElement).toBeDefined()
    expect(tElement).toHaveTextContent('Any Author Name')
  })

  test('does not render likes and URL by default', async () => {
    // identify details part
    const detailsElement = dummyContainer.querySelector('.details')

    // should be hidden using style
    expect(detailsElement).toHaveStyle('display: none')
  })

  test('details are displayed when button \'show\' is clicked', async () => {
    const user = userEvent.setup()

    // show-button element (is clicked)
    const button = screen.getByText('details')
    await user.click(button)

    // identify details part (should be visible after the event)
    const detailsElement = dummyContainer.querySelector('.details')
    expect(detailsElement).not.toHaveStyle('display: none')
  })

  test('when likes button is clicked twice, this is reflected in fn callback', async () => {
    const user = userEvent.setup()

    // show details
    const button = screen.getByText('details')
    await user.click(button)

    // identify like button and click it twice
    const likeBtn = dummyContainer.querySelector('.like-action')
    await user.click(likeBtn)
    await user.click(likeBtn)

    // call to update should be called the same amount of times
    expect(updatePostImpl.mock.calls).toHaveLength(2)
  })
})