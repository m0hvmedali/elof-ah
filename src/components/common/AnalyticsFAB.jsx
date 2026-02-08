import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function AnalyticsFAB() {
    const location = useLocation();
    const { currentTheme } = useTheme();

    // Don't show on Analytics page itself
    if (location.pathname === '/analytics') return null;

    return (
        <Link to="/analytics">
            <motion.div
                className="fixed bottom-24 right-6 z-40 p-4 rounded-full shadow-2xl cursor-pointer"
                style={{
                    background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
                    boxShadow: `0 8px 32px ${currentTheme.accent}66`
                }}
                whileHover={{ scale: 1.1, rotate: 360 }}
                whileTap={{ scale: 0.9 }}
                animate={{
                    y: [0, -10, 0],
                }}
                transition={{
                    y: {
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    },
                    rotate: {
                        duration: 0.6
                    }
                }}
            >
                <BarChart3 size={32} color="#fff" strokeWidth={2.5} />

                {/* Pulse effect */}
                <motion.div
                    className="absolute inset-0 rounded-full"
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 0, 0.5]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity
                    }}
                    style={{
                        background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary})`
                    }}
                />
            </motion.div>
        </Link>
    );
}
