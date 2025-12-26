# 🔐 HƯỚNG DẪN LOGIC ĐĂNG NHẬP VÀ KHỞI TẠO HỆ THỐNG

## 📋 Mục lục
1. [Logic Đăng Nhập](#logic-đăng-nhập)
2. [Cấu Trúc API](#cấu-trúc-api)
3. [Khởi Tạo Dữ Liệu (Seed Database)](#khởi-tạo-dữ-liệu)
4. [Tài Khoản Test](#tài-khoản-test)
5. [Phân Quyền Theo Vai Trò](#phân-quyền-theo-vai-trò)

---

## 🔐 Logic Đăng Nhập

### Frontend Flow (React)

#### 1. **Nhân viên đăng nhập**
```
User nhập username + password
    ↓
Form submit → POST /api/auth/login
    ↓
Backend xác thực (bcrypt compare)
    ↓
Return: { user, token }
    ↓
Frontend lưu:
  - localStorage.setItem('userInfo', JSON.stringify(user))
  - localStorage.setItem('token', response.data.token)
    ↓
Điều hướng theo role:
  - manager → /admin/dashboard
  - waiter → /waiter/reservations
  - chef → /chef/orders
  - cashier → /cashier/invoices
```

#### 2. **Khách hàng đăng nhập**
```
User click "Tiếp tục với tư cách Khách"
    ↓
localStorage.setItem('userInfo', JSON.stringify({ 
  role: { role_name: 'guest' } 
}))
    ↓
Điều hướng → /home
```

### Backend Flow (Node.js)

```javascript
// routes/auth.js - POST /api/auth/login

1. Validate input (username, password required)
   ↓
2. Find user by username
   - User.findOne({ username }).populate('role')
   ↓
3. Compare password
   - bcrypt.compare(password, user.password_hash)
   ↓
4. If valid:
   - Generate JWT token
   - jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' })
   ↓
5. Return response:
   {
     success: true,
     message: 'Login successful',
     user: {
       id, fullname, username, phone, role: { _id, role_name }
     },
     token
   }
```

---

## 🔗 Cấu Trúc API

### Endpoints

| Method | Endpoint | Mô Tả | Body |
|--------|----------|-------|------|
| POST | `/api/auth/login` | Đăng nhập nhân viên | `{ username, password }` |
| POST | `/api/auth/register` | Đăng ký (không khuyến khích) | `{ fullname, username, password, phone }` |
| GET | `/api/auth/me` | Lấy thông tin user (cần token) | Header: `Authorization: Bearer {token}` |

### Response Của Login

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

---

## 🌱 Khởi Tạo Dữ Liệu

### Cách Chạy Seed Script

```bash
# B1: Đi vào thư mục backend
cd backend

# B2: Chạy seed script
npm run seed
```

### Dữ Liệu Được Tạo

#### 1. **Roles** (4 vai trò)
```
- manager (Quản lý)
- waiter (Phục vụ)
- chef (Đầu bếp)
- cashier (Thu ngân)
```

#### 2. **Users** (4 tài khoản nhân viên)
```
Manager:
  - username: manager1
  - password_hash: bcrypt(123)
  - role: manager

Waiter:
  - username: waiter1
  - password_hash: bcrypt(123)
  - role: waiter

Chef:
  - username: chef1
  - password_hash: bcrypt(123)
  - role: chef

Cashier:
  - username: cashier1
  - password_hash: bcrypt(123)
  - role: cashier
```

#### 3. **Categories** (5 danh mục)
```
- Món khai vị
- Món súp
- Món chính
- Món tráng miệng
- Đồ uống
```

#### 4. **Menu Items** (40+ món ăn)
```
Ví dụ:
- Gà rán giòn (39.000 VNĐ)
- Cơm Gà Hải Nam (55.000 VNĐ)
- Bít tết Bò (120.000 VNĐ)
...
```

#### 5. **Tables** (10 bàn)
```
Bàn A: A1, A2, A3, A4, A5
Bàn B: B1, B2, B3, B4, B5
```

#### 6. **Sample Data**
```
- Reservations (3 đơn đặt bàn mẫu)
- OrderItems (10+ món đã gọi)
- Invoices (1 hóa đơn)
- LeaveRequests (2 đơn nghỉ phép)
```

---

## 👤 Tài Khoản Test

### Nhân Viên

| Chức Vụ | Username | Password | Mục Đích |
|---------|----------|----------|---------|
| 👔 Manager | `manager1` | `123` | Xem dashboard, quản lý nhân viên, duyệt nghỉ phép |
| 🍽️ Waiter | `waiter1` | `123` | Đặt bàn, gọi món, theo dõi |
| 👨‍🍳 Chef | `chef1` | `123` | Xem danh sách món, cập nhật trạng thái |
| 💰 Cashier | `cashier1` | `123` | Tạo và xử lý hóa đơn |

### Khách

- Không cần đăng nhập, chỉ cần click "Tiếp tục với tư cách Khách"
- Có thể xem thực đơn, đặt bàn, gọi món

---

## 🔑 Phân Quyền Theo Vai Trò

### Manager (Quản Lý)
```
✅ Tất cả chức năng
✅ Xem dashboard thống kê
✅ Quản lý nhân viên (CRUD)
✅ Phân công vai trò
✅ Duyệt đơn nghỉ phép
✅ Quản lý thực đơn
✅ Xem báo cáo doanh thu
```

### Waiter (Phục Vụ)
```
✅ Đặt bàn
✅ Gọi món
✅ Xem danh sách order
✅ Theo dõi trạng thái chế biến
❌ Xem hóa đơn
❌ Quản lý nhân viên
```

### Chef (Đầu Bếp)
```
✅ Xem danh sách món cần nấu
✅ Cập nhật trạng thái: waiting → cooking → cooked
✅ Xem ghi chú đặc biệt
❌ Gọi thêm món
❌ Thanh toán
```

### Cashier (Thu Ngân)
```
✅ Xem hóa đơn
✅ Xử lý thanh toán (cash, card, bank, e-wallet)
✅ Xuất hóa đơn
❌ Gọi món
❌ Quản lý nhân viên
```

---

## 📱 Frontend Flow

### LoginPage.jsx (Cải Tiến)

```jsx
// URL API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// State Management
- username: string
- password: string
- loading: boolean (khi submit form)
- error: string (hiển thị lỗi)

// Functions
1. handleInputChange()
   - Xóa message lỗi cũ khi user nhập
   
2. handleStaffLogin()
   - Validate input
   - POST /api/auth/login
   - Lưu token + userInfo
   - Điều hướng theo role
   
3. handleGuestLogin()
   - Lưu guest info
   - Điều hướng → /home

// Features
✅ Error handling (validation, network errors)
✅ Loading state (disable button, show spinner)
✅ Tab switching (Staff ↔ Guest)
✅ Test accounts info (hiển thị dưới form)
✅ Responsive design (mobile friendly)
```

---

## 🚀 Quick Start

### 1. Seed Database
```bash
cd backend
npm run seed
# Output: ✅ Database seeding completed!
```

### 2. Start Backend
```bash
npm run dev
# Server running on http://localhost:5000
```

### 3. Start Frontend
```bash
cd _frontend
npm run dev
# Vite running on http://localhost:5173
```

### 4. Test Login
- Vào http://localhost:5173/login
- Chọn tab "👨‍💼 Nhân viên"
- Nhập: manager1 / 123
- Nhấn "🔓 Đăng nhập"
- Sẽ điều hướng tới /admin/dashboard

---

## 🔍 Debug Tips

### Check localStorage
```javascript
// Mở DevTools Console
console.log(JSON.parse(localStorage.getItem('userInfo')))
console.log(localStorage.getItem('token'))
```

### Check API Response
```javascript
// Mở Network tab, filter theo "login"
// Xem Response body
```

### Check Backend Logs
```bash
# Terminal backend sẽ show:
Login error: { ... }
// hoặc
Login successful: manager1 (manager)
```

---

## ✅ Verification Checklist

- [ ] `npm run seed` thành công
- [ ] Database có 4 roles, 4 users, 40+ menu items
- [ ] Backend endpoint `/api/auth/login` hoạt động
- [ ] Frontend LoginPage load không lỗi
- [ ] Đăng nhập với manager1/123 được
- [ ] Token lưu vào localStorage
- [ ] Điều hướng theo role work correctly
