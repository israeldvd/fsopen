import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import { test, expect, describe, vi, beforeEach } from 'vitest'

describe('<Note />', () => {
  /** @type HTMLElement */
  let dummyContainer

  beforeEach(() => {
    const blog = {
      author: { name: 'Any Author Name' },
      title: 'Any Valid Title',
      likes: 0,
      url: 'a-valid-url.com'
    }

    dummyContainer = render(<Blog updatePost={vi.fn()} deletePost={vi.fn()} userId='any-id' blog={blog} />).container
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
})