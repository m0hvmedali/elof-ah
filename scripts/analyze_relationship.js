import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CHAT_PATH = path.join(__dirname, '../public/chat.json');
const OUTPUT_PATH = path.join(__dirname, '../public/relationship_memory.json');

async function analyze() {
    console.log("Starting Deep Relationship Analysis...");

    const memory = {
        personalities: {
            jana: { keywords: [], tone: "", intensity: 0 },
            ahmed: { keywords: [], tone: "", intensity: 0 }
        },
        milestones: [],
        likes: { jana: [], ahmed: [] },
        dislikes: { jana: [], ahmed: [] },
        common_words: {},
        interaction_stats: { intensity_by_hour: {}, total_messages: 0 }
    };

    const keywords = {
        jana_identifiers: ['Lana', 'جنى'],
        ahmed_identifiers: ['Ahmed'],
        likes: ['بحب', 'أحب', 'بموت في', 'أعشق', 'love', 'عاجبني', 'نفسي في'],
        dislikes: ['بكره', 'مش بحب', 'مبقتش طايق', 'ضايقني', 'زعلت', 'hate', 'كفاية'],
        milestones: ['أول مرة', 'فاكر لما', 'ذكرى', 'عيد ميلاد', 'خطوبة', 'بداية', 'اتعرفنا', 'كتبنا'],
        emojis: {
            romantic: ['❤️', '💖', '🥰', '😘', '💍'],
            playful: ['😂', '🤣', '😜', '👻'],
            sad: ['😢', '😔', '💔']
        }
    };

    try {
        if (!fs.existsSync(CHAT_PATH)) {
            console.error("Chat file not found!");
            return;
        }

        const rawData = fs.readFileSync(CHAT_PATH, 'utf8');
        const chat = JSON.parse(rawData);
        memory.interaction_stats.total_messages = chat.length;

        chat.forEach((msg, idx) => {
            const text = msg.text || '';
            const sender = msg.sender || '';
            const isJana = keywords.jana_identifiers.some(id => sender.includes(id));
            const target = isJana ? 'jana' : 'ahmed';

            // Extract Preference (Likes)
            keywords.likes.forEach(k => {
                if (text.includes(k) && text.length < 60) {
                    memory.likes[target].push({ text, date: msg.date });
                }
            });

            // Extract Preference (Dislikes)
            keywords.dislikes.forEach(k => {
                if (text.includes(k) && text.length < 60) {
                    memory.dislikes[target].push({ text, date: msg.date });
                }
            });

            // Extract Milestones (Contextual)
            keywords.milestones.forEach(k => {
                if (text.includes(k)) {
                    memory.milestones.push({ text, date: msg.date, sender });
                }
            });

            // Simple Emoji Analysis for Personality
            keywords.emojis.romantic.forEach(e => { if (text.includes(e)) memory.personalities[target].intensity++; });
        });

        // Cleanup and Deduplicate
        const unique = (arr) => {
            const seen = new Set();
            return arr.filter(item => {
                const k = item.text.trim();
                if (seen.has(k)) return false;
                seen.add(k);
                return true;
            }).slice(-40); // Keep last 40 most "recent" entries
        };

        memory.likes.jana = unique(memory.likes.jana);
        memory.likes.ahmed = unique(memory.likes.ahmed);
        memory.dislikes.jana = unique(memory.dislikes.jana);
        memory.dislikes.ahmed = unique(memory.dislikes.ahmed);
        memory.milestones = unique(memory.milestones);

        // Save Results
        fs.writeFileSync(OUTPUT_PATH, JSON.stringify(memory, null, 2));
        console.log(`Analysis Complete! Metadata saved to ${OUTPUT_PATH}`);

    } catch (e) {
        console.error("Critical error in analysis script:", e);
    }
}

analyze();
