// service-worker.js
const CACHE_NAME = 'word-order-v2';
const urlsToCache = [
  './',
  'index.html',
  'styles.css',
  'script.js',
  'sounds/success.mp3',
  'sounds/error.mp3',
  'images/mascot.png',
  'images/star.png',
  'images/first-win.png',
  'images/level-master.png',
  'images/perfect-streak-5.png',
  'favicon.ico',
  'manifest.json',
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request).catch(() => caches.match('index.html')))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null))
    )
  );
});
