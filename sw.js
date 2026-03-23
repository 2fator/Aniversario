const CACHE_NAME = 'escola-aniversarios-v11';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './script.js',
    './manifest.json',
    './icon-512.png',
    './style.css'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
    // Força o SW a ativar imediatamente, sem esperar fechar abas
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('PWA: Cacheando arquivos essenciais');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
    // Toma controle de todas as páginas abertas imediatamente
    event.waitUntil(clients.claim());
    console.log('PWA: Service Worker ativado e controlando.');
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
