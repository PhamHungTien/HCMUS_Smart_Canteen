import { promises as fs } from 'fs';
import path from 'path';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    if (e.code === 'ENOENT') return [];
    throw e;
  }
}

async function writeUsers(users) {
  await fs.mkdir(path.dirname(USERS_FILE), { recursive: true });
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

export async function addUser(user) {
  const users = await readUsers();
  if (users.find(u => u.username === user.username)) return null;
  users.push({
    username: user.username,
    password: user.password,
    code: user.code,
    fullName: user.fullName || ''
  });
  await writeUsers(users);
  return user;
}

export async function deleteUser(username) {
  const users = await readUsers();
  const newUsers = users.filter(u => u.username !== username);
  await writeUsers(newUsers);
}

export { readUsers };
