// Ancienne copie retirée : ce service worker efface le cache et se désinstalle,
// pour que les téléphones qui avaient installé l'ancienne version ne l'affichent plus.
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (keys) { return Promise.all(keys.map(function (k) { return caches.delete(k); })); })
      .then(function () { return self.registration.unregister(); })
      .then(function () { return self.clients.matchAll({ type: 'window' }); })
      .then(function (clients) { clients.forEach(function (c) { c.navigate('https://idea-chartrons.vercel.app/'); }); })
  );
});
