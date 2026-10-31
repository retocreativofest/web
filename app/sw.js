/* #RetoMenteMilenial · funciona sin conexión para la parte visual. Los datos siempre se piden en línea. */
const VERSION = 'rmm-app-v35';
const BASE = ['./', 'index.html', 'app.css?v=21', 'app.js?v=33', 'manifest.webmanifest',
  'img/digi.webp', 'img/tradi.webp', 'img/digi-cara.webp', 'img/tradi-cara.webp', 'img/icon-192.png',
  'img/sticker-1.webp', 'img/sticker-2.webp', 'img/sticker-3.webp', 'chispa.js?v=8',
  'img/estrella-1.webp', 'img/estrella-3.webp', 'img/estrella-6.webp',
  '../assets/fonts/poppins-600.woff', '../assets/fonts/poppins-700.woff', '../assets/fonts/poppins-800.woff', '../assets/fonts/quicksand.woff'];

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

/* ---------- avisos ---------- */
self.addEventListener('push', e => {
  let j = {};
  try { j = e.data ? e.data.json() : {}; } catch (x) {}
  const d = j.data || j.notification || {};
  e.waitUntil(self.registration.showNotification(d.titulo || d.title || '#RetoMenteMilenial', {
    body: d.cuerpo || d.body || '', icon: 'img/icon-192.png', lang: 'es',
    tag: d.tag || undefined, renotify: !!d.tag, data: { ir: d.ir || 'hoy' }
  }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const ir = (e.notification.data || {}).ir || 'hoy';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    const abierta = cs.find(c => c.url.startsWith(self.registration.scope));
    if (abierta) { abierta.postMessage({ ir }); return abierta.focus(); }
    return self.clients.openWindow(new URL('./?ir=' + encodeURIComponent(ir), self.registration.scope).href);
  }));
});
