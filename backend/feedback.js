import fs from 'fs';
import { promises as fsp } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
const FEEDBACK_FILE = path.join(DATA_DIR, 'feedback.json');

export async function readFeedback() {
  try {
    const data = await fsp.readFile(FEEDBACK_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

export async function addFeedback(feedback) {
  const list = await readFeedback();
  list.push({ ...feedback, createdAt: new Date().toISOString() });
  await fsp.writeFile(FEEDBACK_FILE, JSON.stringify(list, null, 2), 'utf8');
}
