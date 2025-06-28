import express from 'express';
import { readFeedback, addFeedback } from '../feedback.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const list = await readFeedback();
  res.json(list);
});

router.post('/', async (req, res) => {
  await addFeedback(req.body);
  res.json({ message: 'ok' });
});

export default router;
