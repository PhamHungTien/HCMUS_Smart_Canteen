import { randomBytes, pbkdf2Sync } from 'crypto';

export function hashPassword(password, salt = randomBytes(16).toString('hex')) {
  const hash = pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

export function verifyPassword(password, user) {
  if (!user.hash || !user.salt) return false;
  const h = pbkdf2Sync(password, user.salt, 100000, 64, 'sha512').toString('hex');
  return h === user.hash;
}

const sessions = new Map();

export function createSession(user, ttl = 3600) {
  const token = randomBytes(32).toString('hex');
  sessions.set(token, { user, expires: Date.now() + ttl * 1000 });
  return token;
}

export function getSession(token) {
  const data = sessions.get(token);
  if (!data) return null;
  if (Date.now() > data.expires) {
    sessions.delete(token);
    return null;
  }
  return data.user;
}

