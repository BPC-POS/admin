importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyC2H6lpM9Kh6RCsaYirjMuoWnMtn9E3mMA", 
  authDomain: "quan-ly-quan-cafe-pos.firebaseapp.com",
  projectId: "quan-ly-quan-cafe-pos",
  storageBucket: "quan-ly-quan-cafe-pos.appspot.com", 
  messagingSenderId: "379675965297",
  appId: "1:379675965297:web:691b14afd4c6461a57a8d0",
  measurementId: "G-N5ZRZGQXM6"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
const channel = new BroadcastChannel('fcm-notifications');

messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Received background message ', payload);

  const notificationTitle = payload.notification?.title || 'Thông báo mới';
  const notificationOptions = {
    body: payload.notification?.body || 'Bạn có một tin nhắn mới.',
    icon: payload.notification?.image || '/firebase-logo.png', 
    data: {
        url: payload.fcmOptions?.link || '/', 
        messageId: payload.messageId || `bg-${Date.now()}` 
    }
  };

  channel.postMessage({
      type: 'NEW_NOTIFICATION',
      payload: {
          messageId: payload.messageId || `bc-${Date.now()}-${Math.random()}`,
          title: notificationTitle,
          body: notificationOptions.body,
      }
  });

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click Received.', event.notification);
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';
  const messageId = event.notification.data?.messageId;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      let focusedClient = null;
      for (const client of clientList) {
        if ('focus' in client) {
           focusedClient = client;
           break;
        }
      }

      if (focusedClient) {
         focusedClient.postMessage({
             type: 'NOTIFICATION_CLICKED',
             payload: { messageId: messageId, url: urlToOpen } 
         });
         return focusedClient.focus();
      }

      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});