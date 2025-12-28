# 🎯 Quick Start - Table Display Modes

## 👀 Xem Nhanh

### ✅ What's New?
- 2 chế độ hiển thị bàn: **Grid** & **Image**
- Toggle buttons ở header (Manager only)
- Bàn có kích thước khác nhau trong Image mode
- Edit/Delete buttons appear khi hover (Image mode)

---

## 🎮 Cách Sử Dụng

### Nếu bạn là **MANAGER** 👔

#### Bước 1: Chọn chế độ hiển thị
```
Header → [📊 Grid] [📋 Image]
         Chế độ      Chế độ
         lưới      bố cục
```

#### Bước 2: Ấn nút để chuyển đổi
- **[📊 Grid]** → Lưới đều, 10 cột
- **[📋 Image]** → Bố cục thực tế, bàn khác kích thước

#### Bước 3: Quản lý bàn
**Trong Grid Mode:**
- Click bàn → Chỉ xem, không edit visible

**Trong Image Mode:**
- Hover bàn → Xuất hiện [✏️] [🗑️]
- Click [✏️] → Chỉnh sửa tên/sức chứa
- Click [🗑️] → Xóa bàn

#### Bước 4: Tạo bàn mới
- Click [+ Thêm Bàn] (ở header)
- Nhập tên & sức chứa
- Click "Tạo Bàn"

---

### Nếu bạn là **CASHIER** 💳

Cả 2 chế độ đều khả dụng, nhưng:
- Không thể toggle (không có nút)
- Hiển thị mặc định: Grid mode
- Click bàn → Payment modal mở
- Xem items, tính tiền, thanh toán
- Bàn tự động reset thành "trống"

---

### Nếu bạn là **WAITER** 👨‍🍳

Cả 2 chế độ đều khả dụng, nhưng:
- Không thể toggle (không có nút)
- Hiển thị mặc định: Grid mode
- Click bàn → Order modal mở
- Thêm/xóa items
- Xem status từng item

---

### Nếu bạn là **CHEF** 👨‍🍳

Cả 2 chế độ đều khả dụng, nhưng:
- Xem bàn (read-only)
- Tất cả bàn bị disabled (opacity 50%)
- Không thể click hoặc chỉnh sửa
- Chỉ dùng để tham khảo

---

## 🎨 Grid Mode vs Image Mode

### Grid Mode (📊)
```
✅ Mục đích: Quản lý nhanh
✅ Layout: Lưới đều 10 cột
✅ Kích thước: Tất cả bàn bằng nhau
✅ Edit/Delete: Ẩn (để sau)
✅ Responsive: Tốt (co dãn theo màn hình)

Ứng dụng:
- Xem tổng quan tất cả bàn
- Theo dõi trạng thái nhanh
- Quản lý từ xa
```

### Image Mode (📋)
```
✅ Mục đích: Trực quan, bố cục thực tế
✅ Layout: Bàn khác kích thước
✅ Kích thước: 
  - Bàn 2-4 người: Nhỏ (square)
  - Bàn 6-8 người: Lớn (rectangle)
✅ Edit/Delete: Hiển thị khi hover
✅ Responsive: Tốt (5 cột fixed)

Ứng dụng:
- Quản lý chi tiết
- Nhìn như thực tế
- Chỉnh sửa dễ dàng
- Tương tự CreateOrderModal
```

---

## 🌈 Màu Sắc & Trạng Thái

### Bàn Trống (Empty)
```
🟤 Nền: Trắng
🟤 Viền: Xám nhạt
🟤 Chữ: Đen
→ Có thể click để làm việc
```

### Bàn Đang Phục Vụ (Serving)
```
🟠 Nền: Cam
🟠 Viền: Cam đậm
🟠 Chữ: Trắng
→ Đang có khách, vẫn có thể click
```

---

## 💡 Tips & Tricks

