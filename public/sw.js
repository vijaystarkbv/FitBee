/**
 * FitBee Service Worker
 * Handles background push notifications, system action clicks, and deep linking.
 */

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  if (!event.data) return;

  let payload = {};
  try {
    payload = event.data.json();
  } catch (err) {
    payload = {
      title: 'FitBee',
      body: event.data.text() || 'You have updates waiting in FitBee.',
    };
  }

  const title = payload.title || 'FitBee';
  const options = {
    body: payload.body || '',
    icon: payload.icon || '/favicon.svg',
    badge: payload.badge || '/favicon.svg',
    tag: payload.tag || 'fitbee-reminder',
    renotify: true,
    data: {
      url: payload.url || '/',
      state: payload.state || 'GENERAL',
      messageId: payload.messageId,
      timestamp: Date.now(),
    },
    actions: payload.actions || [
      {
        action: 'open',
        title: 'Open FitBee',
      },
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetPath = (event.notification.data && event.notification.data.url) || '/';

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // If an open client is found, focus it and navigate
        for (const client of clientList) {
          if ('focus' in client) {
            client.focus();
            if (targetPath && targetPath !== '/') {
              client.postMessage({
                type: 'FITBEE_NAVIGATE',
                url: targetPath,
              });
            }
            return;
          }
        }
        // If no client is open, open a new window with the deep link target
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetPath);
        }
      })
  );
});
