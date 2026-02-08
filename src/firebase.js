
// src/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

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

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const requestForToken = async () => {
    try {
        const currentToken = await getToken(messaging, {
            vapidKey: 'BC6eqLiIBfTY0-1mrZP5hWCXk8r86csUEYPAZzJ5gfpxPA_-UTzR6g_fWVigkPyyq0YkGE-x3_OI59vMs6JnHbI'
        });
        if (currentToken) {
            console.log('Current FCM Token:', currentToken);
            return currentToken;
        } else {
            console.log('No registration token available. Request permission to generate one.');
        }
    } catch (err) {
        console.log('An error occurred while retrieving token. ', err);
    }
};

export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            console.log("Payload received: ", payload);
            resolve(payload);
        });
    });


