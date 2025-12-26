# 🔒 ROLE-BASED SIDEBAR & PROTECTED ROUTES

## 📋 Tổng Quan

Hệ thống phân quyền dựa trên `role_name` từ backend:
- **Manager** (👔) → Tất cả quyền
- **Waiter** (🍽️) → Bàn, Đặt bàn, Gọi món, Lịch sử
- **Chef** (👨‍🍳) → Danh sách món, Lịch sử
- **Cashier** (💰) → Hóa đơn, Lịch sử
- **Guest** (👤) → Thực đơn, Đặt bàn

---

## 📁 File Structure

```
src/
├── utils/
│   └── rolePermissions.js           ← Config phân quyền
├── components/
│   ├── ProtectedRoute.jsx            ← Wrapper bảo vệ routes
│   └── layout/
│       └── RoleSidebar.jsx           ← Sidebar dynamic
├── App.jsx                           ← Routing + RouteGuard
└── pages/
    ├── LoginPage.jsx
    ├── Home/Home.jsx
    └── ...
```

---

## 🔑 Config Phân Quyền

### File: `src/utils/rolePermissions.js`

```javascript
export const ROLE_PERMISSIONS = {
  manager: {
    label: '👔 Quản Lý',
    navItems: [
      { icon: 'Store', label: 'Dashboard', href: '/dashboard' },
      { icon: 'Users', label: 'Nhân Viên', href: '/staff' },
      { icon: 'File', label: 'Đơn Hàng', href: '/orders' },
      // ...
    ],
    allowedRoutes: ['/dashboard', '/staff', '/orders', ...],
  },
  
  waiter: {
    label: '🍽️ Phục Vụ',
    navItems: [
      { icon: 'Store', label: 'Bàn', href: '/tables' },
      { icon: 'Calendar', label: 'Đặt Bàn', href: '/reservations' },
      // ...
    ],
    allowedRoutes: ['/tables', '/reservations', '/orders', ...],
  },
  
  // ...
};

// Helper functions
- getPermission(roleName)        → Lấy quyền của role
- isRouteAllowed(roleName, path) → Kiểm tra quyền route
```

---

## 🔐 Protected Route

### File: `src/components/ProtectedRoute.jsx`

```jsx
import ProtectedRoute from '@/components/ProtectedRoute';

// Basic: kiểm tra login + role bất kỳ
<ProtectedRoute>
  <OrderListPage />
</ProtectedRoute>

// Strict: yêu cầu role cụ thể
<ProtectedRoute requiredRole="manager">
  <AdminDashboard />
</ProtectedRoute>

// Logic
1. Kiểm tra localStorage.getItem('userInfo') + token
2. Kiểm tra user.role.role_name
3. Nếu không đủ → <Navigate to="/home" />
```

---

## 🎨 Role Sidebar

### File: `src/components/layout/RoleSidebar.jsx`

**Features:**
- ✅ Sidebar dùng shadcn `<Sidebar>` components
- ✅ Lấy user info từ localStorage
- ✅ Hiển thị navItems theo role
- ✅ Icon động từ lucide-react
- ✅ Active state cho current page
- ✅ Logout button

**Usage:**

```jsx
import { SidebarProvider } from '@/components/ui/sidebar';
import RoleSidebar from '@/components/layout/RoleSidebar';

<SidebarProvider>
  <RoleSidebar onLogout={() => window.location.href = '/login'} />
</SidebarProvider>
```

---

## 🛣️ Routing & Route Guard

### File: `src/App.jsx`

**Flow:**

```
Route Request
    ↓
<RouteGuard> kiểm tra:
  1. User login check
  2. Role check
  3. isRouteAllowed()
    ↓
  Đủ quyền → Render component
  Không đủ → <Navigate to="/home" />
```

**Routes:**

```javascript
// Public routes
/home, /menu, /login

// Protected: manager only
/dashboard, /staff, /menu-management, /analytics

// Protected: waiter
/tables, /reservations, /orders (gọi món)

// Protected: chef
/orders (xem danh sách nấu)

// Protected: cashier
/invoices

// Wildcard
/anything-else → /home
```

---

## 🔄 Flow Đăng Nhập

```
1. User nhập username + password
   ↓
2. LoginPage: POST /api/auth/login
   ↓
3. Response: { user, token }
   ↓
4. Lưu vào localStorage:
   - userInfo: JSON.stringify(user)
   - token: response.data.token
   ↓
5. Điều hướng theo role:
   - manager  → /dashboard
   - waiter   → /tables
   - chef     → /orders
   - cashier  → /invoices
   ↓
6. App detect userInfo → render RoleSidebar
   ↓
7. Sidebar show navItems cho role đó
```

---

## 🚫 Truy Cập Không Được Phép

### Scenario: Waiter cố truy cập `/staff` (manager only)

