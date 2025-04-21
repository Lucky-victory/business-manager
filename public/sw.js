// Service Worker for Biz Manager PWA

const CACHE_NAME = "biz-manager-v1";
const OFFLINE_URL = "/offline";

// Assets to cache
const ASSETS_TO_CACHE = [
  "/",
  "/offline",
  "/manifest.json",
  "/favicon.ico",
  "/icons/icon-72x72.png",
  "/icons/icon-96x96.png",
  "/icons/icon-128x128.png",
  "/icons/icon-144x144.png",
  "/icons/icon-152x152.png",
  "/icons/icon-192x192.png",
  "/icons/icon-384x384.png",
  "/icons/icon-512x512.png",
  // Add CSS and JS files that are critical for the app
];

// Install event - cache assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Opened cache");
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .catch((error) => {
        console.error("Pre-caching failed:", error);
      })
  );
  // Activate the SW immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Ensure the SW takes control immediately
  self.clients.claim();
});

// Fetch event - serve from cache or network
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return;
  }

  // For HTML requests - network first, fallback to offline page
  if (event.request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache the latest version
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // If network fails, try to serve from cache
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // If not in cache, serve the offline page
            return caches.match(OFFLINE_URL);
          });
        })
    );
    return;
  }

  // For other requests - cache first, network fallback
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      // If not in cache, fetch from network
      return fetch(event.request)
        .then((response) => {
          // Cache the new response
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch((error) => {
          console.error("Fetch failed:", error);
          // For image requests, return a default offline image
          if (event.request.destination === "image") {
            return caches.match("/icons/offline-image.png");
          }
          // For other assets, just propagate the error
          throw error;
        });
    })
  );
});

// Handle push notifications
self.addEventListener("push", (event) => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-72x72.png",
    data: {
      url: data.url || "/",
    },
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(clients.openWindow(event.notification.data.url));
});
