const CACHE_NAME = 'angulos-pwa-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/app.js',
    '/js/managers/ServiceWorkerManager.js',
    '/js/managers/CacheManager.js',
    '/js/models/Angulo.js',
    '/js/models/Ejercicio.js',
    '/js/models/Evaluacion.js',
    '/js/models/GestorProgreso.js',
    '/js/utils/canvas-helper.js',
    '/js/utils/random-generator.js',
    '/manifest.json'
];

// Instalación: Cachear archivos estáticos
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Cacheando archivos');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// Activación: Limpiar caches antiguas
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Borrando cache antigua:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch: Estrategia Cache First, luego Network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Si está en cache, devolverlo
                if (response) {
                    return response;
                }
                // Si no, ir a la red
                return fetch(event.request);
            })
    );
});
