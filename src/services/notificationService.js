import { supabase } from '../supabaseClient';

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
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker registered:', registration);

      // Request Permission
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        await subscribeUserToPush(registration);
      }
    } catch (error) {
      console.error('Service Worker Error:', error);
    }
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