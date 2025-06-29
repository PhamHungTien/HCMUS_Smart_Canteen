import http from 'http';
import { promises as fs, existsSync } from 'fs';
import { extname, join, normalize } from 'path';
import { URL } from 'url';

const PORT = process.env.PORT || 3001;
const PUBLIC_DIR = '.';
const DATA_DIR = join('.', 'data');
const ORDERS_FILE = join(DATA_DIR, 'orders.json');
const USERS_FILE = join(DATA_DIR, 'users.json');
const MENU_FILE = join(DATA_DIR, 'menu.json');
const FEEDBACK_FILE = join(DATA_DIR, 'feedback.json');

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

const DEFAULT_MENU = [
  { id: 1, category: 'M\u00f3n \u0103n', name: 'C\u01a1m ph\u1ea7n th\u1ecbt kho', price: 25000, originalPrice: 30000, image: 'menu/com_thit_kho.jpg', rating: 4 },
  { id: 2, category: 'M\u00f3n \u0103n', name: 'B\u00e1nh m\u00ec \u1ed1p la', price: 20000, originalPrice: 25000, image: 'menu/banh_mi_op_la.jpg', rating: 3 },
  { id: 3, category: 'M\u00f3n \u0103n', name: 'Salad healthy', price: 30000, originalPrice: 35000, image: 'menu/salad_healthy.jpg', rating: 5 },
  { id: 4, category: 'M\u00f3n \u0103n', name: 'C\u01a1m t\u1ea5m s\u01b0\u1eddn', price: 28000, originalPrice: 32000, image: 'menu/com_tam_suon.jpg', rating: 4 },
  { id: 5, category: 'M\u00f3n \u0103n', name: 'Ph\u1edf b\u00f2', price: 30000, originalPrice: 38000, image: 'menu/pho_bo.jpg', rating: 5 },
  { id: 6, category: 'M\u00f3n \u0103n', name: 'B\u00fan ch\u1ea3', price: 35000, originalPrice: 38000, image: 'menu/bun_cha.jpg', rating: 4 },
  { id: 10, category: '\u0110\u1ed3 u\u1ed1ng', name: 'Tr\u00e0 s\u1eefa', price: 20000, originalPrice: 23000, image: 'menu/tra_sua.jpg', rating: 4 },
  { id: 11, category: '\u0110\u1ed3 u\u1ed1ng', name: 'C\u00e0 ph\u00ea s\u1eefa \u0111\u00e1', price: 15000, originalPrice: 18000, image: 'menu/ca_phe_sua_da.jpg', rating: 3 },
  { id: 12, category: '\u0110\u1ed3 u\u1ed1ng', name: 'N\u01b0\u1edbc \u00e9p detox', price: 15000, originalPrice: 18000, image: 'menu/nuoc_ep_detox.jpg', rating: 5 },
  { id: 13, category: '\u0110\u1ed3 u\u1ed1ng', name: 'N\u01b0\u1edbc cam v\u1eaft', price: 18000, originalPrice: 22000, image: 'menu/nuoc_cam_vat.jpg', rating: 4 },
  { id: 14, category: '\u0110\u1ed3 u\u1ed1ng', name: 'N\u01b0\u1edbc m\u00eca', price: 12000, originalPrice: 15000, image: 'menu/nuoc_mia.jpg', rating: 3 },
  { id: 15, category: '\u0110\u1ed3 u\u1ed1ng', name: 'S\u1eefa chua n\u1ebfp c\u1ea9m', price: 25000, originalPrice: 28000, image: 'menu/sua_chua_nep_cam.jpg', rating: 5 }
];

async function initData() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const users = await readJson(USERS_FILE);
  if (!users.find(u => u.username === 'admin')) {
    users.push({ id: 1, username: 'admin', password: 'admin@123', role: 'admin' });
    await writeJson(USERS_FILE, users);
  }
  if (!existsSync(ORDERS_FILE)) {
    await writeJson(ORDERS_FILE, []);
  }
  if (!existsSync(MENU_FILE)) {
    await writeJson(MENU_FILE, DEFAULT_MENU);
  }
  if (!existsSync(FEEDBACK_FILE)) {
    await writeJson(FEEDBACK_FILE, []);
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

initData().then(() => {
  http.createServer(handler).listen(PORT, () => {
    console.log(`✅ Server chạy trên http://localhost:${PORT}`);
  });
});
