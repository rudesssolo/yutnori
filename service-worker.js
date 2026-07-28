const CACHE_NAME = 'yutnori-v4';
const APP_SHELL = [
  './',
  './yutnori.html',
  './version.json',
  './manifest.webmanifest',
  './icons/yutnori-modern-180.png',
  './icons/yutnori-modern-192.png',
  './icons/yutnori-modern-512.png',
  './icons/yutnori-modern-maskable-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    const previousCaches = keys.filter(key => key !== CACHE_NAME && key.startsWith('yutnori-'));
    await Promise.all(previousCaches.map(key => caches.delete(key)));
    await self.clients.claim();
    if (previousCaches.length) await notifyAppUpdate();
  })());
});

async function notifyAppUpdate() {
  const windows = await self.clients.matchAll({type: 'window', includeUncontrolled: true});
  windows.forEach(windowClient => windowClient.postMessage({type: 'YUTNORI_APP_UPDATED'}));
}

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith((async () => {
    const url = new URL(event.request.url);
    const isGamePage = url.origin === self.location.origin && url.pathname.endsWith('/yutnori.html');
    const isVersionFile = url.origin === self.location.origin && url.pathname.endsWith('/version.json');
    const refreshFirst = url.origin === self.location.origin && (
      event.request.mode === 'navigate' ||
      isGamePage ||
      isVersionFile ||
      url.pathname.endsWith('/manifest.webmanifest')
    );
    const cache = await caches.open(CACHE_NAME);

    if (refreshFirst) {
      try {
        const previous = await caches.match(event.request);
        const response = await fetch(event.request);
        if (response && response.ok) {
          if (isVersionFile && previous) {
            const [oldVersion, newVersion] = await Promise.all([previous.clone().text(), response.clone().text()]);
            if (oldVersion !== newVersion) await notifyAppUpdate();
          }
          await cache.put(event.request, response.clone());
        }
        return response;
      } catch (error) {
        return (await caches.match(event.request)) || (event.request.mode === 'navigate' ? caches.match('./yutnori.html') : Promise.reject(error));
      }
    }

    const cached = await caches.match(event.request);
    if (cached) return cached;

    try {
      const response = await fetch(event.request);
      if (response && (response.ok || response.type === 'opaque')) {
        await cache.put(event.request, response.clone());
      }
      return response;
    } catch (error) {
      if (event.request.mode === 'navigate') return caches.match('./yutnori.html');
      throw error;
    }
  })());
});
