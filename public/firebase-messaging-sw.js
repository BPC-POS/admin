
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyC2H6lpM9Kh6RCsaYirjMuoWnMtn9E3mMA",
  authDomain: "quan-ly-quan-cafe-pos.firebaseapp.com",
  projectId: "quan-ly-quan-cafe-pos",
  storageBucket: "quan-ly-quan-cafe-pos.firebasestorage.app",
  messagingSenderId: "379675965297",
  appId: "1:379675965297:web:691b14afd4c6461a57a8d0",
  measurementId: "G-N5ZRZGQXM6"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging(); 

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification?.title || 'Thông báo mới'; 
  const notificationOptions = {
    body: payload.notification?.body || 'Bạn có một tin nhắn mới.', 
    icon: payload.notification?.image || '/firebase-logo.png', 
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click Received.', event.notification);
  event.notification.close();
});