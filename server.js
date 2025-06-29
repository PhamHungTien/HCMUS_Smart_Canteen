const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = 3001;

const ORDERS_FILE = path.join(__dirname, 'orders.json');
const USERS_FILE = path.join(__dirname, 'users.json');

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

// Đọc danh sách người dùng
function readUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
}

// Ghi danh sách người dùng
function writeUsers(data) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// Tạo tài khoản quản trị mặc định nếu chưa có
function ensureAdmin() {
  const users = readUsers();
  if (!users.find(u => u.username === 'admin')) {
    users.push({ id: 1, username: 'admin', password: 'admin@123', role: 'admin' });
    writeUsers(users);
  }
}

function sendJson(res, statusCode, data) {
  const json = JSON.stringify(data);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(json);
}

function parseBody(req, callback) {
  let body = '';
  req.on('data', chunk => (body += chunk));
  req.on('end', () => {
    try {
      callback(JSON.parse(body));
    } catch {
      callback(null);
    }
  });
}

// Đảm bảo tài khoản admin tồn tại trước khi phục vụ yêu cầu
ensureAdmin();

const server = http.createServer((req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host}`);

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
    parseBody(req, user => {
      if (!user || !user.username || !user.password) {
        sendJson(res, 400, { error: 'Thiếu thông tin' });
        return;
      }
      const users = readUsers();
      if (users.find(u => u.username === user.username)) {
        sendJson(res, 400, { error: 'Tài khoản đã tồn tại' });
        return;
      }
      const id = users.reduce((m, u) => Math.max(m, u.id || 0), 0) + 1;
      users.push({ id, username: user.username, password: user.password, role: 'user' });
      writeUsers(users);
      sendJson(res, 200, { message: 'Đăng ký thành công' });
    });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/login') {
    parseBody(req, user => {
      if (!user) { sendJson(res, 400, { error: 'Thiếu thông tin' }); return; }
      const found = readUsers().find(u => u.username === user.username && u.password === user.password);
      if (!found) {
        sendJson(res, 401, { error: 'Sai thông tin đăng nhập' });
      } else {
        sendJson(res, 200, { id: found.id, username: found.username, role: found.role });
      }
    });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/orders') {
    parseBody(req, order => {
      if (!order || !order.customerName || !order.customerPhone || !order.customerStaffId || !order.items) {
        sendJson(res, 400, { error: 'Thiếu thông tin bắt buộc' });
        return;
      }
      const orders = readOrders();
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
      writeOrders(orders);
      sendJson(res, 200, { message: 'Đơn hàng được ghi nhận thành công' });
    });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/orders') {
    const orders = readOrders();
    sendJson(res, 200, orders);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`✅ Server chạy trên http://localhost:${PORT}`);
});
