# WAITER ORDER - VERIFICATION CHECKLIST

## ✅ Backend Verification

### 1. reservations.js - GET /:id endpoint
**Location**: `backend/routes/reservations.js` lines 260-295

**Verification Checklist**:
- [ ] Uses `.populate()` with orderItems
- [ ] Nested populate for MenuItem details
- [ ] Returns `orderItems: []` (never null)
- [ ] Selects correct fields: _id, item, quantity, note, status, serving_status, price_at_time, ordered_at
- [ ] MenuItem fields: _id, name, price, category

**Code Pattern**:
```javascript
const reservation = await Reservation.findById(id)
  .populate({
    path: "orderItems",
    model: "OrderItem",
    select: "_id item quantity note status serving_status price_at_time ordered_at",
    populate: {
      path: "item",
      select: "_id name price category"
    }
  });

const data = {
  ...reservation.toObject(),
  orderItems: reservation.orderItems || []
};
```

### 2. orderitems.js - POST endpoint
**Location**: `backend/routes/orderitems.js` lines 127-182

**Verification Checklist**:
- [ ] Accepts: reservation, item, quantity, note, price_at_time, status, serving_status, ordered_at
- [ ] Validates MenuItem exists
- [ ] Validates Reservation exists
- [ ] Sets default status to 'waiting'
- [ ] Sets default serving_status to 'unserved'
- [ ] Saves ordered_at (uses provided or current time)
- [ ] Adds orderItem._id to Reservation.orderItems array
- [ ] Populates MenuItem on response

**Code Pattern**:
```javascript
const newOrderItem = new OrderItem({
  reservation,
  item,
  quantity,
  note: note || '',
  price_at_time,
  status: status || 'waiting',
  serving_status: serving_status || 'unserved',
  ordered_at: ordered_at ? new Date(ordered_at) : new Date()
})

// Add to Reservation's orderItems array
if (!reservationExists.orderItems.includes(newOrderItem._id)) {
  reservationExists.orderItems.push(newOrderItem._id)
  await reservationExists.save()
}
```

### 3. orderitems.js - PUT endpoint
**Location**: `backend/routes/orderitems.js` lines 185-217

**Verification Checklist**:
- [ ] Accepts: quantity, note, status, item (all optional)
- [ ] Validates MenuItem if item field provided
- [ ] Updates only provided fields
- [ ] Supports changing status (waiting/cooking/cooked)
- [ ] Populates MenuItem on response
- [ ] Returns updated item

**Code Pattern**:
```javascript
if (item) {
  const menuItem = await MenuItem.findById(item)
  if (!menuItem) return error
  updateData.item = item
}

const orderItem = await OrderItem.findByIdAndUpdate(
  req.params.id,
  updateData,
  { new: true, runValidators: true }
).populate('item', 'name price category')
```

### 4. orderitems.js - DELETE endpoint
**Location**: `backend/routes/orderitems.js` lines 220-242

**Verification Checklist**:
- [ ] Deletes orderItem
- [ ] Removes orderItem._id from Reservation.orderItems array
- [ ] Uses $pull operator for array cleanup
- [ ] Returns deleted item
- [ ] Handles not found gracefully

**Code Pattern**:
```javascript
const orderItem = await OrderItem.findByIdAndDelete(req.params.id)

// Remove from reservation's orderItems array
await Reservation.findByIdAndUpdate(
  orderItem.reservation,
  { $pull: { orderItems: orderItem._id } }
)
```

---

## ✅ Frontend Verification

### 1. AddMenuItemModal.jsx - New Component
**Location**: `_frontend/src/components/table-management/AddMenuItemModal.jsx`

**Verification Checklist**:
- [ ] Exports default component
- [ ] Props: isOpen, onClose, menuItems, onConfirm, loading
- [ ] Categories extracted from menuItems
- [ ] Search filter working
- [ ] Category filter working
- [ ] Grid layout 2 columns
- [ ] Quantity controls (+/-) for each item
- [ ] Selected items shown in right panel
- [ ] Summary shows subtotal
- [ ] Confirm button calls onConfirm with selectedItems array
- [ ] Each selectedItem has: menuItem, quantity, note
- [ ] Modal has z-[60] (higher than parent z-50)

**Key Props Expected**:
```javascript
AddMenuItemModal({
  isOpen: boolean,
  onClose: () => void,
  menuItems: [{ _id, name, price, category, image }],
  onConfirm: async (selectedItems) => {
    // selectedItems: [{ menuItem, quantity, note }, ...]
  },
  loading?: boolean
})
```

### 2. WaiterOrderModal.jsx - Enhanced Component
**Location**: `_frontend/src/components/table-management/WaiterOrderModal.jsx`

