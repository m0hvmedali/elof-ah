import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase (Admin Context)
// Initialize Supabase (Admin Context)
// Support both standard and VITE_ prefixed env vars for flexibility between local/Vercel
const supabase = createClient(
    process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

// VAPID Keys
const publicVapidKey = process.env.VAPID_PUBLIC_KEY || process.env.VITE_VAPID_PUBLIC_KEY || 'BOtuYGbFRe0Z1zM6XO_i79wrQfNJE7JR85t0O8LT8tC3nCAhA6hP2HFU5OE1ZfJyySS_5xyyVGvSVGVIpPJjqnE';
const privateVapidKey = process.env.VAPID_PRIVATE_KEY || process.env.VITE_VAPID_PRIVATE_KEY || 'FgDsHXyTAXJ8-y4cpu8M7rv64EzYC9RxCB0Dmq_1o1k';

if (!publicVapidKey || !privateVapidKey) {
    console.warn("VAPID keys are missing! Push notifications will fail.");
}

webpush.setVapidDetails(
    'mailto:mohamedalix546@gmail.com',
    publicVapidKey,
    privateVapidKey
);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { title, body, password } = req.body;

    // Simple Security Check
    if (password !== '0000') { // Simplified check, ideally verify against DB
        // We can fetch DB setting here too
        const { data } = await supabase.from('app_settings').select('value').eq('key', 'admin_password').single();
        if (!data || data.value !== password) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    }

    try {
        // 1. Get all subscriptions
        const { data: subscriptions, error } = await supabase
            .from('subscriptions')
            .select('*');

        if (error) {
            console.error("Supabase error fetching subscriptions:", error);
            throw error;
        }

        if (!subscriptions || subscriptions.length === 0) {
            console.log("No subscriptions found to notify.");
            return res.status(200).json({ message: 'No subscriptions found' });
        }

        // 2. Send Notification to all
        const payload = JSON.stringify({ title, body });

        const promises = subscriptions.map(sub => {
            const pushConfig = {
                endpoint: sub.endpoint,
                keys: sub.keys
            };
            return webpush.sendNotification(pushConfig, payload).catch(err => {
                if (err.statusCode === 410 || err.statusCode === 404) {
                    console.log(`Deleting expired/invalid subscription: ${sub.endpoint}`);
                    return supabase.from('subscriptions').delete().eq('endpoint', sub.endpoint);
                }
                console.error("Error sending to subscription:", sub.endpoint, err);
                return null;
            });
        });

        await Promise.all(promises);

        res.status(200).json({ message: 'Sent successfully', count: subscriptions.length });
    } catch (error) {
        console.error("Critical error in sendPush handler:", error);
        res.status(500).json({
            message: 'Error sending notifications',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}
