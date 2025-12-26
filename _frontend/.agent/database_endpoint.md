# THIẾT KẾ DATABASE HỆ THỐNG QUẢN LÝ NHÀ HÀNG

## 1. Tổng quan hệ thống
Hệ thống quản lý nhà hàng hỗ trợ:
- Quản lý bàn, đặt bàn và check-in khách
- Gọi món và theo dõi chế biến
- Thanh toán và xuất hóa đơn
- Quản lý nhân viên, vai trò và đơn xin nghỉ phép
- Phân quyền theo vai trò nhân viên

Cơ sở dữ liệu được thiết kế theo mô hình **MongoDB (Mongoose ODM)**.

---

## 2. Danh sách các bảng (Collections)

### 2.1 Table – Thông tin bàn
Lưu thông tin các bàn trong nhà hàng.

| Trường | Kiểu | Mô tả |
|------|------|------|
| `_id` | ObjectId | Khóa chính |
| `name` | String | Tên / mã bàn |
| `capacity` | Number | Sức chứa của bàn |
| `currentStatus` | String | Trạng thái (`empty`, `serving`) |

**Quan hệ**
- 1 Table phục vụ **0 hoặc 1 Reservation tại một thời điểm**
- Reservation chỉ thuộc về **1 Table**

---

### 2.2 Reservation – Đơn đặt bàn / Check-in
Quản lý thông tin đặt bàn và quá trình phục vụ khách.

| Trường | Kiểu | Mô tả |
|------|------|------|
| `_id` | ObjectId | Mã đơn đặt bàn |
| `customer_name` | String | Tên khách hàng |
| `customer_phone` | String | Số điện thoại |
| `guest_count` | Number | Số khách |
| `datetime_checkin` | Date | Thời điểm nhận bàn |
| `datetime_out` | Date | Thời điểm kết thúc |
| `status` | String | `pending`, `confirmed`, `checked-in`, `cancelled`, `finished`, `no-show` |
| `created_at` | Date | Ngày tạo |

**Quan hệ**
- 1 Reservation – N OrderItems
- 1 Reservation – 1 Invoice
- 1 Reservation – 1 Table

---

### 2.3 OrderItem – Món ăn được gọi
Lưu từng món được gọi trong một reservation.

| Trường | Kiểu | Mô tả |
|------|------|------|
| `_id` | ObjectId | Mã món gọi |
| `reservation` | ObjectId | Tham chiếu Reservation |
| `item` | ObjectId | Tham chiếu MenuItem |
| `quantity` | Number | Số lượng |
| `note` | String | Ghi chú |
| `status` | String | `waiting`, `cooking`, `cooked` |
| `price_at_time` | Number | Giá tại thời điểm gọi |

**Quan hệ**
- N OrderItems thuộc 1 Reservation
- 1 OrderItem gắn với 1 MenuItem

---

### 2.4 MenuItem (Dish) – Món ăn
Danh sách các món ăn của nhà hàng.

| Trường | Kiểu | Mô tả |
|------|------|------|
| `_id` | ObjectId | Mã món |
| `category` | String | Danh mục |
| `name` | String | Tên món |
| `price` | Number | Giá |
| `image` | String | Ảnh minh họa |
| `status` | String | `Đang phục vụ`, `Dừng phục vụ` |
| `description` | String | Mô tả |

**Quan hệ**
- 1 MenuItem thuộc 1 Category
- 1 MenuItem có thể xuất hiện trong nhiều OrderItems

---

### 2.5 Category – Danh mục món ăn
Phân loại món ăn.

| Trường | Kiểu | Mô tả |
|------|------|------|
| `_id` | ObjectId | Mã danh mục |
| `category_name` | String | Tên danh mục |

**Quan hệ**
- 1 Category – N MenuItems

---

### 2.6 Invoice – Hóa đơn thanh toán
Hóa đơn được tạo khi kết thúc reservation.

| Trường | Kiểu | Mô tả |
|------|------|------|
| `_id` | ObjectId | Mã hóa đơn |
| `reservation` | ObjectId | Tham chiếu Reservation (unique) |
| `total_price` | Number | Tổng tiền |
| `payment_method` | String | `cash`, `card`, `bank`, `ewallet` |
| `paid_at` | Date | Thời điểm thanh toán |
| `cashier` | ObjectId | Nhân viên thu ngân |

**Quan hệ**
- 1 Invoice thuộc 1 Reservation
- 1 User (thu ngân) xử lý nhiều Invoices
- Invoice không tồn tại nếu không có Reservation

---

### 2.7 User – Nhân viên
Quản lý tài khoản nhân viên.

| Trường | Kiểu | Mô tả |
|------|------|------|
| `_id` | ObjectId | Mã nhân viên |
| `fullname` | String | Họ tên |
| `username` | String | Tên đăng nhập |
| `password_hash` | String | Mật khẩu mã hóa |
| `role` | ObjectId | Vai trò |
| `phone` | String | Số điện thoại |
| `state` | String | `working`, `off_work` |
| `change_password` | Boolean | Yêu cầu đổi mật khẩu |
| `created_at` | Date | Ngày tạo |

**Quan hệ**
- N User – 1 Role
- 1 User – N LeaveRequests
- 1 User (manager) – N LeaveRequests (duyệt)
- 1 User – N Invoices

