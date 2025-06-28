import { promises as fs } from 'fs';
import path from 'path';

const ORDERS_FILE = path.join(process.cwd(), "data", "orders.json");

export async function readOrders() {
  try {
    const data = await fs.readFile(ORDERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

export async function writeOrders(orders) {
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
}

export async function addOrder(order) {
  const orders = await readOrders();
  orders.push({
    ...order,
    createdAt: new Date().toISOString()
  });
  await writeOrders(orders);
}
