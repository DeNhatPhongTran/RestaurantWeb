// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { isRouteAllowed } from '@/utils/rolePermissions';

/**
 * Protected Route Component
 * 
 * Kiểm tra:
 * 1. User đã đăng nhập (token + userInfo trong localStorage)
 * 2. User có quyền truy cập route này
 * 
 * Nếu không đủ điều kiện → redirect về /home
 */
const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const userInfo = localStorage.getItem('userInfo');
  const token = localStorage.getItem('token');

  if (!userInfo || !token) {
    return <Navigate to="/home" replace />;
  }

  try {
    const user = JSON.parse(userInfo);
    const roleName = user?.role?.role_name;

    if (!roleName) {
      return <Navigate to="/home" replace />;
    }

    // Nếu có yêu cầu role và user KHÔNG nằm trong danh sách cho phép
    if (
      requiredRoles.length > 0 &&
      !requiredRoles.includes(roleName)
    ) {
      console.warn(
        `Access denied: Required roles ${requiredRoles.join(', ')}, but user is ${roleName}`
      );
      return <Navigate to="/home" replace />;
    }

    return children;
  } catch (error) {
    console.error('Error parsing userInfo:', error);
    return <Navigate to="/home" replace />;
  }
};

export default ProtectedRoute;