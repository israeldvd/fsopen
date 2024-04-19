import { useState } from "react"

export const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  return (
    <form
      onSubmit={(e) => {
        handleLogin(e, username, password)

        // clear input
        setUsername("")
        setPassword("")
      }}
    >
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