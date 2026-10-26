// Service worker de «Gánale al Tío Pato»: deja el juego listo para usarse sin conexión.
// Si cambias imágenes o el código, sube el número de VERSION para que los celulares descarguen lo nuevo.
const VERSION = 'v2';
const CACHE = 'tio-pato-' + VERSION;
const ASSETS = ["./", "index.html", "config.js", "manifest.webmanifest", "icons/apple-touch-icon.png", "icons/favicon-32.png", "icons/favicon-64.png", "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-512.png", "pato/face0.png", "pato/face1.png", "pato/face2.png", "pato/face3.png", "pato/halo.png", "pato/hero_angel.png", "pato/hero_devil.png", "pato/hero_mid.png", "pato/horns.png", "pato/tail.png", "pato/trident.png", "pato/wingL_angel.png", "pato/wingL_devil.png", "pato/wingR_angel.png", "pato/wingR_devil.png"];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('tio-pato-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;                    // Firebase (marcadores) y otros: siempre directo a internet

  // Página y configuración: primero internet (para tener siempre lo último), y sin conexión usa la copia guardada.
  const fresh = req.mode === 'navigate' || /\/(config\.js|manifest\.webmanifest)$/.test(url.pathname) || url.pathname.endsWith('.html');
  if (fresh) {
    e.respondWith(
      fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res; })
        .catch(() => caches.match(req, { ignoreSearch: true }).then(hit => hit || caches.match('index.html')))
    );
    return;
  }
  // Imágenes e íconos: primero la copia guardada (carga instantánea).
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }))
  );
});
