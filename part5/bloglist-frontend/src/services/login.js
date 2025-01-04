import axios from 'axios'

const resourceUrl = '/api/login'

const login = async ({ username, password }) => {
  const response = await axios.post(resourceUrl, { username, password })
  return response.data
}

export default { login }
