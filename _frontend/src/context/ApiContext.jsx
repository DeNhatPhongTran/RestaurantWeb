import React, { createContext, useState, useContext, useEffect } from 'react'

const ApiContext = createContext()

export function ApiProvider({ children }) {
  const [apiUrl, setApiUrl] = useState(() => {
    // Load from localStorage or default to localhost
    return localStorage.getItem('apiUrl') || 'http://localhost:5000'
  })
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  // Save API URL to localStorage
  useEffect(() => {
    localStorage.setItem('apiUrl', apiUrl)
  }, [apiUrl])

  // Save user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  }, [user])

  const login = async (email, password) => {
    try {
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await response.json()
      if (response.ok) {
        setUser(data.user)
        return { success: true, user: data.user }
      }
      return { success: false, error: data.message || 'Login failed' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <ApiContext.Provider value={{ apiUrl, setApiUrl, user, setUser, login, logout }}>
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
