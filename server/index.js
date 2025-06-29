import http from 'http';
import { promises as fs, existsSync } from 'fs';
import { join } from 'path';
import { URL } from 'url';

const PORT = process.env.PORT || 3001;
const DATA_DIR = join('.', 'data');
const ORDERS_FILE = join(DATA_DIR, 'orders.json');
const USERS_FILE = join(DATA_DIR, 'users.json');

async function readJson(file, fallback = []) {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch {
    return fallback;
  }
}

async function writeJson(file, data) {
  await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf8');
}

async function ensureAdmin() {
  const users = await readJson(USERS_FILE);
  if (!users.find(u => u.username === 'admin')) {
    users.push({ id: 1, username: 'admin', password: 'admin@123', role: 'admin' });
    await writeJson(USERS_FILE, users);
  }
  if (!existsSync(ORDERS_FILE)) {
    await writeJson(ORDERS_FILE, []);
  }
}

function send(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(body);
}

async function parseBody(req) {
  return new Promise(resolve => {
    let data = '';
    req.on('data', chunk => (data += chunk));
    req.on('end', () => {
      try { resolve(JSON.parse(data)); }
      catch { resolve(null); }
    });
  });
}

async function handler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  if (req.method === 'POST' && url.pathname === '/signup') {
    const user = await parseBody(req);
    if (!user || !user.username || !user.password) {
      send(res, 400, { error: 'Thiếu thông tin' });
      return;
    }
    const users = await readJson(USERS_FILE);
    if (users.some(u => u.username === user.username)) {
      send(res, 400, { error: 'Tài khoản đã tồn tại' });
      return;
    }
    const id = users.reduce((m, u) => Math.max(m, u.id || 0), 0) + 1;
    users.push({ id, username: user.username, password: user.password, role: 'user' });
    await writeJson(USERS_FILE, users);
    send(res, 200, { message: 'Đăng ký thành công' });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/login') {
    const user = await parseBody(req);
    if (!user) { send(res, 400, { error: 'Thiếu thông tin' }); return; }
    const users = await readJson(USERS_FILE);
    const found = users.find(u => u.username === user.username && u.password === user.password);
    if (!found) {
      send(res, 401, { error: 'Sai thông tin đăng nhập' });
    } else {
      send(res, 200, { id: found.id, username: found.username, role: found.role });
    }
    return;
  }

  if (req.method === 'POST' && url.pathname === '/orders') {
    const order = await parseBody(req);
    if (!order || !order.customerName || !order.customerPhone || !order.customerStaffId || !order.items) {
      send(res, 400, { error: 'Thiếu thông tin bắt buộc' });
      return;
    }
    const orders = await readJson(ORDERS_FILE);
    orders.push({
      id: order.id,
      time: order.time,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerStaffId: order.customerStaffId,
      specialRequest: order.specialRequest || '',
      items: order.items,
      total: order.total,
      paymentMethod: order.paymentMethod,
      createdAt: new Date().toISOString(),
    });
    await writeJson(ORDERS_FILE, orders);
    send(res, 200, { message: 'Đơn hàng được ghi nhận thành công' });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/orders') {
    const orders = await readJson(ORDERS_FILE);
    send(res, 200, orders);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
  res.end('Not Found');
}

ensureAdmin().then(() => {
  http.createServer(handler).listen(PORT, () => {
    console.log(`✅ Server chạy trên http://localhost:${PORT}`);
  });
});
