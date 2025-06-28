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
import { getDb } from './db.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '../public');

// Serve tệp tĩnh trong thư mục public
app.use(express.static(publicDir));

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
getDb().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server chạy trên http://localhost:${PORT}`);
  });
});
