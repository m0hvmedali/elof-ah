import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Zap, ShieldAlert, Sparkles, Ghost } from 'lucide-react';
import { supabase } from '../../supabaseClient';

export default function SiteLock({ children }) {
    const [isLocked, setIsLocked] = useState(true);
    const [password, setPassword] = useState('');
    const [dbPassword, setDbPassword] = useState(null);
    const [isEscaping, setIsEscaping] = useState(true);
    const [isAngry, setIsAngry] = useState(false);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [status, setStatus] = useState('');
    const [isFlashing, setIsFlashing] = useState(false);

    // Fetch global password from Supabase
    useEffect(() => {
        const fetchPass = async () => {
            const { data } = await supabase
                .from('app_settings')
                .select('value')
                .eq('key', 'site_password')
                .single();
            setDbPassword(data?.value || '0000');
        };
        fetchPass();
    }, []);

    // Check if user already unlocked in this session
    useEffect(() => {
        const unlocked = sessionStorage.getItem('site_unlocked');
        if (unlocked === 'true') setIsLocked(false);
    }, []);

    const handleEscape = () => {
        if (!isEscaping) return;

        setIsAngry(true);
        setIsFlashing(true);

        // Random position within 70% of screen
        const maxX = window.innerWidth * 0.35;
        const maxY = window.innerHeight * 0.35;
        const newX = (Math.random() - 0.5) * maxX * 2;
        const newY = (Math.random() - 0.5) * maxY * 2;

        setPos({ x: newX, y: newY });

        setTimeout(() => {
            setIsAngry(false);
            setIsFlashing(false);
        }, 500);
    };

    const handleUnlock = () => {
        if (password === dbPassword) {
            sessionStorage.setItem('site_unlocked', 'true');
            setIsLocked(false);
        } else {
            setStatus('❌ كلمة السر غلط يا بطل!');
            setPassword('');
        }
    };

    if (!isLocked) return children;

    return (
        <div className={`fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden transition-colors duration-200 ${isFlashing ? 'bg-red-600/30' : 'bg-slate-950'}`}>
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/20 via-transparent to-pink-500/20"></div>
            </div>

            <AnimatePresence>
                <div className="text-center space-y-8 z-10 px-4">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex flex-col items-center"
                    >
                        <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.5)] mb-4">
                            {isAngry ? <Ghost size={40} className="text-white animate-bounce" /> : <Lock size={40} className="text-white" />}
                        </div>
                        <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-400">
                            ممنوع الدخول!
                        </h1>
                        <p className="text-slate-400 mt-2">الموقع محمي، هات كلمة السر عشان تعدي..</p>
                    </motion.div>

                    <div className="relative pt-12">
                        <motion.div
                            animate={{
                                x: pos.x,
                                y: pos.y,
                                rotate: isAngry ? [0, -10, 10, -10, 10, 0] : 0,
                                scale: isAngry ? 1.1 : 1
                            }}
                            transition={{ type: 'spring', damping: 10, stiffness: 100 }}
                            onMouseEnter={handleEscape}
                            onTouchStart={handleEscape}
                            className="relative"
                        >
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                                <div className="relative bg-slate-900 ring-1 ring-slate-800 rounded-2xl p-2 flex items-center">
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleUnlock()}
                                        placeholder="كلمة السر..."
                                        className="bg-transparent border-none outline-none text-white px-4 py-3 text-xl w-48 text-center font-mono tracking-widest"
                                    />
                                    <button
                                        onClick={handleUnlock}
                                        className="p-3 bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-colors"
                                    >
                                        <Unlock size={20} />
                                    </button>
                                </div>
                            </div>

                            {isAngry && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: -40 }}
                                    className="absolute inset-x-0 text-4xl"
                                >
                                    😡 نينيني
                                </motion.div>
                            )}
                        </motion.div>
                    </div>

                    <div className="flex flex-col items-center gap-4 pt-12">
                        <button
                            onClick={() => setIsEscaping(!isEscaping)}
                            className="text-[10px] uppercase tracking-[0.3em] font-bold py-2 px-6 rounded-full border border-slate-800 text-slate-500 hover:text-white hover:border-slate-600 transition-all flex items-center gap-2"
                        >
                            {isEscaping ? <Zap size={10} /> : <ShieldAlert size={10} />}
                            {isEscaping ? 'ثبته عشان أكتب! ' : 'خلاص ثبت! اكتب بقى'}
                        </button>

                        {status && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-pink-500 font-bold"
                            >
                                {status}
                            </motion.p>
                        )}
                    </div>
                </div>
            </AnimatePresence>
        </div>
    );
}
