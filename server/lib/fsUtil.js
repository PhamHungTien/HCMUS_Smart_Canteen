import { promises as fs } from 'fs';

export async function readJson(file, fallback = []) {
  try {
    const text = await fs.readFile(file, 'utf8');
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}

export async function writeJson(file, data) {
  await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf8');
}
