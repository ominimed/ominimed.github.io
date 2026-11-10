const CACHE = 'omni-iot-v12';
const PRECACHE = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png', 'icon-512-maskable.png',
  'supabase.js', 'config.js',
  'flow-universal.jpg', 'flow-difficult.jpg', 'flow-failed.jpg', 'flow-cardiac.jpg'];
// sempre buscar primeiro na rede (cai para o cache sem internet)
const NETWORK_FIRST = ['config.js', 'admin.html'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', e => { if (e.data === 'skipWaiting') self.skipWaiting(); });

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;            // servidor (Supabase) e feed externo: sempre rede
  if (url.pathname.endsWith('app-feed.json')) return;     // conteúdo sempre fresco
  if (NETWORK_FIRST.some(f => url.pathname.endsWith(f))) {
    e.respondWith(
      fetch(req).then(res => {
        if (res && res.status === 200) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return res;
      }).catch(() => caches.match(req))
    );
    return;
  }
  e.respondWith(
    caches.match(req).then(hit => {
      const net = fetch(req).then(res => {
        if (res && res.status === 200) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return res;
      }).catch(() => hit);
      return hit || net;
    })
  );
});
