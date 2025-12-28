## 🎯 Quick Start: Giao Món & Gọi Món Pages

### For Waiter - Giao Món (Delivery/Serving)
**URL**: `http://localhost:5173/delivery`

**What You See**:
- 📊 4 sections of orders:
  1. 🟡 **Chưa Phục Vụ** (Not Served) - needs to be served
  2. ✅ **Đã Phục Vụ** (Served) - already served (max 20 recent)
  3. 🍳 **Đang Nấu** (Cooking) - in kitchen
  4. ⏳ **Chờ Nấu** (Waiting) - pending

**What You Can Do**:
1. See all orders with item name, table, quantity, photo
2. Click the status button on any unserved item
3. Select "Đã Phục Vụ" to mark as served
4. Served items auto-disappear from "Chưa Phục Vụ" section after 5 seconds
5. Click "Làm Mới" to refresh immediately

**Typical Workflow**:
1. Check "Chưa Phục Vụ" section first
2. Pick up dishes from kitchen
3. Click status → "Đã Phục Vụ"
4. Serve to customer
5. Item appears in "Đã Phục Vụ" (recent 20 only)

---

### For Chef - Gọi Món (Kitchen Orders)
**URL**: `http://localhost:5173/kitchen`

**What You See**:
- 📊 3 sections of orders:
  1. ⏳ **Chờ Nấu** (Waiting - PRIORITY ⚠️)
  2. 🍳 **Đang Nấu** (Cooking)
  3. ✅ **Đã Nấu Xong** (Done - max 20 recent)

**What You Can Do**:
1. See all orders waiting to be cooked
2. Click status button on waiting item
3. Select "Đang Nấu" to start cooking
4. When done, click → "Đã Nấu Xong"
5. Item appears in done section (recent 20 only)
6. Waiter can then take from done section

**Typical Workflow**:
1. Check "Chờ Nấu" section (focus here!)
2. Click item → change to "Đang Nấu"
3. Cook the dish
4. Click item → change to "Đã Nấu Xong"
5. Waiter picks up from done section

---

## 🔐 Access Control

| Role | Waiter | Chef | Manager |
|------|--------|------|---------|
| `/delivery` | ✅ Yes | ❌ No | ❌ No |
| `/kitchen` | ❌ No | ✅ Yes | ❌ No |

**Wrong role? You'll be redirected to home page.**

---

## 🎨 UI Features

### Cards Display
Each order item shows:
- **Photo**: Dish image thumbnail
- **Qty Badge**: Top-right corner (white on black)
- **Name**: Dish name
- **Table**: Which table ordered this
- **Time**: When ordered (HH:MM:SS)
- **Note**: Any special instructions (if exists)
- **Status**: Color-coded dropdown

### Status Colors
- 🟡 Yellow = Waiting / Not Served
- 🍊 Orange = Cooking
- 🟢 Green = Done / Served
- 🔵 Blue = Already Served

### Responsive Layout
- 📱 1 column on phone
- 📱 2 columns on small tablet
- 💻 3 columns on tablet
- 🖥️ 4 columns on desktop

---

## ⚡ Real-Time Updates

✅ **Auto-refresh every 5 seconds**
- Data automatically updates
- No need to manually refresh
- See new orders instantly

✅ **Manual refresh button**
- Click "Làm Mới" anytime
- Useful for immediate updates
- Show loading spinner

---

## 🆘 Troubleshooting

### "Page not loading"
- Check you're logged in (look at sidebar)
- Check your role (manager → go to staff management)
- Try refreshing page (F5)

### "No orders showing"
- Check if there are actually orders
- Try manual refresh button
- Check table section for new orders

### "Status change not working"
- Check internet connection
- Verify dropdown is showing options
- Try again after few seconds

### "Can't access /delivery or /kitchen"
- You don't have the right role
- Contact manager to update your role
- Clear browser cache and retry login

---

## 📝 Common Tasks

### Waiter: Mark Order as Served
1. Look at 🟡 "Chưa Phục Vụ" section
2. Find your order card
3. Click the yellow status button
4. Select "Đã Phục Vụ"
5. ✅ Done! Item now in "Đã Phục Vụ" section

### Chef: Start Cooking
1. Look at ⏳ "Chờ Nấu" section (has red banner)
2. Find the item to cook
3. Click the yellow status button
4. Select "Đang Nấu"
5. ✅ Item moves to 🍳 "Đang Nấu" section

### Chef: Mark Dish As Done
1. Find item in 🍳 "Đang Nấu" section
2. Click the orange status button
3. Select "Đã Nấu Xong"
4. ✅ Item moves to ✅ "Đã Nấu Xong" section
5. Waiter can now pick up

---

## 📊 Data You See

### On Each Card
```
[Image]
  Số Lượng: 2
  
Tên Món Ăn
Bàn: 5
⏰ 14:35:42
  
[Status Dropdown]
[Optional: Ghi chú ...]
```

### In Each Section
- 🟡 **Chưa Phục Vụ**: Items cooked but not served (waiter view)
- ✅ **Đã Phục Vụ**: Recent served items, max 20 (waiter view)
- 🍳 **Đang Nấu**: Items being cooked (both views)
- ⏳ **Chờ Nấu**: Items waiting to be cooked (both views)
- ✅ **Đã Nấu Xong**: Recent done items, max 20 (chef view)

---

## 💡 Pro Tips

1. **Mobile/Tablet Mode**
   - Rotate to landscape for more items
   - Grid adapts to screen size

2. **Multiple Orders**
   - Scroll down to see more
   - Each card independent
   - Change status anytime

3. **Special Instructions**
   - Look for 📌 note icon on card
   - Shows any special requests
   - Read before serving/cooking

4. **Stuck Loading?**
   - Click "Làm Mới" button
   - Wait 5 seconds for auto-refresh
   - Check if network is connected

5. **Fast Workflow**
   - Just click dropdown → select → done
   - No form to fill
   - Instant status updates

---

## 🔄 Typical Restaurant Flow

```
Customer Orders (at table)
       ↓
Waiter inputs in /orders page
       ↓
Chef sees in ⏳ /kitchen page
       ↓
Chef changes: waiting → cooking → done
       ↓
Waiter sees in ✅ /delivery page
       ↓
Waiter picks up & serves
       ↓
Waiter marks: unserved → served
       ↓
Order complete!
```

---

## 📱 Keyboard Shortcuts (Future)
*Currently not implemented, but planned:*
- `S` = Mark as served (waiter)
- `C` = Mark as cooking (chef)
- `D` = Mark as done (both)
- `R` = Refresh

---

## 🎬 Video Walkthrough (Text Version)

### Waiter Workflow (30 seconds)
1. Login as waiter
2. Click "Giao Món" in sidebar
3. See orders in 4 sections
4. Click yellow button on unserved item
5. Select "Đã Phục Vụ"
6. ✅ Done - item updates

### Chef Workflow (30 seconds)
1. Login as chef
2. Click "Gọi Món" in sidebar
3. See orders in 3 sections (waiting has priority!)
4. Click yellow button on waiting item
5. Select "Đang Nấu"
6. Cook the dish
7. Click orange button
8. Select "Đã Nấu Xong"
9. ✅ Waiter can pickup

---

**Last Updated**: 2024
**Version**: 1.0
**Status**: Ready for Production ✅
