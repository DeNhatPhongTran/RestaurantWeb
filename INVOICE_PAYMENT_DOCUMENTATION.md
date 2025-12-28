# Hệ Thống Quản Lý Thanh Toán Hóa Đơn - Tài Liệu Triển Khai

## 📋 Tổng Quan

Hệ thống thanh toán hóa đơn dành riêng cho **Thu Ngân (Cashier)** để:
- Xem danh sách các hóa đơn chưa thanh toán từ các đơn đặt bàn đang phục vụ
- Kiểm tra chi tiết các món đã gọi, giá cả, và trạng thái phục vụ
- Xử lý thanh toán với 4 phương thức: tiền mặt, thẻ tín dụng, chuyển khoản, ví điện tử
- Lưu trữ lịch sử thanh toán (20 hóa đơn gần đây)
- Tự động cập nhật trạng thái phục vụ khi thanh toán thành công

---

## 🏗️ Kiến Trúc Hệ Thống

### Backend API Endpoints

#### 1. **GET /api/invoices/cashier/unpaid** (Mới)
Lấy danh sách hóa đơn chưa thanh toán

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "customer_name": "Nguyễn Văn A",
      "customer_phone": "0123456789",
      "guest_count": 4,
      "table_name": "Bàn 5",
      "order_items": [
        {
          "_id": "item_id_1",
          "item": { "name": "Cơm chiên dương châu", "price": 150000 },
          "quantity": 2,
          "note": "Không tỏi",
          "status": "cooked",
          "serving_status": "served",
          "price_at_time": 150000
        }
      ],
      "subtotal": 300000,
      "tax": 36000,
      "total_amount": 336000,
      "all_items_served": true,
      "payment_status": "unpaid"
    }
  ]
}
```

**Logic:**
- Truy vấn tất cả Reservation có status: `confirmed` hoặc `checked-in`
- Lấy OrderItems từ mỗi Reservation (với thông tin MenuItem)
- Lấy tên bàn từ ReservationTable
- Tính toán: subtotal, tax (12%), total_amount
- Kiểm tra: tất cả items có serving_status === 'served' không

---

#### 2. **GET /api/invoices/cashier/paid** (Mới)
Lấy danh sách hóa đơn đã thanh toán (tối đa 20)

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "invoice_id_1",
      "reservation_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "customer_name": "Nguyễn Văn A",
      "customer_phone": "0123456789",
      "table_name": "Bàn 5",
      "total_amount": 336000,
      "payment_method": "cash",
      "paid_at": "2024-12-28T15:30:00Z",
      "cashier_name": "Trần Thị Thu",
      "payment_status": "paid"
    }
  ]
}
```

**Logic:**
- Truy vấn Invoice collection, populate Reservation và Cashier
- Sắp xếp theo paid_at (mới nhất trước)
- Limit 20 để tiết kiệm hiệu năng
- Lấy tên bàn từ ReservationTable

---

#### 3. **PUT /api/invoices/:reservationId/process-payment** (Mới)
Xử lý thanh toán và lưu hóa đơn

**Request Body:**
```json
{
  "payment_method": "cash",
  "total_price": 336000
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thanh toán thành công",
  "data": {
    "invoice": {
      "_id": "new_invoice_id",
      "reservation": "65a1b2c3d4e5f6g7h8i9j0k1",
      "total_price": 336000,
      "payment_method": "cash",
      "paid_at": "2024-12-28T15:30:00Z",
      "cashier": "user_id"
    },
    "reservation": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "status": "finished",
      "datetime_out": "2024-12-28T15:30:00Z"
    }
  }
}
```

**Logic:**
- Kiểm tra tất cả OrderItems có serving_status === 'served' không
- Nếu không, trả về lỗi: "Không thể thanh toán khi chưa phục vụ hết các món"
- Nếu có, tạo Invoice mới với:
  - reservation: reservationId
  - total_price
  - payment_method
  - cashier: req.userId (người đăng nhập)
  - paid_at: new Date()
- Cập nhật Reservation:
  - status: 'finished'
  - datetime_out: new Date() (giờ thanh toán = giờ checkout)

---

### Frontend Components

#### 1. **InvoicePage.jsx** (`src/pages/InvoicePage.jsx`)
Trang chính quản lý thanh toán

**Features:**
- Hiển thị 2 section: Chưa thanh toán | Đã thanh toán
- Grid layout 3 cột (responsive: 1 cột mobile, 2 cột tablet)
- Tự động làm mới mỗi 5 giây (có toggle)
- Nút Làm mới thủ công
- Xử lý loading, error states

