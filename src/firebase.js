
// src/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDzqi7T4Roa4_a5V5xBtYW98bFdvECf1gk",
    authDomain: "jana-elsaid.firebaseapp.com",
    projectId: "jana-elsaid",
    storageBucket: "jana-elsaid.firebasestorage.app",
    messagingSenderId: "570721974863",
    appId: "1:570721974863:web:f0ff516cd236c4e1f1083a"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const requestForToken = async () => {
    try {
        const currentToken = await getToken(messaging, {
            vapidKey: 'BI8uuxvMTw0Zx6OVXzxksA7Zn4tfIzvRKZpr40gf23a0shLgTOVZcQL1pMJSRm2QwAMkQ9NKfOUHM9ZORhbJxzc'
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


