/* #RetoMenteMilenial · funciona sin conexión para la parte visual. Los datos siempre se piden en línea. */
const VERSION = 'rmm-app-v3';
const BASE = ['./', 'index.html', 'app.css?v=3', 'app.js?v=3', 'manifest.webmanifest',
  'img/digi.webp', 'img/tradi.webp', 'img/digi-cara.webp', 'img/tradi-cara.webp', 'img/icon-192.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(BASE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;   // Google, Padlet y el Apps Script van directo
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).catch(() => caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(e.request).then(guardado => {
    const red = fetch(e.request).then(r => {
      if (r.ok) { const copia = r.clone(); caches.open(VERSION).then(c => c.put(e.request, copia)); }
      return r;
    }).catch(() => guardado);
    return guardado || red;
  }));
});
