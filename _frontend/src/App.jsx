import React from 'react'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Header from './components/layout/Header'
import MainLayout from './components/layout/MainLayout'
import OrderListPage from './pages/OrderListPage'
import './styles/globals.css'

export default function App() {
  const handleLogout = () => {
    console.log('User logged out')
    // TODO: Implement logout logic
  }

  return (
    <Router>
      <div className="flex flex-col h-screen overflow-hidden">
        <Header onLogout={handleLogout} />
        <MainLayout>
          <Routes>
            <Route path="/orders" element={<OrderListPage />} />
            <Route path="/" element={<OrderListPage />} />
            <Route path="*" element={<Navigate to="/orders" replace />} />
          </Routes>
        </MainLayout>
      </div>
    </Router>
  )
}
