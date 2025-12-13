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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/menu" element={<ProtectedRoute><MenuPage /></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute><AboutPage /></ProtectedRoute>} />
        <Route path="/blog" element={<ProtectedRoute><BlogPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
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