**Verification Checklist**:
- [ ] Accepts props: isOpen, onClose, table, reservation (renamed from initialReservation)
- [ ] Imports AddMenuItemModal
- [ ] Uses reservation prop directly (not table.reservation)
- [ ] orderItems extracted from reservation.orderItems array
- [ ] Groups items into 3 sections: waiting, cooking, cooked
- [ ] Each section has colored header with count
- [ ] renderOrderItemCard function handles both display and edit modes
- [ ] Edit mode: only for waiting items
- [ ] Locked message: for cooking/cooked items
- [ ] Delete button: only for waiting items
- [ ] Shows ordered_at timestamp with formatTime()
- [ ] formatTime converts to HH:MM:SS format (vi-VN locale)
- [ ] Statistics panel shows counts by status
- [ ] Total calculation: subtotal + tax (12%)
- [ ] "Thêm Món" button opens AddMenuItemModal
- [ ] handleAddItems: POST to /api/orderitems for each item
- [ ] handleAddItems: calls refetchOrderItems after success
- [ ] handleSaveEdit: PUT to /api/orderitems/{id}
- [ ] handleDeleteItem: DELETE to /api/orderitems/{id}
- [ ] refetchOrderItems: GET /api/reservations/{id}

**Key Props Expected**:
```javascript
WaiterOrderModal({
  isOpen: boolean,
  onClose: () => void,
  table: { _id, name, capacity, ... },
  reservation: { _id, customer_name, orderItems: [...], ... }
})
```

**Expected State Variables**:
```javascript
const [reservation, setReservation] = useState(null)
const [orderItems, setOrderItems] = useState([])
const [loading, setLoading] = useState(false)
const [isAddItemOpen, setIsAddItemOpen] = useState(false)
const [menuItems, setMenuItems] = useState([])
const [editingItemId, setEditingItemId] = useState(null)
const [editData, setEditData] = useState({})
```

### 3. TableManagement.jsx - Integration
**Location**: `_frontend/src/pages/TableManagement.jsx`

**Verification Checklist**:
- [ ] Imports WaiterOrderModal (should already exist)
- [ ] handleTableClick for waiter: GET /api/reservations/{id}
- [ ] Passes both table and reservation props to WaiterOrderModal
- [ ] setSelectedReservation with full reservation data
- [ ] setIsWaiterOrderOpen(true) when reservation loaded
- [ ] onClose handler clears selectedReservation

**Code Pattern**:
```javascript
if (userRole === 'waiter') {
  if (table.isUsed && table.currentReservationId) {
    const res = await apiCall(`/api/reservations/${table.currentReservationId}`, { method: 'GET' });
    if (res.success && res.data) {
      setSelectedReservation(res.data);  // Full with orderItems
      setIsWaiterOrderOpen(true);
    }
  }
}

// In JSX:
<WaiterOrderModal
  isOpen={isWaiterOrderOpen}
  onClose={() => { ... }}
  table={selectedTable}
  reservation={selectedReservation}
/>
```

---

## 🔍 Data Structure Verification

### OrderItem Document
```javascript
{
  _id: ObjectId,
  reservation: ObjectId,  // ref to Reservation
  item: ObjectId,          // ref to MenuItem
  quantity: Number,
  note: String,
  status: String,          // waiting | cooking | cooked
  serving_status: String,  // served | unserved
  price_at_time: Number,   // captured at order time
  ordered_at: Date,        // ISO format (GMT)
  __v: 0
}
```

### Reservation Document (with orderItems)
```javascript
{
  _id: ObjectId,
  customer_name: String,
  customer_phone: String,
  guest_count: Number,
  datetime_checkin: Date,
  datetime_out: Date,
  status: String,
  created_at: Date,
  orderItems: [           // Array of OrderItem refs
    {
      _id: ObjectId,
      reservation: ObjectId,
      item: {              // Populated MenuItem
        _id: ObjectId,
        name: String,
        price: Number,
        category: String
      },
      quantity: Number,
      note: String,
      status: String,
      serving_status: String,
      price_at_time: Number,
      ordered_at: Date
    }
  ]
}
```

---

## 🧪 Test Scenarios

