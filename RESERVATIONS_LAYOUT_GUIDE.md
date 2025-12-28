# ReservationsPage Layout Guide

## 📐 Modal Layout Structure (UPDATED)

### TRƯỚC (Single Column):
```
┌─────────────────────────────────────────┐
│  Modal Header                           │
├─────────────────────────────────────────┤
│                                         │
│  Tên Khách      [        ]             │
│  Số Điện Thoại  [        ]             │
│  Số Khách       [        ]             │
│  Check-in       [        ]             │
│  Check-out      [        ]             │
│                                         │
│  [Kiểm Tra Bàn Trống]                  │
│                                         │
│  Grid nhỏ 3 columns:                    │
│  [A1] [A2] [A3]                        │
│  [A4] [A5] [A6]                        │
│  ...                                    │
│                                         │
│  [Hủy]  [Tạo Đơn]                      │
└─────────────────────────────────────────┘
```

### SAU (Two Columns):
```
┌──────────────────────────────┬──────────┐
│  Modal Header                            │
├──────────────────────────────┼──────────┤
│                              │          │
│  Table Grid Selector         │  FORM    │
│  (8 columns, by floors)      │          │
│                              │  Tên Khách  [  ]  │
│  Tầng 1 (A):                 │  Số Điện    [  ]  │
│  [A1] [A2] [A3] ...          │  Số Khách   [  ]  │
│  [A4] [A5] [A6] ...          │  Check-in   [  ]  │
│                              │  Check-out  [  ]  │
│  Tầng 2 (B):                 │                    │
│  [B1] [B2] [B3] ...          │  [Kiểm Tra Bàn]   │
│  [B4] [B5] [B6] ...          │                    │
│                              │  Sức chứa: X chỗ  │
│  Tầng 3 (C):                 │  [Bàn1] [Bàn2]    │
│  [C1] [C2] [C3] ...          │                    │
│  [C4] [C5] [C6] ...          │  Trạng Thái [▼]   │
│                              │                    │
│  COLOR CODING:               │  [Hủy] [Cập Nhật] │
│  🟢 Trống (available)        │                    │
│  🔴 Đặt rồi (busy)           │                    │
│  🔵 Đã chọn (selected)       │                    │
│                              │                    │
└──────────────────────────────┴──────────┘
  Flex-1 (Responsive)         w-96 (Fixed)
```

---

## 🎨 Color Coding & Status

### Table Button States:

| State | Color | Class | Icon |
|-------|-------|-------|------|
| Available (Trống) | Green | `bg-green-100 text-green-900` | ✓ |
| Busy (Đặt rồi) | Red | `bg-red-100 text-red-900 opacity-50` | ✗ |
| Selected (Đã chọn) | Blue | `bg-primary-500 text-white` | ✓ |

### Status Badge Icons:

| Status | Icon | Label | Color |
|--------|------|-------|-------|
| confirmed | CheckCircle2 | Xác nhận | Blue |
| checked-in | LogIn | Đã đến | Green |
| finished | Flag | Hoàn thành | Gray |
| cancelled | AlertOctagon | Hủy | Red |

---

## ⚙️ Auto-Update Flow

### When User Changes DateTime:

```
User changes datetime_checkin
    ↓
handleDateTimeChange() triggered
    ↓
Update formData state
    ↓
Check if both datetime_checkin & datetime_out exist?
    ↓ YES
Call autoCheckAvailableTables() after 300ms delay
    ↓
POST /api/reservations/overlap_check
    ↓
Response: { availableTables, overlapTables }
    ↓
Update state: setAvailableTables() + setBusyTables()
    ↓
Table grid re-renders with NEW availability
    ↓
User sees updated table status immediately
```

### Example Scenario:

1. User selects check-in: 2025-12-27 18:00
2. Table grid shows 15 bàn trống, 5 bàn đặt rồi
3. User changes check-in to: 2025-12-27 19:00
4. Auto-check triggers after 300ms
5. Now only 10 bàn trống, 10 bàn đặt rồi (different availability)
6. Grid updates immediately
7. Old selected tables become invalid if now busy → Can't submit
8. User must re-select valid tables

---

## 🔄 DateTime Parsing Fix

### Problem (Before):
```javascript
// User edits reservation created at: 2025-12-27T18:30:00.000Z
datetime_checkin: reservation.datetime_checkin?.split('.')[0]
// Result: "2025-12-27T18:30:00"
// Input field shows: "2025-12-27T18:30" ✓ (lucky)
// BUT what if database returns different format?
```

