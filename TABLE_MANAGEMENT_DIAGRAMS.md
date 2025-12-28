# Table Management System - Visual Architecture & Diagrams

## 🏗️ System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         RESTAURANT POS                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │   Manager    │  │   Cashier    │  │   Waiter     │   Chef    │
│  │              │  │              │  │              │   (RO)    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘            │
│         │                 │                 │                     │
│         └─────────────────┼─────────────────┘                     │
│                           │                                       │
│                  ┌────────▼──────────┐                            │
│                  │ TableManagement   │                            │
│                  │    (Orchestrator) │                            │
│                  └────────┬──────────┘                            │
│                           │                                       │
│         ┌─────────────────┼─────────────────┐                    │
│         │                 │                 │                     │
│    ┌────▼─────┐   ┌──────▼──────┐   ┌─────▼─────┐                │
│    │ TableGrid │   │  Modals     │   │  API      │                │
│    │ (Display) │   │ (CRUD/View) │   │  Calls    │                │
│    └────┬─────┘   └──────┬──────┘   └─────┬─────┘                │
│         │                │               │                       │
│         └────────────────┼───────────────┘                       │
│                          │                                       │
└──────────────────────────┼───────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
    ┌────────┐        ┌─────────┐      ┌──────────┐
    │ Tables │        │ OrderItems│    │Reserv.  │
    │ API    │        │   API    │    │  API     │
    │ Routes │        │ Routes   │    │ Routes   │
    └────┬───┘        └─────┬────┘    └──────┬───┘
         │                  │                │
         └──────────────────┼────────────────┘
                            │
                 ┌──────────▼──────────┐
                 │   MongoDB/Mongoose  │
                 │   Collections:      │
                 │  - Tables           │
                 │  - Reservations     │
                 │  - OrderItems       │
                 │  - MenuItems        │
                 └─────────────────────┘
```

## 🔄 Role-Based Access Flow

```
                        ┌─────────────┐
                        │ User Login  │
                        └──────┬──────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
   ┌────────┐          ┌──────────┐          ┌──────────┐
   │Manager │          │ Cashier  │          │  Waiter  │ (Chef: RO)
   └────┬───┘          └──────┬───┘          └──────┬───┘
        │                     │                     │
    CRUD Menu              Payment              Order Menu
        │                     │                     │
        ▼                     ▼                     ▼
   ┌─────────┐         ┌────────────┐        ┌──────────┐
   │ Create  │         │  View Items│        │  View    │
   │ Edit    │    →    │  Total (12%│    →   │ Items    │
   │ Delete  │         │  Tax)      │        │ (Status) │
   │ View    │         │ Pay        │        │ Add/Del  │
   └─────────┘         └────────────┘        │(if wait.)│
        │                     │               └──────────┘
        ▼                     ▼                     ▼
   ┌─────────┐         ┌────────────┐        ┌──────────┐
   │ POST    │         │ Open        │        │ GET      │
   │ /create │    →    │ Payment     │    →   │ /by-table│
   │ PUT     │         │ Modal       │        │ POST/DEL │
   │ /update │         │ Process Pay │        │ items    │
   │ DELETE  │         │ Table=Empty │        └──────────┘
   └─────────┘         └────────────┘
```

## 🍽️ Table Layout by Floor

```
FLOOR A (Tầng 1)
═══════════════════════════════════════════════════════════════
│                                                               │
│  A1   A2   A3   A4   A5   A6   A7   A8   A9   A10           │
│  2S   2S   2S   2S   2S   2S   2S   2S   2S   2S             │
│                                                               │
│  A11  A12  A13  A14  A15  A16  A17  A18  A19  A20           │
│  4S   4S   4S   4S   4S   4S   4S   4S   4S   4S             │
│                                                               │
└───────────────────────────────────────────────────────────────┘

FLOOR B (Tầng 2)
═══════════════════════════════════════════════════════════════
│                                                               │
│  B1   B2   B3   B4   B5   B6   B7   B8   B9   B10  B11 B12   │
│  4S   4S   4S   4S   4S   4S   6S   6S   6S   6S   6S  6S    │
│                                                               │
└───────────────────────────────────────────────────────────────┘

FLOOR C (Tầng 3)
═══════════════════════════════════════════════════════════════
│                                                               │
│  C1   C2   C3   C4   C5   C6   C7   C8                       │
│  2S   2S   2S   2S   4S   4S   4S   4S                       │
│                                                               │
└───────────────────────────────────────────────────────────────┘

