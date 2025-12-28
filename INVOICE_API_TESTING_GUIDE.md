# Invoice API - Testing Guide

## 🧪 API Test Examples

### Prerequisites
- Backend server running on `http://localhost:3000`
- Frontend running on `http://localhost:5173`
- Authenticated as Cashier user
- JWT token in Authorization header

---

## 1. GET /api/invoices/cashier/unpaid

**Endpoint:** `GET http://localhost:3000/api/invoices/cashier/unpaid`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Unpaid invoices fetched successfully",
  "data": [
    {
      "_id": "65c3d4e5f6g7h8i9j0k1l2m3",
      "customer_name": "Nguyễn Văn A",
      "customer_phone": "0987654321",
      "guest_count": 4,
      "table_name": "Bàn 5",
      "order_items": [
        {
          "_id": "item_001",
          "item": {
            "_id": "menu_001",
            "name": "Cơm chiên dương châu",
            "price": 150000
          },
          "quantity": 2,
          "note": "Không tỏi",
          "status": "cooked",
          "serving_status": "served",
          "price_at_time": 150000
        },
        {
          "_id": "item_002",
          "item": {
            "_id": "menu_002",
            "name": "Canh rau muống",
            "price": 50000
          },
          "quantity": 1,
          "note": "",
          "status": "cooked",
          "serving_status": "served",
          "price_at_time": 50000
        }
      ],
      "subtotal": 350000,
      "tax": 42000,
      "total_amount": 392000,
      "all_items_served": true,
      "payment_status": "unpaid",
      "created_at": "2024-12-28T10:30:00Z"
    },
    {
      "_id": "65c3d4e5f6g7h8i9j0k1l2m4",
      "customer_name": "Trần Thị B",
      "customer_phone": "0912345678",
      "guest_count": 2,
      "table_name": "Bàn 3",
      "order_items": [
        {
          "_id": "item_003",
          "item": {
            "_id": "menu_003",
            "name": "Bún chả Hà Nội",
            "price": 120000
          },
          "quantity": 1,
          "note": "",
          "status": "cooking",
          "serving_status": "unserved",
          "price_at_time": 120000
        }
      ],
      "subtotal": 120000,
      "tax": 14400,
      "total_amount": 134400,
      "all_items_served": false,
      "payment_status": "unpaid",
      "created_at": "2024-12-28T11:15:00Z"
    }
  ],
  "count": 2
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "Failed to fetch unpaid invoices",
  "error": "Connection to database failed"
}
```

**Usage in Frontend:**
```javascript
const response = await apiCall('/api/invoices/cashier/unpaid', {
  method: 'GET'
});

if (response.success) {
  setUnpaidInvoices(response.data);
}
```

---

## 2. GET /api/invoices/cashier/paid

**Endpoint:** `GET http://localhost:3000/api/invoices/cashier/paid`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Paid invoices fetched successfully",
  "data": [
    {
      "_id": "invoice_001",
      "reservation_id": "65c3d4e5f6g7h8i9j0k1l2m3",
      "customer_name": "Nguyễn Văn A",
      "customer_phone": "0987654321",
      "table_name": "Bàn 5",
      "total_amount": 392000,
      "payment_method": "cash",
      "paid_at": "2024-12-28T15:45:00Z",
      "cashier_name": "Lê Thị Thu",
      "payment_status": "paid"
    },
    {
      "_id": "invoice_002",
      "reservation_id": "65c3d4e5f6g7h8i9j0k1l2m5",
      "customer_name": "Phạm Văn C",
      "customer_phone": "0901234567",
      "table_name": "Bàn 8",
      "total_amount": 250000,
      "payment_method": "card",
      "paid_at": "2024-12-28T15:30:00Z",
      "cashier_name": "Lê Thị Thu",
      "payment_status": "paid"
    }
  ],
  "count": 2
}
```

**Notes:**
- Tối đa 20 hóa đơn, sorted by paid_at DESC
- Chỉ trả về hóa đơn đã thanh toán
- Nếu chưa có hóa đơn, trả về empty array

---

## 3. PUT /api/invoices/:reservationId/process-payment

**Endpoint:** `PUT http://localhost:3000/api/invoices/65c3d4e5f6g7h8i9j0k1l2m3/process-payment`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body:**
```json
{
  "payment_method": "cash",
  "total_price": 392000
}
```

**Response (200 OK - Success):**
```json
{
  "success": true,
  "message": "Thanh toán thành công",
  "data": {
    "invoice": {
      "_id": "65c3d4e5f6g7h8i9j0k1l2m10",
      "reservation": "65c3d4e5f6g7h8i9j0k1l2m3",
      "total_price": 392000,
      "payment_method": "cash",
      "paid_at": "2024-12-28T15:45:23Z",
      "cashier": "65c3d4e5f6g7h8i9j0k1l2m99"
    },
    "reservation": {
      "_id": "65c3d4e5f6g7h8i9j0k1l2m3",
      "customer_name": "Nguyễn Văn A",
      "status": "finished",
      "datetime_out": "2024-12-28T15:45:23Z"
    }
  }
}
```

**Response (400 - Validation Error):**
```json
{
  "success": false,
  "message": "Không thể thanh toán khi chưa phục vụ hết các món",
  "error": "Item status_serving is 'unserved'"
}
```

**Response (404 - Not Found):**
```json
{
  "success": false,
  "message": "Reservation not found"
}
```

**Payment Method Options:**
```
- "cash" (Tiền mặt)
- "card" (Thẻ tín dụng)
- "bank" (Chuyển khoản)
- "ewallet" (Ví điện tử)
```

