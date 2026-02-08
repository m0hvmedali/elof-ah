import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, BarChart3, MessageSquare } from 'lucide-react';
import StoryViewer from '../components/analytics/StoryViewer';
import WordCloud from '../components/analytics/WordCloud';
import ActiveHoursChart from '../components/analytics/ActiveHoursChart';
import { useTheme } from '../context/ThemeContext';

export default function Analytics() {
    const navigate = useNavigate();
    const { currentTheme, isTransitioning } = useTheme();
    const [analytics, setAnalytics] = useState(null);
    const [showStories, setShowStories] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Mouse tracking for parallax
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

    useEffect(() => {
        fetch('/analytics_results.json')
            .then(res => res.json())
            .then(data => setAnalytics(data))
            .catch(err => console.error('Failed to load analytics:', err));
    }, []);

    if (!analytics) {
        return (
            <div
                className={`min-h-screen bg-gradient-to-br ${currentTheme.bg} flex items-center justify-center transition-all duration-1000`}
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                    <BarChart3 size={64} color={currentTheme.primary} />
                </motion.div>
            </div>
        );
    }

    const stories = [
        {
            component: (
                <div className="text-center text-white">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                    >
                        <Sparkles size={80} color={currentTheme.primary} className="mx-auto mb-6" />
                    </motion.div>
                    <h1 className="text-6xl font-bold mb-6">📊 تحليل المحادثات</h1>
                    <p className="text-2xl mb-4">رحلة عبر {analytics.totalMessages.toLocaleString()} رسالة</p>
                    <p className="text-xl text-white/70">من {analytics.dateRange.start} إلى {analytics.dateRange.end}</p>
                    <motion.div
                        className="mt-12 text-8xl"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        💕
                    </motion.div>
                </div>
            )
        },
        {
            component: <WordCloud words={analytics.topWords} />
        },
        {
            component: <ActiveHoursChart data={analytics.activeHours} />
        },
        {
            component: (
                <div className="text-center text-white">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 100 }}
                    >
                        <Sparkles size={100} color={currentTheme.accent} className="mx-auto mb-8" />
                    </motion.div>
                    <h1 className="text-5xl font-bold mb-8">🎉 النهاية</h1>
                    <p className="text-2xl mb-6">شفنا إزاي علاقتنا جميلة!</p>
                    <button
                        onClick={() => setShowStories(false)}
                        className="mt-8 px-8 py-4 rounded-full text-xl font-bold hover:scale-110 transition"
                        style={{
                            background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
                            boxShadow: `0 8px 24px ${currentTheme.accent}66`
                        }}
                    >
                        رجوع للصفحة الرئيسية
                    </button>
                </div>
            )
        }
    ];

    return (
        <motion.div
            className={`min-h-screen bg-gradient-to-br ${currentTheme.bg} transition-all duration-1000 relative overflow-hidden`}
            animate={{
                opacity: isTransitioning ? 0.7 : 1
            }}
        >
            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full"
                        style={{
                            backgroundColor: i % 3 === 0 ? currentTheme.primary :
                                i % 3 === 1 ? currentTheme.secondary : currentTheme.accent,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            x: [0, Math.random() * 20 - 10, 0],
                            scale: [1, 1.5, 1],
                            opacity: [0.3, 0.8, 0.3]
                        }}
                        transition={{
                            duration: 3 + Math.random() * 3,
                            repeat: Infinity,
                            delay: i * 0.1
                        }}
                    />
                ))}
            </div>

            {!showStories ? (
                <div className="flex items-center justify-center min-h-screen p-8 relative z-10">
                    <motion.div
                        className="text-center"
                        animate={{
                            x: mousePosition.x * 0.5,
                            y: mousePosition.y * 0.5
                        }}
                        transition={{ type: 'spring', stiffness: 50 }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <BarChart3 size={80} color={currentTheme.primary} className="mx-auto mb-6" />
                            <h1 className="text-6xl font-bold text-white mb-6">📊 تحليلات المحادثة</h1>
                            <p className="text-2xl text-white/80 mb-12">
                                اكتشف أسرار محادثاتنا معاً!
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 mb-12">
                            <motion.div
                                whileHover={{ scale: 1.05, y: -10 }}
                                className="bg-white/10 backdrop-blur-lg rounded-3xl p-8"
                                style={{
                                    border: `2px solid ${currentTheme.accent}66`,
                                    boxShadow: `0 8px 32px ${currentTheme.primary}33`
                                }}
                            >
                                <MessageSquare size={48} className="mx-auto mb-4" color={currentTheme.primary} />
                                <div className="text-4xl font-bold text-white">{analytics.totalMessages.toLocaleString()}</div>
                                <div className="text-white/70">رسالة</div>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.05, y: -10 }}
                                className="bg-white/10 backdrop-blur-lg rounded-3xl p-8"
                                style={{
                                    border: `2px solid ${currentTheme.accent}66`,
                                    boxShadow: `0 8px 32px ${currentTheme.secondary}33`
                                }}
                            >
                                <Sparkles size={48} className="mx-auto mb-4" color={currentTheme.secondary} />
                                <div className="text-4xl font-bold text-white">{analytics.topWords[0]?.word}</div>
                                <div className="text-white/70">أكثر كلمة</div>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.05, y: -10 }}
                                className="bg-white/10 backdrop-blur-lg rounded-3xl p-8"
                                style={{
                                    border: `2px solid ${currentTheme.accent}66`,
                                    boxShadow: `0 8px 32px ${currentTheme.accent}33`
                                }}
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                    className="mx-auto mb-4"
                                >
                                    🌙
                                </motion.div>
                                <div className="text-4xl font-bold text-white">1 AM</div>
                                <div className="text-white/70">أنشط وقت</div>
                            </motion.div>
                        </div>

                        <motion.button
                            onClick={() => setShowStories(true)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="mt-8 px-12 py-6 rounded-full text-2xl font-bold text-white shadow-2xl"
                            style={{
                                background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
                                boxShadow: `0 12px 40px ${currentTheme.accent}66`
                            }}
                        >
                            ابدأ الرحلة! 🚀
                        </motion.button>
                    </motion.div>
                </div>
            ) : (
                <StoryViewer
                    stories={stories}
                    onClose={() => {
                        setShowStories(false);
                        navigate('/');
                    }}
                />
            )}
        </motion.div>
    );
}
