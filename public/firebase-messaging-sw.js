// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDzqi7T4Roa4_a5V5xBtYW98bFdvECf1gk",
    authDomain: "jana-elsaid.firebaseapp.com",
    projectId: "jana-elsaid",
    storageBucket: "jana-elsaid.firebasestorage.app",
    messagingSenderId: "570721974863",
    appId: "1:570721974863:web:f0ff516cd236c4e1f1083a"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification.title || 'رسالة جديدة ❤️';
    const notificationOptions = {
        body: payload.notification.body || 'لديك رسالة جديدة من حبيبك',
        icon: '/heart-icon.png',
        badge: '/heart-icon.png',
        vibrate: [200, 100, 200]
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Also handle standard Web Push events for compatibility
self.addEventListener('push', (event) => {
    if (event.data) {
        try {
            const data = event.data.json();
            const title = data.title || 'رسالة جديدة ❤️';
            const options = {
                body: data.body || 'لديك رسالة جديدة من حبيبك',
                icon: '/heart-icon.png',
                badge: '/heart-icon.png',
                vibrate: [100, 50, 100]
            };
            event.waitUntil(self.registration.showNotification(title, options));
        } catch (e) {
            console.log('Push event data is not JSON, might be FCM internal.');
        }
    }
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            if (clientList.length > 0) return clientList[0].focus();
            return clients.openWindow('/');
        })
    );
});
