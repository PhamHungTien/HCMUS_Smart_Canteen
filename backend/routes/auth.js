import express from 'express';

const router = express.Router();

const USERNAME = process.env.APP_USER || 'admin';
const PASSWORD = process.env.APP_PASS || '123456';

router.post('/', (req, res) => {
  const { username, password } = req.body;
  if (username === USERNAME && password === PASSWORD) {
    return res.json({ message: 'Đăng nhập thành công' });
  }
  res.status(401).json({ error: 'Sai thông tin đăng nhập' });
});

export default router;
