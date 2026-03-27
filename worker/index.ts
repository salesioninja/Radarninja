/// <reference lib="webworker" />

export {};

const sw = self as unknown as ServiceWorkerGlobalScope;

sw.addEventListener('push', (event: PushEvent) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Nova Promoção Ninja!';
  const options = {
    body: data.body || 'Confira essa novidade imperdível.',
    icon: data.icon || '/icon512_maskable.png',
    image: data.image,
    badge: '/icon512_maskable.png',
    data: {
      url: data.url || '/',
    },
  };

  event.waitUntil(sw.registration.showNotification(title, options));
});

sw.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();
  const urlToOpen = new URL(event.notification.data.url || '/', sw.location.origin).href;

  event.waitUntil(
    sw.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if ('url' in client && client.url === urlToOpen && 'focus' in client) {
          return (client as any).focus();
        }
      }
      if (sw.clients.openWindow) {
        return sw.clients.openWindow(urlToOpen);
      }
    })
  );
});
