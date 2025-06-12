const CACHE_NAME = "word-order-v4";
const urlsToCache = [
  "/","index.html","styles.css","game.js","ui.js","speech.js","wordClasses.js",
  "data/p1.json","data/p2.json","data/p3.json","data/p4.json","data/p5.json","data/p6.json",
  "manifest.json","favicon.ico","icon-192.png","icon-512.png",
  "images/mascot.png","images/star.png","images/first-win.png",
  "images/level-master.png","images/perfect-streak-5.png"
];
self.addEventListener("install", e => e.waitUntil(
  caches.open(CACHE_NAME).then(c => c.addAll(urlsToCache))
));
self.addEventListener("fetch", e => e.respondWith(
  caches.match(e.request).then(r => r || fetch(e.request))
));
self.addEventListener("activate", e => e.waitUntil(
  caches.keys().then(keys => Promise.all(
    keys.map(key => key!==CACHE_NAME && caches.delete(key))
  ))
));
