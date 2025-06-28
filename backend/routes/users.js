import express from 'express';
import { readUsers, addUser, deleteUser } from '../users.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const users = await readUsers();
  res.json(users);
});

router.post('/', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Thiếu tên hoặc mật khẩu' });
  }
  const user = await addUser({ username, password });
  if (!user) {
    return res.status(409).json({ error: 'Người dùng đã tồn tại' });
  }
  res.json(user);
});

router.delete('/:username', async (req, res) => {
  await deleteUser(req.params.username);
  res.json({});
});

export default router;
