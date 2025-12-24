import { useState } from 'react'
import { useApi } from '../context/ApiContext'
import { useNavigate } from 'react-router-dom'
import '../styles/auth.css'

export default function Register() {
  const { register } = useApi()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    const res = await register(username, password)

    if (res.success) {
      navigate('/')
    } else {
      setError(res.error)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Register</h2>

        <form onSubmit={handleSubmit}>
          <input
            className="auth-input"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <div className="auth-error">{error}</div>}

          <button className="auth-button" type="submit">
            Register
          </button>
        </form>
      </div>
    </div>
  )
}
