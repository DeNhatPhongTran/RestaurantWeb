import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ApiProvider, useApi } from './context/ApiContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/Layouts/Header';
import Home from './pages/Home/Home';
import Menu from './pages/Menu';
import Login from './pages/Login';
import OrderListPage from './pages/OrderListPage'
import Dish_menu_mgmt from './pages/dish_menu/Dish_menu_mgmt';
import Reservation_mgmt from './pages/reservation/Reservation_mgmt';
import './styles/globals.css'

function AppContent({ userRole, handleLogout, handleRoleSwitch }) {
  const { user } = useApi();

  return (
    <Router>
      <div className="flex h-screen flex-col">
        {/* Header - Always visible */}
        <Header />
        
        {/* Main Layout with optional Sidebar */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Only show when logged in */}
          {user && <Sidebar userRole={userRole} onLogout={handleLogout} />}

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-auto">
            <main className="flex-1 overflow-y-auto">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/login" element={<Login />} />
                <Route path="/orders" element={user ? <OrderListPage userRole={userRole} /> : <Navigate to="/login" replace />} />
                <Route path="/reservation" element={<Reservation_mgmt />} />
                <Route path="/dish_menu" element={<Dish_menu_mgmt />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      </div>
}

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
    <ApiProvider>
      <AppContent userRole={userRole} handleLogout={handleLogout} handleRoleSwitch={handleRoleSwitch} />
    </ApiProvider>
  );
}
