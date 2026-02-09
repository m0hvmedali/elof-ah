import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function IntroOverlay() {
    const [phase, setPhase] = useState('ready'); // ready -> flash -> birthday -> hidden
    const [show, setShow] = useState(true);

    useEffect(() => {
        // Timeline of the cinematic intro
        const sequence = async () => {
            // 1. Ready Phase (Wait 2s)
            await new Promise(r => setTimeout(r, 2000));

            // 2. Transition to Flash
            setPhase('flash');
            await new Promise(r => setTimeout(r, 500));

            // 3. Transition to Birthday
            setPhase('birthday');
            triggerConfetti();

            // Auto-play music if possible
            const audio = document.querySelector('audio');
            if (audio) audio.play().catch(() => { });

            // 4. End and Hide after 6s
            await new Promise(r => setTimeout(r, 6000));
            setShow(false);
        };

        sequence();
    }, []);

    const triggerConfetti = () => {
        const end = Date.now() + 3000;
        const colors = ['#ff69b4', '#9333ea', '#ffffff', '#fbbf24'];

        (function frame() {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0, y: 0.8 },
                colors: colors
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1, y: 0.8 },
                colors: colors
            });
            if (Date.now() < end) requestAnimationFrame(frame);
        }());
    };

    if (!show) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[1000] bg-black flex items-center justify-center overflow-hidden font-sans"
            >
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 via-black to-pink-900/20" />

                {/* Stars Background */}
                <div className="absolute inset-0 opacity-30">
                    {[...Array(50)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute bg-white rounded-full"
                            style={{
                                width: Math.random() * 3,
                                height: Math.random() * 3,
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`
                            }}
                            animate={{ opacity: [0.2, 1, 0.2] }}
                            transition={{ duration: 2 + Math.random() * 3, repeat: Infinity }}
                        />
                    ))}
                </div>

                {/* Phase 1: READY */}
                {phase === 'ready' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 2, filter: 'blur(20px)' }}
                        className="text-center z-10"
                    >
                        <motion.h1
                            animate={{ textShadow: ["0 0 20px #fff", "0 0 40px #ff69b4", "0 0 20px #fff"] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="text-6xl md:text-9xl font-black italic tracking-tighter text-white uppercase"
                        >
                            بين قلوبنا رسول
                        </motion.h1>
                    </motion.div>
                )}

                {/* Phase 2: FLASH */}
                {phase === 'flash' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-white z-[1001]"
                    />
                )}

                {/* Phase 3: Happy Birthday */}
                {phase === 'birthday' && (
                    <div className="text-center z-10 px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                        >
                            <h1 className="text-6xl md:text-9xl font-black mb-6 leading-tight">
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-gradient-x drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]">
                                    spirit together.
                                </span>
                                <span className="block text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                                    JANA
                                </span>
                            </h1>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8, type: 'spring' }}
                            className="text-2xl md:text-4xl font-bold text-pink-400 mt-4 tracking-widest uppercase italic"
                        >
                            With all my love for you ❤️
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5 }}
                            className="mt-12 text-white/40 text-sm tracking-[0.5em] uppercase font-light"
                        >
                            Made for your birthday and will remain forever, waiting for the next one.....
                        </motion.div>
                    </div>
                )}

                {/* Light Beams */}
                {phase === 'birthday' && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-[200%] h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                                style={{ top: `${20 * i}%`, left: '-50%', rotate: '-15deg' }}
                                animate={{ x: ['-10%', '110%'] }}
                                transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                            />
                        ))}
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );
}
