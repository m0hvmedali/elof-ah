import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase (Admin Context)
const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
    // Note: ideally utilize SERVICE_ROLE_KEY for admin tasks, 
    // but RLS 'public insert' allows us to read for now if policy allows.
    // User wants simple setup.
);

// VAPID Keys (Environment Variables are best, but for now placeholders)
const publicVapidKey = process.env.VITE_VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.VITE_VAPID_PRIVATE_KEY;

if (publicVapidKey && privateVapidKey) {
    webpush.setVapidDetails(
        'mailto:test@test.com',
        publicVapidKey,
        privateVapidKey
    );
}

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

        if (error) throw error;

        // 2. Send Notification to all
        const payload = JSON.stringify({ title, body });

        const promoises = subscriptions.map(sub => {
            const pushConfig = {
                endpoint: sub.endpoint,
                keys: sub.keys
            };
            return webpush.sendNotification(pushConfig, payload).catch(err => {
                if (err.statusCode === 410) {
                    // Delete invalid subscription
                    supabase.from('subscriptions').delete().eq('endpoint', sub.endpoint);
                }
                console.error(err);
            });
        });

        await Promise.all(promoises);

        res.status(200).json({ message: 'Sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sending notifications', error: error.message });
    }
}
