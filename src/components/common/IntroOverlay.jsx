import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

export default function IntroOverlay({ onComplete }) {
    const [isVisible, setIsVisible] = useState(true);
    const [text, setText] = useState('');
    const fullText = "Happy Birthday ❤️";

    useEffect(() => {
        // Check if already seen in this session
        const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');
        if (hasSeenIntro) {
            setIsVisible(false);
            onComplete && onComplete();
            return;
        }

        // Typing effect
        let currentIndex = 0;
        const typingInterval = setInterval(() => {
            setText(fullText.slice(0, currentIndex + 1));
            currentIndex++;
            if (currentIndex === fullText.length) {
                clearInterval(typingInterval);

                // Trigger confetti
                durationConfetti();

                // Hide after delay and set session storage
                setTimeout(() => {
                    setIsVisible(false);
                    sessionStorage.setItem('hasSeenIntro', 'true');
                    onComplete && onComplete();
                }, 3500);
            }
        }, 100);

        return () => clearInterval(typingInterval);
    }, [onComplete]);

    const durationConfetti = () => {
        const end = Date.now() + 3000;
        const colors = ['#bb0000', '#ffffff'];

        (function frame() {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 1 } }}
                    className="fixed inset-0 z-[100] bg-black flex items-center justify-center pointer-events-none"
                >
                    <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500 drop-shadow-2xl text-center px-4">
                        {text}
                        <span className="animate-pulse text-white">|</span>
                    </h1>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
