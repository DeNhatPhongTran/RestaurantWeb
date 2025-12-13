import React, { useState } from 'react'
import { useApi } from '../context/ApiContext'
import { Button } from './ui/Button'

export function Navigation() {
  const { apiUrl, setApiUrl, user, logout } = useApi()
  const [showApiMenu, setShowApiMenu] = useState(false)
  const [customApiUrl, setCustomApiUrl] = useState(apiUrl)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const handleChangeApi = (url) => {
    setApiUrl(url)
    setShowApiMenu(false)
  }

  const handleCustomApi = () => {
    if (customApiUrl.trim()) {
      setApiUrl(customApiUrl)
      setShowApiMenu(false)
    }
  }

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <a href="/" className="text-2xl font-bold hover:text-primary">
            Poodb
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden gap-6 md:flex items-center">
            <a href="/" className="text-sm text-gray-600 hover:text-primary transition">Home</a>
            <a href="/menu" className="text-sm text-gray-600 hover:text-primary transition">Menu</a>
            <a href="/about" className="text-sm text-gray-600 hover:text-primary transition">About</a>
            <a href="/blog" className="text-sm text-gray-600 hover:text-primary transition">Blog</a>

            {/* API Settings */}
            <div className="relative">
              <button
                onClick={() => setShowApiMenu(!showApiMenu)}
                className="text-xs px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200 transition"
              >
                🔌 API
              </button>
              {showApiMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg p-3 z-50">
                  <div className="text-xs font-semibold mb-2">Select API</div>
                  <div className="space-y-2 mb-3">
                    <button
                      onClick={() => handleChangeApi('http://localhost:5000')}
                      className={`block w-full text-left text-xs p-2 rounded transition ${
                        apiUrl === 'http://localhost:5000'
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      localhost:5000
                    </button>
                    <button
                      onClick={() => handleChangeApi('http://localhost:3001')}
                      className={`block w-full text-left text-xs p-2 rounded transition ${
                        apiUrl === 'http://localhost:3001'
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      localhost:3001
                    </button>
                  </div>
                  <div className="border-t pt-2">
                    <input
                      type="text"
                      value={customApiUrl}
                      onChange={(e) => setCustomApiUrl(e.target.value)}
                      placeholder="Custom API URL"
                      className="w-full text-xs p-1 border rounded mb-2"
                    />
                    <button
                      onClick={handleCustomApi}
                      className="w-full text-xs bg-primary text-white p-1 rounded hover:opacity-90"
                    >
                      Set Custom
                    </button>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    Current: {apiUrl.replace('http://', '')}
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            {user ? (
              <div className="flex items-center gap-3 border-l pl-6">
                <span className="text-sm text-gray-600">{user.email || user.name}</span>
                <button
                  onClick={logout}
                  className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <a href="/login" className="text-xs px-3 py-1 bg-primary text-white rounded hover:opacity-90 transition">
                Login
              </a>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 hover:bg-gray-100 rounded"
          >
            ☰
          </button>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <div className="md:hidden mt-4 space-y-3 border-t pt-4">
            <a href="/" className="block text-sm text-gray-600 hover:text-primary">Home</a>
            <a href="/menu" className="block text-sm text-gray-600 hover:text-primary">Menu</a>
            <a href="/about" className="block text-sm text-gray-600 hover:text-primary">About</a>
            <a href="/blog" className="block text-sm text-gray-600 hover:text-primary">Blog</a>
            <div className="border-t pt-3">
              <button
                onClick={() => setShowApiMenu(!showApiMenu)}
                className="w-full text-left text-xs px-3 py-2 bg-gray-100 rounded hover:bg-gray-200"
              >
                🔌 API Settings
              </button>
              {showApiMenu && (
                <div className="mt-2 space-y-2 pl-3">
                  <button
                    onClick={() => handleChangeApi('http://localhost:5000')}
                    className={`block text-xs p-2 rounded ${
                      apiUrl === 'http://localhost:5000' ? 'bg-primary text-white' : 'bg-gray-100'
                    }`}
                  >
                    localhost:5000
                  </button>
                  <button
                    onClick={() => handleChangeApi('http://localhost:3001')}
                    className={`block text-xs p-2 rounded ${
                      apiUrl === 'http://localhost:3001' ? 'bg-primary text-white' : 'bg-gray-100'
                    }`}
                  >
                    localhost:3001
                  </button>
                  <input
                    type="text"
                    value={customApiUrl}
                    onChange={(e) => setCustomApiUrl(e.target.value)}
                    placeholder="Custom URL"
                    className="w-full text-xs p-2 border rounded"
                  />
                  <button
                    onClick={handleCustomApi}
                    className="w-full text-xs bg-primary text-white p-2 rounded"
                  >
                    Set
                  </button>
                </div>
              )}
            </div>
            {user ? (
              <>
                <div className="border-t pt-3">
                  <p className="text-sm text-gray-600 mb-2">{user.email || user.name}</p>
                  <button
                    onClick={logout}
                    className="w-full text-xs px-3 py-2 bg-red-100 text-red-700 rounded"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <a href="/login" className="block text-xs px-3 py-2 bg-primary text-white rounded text-center">
                Login
              </a>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
