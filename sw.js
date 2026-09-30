// Bump CACHE when you change files and want phones to drop old copies immediately.
const CACHE = 'cards-v1';
const ASSETS = ['./', 'index.html', 'agency.html', 'tsmu.html', 'agency.vcf', 'tsmu.vcf', 'manifest.webmanifest',
  'img/coa.webp', 'img/tsmu-logo.webp', 'img/qr-agency.svg', 'img/qr-tsmu.svg', 'img/icon-192.png', 'img/icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Stale-while-revalidate: open instantly from cache, refresh in background (updates show on next open).
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(r, { ignoreSearch: true });
    const net = fetch(r).then(res => { if (res.ok) c.put(r, res.clone()); return res; }).catch(() => hit);
    return hit || net;
  }));
});
