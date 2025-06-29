import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
const DB_FILE = path.join(DATA_DIR, 'canteen.db');

const db = new Database(DB_FILE);

db.pragma('journal_mode = WAL');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  username TEXT PRIMARY KEY,
  password TEXT NOT NULL,
  code TEXT,
  fullName TEXT
);
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  items TEXT NOT NULL,
  time TEXT,
  total INTEGER,
  paymentMethod TEXT,
  specialRequest TEXT,
  accountUsername TEXT,
  accountCode TEXT,
  createdAt TEXT
);
CREATE TABLE IF NOT EXISTS menu (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  category TEXT,
  price INTEGER,
  image TEXT,
  rating INTEGER,
  originalPrice INTEGER
);
CREATE TABLE IF NOT EXISTS feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT,
  menuItemId INTEGER,
  rating INTEGER,
  comment TEXT,
  text TEXT,
  email TEXT,
  username TEXT,
  code TEXT,
  createdAt TEXT
);
`);

export default db;
