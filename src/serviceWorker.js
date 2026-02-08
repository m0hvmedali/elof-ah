// Service Worker
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Handle Push Notification
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};

  const title = data.title || 'رسالة جديدة ❤️';
  const options = {
    body: data.body || 'لديك رسالة جديدة من حبيبك',
    icon: '/heart-icon.png',
    badge: '/heart-icon.png',
    vibrate: [100, 50, 100],
    data: {
      url: '/' // Open home page on click
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle Notification Click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});