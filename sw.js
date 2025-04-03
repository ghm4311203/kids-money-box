const CACHE_NAME = 'kids-money-box-v2';
const urlsToCache = [
    './',
    './index.html',
    './luru.html',
    './manifest.json',
    './images/icons/manifest-icon-192.maskable.png',
    './images/icons/manifest-icon-512.maskable.png',
    './images/qr.png',
    'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@500&family=Noto+Sans+SC:wght@400;500;600&display=swap'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
    // 立即激活新的 Service Worker
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        // 删除旧的缓存
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // 立即接管所有页面
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request)
                    .then(response => {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        return response;
                    });
            })
    );
}); 