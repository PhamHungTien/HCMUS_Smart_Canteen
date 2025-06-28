import express from 'express';
import { getDb, run, all } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const db = await getDb();
  const users = await all(db, 'SELECT username, code FROM users');
  res.json(users);
});

router.post('/', async (req, res) => {
  const { username, password, code } = req.body;
  if (!username || !password || !code) {
    return res.status(400).json({ error: 'Thiếu thông tin' });
  }
  const db = await getDb();
  try {
    await run(db, 'INSERT INTO users(username, password, code) VALUES(?, ?, ?)', [username.trim(), password.trim(), code.trim()]);
    res.json({ username: username.trim(), code: code.trim() });
  } catch (e) {
    if (String(e).includes('UNIQUE')) {
      res.status(409).json({ error: 'Người dùng đã tồn tại' });
    } else {
      res.status(500).json({ error: 'Lỗi máy chủ' });
    }
  }
});

router.delete('/:username', async (req, res) => {
  const db = await getDb();
  await run(db, 'DELETE FROM users WHERE username = ?', [req.params.username]);
  res.json({});
});

export default router;
