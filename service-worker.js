// service-worker.js
const CACHE_NAME = "word-order-v2";
const urlsToCache = [
  "./",
  "index.html",
  "styles.css",
  "script.js",
  "manifest.json",
  "favicon.ico",
  "icon-192.png",
  "icon-512.png",
  "images/mascot.png",
  "images/star.png",
  "images/first-win.png",
  "images/level-master.png",
  "images/perfect-streak-5.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .catch((err) => console.warn("Cache install failed:", err))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((resp) =>
        resp || fetch(event.request).catch(() => caches.match("index.html"))
      )
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) =>
          key !== CACHE_NAME ? caches.delete(key) : Promise.resolve()
        )
      )
    )
  );
});
