const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const ORDERS_FILE = path.join(__dirname, 'orders.json');

// Hàm đọc orders từ file
function readOrders() {
  if (!fs.existsSync(ORDERS_FILE)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
}

// Hàm ghi orders ra file
function writeOrders(data) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// Route để tạo đơn hàng mới
app.post('/orders', (req, res) => {
  const order = req.body;

  if (!order.customerName || !order.customerPhone || !order.customerStaffId || !order.items) {
    return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
  }

  const orders = readOrders();
  orders.push({
    id: order.id,
    time: order.time,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    customerStaffId: order.customerStaffId,
    specialRequest: order.specialRequest || "",
    items: order.items,
    total: order.total,
    paymentMethod: order.paymentMethod,
    createdAt: new Date().toISOString()
  });
  writeOrders(orders);

  res.json({ message: 'Đơn hàng được ghi nhận thành công' });
});

// Route để xem toàn bộ đơn hàng
app.get('/orders', (req, res) => {
  const orders = readOrders();
  res.json(orders);
});

app.listen(3001, () => {
  console.log('✅ Server chạy trên http://localhost:3001');
});
