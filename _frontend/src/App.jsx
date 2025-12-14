import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ApiProvider, useApi } from './context/ApiContext';
import Layout from './components/Layouts/Layout';
import Home from './pages/Home/Home';
import Menu from './pages/Menu';
import './styles/index.css';
import {LoginForm} from './components/login-form';

// Protected route wrapper
function ProtectedRoute({ children }) {
  const { user } = useApi()
  return user ? children : <Navigate to="/login" replace />
}

function AppContent() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/login" element={<LoginForm />}/>
        </Routes>
      </Layout>
    </Router>
  );
}

export default function App() {
  return (
    <ApiProvider>
      <AppContent />
    </ApiProvider>
  );
}
