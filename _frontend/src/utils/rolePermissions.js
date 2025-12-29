// src/utils/rolePermissions.js

/**
 * Định nghĩa quyền truy cập cho mỗi role
 * Key: role_name từ backend
 * Value: { navItems: [], allowedRoutes: [] }
 */

export const ROLE_PERMISSIONS = {
  manager: {
    label: 'Quản Lý',
    navItems: [
      { icon: 'Store', label: 'Bàn', href: '/tables' },
      { icon: 'Users', label: 'Nhân Viên', href: '/staff' },
      { icon: 'UtensilsCrossed', label: 'Quản Lý Menu', href: '/dish_menu' },
    ],
    allowedRoutes: [
      '/staff',
      '/tables',
      '/dish_menu',
      '/profile',
      '/reset_password',
      '/tables'
    ],
  },

  waiter: {
    label: 'Phục Vụ',
    navItems: [
      { icon: 'Store', label: 'Bàn', href: '/tables', exact: true },
      { icon: 'Calendar', label: 'Đặt Bàn', href: '/reservations' },
      { icon: 'Package', label: 'Giao Món', href: '/delivery' },
    ],
    allowedRoutes: [
      '/tables',
      '/reservations',
      '/delivery',
      '/profile',
      '/reset_password',
    ],
  },

  chef: {
    label: 'Đầu Bếp',
    navItems: [
      { icon: 'Store', label: 'Bàn', href: '/tables', exact: true },
      { icon: 'UtensilsCrossed', label: 'Gọi Món', href: '/kitchen' },
    ],
    allowedRoutes: [
      '/kitchen',
      '/profile',
      '/reset_password',
      '/tables'
    ],
  },

  cashier: {
    label: 'Thu Ngân',
    navItems: [
      { icon: 'Store', label: 'Bàn', href: '/tables', exact: true },
      { icon: 'FileText', label: 'Hóa Đơn', href: '/invoices', exact: true },
    ],
    allowedRoutes: [
      '/invoices',
      '/profile',
      '/reset_password',
      '/tables'
    ],
  },

  guest: {
    label: 'Khách',
    navItems: [
      { icon: 'UtensilsCrossed', label: 'Thực Đơn', href: '/menu', exact: true },
    ],
    allowedRoutes: [
      '/menu',
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