Legend:  2S = 2 Seats,  4S = 4 Seats,  6S = 6 Seats
```

## 📊 Component Hierarchy

```
App
└── TableManagement (Page)
    ├── Header
    │   ├── Title (Role-specific)
    │   ├── View Toggle (Manager only)
    │   ├── Add Table Button (Manager only)
    │   └── Statistics Panel
    │       ├── Total Tables
    │       ├── Serving Count
    │       └── Empty Count
    │
    ├── Main Content
    │   └── TableGrid
    │       ├── Floor A Section
    │       │   └── TableCard × 20
    │       ├── Floor B Section
    │       │   └── TableCard × 12
    │       └── Floor C Section
    │           └── TableCard × 8
    │
    └── Modals (Role-based)
        ├── CreateTableModal (Manager)
        │   ├── Form
        │   └── Buttons
        ├── EditTableModal (Manager)
        │   ├── Pre-filled Form
        │   └── Buttons
        ├── DeleteTableConfirmModal (Manager)
        │   ├── Warning Message
        │   └── Confirm Buttons
        ├── CashierPaymentModal (Cashier)
        │   ├── Order Items List
        │   ├── Pricing Summary
        │   └── Payment Button
        └── WaiterOrderModal (Waiter)
            ├── Current Items
            ├── Add Items Dropdown
            ├── Delete Buttons (Conditional)
            └── Order Summary
```

## 🔌 API Endpoint Map

```
┌─────────────────────────────────┐
│   HTTP Request (Frontend)       │
└──────────────┬──────────────────┘
               │
    ┌──────────┴──────────┐
    │                     │
    ▼                     ▼
┌────────────┐    ┌──────────────┐
│ /api/tables│    │ /api/reserv. │
└──────┬─────┘    └──────┬───────┘
       │                 │
   ┌───┴────┬────┬───┐   │
   │        │    │   │   │
   ▼        ▼    ▼   ▼   ▼
  GET     GET  POST PUT DEL  GET
  /all    /:id  /    /:id /:id /by-table/:id
  (List) (One) (Create)  (Update)(Delete)  (Lookup)
   │      │     │     │     │     │
   └──────┴─────┴─────┴─────┴─────┘
           │
    ┌──────▼──────┐
    │  Validation │
    │  & Auth     │
    └──────┬──────┘
           │
    ┌──────▼──────────┐
    │ MongoDB Schema  │
    │  Collections    │
    └─────────────────┘
```

## 🎯 Manager Workflow Diagram

```
Manager Dashboard
│
├─ View Tables (GET /api/tables)
│  └─ Display in Grid (TableGrid)
│
├─ Create Table (POST /api/tables)
│  ├─ Click "Thêm Bàn" Button
│  ├─ Open CreateTableModal
│  ├─ Enter: name, capacity
│  ├─ Validate Input
│  ├─ Submit Form
│  └─ Refresh Table List
│
├─ Edit Table (PUT /api/tables/:id)
│  ├─ Click Edit Button (hover)
│  ├─ Open EditTableModal
│  ├─ Modify: name, capacity
│  ├─ Validate Input
│  ├─ Submit Form
│  └─ Refresh Table List
│
└─ Delete Table (DELETE /api/tables/:id)
   ├─ Click Delete Button (hover)
   ├─ Open DeleteTableConfirmModal
   ├─ Confirm Deletion
   ├─ Send DELETE request
   └─ Refresh Table List
```

## 💳 Cashier Workflow Diagram

```
Cashier Dashboard
│
├─ View Tables (GET /api/tables)
│  └─ Display in Grid (TableGrid, Read-only)
│
└─ Click Table
   ├─ Fetch Reservation (GET /api/reservations/by-table/:id)
   ├─ Open CashierPaymentModal
   ├─ Display:
   │  ├─ Ordered Items (Read-only)
   │  ├─ Item Details (Name, Qty, Price)
   │  ├─ Subtotal Calculation
   │  ├─ Tax Calculation (12%)
   │  └─ Total Amount
   ├─ Click "Thanh Toán Ngay"
   ├─ Open PaymentProcessModal
   ├─ Process Payment
   ├─ Update Table (PUT /api/tables/:id, status='empty')
   └─ Close Modal & Refresh
```

## 👨‍🍳 Waiter Workflow Diagram

```
Waiter Dashboard
│
├─ View Tables (GET /api/tables)
│  └─ Display in Grid (TableGrid, Clickable)
│
└─ Click Table
   ├─ Fetch Reservation (GET /api/reservations/by-table/:id)
   ├─ Open WaiterOrderModal
   ├─ Display Current Items
   │
   ├─ ADD ITEM:
   │  ├─ Click "Thêm Món"
   │  ├─ Select from Menu
   │  ├─ Enter Quantity & Notes
   │  ├─ POST /api/orderitems
   │  └─ Refresh Item List
   │
   ├─ DELETE ITEM (if status='waiting'):
   │  ├─ Click Delete Button
   │  ├─ Confirm Deletion
   │  ├─ DELETE /api/orderitems/:id
   │  └─ Refresh Item List
   │
   ├─ View Item Status:
   │  ├─ ⏳ Waiting (can delete)
   │  ├─ 🍳 Cooking (cannot delete)
   │  └─ ✅ Cooked (cannot delete)
   │
   └─ View Serving Status:
      ├─ ⏱️ Unserved (not yet to customer)
      └─ 🍽️ Served (already to customer)
