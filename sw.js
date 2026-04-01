const CACHE = 'spol-tilbake-v1';
const FILES = ['/', '/spol-tilbake/', '/spol-tilbake/index.html', '/spol-tilbake/manifest.json', '/spol-tilbake/icon-192.png', '/spol-tilbake/icon-512.png'];

self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(CACHE).then(function(c) { return c.addAll(FILES); }));
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(caches.keys().then(function(keys) {
    return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
  }));
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  // Only cache same-origin requests, let Spotify API calls go through
  if (e.request.url.includes('spotify.com') || e.request.url.includes('scdn.co')) return;
  e.respondWith(
    caches.match(e.request).then(function(r) {
      return r || fetch(e.request);
    })
  );
});
