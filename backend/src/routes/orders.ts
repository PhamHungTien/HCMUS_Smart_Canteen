import { Router } from 'express';
import { getDb } from '../db';

const router = Router();

router.get('/', async (_req, res) => {
  const db = await getDb();
  const orders = await (await db).all('SELECT * FROM orders');
  res.json(orders);
});

router.post('/', async (req, res) => {
  const { userId, items, total } = req.body;
  const db = await getDb();
  const result = await (await db).run('INSERT INTO orders (userId, items, total) VALUES (?, ?, ?)', userId, JSON.stringify(items), total);
  const order = await (await db).get('SELECT * FROM orders WHERE id = ?', result.lastID);
  res.json(order);
});

export default router;