**Thông tin**
- Mặc định khi tạo mới tài khoản, change_password luôn là false, người dùng mới đăng nhập lần đầu phải yêu cầu thay đổi mật khẩu, thay đổi xong thì chuyển về true

---

### 2.8 Role – Vai trò
Phân quyền hệ thống.

| Trường | Kiểu | Mô tả |
|------|------|------|
| `_id` | ObjectId | Mã vai trò |
| `role_name` | String | Tên vai trò |

**Ví dụ vai trò**
- Quản lý: Xem được bảng nhân viên, bảng thanh toán, bảng đặt bàn, thực đơn, order của khách
- Thu ngân: Xem được bảng thanh toán
- Phục vụ: Xem được thực đơn, order của khách
- Đầu bếp: Xem được order của khách

---

### 2.9 LeaveRequest – Đơn xin nghỉ phép
Quản lý nghỉ phép của nhân viên.

| Trường | Kiểu | Mô tả |
|------|------|------|
| `_id` | ObjectId | Mã đơn |
| `user` | ObjectId | Người xin nghỉ |
| `leave_type` | String | Loại nghỉ |
| `start_date` | Date | Ngày bắt đầu |
| `end_date` | Date | Ngày kết thúc |
| `total_days` | Number | Tổng số ngày |
| `reason` | String | Lý do |
| `status` | String | `pending`, `approved`, `rejected` |
| `approved_by` | ObjectId | Người duyệt |
| `created_at` | Date | Ngày tạo |

**Quan hệ**
- 1 User tạo nhiều LeaveRequests
- 1 Manager duyệt nhiều LeaveRequests

---

## 3. Tổng hợp mối quan hệ (ER Summary)

- Table – Reservation: **1 – N (theo thời gian)**
- Reservation – OrderItem: **1 – N**
- OrderItem – MenuItem: **N – 1**
- Category – MenuItem: **1 – N**
- Reservation – Invoice: **1 – 1**
- User – Invoice: **1 – N**
- Role – User: **1 – N**
- User – LeaveRequest (tạo): **1 – N**
- User – LeaveRequest (duyệt): **1 – N**

---

## 4. Các tác nhân trong hệ thống

### 4.1 Quản lý
- Đăng nhập hệ thống
- Quản lý nhân viên và phân quyền
- Duyệt đơn nghỉ phép
- Quản lý menu
- Thống kê doanh thu
- Có mọi chức năng của các nhân viên dưới

### 4.2 Thu ngân
- Đăng nhập hệ thống
- Tạo và xử lý hóa đơn
- Xác nhận thanh toán cho khách

### 4.3 Phục vụ
- Đăng nhập hệ thống
- Xử lý đặt bàn và check-in
- Gửi món cho bếp
- Theo dõi trạng thái món ăn

### 4.4 Đầu bếp
- Đăng nhập hệ thống
- Xem danh sách món được gọi
- Cập nhật trạng thái chế biến

### 4.5 Khách hàng
- Đặt bàn (trong UI thì là đưa đến trang liên hệ)
- Gọi món (bản chất là gọi nhân viên để đặt món, thao tác đặt món nằm ở nhân viên phục vụ)
- Thanh toán hóa đơn (mọi crud do thu ngân xử lý)

---

## 5. Kết luận
Thiết kế database đáp ứng đầy đủ:
- Nghiệp vụ nhà hàng
- Phân quyền rõ ràng
- Dễ mở rộng và bảo trì
- Phù hợp với MongoDB & Mongoose

---

## 6. Nghiệp vụ & Config đặc biệt

### 6.1 Đặt bàn
- Khi đặt bàn, hệ thống **tự động tạo Reservation `_id`**.
- Có thể chọn **nhiều bàn cho cùng một Reservation** (nếu cần).
- Khi đặt bàn xong, **trạng thái bàn được chuyển sang `serving`**.
- Khi trạng thái reservation là checked-in, **tự động tạo Invoice** tham chiếu đến Reservation vừa tạo.

### 6.2 Gọi món
- Mỗi OrderItem phải **tham chiếu đúng Reservation `_id`**.
- Đảm bảo các món gọi được gắn chính xác với bàn / khách hàng tương ứng.

### 6.3 Thanh toán
- Khi click vào `invoice_id`, hệ thống **tính toán tổng giá dựa trên tất cả OrderItems của Reservation đó**.
- Thông tin Invoice hiển thị tổng tiền, phương thức thanh toán, và nhân viên thu ngân.

### 6.4 Cấp tài khoản nhân viên
- Người dùng **không có quyền tự đăng ký**.
- Quản lý tạo tài khoản cho nhân viên:
  - Username theo tên hoặc quy định
  - Password **ngẫu nhiên 6 số**, lưu bằng **bcrypt**
  - Khi nhân viên đăng nhập lần đầu, **bắt buộc đổi mật khẩu** (`change_password = false` → đổi xong = true) mới sử dụng các chức năng

### 6.5 Phân quyền
- Hệ thống dựa trên `Role` để xác định quyền:
  - Quản lý: tất cả quyền + duyệt nghỉ phép
  - Thu ngân: chỉ thao tác Invoice
  - Phục vụ: đặt bàn, gọi món
  - Đầu bếp: xem và cập nhật trạng thái món
- Các hành vi tự động hóa (đặt bàn, tạo invoice, gắn món) **tuân thủ phân quyền**.

