import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
import { readOrders, addOrder } from './orders.ts';
import { readMenu, addMenuItem, updateMenuItem, deleteMenuItem } from './menu.ts';
import { readFeedback, addFeedback } from './feedback.ts';
import { readUsers, addUser, deleteUser, findUser } from './users.ts';

// Load environment variables from .env if present
try {
  const envPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '../.env');
  const data = await fs.readFile(envPath, 'utf8');
  for (const line of data.split(/\r?\n/)) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  }
} catch {}

const ADMIN_USER = process.env.APP_USER || 'admin';
const ADMIN_PASS = process.env.APP_PASS || 'admin@123';
const PORT = process.env.PORT || 3001;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '../public');

const app = express();
app.use(express.json());
app.use(express.static(publicDir, {
  setHeaders(res, filePath) {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.jsx')) {
      res.type('application/javascript');
    }
  }
}));

// Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Thiếu tên hoặc mật khẩu' });
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    return res.json({ role: 'admin' });
  }
  const found = await findUser(username.trim(), password.trim());
  if (found) {
    return res.json({ role: 'user', username: found.username, code: found.code, fullName: found.fullName });
  }
  return res.status(401).json({ error: 'Sai thông tin đăng nhập' });
});

// Users
app.get('/users', async (_req, res) => {
  const users = await readUsers();
  res.json(users.map(u => ({ username: u.username, code: u.code, fullName: u.fullName })));
});

app.post('/users', async (req, res) => {
  const { username, password, code, fullName } = req.body;
  if (!username || !password || !code || !fullName) return res.status(400).json({ error: 'Thiếu thông tin' });
  const user = await addUser({ username: username.trim(), password: password.trim(), code: code.trim(), fullName: fullName.trim() });
  if (!user) return res.status(409).json({ error: 'Người dùng đã tồn tại' });
  res.json({ username: user.username, code: user.code, fullName: user.fullName });
});

app.delete('/users/:name', async (req, res) => {
  await deleteUser(req.params.name);
  res.json({});
});

// Orders
app.get('/orders', async (_req, res) => {
  const orders = await readOrders();
  res.json(orders);
});

app.post('/orders', async (req, res) => {
  const order = req.body;
  if (!order.items) return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
  await addOrder(order);
  res.json({ message: 'Đơn hàng được ghi nhận thành công' });
});

// Menu
app.get('/menu', async (_req, res) => {
  const menu = await readMenu();
  res.json(menu);
});

app.post('/menu', async (req, res) => {
  const item = await addMenuItem(req.body);
  res.json(item);
});

app.put('/menu/:id', async (req, res) => {
  const updated = await updateMenuItem(parseInt(req.params.id), req.body);
  if (!updated) return res.status(404).json({ error: 'Not found' });
  res.json(updated);
});

app.delete('/menu/:id', async (req, res) => {
  await deleteMenuItem(parseInt(req.params.id));
  res.json({});
});

// Feedback
app.get('/feedback', async (_req, res) => {
  const list = await readFeedback();
  res.json(list);
});

app.post('/feedback', async (req, res) => {
  await addFeedback(req.body);
  res.json({ message: 'ok' });
});

// Fallback to index.html for other routes
app.get('*', (_req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server chạy trên http://localhost:${PORT}`);
});
