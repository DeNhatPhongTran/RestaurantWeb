# Table Management System Documentation

## Overview
The Table Management System is a comprehensive module designed for managing restaurant tables with role-based access control. It supports 40 pre-initialized tables across three floors (A, B, C) with distinct workflows for different user roles.

## System Architecture

### Role-Based Workflows

#### 1. **Manager** 🏢
- **Full CRUD Operations**:
  - Create new tables with name and capacity
  - Edit existing table properties (name, capacity)
  - Delete tables from the system
- **Dashboard Features**:
  - View all tables in grid layout
  - Real-time statistics (total tables, serving, empty)
  - View mode toggle (grid/list)
  - Responsive grid layout organized by floor

#### 2. **Cashier** 💳
- **Payment Processing**:
  - Click table to see payment modal
  - View all ordered items (read-only)
  - See total amount including taxes (12%)
  - Process payment through PaymentProcessModal
  - Table auto-resets to "empty" after successful payment
- **Restrictions**:
  - No CRUD operations allowed
  - Read-only access to order items
  - Can only process payments

#### 3. **Waiter** 👨‍🍳
- **Order Management**:
  - Click table to view/manage orders
  - Add new items to order
  - Edit existing items (quantity, dish selection)
  - Delete items (only if status = "waiting")
  - Cannot delete items with "cooking" or "cooked" status
- **Features**:
  - View item status with badges (⏳ Waiting, 🍳 Cooking, ✅ Done)
  - Track serving status (⏱️ Unserved, 🍽️ Served)
  - Add order notes for kitchen
  - Real-time order summary with pricing

#### 4. **Chef** 👨‍🍳
- **Read-Only Access**:
  - View all tables (disabled state, no interactions)
  - Cannot click or modify any tables
  - Cannot access any modals

### Table Layout

```
Tầng 1 (Floor A): 20 tables
  A1-A10: 2 seats each
  A11-A20: 4 seats each

Tầng 2 (Floor B): 12 tables
  B1-B6: 4 seats each
  B7-B12: 6 seats each

Tầng 3 (Floor C): 8 tables
  C1-C4: 2 seats each
  C5-C8: 4 seats each
```

## Technical Implementation

### Frontend Components

#### **TableManagement.jsx** (Main Page)
- Location: `_frontend/src/pages/TableManagement.jsx`
- Responsibilities:
  - Orchestrates all table management workflows
  - Manages modal states for CRUD operations and role-specific views
  - Fetches tables and reservations from API
  - Handles CRUD callbacks and data synchronization
  - Role-based routing for cashier/waiter modals
- Key Props:
  - `userRole`: 'manager' | 'cashier' | 'waiter' | 'chef'

#### **TableGrid.jsx** (Display Component)
- Location: `_frontend/src/components/table-management/TableGrid.jsx`
- Features:
  - Groups tables by floor (A, B, C)
  - Color-coded status indicators (blue=serving, white=empty)
  - Manager-only edit/delete buttons (hover reveal)
  - Responsive grid layout (5-10 columns)
  - Disabled state for chef role
- Props:
  - `tables`: Table[]
  - `userRole`: string
  - `onTableClick`: (table) => void
  - `onEditTable`: (table) => void
  - `onDeleteTable`: (table) => void

#### **CreateTableModal.jsx**
- Location: `_frontend/src/components/table-management/CreateTableModal.jsx`
- Features:
  - Form for adding new tables
  - Auto-uppercase name field
  - Capacity validation (1-20)
  - Error handling and loading states
  - Form reset on close

#### **EditTableModal.jsx**
- Location: `_frontend/src/components/table-management/EditTableModal.jsx`
- Features:
  - Pre-filled form with current table data
  - Same validation as create
  - Updates via callback

#### **DeleteTableConfirmModal.jsx**
- Location: `_frontend/src/components/table-management/DeleteTableConfirmModal.jsx`
- Features:
  - Confirmation dialog with warning
  - Shows table info before deletion
  - Prevents accidental deletions

#### **CashierPaymentModal.jsx**
- Location: `_frontend/src/components/table-management/CashierPaymentModal.jsx`
- Features:
  - Display list of ordered items
  - Show item details (name, quantity, price)
  - Calculate subtotal, tax (12%), total
  - Integration with PaymentProcessModal
  - Table status resets to "empty" after payment
- Props:
  - `isOpen`: boolean
  - `onClose`: () => void
  - `table`: Table object
  - `reservation`: Reservation object

