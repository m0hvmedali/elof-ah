import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Clock, Search, X, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RelationshipTimer() {
    const [timeElapsed, setTimeElapsed] = useState({});
    const [showMemoryModal, setShowMemoryModal] = useState(false);
    const [memoryMessages, setMemoryMessages] = useState([]);
    const [loadingMemory, setLoadingMemory] = useState(false);

    // Constants
    const START_DATE = new Date('2025-08-24T00:00:00'); // 24 Aug 2025

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const diff = now - START_DATE;

            if (diff > 0) {
                const seconds = Math.floor((diff / 1000) % 60);
                const minutes = Math.floor((diff / (1000 * 60)) % 60);
                const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));

                // Approx calculation for Y/M/W
                const years = Math.floor(days / 365);
                const months = Math.floor((days % 365) / 30);
                const remainingDays = Math.floor((days % 365) % 30); // simplistic

                setTimeElapsed({ years, months, days, hours, minutes, seconds });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const fetchMemoriesAtThisTime = async () => {
        setLoadingMemory(true);
        setShowMemoryModal(true);
        setMemoryMessages([]);

        const now = new Date();
        // Format current time to 12h format roughly matching JSON "6:11 pm"
        // Actually, JSON format is flexible. 
        // Let's rely on matching minutes? Or just Hour?
        // Let's try to match the EXACT string format if possible, OR use text search.
        // Format: "h:mm pm" or "hh:mm am"

        let hours = now.getHours();
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const minutes = now.getMinutes().toString().padStart(2, '0');

        const timeString = `${hours}:${minutes}`; // "11:05"
        // The JSON has "6:11 pm" (with special space sometimes).

        // Let's search for just "11:05" in the time column.

        try {
            // We look for messages containing this time string relative to stored 'time' column
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .ilike('time', `${timeString}%${ampm}%`) // Match "11:05 pm" roughly
                .limit(5);

            if (error) throw error;
            setMemoryMessages(data || []);
        } catch (err) {
            console.error("Error fetching time memories:", err);
        } finally {
            setLoadingMemory(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-6 tracking-wider shadow-sm">Together For</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                <TimeBox value={timeElapsed.years} label="Years" />
                <TimeBox value={timeElapsed.months} label="Months" />
                <TimeBox value={timeElapsed.days} label="Days" />
                <TimeBox value={timeElapsed.hours} label="Hours" />
                <TimeBox value={timeElapsed.minutes} label="Minutes" />
                <TimeBox value={timeElapsed.seconds} label="Seconds" />
            </div>

            <button
                onClick={fetchMemoriesAtThisTime}
                className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium text-white transition duration-300 ease-out border-2 border-pink-500 rounded-full shadow-md group"
            >
                <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-pink-500 group-hover:translate-x-0 ease">
                    <MessageCircle className="w-6 h-6" />
                </span>
                <span className="absolute flex items-center justify-center w-full h-full text-pink-500 transition-all duration-300 transform group-hover:translate-x-full ease">See messages from {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span className="relative invisible">See messages from Now</span>
            </button>

            {/* Memory Modal */}
            <AnimatePresence>
                {showMemoryModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                        onClick={() => setShowMemoryModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-gray-900 border border-gray-700 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-800/50">
                                <h3 className="text-lg font-bold text-pink-400 flex items-center gap-2">
                                    <Clock size={18} />
                                    Memories at this time
                                </h3>
                                <button onClick={() => setShowMemoryModal(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
                            </div>

                            <div className="p-6 max-h-[60vh] overflow-y-auto">
                                {loadingMemory ? (
                                    <div className="flex justify-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                                    </div>
                                ) : memoryMessages.length > 0 ? (
                                    <div className="space-y-4">
                                        {memoryMessages.map((msg, idx) => (
                                            <div key={idx} className={`p-3 rounded-lg ${msg.sender === 'Fav Nana' ? 'bg-pink-500/10 border border-pink-500/30' : 'bg-blue-500/10 border border-blue-500/30'}`}>
                                                <div className="text-xs text-gray-400 mb-1 flex justify-between">
                                                    <span>{msg.date}</span>
                                                    <span>{msg.sender}</span>
                                                </div>
                                                <p className="text-white text-sm">{msg.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <p>No messages found exactly at this minute in your history.</p>
                                        <p className="text-xs mt-2">Try again in a few minutes!</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function TimeBox({ value, label }) {
    return (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-xl flex flex-col items-center min-w-[100px]">
            <span className="text-3xl md:text-4xl font-bold text-pink-400 tabular-nums">
                {String(value || 0).padStart(2, '0')}
            </span>
            <span className="text-xs uppercase tracking-widest text-gray-400 mt-2">{label}</span>
        </div>
    );
}
