import db from './db.ts';

export async function readFeedback() {
  return db.prepare('SELECT * FROM feedback ORDER BY createdAt DESC').all();
}

export async function addFeedback(feedback) {
  const stmt = db.prepare(`INSERT INTO feedback (
    type, menuItemId, rating, comment, text, email, username, code, createdAt
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  stmt.run(
    feedback.type,
    feedback.menuItemId || null,
    feedback.rating || null,
    feedback.comment || null,
    feedback.text || null,
    feedback.email || null,
    feedback.username || '',
    feedback.code || '',
    new Date().toISOString()
  );
}
