// src/utils/rolePermissions.js

/**
 * Định nghĩa quyền truy cập cho mỗi role
 * Key: role_name từ backend
 * Value: { navItems: [], allowedRoutes: [] }
 */

export const ROLE_PERMISSIONS = {
  manager: {
    label: '👔 Quản Lý',
    navItems: [
      { icon: 'Store', label: 'Dashboard', href: '/dashboard', exact: true },
      { icon: 'Users', label: 'Nhân Viên', href: '/staff' },
      { icon: 'File', label: 'Đơn Hàng', href: '/orders' },
      { icon: 'Store', label: 'Bàn', href: '/tables' },
      { icon: 'Calendar', label: 'Đặt Bàn', href: '/reservations' },
      { icon: 'FileText', label: 'Hóa Đơn', href: '/invoices' },
      { icon: 'Clock', label: 'Lịch Sử', href: '/history' },
      { icon: 'UtensilsCrossed', label: 'Quản Lý Menu', href: '/dish_menu' },
      { icon: 'BarChart', label: 'Thống Kê', href: '/analytics' },
    ],
    allowedRoutes: [
      '/dashboard',
      '/staff',
      '/orders',
      '/tables',
      '/reservations',
      '/invoices',
      '/history',
      '/dish_menu',
      '/analytics',
      '/profile',
      '/reset_password',
      '/tables'
    ],
  },

  waiter: {
    label: '🍽️ Phục Vụ',
    navItems: [
      { icon: 'Store', label: 'Bàn', href: '/tables', exact: true },
      { icon: 'Calendar', label: 'Đặt Bàn', href: '/reservations' },
      { icon: 'File', label: 'Gọi Món', href: '/orders' },
      { icon: 'Package', label: 'Giao Món', href: '/delivery' },
      { icon: 'Clock', label: 'Lịch Sử', href: '/history' },
    ],
    allowedRoutes: [
      '/tables',
      '/reservations',
      '/orders',
      '/delivery',
      '/history',
      '/profile',
      '/reset_password',
    ],
  },

  chef: {
    label: '👨‍🍳 Đầu Bếp',
    navItems: [
      { icon: 'File', label: 'Danh Sách Món', href: '/orders', exact: true },
      { icon: 'UtensilsCrossed', label: 'Gọi Món', href: '/kitchen' },
      { icon: 'Clock', label: 'Lịch Sử', href: '/history' },
    ],
    allowedRoutes: [
      '/orders',
      '/kitchen',
      '/history',
      '/profile',
      '/reset_password',
    ],
  },

  cashier: {
    label: '💰 Thu Ngân',
    navItems: [
      { icon: 'FileText', label: 'Hóa Đơn', href: '/invoices', exact: true },
      { icon: 'Clock', label: 'Lịch Sử', href: '/history' },
    ],
    allowedRoutes: [
      '/invoices',
      '/history',
      '/profile',
      '/reset_password',
    ],
  },

  guest: {
    label: '👤 Khách',
    navItems: [
      { icon: 'UtensilsCrossed', label: 'Thực Đơn', href: '/menu', exact: true },
      { icon: 'Calendar', label: 'Đặt Bàn', href: '/reservations' },
    ],
    allowedRoutes: [
      '/menu',
      '/reservations',
      '/home',
    ],
  },
};

/**
 * Lấy thông tin quyền của một role
 * @param {string} roleName - role_name từ user.role.role_name
 * @returns {Object} Quyền của role
 */
export const getPermission = (roleName) => {
  return ROLE_PERMISSIONS[roleName] || ROLE_PERMISSIONS.guest;
};

/**
 * Kiểm tra user có quyền truy cập route này không
 * @param {string} roleName - role_name từ user
 * @param {string} pathname - đường dẫn cần kiểm tra
 * @returns {boolean}
 */
export const isRouteAllowed = (roleName, pathname) => {
  const permission = getPermission(roleName);
  
  // Cho phép route home và login
  if (pathname === '/' || pathname === '/home' || pathname === '/login') {
    return true;
  }

  // Kiểm tra xem pathname có trong allowedRoutes không
  return permission.allowedRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
};

/**
 * Lấy icon React component name từ string
 * Dùng trong RoleSidebar để render icon
 */
export const ICON_MAP = {
  Store: 'Store',
  Users: 'Users',
  File: 'File',
  Calendar: 'Calendar',
  FileText: 'FileText',
  Clock: 'Clock',
  Package: 'Package',
  BarChart: 'BarChart3',
  UtensilsCrossed: 'UtensilsCrossed',
};
