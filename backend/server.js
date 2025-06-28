import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import ordersRouter from './routes/orders.js';
import authRouter from './routes/auth.js';
import menuRouter from './routes/menu.js';
import feedbackRouter from './routes/feedback.js';
import usersRouter from './routes/users.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '../public');

// Redirect requests like "/login.html" to "/login" to avoid duplicate URLs
// and keep links shorter. This runs before the static middleware so that
// visiting "/page.html" always redirects to "/page".
app.use((req, res, next) => {
  if (req.path.endsWith('.html')) {
    const clean = req.path.slice(0, -5) || '/';
    return res.redirect(301, clean);
  }
  next();
});

// Serve static assets and automatically look for the .html extension when the
// requested path has no file extension. This makes URLs like "/login" load
// "login.html" transparently without extra routing logic.
app.use(express.static(publicDir, { extensions: ['html'] }));

// Login API chỉ xử lý phương thức POST, cần đặt riêng để truy cập GET /login
// vẫn phục vụ login.html thông qua express.static ở trên
app.post('/login', authRouter);
app.use('/users', usersRouter);
app.use('/orders', ordersRouter);
app.use('/menu', menuRouter);
app.use('/feedback', feedbackRouter);

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: publicDir });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server chạy trên http://localhost:${PORT}`);
});
