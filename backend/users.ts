import db from './db.ts';

export async function readUsers() {
  return db.prepare('SELECT username, password, code, fullName FROM users').all();
}

export async function addUser(user) {
  const stmt = db.prepare('INSERT INTO users (username, password, code, fullName) VALUES (?, ?, ?, ?)');
  try {
    stmt.run(user.username, user.password, user.code, user.fullName || '');
    return user;
  } catch (e) {
    if (e.code === 'SQLITE_CONSTRAINT_PRIMARYKEY') return null;
    throw e;
  }
}

export async function deleteUser(username) {
  db.prepare('DELETE FROM users WHERE username=?').run(username);
}
