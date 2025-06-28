import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { addOrder, readOrders } from './orders.js';

const app = express();
app.use(cors());
app.use(express.json());

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '../public');
app.use(express.static(publicDir));

const USERS = [
  { username: 'admin', password: '123456' }
];

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = USERS.find(u => u.username === username && u.password === password);
  if (user) {
    return res.json({ message: 'Đăng nhập thành công' });
  }
  res.status(401).json({ error: 'Sai thông tin đăng nhập' });
});

app.get('/login', (req, res) => {
  res.sendFile('login.html', { root: publicDir });
});

app.post('/orders', async (req, res) => {
  const order = req.body;
  if (!order.customerName || !order.customerPhone || !order.customerStaffId || !order.items) {
    return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
  }
  await addOrder(order);
  res.json({ message: 'Đơn hàng được ghi nhận thành công' });
});

app.get('/orders', async (req, res) => {
  const orders = await readOrders();
  res.json(orders);
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: publicDir });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server chạy trên http://localhost:${PORT}`);
});
