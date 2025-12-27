# 🚀 Hướng Dẫn Sử Dụng Trang Quản Lý Nhân Viên

## ✅ Tập Tin Đã Tạo

### Trang Chính
- **[_frontend/src/pages/StaffManagement.jsx](_frontend/src/pages/StaffManagement.jsx)** - Trang quản lý nhân viên chính

### Components
- **[_frontend/src/components/staff/UserCard.jsx](_frontend/src/components/staff/UserCard.jsx)** - Card hiển thị thông tin nhân viên
- **[_frontend/src/components/staff/CreateUserModal.jsx](_frontend/src/components/staff/CreateUserModal.jsx)** - Modal tạo nhân viên mới
- **[_frontend/src/components/staff/EditUserModal.jsx](_frontend/src/components/staff/EditUserModal.jsx)** - Modal chỉnh sửa nhân viên
- **[_frontend/src/components/staff/DeleteUserConfirmModal.jsx](_frontend/src/components/staff/DeleteUserConfirmModal.jsx)** - Modal xác nhận xóa nhân viên
- **[_frontend/src/components/staff/index.js](_frontend/src/components/staff/index.js)** - Export components

---

## 📋 Các Tính Năng

### 1️⃣ Hiển Thị Danh Sách Nhân Viên
- ✅ Danh sách nhân viên dạng grid (responsive)
- ✅ Mỗi card hiển thị: tên, chức vụ, tài khoản, ID, trạng thái, số điện thoại
- ✅ 2 nút hành động: Sửa & Xóa

### 2️⃣ Tìm Kiếm & Lọc
- ✅ Search bar tìm kiếm theo tên hoặc tên tài khoản
- ✅ Tabs lọc theo chức vụ (role)
- ✅ Hiển thị số lượng nhân viên mỗi chức vụ
- ✅ Tab "Tất Cả" hiển thị toàn bộ

### 3️⃣ Tạo Nhân Viên Mới
Form với các trường:
- ✅ **Tên Nhân Viên** (required)
- ✅ **Tên Tài Khoản** (required, unique)
- ✅ **Mật Khẩu** (required)
  - Nút "Tạo" để random 10 chữ số
  - Toggle hiển thị/ẩn mật khẩu
- ✅ **Số Điện Thoại** (optional)
- ✅ **Chức Vụ** (required, dropdown)

### 4️⃣ Chỉnh Sửa Nhân Viên
- ✅ Sửa tên, số điện thoại, chức vụ, trạng thái
- ✅ Không cho sửa tên tài khoản
- ✅ Xem thông tin cũ trước khi lưu

### 5️⃣ Xóa Nhân Viên
- ✅ Modal xác nhận với thông tin nhân viên
- ✅ Cảnh báo hành động không thể hoàn tác
- ✅ Hiển thị thông tin: Tên, tài khoản, chức vụ

---

## 🔌 API Endpoints

Trang sử dụng các endpoint sau (đã được implement trong backend):

```
✅ GET    /api/auth/users/list       → Lấy danh sách nhân viên
✅ GET    /api/roles/list            → Lấy danh sách chức vụ
✅ POST   /api/auth/users            → Tạo nhân viên mới
✅ PUT    /api/auth/users/:id        → Cập nhật nhân viên
✅ DELETE /api/auth/users/:id        → Xóa nhân viên
```

> Tất cả endpoint (trừ GET /api/roles/list) yêu cầu JWT token

---

## 🎯 Cách Tích Hợp vào Ứng Dụng

### Step 1: Thêm Route
```javascript
// src/App.jsx hoặc router config
import StaffManagement from './pages/StaffManagement'

const routes = [
  // ... các route khác
  {
    path: '/staff-management',
    element: <StaffManagement />
  }
]
```

### Step 2: Thêm vào Navigation
```javascript
// components/layout/Sidebar.jsx hoặc Navigation
import { Users } from 'lucide-react'
import { Link } from 'react-router-dom'

export const StaffLink = () => (
  <Link to="/staff-management" className="flex items-center gap-2">
    <Users className="h-5 w-5" />
    Quản Lý Nhân Viên
  </Link>
)
```

### Step 3: Thêm Role Protection (Optional)
```javascript
// components/ProtectedRoute.jsx
const ManagerRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('userInfo'))
  if (user?.role?.role_name !== 'manager') {
    return <Navigate to="/" replace />
  }
  return children
}

// Sử dụng
<Route 
  path="/staff-management" 
  element={
    <ManagerRoute>
      <StaffManagement />
    </ManagerRoute>
  } 
/>
```

