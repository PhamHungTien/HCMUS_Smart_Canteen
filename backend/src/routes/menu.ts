import { Router } from 'express';
import { getDb } from '../db';

const router = Router();

router.get('/', async (_req, res) => {
  const db = await getDb();
  const items = await (await db).all('SELECT * FROM menu');
  res.json(items);
});

router.post('/', async (req, res) => {
  const { name, price } = req.body;
  const db = await getDb();
  const result = await (await db).run('INSERT INTO menu (name, price) VALUES (?, ?)', name, price);
  const item = await (await db).get('SELECT * FROM menu WHERE id = ?', result.lastID);
  res.json(item);
});

export default router;
