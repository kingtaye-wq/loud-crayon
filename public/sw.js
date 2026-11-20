// Loud Crayon Client App — Service Worker for PWA Offline Resilience

const CACHE_NAME = 'loud-crayon-pwa-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/app',
  '/manifest.json',
  '/icons/icon192.png',
  '/icons/icon512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {
        // Fallback gracefully if some asset fails to cache
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Let network handle dynamic API/Supabase calls
  if (event.request.url.includes('/api/') || event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request).then((response) => {
        return response || caches.match('/app');
      });
    })
  );
});
