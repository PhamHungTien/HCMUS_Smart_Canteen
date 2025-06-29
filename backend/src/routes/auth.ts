import { Router } from 'express';
import { getDb } from '../db';

const router = Router();

router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Thiếu thông tin' });
  const db = await getDb();
  try {
    await (await db).run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', username, password, 'user');
    res.json({ message: 'Đăng ký thành công' });
  } catch (err) {
    res.status(400).json({ error: 'Tài khoản đã tồn tại' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const db = await getDb();
  const user = await (await db).get('SELECT id, username, role FROM users WHERE username = ? AND password = ?', username, password);
  if (!user) return res.status(401).json({ error: 'Sai thông tin đăng nhập' });
  res.json(user);
});

export default router;
