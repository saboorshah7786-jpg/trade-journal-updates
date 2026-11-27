/* Trade Journal Mobile v5.2.1 — offline cache.
   Only runs when the app is served over http(s). Opened straight from
   a file, the browser skips the service worker and the app still works
   — it just cannot be "installed" from a file. */
var CACHE = 'tj-mobile-5.2.1';
var FILES = ['index.html', 'manifest.webmanifest', 'icon.png', 'icon-256.png', 'icon-192.png'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }).catch(function () {}));
  self.skipWaiting();
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) { return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); }));
  self.clients.claim();
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(function (hit) { return hit || fetch(e.request).catch(function () { return caches.match('index.html'); }); }));
});
