import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Moon, Sun, Bell, CheckCircle2, Circle, Star, Heart, Cloud, Music } from 'lucide-react';

const AZKAR_MORNING = [
    { text: "أصبحنا وأصبح الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له", count: 1 },
    { text: "اللهم بك أصبحنا، وبك أمسينا، وبك نحيا، وبك نموت، وإليك النشور", count: 1 },
    { text: "رضيت بالله رباً، وبالإسلام ديناً، وبمحمد صلى الله عليه وسلم نبياً", count: 3 },
    { text: "يا حي يا قيوم برحمتك أستغيث أصلح لي شأني كله ولا تكلني إلى نفسي طرفة عين", count: 1 },
    { text: "سبحان الله وبحمده: عدد خلقه، ورضا نفسه، وزنة عرشه، ومداد كلماته", count: 3 }
];

const AZKAR_EVENING = [
    { text: "أمسينا وأمسى الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له", count: 1 },
    { text: "اللهم بك أمسينا، وبك أصبحنا، وبك نحيا، وبك نموت، وإليك المصير", count: 1 },
    { text: "اللهم ما أمسى بي من نعمة أو بأحد من خلقك فمنك وحدك لا شريك لك، فلك الحمد ولك الشكر", count: 1 },
    { text: "أعوذ بكلمات الله التامات من شر ما خلق", count: 3 },
    { text: "اللهم إني أسألك العفو والعافية في الدنيا والآخرة", count: 1 }
];

const PRAYERS = [
    { id: 'fajr', name: 'الفجر', time: 'Fajr' },
    { id: 'dhuh r', name: 'الظهر', time: 'Dhuhr' },
    { id: 'asr', name: 'العصر', time: 'Asr' },
    { id: 'maghrib', name: 'المغرب', time: 'Maghrib' },
    { id: 'isha', name: 'العشاء', time: 'Isha' }
];

export default function IslamicHub() {
    const [view, setView] = useState('main'); // 'main', 'morning', 'evening'
    const [prayerStatus, setPrayerStatus] = useState(() => {
        const saved = localStorage.getItem('prayer_status');
        return saved ? JSON.parse(saved) : {};
    });

    useEffect(() => {
        localStorage.setItem('prayer_status', JSON.stringify(prayerStatus));
    }, [prayerStatus]);

    const togglePrayer = (id) => {
        setPrayerStatus(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <div className="min-h-screen bg-[#0a1a15] text-[#e0e7e1] font-sans selection:bg-emerald-500/30 overflow-x-hidden">
            {/* Background Decorative Elements */}
            <div className="fixed inset-0 pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-600/20 rounded-full blur-[120px]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-5 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
            </div>

            <main className="relative z-10 max-w-2xl mx-auto px-6 py-12">
                <header className="text-center mb-12">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-block p-4 bg-emerald-950/50 rounded-full border border-emerald-500/30 mb-6"
                    >
                        <Star className="text-emerald-400 w-8 h-8 fill-emerald-400/20" />
                    </motion.div>
                    <h1 className="text-4xl font-black mb-2 text-white">واحة الذكر</h1>
                    <p className="text-emerald-400/80 font-medium">"ألا بذكر الله تطمئن القلوب"</p>
                </header>

                <AnimatePresence mode="wait">
                    {view === 'main' ? (
                        <motion.div
                            key="main"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="space-y-8"
                        >
                            {/* Azkar Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setView('morning')}
                                    className="group relative h-40 bg-gradient-to-br from-emerald-900/40 to-emerald-800/20 rounded-3xl border border-emerald-500/20 flex flex-col items-center justify-center gap-3 hover:border-emerald-500/50 transition-all active:scale-95 shadow-lg"
                                >
                                    <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-400 group-hover:scale-110 transition-transform">
                                        <Sun size={32} />
                                    </div>
                                    <span className="font-bold text-lg">أذكار الصباح</span>
                                </button>
                                <button
                                    onClick={() => setView('evening')}
                                    className="group relative h-40 bg-gradient-to-br from-teal-900/40 to-teal-800/20 rounded-3xl border border-teal-500/20 flex flex-col items-center justify-center gap-3 hover:border-teal-500/50 transition-all active:scale-95 shadow-lg"
                                >
                                    <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 group-hover:scale-110 transition-transform">
                                        <Moon size={32} />
                                    </div>
                                    <span className="font-bold text-lg">أذكار المساء</span>
                                </button>
                            </div>

                            {/* Prayer Checklist */}
                            <section className="bg-emerald-950/30 rounded-3xl border border-emerald-500/10 p-8 backdrop-blur-sm">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <Bell className="text-emerald-500" size={20} />
                                    متابعة الصلوات
                                </h3>
                                <div className="space-y-4">
                                    {PRAYERS.map(prayer => (
                                        <div
                                            key={prayer.id}
                                            onClick={() => togglePrayer(prayer.id)}
                                            className="flex items-center justify-between p-4 bg-emerald-900/20 border border-emerald-500/5 rounded-2xl cursor-pointer hover:bg-emerald-900/40 transition-colors group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`p-1.5 rounded-full transition-colors ${prayerStatus[prayer.id] ? 'text-emerald-500' : 'text-emerald-500/30 group-hover:text-emerald-500'}`}>
                                                    {prayerStatus[prayer.id] ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                                                </div>
                                                <span className={`font-bold text-lg ${prayerStatus[prayer.id] ? 'line-through opacity-50' : ''}`}>
                                                    {prayer.name}
                                                </span>
                                            </div>
                                            <span className="text-xs font-mono text-emerald-500/50 uppercase tracking-widest">{prayer.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <footer className="text-center py-8">
                                <button
                                    onClick={() => window.location.reload()}
                                    className="text-emerald-500/50 hover:text-emerald-400 text-sm font-medium transition-colors"
                                >
                                    العودة لشاشة القفل
                                </button>
                            </footer>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="azkar"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="space-y-6"
                        >
                            <button
                                onClick={() => setView('main')}
                                className="mb-6 flex items-center gap-2 text-emerald-400 font-bold hover:underline"
                            >
                                ← العودة للمهام
                            </button>

                            <div className="space-y-6 pb-20">
                                {(view === 'morning' ? AZKAR_MORNING : AZKAR_EVENING).map((zikr, idx) => (
                                    <ZikrCard key={idx} text={zikr.text} count={zikr.count} />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}

function ZikrCard({ text, count }) {
    const [current, setCurrent] = useState(0);
    const isDone = current >= count;

    return (
        <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={() => !isDone && setCurrent(c => c + 1)}
            className={`p-6 rounded-3xl border transition-all cursor-pointer select-none relative overflow-hidden ${isDone
                    ? 'bg-emerald-500/10 border-emerald-500/40 grayscale opacity-60'
                    : 'bg-emerald-950/40 border-emerald-500/20 hover:border-emerald-500/50 shadow-lg shadow-black/20'
                }`}
        >
            <p className="text-xl leading-relaxed text-right font-medium mb-4">{text}</p>
            <div className="flex justify-between items-center">
                <span className="text-xs text-emerald-500/60 font-mono tracking-widest uppercase">Repeat {count}x</span>
                <div className={`px-4 py-1 rounded-full font-bold ${isDone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-500/10 text-emerald-500'}`}>
                    {current} / {count}
                </div>
            </div>
            {isDone && (
                <div className="absolute top-2 left-2">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                </div>
            )}
        </motion.div>
    );
}
