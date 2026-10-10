/* ProGibb GA Calculator — service worker (no libraries).
   The build step injects the real file list and build id below. */
const VERSION = /*__BUILD__*/"dev";
const ASSETS = /*__PRECACHE__*/["./"];
const CACHE = `progibb-ga-${VERSION}`;
const SHELL = new URL('./index.html', self.registration.scope).href;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('progibb-ga-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Page navigations: try network, fall back to the cached app shell (offline fallback).
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(SHELL, copy));
          return res;
        })
        .catch(() =>
          caches.match(SHELL).then(
            (r) =>
              r ||
              new Response('<h1>Offline</h1><p>Open the app once with internet to use it offline.</p>', {
                headers: { 'Content-Type': 'text/html; charset=utf-8' },
              })
          )
        )
    );
    return;
  }

  // Static assets: cache first, then network (and remember it).
  event.respondWith(
    caches.match(req).then(
      (hit) =>
        hit ||
        fetch(req).then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
    )
  );
});