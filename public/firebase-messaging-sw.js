// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBqCbCIDd-u57t10x_8I9-LbGlDXGy2MKM",
    authDomain: "ssoul-bbfd8.firebaseapp.com",
    databaseURL: "https://ssoul-bbfd8-default-rtdb.firebaseio.com",
    projectId: "ssoul-bbfd8",
    storageBucket: "ssoul-bbfd8.firebasestorage.app",
    messagingSenderId: "1059391922267",
    appId: "1:1059391922267:web:f9ad8495b2c8f481895f7e"
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
