import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function StoryViewer({ stories, onClose }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const STORY_DURATION = 5000; // 5 seconds per story

    // Auto-advance timer
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    nextStory();
                    return 0;
                }
                return prev + (100 / (STORY_DURATION / 50));
            });
        }, 50);

        return () => clearInterval(interval);
    }, [currentIndex, isPaused]);

    const nextStory = () => {
        if (currentIndex < stories.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setProgress(0);
        } else {
            onClose();
        }
    };

    const prevStory = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setProgress(0);
        }
    };

    const currentStory = stories[currentIndex];

    return (
        <div
            className="fixed inset-0 z-50 bg-black"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Progress Bars */}
            <div className="absolute top-0 left-0 right-0 flex gap-1 p-2 z-10">
                {stories.map((_, index) => (
                    <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white transition-all duration-100"
                            style={{
                                width: index < currentIndex ? '100%' :
                                    index === currentIndex ? `${progress}%` : '0%'
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full hover:bg-black/70 transition"
            >
                <X size={24} className="text-white" />
            </button>

            {/* Story Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    className="h-full flex items-center justify-center p-4"
                >
                    {currentStory.component}
                </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="absolute inset-y-0 left-0 right-0 flex">
                {/* Previous (left half) */}
                <div
                    className="flex-1 cursor-pointer"
                    onClick={prevStory}
                />
                {/* Next (right half) */}
                <div
                    className="flex-1 cursor-pointer"
                    onClick={nextStory}
                />
            </div>

            {/* Navigation Arrows */}
            {currentIndex > 0 && (
                <button
                    onClick={prevStory}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 rounded-full hover:bg-white/30 transition"
                >
                    <ChevronLeft size={32} className="text-white" />
                </button>
            )}

            {currentIndex < stories.length - 1 && (
                <button
                    onClick={nextStory}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 rounded-full hover:bg-white/30 transition"
                >
                    <ChevronRight size={32} className="text-white" />
                </button>
            )}
        </div>
    );
}