**State Management:**
```javascript
- unpaidInvoices: [] // Hóa đơn chưa thanh toán
- paidInvoices: [] // Hóa đơn đã thanh toán (max 20)
- loading: boolean
- refreshing: boolean
- error: string
- selectedInvoice: object | null
- showModal: boolean
- autoRefresh: boolean (default: true)
```

---

#### 2. **InvoiceCard.jsx** (`src/components/orders/InvoiceCard.jsx`)
Thẻ hiển thị thông tin hóa đơn (Reusable)

**Props:**
- `invoice` - Dữ liệu hóa đơn
- `onCardClick` - Callback khi bấm thẻ
- `isPaid` - Boolean để phân biệt giao diện (default: false)

**Giao diện Chưa thanh toán:**
- Border: màu xanh dương (nếu sẵn TT) hoặc cam (nếu chờ phục vụ)
- Status badge: 🟡 "Sẵn TT" hoặc ⚠️ "Chờ phục vụ"
- Hiển thị: ID bàn, tên khách, số khách, tổng tiền
- Cảnh báo: Nếu chưa phục vụ hết các món

**Giao diện Đã thanh toán:**
- Border: xám nhạt
- Status badge: ✓ "Đã TT" (màu xanh)
- Hiển thị: ID bàn, tên khách, tên bàn, tổng tiền, PP, thời gian TT

---

#### 3. **InvoiceDetailModal.jsx** (`src/components/orders/InvoiceDetailModal.jsx`)
Modal hiển thị chi tiết thanh toán

**Props:**
- `isOpen` - Trạng thái mở/đóng modal
- `onClose` - Callback khi đóng
- `invoice` - Dữ liệu hóa đơn
- `onPaymentSuccess` - Callback sau khi TT thành công

**Sections:**
1. **Info Reservation** - ID bàn, tên bàn, tên khách, số khách
2. **Bảng Món Gọi** - Tên món, SL, giá, tổng, trạng thái phục vụ
3. **Tổng Hợp Giá** - Tạm tính, thuế 12%, tổng cộng
4. **Cảnh báo** - Nếu chưa phục vụ hết (block TT)
5. **Phương Thức TT** - 4 nút chọn (tiền mặt, thẻ, chuyển khoản, ví điện tử)
6. **Nút Hành Động** - Hủy, Thanh toán

**Flow Thanh Toán:**
1. Kiểm tra: all items served?
2. Nếu không → Hiển thị cảnh báo, disable nút TT
3. Nếu có → Cho phép chọn PP
4. Bấm "Thanh toán" → Gọi API `/process-payment`
5. Nếu thành công → Hiển thị "Thanh toán thành công!" 2 giây
6. Đóng modal → Refresh danh sách hóa đơn

---

## 🗄️ Cơ Sở Dữ Liệu - Liên Quan

### OrderItem Schema
```javascript
{
  reservation: ObjectId (ref: Reservation),
  item: ObjectId (ref: MenuItem),
  quantity: Number,
  note: String,
  status: enum ["waiting", "cooking", "cooked"],
  serving_status: enum ["served", "unserved"], // 🆕 - Quan trọng!
  price_at_time: Number,
  ordered_at: Date
}
```

**Lưu ý:** Trường `serving_status` được sử dụng để theo dõi xem món đã được phục vụ cho khách hay chưa. Chỉ khi TẤT CẢ items có `serving_status === 'served'` mới được thanh toán.

### Reservation Schema
```javascript
{
  customer_name: String,
  customer_phone: String,
  guest_count: Number,
  datetime_checkin: Date,
  datetime_out: Date, // ← Cập nhật khi thanh toán
  status: enum ["pending", "confirmed", "checked-in", "finished", ...],
  // ↑ Chuyển sang "finished" khi thanh toán
}
```

### Invoice Schema
```javascript
{
  reservation: ObjectId (ref: Reservation, unique),
  total_price: Number,
  payment_method: enum ["cash", "card", "bank", "ewallet"],
  paid_at: Date,
  cashier: ObjectId (ref: User)
}
```

### ReservationTable Schema
```javascript
{
  reservationId: ObjectId (ref: Reservation),
  tableId: ObjectId (ref: Table)
}
```

---

## 🔐 Quyền Truy Cập (Role-Based)

### Cashier Role
- ✅ Xem trang `/invoices`
- ✅ Xem danh sách hóa đơn chưa/đã TT
- ✅ Xem chi tiết hóa đơn (items, giá, trạng thái)
- ✅ Thực hiện thanh toán
- ✅ Chọn phương thức thanh toán

### Khác Roles
- ❌ Không truy cập `/invoices`

**Code Protection:**
```javascript
// App.jsx
<Route path="/invoices" element={
  <RouteGuard>
    <ProtectedRoute requiredRoles={['cashier']}>
      <InvoicePage />
    </ProtectedRoute>
  </RouteGuard>
} />
```

