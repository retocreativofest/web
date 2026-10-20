/* Limpieza: esta dirección es la web del Reto Creativo Fest, no la app.
   Borra lo que el prototipo de la app guardó en el teléfono y se desactiva solo.
   La app vive en /app/ y tiene su propio sw.js allí. */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const ks = await caches.keys();
    await Promise.all(ks.filter(k => k === 'rmm-app-v4').map(k => caches.delete(k)));
    await self.registration.unregister();
    const cs = await self.clients.matchAll({ type: 'window' });
    cs.forEach(c => c.navigate(c.url));
  })());
});
