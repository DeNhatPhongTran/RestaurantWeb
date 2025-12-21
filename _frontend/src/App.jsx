import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ApiProvider, useApi } from './context/ApiContext';
import Layout from './components/Layouts/Layout';
import Home from './pages/Home/Home';
import Menu from './pages/Menu';
import Login from './pages/Login';
import Header from './components/layout/Header'
import MainLayout from './components/layout/MainLayout'
import OrderListPage from './pages/OrderListPage'
import './styles/globals.css'

// Protected route wrapper
function ProtectedRoute({ children }) {
  const { user } = useApi()
  return user ? children : <Navigate to="/login" replace />
}

function AppContent() {
  return (
    <Router>
      <div className="flex flex-col h-screen overflow-hidden">
        <Header onLogout={handleLogout} userRole={userRole} onRoleSwitch={handleRoleSwitch} />
        <MainLayout>
          <Routes>

          </Routes>
        </MainLayout>
      </div>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/orders" element={<OrderListPage userRole={userRole} />} />
          <Route path="/" element={<OrderListPage userRole={userRole} />} />
          <Route path="*" element={<Navigate to="/orders" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
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
      <AppContent />
    </ApiProvider>
  );

}
