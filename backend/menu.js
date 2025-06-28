import fs from 'fs';
import { promises as fsp } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import defaultMenu from './defaultMenu.json' assert { type: 'json' };

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
const MENU_FILE = path.join(DATA_DIR, 'menu.json');

export async function readMenu() {
  try {
    const data = await fsp.readFile(MENU_FILE, 'utf8');
    const menu = JSON.parse(data);
    if (Array.isArray(menu) && menu.length > 0) return menu;
    await writeMenu(defaultMenu);
    return defaultMenu;
  } catch (err) {
    if (err.code === 'ENOENT') {
      await fsp.mkdir(DATA_DIR, { recursive: true });
      await writeMenu(defaultMenu);
      return defaultMenu;
    }
    throw err;
  }
}

export async function writeMenu(menu) {
  await fsp.writeFile(MENU_FILE, JSON.stringify(menu, null, 2), 'utf8');
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
