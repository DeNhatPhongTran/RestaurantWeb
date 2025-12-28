## ✅ Deployment Checklist: Giao Món & Gọi Món

### Pre-Deployment (Development)

#### Backend Setup
- [x] Added 2 new endpoints to `orderitems.js`:
  - [x] `GET /api/orderitems/waiter/delivery`
  - [x] `GET /api/orderitems/chef/orders`
- [x] Both endpoints:
  - [x] Populate MenuItem details (name, price, image, category)
  - [x] Fetch table names from ReservationTable
  - [x] Sort by ordered_at ascending
  - [x] Limit served/cooked items to 20
  - [x] Include error handling
- [x] verifyToken middleware present on endpoints (inherited from router setup)

**Test Backend**:
```bash
# Terminal 1: Start backend
cd backend
npm install
npm start

# Terminal 2: Test endpoints
curl http://localhost:3001/api/orderitems/waiter/delivery
curl http://localhost:3001/api/orderitems/chef/orders
```

#### Frontend Setup
- [x] Created 3 new components:
  - [x] `OrderItemCard.jsx` (shared grid card)
  - [x] `StaffDelivery.jsx` (waiter page at `/delivery`)
  - [x] `KitchenOrder.jsx` (chef page at `/kitchen`)
- [x] Routes added to `App.jsx`:
  - [x] `/delivery` route with waiter protection
  - [x] `/kitchen` route with chef protection
- [x] Navigation updated in `rolePermissions.js`:
  - [x] Waiter: Added "Giao Món" menu item
  - [x] Chef: Added "Gọi Món" menu item
  - [x] Added `/delivery` to waiter allowedRoutes
  - [x] Added `/kitchen` to chef allowedRoutes

**Test Frontend**:
```bash
# Terminal 1: Start backend
cd backend
npm start

# Terminal 2: Start frontend
cd _frontend
npm install
npm run dev

# Then test URLs:
# http://localhost:5173/delivery (waiter)
# http://localhost:5173/kitchen (chef)
```

---

### Database Verification

#### Required MongoDB Collections
- [x] `users` - with roles (waiter, chef)
- [x] `orders` or `orderitems` - with fields: status, serving_status, item, reservation, ordered_at
- [x] `menuitems` - with fields: name, price, image, category
- [x] `reservations` - with field: orderItems array
- [x] `reservationtables` - linking reservation to table

**Verify Data**:
```javascript
// Check sample data exists
db.users.findOne({ "role.role_name": "waiter" })
db.users.findOne({ "role.role_name": "chef" })
db.orderitems.find({ status: { $in: ["waiting", "cooking", "cooked"] } }).limit(1)
```

---

### Frontend Testing

#### Authentication & Access Control
- [ ] Login as **waiter**
  - [ ] Sidebar shows "Giao Món" link
  - [ ] Can navigate to `/delivery`
  - [ ] Cannot access `/kitchen` (redirected to home)
  
- [ ] Login as **chef**
  - [ ] Sidebar shows "Gọi Món" link
  - [ ] Can navigate to `/kitchen`
  - [ ] Cannot access `/delivery` (redirected to home)

- [ ] Login as **manager/cashier**
  - [ ] Neither `/delivery` nor `/kitchen` in sidebar
  - [ ] Cannot access either route (redirected to home)

- [ ] Not logged in (guest)
  - [ ] No protected routes accessible
  - [ ] Redirected to login page

#### Waiter Page (`/delivery`)

