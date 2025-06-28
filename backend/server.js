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
import fs from 'fs';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '../public');
app.use(express.static(publicDir));

// Redirect requests with .html extension to clean URLs
app.use((req, res, next) => {
  if (req.path.endsWith('.html')) {
    const clean = req.path.slice(0, -5) || '/';
    return res.redirect(301, clean);
  }
  next();
});

// Serve "page" URLs without the .html extension
app.get('/:page', (req, res, next) => {
  const file = path.join(publicDir, `${req.params.page}.html`);
  if (fs.existsSync(file)) {
    return res.sendFile(file);
  }
  next();
});

// Login API chỉ xử lý phương thức POST, cần đặt riêng để truy cập GET /login
// vẫn phục vụ trang login.html (route /:page ở trên)
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
