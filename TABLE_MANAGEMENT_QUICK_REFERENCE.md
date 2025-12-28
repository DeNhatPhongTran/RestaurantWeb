# Table Management System - Quick Reference

## File Locations

### Frontend Components
```
_frontend/src/
├── pages/TableManagement.jsx                  (Main orchestrator)
└── components/table-management/
    ├── TableGrid.jsx                          (Display grid)
    ├── CreateTableModal.jsx                   (Create form)
    ├── EditTableModal.jsx                     (Edit form)
    ├── DeleteTableConfirmModal.jsx            (Delete confirmation)
    ├── CashierPaymentModal.jsx                (Payment view)
    ├── WaiterOrderModal.jsx                   (Order management)
    └── index.js                               (Exports)
```

### Backend Components
```
backend/
├── routes/
│   ├── tables.js                              (CRUD endpoints)
│   └── reservations.js                        (Updated with by-table)
├── models/
│   └── Table.js                               (Mongoose model)
├── database/
│   ├── schema/
│   │   ├── table_schema.js                    (Table schema)
│   │   └── order_item_schema.js               (Updated schema)
│   └── init_data/
│       └── init_db.js                         (Updated initialization)
```

## API Endpoints Summary

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | /api/tables | ✓ | List all tables |
| GET | /api/tables/:id | ✓ | Get single table |
| POST | /api/tables | ✓ | Create table |
| PUT | /api/tables/:id | ✓ | Update table |
| DELETE | /api/tables/:id | ✓ | Delete table |
| GET | /api/reservations/by-table/:tableId | ✗ | Get table reservation |

## Role Permissions Matrix

| Action | Manager | Waiter | Cashier | Chef |
|--------|---------|--------|---------|------|
| View tables | ✓ | ✓ | ✓ | ✓ |
| Create table | ✓ | ✗ | ✗ | ✗ |
| Edit table | ✓ | ✗ | ✗ | ✗ |
| Delete table | ✓ | ✗ | ✗ | ✗ |
| View order modal | ✗ | ✓ | ✗ | ✗ |
| View payment modal | ✗ | ✗ | ✓ | ✗ |
| Add items | ✗ | ✓ | ✗ | ✗ |
| Delete items | ✗ | ✓* | ✗ | ✗ |
| Process payment | ✗ | ✗ | ✓ | ✗ |
| *Only if status="waiting" | | | | |

## Data Models

### Table
```javascript
{
  _id: ObjectId,
  name: String,              // "A1", "B5", "C3"
  capacity: Number,          // 2-8
  currentStatus: String,     // "empty" or "serving"
  created_at: Date,
  updated_at: Date
}
```

### OrderItem (Updated)
```javascript
{
  _id: ObjectId,
  reservation: ObjectId,     // FK to Reservation
  item: ObjectId,            // FK to MenuItem
  quantity: Number,
  price_at_time: Number,
  note: String,
  status: String,            // "waiting", "cooking", "cooked"
  serving_status: String,    // "served" or "unserved" (NEW)
  ordered_at: Date,          // NEW
  created_at: Date,
  updated_at: Date
}
```

## Component Props

### TableManagement
```javascript
{
  userRole: 'manager' | 'cashier' | 'waiter' | 'chef'
}
```

### TableGrid
```javascript
{
  tables: Table[],
  userRole: string,
  onTableClick: (table: Table) => void,
  onEditTable: (table: Table) => void,
  onDeleteTable: (table: Table) => void
}
```

### CashierPaymentModal
```javascript
{
  isOpen: boolean,
  onClose: () => void,
  table: Table,
  reservation: Reservation
}
```

### WaiterOrderModal
```javascript
{
  isOpen: boolean,
  onClose: () => void,
  table: Table,
  reservation: Reservation
}
```

## State Management Flow

```
TableManagement
├── tables: Table[]
├── selectedTable: Table
├── selectedReservation: Reservation
├── isCreateModalOpen: boolean
├── isEditModalOpen: boolean
├── isDeleteModalOpen: boolean
├── isCashierPaymentOpen: boolean
└── isWaiterOrderOpen: boolean
```

