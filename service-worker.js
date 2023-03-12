var cacheName = 'pwaTeste+-v1.2';

self.addEventListener('install', event => {

  self.skipWaiting();

  event.waitUntil(
    caches.open(cacheName)
      .then(cache => cache.addAll([

        '/index.html',

        '/interacao.js',

        '/foto1.png',
        '/download.png',
        '/baixados.png',
        '/22962.png',
        '/icones/48.png',
        '/icones/72.png',
        '/icones/96.png',
        '/icones/144.png',
        '/icones/192.png',
        '/icones/512.png',
        
      ]))
  );
});

self.addEventListener('message', function (event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', function (event) {
  //Atualizacao internet
  event.respondWith(async function () {
     try {
       return await fetch(event.request);
     } catch (err) {
       return caches.match(event.request);
     }
   }());

  //Atualizacao cache
  /*event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );*/

});



importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const CACHE = "pwabuilder-page";

// TODO: replace the following with the correct offline fallback page i.e.: const offlineFallbackPage = "offline.html";
const offlineFallbackPage = "ToDo-replace-this-name.html";

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener('install', async (event) => {
    event.waitUntil(
        caches.open(CACHE)
          .then((cache) => cache.add(offlineFallbackPage))
      );
    });
    
    if (workbox.navigationPreload.isSupported()) {
      workbox.navigationPreload.enable();
    }
    
    self.addEventListener('fetch', (event) => {
      if (event.request.mode === 'navigate') {
        event.respondWith((async () => {
          try {
            const preloadResp = await event.preloadResponse;

            if (preloadResp) {
                return preloadResp;
              }
      
              const networkResp = await fetch(event.request);
              return networkResp;
            } catch (error) {
      
              const cache = await caches.open(CACHE);
              const cachedResp = await cache.match(offlineFallbackPage);
              return cachedResp;
            }
          })());
        }
      });