#### **WaiterOrderModal.jsx**
- Location: `_frontend/src/components/table-management/WaiterOrderModal.jsx`
- Features:
  - List of ordered items with status badges
  - Add new items via dropdown menu
  - Delete items (only if status = "waiting")
  - View item notes and prices
  - Track serving status
  - Real-time order summary
- Props:
  - `isOpen`: boolean
  - `onClose`: () => void
  - `table`: Table object
  - `reservation`: Reservation object

### Backend API Endpoints

#### Tables Routes (`/api/tables`)

**GET /api/tables**
- Get all tables
- Auth: Required (middleware)
- Response:
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "...",
        "name": "A1",
        "capacity": 2,
        "currentStatus": "empty"
      }
    ]
  }
  ```

**GET /api/tables/:id**
- Get single table
- Auth: Required
- Response: Single table object

**POST /api/tables**
- Create new table
- Auth: Required
- Request:
  ```json
  {
    "name": "A21",
    "capacity": 4,
    "currentStatus": "empty"
  }
  ```

**PUT /api/tables/:id**
- Update table
- Auth: Required
- Request: Partial update with name, capacity, currentStatus

**DELETE /api/tables/:id**
- Delete table
- Auth: Required
- Response: Success message

#### Reservations Routes (`/api/reservations`)

**GET /api/reservations/by-table/:tableId**
- Get reservation for a specific table
- Auth: Not required
- Response:
  ```json
  {
    "success": true,
    "data": {
      "_id": "...",
      "customer_name": "...",
      "guest_count": 4,
      "datetime_checkin": "...",
      "datetime_out": "...",
      "status": "..."
    }
  }
  ```

### Database Schema

#### Table Schema (`table_schema.js`)
```javascript
{
  name: String (unique, required),      // e.g., "A1", "B5", "C3"
  capacity: Number (required),           // 2-8 seats
  currentStatus: String,                 // "empty" | "serving"
  created_at: Date,
  updated_at: Date
}
```

#### OrderItem Schema Updates
```javascript
{
  // ... existing fields ...
  ordered_at: Date,                      // Timestamp when item was ordered
  serving_status: String                 // "served" | "unserved"
}
```

### Data Flow

#### Manager Workflow
1. Manager opens TableManagement page
2. Fetches all 40 tables via GET /api/tables
3. Displays tables in grid organized by floor
4. Manager actions:
   - **Create**: Click "Thêm Bàn" → CreateTableModal → POST /api/tables
   - **Edit**: Click edit button → EditTableModal → PUT /api/tables/:id
   - **Delete**: Click delete button → DeleteTableConfirmModal → DELETE /api/tables/:id
5. After any action, refreshes table list

#### Cashier Workflow
1. Cashier opens TableManagement page (cashier role)
2. Fetches all tables and displays read-only grid
3. Cashier clicks table → Fetches reservation via GET /api/reservations/by-table/:id
4. CashierPaymentModal opens with:
   - List of ordered items (from reservation.orderItems)
   - Subtotal, tax (12%), total calculations
   - Payment button
5. Click "Thanh Toán Ngay" → Opens PaymentProcessModal
6. After successful payment:
   - Table status updates to "empty"
   - Modal closes
   - Table list refreshes

#### Waiter Workflow
1. Waiter opens TableManagement page
2. Fetches tables and displays grid
3. Waiter clicks table → Fetches reservation via GET /api/reservations/by-table/:id
4. WaiterOrderModal opens with:
   - Current ordered items with status filtering
   - Add new items button
   - Delete button (enabled only if status = "waiting")
5. Waiter actions:
   - **Add Item**: Click "Thêm Món" → Select from menu → Enter quantity/notes → POST /api/orderitems
   - **Delete Item**: Click delete (if allowed) → DELETE /api/orderitems/:id
   - **View Note**: See item notes and status badges

#### Chef Workflow
1. Chef opens TableManagement page
2. Views all tables in read-only disabled state
3. Cannot interact with any tables
4. Returns to kitchen to prepare items

## UI Components & Styling

### Color Scheme
- **Primary**: `#0066FF` (Blue) - Used for serving tables
- **Secondary**: `#F5F5F5` (Light Gray) - Used for empty tables
- **Success**: `#22C55E` (Green) - Used for empty status badge
- **Warning**: `#F59E0B` (Orange) - Used for cooking status
- **Error**: `#EF4444` (Red) - Used for serving status

### Responsive Design
- **Grid Columns**:
  - Mobile: 5 columns
  - Tablet: 6 columns
  - Desktop: 8 columns
  - Large Desktop: 10 columns
- **Modal**: Responsive from 100% to max-w-2xl
- **Buttons**: Full-width on mobile, auto on desktop

