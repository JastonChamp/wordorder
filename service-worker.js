// service-worker.js
const CACHE_NAME = "word-order-v2";
const urlsToCache = [
  "./",            // cache the root, which usually serves index.html
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
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .catch((err) => console.warn("Cache install failed:", err))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // 1) Return from cache if we have it
      if (cachedResponse) {
        return cachedResponse;
      }
      // 2) Otherwise try network
      return fetch(event.request).catch((networkError) => {
        console.warn("Fetch failed; returning offline page instead.", networkError);
        // 3) If both cache & network fail, return the cached index.html
        return caches.match("index.html").then((fallbackResponse) => {
          // If even the fallback is missing, throw; browser will show an error page
          return fallbackResponse || Promise.reject("no-fallback-found");
        });
      });
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => key !== CACHE_NAME ? caches.delete(key) : Promise.resolve())
      )
    )
  );
});