---

## 📱 Responsive Design

| Breakpoint | Layout |
|-----------|---------|
| Mobile (< 768px) | 1 cột |
| Tablet (768-1024px) | 2-3 cột |
| Desktop (> 1024px) | 3-4 cột |

---

## 🎨 Design Consistency

### Màu Sắc
- **Primary**: Xanh dương (chính)
- **Success**: Xanh lá (trạng thái tốt)
- **Warning**: Cam (cảnh báo)
- **Danger**: Đỏ (xóa, lỗi)
- **Secondary**: Xám (text phụ)

### Components Tái Sử Dụng
- `Button` - từ `../components/ui/button`
- `SearchBar` - từ `../components/common/SearchBar`
- `Tabs/TabsList/TabsTrigger` - từ `../components/ui/tabs`
- `ModalHeader` - từ `../components/common`

---

## 🔒 Bảo Mật

✅ **Token-Based Auth**
- Tất cả request gửi token trong header `Authorization: Bearer <token>`
- Token lấy từ localStorage hoặc context

✅ **Password Security**
- Mật khẩu được hash trên backend (bcryptjs)
- Random password 10 ký tự (0-9, a-z, A-Z)

✅ **Input Validation**
- Frontend: Kiểm tra required fields
- Backend: Validation + unique username check

✅ **CORS & Request Interception**
- API instance từ [_frontend/src/utils/api.js] tự động thêm token
- Xử lý 401 responses (redirect to login)

---

## ⚙️ Cấu Hình Environment

Cần thiết lập trong `.env` frontend:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🧪 Testing Checklist

- [ ] Trang load được danh sách nhân viên
- [ ] Search hoạt động (tên/username)
- [ ] Tabs lọc theo role hoạt động
- [ ] Nút "Tạo Nhân Viên Mới" mở modal
- [ ] Form validation hoạt động
- [ ] Random password button tạo mật khẩu
- [ ] Tạo nhân viên thành công
- [ ] Sửa nhân viên hoạt động
- [ ] Xóa nhân viên có xác nhận
- [ ] Responsive trên mobile/tablet/desktop
- [ ] Logout & re-login vẫn hoạt động

---

## 📊 Dữ Liệu Mẫu

### User Object
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "fullname": "Nguyễn Văn A",
  "username": "nguyen_a",
  "phone": "0912345678",
  "role": {
    "_id": "507f1f77bcf86cd799439012",
    "role_name": "waiter"
  },
  "state": "working",
  "created_at": "2024-12-26T10:00:00.000Z"
}
```

### Role Object
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "role_name": "waiter"
}
```

---

## 🐛 Troubleshooting

### ❌ Không thấy danh sách nhân viên
**Nguyên nhân**: Token không hợp lệ hoặc backend không chạy
```bash
# Kiểm tra backend
cd backend
npm run dev

# Kiểm tra token trong browser console
localStorage.getItem('authToken')
```

### ❌ Tạo nhân viên thất bại
**Nguyên nhân**: Tên tài khoản trùng lặp
```javascript
// Kiểm tra tên tài khoản unique
// Backend kiểm tra: User.findOne({ username })
```

### ❌ Không thấy chức vụ (roles)
**Nguyên nhân**: Backend chưa khởi tạo roles
```bash
# Kiểm tra database
db.roles.find()

# Nếu trống, chạy seed script
cd backend
node scripts/seed.js
```

---

## 🚀 Mở Rộng Tương Lai

- [ ] Pagination cho danh sách dài
- [ ] Export CSV/PDF danh sách
- [ ] Bulk actions (xóa nhiều, đổi role)
- [ ] Avatar/profile picture
- [ ] Lịch sử hoạt động nhân viên
- [ ] Quản lý phân công công việc
- [ ] Advanced filters (ngày tạo, status)
- [ ] Import employee list từ file

---

## 📚 Tài Liệu Liên Quan

- Backend Routes: [backend/ROUTES_SUMMARY.md](../backend/ROUTES_SUMMARY.md)
- Database Design: [_frontend/.agent/database_design.md](_frontend/.agent/database_design.md)
- Login Logic: [_frontend/.agent/LOGIN_LOGIC.md](_frontend/.agent/LOGIN_LOGIC.md)

---

## ✨ Hoàn Thành!

Trang Quản Lý Nhân Viên đã sẵn sàng sử dụng. Bạn chỉ cần:
1. Import trang vào router
2. Thêm vào navigation
3. (Optional) Thêm role protection cho manager
4. Test trên browser

🎉 Enjoy!
