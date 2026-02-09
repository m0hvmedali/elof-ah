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
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/heart-icon.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