## Event Handlers in TableManagement

| Handler | Triggered By | Action |
|---------|--------------|--------|
| `fetchTables()` | Mount, After CRUD | GET /api/tables |
| `handleTableClick(table)` | Click table card | Fetch reservation, open modal |
| `handleCreateTable(data)` | Submit create form | POST /api/tables |
| `handleEditTable(table)` | Click edit button | Set selected, open edit modal |
| `handleSaveEdit(data)` | Submit edit form | PUT /api/tables/:id |
| `handleDeleteTable(table)` | Click delete button | Set selected, open confirm modal |
| `handleConfirmDelete()` | Confirm deletion | DELETE /api/tables/:id |

## Status Badge Colors

| Status | Color | Icon |
|--------|-------|------|
| Empty | Green | ✅ |
| Serving | Red | 🔴 |
| Waiting | Yellow | ⏳ |
| Cooking | Orange | 🍳 |
| Cooked | Green | ✅ |
| Served | Blue | 🍽️ |
| Unserved | Gray | ⏱️ |

## Common Issues & Fixes

### Tables not loading
```javascript
// Check API endpoint
GET /api/tables
// Verify auth token is valid
// Check browser console for errors
```

### Modal not appearing
```javascript
// Verify reservation exists
GET /api/reservations/by-table/:tableId
// Check if data is not null/undefined
// Ensure modal state is true
```

### Delete disabled in waiter view
```javascript
// Check item.status === "waiting"
// Item status is "cooking" or "cooked" = disabled
// Cannot delete items in these states
```

## Currency Formatting

All prices displayed in Vietnamese Dong (₫)
```javascript
price.toLocaleString('vi-VN') + '₫'
// Output: "55,000₫"
```

## Tax Calculation

Standard tax rate: 12%
```javascript
const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
const tax = subtotal * 0.12
const total = subtotal + tax
```

## Toast Notifications (TODO)

```javascript
// Success
toast.success('Thêm bàn thành công')
// Error
toast.error('Thêm bàn thất bại')
// Loading
toast.loading('Đang tải...')
```

## Keyboard Shortcuts (TODO)

| Key | Action |
|-----|--------|
| Alt+N | New table (Manager only) |
| Esc | Close modal |
| Enter | Submit form |

## URL Routes

```javascript
/tables                    // Manager view
/cashier/tables           // Cashier view
/waiter/tables            // Waiter view
/chef/tables              // Chef view
```

## Environment Variables

```env
VITE_API_URL=http://localhost:5000
```

## Database Initialization

```bash
# Run initialization
npm run init-db

# Result: 40 tables created
# - Floor A: 20 tables (A1-A20)
# - Floor B: 12 tables (B1-B12)
# - Floor C: 8 tables (C1-C8)
```

## Testing Commands

```bash
# Create table
curl -X POST http://localhost:5000/api/tables \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"name":"A21","capacity":4}'

# Get all tables
curl http://localhost:5000/api/tables \
  -H "Authorization: Bearer TOKEN"

# Update table
curl -X PUT http://localhost:5000/api/tables/TABLE_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"name":"A22","capacity":6}'

# Delete table
curl -X DELETE http://localhost:5000/api/tables/TABLE_ID \
  -H "Authorization: Bearer TOKEN"

# Get reservation by table
curl http://localhost:5000/api/reservations/by-table/TABLE_ID
```

## Important Notes

1. **Table names** are case-sensitive and must be unique
2. **Capacity** must be between 1-20
3. **Status** can only be "empty" or "serving"
4. **Delete items** only works if status is "waiting"
5. **Tax** is automatically calculated at 12%
6. **Auth** is required for all table operations
7. **Reservations** are linked via Reservation_Table collection
8. **OrderItems** track serving status separately

## Related Documentation

- [Full README](./README.md)
- [Setup Guide](./TABLE_MANAGEMENT_SETUP.md)
- [Staff Management System](./STAFF_MANAGEMENT_SETUP.md)
- [Order Management](./ORDER_MANAGEMENT.md)
