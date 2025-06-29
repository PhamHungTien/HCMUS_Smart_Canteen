import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { resolve } from 'path';

let db: Promise<Database<sqlite3.Database, sqlite3.Statement>> | undefined;

export async function getDb() {
  if (!db) {
    db = open({
      filename: resolve(__dirname, '../data/db.sqlite'),
      driver: sqlite3.Database,
    });
    const database = await db;
    await database.exec(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT
    );`);
    await database.exec(`CREATE TABLE IF NOT EXISTS menu (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      price REAL
    );`);
    await database.exec(`CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      items TEXT,
      total REAL
    );`);
    await database.exec(`CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      comment TEXT,
      rating INTEGER
    );`);
  }
  return db;
}
