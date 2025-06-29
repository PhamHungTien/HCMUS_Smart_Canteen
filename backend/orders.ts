import fs from 'fs';
import { promises as fsp } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
let ordersCache = null;

export async function readOrders() {
  if (ordersCache) return ordersCache;
  try {
    const data = await fsp.readFile(ORDERS_FILE, 'utf8');
    ordersCache = JSON.parse(data);
    return ordersCache;
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

export async function writeOrders(orders) {
  await fsp.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
  ordersCache = orders;
}

export async function addOrder(order) {
  const orders = await readOrders();
  orders.push({
    ...order,
    createdAt: new Date().toISOString()
  });
  await writeOrders(orders);
}
