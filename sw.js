const CACHE_NAME = 'escola-aniversarios-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './script.js',
    './manifest.json',
    './icon-512.png'
    // Se tiver um arquivo style.css, adicione aqui: './style.css'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('PWA: Cacheando arquivos essenciais');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// Interceptar requisições (Offline First)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Retorna do cache se existir, senão busca na rede
                return response || fetch(event.request);
            })
    );
});