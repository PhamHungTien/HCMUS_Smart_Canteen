import { promises as fsp, existsSync } from 'fs';
import { join } from 'path';
import { readJson, writeJson } from './fsUtil.js';
import { DEFAULT_MENU } from '../data/defaultMenu.js';

const DATA_DIR = join('.', 'data');
export const ORDERS_FILE = join(DATA_DIR, 'orders.json');
export const USERS_FILE = join(DATA_DIR, 'users.json');
export const MENU_FILE = join(DATA_DIR, 'menu.json');
export const FEEDBACK_FILE = join(DATA_DIR, 'feedback.json');

export async function initData(fsPromises = fsp) {
  await fsPromises.mkdir(DATA_DIR, { recursive: true });
  const users = await readJson(USERS_FILE);
  if (!users.find(u => u.username === 'admin')) {
    users.push({ id: 1, username: 'admin', password: 'admin@123', role: 'admin' });
    await writeJson(USERS_FILE, users);
  }
  if (!existsSync(ORDERS_FILE)) await writeJson(ORDERS_FILE, []);
  if (!existsSync(MENU_FILE)) await writeJson(MENU_FILE, DEFAULT_MENU);
  if (!existsSync(FEEDBACK_FILE)) await writeJson(FEEDBACK_FILE, []);
}
