/* Service worker mínimo: só guarda a «casca» da app (mesma origem) e serve-a se estiveres offline.
 * Pedidos ao Supabase, fontes, bibliotecas e imagens das cartas (outras origens) passam sempre pela rede
 * e, no caso das imagens, ficam na cache normal do browser.
 * Estratégia «rede primeiro»: quando publicas uma versão nova do index.html, ela aparece logo.
 * v2: (1) a instalação não falha se faltar um ficheiro da casca (ex.: um ícone); (2) os pedidos da mesma
 * origem revalidam com o servidor em vez de usarem a cache HTTP do GitHub Pages (que dura cerca de 10 min). */
var CACHE = 'uligod-mtg-shell-v2';
var SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function (c) {
        // um a um: se um ficheiro faltar, os outros guardam-se na mesma
        return Promise.all(SHELL.map(function (u) { return c.add(new Request(u, { cache: 'reload' })).catch(function () { /* ignora */ }); }));
      })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (keys) { return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // Supabase, fontes, jsdelivr, imagens do Scryfall: sem cache do SW
  e.respondWith(
    fetch(req, { cache: 'no-cache' }).then(function (res) {
      if (res && res.ok) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
      return res;
    }).catch(function () { return caches.match(req).then(function (hit) { return hit || caches.match('index.html'); }); })
  );
});
