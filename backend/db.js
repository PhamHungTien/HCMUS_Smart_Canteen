import sqlite3 from 'sqlite3';
import path from 'path';
import { promises as fs } from 'fs';

const DB_FILE = path.join(process.cwd(), 'data', 'database.sqlite');
let db;

function run(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err); else resolve(this);
    });
  });
}

function get(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err); else resolve(row);
    });
  });
}

function all(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err); else resolve(rows);
    });
  });
}

export async function getDb() {
  if (db) return db;
  await fs.mkdir(path.dirname(DB_FILE), { recursive: true });
  db = new sqlite3.Database(DB_FILE);
  await run(db, `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )`);
  return db;
}

export { run, get, all };
