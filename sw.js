const CACHE_NAME = 'minna-cache-v1';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/contact.html',
  '/publications.html',
  '/interactive_map.html',
  '/projects/featuredprojects.html',
  '/about/about.html',
  '/offline.html',
  '/manifest.json',
  '/sw.js',
  '/js/sw-register.js',
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

  // Handle navigation requests with network-first, fallback to cache -> offline page
  if (request.mode === 'navigate' || (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'))) {
    event.respondWith(
      fetch(request).then(resp => {
        const copy = resp.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        return resp;
      }).catch(() => caches.match(request).then(match => match || caches.match('/offline.html')))
    );
    return;
  }

  // For other requests use cache-first then network
  event.respondWith(
    caches.match(request).then(cacheResp => cacheResp || fetch(request).then(netResp => {
      // Optionally cache runtime GET requests for same-origin assets
      if (request.method === 'GET' && request.url.startsWith(self.location.origin)) {
        const copy = netResp.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
      }
      return netResp;
    })).catch(() => {
      // As a last resort for images/styles/scripts, return nothing
      return new Response('', {status: 504, statusText: 'Gateway Timeout'});
    })
  );
});