**Page Load**:
- [ ] Page title shows "Giao Món"
- [ ] Subtitle shows "Quản lý phục vụ đơn hàng"
- [ ] Header is sticky (doesn't scroll away)
- [ ] "Làm Mới" (Refresh) button visible
- [ ] No console errors

**Section Display**:
- [ ] All 4 sections visible:
  - [ ] 🟡 Chưa Phục Vụ (Not Served)
  - [ ] ✅ Đã Phục Vụ (Served)
  - [ ] 🍳 Đang Nấu (Cooking)
  - [ ] ⏳ Chờ Nấu (Waiting)
- [ ] Each section shows item count: "(5)"
- [ ] Empty sections show: "Không có món trong danh mục này"

**Grid Layout**:
- [ ] Cards display in responsive grid:
  - [ ] Mobile: 1 column
  - [ ] Tablet: 2-3 columns
  - [ ] Desktop: 4 columns
- [ ] Proper spacing between cards
- [ ] No horizontal scroll

**Card Content**:
- [ ] Each card shows:
  - [ ] Dish image
  - [ ] Quantity badge (top-right)
  - [ ] Dish name
  - [ ] "Bàn: X" (table name)
  - [ ] Time stamp (HH:MM:SS)
  - [ ] Status button (color-coded)
  - [ ] Notes (if any)
- [ ] Images load correctly
- [ ] No broken image placeholders

**Status Updates**:
- [ ] Click unserved item status button
- [ ] Dropdown shows options (unserved, served)
- [ ] Click "Đã Phục Vụ" (Served)
- [ ] Button shows loading state
- [ ] Card moves to "Đã Phục Vụ" section after update
- [ ] Total count updates in section header

**Auto-Refresh**:
- [ ] Page auto-refreshes every ~5 seconds
- [ ] New orders appear automatically
- [ ] No manual intervention needed
- [ ] Smooth transitions (no page flicker)

**Manual Refresh**:
- [ ] Click "Làm Mới" button
- [ ] Spinner appears
- [ ] Data reloads
- [ ] Button becomes enabled again

#### Chef Page (`/kitchen`)

**Page Load**:
- [ ] Page title shows "Gọi Món"
- [ ] Subtitle shows "Quản lý nấu ăn"
- [ ] Header is sticky
- [ ] "Làm Mới" button visible
- [ ] No console errors

**Section Display**:
- [ ] All 3 sections visible:
  - [ ] ⏳ Chờ Nấu (Waiting)
  - [ ] 🍳 Đang Nấu (Cooking)
  - [ ] ✅ Đã Nấu Xong (Done)
- [ ] Waiting section has red "⚠️ ƯU TIÊN" (PRIORITY) badge
- [ ] Item counts shown: "(10)"
- [ ] Empty sections show: "Không có món trong danh mục này"

**Grid Layout**:
- [ ] Responsive grid same as waiter page
- [ ] Cards evenly spaced
- [ ] No layout issues

**Card Content**: (Same as waiter)
- [ ] Image, quantity, name, table, time, status
- [ ] Notes display if present

**Status Updates**:
- [ ] Click waiting item status
- [ ] Dropdown shows: waiting, cooking, cooked
- [ ] Select "Đang Nấu"
- [ ] Item moves to "Đang Nấu" section
- [ ] Select "Đã Nấu Xong"
- [ ] Item moves to "Đã Nấu Xong" section

**Performance**:
- [ ] No more than 20 items in "Đã Nấu Xong"
- [ ] Page loads quickly
- [ ] Scrolling smooth
- [ ] No lag when updating status

---

### Error Handling

#### Network Errors
- [ ] Disconnect internet
- [ ] Try to load page → error message appears
- [ ] Try to update status → error message appears
- [ ] Reconnect → page works again
- [ ] No crash or blank page

#### Missing Data
- [ ] Item with no table name shows "N/A"
- [ ] Item with no image shows default placeholder
- [ ] Item with no note shows no note section
- [ ] No console errors for missing fields

#### API Errors
- [ ] API timeout → error displayed
- [ ] Invalid token → redirect to login
- [ ] Server error (500) → error message displayed
- [ ] Unauthorized (401) → redirect to login

---

### Performance Testing

#### Load Testing
- [ ] 1-5 items: Instant load ✓
- [ ] 10-20 items: < 1 second ✓
- [ ] 50+ items: < 2 seconds (with capping) ✓
- [ ] No network waterfall requests

#### Browser DevTools
- [ ] Open DevTools (F12)
- [ ] Network tab: Check API response times
- [ ] Console: No errors or warnings
- [ ] Performance: Timeline shows smooth 60 FPS
- [ ] Memory: No leaks on auto-refresh

#### Mobile Performance
- [ ] Test on iPhone (Safari)
- [ ] Test on Android (Chrome)
- [ ] Touch interactions smooth
- [ ] Cards readable on small screens
- [ ] Dropdown works on touch devices

---

### Integration Testing

#### Multi-Role Workflow
- [ ] Chef cooking item (waiting → cooking → done)
- [ ] Waiter picking up (in done section)
- [ ] Waiter marking served (unserved → served)
- [ ] All items properly updated on both pages
- [ ] Data consistency maintained

#### Simultaneous Users
- [ ] Open `/delivery` in one window
- [ ] Open `/kitchen` in another window
- [ ] Update status in chef view
- [ ] Waiter view updates automatically
- [ ] Update status in waiter view
- [ ] Both pages stay in sync

#### Navigation Flow
- [ ] Waiter: Home → Giao Món → Sidebar click works
- [ ] Chef: Home → Gọi Món → Sidebar click works
- [ ] Can switch between pages multiple times
- [ ] Sidebar updates active state correctly
- [ ] Back button works

---

### UI/UX Testing

#### Visual Design
- [ ] Colors match design spec
- [ ] Font sizes readable
- [ ] Icons displayed correctly
- [ ] Emoji badges show properly
- [ ] Consistent spacing throughout
- [ ] No broken layouts

#### Responsive Design
- [ ] **320px (mobile)**: 1 column, text fits, buttons tappable
- [ ] **768px (tablet)**: 2-3 columns, readable
- [ ] **1024px (desktop)**: 4 columns, optimal
- [ ] **1440px (large)**: Still 4 columns, good spacing
- [ ] No horizontal scroll on any size

#### Accessibility
- [ ] Buttons have clear focus state
- [ ] Dropdown keyboard navigation works
- [ ] Screen reader friendly (basic test)
- [ ] Sufficient color contrast
- [ ] No WCAG violations critical

---

### Documentation Verification

- [ ] Implementation doc exists: `STAFFDELIVERY_KITCHENORDER_IMPLEMENTATION.md`
- [ ] Quick start guide exists: `STAFFDELIVERY_KITCHENORDER_QUICK_START.md`
- [ ] All code commented
- [ ] README updated with new pages
- [ ] API endpoints documented

---

### Deployment Steps

#### Step 1: Backend Deployment
```bash
# 1. SSH to production server
ssh user@restaurant-server.com

# 2. Navigate to backend directory
cd /app/RestaurantWeb/backend

# 3. Pull latest changes
git pull origin main

# 4. Install dependencies (if any new)
npm install

# 5. Test endpoints
curl https://api.restaurant.com/api/orderitems/waiter/delivery

# 6. Verify no errors in logs
tail -f logs/app.log
```

#### Step 2: Frontend Deployment
```bash
# 1. Navigate to frontend directory
cd /app/RestaurantWeb/_frontend

# 2. Pull latest changes
git pull origin main

# 3. Install dependencies
npm install

# 4. Build for production
npm run build

# 5. Deploy build to web server
# (copy dist/ to /var/www/restaurant-app/)

# 6. Verify build
curl https://restaurant.com/delivery
```

#### Step 3: Verification
```bash
# 1. Check both pages load
# Waiter: https://restaurant.com/delivery
# Chef: https://restaurant.com/kitchen

# 2. Check status updates work
# Test clicking dropdown and changing status

# 3. Check auto-refresh works
# Wait 5 seconds, see data refresh

# 4. Check no console errors
# Open DevTools, check console

# 5. Check API calls working
# DevTools → Network tab → verify GET requests
```

---

### Rollback Plan (If Issues)

**If page won't load**:
1. Revert App.jsx changes
2. Revert rolePermissions.js changes
3. Restart frontend server
4. Check browser cache (Ctrl+Shift+Delete)

**If API calls fail**:
1. Check backend logs: `tail -f logs/app.log`
2. Verify endpoints are correct in code
3. Check database connection
4. Restart backend server: `npm restart`

**If performance issues**:
1. Check API response times (DevTools → Network)
2. Verify database indexes on OrderItem collection
3. Check server CPU/memory usage
4. Consider implementing Redis caching

---

### Post-Deployment

#### Monitoring
- [ ] Check error logs for 24 hours: `/var/log/app.log`
- [ ] Monitor API response times
- [ ] Check database query performance
- [ ] Get user feedback from waiter/chef

#### User Training
- [ ] Training session for waiters (15 min)
  - [ ] Navigate to `/delivery`
  - [ ] Mark items as served
  - [ ] Understand sections
  
- [ ] Training session for chefs (15 min)
  - [ ] Navigate to `/kitchen`
  - [ ] Update status progression
  - [ ] Understand priority section

#### Documentation
- [ ] Share Quick Start guide with team
- [ ] Post troubleshooting guide in break room
- [ ] Provide support contact number

---

### Metrics to Track (Week 1)

- [ ] User adoption rate: __% of waiters using `/delivery`
- [ ] User adoption rate: __% of chefs using `/kitchen`
- [ ] API response time: __ ms average
- [ ] Error rate: __% of requests
- [ ] User satisfaction: __ / 5 stars
- [ ] Time to mark order: __ seconds average
- [ ] Auto-refresh reliability: __% working

---

### Sign-Off

| Role | Name | Date | Status |
|------|------|------|--------|
| **Developer** | __________ | ______ | ⬜ |
| **QA** | __________ | ______ | ⬜ |
| **Manager** | __________ | ______ | ⬜ |
| **DevOps** | __________ | ______ | ⬜ |

---

**Status**: Ready for Deployment ✅
**Version**: 1.0
**Last Updated**: 2024

---

## Emergency Contacts

**Developer**: [Phone/Slack]
**DevOps**: [Phone/Slack]  
**Manager**: [Phone/Slack]

**Escalation**: Contact manager immediately if critical issues found
