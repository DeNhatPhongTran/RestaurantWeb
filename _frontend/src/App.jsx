import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ApiProvider, useApi } from './context/ApiContext'
import { Navigation } from './components/Navigation'
import LoginPage from './pages/LoginPage'
import Home from './pages/Home'
import ForgotPassword from './pages/ForgotPassword'
import Profile from './pages/Profile'
import MenuPage from './pages/Menu'
import AboutPage from './pages/About'
import BlogPage from './pages/Blog'

// Protected route wrapper
function ProtectedRoute({ children }) {
  const { user } = useApi()
  return user ? children : <Navigate to="/login" replace />
}

function AppContent() {
  return (
    <Router>
      <Navigation />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        
        {/* Protected routes - require user to be logged in */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default function App() {
  return (
    <ApiProvider>
      <AppContent />
    </ApiProvider>
  )
}
