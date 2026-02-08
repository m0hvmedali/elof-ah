import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/90 to-transparent backdrop-blur-sm py-3">
            <div className="container mx-auto px-4">
                <motion.p
                    className="text-center text-white/70 text-sm flex items-center justify-center gap-2"
                    animate={{
                        textShadow: [
                            '0 0 10px rgba(255,182,193,0.5)',
                            '0 0 20px rgba(255,182,193,0.8)',
                            '0 0 10px rgba(255,182,193,0.5)'
                        ]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                >
                    Made with <Heart size={14} className="text-pink-400 fill-pink-400 animate-pulse" /> for <span className="font-bold text-pink-400">جنى</span>
                </motion.p>
            </div>
        </footer>
    );
}
