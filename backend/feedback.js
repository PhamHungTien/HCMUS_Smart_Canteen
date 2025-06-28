import { promises as fs } from 'fs';
import path from 'path';

const FEEDBACK_FILE = path.join(process.cwd(), 'data', 'feedback.json');

export async function readFeedback() {
  try {
    const data = await fs.readFile(FEEDBACK_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

export async function addFeedback(feedback) {
  const list = await readFeedback();
  list.push({ ...feedback, createdAt: new Date().toISOString() });
  await fs.writeFile(FEEDBACK_FILE, JSON.stringify(list, null, 2), 'utf8');
}
