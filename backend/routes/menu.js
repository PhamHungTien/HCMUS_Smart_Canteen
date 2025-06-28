import express from 'express';
import { readMenu, addMenuItem, updateMenuItem, deleteMenuItem } from '../menu.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const menu = await readMenu();
  res.json(menu);
});

router.post('/', async (req, res) => {
  const item = await addMenuItem(req.body);
  res.json(item);
});

router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const updated = await updateMenuItem(id, req.body);
  if (!updated) return res.status(404).json({ error: 'Not found' });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  await deleteMenuItem(id);
  res.json({});
});

export default router;