```

## 🟢 Status Color Coding

```
TABLE STATUS:
┌─────────────────────┐
│  STATUS    │ COLOR  │
├─────────────────────┤
│  Empty     │ ⚪ White  │
│  Serving   │ 🔵 Blue   │
└─────────────────────┘

ITEM STATUS:
┌─────────────────────┐
│  STATUS   │ COLOR   │
├─────────────────────┤
│ Waiting   │ 🟨 Yellow │
│ Cooking   │ 🟠 Orange │
│ Cooked    │ 🟢 Green  │
└─────────────────────┘

SERVING STATUS:
┌─────────────────────┐
│  STATUS   │ COLOR   │
├─────────────────────┤
│ Unserved  │ 🔘 Gray  │
│ Served    │ 🔵 Blue  │
└─────────────────────┘
```

## 📱 Responsive Grid Breakdown

```
MOBILE (< 640px)
┌─────────┐  ┌─────────┐
│  A1     │  │  A2     │
│  (2S)   │  │  (2S)   │
└─────────┘  └─────────┘
5 columns per row

TABLET (640px - 1024px)
┌─────┐  ┌─────┐  ┌─────┐
│ A1  │  │ A2  │  │ A3  │
│(2S) │  │(2S) │  │(2S) │
└─────┘  └─────┘  └─────┘
6 columns per row

DESKTOP (1024px - 1536px)
┌────┐  ┌────┐  ┌────┐  ┌────┐
│A1  │  │A2  │  │A3  │  │A4  │
│(2S)│  │(2S)│  │(2S)│  │(2S)│
└────┘  └────┘  └────┘  └────┘
8 columns per row

LARGE (> 1536px)
┌───┐  ┌───┐  ┌───┐  ┌───┐  ┌───┐
│A1 │  │A2 │  │A3 │  │A4 │  │A5 │
│2S │  │2S │  │2S │  │2S │  │2S │
└───┘  └───┘  └───┘  └───┘  └───┘
10 columns per row
```

## 🔐 Authentication Flow

```
Frontend Request
│
├─ Add JWT Token to Header
│  └─ Authorization: Bearer <TOKEN>
│
▼
Backend Middleware
│
├─ Verify Token
│  ├─ Token Valid? ✅ Continue
│  └─ Token Invalid? ❌ Return 401
│
▼
Route Handler
│
├─ Perform Requested Action
│  ├─ Query Database
│  ├─ Validate Input
│  ├─ Execute Operation
│  └─ Return Response
│
▼
Frontend Receives Response
│
├─ Success? ✅ Update UI
├─ Error? ❌ Show Error Message
└─ Loading? ⏳ Show Spinner
```

## 📈 Data Flow Sequence

```
User Action (Click Table)
       │
       ▼
React State Update
       │
       ├─ setSelectedTable(table)
       ├─ setSelectedReservation(null)
       └─ setIsCashierPaymentOpen(true)
       │
       ▼
API Call
       │
       ├─ GET /api/reservations/by-table/:id
       │  └─ Returns: { orderItems[], customer_name, ... }
       │
       ▼
Update State
       │
       ├─ setSelectedReservation(data)
       │
       ▼
Re-render Modal
       │
       ├─ Pass reservation as prop
       ├─ Fetch orderItems from reservation
       ├─ Calculate totals (subtotal + tax)
       └─ Display payment interface
       │
       ▼
User Action (Process Payment)
       │
       └─ Payment Modal handles transaction
```

## 🎨 Modal Layout Structure

```
All Modals Follow Same Pattern:
┌──────────────────────────────────┐
│  ModalHeader                     │
│  [Icon] Title     [Close Button] │
├──────────────────────────────────┤
│                                  │
│  Content Area (Scrollable)       │
│  - Forms                         │
│  - Lists                         │
│  - Information                   │
│                                  │
├──────────────────────────────────┤
│  [Cancel]  [Submit/Action]       │
│  Footer Buttons                  │
└──────────────────────────────────┘
```

## 🔄 Update Cycle

```
Component Mount
│
├─ useEffect → fetchTables()
│  └─ GET /api/tables
│
▼
Render TableGrid
│
├─ Group by floor (A, B, C)
├─ Display 40 tables
└─ Attach event handlers
│
▼
User Interaction
│
├─ CRUD Operation / View Action
│  │
│  ├─ Submit Form
│  ├─ API Request (POST/PUT/DELETE)
│  ├─ Receive Response
│  │
│  └─ Call fetchTables() again
│
▼
Component Re-render
│
└─ Updated table list displays
```

---

## Summary

This visual architecture shows how:
- **Users** interact with role-specific interfaces
- **Components** are organized hierarchically
- **API** endpoints handle data operations
- **Database** stores persistent state
- **Workflows** differ by role
- **UI** is organized responsively

All diagrams are for conceptual understanding and provide guidance for developers and stakeholders.
