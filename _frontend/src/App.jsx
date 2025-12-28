import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

import { ApiProvider } from './context/ApiContext';
import {
  SidebarProvider,
  SidebarInset,
} from '@/components/ui/sidebar';

import RoleSidebar from './components/layout/RoleSidebar';
import Header from './components/Layouts/Header';
import ProtectedRoute from './components/ProtectedRoute';
import { isRouteAllowed } from '@/utils/rolePermissions';

import Home from './pages/Home/Home';
import Menu from './pages/Menu';
import Login from './pages/Login';
import OrderListPage from './pages/OrderListPage';
import DishMenuMgmt from './pages/dish_menu/Dish_menu_mgmt';
import ReservationMgmt from './pages/reservation/Reservation_mgmt';
import ReservationsPage from './pages/ReservationsPage';
import Profile from './pages/Profile';
import ResetPassword from './pages/ResetPassword'
import StaffManagement from './pages/StaffManagement'
import TableManagement from './pages/TableManagement';
import StaffDelivery from './pages/StaffDelivery';
import KitchenOrder from './pages/KitchenOrder';
import InvoicePage from './pages/InvoicePage';


import './styles/globals.css';

/* ================= ROUTE GUARD ================= */
function RouteGuard({ children }) {
  const location = useLocation();
  const userInfo = localStorage.getItem('userInfo');

  if (userInfo) {
    try {
      const user = JSON.parse(userInfo);
      const roleName = user?.role?.role_name;

      if (!isRouteAllowed(roleName, location.pathname)) {
        console.warn('Access denied:', location.pathname);
        return <Navigate to="/home" replace />;
      }
    } catch (err) {
      console.error(err);
      return <Navigate to="/home" replace />;
    }
  }

  return children;
}

/* ================= APP CONTENT ================= */
function AppContent() {
  const location = useLocation();
  const userInfo = localStorage.getItem('userInfo');
  const isLoginPage = location.pathname === '/login';
  const isLoggedIn = !!userInfo;

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    window.location.href = '/home';
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* SIDEBAR (luôn tồn tại – guest vẫn thấy menu home/menu) */}
        {!isLoginPage && (
          <RoleSidebar
            onLogout={handleLogout}
            hiddenMenuItems={false}
          />
        )}

        {/* CONTENT */}
        <SidebarInset className="flex flex-col">
          {/* HEADER: chỉ hiện khi guest hoặc login */}
          {(!isLoggedIn || isLoginPage) && <Header />}

          <main className="flex-1 overflow-y-auto">
            <Routes>
              {/* PUBLIC */}
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/login" element={<Login />} />

              {/* PROTECTED */}
              <Route
                path="/dashboard"
                element={
                  <RouteGuard>
                    <ProtectedRoute requiredRoles={['manager']}>
                      <OrderListPage />
                    </ProtectedRoute>
                  </RouteGuard>
                }
              />

              <Route
                path="/orders"
                element={
                  <RouteGuard>
                    <ProtectedRoute>
                      <OrderListPage />
                    </ProtectedRoute>
                  </RouteGuard>
                }
              />

              <Route
                path="/reservations"
                element={
                  <RouteGuard>
                    <ProtectedRoute requiredRoles={['waiter']}>
                      <ReservationsPage />
                    </ProtectedRoute>
                  </RouteGuard>
                }
              />

              <Route
                path="/dish_menu"
                element={
                  <RouteGuard>
                    <ProtectedRoute requiredRoles={['manager']}>
                      <DishMenuMgmt />
                    </ProtectedRoute>
                  </RouteGuard>
                }
              />

              <Route
                path="/profile"
                element={
                  <RouteGuard>
                    <ProtectedRoute requiredRoles={['manager', 'waiter', 'cashier', 'chef']}>
                      <Profile />
                    </ProtectedRoute>
                  </RouteGuard>
                }
              />


              <Route
                path="/staff"
                element={
                  <RouteGuard>
                    <ProtectedRoute requiredRoles={['manager', 'waiter', 'cashier', 'chef']}>
                      <StaffManagement />
                    </ProtectedRoute>
                  </RouteGuard>
                }
              />

              <Route
                path="/reset_password"
                element={
                  <RouteGuard>
                    <ProtectedRoute requiredRoles={['manager', 'waiter', 'cashier', 'chef']}>
                      <ResetPassword />
                    </ProtectedRoute>
                  </RouteGuard>
                }
              />

              <Route
                path="/tables"
                element={
                  <RouteGuard>
                    <ProtectedRoute requiredRoles={['manager', 'waiter', 'cashier', 'chef']}>
                      <TableManagement />
                    </ProtectedRoute>
                  </RouteGuard>
                }
              />

              <Route
                path="/delivery"
                element={
                  <RouteGuard>
                    <ProtectedRoute requiredRoles={['waiter']}>
                      <StaffDelivery />
                    </ProtectedRoute>
                  </RouteGuard>
                }
              />

              <Route
                path="/kitchen"
                element={
                  <RouteGuard>
                    <ProtectedRoute requiredRoles={['chef']}>
                      <KitchenOrder />
                    </ProtectedRoute>
                  </RouteGuard>
                }
              />

              <Route
                path="/invoices"
                element={
                  <RouteGuard>
                    <ProtectedRoute requiredRoles={['cashier']}>
                      <InvoicePage />
                    </ProtectedRoute>
                  </RouteGuard>
                }
              />

              {/* FALLBACK */}
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

/* ================= ROOT ================= */
export default function App() {
  return (
    <ApiProvider>
      <Router>
        <AppContent />
      </Router>
    </ApiProvider>
  );
}
