# 📱 Table Display Update - Cập Nhật Hiển Thị Bàn

## ✅ Thay Đổi Thực Hiện

### 1. **Chế Độ Hiển Thị Mới** (2 Mode)

#### 🎯 **Grid Mode** (Mặc định)
- Bàn hiển thị dưới dạng lưới đều
- Cột cố định, kích thước bàn đồng nhất
- Thích hợp cho quản lý nhanh
- 10 cột (responsive)

#### 🏢 **Image Mode** (Bố Cục Thực Tế)
- Bàn có kích thước khác nhau dựa trên **capacity**
- Bàn 2-4 người: **w-24 h-24** (square)
- Bàn 6-8 người: **w-48 h-24** (rectangle - span 2 columns)
- Giống hệt CreateOrderModal
- Thị giác tự nhiên, gần với thực tế

### 2. **Nút Toggle** (Manager Only)
```
Header: [Grid Icon] [Image Icon]
```
- Nút toggle ở thanh header (bên cạnh "+ Thêm Bàn")
- **Grid**: Lưới đều (Grid icon)
- **Image**: Bố cục thực tế (List icon)
- Chỉ Manager mới có quyền toggle

### 3. **Các Tính Năng Giữ Nguyên** ✨
- ✅ Role-based permissions (Manager, Cashier, Waiter, Chef)
- ✅ CRUD operations (Manager)
- ✅ Payment modal (Cashier)
- ✅ Order modal (Waiter)
- ✅ Read-only for Chef
- ✅ Floor grouping (A, B, C)
- ✅ Status colors (serving/empty)

### 4. **UI Improvements** 🎨
- Nút Edit/Delete chỉ hiển thị ở **Image Mode** (khi hover)
- Nút lớn hơn, dễ ấn: **p-1.5** thay vì **p-1**
- Tooltip cho nút toggle: "Chế độ lưới" / "Chế độ bố cục thực tế"
- Status color: Orange (**#FF6B35**) cho "serving" (giống CreateOrderModal)

---

## 📁 Files Thay Đổi

### 1. **TableGrid.jsx** (Component Chính)
```jsx
// Props mới
viewMode = 'grid' | 'image'

// Methods
renderGridView() // Hiển thị lưới
renderImageView() // Hiển thị bố cục thực tế
getTableSize(capacity) // Tính kích thước bàn
```

**Thay Đổi:**
- Thêm prop `viewMode`
- Split render logic thành 2 function
- `getTableSize()` trả về kích thước động

### 2. **TableManagement.jsx** (Main Page)
```jsx
// State update
const [viewMode, setViewMode] = useState('grid') // thay 'list' → 'image'

// Pass viewMode to TableGrid
<TableGrid
  tables={tables}
  userRole={userRole}
  viewMode={viewMode}  // 👈 NEW
  onTableClick={handleTableClick}
  onEditTable={handleEditTable}
  onDeleteTable={handleDeleteTable}
/>

// Toggle buttons
onClick={() => setViewMode('grid')}   // Grid button
onClick={() => setViewMode('image')}  // Image button
```

---

## 🎮 Cách Sử Dụng

### Cho Manager
```
1. Nhấn Grid icon → Chế độ lưới
2. Nhấn List icon → Chế độ bố cục thực tế
3. Ấn bàn:
   - Hover để thấy Edit/Delete buttons
   - Click Edit: Chỉnh sửa tên/sức chứa
   - Click Delete: Xóa bàn
```

### Cho Cashier
```
1. Click bàn → Mở payment modal
2. Xem items, tính tiền, thanh toán
3. Bàn tự reset thành "empty"
```

### Cho Waiter
```
1. Click bàn → Mở order modal
2. Thêm/xóa items
3. Xem status từng item
```

### Cho Chef
```
1. Xem bàn (read-only)
2. Không thể interact
```

---

## 📊 Comparison

| Aspect | Grid Mode | Image Mode |
|--------|-----------|-----------|
| Layout | Lưới đều | Bố cục thực tế |
| Kích thước bàn | Đồng nhất | Khác nhau |
| Columns | 10 cột | 5 cột (vary) |
| Edit/Delete | Không thấy | Hover thấy |
| Use case | Quick overview | Realistic view |
| Responsive | Tốt | Tốt |

---

## 🔧 Technical Details

### Tailwind Classes Used
```jsx
// Grid Mode
grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10

// Image Mode
grid-cols-5 (fixed 5 columns)

// Table Sizes
w-24 h-24 (2-4 seats)
w-48 h-24 (6-8 seats, col-span-2)

// Status Colors
bg-orange-500 (serving)
bg-white (empty)
hover:bg-orange-600
hover:shadow-md
```

### Component Props
```jsx
<TableGrid
  tables={Array}           // All tables from API
  userRole={String}        // manager|cashier|waiter|chef
  viewMode={String}        // grid|image
  onTableClick={Function}  // Handle click
  onEditTable={Function}   // Manager only
  onDeleteTable={Function} // Manager only
/>
```

---

## ✅ Testing Checklist

- [ ] Grid mode displays correctly
- [ ] Image mode displays correctly
- [ ] Toggle works smoothly
- [ ] Manager can edit/delete
- [ ] Cashier payment works
- [ ] Waiter orders work
- [ ] Chef read-only works
- [ ] Floor grouping correct
- [ ] Status colors correct
- [ ] Responsive on mobile

---

## 🚀 Future Enhancements

1. **Drag & Drop** - Rearrange tables in Image mode
2. **Zoom** - Zoom in/out in Image mode
3. **Table Layout Configuration** - Manager can arrange tables
4. **Real-time Updates** - WebSocket for live status
5. **Analytics** - Peak hours, table utilization

---

**Status**: ✅ **READY FOR TESTING**

**Version**: 1.1.0  
**Date**: 2025-01-15  
**Author**: Development Team