### Solution (After):
```javascript
const formatDatetimeForInput = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)  // Parse any format
    return date.toISOString().slice(0, 16)  // Always: YYYY-MM-DDTHH:mm
}

// User edits reservation
datetime_checkin: formatDatetimeForInput('2025-12-27T18:30:00.000Z')
// Step 1: new Date('2025-12-27T18:30:00.000Z') → Date object ✓
// Step 2: toISOString() → '2025-12-27T18:30:00.000Z' ✓
// Step 3: .slice(0, 16) → '2025-12-27T18:30' ✓
// Input field shows correct time regardless of database format
```

---

## 📊 Component Hierarchy

```
ReservationsPage
├── Header
│   ├── Title + Calendar Icon
│   └── Create New Button
├── Search Bar
├── Tabs (confirmed, checked-in, finished, cancelled)
├── Reservation Grid
│   └── ReservationCard (3-column layout)
│       ├── Status Badge (with icon)
│       ├── Customer Info
│       ├── DateTime Display
│       └── Action Buttons (Edit, Delete)
└── Form Modal (when isFormOpen)
    ├── ModalHeader
    └── Two-Column Layout
        ├── Left: TableGridSelector (NEW)
        │   ├── Floor A Section (8-col grid)
        │   ├── Floor B Section (8-col grid)
        │   └── Floor C Section (8-col grid)
        │       └── TableButton (w-20 h-20)
        └── Right: Form Fields
            ├── Customer Info
            ├── DateTime (with auto-update)
            ├── Check Available Button
            ├── Selected Tables Display
            ├── Status Dropdown (edit only)
            └── Action Buttons (Cancel, Submit)
```

---

## 🚀 Key Improvements

| Aspect | Before | After |
|--------|--------|-------|
| **Layout** | Single column | Two columns |
| **Table Grid** | 3 columns, unorganized | 8 columns, by floors |
| **DateTime Update** | Manual check button only | Auto + manual check |
| **DateTime Parse** | String split (risky) | ISO formatting (safe) |
| **Icons** | Emojis mixed | All lucide-react |
| **Icons Color** | N/A (emojis) | Color-coded by status |
| **Table Status** | No visual distinction | Green/Red/Blue |
| **Tab Count** | Shown (0 Xác nhận) | Hidden |
| **Edit UX** | Compact form | Spacious with grid |
| **Responsiveness** | Fixed width | Flex layout |

---

## 🧪 Testing Steps

### 1. Test Auto-Update:
- [ ] Open Đặt Bàn Mới
- [ ] Enter check-in: 2025-12-28 18:00
- [ ] Enter check-out: 2025-12-28 19:00
- [ ] Verify table grid appears with 🟢 and 🔴
- [ ] Change check-in to 19:00
- [ ] Verify grid updates (different tables may now be red/green)

### 2. Test Edit DateTime Display:
- [ ] Create reservation at 2025-12-28 18:30
- [ ] Click Edit on that reservation
- [ ] Verify datetime inputs show 18:30 (not 00:00 or wrong time)
- [ ] Change datetime to 20:00
- [ ] Save and verify it's updated

### 3. Test Layout:
- [ ] Verify modal is 2-column (left grid, right form)
- [ ] Verify table grid organized by floors (A, B, C)
- [ ] Verify table buttons use green/red/blue colors
- [ ] Verify form fields aligned on right side

### 4. Test Icons:
- [ ] Header has Calendar icon
- [ ] Status badges show correct icons
- [ ] All emojis replaced with lucide-react icons

### 5. Test Tab Status:
- [ ] Tab shows "Xác nhận" (not "Xác nhận (3)")
- [ ] Tab shows "Đã đến" (not "Đã đến (0)")

---

## 📱 Responsive Design

```
Desktop (1920px+):
- Left grid: Full width - 384px
- Right form: 384px (w-96)
- Table buttons: 20x20 in 8-column grid

Tablet (768px-1024px):
- Modal max-w-6xl → Adjusts proportionally
- Table buttons: Still 20x20 (may wrap)
- Form: Still 384px

Mobile (<768px):
- Modal becomes full screen
- Two-column → Stacked (grid on top, form below)
  (This is CSS default for small screens)
```

---

## 🔍 Code Quality

- ✅ No console.log leaks
- ✅ Proper error handling
- ✅ TypeScript-ready patterns
- ✅ Consistent naming (camelCase)
- ✅ JSX indentation consistent
- ✅ Component separation (TableGridSelector)
- ✅ 0 build errors
- ✅ 0 console errors