## Integration Points

### Context API
- Uses `ApiContext` from `_frontend/src/context/ApiContext.jsx`
- Provides `apiCall(url, options)` for making API requests

### Utilities
- Uses formatters from `_frontend/src/utils/formatters.js` for price formatting
- Uses helpers from `_frontend/src/utils/helpers.js` for common operations

## Error Handling

### Frontend Error Handling
- Toast notifications for API errors
- Form validation with error messages
- Loading states during API calls
- Graceful fallbacks for missing data

### Backend Error Handling
- HTTP status codes (400, 404, 500)
- JSON error responses with success flag
- Input validation before database operations
- Try-catch blocks around all operations

## Testing Scenarios

### Manager Testing
- [ ] Create table with valid name and capacity
- [ ] Attempt to create duplicate table (should fail)
- [ ] Edit table name and capacity
- [ ] Delete table
- [ ] View stats update correctly
- [ ] Toggle between grid/list views

### Cashier Testing
- [ ] View payment modal for table with items
- [ ] Verify total calculation (subtotal + 12% tax)
- [ ] Process payment successfully
- [ ] Verify table becomes "empty" after payment
- [ ] Attempt to modify items (should be disabled)

### Waiter Testing
- [ ] Add item to order
- [ ] Delete item with "waiting" status
- [ ] Attempt to delete item with "cooking" status (should be disabled)
- [ ] Edit item quantity and notes
- [ ] View order summary with correct pricing

### Chef Testing
- [ ] Verify tables display in disabled state
- [ ] Attempt to click table (should not open modal)
- [ ] Verify no CRUD buttons visible

## Performance Optimization

1. **API Optimization**:
   - Fetch all tables once on page load
   - Only refresh after CRUD operations
   - Cache reservation data in modal state

2. **Rendering Optimization**:
   - Use React.memo for TableCard component
   - Memoize grouped tables computation
   - Only re-render affected components

3. **Database Optimization**:
   - Add index on `name` field for lookups
   - Add index on `currentStatus` for filtering
   - Optimize reservation queries with aggregation

## Security Considerations

1. **Authentication**:
   - All API endpoints require JWT token
   - Token verified via `verifyToken` middleware

2. **Authorization**:
   - Frontend enforces role-based UI (trust + verification)
   - Backend should also verify user role (not yet implemented)
   - Read-only fields cannot be modified by unauthorized users

3. **Data Validation**:
   - Input validation on both frontend and backend
   - Name uniqueness enforced at database level
   - Capacity range validation (1-20)

## Future Enhancements

1. **Features**:
   - Table merge/split functionality
   - Reservation system integration
   - QR code generation for tables
   - Table-to-kitchen communication
   - Real-time table status updates via WebSocket

2. **Improvements**:
   - Add search/filter for tables by status or floor
   - Implement pagination for large table count
   - Add sorting options (by name, capacity, status)
   - Multi-language support

3. **Analytics**:
   - Table occupancy rates
   - Average order duration per table
   - Revenue per table
   - Peak hours analysis

## Related Files

- Frontend:
  - Pages: `_frontend/src/pages/TableManagement.jsx`
  - Components: `_frontend/src/components/table-management/`
  - Context: `_frontend/src/context/ApiContext.jsx`
  - Utils: `_frontend/src/utils/api.js`

- Backend:
  - Routes: `backend/routes/tables.js`
  - Routes: `backend/routes/reservations.js` (updated)
  - Schema: `backend/database/schema/table_schema.js`
  - Schema: `backend/database/schema/order_item_schema.js` (updated)
  - Init: `backend/database/init_data/init_db.js` (updated)
  - Models: `backend/models/Table.js`

## Support & Troubleshooting

### Common Issues

1. **Tables not loading**: 
   - Check if GET /api/tables is accessible
   - Verify JWT token is valid
   - Check database connection

2. **Modal not opening**:
   - Verify reservation exists for table
   - Check browser console for API errors
   - Ensure user role is set correctly

3. **Payment not processing**:
   - Verify PaymentProcessModal is properly imported
   - Check order items have required fields
   - Verify total calculation is correct

4. **Items not deleting**:
   - Check if item status is "waiting"
   - Verify DELETE /api/orderitems/:id is accessible
   - Check item _id is being passed correctly

## Version History

- **v1.0.0** (Current):
  - Initial implementation
  - 40 tables across 3 floors
  - Role-based workflows for all 4 roles
  - Complete CRUD operations
  - Payment and order management

## Contact & Maintenance

For issues or questions about the Table Management System, please contact the development team or open an issue in the project repository.
