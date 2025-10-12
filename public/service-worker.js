const CACHE_NAME = 'tareas-cache-v1';
const urlsToCache = ['/','/index.html','/manifest.json','/logo.png'];

// Instala el Service Worker y cachea los archivos estáticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Archivos cacheados');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activa el SW y elimina cachés viejos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Caché antiguo eliminado:', cache);
            return caches.delete(cache);
          }
        })
      )
    )
  );
});

// Intercepta peticiones y responde desde caché cuando no hay conexión
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Devuelve desde caché o realiza la petición si hay conexión
        return response || fetch(event.request);
      })
      .catch(() => {
        return new Response('Sin conexión a Internet');
      })
  );
});
