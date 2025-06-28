import { promises as fs } from 'fs';
import path from 'path';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

export async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

export async function writeUsers(users) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

export async function addUser(user) {
  const users = await readUsers();
  const username = String(user.username).trim();
  const password = String(user.password).trim();
  if (users.find(u => u.username === username)) {
    return null;
  }
  users.push({ username, password });
  await writeUsers(users);
  return { username };
}

export async function deleteUser(username) {
  const users = await readUsers();
  const newUsers = users.filter(u => u.username !== username);
  await writeUsers(newUsers);
}