```
1. URL: http://localhost:5173/staff
   ↓
2. <RouteGuard> kiểm tra:
   - userInfo? ✓ (có)
   - isRouteAllowed('waiter', '/staff')? ✗ (không)
   ↓
3. console.warn("Access denied for route: /staff")
   ↓
4. <Navigate to="/home" replace />
   ↓
5. Redirect → /home
```

---

## 🧪 Testing

### Test 1: Manager Login

```bash
1. Vào http://localhost:5173/login
2. Username: manager1
3. Password: 123
4. Expected:
   - Redirect → /dashboard
   - Sidebar show: Dashboard, Nhân Viên, Đơn Hàng, Bàn, Đặt Bàn, Hóa Đơn, Lịch Sử, Menu, Thống Kê
   - Click "Hóa Đơn" → /invoices
```

### Test 2: Waiter Login

```bash
1. Username: waiter1
2. Password: 123
3. Expected:
   - Redirect → /tables
   - Sidebar show: Bàn, Đặt Bàn, Gọi Món, Lịch Sử
   - Không thấy "Nhân Viên", "Menu", "Thống Kê"
```

### Test 3: Unauthorized Access

```bash
1. Login as waiter1
2. Manual URL: http://localhost:5173/staff
3. Expected:
   - Redirect → /home
   - Console warning
```

### Test 4: Direct Link on Sidebar

```bash
1. Login as manager1
2. Sidebar click "Hóa Đơn"
3. Expected:
   - Navigate to /invoices
   - Menu item active state
```

---

## 🛠️ Thêm Route Mới

### Step 1: Update `rolePermissions.js`

```javascript
export const ROLE_PERMISSIONS = {
  manager: {
    navItems: [
      // ... existing items
      { icon: 'Settings', label: 'Settings', href: '/settings' }, // NEW
    ],
    allowedRoutes: [
      // ... existing routes
      '/settings', // NEW
    ],
  },
};
```

### Step 2: Update `App.jsx` Routes

```javascript
<Route 
  path="/settings" 
  element={
    <ProtectedRoute requiredRole="manager">
      <SettingsPage />
    </ProtectedRoute>
  } 
/>
```

### Step 3: Test

```bash
npm run dev
# Login as manager1
# Sidebar should show "Settings"
# Click it → /settings
```

---

## 🔗 Thêm Role Mới

### Step 1: Update `rolePermissions.js`

```javascript
export const ROLE_PERMISSIONS = {
  // ... existing roles
  
  supervisor: {
    label: '🕵️ Giám Sát',
    navItems: [
      { icon: 'BarChart', label: 'Báo Cáo', href: '/reports' },
      { icon: 'Users', label: 'Nhân Viên', href: '/staff' },
    ],
    allowedRoutes: ['/reports', '/staff'],
  },
};
```

### Step 2: Update Routes (nếu cần)

```javascript
<Route 
  path="/reports" 
  element={
    <ProtectedRoute requiredRole="supervisor">
      <ReportsPage />
    </ProtectedRoute>
  } 
/>
```

### Step 3: Backend: Seed supervisor role

```bash
cd backend
# Sửa init_db.js hoặc seed script
roleNames.push('supervisor')
# npm run seed
```

---

## 💡 Best Practices

1. **Luôn sử dụng ProtectedRoute** cho sensitive pages
2. **Logout** xóa localStorage + redirect `/login`:
   ```javascript
   handleLogout = () => {
     localStorage.removeItem('userInfo');
     localStorage.removeItem('token');
     window.location.href = '/login';
   };
   ```

3. **API calls**: Gửi token trong header
   ```javascript
   const token = localStorage.getItem('token');
   axios.get('/api/protected', {
     headers: { Authorization: `Bearer ${token}` }
   });
   ```

4. **Kiểm tra login** trước render component:
   ```javascript
   const userInfo = localStorage.getItem('userInfo');
   if (!userInfo) return <Navigate to="/login" />;
   ```

5. **Update navItems** khi thêm feature mới
   - Thêm icon, label, href
   - Thêm route vào allowedRoutes
   - Thêm protected route component

---

## 📞 Troubleshooting

| Vấn Đề | Giải Pháp |
|--------|----------|
| Sidebar không hiển thị | Check: localStorage có userInfo? `console.log(localStorage)` |
| Menu items không đúng | Verify: role_name đúng? rolePermissions config đúng? |
| Redirect /home khi truy cập route | Normal! Check: role có trong allowedRoutes không? |
| Logout không work | Xóa localStorage + refresh: `localStorage.clear(); location.reload()` |
| Icon không hiển thị | Check: icon name đúng? ICONS map có không? |

---

## ✅ Checklist

- [x] rolePermissions.js định nghĩa đủ roles
- [x] ProtectedRoute wrapper được dùng
- [x] RoleSidebar hiển thị items đúng role
- [x] App.jsx có RouteGuard + protected routes
- [x] Logout xóa localStorage + redirect
- [x] Test login + sidebar + unauthorized access
- [x] Test navItems active state
- [x] Test logout button

---

**Created:** 26/12/2025
**Status:** ✅ Ready to use
