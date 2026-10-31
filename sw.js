// Service worker: pri prvom otvorení uloží celú hru do mobilu, potom ide offline.
// Pri každej zmene súborov zvýš číslo verzie, inak mobil ukáže starú verziu.
const VERZIA = "impostor-v2";

const SUBORY = [
  "./",
  "./index.html",
  "./style.css",
  "./fonts.css",
  "./app.js",
  "./words.js",
  "./manifest.json",
  "./icons/icon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png",
  "./fonts/geist-latin-ext-wght-normal.woff2",
  "./fonts/geist-latin-wght-normal.woff2",
  "./fonts/ibm-plex-mono-latin-400-normal.woff2",
  "./fonts/ibm-plex-mono-latin-500-normal.woff2",
  "./fonts/ibm-plex-mono-latin-ext-400-normal.woff2",
  "./fonts/ibm-plex-mono-latin-ext-500-normal.woff2",
  "./fonts/instrument-serif-latin-400-italic.woff2",
  "./fonts/instrument-serif-latin-400-normal.woff2",
  "./fonts/instrument-serif-latin-ext-400-italic.woff2",
  "./fonts/instrument-serif-latin-ext-400-normal.woff2",
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERZIA).then(c => c.addAll(SUBORY)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(kluce => Promise.all(kluce.filter(k => k !== VERZIA).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// najprv z cache, ak tam nie je, tak z internetu
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(z => {
      if (z) return z;
      return fetch(e.request).catch(() => {
        if (e.request.mode === "navigate") return caches.match("./index.html");
        return Response.error();
      });
    })
  );
});
