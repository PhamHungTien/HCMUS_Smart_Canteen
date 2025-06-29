import db from './db.ts';

export async function readOrders() {
  const rows = db.prepare('SELECT * FROM orders ORDER BY createdAt DESC').all();
  return rows.map(r => ({ ...r, items: JSON.parse(r.items) }));
}

export async function addOrder(order) {
  const stmt = db.prepare(`INSERT INTO orders (
    id, items, time, total, paymentMethod, specialRequest,
    accountUsername, accountCode, createdAt
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  stmt.run(
    order.id,
    JSON.stringify(order.items || []),
    order.time,
    order.total,
    order.paymentMethod || '',
    order.specialRequest || '',
    order.accountUsername || '',
    order.accountCode || '',
    new Date().toISOString()
  );
}
