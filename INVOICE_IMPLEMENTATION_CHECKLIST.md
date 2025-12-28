# Hóa Đơn Thanh Toán - Checklist Triển Khai

## ✅ Hoàn Thành

### Backend (API)
- [x] GET `/api/invoices/cashier/unpaid` - Lấy hóa đơn chưa TT
  - Truy vấn Reservation (confirmed, checked-in)
  - Join OrderItem + MenuItem
  - Join ReservationTable để lấy table_name
  - Tính subtotal, tax (12%), total_amount
  - Kiểm tra all_items_served flag
  
- [x] GET `/api/invoices/cashier/paid` - Lấy hóa đơn đã TT
  - Truy vấn Invoice (latest 20)
  - Join Reservation, Cashier, ReservationTable
  - Sắp xếp by paid_at DESC
  
- [x] PUT `/api/invoices/:reservationId/process-payment` - Xử lý TT
  - Validate all items served
  - Tạo Invoice mới
  - Cập nhật Reservation (status: finished, datetime_out)
  - Trả về success message

### Frontend (UI)
- [x] InvoicePage.jsx - Trang chính
  - Hiển thị hóa đơn chưa TT (section 1)
  - Hiển thị hóa đơn đã TT (section 2)
  - Auto-refresh mỗi 5 giây
  - Manual refresh button
  - Loading, error states
  
- [x] InvoiceCard.jsx - Thẻ hóa đơn (Reusable)
  - Giao diện khác nhau cho unpaid/paid
  - Status badge (🟡 Sẵn TT / ⚠️ Chờ / ✓ Đã TT)
  - Keyboard accessible (role, tabIndex, onKeyDown)
  - Responsive design
  
- [x] InvoiceDetailModal.jsx - Modal chi tiết
  - Hiển thị info reservation
  - Bảng danh sách items
  - Tính tổng giá
  - Cảnh báo nếu chưa phục vụ hết
  - Phương thức TT (4 nút)
  - Payment processing
  - Success message (2 giây)
  - Auto close và refresh

### Routing & Authorization
- [x] App.jsx - Thêm route /invoices
- [x] Protected by cashier role
- [x] rolePermissions.js - Đã có hỗ trợ cashier

### Database Schema
- [x] OrderItem - Đã có serving_status field
- [x] Reservation - Đã có datetime_out field
- [x] Invoice - Hoàn tất
- [x] ReservationTable - Hoàn tất

---

## 🔧 Cần Kiểm Tra

### Backend Imports
- [x] invoices.js imports đầy đủ:
  - Express
  - Invoice schema
  - Reservation schema
  - OrderItem schema
  - ReservationTable schema
  - User schema
  - verifyToken middleware

### Frontend Imports
- [x] InvoicePage.jsx imports:
  - React hooks
  - Lucide icons
  - useApi hook
  - InvoiceCard component
  - InvoiceDetailModal component
  - Button component

- [x] InvoiceCard.jsx imports:
  - React
  - Lucide icons (removed unused: Users, DollarSign)
  - Added accessibility: role="button", tabIndex, onKeyDown

- [x] InvoiceDetailModal.jsx imports:
  - React hooks
  - Lucide icons
  - Button component
  - useApi hook

### TypeErrors & Linter Warnings
- [x] Unused imports removed (DollarSign, Users)
- [x] Accessibility fixes (role, tabIndex, onKeyDown)
- [x] Spacing fixes in JSX

---

## 🧪 Testing Checklist

### Manual Tests
- [ ] Đăng nhập Cashier account
- [ ] Vào `/invoices` page
- [ ] Xem danh sách hóa đơn chưa TT
  - [ ] Card hiển thị đúng format
  - [ ] Badge 🟡 "Sẵn TT" hoặc ⚠️ "Chờ"
  - [ ] Tính toán tiền đúng
- [ ] Bấm vào card → Modal mở
  - [ ] Chi tiết items hiển thị
  - [ ] Tính giá đúng
  - [ ] Trạng thái phục vụ đúng
- [ ] TT thành công
  - [ ] Chọn PP
  - [ ] Bấm "Thanh toán"
  - [ ] Thấy "Thanh toán thành công!"
  - [ ] Modal tự động đóng
  - [ ] Hóa đơn chuyển sang "Đã TT"
- [ ] TT thất bại (chưa phục vụ hết)
  - [ ] Thấy cảnh báo
  - [ ] Nút "Thanh toán" disabled
- [ ] Lịch sử TT
  - [ ] Hiển thị tối đa 20 hóa đơn
  - [ ] Sắp xếp newest first
  - [ ] Chỉ hiển thị 20 (không scroll load more)

### Browser Compatibility
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile (iOS/Android)

### Responsive Tests
- [ ] Mobile (1 cột)
- [ ] Tablet (2 cột)
- [ ] Desktop (3 cột)

### Accessibility Tests
- [ ] Keyboard navigation (Tab)
- [ ] Screen reader (tên role, labels)
- [ ] Color contrast (text readable)

---

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] Chạy `npm run lint` → Không có error
- [ ] Chạy `npm run build` → Build thành công
- [ ] Kiểm tra console không có error
- [ ] Test flow thanh toán hoàn chỉnh

### Database
- [ ] Backup database trước
- [ ] Migration scripts (nếu cần)
  - [ ] OrderItem thêm serving_status field
  - [ ] Reservation thêm datetime_out field

### Deployment Steps
1. Pull code mới
2. Install dependencies (nếu cần)
   ```bash
   cd backend && npm install
   cd ../_frontend && npm install
   ```
3. Build frontend
   ```bash
   cd _frontend && npm run build
   ```
4. Restart services
   ```bash
   docker-compose restart
   ```
5. Verify endpoints
   - [ ] GET /api/invoices/cashier/unpaid
   - [ ] GET /api/invoices/cashier/paid
   - [ ] PUT /api/invoices/:reservationId/process-payment

---

## 🚀 Post-Deployment

### Monitoring
- [ ] Check API response times
- [ ] Monitor error logs
- [ ] Track payment transaction count
- [ ] Performance metrics

### User Training
- [ ] Dạy Cashier cách sử dụng
- [ ] Hướng dẫn troubleshooting
- [ ] Cung cấp documentation

### Documentation
- [ ] INVOICE_PAYMENT_DOCUMENTATION.md ✅
- [ ] Training guide cho Cashier
- [ ] API documentation update

---

## 📞 Support

### Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| API 404 | Route không được register | Check app.js imports |
| Modal không mở | Component import error | Check InvoicePage imports |
| TT button disabled | Logic kiểm tra serving_status sai | Review OrderItem query |
| Lỗi "serving_status undefined" | Field chưa được add | Migration data needed |
| Auto-refresh không hoạt động | Interval không setup đúng | Check useEffect dependency |

---

## 🎯 Success Criteria

✅ **Completion Checklist:**
1. [x] API endpoints hoàn tất
2. [x] Frontend components hoàn tất
3. [x] Routing & authorization hoàn tất
4. [x] Styling & responsive design hoàn tất
5. [x] Error handling & validation hoàn tất
6. [x] Documentation hoàn tất
7. [ ] End-to-end testing hoàn tất
8. [ ] Production deployment hoàn tất

---

**Status:** Ready for Testing & Deployment ✅

**Last Updated:** 28/12/2024
