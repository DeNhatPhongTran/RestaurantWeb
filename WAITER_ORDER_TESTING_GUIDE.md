# WAITER ORDER - QUICK START GUIDE

## 🚀 Getting Started

### Prerequisites
- Backend running with MongoDB connected
- Frontend running (Vite dev server)
- Logged in as **Waiter** role
- At least one table with an active reservation

### Step-by-Step Testing

#### 1️⃣ Open Table Management
```
Navigate to: /table-management
Role: Must be "Waiter"
```

#### 2️⃣ Select a Table with Reservation
```
Click on any table that shows:
- ✅ Green indicator (in use)
- Has active reservation data
- Shows customer name & guest count
```

#### 3️⃣ WaiterOrderModal Opens
Expected behavior:
- ✅ Modal appears from bottom (animate-slide-up)
- ✅ Shows table name and capacity
- ✅ OrderItems grouped by status sections:
  - ⏳ CHỜ NẤU (if any)
  - 🍳 ĐANG NẤU (if any)
  - ✅ ĐÃ XONG (if any)
- ✅ Right panel shows statistics + total price
- ✅ "Thêm Món" button visible

#### 4️⃣ Test Adding Items
```
Step A: Click [+ Thêm Món]
  ✅ AddMenuItemModal overlay appears
  ✅ WaiterOrderModal still visible behind
  ✅ Dimmed background with higher z-index

Step B: Search/Filter
  - Type in search box
  - Click category tabs
  ✅ Menu items filter in real-time

Step C: Select Items
  - Click [+ Thêm] on item
  ✅ Button changes to quantity controls
  ✅ Item appears in right panel

Step D: Adjust Quantities
  - Use [-] and [+] buttons
  ✅ Quantity updates in right panel

Step E: Add Notes (Optional)
  - Click note input field
  - Type special instructions
  ✅ Note shows in preview

Step F: Confirm
  - Click [Xác Nhận (n)]
  ✅ Items saved to DB
  ✅ AddMenuItemModal closes
  ✅ WaiterOrderModal shows new items in "CHỜ NẤU"
  ✅ Each item has ordered_at timestamp
  ✅ Total price updates
```

#### 5️⃣ Test Editing Items (Status = waiting only)
```
Step A: Click [Sửa] on a waiting item
  ✅ Item card enters edit mode
  ✅ Border turns primary color
  ✅ Quantity and note fields appear

Step B: Modify Quantity
  - Change number in input
  ✅ Updates in real-time in edit mode

Step C: Modify Note
  - Type in note field
  ✅ Updates in real-time

Step D: Save
  - Click [✓ Lưu]
  ✅ Item card exits edit mode
  ✅ Changes persisted to DB
  ✅ Total price recalculates

Step E: Cancel Edit
  - Click [Hủy]
  ✅ Changes discarded
  ✅ Item returns to display mode
```

#### 6️⃣ Test Deleting Items (Status = waiting only)
```
Step A: Click [Xóa] on a waiting item
  ✅ Browser confirmation dialog appears

Step B: Confirm Delete
  - Click OK
  ✅ Item removed from list immediately
  ✅ Statistics update
  ✅ Total price recalculates
  ✅ Reservation.orderItems array updated in DB
```

#### 7️⃣ Test Locked Items (Status = cooking or cooked)
```
For cooking/cooked items:
  ✅ No [Sửa] or [Xóa] buttons visible
  ✅ Message shows: "⛔ Không thể chỉnh sửa khi đang nấu/đã nấu xong"
  ✅ Card appears slightly grayed out
```

#### 8️⃣ Test Statistics Panel
```
Right side should show:
  ✅ Count of waiting items
  ✅ Count of cooking items
  ✅ Count of cooked items
  ✅ Updates when items added/removed
  ✅ Subtotal + Tax + Total calculation correct
```

#### 9️⃣ Test Modal Closing
```
Step A: Click close button (X)
  ✅ Modal closes smoothly (fade-out)
  ✅ Returns to table view

Step B: Re-open table
  ✅ All changes persisted
  ✅ OrderItems still there
  ✅ Timestamps preserved
```

