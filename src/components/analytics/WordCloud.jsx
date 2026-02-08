import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, MessageCircle, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function WordCloud({ words }) {
    const { currentTheme } = useTheme();
    const [selectedWord, setSelectedWord] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [filteredWords, setFilteredWords] = useState(words.slice(0, 30));

    // Mouse tracking
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth) * 20 - 10,
                y: (e.clientY / window.innerHeight) * 20 - 10
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Search filter
    useEffect(() => {
        if (searchTerm) {
            const filtered = words.filter(w =>
                w.word.toLowerCase().includes(searchTerm.toLowerCase())
            ).slice(0, 30);
            setFilteredWords(filtered);
        } else {
            setFilteredWords(words.slice(0, 30));
        }
    }, [searchTerm, words]);

    const getSize = (count, maxCount) => {
        const minSize = 16;
        const maxSize = 80;
        return Math.floor(minSize + (count / maxCount) * (maxSize - minSize));
    };

    const maxCount = filteredWords[0]?.count || 1;

    const handleWordClick = (word) => {
        setSelectedWord(word);
        // TODO: Fetch actual chat messages containing this word
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 relative overflow-hidden">
            {/* Animated background particles */}
            <motion.div
                className="absolute inset-0 opacity-20"
                animate={{
                    x: mousePosition.x,
                    y: mousePosition.y
                }}
                transition={{ type: 'spring', stiffness: 50, damping: 20 }}
            >
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full"
                        style={{
                            backgroundColor: currentTheme.accent,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`
                        }}
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.3, 0.7, 0.3]
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: i * 0.2
                        }}
                    />
                ))}
            </motion.div>

            {/* Header with icon */}
            <div className="text-center mb-8 relative z-10">
                <motion.div
                    className="inline-block mb-4"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                    <TrendingUp size={64} color={currentTheme.primary} strokeWidth={2} />
                </motion.div>
                <h2 className="text-4xl font-bold text-white mb-2">أكثر الكلمات</h2>
                <p className="text-xl text-white/70">إيه اللي بنقوله دايماً؟</p>
            </div>

            {/* Search Bar */}
            <div className="w-full max-w-md mb-6 relative z-10">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={20} />
                    <input
                        type="text"
                        placeholder="ابحث عن كلمة..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-full px-12 py-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                        style={{ borderColor: currentTheme.accent }}
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>
                {searchTerm && filteredWords.length > 0 && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-white/70 text-sm mt-2 text-center"
                    >
                        وجدنا {filteredWords.length} كلمة
                    </motion.p>
                )}
            </div>

            {/* Word Cloud */}
            <motion.div
                className="w-full max-w-5xl min-h-[500px] bg-gradient-to-br backdrop-blur-lg rounded-3xl p-12 flex flex-wrap items-center justify-center gap-4 relative z-10"
                style={{
                    backgroundImage: `linear-gradient(135deg, ${currentTheme.primary}22, ${currentTheme.secondary}22)`,
                    boxShadow: `0 0 60px ${currentTheme.accent}33`
                }}
                animate={{
                    x: mousePosition.x * 0.5,
                    y: mousePosition.y * 0.5
                }}
                transition={{ type: 'spring', stiffness: 30, damping: 20 }}
            >
                {filteredWords.map((word, index) => (
                    <motion.button
                        key={word.word}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.03, duration: 0.5 }}
                        whileHover={{
                            scale: 1.2,
                            rotate: index % 2 === 0 ? 5 : -5,
                            zIndex: 50
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleWordClick(word)}
                        className="cursor-pointer px-3 py-1 rounded-lg transition-all"
                        style={{
                            fontSize: `${getSize(word.count, maxCount)}px`,
                            color: index < 5 ? currentTheme.primary :
                                index < 15 ? currentTheme.secondary : currentTheme.accent,
                            fontWeight: index < 10 ? 'bold' : 'normal',
                            textShadow: `0 0 20px ${currentTheme.primary}66`,
                            background: selectedWord?.word === word.word ? `${currentTheme.accent}33` : 'transparent'
                        }}
                    >
                        {word.word}
                    </motion.button>
                ))}
            </motion.div>

            {/* Top 3 Stats */}
            <div className="mt-6 grid grid-cols-3 gap-6 text-center relative z-10">
                {filteredWords.slice(0, 3).map((word, i) => (
                    <motion.div
                        key={word.word}
                        className="bg-white/10 backdrop-blur-lg rounded-2xl p-4"
                        whileHover={{ scale: 1.05, y: -5 }}
                        style={{ borderColor: currentTheme.accent, borderWidth: '2px' }}
                    >
                        <div className="flex items-center justify-center mb-2">
                            <MessageCircle size={32} color={currentTheme.primary} />
                        </div>
                        <p className="text-3xl font-bold text-white">{word.word}</p>
                        <p className="text-white/60 text-sm">رقم {i + 1}</p>
                        <p className="text-xl text-white/80">{word.count} مرة</p>
                    </motion.div>
                ))}
            </div>

            {/* Selected Word Modal */}
            {selectedWord && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8"
                    onClick={() => setSelectedWord(null)}
                >
                    <motion.div
                        initial={{ scale: 0.8, y: 50 }}
                        animate={{ scale: 1, y: 0 }}
                        className="bg-gradient-to-br from-purple-900/90 to-pink-900/90 backdrop-blur-xl rounded-3xl p-8 max-w-2xl w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-4xl font-bold text-white mb-2">{selectedWord.word}</h3>
                                <p className="text-white/70">استخدمنا هذه الكلمة {selectedWord.count} مرة</p>
                            </div>
                            <button
                                onClick={() => setSelectedWord(null)}
                                className="p-2 hover:bg-white/10 rounded-full transition"
                            >
                                <X size={24} className="text-white" />
                            </button>
                        </div>

                        <div className="bg-white/10 rounded-2xl p-6">
                            <p className="text-white/60 text-center">
                                🔍 عرض أماكن الكلمة في الشات (قريباً)
                            </p>
                            {/* TODO: Display actual chat messages */}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}