---

## 🎨 Giao Diện UI

### InvoicePage Layout
```
┌─────────────────────────────────────────┐
│ 💳 Quản lý Thanh Toán  [Auto] [Làm mới] │
└─────────────────────────────────────────┘

┌─ Hóa đơn chưa thanh toán (5) ────────────┐
│ ┌─────────────┐ ┌─────────────┐ ┌──────┐│
│ │ ID: TA001   │ │ ID: TA002   │ │ ...  ││
│ │ Bàn: 5      │ │ Bàn: 10     │ │      ││
│ │ 🟡 Sẵn TT   │ │ ⚠️ Chờ      │ │      ││
│ │ 336,000đ    │ │ 425,000đ    │ │      ││
│ └─────────────┘ └─────────────┘ └──────┘│
└─────────────────────────────────────────┘

┌─ Hóa đơn đã thanh toán (3) ──────────────┐
│ ┌─────────────┐ ┌─────────────┐ ┌──────┐│
│ │ ID: TA001   │ │ ID: TA002   │ │ ...  ││
│ │ Bàn: 5      │ │ Bàn: 10     │ │      ││
│ │ ✓ Đã TT     │ │ ✓ Đã TT     │ │      ││
│ │ 336,000đ    │ │ 425,000đ    │ │      ││
│ └─────────────┘ └─────────────┘ └──────┘│
└─────────────────────────────────────────┘
```

### InvoiceDetailModal Layout
```
┌──────────────────────────────────────────┐
│ Chi tiết thanh toán                   [X]│
├──────────────────────────────────────────┤
│ ID: TA001 │ Bàn: 5 │ Khách: 4 │ PN: A   │
├──────────────────────────────────────────┤
│ Các món đã gọi                           │
│ ┌────────────────┬─┬────┬────┬────────┐ │
│ │ Món ăn         │Q│Giá │Tổng│Trạng TT│ │
│ ├────────────────┼─┼────┼────┼────────┤ │
│ │Cơm chiên dương │2│150k│300k│✓ Phục  │ │
│ │Canh rau muống  │1│50k │50k │✓ Phục  │ │
│ └────────────────┴─┴────┴────┴────────┘ │
│                                          │
│ Tạm tính:      300,000đ                │
│ Thuế (12%):    36,000đ                 │
│ ┌─────────────────────────────────────┐ │
│ │ TỔNG CỘNG:        336,000đ          │ │
│ └─────────────────────────────────────┘ │
│                                          │
│ Phương thức thanh toán                  │
│ [💵 Tiền mặt] [💳 Thẻ]                │
│ [🏦 Chuyển khoản] [📱 Ví điện tử]       │
│                                          │
│                [Hủy] [✓ Thanh toán]     │
└──────────────────────────────────────────┘
```

---

## 📦 File Structure

```
RestaurantWeb/
├── backend/
│   └── routes/
│       └── invoices.js ⭐ (Modified)
│           ├── GET /api/invoices/cashier/unpaid (🆕)
│           ├── GET /api/invoices/cashier/paid (🆕)
│           └── PUT /api/invoices/:reservationId/process-payment (🆕)
│
└── _frontend/
    └── src/
        ├── pages/
        │   └── InvoicePage.jsx (🆕)
        ├── components/
        │   └── orders/
        │       ├── InvoiceCard.jsx (🆕)
        │       └── InvoiceDetailModal.jsx (🆕)
        └── App.jsx (Modified - thêm route /invoices)
```

---

## 🚀 Cách Sử Dụng

### For Cashier Users

1. **Đăng nhập** với tài khoản Cashier
2. Bấm **"💳 Hóa Đơn"** trên sidebar
3. **Xem danh sách**:
   - Chưa thanh toán: Hiển thị các hóa đơn sẵn sàng TT (🟡) hoặc chờ (⚠️)
   - Đã thanh toán: Hiển thị 20 giao dịch gần đây (✓)
4. **Bấm vào hóa đơn** để xem chi tiết
5. **Trong modal**:
   - Kiểm tra danh sách món và giá
   - Nếu tất cả đã phục vụ → Chọn PP → Bấm "Thanh toán"
   - Nếu chưa phục vụ hết → Không thể TT (button disabled)
6. **Sau TT thành công**:
   - Thấy thông báo "Thanh toán thành công!"
   - Modal tự động đóng
   - Danh sách cập nhật (hóa đơn chuyển sang "Đã TT")

---

## ⚙️ Cấu Hình Mặc Định

| Tùy chọn | Giá trị | Mô tả |
|---------|--------|------|
| Tax Rate | 12% | Thuế suất mặc định |
| Auto Refresh | 5 giây | Làm mới dữ liệu tự động |
| Paid Invoices Limit | 20 | Tối đa hóa đơn hiển thị trong lịch sử |
| Payment Methods | 4 | cash, card, bank, ewallet |

