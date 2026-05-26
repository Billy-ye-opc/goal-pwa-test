// Service Worker v1 - Goal Dashboard PWA
var CACHE = 'goal-pwa-v1';
var FILES = ['/goal-pwa-test/', '/goal-pwa-test/index.html', '/goal-pwa-test/manifest.json'];

self.addEventListener('install', function(e) {
    e.waitUntil(caches.open(CACHE).then(function(c) { return c.addAll(FILES); }));
    self.skipWaiting();
});

self.addEventListener('activate', function(e) {
    e.waitUntil(caches.keys().then(function(keys) {
        return Promise.all(keys.filter(function(k) { return k !== CACHE; }).map(function(k) { return caches.delete(k); }));
    }));
    self.clients.claim();
});

self.addEventListener('fetch', function(e) {
    e.respondWith(
        fetch(e.request).then(function(r) {
            var clone = r.clone();
            caches.open(CACHE).then(function(c) { c.put(e.request, clone); });
            return r;
        }).catch(function() { return caches.match(e.request); })
    );
});
