import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Clock, Moon, Sun, Coffee } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export default function ActiveHoursChart({ data }) {
    const { currentTheme } = useTheme();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Mouse tracking
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth) * 10 - 5,
                y: (e.clientY / window.innerHeight) * 10 - 5
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const chartData = Object.entries(data).map(([hour, count]) => ({
        hour: `${hour}:00`,
        messages: count,
        hourNum: parseInt(hour)
    }));

    const getColor = (hourNum) => {
        if (hourNum >= 0 && hourNum < 6) return currentTheme.accent; // Night
        if (hourNum >= 6 && hourNum < 12) return currentTheme.primary; // Morning
        if (hourNum >= 12 && hourNum < 18) return currentTheme.secondary; // Afternoon
        return currentTheme.primary; // Evening
    };

    const getIcon = (hourNum) => {
        if (hourNum >= 0 && hourNum < 6) return <Moon size={24} />;
        if (hourNum >= 6 && hourNum < 12) return <Coffee size={24} />;
        if (hourNum >= 12 && hourNum < 18) return <Sun size={24} />;
        return <Moon size={24} />;
    };

    const mostActiveHour = chartData.sort((a, b) => b.messages - a.messages)[0];

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 relative overflow-hidden">
            {/* Parallax Background */}
            <motion.div
                className="absolute inset-0 opacity-10"
                animate={{
                    x: mousePosition.x * 2,
                    y: mousePosition.y * 2
                }}
                transition={{ type: 'spring', stiffness: 30 }}
            >
                <div className="absolute top-20 left-20">
                    <Clock size={200} color={currentTheme.primary} />
                </div>
                <div className="absolute bottom-20 right-20">
                    <Clock size={150} color={currentTheme.secondary} />
                </div>
            </motion.div>

            {/* Header */}
            <div className="text-center mb-8 relative z-10">
                <motion.div
                    className="inline-block mb-4"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                >
                    <Clock size={64} color={currentTheme.primary} strokeWidth={2} />
                </motion.div>
                <h2 className="text-4xl font-bold text-white mb-2">⏰ أنشط الساعات</h2>
                <p className="text-xl text-white/70">متى بنتكلم أكتر؟</p>
            </div>

            {/* Chart */}
            <motion.div
                className="w-full max-w-4xl h-96 bg-white/10 backdrop-blur-lg rounded-3xl p-6 relative z-10"
                style={{
                    boxShadow: `0 0 60px ${currentTheme.accent}44`
                }}
                animate={{
                    x: mousePosition.x * 0.3,
                    y: mousePosition.y * 0.3
                }}
                transition={{ type: 'spring', stiffness: 40 }}
            >
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <XAxis
                            dataKey="hour"
                            stroke={currentTheme.primary}
                            tick={{ fill: currentTheme.primary, fontSize: 12 }}
                        />
                        <YAxis
                            stroke={currentTheme.secondary}
                            tick={{ fill: currentTheme.secondary, fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{
                                background: 'rgba(0,0,0,0.9)',
                                border: `2px solid ${currentTheme.accent}`,
                                borderRadius: '12px',
                                color: '#fff',
                                backdropFilter: 'blur(10px)'
                            }}
                            formatter={(value) => [`${value} رسالة`, 'الرسائل']}
                            cursor={{ fill: `${currentTheme.primary}22` }}
                        />
                        <Bar dataKey="messages" radius={[12, 12, 0, 0]} animationDuration={1500}>
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={getColor(entry.hourNum)}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </motion.div>

            {/* Stats Cards */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 text-center"
                    style={{ borderColor: currentTheme.accent, borderWidth: '2px' }}
                >
                    <Moon size={32} className="mx-auto mb-2" color={currentTheme.accent} />
                    <p className="text-white/70 text-sm">الليل</p>
                    <p className="text-2xl font-bold text-white">
                        {chartData.filter(d => d.hourNum >= 0 && d.hourNum < 6).reduce((sum, d) => sum + d.messages, 0).toLocaleString()}
                    </p>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 text-center"
                    style={{ borderColor: currentTheme.primary, borderWidth: '2px' }}
                >
                    <Coffee size={32} className="mx-auto mb-2" color={currentTheme.primary} />
                    <p className="text-white/70 text-sm">الصباح</p>
                    <p className="text-2xl font-bold text-white">
                        {chartData.filter(d => d.hourNum >= 6 && d.hourNum < 12).reduce((sum, d) => sum + d.messages, 0).toLocaleString()}
                    </p>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 text-center"
                    style={{ borderColor: currentTheme.secondary, borderWidth: '2px' }}
                >
                    <Sun size={32} className="mx-auto mb-2" color={currentTheme.secondary} />
                    <p className="text-white/70 text-sm">الظهر</p>
                    <p className="text-2xl font-bold text-white">
                        {chartData.filter(d => d.hourNum >= 12 && d.hourNum < 18).reduce((sum, d) => sum + d.messages, 0).toLocaleString()}
                    </p>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 text-center"
                    style={{ borderColor: currentTheme.primary, borderWidth: '2px' }}
                >
                    {getIcon(mostActiveHour.hourNum)}
                    <p className="text-white/70 text-sm">الأكثر نشاطاً</p>
                    <p className="text-2xl font-bold text-white">{mostActiveHour.hour}</p>
                </motion.div>
            </div>
        </div>
    );
}
