import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, Camera, Calendar, CheckCircle2, XCircle, RefreshCw, Trophy, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { supabase } from '../supabaseClient';

export default function GamePage() {
    const [gameMode, setGameMode] = useState(null); // 'photo' or 'date'
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentLevel, setCurrentLevel] = useState(0);
    const [player, setPlayer] = useState(null); // 'jana' or 'ahmed'
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [feedback, setFeedback] = useState(null); // 'correct' or 'wrong'
    const [selectedAnswer, setSelectedAnswer] = useState(null);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('game_questions')
            .select('*')
            .order('created_at', { ascending: true });

        if (data && data.length > 0) {
            setQuestions(data);
        } else {
            // Fallback to defaults
            setQuestions([
                { id: 1, type: 'date', label: 'بدأنا سوا ❤️', answer: '2025-08-24', options: ['2025-08-24', '2025-08-25', '2025-08-20', '2025-09-01'], hint: 'تاريخ بداية كل حاجة حلوة' },
                { id: 2, type: 'photo', media_url: '/bb.jpeg', label: 'صورة كيوت', answer: 'Cute Moment', options: ['Cute Moment', 'Day Out', 'Sweetness', 'Memories'] },
            ]);
        }
        setLoading(false);
    };

    const startPhotoGame = () => {
        const filtered = questions.filter(q =>
            q.type === 'photo' && (q.target_player === player || q.target_player === 'both')
        );
        if (filtered.length === 0) {
            alert('مفيش أسئلة صور ليك/ليكي لسه.. ضيفوهم من صفحة الـ Admin! 😉');
            return;
        }
        setGameMode('photo');
        setCurrentLevel(0);
        setScore(0);
        setShowResult(false);
    };

    const startDateGame = () => {
        const filtered = questions.filter(q =>
            q.type === 'date' && (q.target_player === player || q.target_player === 'both')
        );
        if (filtered.length === 0) {
            alert('مفيش أسئلة تواريخ ليك/ليكي لسه.. ضيفوهم من صفحة الـ Admin! 😉');
            return;
        }
        setGameMode('date');
        setCurrentLevel(0);
        setScore(0);
        setShowResult(false);
    };

    const handleAnswer = (answer, index) => {
        if (selectedAnswer !== null) return;
        setSelectedAnswer(index);

        const modeQuestions = questions.filter(q =>
            q.type === gameMode && (q.target_player === player || q.target_player === 'both')
        );
        const currentQ = modeQuestions[currentLevel];
        const isCorrect = index === currentQ.correct_option_index;

        if (isCorrect) {
            setScore(s => s + 1);
            setFeedback('correct');
            confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
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

    const modeQuestions = questions.filter(q =>
        q.type === gameMode && (q.target_player === player || q.target_player === 'both')
    );
    const currentQ = modeQuestions[currentLevel];

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#fdfbfb] to-[#ebedee] dark:from-gray-900 dark:to-black py-12 px-4 pb-24">
            <div className="relative z-10 max-w-4xl mx-auto">
                {!player ? (
                    <div className="text-center">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
                            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-4">مين اللي هيلعب؟</h1>
                            <p className="text-xl text-gray-600 dark:text-gray-400">اختار بروفايلك عشان تطلعلك أسئلتك 😉</p>
                        </motion.div>
                        <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setPlayer('jana')}
                                className="w-full max-w-xs flex flex-col items-center p-10 bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl border-b-[8px] border-pink-500 transition-all"
                            >
                                <div className="text-6xl mb-4">👸</div>
                                <span className="text-3xl font-black dark:text-white">جنى</span>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setPlayer('ahmed')}
                                className="w-full max-w-xs flex flex-col items-center p-10 bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl border-b-[8px] border-blue-500 transition-all"
                            >
                                <div className="text-6xl mb-4">🤵</div>
                                <span className="text-3xl font-black dark:text-white">أحمد</span>
                            </motion.button>
                        </div>
                    </div>
                ) : !gameMode ? (
                    <div className="text-center">
                        <div className="mb-8">
                            <button onClick={() => setPlayer(null)} className="text-sm text-gray-500 hover:text-pink-500 font-bold transition">← تغيير اللاعب</button>
                        </div>
                        <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="mb-12">
                            <div className="w-24 h-24 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl rotate-12">
                                <Trophy size={48} className="text-white" />
                            </div>
                            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-4">لعبة الذكريات</h1>
                            <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">
                                {player === 'jana' ? 'يا هلا بالملكة جنى! جاهزة؟ 👸' : 'يا هلا يا أبو حميد! وريني شطارتك 🤵'}
                            </p>
                        </motion.div>

                        <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={startPhotoGame}
                                className="w-full max-w-xs flex flex-col items-center p-10 bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl border-b-[8px] border-pink-500 group transition-all"
                            >
                                <div className="w-20 h-20 bg-pink-100 dark:bg-pink-900/30 text-pink-500 rounded-3xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform shadow-inner">
                                    <Camera size={40} />
                                </div>
                                <span className="text-3xl font-black dark:text-white">تخمين الصور</span>
                                <span className="text-sm text-gray-400 mt-2">عارفة دي اتصورت فين؟</span>
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={startDateGame}
                                className="w-full max-w-xs flex flex-col items-center p-10 bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl border-b-[8px] border-purple-500 group transition-all"
                            >
                                <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 text-purple-500 rounded-3xl flex items-center justify-center mb-6 group-hover:-rotate-12 transition-transform shadow-inner">
                                    <Calendar size={40} />
                                </div>
                                <span className="text-3xl font-black dark:text-white">تخمين التواريخ</span>
                                <span className="text-sm text-gray-400 mt-2">فاكرة اليوم ده كان امتى؟</span>
                            </motion.button>
                        </div>
                    </div>
                ) : showResult ? (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center bg-white dark:bg-gray-800 p-12 rounded-[3rem] shadow-2xl border-b-8 border-yellow-500 max-w-md mx-auto relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500" />

                        {/* Player Specific Image Placeholder */}
                        <div className="w-full aspect-video rounded-2xl overflow-hidden mb-6 bg-gray-100 dark:bg-gray-700 flex items-center justify-center border-4 border-white dark:border-gray-600 shadow-inner">
                            {player === 'jana' ? (
                                <img src="/jana-win.png" alt="Jana Win" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
                            ) : (
                                <img src="/ahmed-win.png" alt="Ahmed Win" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
                            )}
                            <div className="hidden text-6xl">✨💖✨</div>
                        </div>

                        <div className="text-4xl mb-2 drop-shadow-lg">{score === modeQuestions.length ? '🥇' : '🎉'}</div>
                        <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
                            {score === modeQuestions.length ? 'أسطورة!' : 'عاش يا بطلة!'}
                        </h2>
                        <div className="text-gray-500 mb-6 font-bold">النتيجة النهائية</div>
                        <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-red-600 mb-8 drop-shadow-sm">{score}/{modeQuestions.length}</div>
                        <button onClick={() => setGameMode(null)} className="flex items-center justify-center gap-3 w-full py-5 bg-gradient-to-br from-pink-500 to-purple-700 text-white rounded-2xl font-black text-xl shadow-[0_10px_20px_rgba(236,72,153,0.3)] hover:shadow-none transition-all">
                            <RefreshCw size={24} /> العب تاني
                        </button>
                    </motion.div>
                ) : (
                    <div className="px-2">
                        <div className="flex justify-between items-center mb-10">
                            <button onClick={() => setGameMode(null)} className="p-3 bg-white/10 dark:bg-gray-800 rounded-2xl text-gray-500 hover:text-pink-500 dark:text-gray-400 flex items-center gap-2 font-black transition-colors">← خروج</button>
                            <div className="flex flex-col items-end">
                                <div className="text-xs text-gray-400 font-bold mb-1">المستوى {currentLevel + 1} من {modeQuestions.length}</div>
                                <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-full text-lg font-black flex items-center gap-2 shadow-lg">
                                    <Star size={20} fill="white" /> {score}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentLevel}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    className="w-full max-w-lg"
                                >
                                    {gameMode === 'photo' && currentQ?.media_url && (
                                        <div className="relative w-full aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 mb-10 transform -rotate-1 group hover:rotate-0 transition-transform">
                                            <img src={currentQ.media_url} alt="Guess" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                                        </div>
                                    )}

                                    {gameMode === 'date' && (
                                        <div className="bg-white dark:bg-gray-800 p-10 rounded-[3rem] shadow-2xl border-t-[10px] border-purple-500 w-full text-center mb-10 relative overflow-hidden">
                                            <div className="absolute -right-8 -top-8 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl" />
                                            <h2 className="text-4xl font-black text-gray-800 dark:text-white mb-4 leading-tight">{currentQ?.label}</h2>
                                            {currentQ?.hint && <p className="text-purple-500 dark:text-purple-400 italic font-medium">💡 {currentQ.hint}</p>}
                                        </div>
                                    )}

                                    <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-8 text-center px-4">
                                        {gameMode === 'photo' ? 'أي وصف يناسب الصورة دي؟' : 'تفتكري كان تاريخ كام؟'}
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                                        {(currentQ?.options || []).map((option, idx) => (
                                            <motion.button
                                                key={idx}
                                                whileHover={{ scale: 1.03 }}
                                                whileTap={{ scale: 0.97 }}
                                                onClick={() => handleAnswer(option, idx)}
                                                className={`p-6 rounded-3xl text-xl font-black transition-all border-b-[6px] text-center shadow-lg h-24 flex items-center justify-center ${selectedAnswer === idx
                                                    ? idx === currentQ.correct_option_index
                                                        ? 'bg-green-500 text-white border-green-700 shadow-green-500/30'
                                                        : 'bg-red-500 text-white border-red-700 shadow-red-500/30'
                                                    : selectedAnswer !== null && idx === currentQ.correct_option_index
                                                        ? 'bg-green-500/50 text-white border-green-700'
                                                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-100 dark:border-gray-700 hover:border-pink-400'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-center gap-3">
                                                    <span>{option}</span>
                                                    {selectedAnswer === idx && (idx === currentQ.correct_option_index ? <CheckCircle2 size={24} /> : <XCircle size={24} />)}
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
