import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, Camera, Calendar, CheckCircle2, XCircle, RefreshCw, Trophy, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { supabase } from '../supabaseClient';

export default function GamePage() {
    const [gameMode, setGameMode] = useState(null); // 'photos' or 'dates'
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentLevel, setCurrentLevel] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [feedback, setFeedback] = useState(null); // 'correct' or 'wrong'
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [shuffledOptions, setShuffledOptions] = useState([]);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('game_questions')
            .select('*');

        if (data && data.length > 0) {
            setQuestions(data);
        } else {
            // Fallback to defaults if DB is empty
            setQuestions([
                { type: 'date', date: '2025-08-24', label: 'بدأنا سوا ❤️', answer: '2025-08-24', hint: 'تاريخ بداية كل حاجة حلوة' },
                { type: 'date', date: '2026-02-08', label: 'عيد ميلاد جنى 🎂', answer: '2026-02-08', hint: 'أجمل يوم في السنة' },
                { type: 'photo', media_url: '/bb.jpeg', label: 'صورة كيوت', answer: 'Cute Moment' },
            ]);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (gameMode && questions.length > 0) {
            prepareOptions();
        }
    }, [gameMode, currentLevel, questions]);

    const prepareOptions = () => {
        const modeQuestions = questions.filter(q => q.type === (gameMode === 'photos' ? 'photo' : 'date'));
        if (modeQuestions.length === 0) return;

        const currentQ = modeQuestions[currentLevel % modeQuestions.length];
        const otherAnswers = modeQuestions
            .filter(q => q.answer !== currentQ.answer)
            .map(q => q.answer);

        // Add random fake options if not enough real ones
        const fakeOptions = gameMode === 'photos'
            ? ['يوم عادي', 'خروجة حلوة', 'ذكريات', 'يوم مميز']
            : ['2025-01-01', '2025-05-15', '2025-12-25', '2024-10-10'];

        let options = [currentQ.answer, ...otherAnswers];
        if (options.length < 3) {
            options = [...new Set([...options, ...fakeOptions.slice(0, 3)])];
        }

        setShuffledOptions(options.slice(0, 3).sort(() => 0.5 - Math.random()));
    };

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

    const handleAnswer = (answer, index) => {
        if (selectedAnswer !== null) return;
        setSelectedAnswer(index);

        const modeQuestions = questions.filter(q => q.type === (gameMode === 'photos' ? 'photo' : 'date'));
        const currentQ = modeQuestions[currentLevel % modeQuestions.length];
        const isCorrect = answer === currentQ.answer;

        if (isCorrect) {
            setScore(s => s + 1);
            setFeedback('correct');
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        } else {
            setFeedback('wrong');
        }

        setTimeout(() => {
            setFeedback(null);
            setSelectedAnswer(null);
            if (currentLevel < modeQuestions.length - 1) {
                setCurrentLevel(l => l + 1);
            } else {
                setShowResult(true);
            }
        }, 1500);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
        </div>
    );

    const modeQuestions = questions.filter(q => q.type === (gameMode === 'photos' ? 'photo' : 'date'));
    const currentQ = modeQuestions[currentLevel % modeQuestions.length];

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#fdfbfb] to-[#ebedee] dark:from-gray-900 dark:to-black py-12 px-4 pb-24">
            <div className="relative z-10 max-w-4xl mx-auto">
                {!gameMode ? (
                    <div className="text-center">
                        <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="mb-12">
                            <div className="w-24 h-24 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl rotate-12">
                                <Trophy size={48} className="text-white" />
                            </div>
                            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-4">لعبة الذكريات</h1>
                            <p className="text-xl text-gray-600 dark:text-gray-400">تفتكري فاكرة كل لحظة عشناها سوا؟ 😉</p>
                        </motion.div>

                        <div className="flex flex-col md:flex-row gap-6 justify-center">
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={startPhotoGame} className="flex flex-col items-center p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl border-b-4 border-pink-500 group">
                                <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/30 text-pink-500 rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                                    <Camera size={32} />
                                </div>
                                <span className="text-2xl font-bold dark:text-white">تخمين الصور</span>
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={startDateGame} className="flex flex-col items-center p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl border-b-4 border-purple-500 group">
                                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 text-purple-500 rounded-2xl flex items-center justify-center mb-4 group-hover:-rotate-12 transition-transform">
                                    <Calendar size={32} />
                                </div>
                                <span className="text-2xl font-bold dark:text-white">تخمين التواريخ</span>
                            </motion.button>
                        </div>
                    </div>
                ) : showResult ? (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center bg-white dark:bg-gray-800 p-12 rounded-3xl shadow-2xl border-b-4 border-yellow-500 max-w-md mx-auto">
                        <div className="text-6xl mb-6">🎉</div>
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">عاش يا بطلة!</h2>
                        <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500 mb-6">{score}/{modeQuestions.length}</div>
                        <button onClick={() => setGameMode(null)} className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-bold shadow-lg">
                            <RefreshCw size={20} /> العب تاني
                        </button>
                    </motion.div>
                ) : (
                    <div>
                        <div className="flex justify-between items-center mb-12">
                            <button onClick={() => setGameMode(null)} className="text-gray-500 hover:text-pink-500 dark:text-gray-400 flex items-center gap-2 font-bold">← خروج</button>
                            <div className="bg-pink-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                                <Star size={16} fill="white" /> {score}
                            </div>
                        </div>

                        <div className="flex flex-col items-center">
                            {gameMode === 'photos' && currentQ?.media_url && (
                                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-pink-400 mb-8">
                                    <img src={currentQ.media_url} alt="Guess" className="w-full h-full object-cover" />
                                </motion.div>
                            )}

                            {gameMode === 'dates' && (
                                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border-t-8 border-purple-500 w-full max-w-md text-center mb-8">
                                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{currentQ?.label}</h2>
                                    <p className="text-gray-600 dark:text-gray-400 italic">"{currentQ?.hint}"</p>
                                </motion.div>
                            )}

                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                                {gameMode === 'photos' ? 'أي وصف يناسب الصورة دي؟' : 'تفتكري كان تاريخ كام؟'}
                            </h3>

                            <div className="grid grid-cols-1 gap-4 w-full max-w-md">
                                {shuffledOptions.map((option, idx) => (
                                    <motion.button
                                        key={idx}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleAnswer(option, idx)}
                                        className={`p-4 rounded-2xl text-lg font-bold transition-all border-b-4 ${selectedAnswer === idx
                                            ? option === currentQ.answer
                                                ? 'bg-green-500 text-white border-green-700'
                                                : 'bg-red-500 text-white border-red-700'
                                            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-200 dark:border-gray-700'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>{option}</span>
                                            {selectedAnswer === idx && (option === currentQ.answer ? <CheckCircle2 /> : <XCircle />)}
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
