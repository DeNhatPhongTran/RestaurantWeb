# Table Management System - Setup & Implementation Guide

## Quick Start

### 1. Database Initialization
The 40 tables are automatically created when running the initialization script:

```bash
cd backend
npm run init-db
```

This creates:
- **Floor A**: 20 tables (A1-A20)
  - A1-A10: 2 seats each
  - A11-A20: 4 seats each
- **Floor B**: 12 tables (B1-B12)
  - B1-B6: 4 seats each
  - B7-B12: 6 seats each
- **Floor C**: 8 tables (C1-C8)
  - C1-C4: 2 seats each
  - C5-C8: 4 seats each

### 2. Backend Setup

#### Ensure Routes are Registered
File: `backend/app.js`
```javascript
import tablesRoute from './routes/tables.js'
// ...
app.use('/api/tables', tablesRoute)
app.use('/api/reservations', reservationsRoute)
```

#### Verify API Endpoints
- ✅ GET /api/tables
- ✅ GET /api/tables/:id
- ✅ POST /api/tables
- ✅ PUT /api/tables/:id
- ✅ DELETE /api/tables/:id
- ✅ GET /api/reservations/by-table/:tableId (newly added)

### 3. Frontend Setup

#### Import Components
```javascript
import TableManagement from './pages/TableManagement'

// Inside your router
<Route path="/tables" element={<TableManagement userRole="manager" />} />
<Route path="/cashier/tables" element={<TableManagement userRole="cashier" />} />
<Route path="/waiter/tables" element={<TableManagement userRole="waiter" />} />
<Route path="/chef/tables" element={<TableManagement userRole="chef" />} />
```

#### Verify Imports in TableManagement.jsx
```javascript
import TableGrid from '../components/table-management/TableGrid'
import {
  CashierPaymentModal,
  CreateTableModal,
  EditTableModal,
  DeleteTableConfirmModal,
  WaiterOrderModal
} from '../components/table-management'
```

### 4. File Structure

```
_frontend/src/
├── components/
│   └── table-management/
│       ├── CashierPaymentModal.jsx
│       ├── CreateTableModal.jsx
│       ├── DeleteTableConfirmModal.jsx
│       ├── EditTableModal.jsx
│       ├── TableGrid.jsx
│       ├── WaiterOrderModal.jsx
│       ├── index.js
│       └── README.md
└── pages/
    └── TableManagement.jsx

backend/
├── database/
│   └── init_data/
│       └── init_db.js (updated with 40 tables)
├── models/
│   └── Table.js
├── routes/
│   ├── tables.js
│   └── reservations.js (updated with by-table endpoint)
└── database/
    └── schema/
        ├── table_schema.js
        └── order_item_schema.js (updated)
```

## Implementation Checklist

### Database Layer
- [x] Table schema exists and is functional
- [x] Order item schema updated with `ordered_at` and `serving_status` fields
- [x] Table model created
- [x] 40 tables initialized in init_db.js
- [x] by-table reservation endpoint added

### Backend API Layer
- [x] Table CRUD routes implemented
- [x] Authentication middleware on routes
- [x] Error handling for all endpoints
- [x] Validation of inputs
- [x] Reservation by table endpoint

### Frontend Layer
- [x] TableManagement main page
- [x] TableGrid display component
- [x] CreateTableModal
- [x] EditTableModal
- [x] DeleteTableConfirmModal
- [x] CashierPaymentModal
- [x] WaiterOrderModal
- [x] Component index.js exports

### Features
- [x] Manager CRUD operations
- [x] Cashier payment workflow
- [x] Waiter order management
- [x] Chef read-only view
- [x] Role-based access control
- [x] Responsive grid layout
- [x] Status indicators and badges
- [x] Floor-based table grouping

### UI/UX
- [x] Color-coded status (serving vs empty)
- [x] Status badges with icons
- [x] Responsive grid (5-10 columns)
- [x] Modal-based CRUD
- [x] Loading states
- [x] Error handling
- [x] Form validation

## Testing Workflow

### Step 1: Manager Setup
1. Login as manager (username: "manager0", password: "123")
2. Navigate to /tables
3. Test CRUD operations:
   - Create a new table
   - Edit an existing table
   - Delete a table
4. Verify stats update correctly

### Step 2: Verify Database
1. Check MongoDB for newly created tables
2. Verify 40 tables exist with correct names and capacities
3. Confirm all tables have status "empty"