---

## 🧪 Test Cases

### Test 1: Xem Danh Sách Hóa Đơn
1. Đăng nhập Cashier
2. Vào `/invoices`
3. ✅ Thấy danh sách hóa đơn chưa TT
4. ✅ Thấy danh sách hóa đơn đã TT (max 20)

### Test 2: Xem Chi Tiết Hóa Đơn
1. Bấm vào hóa đơn chưa TT
2. ✅ Mở modal chi tiết
3. ✅ Xem được: items, giá, tổng cộng
4. ✅ Kiểm tra trạng thái phục vụ

### Test 3: Thanh Toán Thành Công
1. Hóa đơn có tất cả items served
2. Chọn phương thức TT
3. Bấm "Thanh toán"
4. ✅ Thấy "Thanh toán thành công!"
5. ✅ Modal đóng sau 2 giây
6. ✅ Hóa đơn chuyển sang "Đã TT"
7. ✅ Reservation status → "finished"
8. ✅ datetime_out cập nhật

### Test 4: Block TT Khi Chưa Phục Vụ Hết
1. Hóa đơn có items chưa served
2. ✅ Thấy cảnh báo "Chưa phục vụ hết các món"
3. ✅ Nút "Thanh toán" disabled
4. ✅ Không thể TT

### Test 5: Phương Thức Thanh Toán
1. Mở modal chi tiết
2. ✅ Hiển thị 4 nút PP
3. ✅ Chọn từng PP thành công
4. ✅ API nhận payment_method đúng

---

## 🔍 Troubleshooting

### Problem: "Cannot read property 'serving_status' of undefined"
**Cause:** OrderItem không có field serving_status
**Solution:** Đảm bảo migration data, cập nhật OrderItem schema

### Problem: Hóa đơn không hiển thị
**Cause:** Reservation status không phải "confirmed" hoặc "checked-in"
**Solution:** Kiểm tra status reservation, yêu cầu check-in trước

### Problem: API trả về lỗi "all_items_served"
**Cause:** Có items chưa served
**Solution:** Chờ waiter phục vụ hết, refresh lại danh sách

### Problem: Modal không đóng sau TT
**Cause:** Callback onPaymentSuccess không được gọi
**Solution:** Kiểm tra API response, console logs

---

## 📊 Performance Considerations

1. **Paid Invoices Limit (20)**
   - Giảm query time, load data nhanh hơn
   - Older invoices có thể query bằng filter/search khác

2. **Auto Refresh (5 giây)**
   - Đủ nhanh để update, không quá ngập
   - User có thể tắt nếu không cần

3. **Aggregation Pipeline**
   - Backend xử lý join/calculate
   - Frontend chỉ render, không phải tính toán

---

## 🔄 Luồng Dữ Liệu

```
Waiter phục vụ
      ↓
Cập nhật OrderItem serving_status = 'served' ← StaffDelivery page
      ↓
Cashier vào trang /invoices
      ↓
Fetch GET /api/invoices/cashier/unpaid
      ↓
Backend kiểm tra: all items served?
      ↓
Response data với all_items_served flag
      ↓
Frontend render card: 🟡 "Sẵn TT" (nếu true)
      ↓
Bấm vào card → InvoiceDetailModal
      ↓
Chọn PP → PUT /api/invoices/process-payment
      ↓
Backend tạo Invoice + cập nhật Reservation
      ↓
Success → Modal close → Refresh list
      ↓
Hóa đơn chuyển sang "Đã thanh toán"
```

---

## 📝 Notes

- Hóa đơn được tạo TẠI THỜI ĐIỂM THANH TOÁN, không phải khi đặt hàng
- `datetime_out` của Reservation = thời gian thanh toán
- Chỉ Thu Ngân mới thấy trang `/invoices`
- Tự động làm mới mỗi 5 giây để cập nhật trạng thái phục vụ từ waiter
- Lịch sử thanh toán giới hạn 20 để tối ưu hiệu năng (có thể thêm pagination sau)

---

## 🎯 Future Enhancements

- [ ] Export hóa đơn PDF
- [ ] Tìm kiếm / lọc hóa đơn
- [ ] Thống kê doanh thu theo thời gian
- [ ] Hoàn tiền / sửa hóa đơn
- [ ] Báo cáo thuế
- [ ] In hóa đơn
- [ ] Phân tích dữ liệu (biểu đồ doanh thu, PP TT phổ biến, v.v.)

---

**Created:** 28/12/2024  
**Last Updated:** 28/12/2024  
**Status:** ✅ Implementation Complete
