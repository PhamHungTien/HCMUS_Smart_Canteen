import http from 'http';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'url';
import { readOrders, addOrder } from './orders.js';
import { readMenu, addMenuItem, updateMenuItem, deleteMenuItem } from './menu.js';
import { readFeedback, addFeedback } from './feedback.js';
import { readUsers, addUser, deleteUser } from './users.js';

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

const mime = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

function send(res, status, data, type = 'application/json') {
  res.writeHead(status, { 'Content-Type': type, 'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type' });
  res.end(type === 'application/json' ? JSON.stringify(data) : data);
}

function notFound(res) { send(res, 404, { error: 'Not found' }); }

function match(pathname, pattern) {
  const pSeg = pattern.split('/').filter(Boolean);
  const uSeg = pathname.split('/').filter(Boolean);
  if (pSeg.length !== uSeg.length) return null;
  const params = {};
  for (let i = 0; i < pSeg.length; i++) {
    if (pSeg[i].startsWith(':')) params[pSeg[i].slice(1)] = uSeg[i];
    else if (pSeg[i] !== uSeg[i]) return null;
  }
  return params;
}

function body(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', c => { data += c; });
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}); }
      catch (e) { reject(e); }
    });
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204, '');
  const { pathname } = parse(req.url);
  try {
    // Login
    if (req.method === 'POST' && pathname === '/login') {
      const { username, password } = await body(req);
      if (!username || !password) return send(res, 400, { error: 'Thiếu tên hoặc mật khẩu' });
      if (username === ADMIN_USER && password === ADMIN_PASS) return send(res, 200, { role: 'admin' });
      const users = await readUsers();
      const found = users.find(u => u.username.trim() === username.trim() && u.password.trim() === password.trim());
      if (found) return send(res, 200, { role: 'user' });
      return send(res, 401, { error: 'Sai thông tin đăng nhập' });
    }
    // Users list
    if (req.method === 'GET' && pathname === '/users') {
      const users = await readUsers();
      return send(res, 200, users.map(u => ({ username: u.username, code: u.code })));
    }
    // Register
    if (req.method === 'POST' && pathname === '/users') {
      const { username, password, code } = await body(req);
      if (!username || !password || !code) return send(res, 400, { error: 'Thiếu thông tin' });
      const user = await addUser({ username: username.trim(), password: password.trim(), code: code.trim() });
      if (!user) return send(res, 409, { error: 'Người dùng đã tồn tại' });
      return send(res, 200, { username: user.username, code: user.code });
    }
    if (req.method === 'DELETE' && pathname.startsWith('/users/')) {
      const name = decodeURIComponent(pathname.split('/')[2]);
      await deleteUser(name);
      return send(res, 200, {});
    }
    // Orders
    if (req.method === 'GET' && pathname === '/orders') {
      const orders = await readOrders();
      return send(res, 200, orders);
    }
    if (req.method === 'POST' && pathname === '/orders') {
      const order = await body(req);
      if (!order.customerName || !order.customerPhone || !order.customerStaffId || !order.items)
        return send(res, 400, { error: 'Thiếu thông tin bắt buộc' });
      await addOrder(order);
      return send(res, 200, { message: 'Đơn hàng được ghi nhận thành công' });
    }
    // Menu
    if (req.method === 'GET' && pathname === '/menu') {
      const menu = await readMenu();
      return send(res, 200, menu);
    }
    if (req.method === 'POST' && pathname === '/menu') {
      const item = await addMenuItem(await body(req));
      return send(res, 200, item);
    }
    const menuIdParams = match(pathname, '/menu/:id');
    if (menuIdParams) {
      const id = parseInt(menuIdParams.id);
      if (req.method === 'PUT') {
        const updated = await updateMenuItem(id, await body(req));
        if (!updated) return notFound(res);
        return send(res, 200, updated);
      }
      if (req.method === 'DELETE') {
        await deleteMenuItem(id);
        return send(res, 200, {});
      }
    }
    // Feedback
    if (req.method === 'GET' && pathname === '/feedback') {
      const list = await readFeedback();
      return send(res, 200, list);
    }
    if (req.method === 'POST' && pathname === '/feedback') {
      await addFeedback(await body(req));
      return send(res, 200, { message: 'ok' });
    }
    // Static files
    let filePath = path.join(publicDir, pathname === '/' ? 'index.html' : pathname);
    try {
      const stat = await fs.stat(filePath);
      if (stat.isDirectory()) filePath = path.join(filePath, 'index.html');
      const data = await fs.readFile(filePath);
      const ext = path.extname(filePath);
      return send(res, 200, data, mime[ext] || 'application/octet-stream');
    } catch (e) {
      // fallback to index.html
      const data = await fs.readFile(path.join(publicDir, 'index.html'));
      return send(res, 200, data, 'text/html');
    }
  } catch (e) {
    console.error(e);
    return send(res, 500, { error: 'Lỗi máy chủ' });
  }
});

server.listen(PORT, () => {
  console.log(`✅ Server chạy trên http://localhost:${PORT}`);
});
