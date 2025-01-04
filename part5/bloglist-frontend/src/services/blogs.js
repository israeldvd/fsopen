import axios from "axios"
const baseUrl = "/api/blogs"

let authHeader = null

const setToken = (/** @type {string} */ newToken) => {
  authHeader = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const create = async (
  /** @type {{title: string, author: import("App").Author["name"], url: string}} */ newPost,
) => {
  const config = {
    headers: { Authorization: authHeader },
  }

  const response = await axios.post(baseUrl, newPost, config)
  return response.data
}

const update = async (
  /** @type {{id: string, title?: string, author?: string, url?: string}} */ postData,
  /** @type {import("App").UserLogin["_id"]} */ userId,
) => {
  const config = {
    headers: { Authorization: authHeader },
  }

  const response = await axios.patch(`${baseUrl}/${postData.id}`, { ...postData, user: userId }, config)
  return response.data
}

const deleteBlog = async (/** @type {string} */ postId) => {
  const config = {
    headers: { Authorization: authHeader }
  }

  const response = await axios.delete(`${baseUrl}/${postId}`, config)

  // if kept as it (blog is considered deleted)
  if (response.status === 204) {
    return true
  }

  // nothing was made
  return null
}

export default { getAll, create, update, deleteBlog, setToken }
