import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, Camera, Calendar, CheckCircle2, XCircle, RefreshCw, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

const importantDates = [
    { date: '2025-08-24', label: 'بدأنا سوا ❤️', hint: 'تاريخ بداية كل حاجة حلوة' },
    { date: '2026-02-08', label: 'عيد ميلاد جنى 🎂', hint: 'أجمل يوم في السنة' },
    { date: '2025-08-29', label: 'أول شات بينا 💬', hint: 'بداية الكلام والرغي' },
];

const albumPhotos = [
    { url: '/WhatsApp Image 2026-02-07 at 5.33.18 PM.jpeg', label: 'لحظة حلوة' },
    { url: '/WhatsApp Image 2026-02-07 at 5.35.23 PM.jpeg', label: 'ضحكة من القلب' },
    { url: '/WhatsApp Image 2026-02-07 at 5.40.31 PM.jpeg', label: 'ذكرياتنا' },
    { url: '/WhatsApp Image 2026-02-07 at 6.00.18 PM.jpeg', label: 'يوم مميز' },
    { url: '/bb.jpeg', label: 'Cute Moment' },
    { url: '/h.jpeg', label: 'Beautiful Jana' },
    { url: '/k.jpeg', label: 'Memories' },
];

export default function GamePage() {
    const [gameMode, setGameMode] = useState(null); // 'photos' or 'dates'
    const [currentLevel, setCurrentLevel] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [feedback, setFeedback] = useState(null); // 'correct' or 'wrong'
    const [selectedAnswer, setSelectedAnswer] = useState(null);

    const startPhotoGame = () => {
        setGameMode('photos');
        setCurrentLevel(0);
        setScore(0);
        setShowResult(false);
    };

    const startDateGame = () => {
        setGameMode('dates');
        setCurrentLevel(0);
        setScore(0);
        setShowResult(false);
    };

    const handleAnswer = (isCorrect, index) => {
        if (selectedAnswer !== null) return;
        setSelectedAnswer(index);

        if (isCorrect) {
            setScore(s => s + 1);
            setFeedback('correct');
            confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.7 }
            });
        } else {
            setFeedback('wrong');
        }

        setTimeout(() => {
            setFeedback(null);
            setSelectedAnswer(null);
            if (currentLevel < (gameMode === 'photos' ? albumPhotos.length : importantDates.length) - 1) {
                setCurrentLevel(l => l + 1);
            } else {
                setShowResult(true);
            }
        }, 1500);
    };

    const renderPhotoGame = () => {
        const currentPhoto = albumPhotos[currentLevel];
        const options = [...albumPhotos]
            .filter(p => p.url !== currentPhoto.url)
            .sort(() => 0.5 - Math.random())
            .slice(0, 2);
        options.push(currentPhoto);
        const shuffledOptions = options.sort(() => 0.5 - Math.random());

        return (
            <div className="flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-pink-400 mb-8"
                >
                    <img src={currentPhoto.url} alt="Guess" className="w-full h-full object-cover" />
                    <div className="absolute top-4 right-4 bg-pink-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                        مستوى {currentLevel + 1}
                    </div>
                </motion.div>

                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">أي وصف يناسب الصورة دي؟</h3>

                <div className="grid grid-cols-1 gap-4 w-full max-w-md">
                    {shuffledOptions.map((option, idx) => (
                        <motion.button
                            key={idx}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleAnswer(option.url === currentPhoto.url, idx)}
                            className={`p-4 rounded-2xl text-lg font-bold transition-all border-b-4 ${selectedAnswer === idx
                                ? option.url === currentPhoto.url
                                    ? 'bg-green-500 text-white border-green-700'
                                    : 'bg-red-500 text-white border-red-700'
                                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-200 dark:border-gray-700 hover:border-pink-400'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <span>{option.label}</span>
                                {selectedAnswer === idx && (
                                    option.url === currentPhoto.url ? <CheckCircle2 /> : <XCircle />
                                )}
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>
        );
    };

    const renderDateGame = () => {
        const currentQuestion = importantDates[currentLevel];
        const otherDates = importantDates.filter(d => d.date !== currentQuestion.date);
        const options = [currentQuestion.date, ...otherDates.map(o => o.date)].slice(0, 3).sort(() => 0.5 - Math.random());

        return (
            <div className="flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border-t-8 border-purple-500 w-full max-w-md text-center mb-8"
                >
                    <div className="inline-flex p-4 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 mb-4">
                        <Calendar size={40} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{currentQuestion.label}</h2>
                    <p className="text-gray-600 dark:text-gray-400 italic">"{currentQuestion.hint}"</p>
                </motion.div>

                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">تفتكري كان تاريخ كام؟</h3>

                <div className="grid grid-cols-1 gap-4 w-full max-w-md">
                    {options.map((option, idx) => (
                        <motion.button
                            key={idx}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleAnswer(option === currentQuestion.date, idx)}
                            className={`p-4 rounded-2xl text-xl font-bold transition-all border-b-4 ${selectedAnswer === idx
                                ? option === currentQuestion.date
                                    ? 'bg-green-500 text-white border-green-700'
                                    : 'bg-red-500 text-white border-red-700'
                                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-200 dark:border-gray-700 hover:border-purple-500'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <span>{option}</span>
                                {selectedAnswer === idx && (
                                    option === currentQuestion.date ? <CheckCircle2 /> : <XCircle />
                                )}
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#fdfbfb] to-[#ebedee] dark:from-gray-900 dark:to-black py-12 px-4 pb-24">
            {/* Background elements */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
                {[...Array(10)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            rotate: [0, 360],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{ duration: 10 + Math.random() * 10, repeat: Infinity }}
                    >
                        <Star size={40 + Math.random() * 40} className="text-pink-500" />
                    </motion.div>
                ))}
            </div>

            <div className="relative z-10 max-w-4xl mx-auto">
                {!gameMode ? (
                    <div className="text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-12"
                        >
                            <div className="w-24 h-24 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl rotate-12">
                                <Trophy size={48} className="text-white" />
                            </div>
                            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-4">لعبة الذكريات</h1>
                            <p className="text-xl text-gray-600 dark:text-gray-400">تفتكري فاكرة كل لحظة عشناها سوا؟ 😉</p>
                        </motion.div>

                        <div className="flex flex-col md:flex-row gap-6 justify-center">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={startPhotoGame}
                                className="flex flex-col items-center p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl border-b-4 border-pink-500 group"
                            >
                                <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/30 text-pink-500 rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                                    <Camera size={32} />
                                </div>
                                <span className="text-2xl font-bold dark:text-white">تخمين الصور</span>
                                <span className="text-sm text-gray-500 mt-2">عارفة الصورة دي فين؟</span>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={startDateGame}
                                className="flex flex-col items-center p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl border-b-4 border-purple-500 group"
                            >
                                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 text-purple-500 rounded-2xl flex items-center justify-center mb-4 group-hover:-rotate-12 transition-transform">
                                    <Calendar size={32} />
                                </div>
                                <span className="text-2xl font-bold dark:text-white">تخمين التواريخ</span>
                                <span className="text-sm text-gray-500 mt-2">فاكرة اليوم ده كان امتى؟</span>
                            </motion.button>
                        </div>
                    </div>
                ) : showResult ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center bg-white dark:bg-gray-800 p-12 rounded-3xl shadow-2xl border-b-4 border-yellow-500 max-w-md mx-auto"
                    >
                        <div className="text-6xl mb-6">🎉</div>
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">عاش يا بطلة!</h2>
                        <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500 mb-6">
                            {score}/{gameMode === 'photos' ? albumPhotos.length : importantDates.length}
                        </div>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                            {score === (gameMode === 'photos' ? albumPhotos.length : importantDates.length)
                                ? 'انتي مذهلة وبجد فاكرة كل حاجة! بحبك ❤️'
                                : 'مش بطال.. بس محتاجة تركزي أكتر في تفاصيلنا 😉'}
                        </p>
                        <button
                            onClick={() => setGameMode(null)}
                            className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-bold shadow-lg"
                        >
                            <RefreshCw size={20} />
                            العب تاني
                        </button>
                    </motion.div>
                ) : (
                    <div>
                        <div className="flex justify-between items-center mb-12">
                            <button
                                onClick={() => setGameMode(null)}
                                className="text-gray-500 hover:text-pink-500 dark:text-gray-400 flex items-center gap-2 font-bold"
                            >
                                ← خروج
                            </button>
                            <div className="flex gap-4">
                                <div className="bg-pink-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                                    <Star size={16} fill="white" /> {score}
                                </div>
                            </div>
                        </div>

                        {gameMode === 'photos' ? renderPhotoGame() : renderDateGame()}
                    </div>
                )}
            </div>
        </div>
    );
}