**Usage in Frontend:**
```javascript
const handlePayment = async (reservationId, paymentMethod, totalAmount) => {
  try {
    const response = await apiCall(
      `/api/invoices/${reservationId}/process-payment`,
      {
        method: 'PUT',
        body: JSON.stringify({
          payment_method: paymentMethod,
          total_price: totalAmount
        })
      }
    );

    if (response.success) {
      // Show success message
      setShowSuccess(true);
      setTimeout(() => {
        onClose();
        onPaymentSuccess();
      }, 2000);
    } else {
      // Show error
      setError(response.message);
    }
  } catch (err) {
    setError(err.message);
  }
};
```

---

## 🧪 Test Scenarios with cURL

### Test 1: Get Unpaid Invoices
```bash
curl -X GET http://localhost:3000/api/invoices/cashier/unpaid \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### Test 2: Get Paid Invoices
```bash
curl -X GET http://localhost:3000/api/invoices/cashier/paid \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### Test 3: Process Payment (Success)
```bash
curl -X PUT http://localhost:3000/api/invoices/65c3d4e5f6g7h8i9j0k1l2m3/process-payment \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "payment_method": "cash",
    "total_price": 392000
  }'
```

### Test 4: Process Payment (Fail - Not All Served)
```bash
curl -X PUT http://localhost:3000/api/invoices/65c3d4e5f6g7h8i9j0k1l2m4/process-payment \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "payment_method": "cash",
    "total_price": 134400
  }'
# Expected: 400 error with message about unserved items
```

---

## 📊 Data Flow in Testing

### Scenario: Complete Payment Flow

**Step 1: Waiter adds items**
```
POST /api/orderitems
→ Creates OrderItem with status: "waiting", serving_status: "unserved"
```

**Step 2: Chef cooks and marks done**
```
PUT /api/orderitems/:id
→ Updates status: "cooked"
```

**Step 3: Waiter serves the dish**
```
PUT /api/orderitems/:id
→ Updates serving_status: "served"
```

**Step 4: Cashier sees it ready**
```
GET /api/invoices/cashier/unpaid
→ Returns invoice with all_items_served: true
```

**Step 5: Cashier processes payment**
```
PUT /api/invoices/:reservationId/process-payment
→ Creates Invoice
→ Updates Reservation status: "finished"
```

**Step 6: Invoice appears in history**
```
GET /api/invoices/cashier/paid
→ Shows paid invoice with latest timestamp
```

---

## 🔍 Expected Field Validations

### process-payment Request Validation
```javascript
{
  payment_method: {
    required: true,
    type: "string",
    enum: ["cash", "card", "bank", "ewallet"]
  },
  total_price: {
    required: true,
    type: "number",
    min: 0
  }
}
```

### Reservation Status Check
```javascript
Required: reservation.status in ["confirmed", "checked-in"]
// For fetching unpaid invoices
```

### OrderItem Serving Status Check
```javascript
Required: ALL orderItems.serving_status === "served"
// Before allowing payment
```

---

## ⏱️ Performance Metrics

### Expected Response Times
| Endpoint | Expected Time | Notes |
|----------|---------------|-------|
| GET /cashier/unpaid | < 500ms | May include multiple joins |
| GET /cashier/paid | < 300ms | Limited to 20 records |
| PUT /process-payment | < 1000ms | Includes DB write + validation |

### Load Testing
```bash
# Load test with 100 requests
wrk -t4 -c100 -d30s \
  -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/invoices/cashier/unpaid
```

---

## 🐛 Debug Mode

Enable detailed logging:

**Frontend (InvoicePage.jsx):**
```javascript
const fetchInvoices = async () => {
  console.log('[INVOICE] Fetching unpaid and paid invoices...');
  try {
    const [unpaidRes, paidRes] = await Promise.all([
      apiCall('/api/invoices/cashier/unpaid', { method: 'GET' }),
      apiCall('/api/invoices/cashier/paid', { method: 'GET' })
    ]);
    
    console.log('[INVOICE] Unpaid response:', unpaidRes);
    console.log('[INVOICE] Paid response:', paidRes);
    
    if (unpaidRes.success) {
      console.log('[INVOICE] Unpaid count:', unpaidRes.data.length);
      setUnpaidInvoices(unpaidRes.data || []);
    }
    if (paidRes.success) {
      console.log('[INVOICE] Paid count:', paidRes.data.length);
      setPaidInvoices(paidRes.data || []);
    }
  } catch (err) {
    console.error('[INVOICE] Error:', err);
    setError(err.message);
  }
};
```

**Backend (invoices.js):**
```javascript
router.get('/cashier/unpaid', async (req, res) => {
  console.log('[API] GET /cashier/unpaid');
  try {
    // ... query logic ...
    console.log('[API] Found unpaid invoices:', invoiceData.length);
    res.json({
      success: true,
      data: invoiceData,
      count: invoiceData.length
    });
  } catch (error) {
    console.error('[API] Error fetching unpaid invoices:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
```

---

## ✅ Checklist Before Going Live

- [ ] All API endpoints respond correctly
- [ ] All error cases handled
- [ ] Frontend displays data properly
- [ ] Payment flow works end-to-end
- [ ] Auto-refresh works
- [ ] Modal opens/closes smoothly
- [ ] Success message displays
- [ ] Reservation status updates to "finished"
- [ ] Hóa đơn appears in paid list
- [ ] Performance is acceptable
- [ ] No console errors
- [ ] Responsive on mobile/tablet/desktop

---

**Last Updated:** 28/12/2024  
**API Version:** 1.0
