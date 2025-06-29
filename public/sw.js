const CACHE_NAME = 'canteen-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/admin.html',
  '/login.html',
  '/register.html',
  '/js/app.jsx',
  '/js/login.js',
  '/js/register.js',
  '/js/admin.js',
  '/js/sw-register.js',
  '/styles.css',
];
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
