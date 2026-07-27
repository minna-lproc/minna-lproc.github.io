const CACHE_NAME = 'minna-cache-v2';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/contact.html',
  '/publications.html',
  '/interactive_map.html',
  '/projects/featuredprojects.html',
  '/about/about.html',
  '/people/faculties.html',
  '/people/gradstudents.html',
  '/people/undergradstudents.html',
  '/people/kagan.html',
  '/people/manobo.html',
  '/people/mansaka.html',
  '/offline.html',
  '/manifest.json',
  '/sw.js',
  '/js/sw-register.js',
  '/js/pwa-install.js',
  '/css/sb-admin-2.min.css',
  '/css/chatbot.css',
  '/vendor/bootstrap/css/bootstrap.min.css',
  '/vendor/fontawesome-free/css/all.min.css',
  '/minna_round_logo.png',
  '/js/sb-admin-2.min.js',
  '/js/chatbot.js',
  '/vendor/jquery/jquery.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const {request} = event;
  const isHtmlRequest = request.mode === 'navigate' || (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'));

  if (isHtmlRequest) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => {
          return caches.match(request)
            .then(match => match || caches.match('/index.html'))
            .then(match => match || caches.match('/offline.html'))
            .then(match => match || new Response('Offline fallback unavailable', {status: 404, headers: {'Content-Type': 'text/plain'}}));
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cacheResp => {
      if (cacheResp) return cacheResp;
      return fetch(request).then(netResp => {
        if (netResp && netResp.ok && request.method === 'GET' && request.url.startsWith(self.location.origin)) {
          const copy = netResp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        }
        return netResp;
      });
    }).catch(() => new Response('', {status: 504, statusText: 'Gateway Timeout'}))
  );
});