### Scenario 1: Add Items Flow
```
1. WaiterOrderModal open with reservation
   └─ orderItems: [] or existing items

2. Click "Thêm Món"
   └─ AddMenuItemModal overlay opens
   └─ z-index: AddMenuItemModal [60] > WaiterOrderModal [50]

3. User selects items:
   - Fried Rice (×2)
   - Coffee (×1)

4. Click "Xác Nhận (2)"
   └─ handleAddItems called with:
      [
        { menuItem: { _id, name, price }, quantity: 2, note: '' },
        { menuItem: { _id, name, price }, quantity: 1, note: 'Hot' }
      ]

5. For each item: POST /api/orderitems
   └─ Body includes: ordered_at: ISO string

6. Response: orderItem created with _id
   └─ Reservation.orderItems array updated

7. refetchOrderItems: GET /api/reservations/{id}
   └─ Returns fresh data with new items

8. WaiterOrderModal updates:
   - Items appear in "CHỜ NẤU" section
   - Timestamp shows (e.g., "09:15:30")
   - Statistics: waiting count increments
   - Total price recalculated

9. AddMenuItemModal closes automatically
   └─ WaiterOrderModal remains open
```

### Scenario 2: Edit Item Flow
```
1. In WaiterOrderModal, waiting item visible
   └─ Shows: Fried Rice ×2, 1.250.000₫, 09:15:30

2. Click [Sửa] button
   └─ Card enters edit mode
   └─ Border turns primary color
   └─ Qty input: 2, Note input: ''

3. User changes:
   - Quantity: 3
   - Note: "No onion"

4. Click [✓ Lưu]
   └─ handleSaveEdit called
   └─ PUT /api/orderitems/{id}
      Body: { quantity: 3, note: "No onion" }

5. Response: Updated orderItem
   └─ Local state updates immediately
   └─ Total price recalculates

6. Card exits edit mode
   └─ Shows: Fried Rice ×3, 1.875.000₫, 📝 No onion
```

### Scenario 3: Delete Item Flow
```
1. In WaiterOrderModal, waiting item visible

2. Click [Xóa] button
   └─ window.confirm() dialog appears

3. User clicks OK
   └─ handleDeleteItem called
   └─ DELETE /api/orderitems/{id}

4. Response: success
   └─ Local state removes item
   └─ Statistics update: waiting count decrements

5. Immediately visible:
   - Item removed from list
   - Total price recalculated
```

### Scenario 4: Locked Item Display
```
1. Order in "🍳 ĐANG NẤU" or "✅ ĐÃ XONG" section

2. Display shows:
   - Item name + quantity + price
   - Status badge (orange/green)
   - Timestamp

3. Action area shows:
   - ⛔ Không thể chỉnh sửa khi đang nấu/đã nấu xong
   - NO [Sửa] or [Xóa] buttons

4. User cannot interact with locked items
```

---

## ✨ Visual Verification

### Colors Used
```css
/* Waiting */
.bg-yellow-100 { background: #FEF3C7; }
.text-yellow-800 { color: #92400E; }

/* Cooking */
.bg-orange-100 { background: #FFEDD5; }
.text-orange-800 { color: #9A3412; }

/* Cooked */
.bg-green-100 { background: #DCFCE7; }
.text-green-800 { color: #166534; }

/* Primary actions */
.bg-primary-500 { /* Actual color from theme */ }
.text-primary-600 { /* Actual color from theme */ }
```

### Icons
- `ShoppingCart`: Order list header
- `Edit2`: Edit button
- `Trash2`: Delete button
- `Plus`: Add items/quantity
- `Minus`: Decrease quantity
- `Check`: Confirm
- `X`: Close/Cancel
- `Clock`: Timestamp indicator
- `ChefHat`: Modal header icon

---

## 🚨 Common Errors & Fixes

| Error | Check |
|-------|-------|
| `Cannot read property 'orderItems' of null` | Ensure reservation prop passed correctly from parent |
| `AddMenuItemModal not showing` | Check import statement, verify z-[60] in className |
| `Items not persisting` | Verify POST returns success, check Reservation.save() in backend |
| `Timestamps wrong` | Check formatTime() locale = 'vi-VN', verify ordered_at is ISO |
| `Can't edit cooked items` | Verify canEdit = status === 'waiting' check |
| `Edit button missing` | Check renderOrderItemCard condition for status |
| `Modal closes unexpectedly` | Check stopPropagation() on onClick handlers |
| `Items not grouped correctly` | Verify filter functions: item.status === 'waiting' etc |

---

## 📋 Final Checklist

- [ ] All 4 files modified/created as listed
- [ ] Backend routes handle all operations
- [ ] Frontend components render correctly
- [ ] Data flows properly through components
- [ ] Modal overlay behavior working
- [ ] Edit mode enter/exit smooth
- [ ] Lock messages display for cooking/cooked
- [ ] Timestamps show in correct format
- [ ] Statistics update in real-time
- [ ] AddMenuItemModal closes without closing parent
- [ ] Tests pass with sample data
- [ ] No console errors
- [ ] Linting passes (warnings acceptable)
- [ ] Database queries work correctly
