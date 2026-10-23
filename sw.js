// Service worker mínimo (necessário para instalar como PWA). Sem cache offline por enquanto.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});
