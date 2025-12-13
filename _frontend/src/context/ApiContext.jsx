import React, { createContext, useState, useContext, useEffect } from 'react'

const ApiContext = createContext()

export function ApiProvider({ children }) {
  const [apiUrl, setApiUrl] = useState(() => {
    const saved = localStorage.getItem('apiUrl')
    if (saved) return saved
    
    // Default: empty string for relative paths (/api/...)
    // Nginx will proxy /api/* to backend:5000
    // User can override with 🔌 API button for custom backends
    return ''
  })
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null
  })
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })
  const [loading, setLoading] = useState(false)

  // Save API URL to localStorage
  useEffect(() => {
    localStorage.setItem('apiUrl', apiUrl)
  }, [apiUrl])

  // Save token to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  }, [token])

  // Save user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  }, [user])

  // Verify token on mount
  useEffect(() => {
    if (token) {
      verifyToken()
    }
  }, [apiUrl])

  const apiCall = async (endpoint, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    try {
      const response = await fetch(`${apiUrl}${endpoint}`, {
        ...options,
        headers
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'API request failed')
      }

      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const register = async (fullname, username, password, phone = '') => {
    setLoading(true)
    try {
      const result = await apiCall('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ fullname, username, password, phone })
      })

      if (result.success) {
        setToken(result.data.token)
        setUser(result.data.user)
        return { success: true, user: result.data.user }
      }

      return { success: false, error: result.error }
    } finally {
      setLoading(false)
    }
  }

  const login = async (username, password) => {
    setLoading(true)
    try {
      const result = await apiCall('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      })

      if (result.success) {
        setToken(result.data.token)
        setUser(result.data.user)
        return { success: true, user: result.data.user }
      }

      return { success: false, error: result.error }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await apiCall('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setToken(null)
      setUser(null)
      setLoading(false)
    }
  }

  const verifyToken = async () => {
    if (!token) return

    const result = await apiCall('/api/auth/me')

    if (result.success) {
      setUser(result.data.user)
    } else {
      // Token is invalid, clear it
      setToken(null)
      setUser(null)
    }
  }

  const updateUser = async (fullname, phone) => {
    setLoading(true)
    try {
      const result = await apiCall('/api/auth/me', {
        method: 'PUT',
        body: JSON.stringify({ fullname, phone })
      })

      if (result.success) {
        setUser(result.data.user)
        return { success: true, user: result.data.user }
      }

      return { success: false, error: result.error }
    } finally {
      setLoading(false)
    }
  }

  return (
    <ApiContext.Provider
      value={{
        apiUrl,
        setApiUrl,
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUser,
        verifyToken,
        apiCall
      }}
    >
      {children}
    </ApiContext.Provider>
  )
}

export function useApi() {
  const context = useContext(ApiContext)
  if (!context) {
    throw new Error('useApi must be used within ApiProvider')
  }
  return context
}