#### 🔟 Test Nested Modal Behavior
```
With AddMenuItemModal open:
  ✅ Can't click through to WaiterOrderModal
  ✅ Z-index higher ([60] vs [50])
  ✅ Press Esc or click outside AddMenuItemModal
  ✅ WaiterOrderModal remains open
  ✅ Can interact with WaiterOrderModal normally
```

## 🧪 Data Validation Checklist

### Backend API Responses

**GET /api/reservations/{id}**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "customer_name": "...",
    "guest_count": 2,
    "datetime_checkin": "2025-12-28T04:08:00Z",
    "datetime_out": "2025-12-28T09:08:00Z",
    "status": "confirmed",
    "orderItems": [  ✅ Must be array (even if empty [])
      {
        "_id": "...",
        "item": {
          "_id": "...",
          "name": "Fried Rice",
          "price": 625000
        },
        "quantity": 2,
        "note": "No onion",
        "status": "waiting",  ✅ One of: waiting/cooking/cooked
        "serving_status": "unserved",  ✅ One of: served/unserved
        "price_at_time": 625000,
        "ordered_at": "2025-12-28T04:15:30.123Z"  ✅ ISO format
      }
    ]
  }
}
```

**POST /api/orderitems (Create)**
```json
Request body:
{
  "reservation": "id",
  "item": "menuItemId",
  "quantity": 2,
  "note": "No onion",
  "price_at_time": 625000,
  "status": "waiting",
  "serving_status": "unserved",
  "ordered_at": "2025-12-28T04:15:30.123Z"
}

Response:
{
  "success": true,
  "data": {
    "_id": "newId",
    "item": { name, price, category },
    "quantity": 2,
    "note": "No onion",
    "status": "waiting",
    "serving_status": "unserved",
    "price_at_time": 625000,
    "ordered_at": "2025-12-28T04:15:30.123Z"
  }
}
```

**PUT /api/orderitems/{id} (Update)**
```json
Request body:
{
  "quantity": 3,  ✅ Optional
  "note": "Extra spicy",  ✅ Optional
  "item": "newMenuItemId",  ✅ Optional
  "status": "waiting"  ✅ Optional
}

Response: Updated orderItem object
```

**DELETE /api/orderitems/{id}**
```json
Response:
{
  "success": true,
  "message": "Order item deleted successfully",
  "data": { ...deletedItem... }
}
```

## 🐛 Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| AddMenuItemModal not appearing | Import missing or z-index conflict | Check z-[60] vs z-50, verify import in WaiterOrderModal |
| OrderItems not showing | API not populating orderItems array | Check reservations.js GET /:id endpoint |
| Can't edit/delete items | Wrong status check | Verify status === 'waiting' condition |
| Timestamp shows wrong time | Not converting to user timezone | Use toLocaleTimeString('vi-VN') |
| Items not persisting | Missing reservation.save() in POST | Check orderitems.js POST - should update Reservation.orderItems |
| Modal won't close | Event propagation issue | Verify stopPropagation() on click |

## 📊 Sample Test Data

### Create a test reservation first:
```bash
POST /api/reservations/create
{
  "customer_name": "John Doe",
  "customer_phone": "0123456789",
  "guest_count": 4,
  "datetime_checkin": "2025-12-28T04:00:00Z",
  "datetime_out": "2025-12-28T09:00:00Z",
  "status": "confirmed",
  "tableIds": ["tableId1", "tableId2"]
}
```

### Then add items as waiter via UI or API:
```bash
POST /api/orderitems
{
  "reservation": "reservationId",
  "item": "menuItemId",
  "quantity": 2,
  "price_at_time": 625000,
  "status": "waiting",
  "serving_status": "unserved",
  "ordered_at": "2025-12-28T04:15:00Z"
}
```

## 🎯 Success Criteria

- [ ] Can add multiple items via AddMenuItemModal
- [ ] Items appear in "CHỜ NẤU" section immediately
- [ ] Each item shows ordered_at timestamp (GMT)
- [ ] Can edit waiting items (qty/note)
- [ ] Cannot edit cooking/cooked items (lock message shown)
- [ ] Can delete waiting items
- [ ] Statistics panel updates correctly
- [ ] Total price calculation correct
- [ ] AddMenuItemModal stays as overlay
- [ ] WaiterOrderModal persists when AddMenuItemModal open
- [ ] All changes saved to MongoDB
- [ ] Close and re-open modal - changes persisted
