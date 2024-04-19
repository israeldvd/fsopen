import { useState } from "react"
import loginService from "../services/login"

export const LoginForm = ({ setUser }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()

    const userOnResponse = await loginService.login({ username, password })

    // save user data
    window.localStorage.setItem("loggedAppUser", JSON.stringify(userOnResponse))

    setUser(userOnResponse)
    setUsername("")
    setPassword("")

    window.alert(`user is logged in`)
  }

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <div>
        <label htmlFor="login-username">username</label>
        <input
          id="login-username"
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        <label htmlFor="login-password">password</label>
        <input
          id="login-password"
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )
}
