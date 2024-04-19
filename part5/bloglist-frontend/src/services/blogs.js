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
  /** @type {{title: string, author: string, url: string}} */ newPost,
) => {
  const config = {
    headers: { Authorization: authHeader },
  }

  const response = await axios.post(baseUrl, newPost, config)
  return response.data
}

export default { getAll, create, setToken }
