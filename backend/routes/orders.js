import express from 'express';
import { addOrder, readOrders } from '../orders.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const order = req.body;
  if (!order.customerName || !order.customerPhone || !order.customerStaffId || !order.items) {
    return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
  }
  await addOrder(order);
  res.json({ message: 'Đơn hàng được ghi nhận thành công' });
});

router.get('/', async (req, res) => {
  const orders = await readOrders();
  res.json(orders);
});

export default router;
