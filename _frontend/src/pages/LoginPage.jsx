import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApi } from '../context/ApiContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'

export default function LoginPage() {
  const navigate = useNavigate()
  const { apiUrl, login, register, user, loading } = useApi()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [fullname, setFullname] = useState('')
  const [phone, setPhone] = useState('')

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user, navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    if (!username || !password) {
      setError('Please fill in all fields')
      return
    }

    const result = await login(username, password)

    if (result.success) {
      navigate('/')
    } else {
      setError(result.error || 'Login failed')
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')

    if (!fullname || !username || !password) {
      setError('Please fill in all fields')
      return
    }

    const result = await register(fullname, username, password, phone)

    if (result.success) {
      navigate('/')
    } else {
      setError(result.error || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            {isRegistering ? 'Create Account' : 'Login to Poodb'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-3 bg-blue-50 rounded-md text-sm text-gray-700">
            <strong>🔗 API:</strong> {apiUrl.replace('http://', '')}
          </div>

          <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-200">
                {error}
              </div>
            )}

            {isRegistering && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <Input
                    type="text"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone (Optional)</label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Your phone number"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>

            <Button className="w-full" disabled={loading}>
              {loading ? 'Loading...' : isRegistering ? 'Create Account' : 'Login'}
            </Button>

            <div className="text-center text-sm">
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering)
                  setError('')
                  setUsername('')
                  setPassword('')
                  setFullname('')
                  setPhone('')
                }}
                className="text-blue-600 hover:underline"
              >
                {isRegistering ? 'Back to Login' : 'Create an account'}
              </button>
            </div>
          </form>

          <div className="mt-4 p-3 bg-yellow-50 rounded-md text-xs text-gray-700 space-y-2">
            <p>
              <strong>Demo Login:</strong>
              <br />
              Username: manager1 / Password: 123
            </p>
            <p>
              💡 Use 🔌 API button to switch backend endpoints
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
