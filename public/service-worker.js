// 1️⃣ Install event - cache app assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open('estore-cache-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/favicon.ico',
        '/manifest.json',
        '/static/js/main.js',
        '/static/css/main.css',
        '/logo192.png'
        // add any product images here
      ]);
    })
  );
});

// 2️⃣ Activate event
self.addEventListener('activate', (event) => {
  console.log('[SW] Activated');
  event.waitUntil(self.clients.claim());
});

// 3️⃣ Fetch event - serve cached files or network
self.addEventListener('fetch', (event) => {
  console.log('[SW] Fetching:', event.request.url);
  event.respondWith(
    caches.match(event.request).then((cachedRes) => {
      return cachedRes || fetch(event.request);
    })
  );
});

// 4️⃣ Sync event - background sync for offline orders
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-orders') {
    console.log('[SW] Syncing orders...');
    event.waitUntil(syncOrders());
  }
});

// Dummy function to simulate sending offline orders
async function syncOrders() {
  console.log('[SW] Orders would be sent to server here.');
  // In a real app, fetch offline orders from IndexedDB and send to server
}

// 5️⃣ Push event - show notifications
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { title: 'No title', body: 'No body' };
  
  if (Notification.permission === 'granted') {
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/favicon.ico'
      })
    );
  } else {
    console.log('[SW] Notification permission not granted');
  }
});