import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// --- Configuration ---
const SUPABASE_URL = 'https://pawwqdaiucbvohsgmtop.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhd3dxZGFpdWNidm9oc2dtdG9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMTQ5MDgsImV4cCI6MjA3ODc5MDkwOH0.EuNNd8Cj9TBxJvmPARhhR1J1KPwoS3X46msX-MhriRk';

const BATCH_SIZE = 500; // Supabase has a request size limit, keep batches reasonable

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to your large JSON file
const JSON_FILE_PATH = path.join(__dirname, '../public/chat.json');

async function migrateMessages() {
    console.log('Starting migration using native fetch...');

    try {
        const fileContent = fs.readFileSync(JSON_FILE_PATH, 'utf-8');
        const messages = JSON.parse(fileContent);

        // Helper to parse date/time "29/08/25" "1:02 am" -> ISO string
        const parseDateTime = (dateStr, timeStr) => {
            try {
                if (!dateStr || !timeStr) return null;

                // Parse Date: DD/MM/YY
                const [day, month, yearShort] = dateStr.split('/');
                const year = '20' + yearShort; // Assume 20xx

                // Parse Time: H:MM am/pm
                // Remove special chars like â€¯ (narrow no-break space) often found in time strings
                const cleanedTime = timeStr.replace(/[^\x00-\x7F]/g, "").trim();
                const match = cleanedTime.match(/(\d+):(\d+)\s*(am|pm)/i);

                if (!match) return null;

                let [_, hours, minutes, meridiem] = match;
                hours = parseInt(hours, 10);
                minutes = parseInt(minutes, 10);

                if (meridiem.toLowerCase() === 'pm' && hours < 12) hours += 12;
                if (meridiem.toLowerCase() === 'am' && hours === 12) hours = 0;

                // Create Date object (UTC or Local? Assuming Local for now, Supabase will store as Timestamptz)
                // We can just construct ISO string roughly
                const d = new Date(year, month - 1, day, hours, minutes, 0);
                return d.toISOString();
            } catch (e) {
                console.error('Date parse error:', dateStr, timeStr, e);
                return null; // Fail safe
            }
        }

        // Pre-process messages
        const validMessages = messages.map(msg => {
            if (!msg.datetime) {
                msg.datetime = parseDateTime(msg.date, msg.time) || new Date().toISOString(); // Fallback to now if fail
            }
            return msg;
        }).filter(msg => msg.datetime !== null);

        console.log(`Processing ${validMessages.length} valid messages (filtered from ${messages.length})`);

        let totalInserted = 0;

        for (let i = 0; i < validMessages.length; i += BATCH_SIZE) {
            const batch = validMessages.slice(i, i + BATCH_SIZE);

            try {
                const response = await fetch(`${SUPABASE_URL}/rest/v1/messages`, {
                    method: 'POST',
                    headers: {
                        'apikey': SUPABASE_KEY,
                        'Authorization': `Bearer ${SUPABASE_KEY}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=minimal' // Don't return the inserted rows to save bandwidth
                    },
                    body: JSON.stringify(batch)
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`Error inserting batch ${i / BATCH_SIZE + 1}: ${response.status} ${response.statusText}`, errorText);
                    // If error is 409 (conflict) or similar, maybe continue? 
                    // For now, logging error.
                } else {
                    totalInserted += batch.length;
                    console.log(`Inserted ${totalInserted} / ${messages.length} messages...`);
                }
            } catch (networkError) {
                console.error(`Network error on batch ${i / BATCH_SIZE + 1}:`, networkError);
            }
        }

        console.log('Migration complete!');
    } catch (err) {
        console.error('Migration failed:', err);
    }
}

migrateMessages();
