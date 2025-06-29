import http from 'http';
import { promises as fs } from 'fs';
import { extname, join, normalize } from 'path';
import { URL } from 'url';
import { readJson, writeJson } from './lib/fsUtil.js';
import { initData, ORDERS_FILE, USERS_FILE, MENU_FILE, FEEDBACK_FILE } from './lib/initData.js';

const PORT = process.env.PORT || 3001;
const PUBLIC_DIR = '.';
const DATA_DIR = join('.', 'data');

function contentType(file) {
  switch (extname(file)) {
    case '.html': return 'text/html';
    case '.css': return 'text/css';
    case '.js': return 'text/javascript';
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    default: return 'application/octet-stream';
  }
}

async function serveStatic(pathname, res) {
  const filePath = join(PUBLIC_DIR, pathname === '/' ? 'index.html' : normalize(pathname).replace(/^\/+/, ''));
  try {
    const data = await fs.readFile(filePath);
    res.writeHead(200, { 'Content-Type': contentType(filePath) });
    res.end(data);
    return true;
  } catch {
    return false;
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

async function isAdmin(req) {
  const auth = req.headers['authorization'];
  if (!auth || !auth.startsWith('Basic ')) return false;
  const [user, pass] = Buffer.from(auth.slice(6), 'base64').toString().split(':');
  const users = await readJson(USERS_FILE);
  const found = users.find(u => u.username === user && u.password === pass);
  return found && found.role === 'admin';
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

  if (req.method === 'GET') {
    const served = await serveStatic(url.pathname, res);
    if (served) return;
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
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

  if (req.method === 'GET' && url.pathname === '/menu') {
    const menu = await readJson(MENU_FILE);
    send(res, 200, menu);
    return;
  }

  if (req.method === 'POST' && url.pathname === '/menu') {
    if (!await isAdmin(req)) { send(res, 403, { error: 'Unauthorized' }); return; }
    const item = await parseBody(req);
    if (!item || !item.name || !item.price) {
      send(res, 400, { error: 'Thiếu thông tin' });
      return;
    }
    const menu = await readJson(MENU_FILE);
    const id = menu.reduce((m, i) => Math.max(m, i.id || 0), 0) + 1;
    menu.push({ id, ...item });
    await writeJson(MENU_FILE, menu);
    send(res, 200, { message: 'Đã thêm món' });
    return;
  }

  if (req.method === 'PUT' && url.pathname.startsWith('/menu/')) {
    if (!await isAdmin(req)) { send(res, 403, { error: 'Unauthorized' }); return; }
    const id = parseInt(url.pathname.split('/')[2]);
    const updates = await parseBody(req);
    const menu = await readJson(MENU_FILE);
    const idx = menu.findIndex(i => i.id === id);
    if (idx === -1) { send(res, 404, { error: 'Không tìm thấy' }); return; }
    menu[idx] = { ...menu[idx], ...updates, id };
    await writeJson(MENU_FILE, menu);
    send(res, 200, { message: 'Đã cập nhật' });
    return;
  }

  if (req.method === 'DELETE' && url.pathname.startsWith('/menu/')) {
    if (!await isAdmin(req)) { send(res, 403, { error: 'Unauthorized' }); return; }
    const id = parseInt(url.pathname.split('/')[2]);
    let menu = await readJson(MENU_FILE);
    const len = menu.length;
    menu = menu.filter(i => i.id !== id);
    if (menu.length === len) { send(res, 404, { error: 'Không tìm thấy' }); return; }
    await writeJson(MENU_FILE, menu);
    send(res, 200, { message: 'Đã xoá' });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/feedback') {
    const fb = await parseBody(req);
    if (!fb || !fb.type) { send(res, 400, { error: 'Thiếu thông tin' }); return; }
    const feedbacks = await readJson(FEEDBACK_FILE);
    feedbacks.push({ ...fb, createdAt: new Date().toISOString() });
    await writeJson(FEEDBACK_FILE, feedbacks);
    send(res, 200, { message: 'Đã ghi nhận' });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/feedback') {
    if (!await isAdmin(req)) { send(res, 403, { error: 'Unauthorized' }); return; }
    const feedbacks = await readJson(FEEDBACK_FILE);
    send(res, 200, feedbacks);
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

initData(fs).then(() => {
  http.createServer(handler).listen(PORT, () => {
    console.log(`✅ Server chạy trên http://localhost:${PORT}`);
  });
});
