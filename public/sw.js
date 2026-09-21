const CACHE_NAME = "bemylight-shell-v1";
const scopePath = new URL(self.registration.scope).pathname.replace(/\/$/, "");
const STATIC_ASSETS = [
  `${scopePath}/`,
  `${scopePath}/home/`,
  `${scopePath}/icon.svg`,
  `${scopePath}/icon-maskable.svg`,
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  const isSafeStaticAsset =
    url.origin === self.location.origin &&
    (url.pathname.startsWith("/_next/static/") ||
      url.pathname === `${scopePath}/icon.svg` ||
      url.pathname === `${scopePath}/icon-maskable.svg`);

  if (isSafeStaticAsset) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return (
          cached ||
          fetch(event.request).then((response) => {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
            return response;
          })
        );
      }),
    );
  }
});
