import { supabase } from '../supabaseClient';
import { requestForToken } from '../firebase';

const PUBLIC_VAPID_KEY = 'BI8uuxvMTw0Zx6OVXzxksA7Zn4tfIzvRKZpr40gf23a0shLgTOVZcQL1pMJSRm2QwAMkQ9NKfOUHM9ZORhbJxzc';

// Convert VAPID key to Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const registerNotificationService = async (forceRequest = false) => {
  console.log("Initializing Notification Services...");

  // Request permission if forced (e.g., from Settings) OR if already granted
  if (forceRequest && Notification.permission === 'default') {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return;
  } else if (Notification.permission === 'default') {
    console.log("Notification permission not yet requested. Use Settings to enable.");
    return;
  }

  // 1. Web Push (Existing)
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('Service Worker registered:', registration);

      // CRITICAL: Wait for worker to be active before subscribing
      const readyRegistration = await navigator.serviceWorker.ready;
      console.log('Service Worker ready and active:', readyRegistration);

      if (Notification.permission === 'granted') {
        await subscribeUserToPush(readyRegistration);
      }
    } catch (error) {
      console.error('Web Push registration error:', error);
    }
  }

  // 2. Firebase FCM (New)
  try {
    const token = await requestForToken();
    if (token && Notification.permission === 'granted') {
      console.log("FCM Token secured.");
      await supabase
        .from('subscriptions')
        .upsert({
          endpoint: 'FCM:' + token, // Distinct prefix
          keys: { fcm_token: token }
        }, { onConflict: 'endpoint' });
    }
  } catch (err) {
    console.warn('FCM skipped or failed:', err.message);
  }
};

const subscribeUserToPush = async (registration) => {
  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
    });

    console.log('Push Subscription:', subscription);

    // Save to Supabase
    const { error } = await supabase
      .from('subscriptions')
      .upsert({
        endpoint: subscription.endpoint,
        keys: subscription.toJSON().keys
      }, { onConflict: 'endpoint' });

    if (error) console.error('Supabase Subscribe Error:', error);

  } catch (error) {
    if (error.message.includes('applicationServerKey')) {
      console.warn('VAPID Key missing or invalid. Please configure it.');
    } else {
      console.error('Failed to subscribe user:', error);
    }
  }
};

export const showNotification = (title, body) => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.showNotification(title || 'رسالة حب ❤️', {
        body: body || 'أحبك!',
        icon: '/heart-icon.png',
        vibrate: [200, 100, 200]
      });
    });
  }
};