import { promises as fs } from 'fs';
import path from 'path';

const MENU_FILE = path.join(process.cwd(), 'data', 'menu.json');

export async function readMenu() {
  try {
    const data = await fs.readFile(MENU_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

export async function writeMenu(menu) {
  await fs.writeFile(MENU_FILE, JSON.stringify(menu, null, 2), 'utf8');
}

export async function addMenuItem(item) {
  const menu = await readMenu();
  menu.push({ id: Date.now(), ...item });
  await writeMenu(menu);
  return menu[menu.length - 1];
}

export async function updateMenuItem(id, data) {
  const menu = await readMenu();
  const idx = menu.findIndex(i => i.id === id);
  if (idx === -1) return null;
  menu[idx] = { ...menu[idx], ...data };
  await writeMenu(menu);
  return menu[idx];
}

export async function deleteMenuItem(id) {
  const menu = await readMenu();
  const newMenu = menu.filter(i => i.id !== id);
  await writeMenu(newMenu);
}
