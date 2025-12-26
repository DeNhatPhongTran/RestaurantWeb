# ✅ HOÀN THÀNH: LOGIC ĐĂNG NHẬP + KHỞI TẠO MANAGER

## 📊 Dữ Liệu Đã Tạo Thành Công

### ✅ Vai Trò (Roles)
- manager (Quản lý)
- waiter (Phục vụ)
- chef (Đầu bếp)
- cashier (Thu ngân)

### ✅ Tài Khoản Nhân Viên (Users)
Tất cả có password là `123` (mã hóa với bcrypt):

```
👔 Manager
   └─ username: manager1
      password: 123
      role: manager

🍽️ Waiter
   └─ username: waiter1
      password: 123
      role: waiter

👨‍🍳 Chef
   └─ username: chef1
      password: 123
      role: chef

💰 Cashier
   └─ username: cashier1
      password: 123
      role: cashier
```

### ✅ Danh Mục Menu (5)
- Món khai vị
- Món súp
- Món chính
- Món tráng miệng
- Đồ uống

### ✅ Thực Đơn (Menu Items)
52 món ăn với đầy đủ thông tin:
- Tên, giá, hình ảnh
- Danh mục
- Trạng thái phục vụ
- Mô tả

### ✅ Bàn (Tables)
14 bàn từ B1 đến B14

### ✅ Dữ Liệu Mẫu
- 3 đơn đặt bàn (Reservations)
- 10+ món đã gọi (OrderItems)
- 1 hóa đơn (Invoice)
- 2 đơn nghỉ phép (LeaveRequests)

---

## 🔐 Logic Đăng Nhập Được Cải Thiện

### Frontend (React) - LoginPage.jsx

#### State
```javascript
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const [loading, setLoading] = useState(false);        // Khi submit
const [error, setError] = useState('');               // Hiển thị lỗi
```

#### Validation
```javascript
if (!username.trim() || !password.trim()) {
  setError('Vui lòng nhập tên đăng nhập và mật khẩu');
  return;
}
```

#### API Call
```javascript
const response = await axios.post(
  `${API_BASE_URL}/api/auth/login`,
  { username, password }
);
```

#### Lưu Data & Điều Hướng
```javascript
// Lưu token + user info
localStorage.setItem('userInfo', JSON.stringify(response.data.user));
localStorage.setItem('token', response.data.token);

// Điều hướng theo role
switch (response.data.user.role.role_name) {
  case 'manager':
    navigate('/admin/dashboard');
    break;
  case 'waiter':
    navigate('/waiter/reservations');
    break;
  case 'chef':
    navigate('/chef/orders');
    break;
  case 'cashier':
    navigate('/cashier/invoices');
    break;
}
```

#### Error Handling
```javascript
// Network error, validation error
const message = err.response?.data?.message || 'Lỗi kết nối';
setError(message);
```

---

## 📝 Backend API

### POST `/api/auth/login`

**Request:**
```json
{
  "username": "manager1",
  "password": "123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "fullname": "Manager One",
    "username": "manager1",
    "phone": "0123456789",
    "role": {
      "_id": "507f191e810c19729de860ea",
      "role_name": "manager"
    }
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (401):**
```json
{
  "success": false,
  "message": "Invalid username or password"
}
```

---

## 🎨 UI Improvements

### LoginPage (Mới)
```
┌─────────────────────────────────────┐
│ 🍽️ Quản Lý Nhà Hàng              │
│ Hệ thống quản lý nhà hàng          │
├─────────────────────────────────────┤
│ ⚠️ Error message (nếu có)          │
│                                     │
│ [👨‍💼 Nhân viên] [👤 Khách]        │
│                                     │
│ Tên đăng nhập                       │
│ [___________________]               │
│                                     │
│ Mật khẩu                            │
│ [___________________]               │
│                                     │
│ [🔓 Đăng nhập]                      │
│                                     │
│ ❓ Quên mật khẩu?                  │
│                                     │
│ 📝 Tài khoản test:                  │
│ Manager: manager1 / 123             │
│ Waiter: waiter1 / 123               │
│ Chef: chef1 / 123                   │
│ Cashier: cashier1 / 123             │
└─────────────────────────────────────┘
```

**Features:**
- ✅ Tab switching (Staff ↔ Guest)
- ✅ Loading state với spinner
- ✅ Error message với icon
- ✅ Test accounts info
- ✅ Responsive design
- ✅ Gradient background

---

## 🚀 Cách Sử Dụng

### 1. MongoDB Đã Chạy
```bash
# Kiểm tra container
docker ps | grep mongo
# Output: my-mongo

