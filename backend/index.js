import http from 'http';
import { promises as fs } from 'fs';
import { extname, join, normalize, dirname } from 'path';
import { fileURLToPath, URL } from 'url';
import { readJson, writeJson } from './lib/fsUtil.js';
import { initData, ORDERS_FILE, USERS_FILE, MENU_FILE, FEEDBACK_FILE } from './lib/initData.js';
import { sendMail } from './lib/mailer.js';

const PORT = process.env.PORT || 3001;
const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, '../frontend');
const staticCache = new Map();
const MAX_ORDERS_PER_SLOT = 5;
const SLOT_INTERVAL = 15; // minutes

function slotKey(time) {
  const d = new Date(time);
  d.setMinutes(Math.floor(d.getMinutes() / SLOT_INTERVAL) * SLOT_INTERVAL, 0, 0);
  return d.toISOString();
}

function contentType(file) {
  switch (extname(file)) {
    case '.html': return 'text/html';
    case '.css': return 'text/css';
    case '.js': return 'text/javascript';
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.glb': return 'model/gltf-binary';
    default: return 'application/octet-stream';
  }
}

async function serveStatic(pathname, res) {
  const routes = {
    '/admin': '/admin.html',
    '/login': '/login.html',
    '/signup': '/signup.html',
    '/forgot': '/forgot.html',
    '/change': '/change.html'
  };
  const resolved = routes[pathname] || pathname;
  const filePath = join(PUBLIC_DIR, pathname === '/' ? 'index.html' : normalize(resolved).replace(/^\/+/, ''));
  try {
    let data = staticCache.get(filePath);
    if (!data) {
      data = await fs.readFile(filePath);
      staticCache.set(filePath, data);
    }
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

async function authenticate(req) {
  const auth = req.headers['authorization'];
  if (!auth || !auth.startsWith('Basic ')) return null;
  const [user, pass] = Buffer.from(auth.slice(6), 'base64').toString().split(':');
  const users = await readJson(USERS_FILE);
  return users.find(u => u.username === user && u.password === pass) || null;
}

async function isAdmin(req) {
  const user = await authenticate(req);
  return user && user.role === 'admin';
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

async function sendOrderReminders() {
  const orders = await readJson(ORDERS_FILE);
  const users = await readJson(USERS_FILE);
  const now = Date.now();
  let changed = false;
  for (const o of orders) {
    if (o.status !== 'pending') continue;
    const t = new Date(o.time).getTime();
    const diff = t - now;
    const user = users.find(x => x.username === o.customerUsername);
    if (!user) continue;
    const cancelLink = `http://${process.env.HOST || 'localhost:' + PORT}/cancel?id=${o.id}`;
    const html = `<p>Đơn hàng #${o.id} sẽ sẵn sàng lúc ${new Date(o.time).toLocaleTimeString()}.</p>` +
      `<p><a href="${cancelLink}" style="padding:8px 12px;background:#d9534f;color:#fff;text-decoration:none">Huỷ đơn</a></p>`;
    if (!o.firstReminderSent && diff > 10 * 60 * 1000 && diff <= 30 * 60 * 1000) {
      await sendMail(user.email, 'Nhắc nhở nhận món',
        `Đơn hàng #${o.id} sẽ sẵn sàng lúc ${new Date(o.time).toLocaleTimeString()}.`, html);
      o.firstReminderSent = true;
      changed = true;
    } else if (!o.secondReminderSent && diff > 0 && diff <= 10 * 60 * 1000) {
      await sendMail(user.email, 'Sắp đến giờ nhận món',
        `Đơn hàng #${o.id} sẽ sẵn sàng lúc ${new Date(o.time).toLocaleTimeString()}.`, html);
      o.secondReminderSent = true;
      changed = true;
    }
  }
  if (changed) await writeJson(ORDERS_FILE, orders);
}

async function handler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (req.method === "GET" && url.pathname.endsWith(".html")) {
    const base = url.pathname.slice(0, -5);
    const target = base === "/index" ? "/" : base;
    res.writeHead(301, { Location: target + url.search });
    res.end();
    return;
  }

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
    if (!user || !user.username || !user.password || !user.fullName || !user.staffId || !user.phone || !user.email) {
      send(res, 400, { error: 'Thiếu thông tin' });
      return;
    }
    if(!/^[a-zA-Z0-9]+$/.test(user.username)) {
      send(res, 400, { error: 'Tên đăng nhập không hợp lệ' });
      return;
    }
    const users = await readJson(USERS_FILE);
    if (users.some(u => u.username === user.username)) {
      send(res, 400, { error: 'Tài khoản đã tồn tại' });
      return;
    }
    const id = users.reduce((m, u) => Math.max(m, u.id || 0), 0) + 1;
    users.push({
      id,
      username: user.username,
      password: user.password,
      fullName: user.fullName,
      staffId: user.staffId,
      phone: user.phone,
      email: user.email,
      role: user.role || 'user'
    });
    await writeJson(USERS_FILE, users);
    sendMail(
      user.email,
      'Đăng ký thành công',
      `Chào ${user.fullName}, tài khoản của bạn đã được tạo thành công.`,
      `<p>Chào ${user.fullName}, tài khoản của bạn đã được tạo thành công.</p>`
    );
    send(res, 200, { message: 'Đăng ký thành công' });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/login') {
    const user = await parseBody(req);
    if (!user) { send(res, 400, { error: 'Thiếu thông tin' }); return; }
    if(!/^[a-zA-Z0-9]+$/.test(user.username)) {
      send(res, 400, { error: 'Tên đăng nhập không hợp lệ' });
      return;
    }
    const users = await readJson(USERS_FILE);
    const found = users.find(u => u.username === user.username && u.password === user.password);
    if (!found) {
      send(res, 401, { error: 'Sai thông tin đăng nhập' });
    } else {
      send(res, 200, {
        id: found.id,
        username: found.username,
        fullName: found.fullName,
        staffId: found.staffId,
        phone: found.phone,
        email: found.email,
        role: found.role
      });
    }
    return;
  }

  if (req.method === 'POST' && url.pathname === '/change-password') {
    const auth = req.headers['authorization'];
    if (!auth || !auth.startsWith('Basic ')) { send(res, 401, { error: 'Unauthorized' }); return; }
    const [username, password] = Buffer.from(auth.slice(6), 'base64').toString().split(':');
    const body = await parseBody(req);
    if (!body || !body.newPassword) { send(res, 400, { error: 'Thiếu mật khẩu mới' }); return; }
    const users = await readJson(USERS_FILE);
    const idx = users.findIndex(u => u.username === username && u.password === password);
    if (idx === -1) { send(res, 401, { error: 'Sai thông tin' }); return; }
    users[idx].password = body.newPassword;
    await writeJson(USERS_FILE, users);
    send(res, 200, { message: 'Đã đổi mật khẩu' });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/reset-password') {
    const body = await parseBody(req);
    if (!body || !body.username || !body.staffId || !body.newPassword) {
      send(res, 400, { error: 'Thiếu thông tin' });
      return;
    }
    if(!/^[a-zA-Z0-9]+$/.test(body.username)) {
      send(res, 400, { error: 'Tên đăng nhập không hợp lệ' });
      return;
    }
    const users = await readJson(USERS_FILE);
    const idx = users.findIndex(u => u.username === body.username && u.staffId === body.staffId);
    if (idx === -1) { send(res, 404, { error: 'Không tìm thấy người dùng' }); return; }
    users[idx].password = body.newPassword;
    await writeJson(USERS_FILE, users);
    send(res, 200, { message: 'Đã đặt lại mật khẩu' });
    return;
  }

  if (req.method === 'PUT' && url.pathname === '/me') {
    const user = await authenticate(req);
    if (!user) { send(res, 401, { error: 'Unauthorized' }); return; }
    const body = await parseBody(req);
    if (!body) { send(res, 400, { error: 'Thiếu thông tin' }); return; }
    const users = await readJson(USERS_FILE);
    const idx = users.findIndex(u => u.username === user.username);
    if (idx === -1) { send(res, 404, { error: 'Không tìm thấy' }); return; }
    users[idx] = { ...users[idx], ...body };
    await writeJson(USERS_FILE, users);
    send(res, 200, { message: 'Đã cập nhật' });
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

  if (req.method === 'POST' && url.pathname === '/upload') {
    if (!await isAdmin(req)) { send(res, 403, { error: 'Unauthorized' }); return; }
    const body = await parseBody(req);
    if (!body || !body.filename || !body.data) { send(res, 400, { error: 'Thiếu dữ liệu' }); return; }
    const ext = extname(body.filename) || '.jpg';
    const fname = `item_${Date.now()}${ext}`;
    const base64 = body.data.split(',').pop();
    const menuDir = join(PUBLIC_DIR, 'menu');
    await fs.mkdir(menuDir, { recursive: true });
    await fs.writeFile(join(menuDir, fname), Buffer.from(base64, 'base64'));
    send(res, 200, { path: `menu/${fname}` });
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
    const user = await authenticate(req);
    if (!user) { send(res, 401, { error: 'Unauthorized' }); return; }
    const order = await parseBody(req);
    if (!order || !order.items) {
      send(res, 400, { error: 'Thiếu thông tin bắt buộc' });
      return;
    }
    const orders = await readJson(ORDERS_FILE);
    const key = slotKey(order.time);
    const count = orders.filter(o => slotKey(o.time) === key).length;
    if (count >= MAX_ORDERS_PER_SLOT) {
      send(res, 400, { error: 'Khung giờ này đã đủ lượt đặt' });
      return;
    }
    orders.push({
      id: order.id || orders.length + 1,
      time: order.time,
      customerName: user.fullName,
      customerUsername: user.username,
      staffId: user.staffId,
      specialRequest: order.specialRequest || '',
      items: order.items,
      total: order.total,
      paymentMethod: order.paymentMethod,
      createdAt: new Date().toISOString(),
      status: 'pending'
    });
    await writeJson(ORDERS_FILE, orders);
    send(res, 200, { message: 'Đơn hàng được ghi nhận thành công' });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/orders') {
    if (!await isAdmin(req)) { send(res, 403, { error: 'Unauthorized' }); return; }
    const orders = await readJson(ORDERS_FILE);
    orders.sort((a, b) => new Date(a.time) - new Date(b.time));
    send(res, 200, orders);
    return;
  }

  if (req.method === 'GET' && url.pathname === '/revenue') {
    if (!await isAdmin(req)) { send(res, 403, { error: 'Unauthorized' }); return; }
    const orders = await readJson(ORDERS_FILE);
    let from = url.searchParams.get('from');
    let to = url.searchParams.get('to');
    const total = orders
      .filter(o => {
        const t = new Date(o.createdAt);
        if (from && t < new Date(from)) return false;
        if (to && t > new Date(to)) return false;
        return true;
      })
      .reduce((s, o) => s + (o.total || 0), 0);
    send(res, 200, { total });
    return;
  }

  if (req.method === 'PUT' && url.pathname.startsWith('/orders/')) {
    if (!await isAdmin(req)) { send(res, 403, { error: 'Unauthorized' }); return; }
    const id = url.pathname.split('/')[2];
    const updates = await parseBody(req);
    const orders = await readJson(ORDERS_FILE);
    const idx = orders.findIndex(o => String(o.id) === id);
    if (idx === -1) { send(res, 404, { error: 'Không tìm thấy' }); return; }
    orders[idx] = { ...orders[idx], ...updates };
    await writeJson(ORDERS_FILE, orders);
    send(res, 200, { message: 'Đã cập nhật' });
    return;
  }

  if (req.method === 'DELETE' && url.pathname.startsWith('/orders/')) {
    if (!await isAdmin(req)) { send(res, 403, { error: 'Unauthorized' }); return; }
    const id = url.pathname.split('/')[2];
    let orders = await readJson(ORDERS_FILE);
    const len = orders.length;
    orders = orders.filter(o => String(o.id) !== id);
    if (orders.length === len) { send(res, 404, { error: 'Không tìm thấy' }); return; }
    await writeJson(ORDERS_FILE, orders);
    send(res, 200, { message: 'Đã xoá' });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/my-orders') {
    const user = await authenticate(req);
    if (!user) { send(res, 401, { error: 'Unauthorized' }); return; }
    const orders = await readJson(ORDERS_FILE);
    const list = orders
      .filter(o => o.customerUsername === user.username)
      .sort((a, b) => new Date(a.time) - new Date(b.time));
    send(res, 200, list);
    return;
  }

  if (req.method === 'PUT' && url.pathname.startsWith('/my-orders/')) {
    const user = await authenticate(req);
    if (!user) { send(res, 401, { error: 'Unauthorized' }); return; }
    const id = url.pathname.split('/')[2];
    let orders = await readJson(ORDERS_FILE);
    const idx = orders.findIndex(o => String(o.id) === id && o.customerUsername === user.username);
    if (idx === -1) { send(res, 404, { error: 'Không tìm thấy' }); return; }
    if (orders[idx].status !== 'pending') { send(res, 400, { error: 'Không thể huỷ' }); return; }
    orders[idx].status = 'cancelled';
    await writeJson(ORDERS_FILE, orders);
    send(res, 200, { message: 'Đã huỷ đơn' });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/cancel') {
    const id = url.searchParams.get('id');
    let orders = await readJson(ORDERS_FILE);
    const idx = orders.findIndex(o => String(o.id) === id);
    if (idx === -1) { send(res, 404, { error: 'Không tìm thấy' }); return; }
    orders[idx].status = 'cancelled';
    await writeJson(ORDERS_FILE, orders);
    res.writeHead(200, { 'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*' });
    res.end('<h1>Đơn hàng đã được huỷ</h1>');
    return;
  }

  if (req.method === 'GET' && url.pathname === '/users') {
    if (!await isAdmin(req)) { send(res, 403, { error: 'Unauthorized' }); return; }
    const users = await readJson(USERS_FILE);
    send(res, 200, users.map(u => ({ id: u.id, username: u.username, fullName: u.fullName, staffId: u.staffId, phone: u.phone, email: u.email, role: u.role })));
    return;
  }

  if (req.method === 'PUT' && url.pathname.startsWith('/users/')) {
    if (!await isAdmin(req)) { send(res, 403, { error: 'Unauthorized' }); return; }
    const id = parseInt(url.pathname.split('/')[2]);
    const updates = await parseBody(req);
    const users = await readJson(USERS_FILE);
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) { send(res, 404, { error: 'Không tìm thấy' }); return; }
    users[idx] = { ...users[idx], ...updates, id };
    await writeJson(USERS_FILE, users);
    send(res, 200, { message: 'Đã cập nhật' });
    return;
  }

  if (req.method === 'DELETE' && url.pathname.startsWith('/users/')) {
    if (!await isAdmin(req)) { send(res, 403, { error: 'Unauthorized' }); return; }
    const id = parseInt(url.pathname.split('/')[2]);
    let users = await readJson(USERS_FILE);
    const len = users.length;
    users = users.filter(u => u.id !== id);
    if (users.length === len) { send(res, 404, { error: 'Không tìm thấy' }); return; }
    await writeJson(USERS_FILE, users);
    send(res, 200, { message: 'Đã xoá' });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
  res.end('Not Found');
}

initData(fs).then(() => {
  http.createServer(handler).listen(PORT, () => {
    console.log(`✅ Server chạy trên http://localhost:${PORT}`);
  });
  setInterval(sendOrderReminders, 60000);
});
