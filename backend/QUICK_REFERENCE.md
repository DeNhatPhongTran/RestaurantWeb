# QUICK REFERENCE - API ENDPOINTS

## 🔐 Authentication
```
POST   /api/auth/register           → Register new account
POST   /api/auth/login              → Login (returns JWT token)
GET    /api/auth/me                 → Get current user info [TOKEN]
PUT    /api/auth/me                 → Update profile [TOKEN]
POST   /api/auth/logout             → Logout [TOKEN]
POST   /api/auth/change-password    → Change password [TOKEN]
```

## 👥 User Management
```
GET    /api/auth/users/list         → Get all users [TOKEN]
GET    /api/auth/users/:id          → Get user details [TOKEN]
POST   /api/auth/users              → Create new employee [TOKEN]
PUT    /api/auth/users/:id          → Update employee [TOKEN]
DELETE /api/auth/users/:id          → Delete employee [TOKEN]
```

## 🔑 Roles
```
GET    /api/roles/list              → Get all roles
GET    /api/roles/:id               → Get role details
GET    /api/roles/:id/users         → Get users in role
POST   /api/roles                   → Create role [TOKEN]
PUT    /api/roles/:id               → Update role [TOKEN]
DELETE /api/roles/:id               → Delete role [TOKEN]
```

## 🍽️ Menu & Categories
```
GET    /api/menu/categories         → Get all categories
POST   /api/menu/categories         → Create category [TOKEN]
PUT    /api/menu/categories/:id     → Update category [TOKEN]
DELETE /api/menu/categories/:id     → Delete category [TOKEN]

GET    /api/menu/random             → Get 6 random items
GET    /api/menu/items              → Get all menu items
GET    /api/menu/items/:id          → Get item details
POST   /api/menu/items              → Create item [TOKEN]
PUT    /api/menu/items/:id          → Update item [TOKEN]
DELETE /api/menu/items/:id          → Delete item [TOKEN]
```

## 🏪 Admin Menu (Dish Menu)
```
GET    /api/dish_menu/list          → Get all dishes
POST   /api/dish_menu/create        → Create dish
POST   /api/dish_menu/edit          → Edit dish
POST   /api/dish_menu/delete        → Delete dish
```

## 🪑 Tables
```
GET    /api/tables/list             → Get all tables
GET    /api/tables/:id              → Get table details
GET    /api/tables/by-status/:status → Get tables by status
POST   /api/tables                  → Create table [TOKEN]
PUT    /api/tables/:id              → Update table [TOKEN]
DELETE /api/tables/:id              → Delete table [TOKEN]
```

## 📋 Reservations
```
GET    /api/reservations/list       → Get all reservations
POST   /api/reservations/create     → Create reservation
POST   /api/reservations/edit       → Edit reservation
POST   /api/reservations/delete     → Delete reservation
POST   /api/reservations/overlap_check → Check availability
```

## 🛒 Order Items
```
GET    /api/orderitems/list         → Get all order items
GET    /api/orderitems/:id          → Get item details
GET    /api/orderitems/reservation/:id → Get items by reservation
GET    /api/orderitems/by-status/:status → Get items by status
POST   /api/orderitems              → Create order item [TOKEN]
PUT    /api/orderitems/:id          → Update order item [TOKEN]
DELETE /api/orderitems/:id          → Delete order item [TOKEN]
```

## 💰 Invoices
```
GET    /api/invoices/list           → Get all invoices
GET    /api/invoices/:id            → Get invoice details
GET    /api/invoices/reservation/:id → Get invoice by reservation
GET    /api/invoices/by-method/:method → Get invoices by payment method
GET    /api/invoices/cashier/:id    → Get invoices by cashier
POST   /api/invoices                → Create invoice [TOKEN]
PUT    /api/invoices/:id            → Update invoice [TOKEN]
DELETE /api/invoices/:id            → Delete invoice [TOKEN]
```

## 📅 Leave Requests
```
GET    /api/leaverequests/list      → Get all leave requests
GET    /api/leaverequests/:id       → Get request details
GET    /api/leaverequests/user/:id  → Get requests by user
GET    /api/leaverequests/by-status/:status → Get requests by status
POST   /api/leaverequests           → Create leave request [TOKEN]
PUT    /api/leaverequests/:id       → Update leave request [TOKEN]
POST   /api/leaverequests/:id/approve → Approve request [TOKEN]
POST   /api/leaverequests/:id/reject → Reject request [TOKEN]
DELETE /api/leaverequests/:id       → Delete leave request [TOKEN]
```

---

## 📊 Status Values

### Reservation Status
`pending` | `confirmed` | `checked-in` | `cancelled` | `finished` | `no-show`

### OrderItem Status
`waiting` | `cooking` | `cooked`

### Table Status
`empty` | `serving`

### Invoice Payment Method
`cash` | `card` | `bank` | `ewallet`

### LeaveRequest Status
`pending` | `approved` | `rejected`

### LeaveRequest Type
`nghi_thuong` | `nghi_phep` | `nghi_che_do` | `nghi_le`

### User State
`working` | `off_work`

---

## 🔑 Token Usage

All endpoints marked with `[TOKEN]` require:
```
Authorization: Bearer <jwt_token>
```

Get token from:
```
POST /api/auth/register
POST /api/auth/login
```

---

## 📈 Total Statistics

- **Route Files**: 9
- **Total Endpoints**: 66
- **Collections**: 10 (all with complete CRUD)
- **GET Endpoints**: 33
- **POST Endpoints**: 17
- **PUT Endpoints**: 9
- **DELETE Endpoints**: 10
- **Protected Endpoints**: 30+

---

## 🎯 Common Use Cases

### Create Full Booking
```
1. GET /api/reservations/overlap_check      (Check availability)
2. POST /api/reservations/create            (Create reservation)
3. POST /api/orderitems                     (Add items to order)
4. PUT /api/orderitems/:id                  (Update item status to cooking)
5. PUT /api/orderitems/:id                  (Update item status to cooked)
6. POST /api/invoices                       (Create invoice)
```

### Manage Employee
```
1. POST /api/auth/users                     (Create employee)
2. GET /api/roles/list                      (Get available roles)
3. PUT /api/auth/users/:id                  (Assign role)
4. GET /api/auth/users/:id                  (Verify employee)
5. DELETE /api/auth/users/:id               (Remove employee)
```

### Handle Leave Request
```
1. POST /api/leaverequests                  (Employee submits)
2. GET /api/leaverequests/by-status/pending (Manager reviews)
3. POST /api/leaverequests/:id/approve      (Manager approves)
```

### Manage Menu
```
1. POST /api/menu/categories                (Create category)
2. POST /api/menu/items                     (Add menu item)
3. PUT /api/menu/items/:id                  (Update price/description)
4. GET /api/menu/random                     (Homepage display)
```

---

## 🚀 Deployment Checklist

- [ ] All 66 endpoints tested
- [ ] Error handling verified (400, 401, 404, 409, 500)
- [ ] Token authentication working
- [ ] Database connections stable
- [ ] CORS configured correctly
- [ ] Password hashing functional
- [ ] Validation rules enforced
- [ ] Unique constraints working
- [ ] Foreign key relationships intact
- [ ] Response format consistent

---

## 📝 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "count": 10
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

---

Created: December 25, 2025  
Status: ✅ Complete - All 10 collections with full CRUD operations