# Nếu chưa chạy
docker-compose up mongo -d
```

### 2. Backend

```bash
cd backend

# Seed database (lần đầu)
npm run seed

# Output:
# ✅ Database seeding completed!

# Start server
npm run dev
# Server running on http://localhost:5000
```

### 3. Frontend

```bash
cd _frontend

npm run dev
# Vite running on http://localhost:5173
```

### 4. Test Login

**Bước 1:** Vào http://localhost:5173/login

**Bước 2:** Tab "👨‍💼 Nhân viên"

**Bước 3:** Nhập
- Username: `manager1`
- Password: `123`

**Bước 4:** Click "🔓 Đăng nhập"

**Kết quả:** Sẽ điều hướng tới `/admin/dashboard` (nếu route tồn tại) hoặc `/profile`

---

## 🔍 Debug & Verification

### Check localStorage (DevTools Console)
```javascript
JSON.parse(localStorage.getItem('userInfo'))
// {
//   id: "...",
//   fullname: "Manager One",
//   username: "manager1",
//   phone: "0123456789",
//   role: { _id: "...", role_name: "manager" }
// }

localStorage.getItem('token')
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Check MongoDB
```bash
# Trong terminal, kết nối MongoDB
mongosh -u restaurant_db -p 1zMaouI2T8WPEc0T localhost:27017/restaurant_management

# Queries
db.roles.find()
db.users.find()
db.menuitems.find()
db.tables.find()
```

### Network Request
1. Mở DevTools → Network tab
2. Filter: `login`
3. Xem Request body + Response body

---

## 📋 Checklist

- [x] Tạo 4 vai trò (Manager, Waiter, Chef, Cashier)
- [x] Tạo 4 tài khoản nhân viên test
- [x] Tạo 5 danh mục món ăn
- [x] Tạo 52 món ăn
- [x] Tạo 14 bàn
- [x] Tạo dữ liệu mẫu (đặt bàn, gọi món, hóa đơn, nghỉ phép)
- [x] Cải thiện LoginPage (UI + UX)
- [x] Thêm validation input
- [x] Thêm error handling
- [x] Thêm loading state
- [x] Lưu token vào localStorage
- [x] Điều hướng theo role
- [x] Tạo seed script
- [x] Thêm npm script `npm run seed`

---

## 📚 File Liên Quan

| File | Mô Tả |
|------|-------|
| [backend/scripts/seed.js](../backend/scripts/seed.js) | Script khởi tạo database |
| [backend/routes/auth.js](../backend/routes/auth.js) | API endpoints auth |
| [frontend/src/pages/LoginPage.jsx](../frontend/src/pages/LoginPage.jsx) | Trang đăng nhập |
| [_frontend/.agent/LOGIN_LOGIC.md](./_frontend/.agent/LOGIN_LOGIC.md) | Hướng dẫn chi tiết |

---

## 🎯 Next Steps (Tùy Chọn)

### 1. Tạo Protected Routes
```javascript
// Middleware kiểm tra token
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;
  return children;
};
```

### 2. Tạo Role-Based Routes
```javascript
const ManagerRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  if (user?.role?.role_name !== 'manager') {
    return <Navigate to="/login" />;
  }
  return children;
};
```

### 3. Tạo Context cho Auth
```javascript
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  // ...
  return (
    <AuthContext.Provider value={{ user, token }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 4. Tạo Interceptor cho Axios
```javascript
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 📞 Support

Nếu gặp lỗi:
1. Kiểm tra MongoDB đã chạy: `docker ps | grep mongo`
2. Kiểm tra Backend: `curl http://localhost:5000`
3. Kiểm tra Frontend: `http://localhost:5173`
4. Xem logs backend: `npm run dev` (không background)
5. Xem DevTools Console + Network

---

**Tạo ngày:** 26/12/2025
**Status:** ✅ Hoàn thành
