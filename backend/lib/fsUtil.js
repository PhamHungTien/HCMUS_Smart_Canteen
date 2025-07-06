import { promises as fs } from 'fs';
import { dirname } from 'path';

export async function readJson(file, fallback = []) {
  try {
    const text = await fs.readFile(file, 'utf8');
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}

export async function writeJson(file, data) {
  const dir = dirname(file);
  await fs.mkdir(dir, { recursive: true });
  const tmp = file + '.tmp';
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf8');
  await fs.rename(tmp, file);
}
