import db from './db.ts';
import defaultMenu from './defaultMenu.json' assert { type: 'json' };

function seedMenu() {
  const count = db.prepare('SELECT COUNT(*) as c FROM menu').get().c;
  if (count === 0) {
    const insert = db.prepare('INSERT INTO menu (id, name, category, price, image, rating, originalPrice) VALUES (@id, @name, @category, @price, @image, @rating, @originalPrice)');
    const tx = db.transaction((items) => {
      for (const it of items) insert.run(it);
    });
    tx(defaultMenu);
  }
}

export async function readMenu() {
  seedMenu();
  return db.prepare('SELECT * FROM menu').all();
}

export async function addMenuItem(item) {
  const stmt = db.prepare('INSERT INTO menu (name, category, price, image, rating, originalPrice) VALUES (?, ?, ?, ?, ?, ?)');
  const res = stmt.run(item.name, item.category, item.price, item.image, item.rating, item.originalPrice || item.price);
  return { id: Number(res.lastInsertRowid), ...item };
}

export async function updateMenuItem(id, data) {
  const keys = [];
  const params = [];
  for (const [k, v] of Object.entries(data)) {
    keys.push(`${k}=?`);
    params.push(v);
  }
  params.push(id);
  db.prepare(`UPDATE menu SET ${keys.join(', ')} WHERE id=?`).run(...params);
  return db.prepare('SELECT * FROM menu WHERE id=?').get(id);
}

export async function deleteMenuItem(id) {
  db.prepare('DELETE FROM menu WHERE id=?').run(id);
}
