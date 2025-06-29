import { Router } from 'express';
import { getDb } from '../db';

const router = Router();

router.get('/', async (_req, res) => {
  const db = await getDb();
  const list = await (await db).all('SELECT * FROM feedback');
  res.json(list);
});

router.post('/', async (req, res) => {
  const { userId, comment, rating } = req.body;
  const db = await getDb();
  const result = await (await db).run('INSERT INTO feedback (userId, comment, rating) VALUES (?, ?, ?)', userId, comment, rating);
  const fb = await (await db).get('SELECT * FROM feedback WHERE id = ?', result.lastID);
  res.json(fb);
});

export default router;