### Tip 1: Chuyển đổi nhanh
```
Manager: Bấm [📊] [📋] để toggle chế độ
Sự thay đổi tức thì, không mất dữ liệu
```

### Tip 2: Edit/Delete chỉ ở Image Mode
```
Manager: Muốn sửa bàn?
→ Chuyển sang Image mode [📋]
→ Hover bàn
→ Click [✏️] hoặc [🗑️]
```

### Tip 3: Kích thước bàn
```
Bàn 2-4 người:  nhỏ (w-24)
Bàn 6-8 người:  lớn (w-48, chiếm 2 cột)

Kích thước tự động dựa trên
sức chứa (capacity) khi tạo bàn
```

### Tip 4: Không thể Edit/Delete ở Grid Mode
```
Manager: Ở Grid mode, 
bàn trông đều nhưng không thấy [✏️] [🗑️]

→ Chuyển sang Image mode để edit/delete
```

---

## ⚠️ Lưu Ý Quan Trọng

### ❌ Không thể làm
- Chef: Không thể click bàn
- Cashier/Waiter: Không thể toggle chế độ
- Manager (Grid mode): Không thấy Edit/Delete buttons

### ✅ Có thể làm
- Manager (Image mode): Edit/Delete dễ dàng
- Tất cả: Click bàn để mở modal
- Tất cả: Xem trạng thái bàn rõ ràng
- Manager: Tạo bàn mới từ header

---

## 🔄 Workflow Ví Dụ

### Quản Lý Bàn Theo Workflow

```
1️⃣ Manager đăng nhập
   ↓
2️⃣ Mặc định → Grid mode (10 cột)
   ↓
3️⃣ Nhấn [📋] → Chuyển sang Image mode
   ↓
4️⃣ Hover bàn A5 (6 chỗ)
   ↓
5️⃣ Xuất hiện [✏️] [🗑️]
   ↓
6️⃣ Click [✏️] → Edit modal
   → Thay đổi tên/sức chứa
   → Click "Lưu"
   ↓
7️⃣ Bàn cập nhật ngay
   ↓
8️⃣ Nhấn [📊] → Quay lại Grid mode
   ↓
9️⃣ Xem tổng quan tất cả bàn
   ↓
✅ Done!
```

---

## 🆘 Troubleshooting

### Vấn đề: Không thấy Edit/Delete buttons
**Giải pháp:**
- Kiểm tra có phải Manager không
- Kiểm tra có ở Image mode không (📋)
- Hover lên bàn (có thể cần chờ 0.3s)

### Vấn đề: Bàn lớn bị cắt ở Image mode
**Giải pháp:**
- Scroll ngang (nếu ở mobile)
- Giảm zoom nếu cần

### Vấn đề: Toggle buttons không hiển thị
**Giải pháp:**
- Kiểm tra vai trò (chỉ Manager mới có)
- Refresh page

### Vấn đề: Bàn không đổi kích thước
**Giải pháp:**
- Kiểm tra capacity (sức chứa) khi tạo bàn
- Capacity >= 6 → lớn
- Capacity <= 4 → nhỏ

---

## 📞 Support

| Vấn Đề | Liên Hệ |
|--------|---------|
| Lỗi kỹ thuật | IT Support |
| Hỏi cách sử dụng | Team Lead |
| Báo cáo bug | Dev Team |
| Yêu cầu feature | Manager |

---

## 🎓 Video Tutorial (Nếu có)

```
Coming soon...
```

---

**Version**: 1.0  
**Last Updated**: 2025-01-15  
**Status**: ✅ Ready to Use

**Questions?** Check the full documentation:
- [TABLE_MANAGEMENT_SETUP.md](TABLE_MANAGEMENT_SETUP.md)
- [TABLE_DISPLAY_UPDATE.md](TABLE_DISPLAY_UPDATE.md)
- [UI_VISUAL_DEMO.md](UI_VISUAL_DEMO.md)
