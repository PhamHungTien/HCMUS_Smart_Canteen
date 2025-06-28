import express from 'express';
import { readUsers } from '../users.js';

const router = express.Router();

const ADMIN_USER = process.env.APP_USER || 'admin';
const ADMIN_PASS = process.env.APP_PASS || 'admin@123';

router.post('/', async (req, res) => {
  const { username, password } = req.body;
  if(!username || !password){
    return res.status(400).json({ error: 'Thiếu tên hoặc mật khẩu' });
  }
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    return res.json({ role: 'admin' });
  }
  const users = await readUsers();
  const found = users.find(u => u.username === username && u.password === password);
  if (found) {
    return res.json({ role: 'user' });
  }
  res.status(401).json({ error: 'Sai thông tin đăng nhập' });
});

export default router;
