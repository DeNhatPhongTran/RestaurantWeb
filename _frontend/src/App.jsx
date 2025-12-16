import React, { useState } from 'react'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Header from './components/layout/Header'
import MainLayout from './components/layout/MainLayout'
import OrderListPage from './pages/OrderListPage'
import './styles/globals.css'

export default function App() {
  const [userRole, setUserRole] = useState('waiter') // 'waiter' or 'cashier'

  const handleLogout = () => {
    console.log('User logged out')
    // TODO: Implement logout logic
  }

  const handleRoleSwitch = (role) => {
    setUserRole(role)
    console.log('User role changed to:', role)
  }

  return (
    <Router>
      <div className="flex flex-col h-screen overflow-hidden">
        <Header onLogout={handleLogout} userRole={userRole} onRoleSwitch={handleRoleSwitch} />
        <MainLayout>
          <Routes>
            <Route path="/orders" element={<OrderListPage userRole={userRole} />} />
            <Route path="/" element={<OrderListPage userRole={userRole} />} />
            <Route path="*" element={<Navigate to="/orders" replace />} />
          </Routes>
        </MainLayout>
      </div>
    </Router>
  )
}
