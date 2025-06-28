import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import ordersRouter from './routes/orders.js';
import authRouter from './routes/auth.js';
import menuRouter from './routes/menu.js';
import feedbackRouter from './routes/feedback.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '../public');
app.use(express.static(publicDir));

app.get('/login', (req, res) => {
  res.sendFile('login.html', { root: publicDir });
});

app.get('/admin', (req, res) => {
  res.sendFile('admin.html', { root: publicDir });
});

app.use('/login', authRouter);
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
