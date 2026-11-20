// Fluid Guard — service worker: cache the app shell so Guard loads with no
// network at all. Strategy: precache the shell entry points on install, then
// cache-first for same-origin GET requests with runtime caching of the
// hashed build assets, so the first online visit makes later offline visits
// work. Navigations that miss the cache fall back to the cached shell.
//
// Only same-origin GET requests are handled; Firebase/Google API calls are
// never intercepted or cached.

const CACHE = "fluid-guard-shell-v1";
// Scope-relative: the shell must resolve whether the app is served from a
// domain root or a project-site subpath (the worker's scope covers both).
const SHELL = ["./", "./index.html", "./favicon.svg", "./manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(request, { ignoreSearch: true });
      if (cached) {
        // Refresh in the background so the next visit is current.
        fetch(request)
          .then((response) => {
            if (response.ok) cache.put(request, response.clone());
          })
          .catch(() => {});
        return cached;
      }
      try {
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
      } catch (error) {
        if (request.mode === "navigate") {
          const shell = await cache.match("./index.html");
          if (shell) return shell;
        }
        throw error;
      }
    })(),
  );
});
