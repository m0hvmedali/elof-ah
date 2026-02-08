import { supabase } from '../supabaseClient';
import { requestForToken } from '../firebase';

const PUBLIC_VAPID_KEY = 'BOtuYGbFRe0Z1zM6XO_i79wrQfNJE7JR85t0O8LT8tC3nCAhA6hP2HFU5OE1ZfJyySS_5xyyVGvSVGVIpPJjqnE';

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

export const registerNotificationService = async () => {
  console.log("Initializing Notification Services...");

  // Check permission state first
  if (Notification.permission === 'default') {
    console.log("Notification permission not yet requested. Waiting for user gesture.");
    return; // Don't request automatically to avoid violation
  }

  // 1. Web Push (Existing)
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker ready:', registration);

      if (Notification.permission === 'granted') {
        await subscribeUserToPush(registration);
      }
    } catch (error) {
      console.error('Web Push registration error:', error);
    }
  }

  // 2. Firebase FCM (New)
  try {
    const token = await requestForToken();
    if (token) {
      console.log("FCM Token secured.");
      const { error } = await supabase
        .from('subscriptions')
        .upsert({
          endpoint: 'FCM:' + token, // Distinct prefix
          keys: { fcm_token: token }
        }, { onConflict: 'endpoint' });

      if (error) console.error('Supabase FCM Save Error:', error);
    }
  } catch (err) {
    console.warn('FCM skipped or failed (Likely missing config):', err.message);
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