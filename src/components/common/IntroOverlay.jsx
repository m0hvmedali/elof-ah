import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Fingerprint } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function IntroOverlay() {
    const { currentTheme } = useTheme();
    const [show, setShow] = useState(true);
    const [leftTouch, setLeftTouch] = useState(false);
    const [rightTouch, setRightTouch] = useState(false);
    const [progress, setProgress] = useState(0);
    const [hearts, setHearts] = useState([]);
    const [completed, setCompleted] = useState(false);

    // Check if intro was already done
    useEffect(() => {
        const introDone = localStorage.getItem('introDone');
        if (introDone === 'true') {
            setShow(false);
        }
    }, []);

    // Progress tracking when both fingers are held
    useEffect(() => {
        if (!leftTouch || !rightTouch || completed) return;

        const interval = setInterval(() => {
            setProgress((prev) => {
                const newProgress = prev + 2;

                // Generate hearts
                if (newProgress % 5 === 0) {
                    const newHeart = {
                        id: Date.now() + Math.random(),
                        x: Math.random() * 100,
                        y: Math.random() * 100,
                        size: 20 + Math.random() * 40,
                        delay: Math.random() * 0.5
                    };
                    setHearts((h) => [...h, newHeart]);
                }

                if (newProgress >= 100) {
                    setCompleted(true);
                    // Vibrate phone
                    if (navigator.vibrate) {
                        navigator.vibrate([200, 100, 200, 100, 400]);
                    }

                    // Auto-play music
                    setTimeout(() => {
                        const playButton = document.querySelector('[aria-label="play music"]');
                        if (playButton) playButton.click();
                    }, 500);

                    // Mark intro as done and close
                    setTimeout(() => {
                        localStorage.setItem('introDone', 'true');
                        setShow(false);
                    }, 3000);
                }

                return newProgress;
            });
        }, 50);

        return () => clearInterval(interval);
    }, [leftTouch, rightTouch, completed]);

    // Reset progress if either finger lifts
    useEffect(() => {
        if (!leftTouch || !rightTouch) {
            if (progress > 0 && !completed) {
                setProgress(0);
                setHearts([]);
            }
        }
    }, [leftTouch, rightTouch, progress, completed]);

    if (!show) return null;

    const handleTouchStart = (side) => {
        if (side === 'left') setLeftTouch(true);
        else setRightTouch(true);
    };

    const handleTouchEnd = (side) => {
        if (side === 'left') setLeftTouch(false);
        else setRightTouch(false);
    };

    const handleMouseDown = (side) => {
        if (side === 'left') setLeftTouch(true);
        else setRightTouch(true);
    };

    const handleMouseUp = (side) => {
        if (side === 'left') setLeftTouch(false);
        else setRightTouch(false);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center"
                style={{
                    background: `linear-gradient(135deg, ${currentTheme.primary}22, ${currentTheme.secondary}22)`,
                    backdropFilter: 'blur(20px)'
                }}
            >
                {/* Floating Hearts */}
                {hearts.map((heart) => (
                    <motion.div
                        key={heart.id}
                        initial={{ opacity: 0, scale: 0, x: `${heart.x}vw`, y: `${heart.y}vh` }}
                        animate={{
                            opacity: [0, 1, 1, 0],
                            scale: [0, 1, 1.2, 0],
                            y: [`${heart.y}vh`, `${heart.y - 30}vh`]
                        }}
                        transition={{ duration: 2, delay: heart.delay }}
                        className="absolute pointer-events-none"
                        style={{ fontSize: `${heart.size}px` }}
                    >
                        <Heart fill={currentTheme.accent} color={currentTheme.accent} />
                    </motion.div>
                ))}

                {/* Main Content */}
                <div className="w-full max-w-6xl px-8">
                    {/* Title */}
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
                            مرحباً بكم 💕
                        </h1>
                        <p className="text-xl md:text-2xl text-white/80">
                            اضغطوا معاً لبدء الرحلة
                        </p>
                    </motion.div>

                    {/* Progress Bar */}
                    {progress > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mb-8"
                        >
                            <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{
                                        width: `${progress}%`,
                                        background: `linear-gradient(90deg, ${currentTheme.primary}, ${currentTheme.secondary})`
                                    }}
                                    animate={{
                                        boxShadow: [`0 0 20px ${currentTheme.accent}`, `0 0 40px ${currentTheme.accent}`, `0 0 20px ${currentTheme.accent}`]
                                    }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                />
                            </div>
                            <p className="text-center text-white/70 mt-2 text-sm">
                                {leftTouch && rightTouch ? 'استمروا... 💕' : 'اضغطوا معاً!'}
                            </p>
                        </motion.div>
                    )}

                    {/* Touch Zones */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Zone - Ahmed */}
                        <motion.div
                            onTouchStart={() => handleTouchStart('left')}
                            onTouchEnd={() => handleTouchEnd('left')}
                            onMouseDown={() => handleMouseDown('left')}
                            onMouseUp={() => handleMouseUp('left')}
                            onMouseLeave={() => handleMouseUp('left')}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="relative p-12 rounded-3xl cursor-pointer select-none"
                            style={{
                                background: leftTouch
                                    ? `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`
                                    : 'rgba(255,255,255,0.1)',
                                border: `3px solid ${leftTouch ? currentTheme.accent : 'rgba(255,255,255,0.3)'}`,
                                boxShadow: leftTouch ? `0 0 60px ${currentTheme.primary}66` : 'none',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <div className="flex flex-col items-center gap-6">
                                <motion.div
                                    animate={leftTouch ? {
                                        rotate: 360,
                                        scale: [1, 1.2, 1]
                                    } : {}}
                                    transition={{ duration: 2, repeat: leftTouch ? Infinity : 0 }}
                                >
                                    <Fingerprint
                                        size={120}
                                        color={leftTouch ? '#fff  ' : currentTheme.primary}
                                        strokeWidth={1.5}
                                    />
                                </motion.div>
                                <div className="text-center">
                                    <h3 className="text-3xl font-bold text-white mb-2">أحمد</h3>
                                    <p className="text-white/70">
                                        {leftTouch ? 'رائع! 👍' : 'اضغط هنا'}
                                    </p>
                                </div>
                            </div>

                            {leftTouch && (
                                <motion.div
                                    className="absolute inset-0 rounded-3xl pointer-events-none"
                                    animate={{
                                        boxShadow: [
                                            `0 0 20px ${currentTheme.primary}`,
                                            `0 0 60px ${currentTheme.primary}`,
                                            `0 0 20px ${currentTheme.primary}`
                                        ]
                                    }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                />
                            )}
                        </motion.div>

                        {/* Right Zone - Jana */}
                        <motion.div
                            onTouchStart={() => handleTouchStart('right')}
                            onTouchEnd={() => handleTouchEnd('right')}
                            onMouseDown={() => handleMouseDown('right')}
                            onMouseUp={() => handleMouseUp('right')}
                            onMouseLeave={() => handleMouseUp('right')}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="relative p-12 rounded-3xl cursor-pointer select-none"
                            style={{
                                background: rightTouch
                                    ? `linear-gradient(135deg, ${currentTheme.secondary}, ${currentTheme.accent})`
                                    : 'rgba(255,255,255,0.1)',
                                border: `3px solid ${rightTouch ? currentTheme.accent : 'rgba(255,255,255,0.3)'}`,
                                boxShadow: rightTouch ? `0 0 60px ${currentTheme.secondary}66` : 'none',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <div className="flex flex-col items-center gap-6">
                                <motion.div
                                    animate={rightTouch ? {
                                        rotate: -360,
                                        scale: [1, 1.2, 1]
                                    } : {}}
                                    transition={{ duration: 2, repeat: rightTouch ? Infinity : 0 }}
                                >
                                    <Fingerprint
                                        size={120}
                                        color={rightTouch ? '#fff' : currentTheme.secondary}
                                        strokeWidth={1.5}
                                    />
                                </motion.div>
                                <div className="text-center">
                                    <h3 className="text-3xl font-bold text-white mb-2">جنى</h3>
                                    <p className="text-white/70">
                                        {rightTouch ? 'رائع! 👍' : 'اضغطي هنا'}
                                    </p>
                                </div>
                            </div>

                            {rightTouch && (
                                <motion.div
                                    className="absolute inset-0 rounded-3xl pointer-events-none"
                                    animate={{
                                        boxShadow: [
                                            `0 0 20px ${currentTheme.secondary}`,
                                            `0 0 60px ${currentTheme.secondary}`,
                                            `0 0 20px ${currentTheme.secondary}`
                                        ]
                                    }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                />
                            )}
                        </motion.div>
                    </div>

                    {/* Completion Message */}
                    {completed && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-12 text-center"
                        >
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 0.5, repeat: 3 }}
                                className="text-8xl mb-4"
                            >
                                💕
                            </motion.div>
                            <h2 className="text-4xl font-bold text-white mb-2">تمام! 🎉</h2>
                            <p className="text-xl text-white/80">جاري بدء الموقع...</p>
                        </motion.div>
                    )}

                    {/* Skip Button */}
                    {!completed && (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            whileHover={{ opacity: 1 }}
                            onClick={() => {
                                localStorage.setItem('introDone', 'true');
                                setShow(false);
                            }}
                            className="absolute top-4 right-4 px-4 py-2 text-white/70 hover:text-white text-sm"
                        >
                            تخطي
                        </motion.button>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