### Step 3: Cashier Testing
1. Login as cashier
2. Navigate to /cashier/tables
3. Click on a table
4. Verify payment modal appears
5. Check if items from reservation appear
6. Verify total calculation (subtotal + 12% tax)
7. Test payment processing

### Step 4: Waiter Testing
1. Login as waiter
2. Navigate to /waiter/tables
3. Click on a table
4. Test adding new items
5. Test deleting items (only if "waiting" status)
6. Verify status badges display correctly

### Step 5: Chef Testing
1. Login as chef
2. Navigate to /chef/tables
3. Verify tables display in disabled state
4. Attempt to click table (should not open modal)

## API Response Examples

### GET /api/tables
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "A1",
      "capacity": 2,
      "currentStatus": "empty"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "A2",
      "capacity": 2,
      "currentStatus": "serving"
    }
  ]
}
```

### GET /api/reservations/by-table/507f1f77bcf86cd799439011
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439020",
    "customer_name": "Nguyễn Văn A",
    "customer_phone": "0123456789",
    "guest_count": 2,
    "datetime_checkin": "2025-01-15T12:00:00.000Z",
    "datetime_out": "2025-01-15T14:00:00.000Z",
    "status": "active",
    "orderItems": [
      {
        "_id": "507f1f77bcf86cd799439030",
        "item": {
          "_id": "507f1f77bcf86cd799439040",
          "name": "Cơm Gà Hải Nam",
          "price": 55000
        },
        "quantity": 2,
        "price_at_time": 55000,
        "note": "Less oil",
        "status": "waiting",
        "serving_status": "unserved",
        "ordered_at": "2025-01-15T12:05:00.000Z"
      }
    ]
  }
}
```

## Troubleshooting

### Issue: Tables not loading
**Solution**:
1. Check if MongoDB connection is active
2. Verify GET /api/tables returns data
3. Check browser console for errors
4. Ensure user token is valid

### Issue: Modal not opening
**Solution**:
1. Verify reservation exists for the table
2. Check if GET /api/reservations/by-table/:id returns data
3. Inspect network tab for API errors
4. Check if userRole is set correctly

### Issue: Cannot add items as waiter
**Solution**:
1. Verify /api/menu endpoint returns menu items
2. Check if POST /api/orderitems endpoint is working
3. Verify reservation has an _id
4. Check MongoDB for orderItems collection

### Issue: Payment not processing
**Solution**:
1. Verify PaymentProcessModal is imported correctly
2. Check if order items have all required fields
3. Verify total calculation includes 12% tax
4. Check if payment API endpoint exists

### Issue: Table not resetting to empty after payment
**Solution**:
1. Verify PUT /api/tables/:id endpoint works
2. Check if currentStatus is being updated
3. Verify onClose callback is called
4. Ensure fetchTables() is called after payment

## Performance Considerations

### Database Queries
- Add indexes on table name and status for faster lookups
- Use projection to select only needed fields
- Implement pagination for large datasets

### Frontend Optimization
- Use React.memo for TableCard to prevent re-renders
- Implement lazy loading for large table counts
- Cache API responses when possible

### Backend Optimization
- Use database aggregation for complex queries
- Implement caching layer for frequently accessed data
- Use connection pooling for database

## Security Checklist

- [x] All API routes protected with auth middleware
- [x] Input validation on backend
- [x] Unique constraints on table names
- [x] Role-based frontend UI (UI-level protection)
- [ ] Backend role verification (TODO: Add to routes)
- [ ] Rate limiting on API endpoints (TODO)
- [ ] CORS configuration (TODO: Verify)

## Next Steps

1. **Backend Enhancement**:
   - Add role verification to backend routes
   - Implement rate limiting
   - Add request logging

2. **Frontend Enhancement**:
   - Add real-time updates via WebSocket
   - Implement table merge/split
   - Add kitchen display system

3. **Features**:
   - QR code generation for tables
   - Table reservations
   - Advanced analytics dashboard

## Support

For issues or questions:
1. Check the README.md in table-management folder
2. Review error logs in browser console
3. Check MongoDB for data consistency
4. Contact development team

## Version Info

- **Table Schema Version**: v1
- **API Version**: v1
- **Node.js**: 14+
- **React**: 18+
- **MongoDB**: 4.4+
