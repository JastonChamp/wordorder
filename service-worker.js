// service-worker.js
const CACHE_NAME = 'word-order-v2';
const urlsToCache = [
  './',                // important for SPA routing
  'index.html',
  'styles.css',
  'script.js',
  'images/mascot.png',
  'images/first-win.png',
  'images/level-master.png',
  'images/perfect-streak-5.png',
  'images/star.png',   // make sure this file is actually named star.png, not star.png.jpg
  'icon-192.png',
  'icon-512.png',
  'favicon.ico',       // if you have one
  'manifest.json',
  // remove sounds/ if you haven’t uploaded success.mp3 & error.mp3 yet
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .catch(err => {
        console.warn('Some assets failed to cache', err);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(resp => resp || fetch(event.request).catch(() => caches.match('index.html')))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null)
      )
    )
  );
});
