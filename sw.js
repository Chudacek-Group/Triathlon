const CACHE = "triathlon-pro-v2";

const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./manifest.json",
  "./sw.js",
  "./js/app.js",
  "./pages/race.html",
  "./pages/bikeplus.html",
  "./pages/runplus.html",
  "./pages/settings.html",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
