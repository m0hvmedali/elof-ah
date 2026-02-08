import React from 'react';
import { motion } from 'framer-motion';

export default function WordCloud({ words }) {
    // Get top 30 words for display
    const topWords = words.slice(0, 30);

    // Calculate size based on count (min 16px, max 80px)
    const getSize = (count, maxCount) => {
        const minSize = 16;
        const maxSize = 80;
        return Math.floor(minSize + (count / maxCount) * (maxSize - minSize));
    };

    const maxCount = topWords[0]?.count || 1;

    // Color palette
    const colors = [
        '#ff6b9d', '#c44569', '#f8b500', '#feca57',
        '#48dbfb', '#0abde3', '#10ac84', '#00d2d3',
        '#ee5a6f', '#f368e0', '#a29bfe', '#6c5ce7'
    ];

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8">
            <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-white mb-2">💬 أكثر الكلمات</h2>
                <p className="text-xl text-white/70">إيه اللي بنقوله دايماً؟</p>
            </div>

            <div className="w-full max-w-5xl min-h-[500px] bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-lg rounded-3xl p-12 flex flex-wrap items-center justify-center gap-4">
                {topWords.map((word, index) => (
                    <motion.div
                        key={word.word}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05, duration: 0.5 }}
                        whileHover={{ scale: 1.1, rotate: index % 2 === 0 ? 5 : -5 }}
                        className="cursor-pointer"
                        style={{
                            fontSize: `${getSize(word.count, maxCount)}px`,
                            color: colors[index % colors.length],
                            fontWeight: index < 10 ? 'bold' : 'normal',
                            textShadow: '0 0 10px rgba(255,255,255,0.3)'
                        }}
                    >
                        {word.word}
                    </motion.div>
                ))}
            </div>

            <div className="mt-6 grid grid-cols-3 gap-6 text-center">
                <div className="bg-white/10 rounded-2xl p-4">
                    <p className="text-3xl font-bold text-white">{topWords[0]?.word}</p>
                    <p className="text-white/60 text-sm">الكلمة رقم 1</p>
                    <p className="text-xl text-white/80">{topWords[0]?.count} مرة</p>
                </div>
                <div className="bg-white/10 rounded-2xl p-4">
                    <p className="text-3xl font-bold text-white">{topWords[1]?.word}</p>
                    <p className="text-white/60 text-sm">الكلمة رقم 2</p>
                    <p className="text-xl text-white/80">{topWords[1]?.count} مرة</p>
                </div>
                <div className="bg-white/10 rounded-2xl p-4">
                    <p className="text-3xl font-bold text-white">{topWords[2]?.word}</p>
                    <p className="text-white/60 text-sm">الكلمة رقم 3</p>
                    <p className="text-xl text-white/80">{topWords[2]?.count} مرة</p>
                </div>
            </div>
        </div>
    );
}
