# 📋 Trang Quản Lý Nhân Viên (Staff Management Page)

## Tổng Quan
Trang quản lý nhân viên cho phép quản lý viên (manager) xem, tạo, sửa và xóa nhân viên trong hệ thống. Trang này được thiết kế tương tự trang quản lý đơn hàng với các tính năng cơ bản để quản lý đội ngũ.

## 📁 Cấu Trúc File

```
_frontend/src/
├── pages/
│   └── StaffManagement.jsx          # 📄 Trang chính
├── components/
│   └── staff/
│       ├── index.js                 # 📄 Export components
│       ├── UserCard.jsx             # 📄 Card hiển thị thông tin nhân viên
│       ├── CreateUserModal.jsx       # 📄 Modal tạo nhân viên mới
│       ├── EditUserModal.jsx         # 📄 Modal sửa thông tin nhân viên
│       └── DeleteUserConfirmModal.jsx # 📄 Modal xác nhận xóa
```

## 🎯 Tính Năng

### 1. **Hiển Thị Danh Sách Nhân Viên**
- Hiển thị tất cả nhân viên trong grid layout
- Mỗi card hiển thị:
  - Tên nhân viên (lớn nhất)
  - Chức vụ (role badge)
  - Tên tài khoản
  - ID nhân viên
  - Trạng thái (Đang Làm Việc / Nghỉ Làm Việc)
  - Số điện thoại (nếu có)
  - 2 nút hành động: Sửa & Xóa

### 2. **Lọc & Tìm Kiếm**
- **Search Bar**: Tìm kiếm theo tên hoặc tên tài khoản
- **Role Tabs**: Lọc theo chức vụ, hiển thị số lượng nhân viên mỗi chức vụ
- Hỗ trợ lọc "Tất Cả" + từng chức vụ riêng biệt

### 3. **Tạo Nhân Viên Mới** (CreateUserModal)
Form yêu cầu:
- **Tên Nhân Viên**: Bắt buộc
- **Tên Tài Khoản**: Bắt buộc (phải unique)
- **Mật Khẩu**: Bắt buộc
  - Có nút "Tạo" để random 10 chữ số
  - Có toggle hiển thị/ẩn mật khẩu
- **Số Điện Thoại**: Tùy chọn
- **Chức Vụ**: Bắt buộc (dropdown)

### 4. **Sửa Nhân Viên** (EditUserModal)
Cho phép chỉnh sửa:
- Tên nhân viên
- Số điện thoại
- Chức vụ (role)
- Trạng thái (Đang Làm Việc / Nghỉ Làm Việc)
- Không cho phép sửa tên tài khoản

### 5. **Xóa Nhân Viên** (DeleteUserConfirmModal)
- Hiển thị thông tin nhân viên sắp bị xóa
- Yêu cầu xác nhận
- Cảnh báo hành động không thể hoàn tác

## 🔌 API Endpoints

### Các endpoint được sử dụng:

```
GET    /api/auth/users/list       - Lấy danh sách tất cả nhân viên [TOKEN]
GET    /api/roles/list            - Lấy danh sách tất cả chức vụ
POST   /api/auth/users            - Tạo nhân viên mới [TOKEN]
PUT    /api/auth/users/:id        - Cập nhật thông tin nhân viên [TOKEN]
DELETE /api/auth/users/:id        - Xóa nhân viên [TOKEN]
```

## 📱 Cách Sử Dụng

### 1. Import và Sử Dụng Trang
```javascript
import StaffManagement from '../pages/StaffManagement'

// Trong router
<Route path="/staff-management" element={<StaffManagement />} />
```

### 2. Chuẩn Bị Dữ Liệu
- Cần có token JWT được lưu trong localStorage hoặc context
- Backend phải có các role được khởi tạo

### 3. Thêm vào Navigation
```javascript
// Trong component navbar/sidebar
<Link to="/staff-management">Quản Lý Nhân Viên</Link>
```

## 🎨 Thiết Kế & Styling

- **Framework**: Tailwind CSS
- **Icons**: lucide-react
- **Color Scheme**: Theo theme chung hệ thống
  - Primary: màu chính (xanh dương)
  - Danger: màu cảnh báo (đỏ)
  - Success: màu thành công (xanh lá)
  - Warning: màu cảnh báo (cam)

- **Responsive**: Hỗ trợ từ mobile đến desktop
  - Mobile: 1 cột
  - Tablet: 2-3 cột
  - Desktop: 3-4 cột

## 🔒 Bảo Mật

- **Token Required**: Tất cả hành động đều yêu cầu token JWT
- **Password Hashing**: Mật khẩu được hash trên backend
- **Unique Username**: Hệ thống không cho phép trùng tên tài khoản

## ⚠️ Lưu Ý Quan Trọng

1. **Quyền Hạn**: Chỉ manager mới có thể truy cập trang này (cần thêm protection)
2. **Token Storage**: Token được lưu từ context/localStorage
3. **API Base URL**: Được cấu hình từ environment variable `VITE_API_BASE_URL`
4. **Loading State**: Trang hiển thị "Đang tải..." khi fetch dữ liệu
5. **Error Handling**: Hiển thị error messages khi có lỗi API

## 📝 Ví Dụ Dữ Liệu

### User Object (từ API)
```javascript
{
  _id: "507f1f77bcf86cd799439011",
  fullname: "Nguyễn Văn A",
  username: "nguyen_a",
  phone: "0912345678",
  role: {
    _id: "507f1f77bcf86cd799439012",
    role_name: "waiter"
  },
  state: "working",
  created_at: "2024-12-26T10:00:00.000Z"
}
```

### Role Object (từ API)
```javascript
{
  _id: "507f1f77bcf86cd799439012",
  role_name: "waiter"
}
```

## 🐛 Troubleshooting

### Vấn đề: Không thể tạo nhân viên
- Kiểm tra token có còn hiệu lực
- Kiểm tra tên tài khoản không trùng
- Kiểm tra backend đang chạy

### Vấn đề: Danh sách nhân viên không hiển thị
- Kiểm tra network tab trong browser
- Kiểm tra token authorization header
- Kiểm tra API endpoint `/api/auth/users/list`

### Vấn đề: Chức vụ không hiển thị
- Kiểm tra API `/api/roles/list` có return data
- Kiểm tra database có role được khởi tạo

## 🚀 Mở Rộng Tương Lai

- [ ] Thêm pagination cho danh sách nhân viên
- [ ] Export danh sách nhân viên ra CSV/PDF
- [ ] Thêm bộ lọc nâng cao (ngày tạo, status, etc.)
- [ ] Thêm tính năng bulk actions (xóa nhiều, đổi role)
- [ ] Thêm avatar/profile picture
- [ ] Thêm lịch sử hoạt động nhân viên
- [ ] Thêm quản lý phân công công việc
