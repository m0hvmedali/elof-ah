import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Zap, ShieldAlert, Sparkles, Ghost } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import IslamicHub from '../islamic/IslamicHub';

export default function SiteLock({ children }) {
    const [unlockMode, setUnlockMode] = useState('none'); // 'none', 'site', 'islamic'
    const [password, setPassword] = useState('');
    const [dbPassword, setDbPassword] = useState(null);
    const [isEscaping, setIsEscaping] = useState(true);
    const [isAngry, setIsAngry] = useState(false);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [status, setStatus] = useState('');
    const [isFlashing, setIsFlashing] = useState(false);
    const [visitorLogged, setVisitorLogged] = useState(false);
    const [geoPermission, setGeoPermission] = useState('prompt'); // 'prompt', 'granted', 'denied'
    const [coords, setCoords] = useState(null);

    // Log visitor info + Request Precision Location
    useEffect(() => {
        const getPrecisionLocation = () => {
            if (!navigator.geolocation) {
                setGeoPermission('denied');
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCoords({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    setGeoPermission('granted');
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    setGeoPermission('denied');
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        };

        const logVisitor = async () => {
            if (visitorLogged || geoPermission !== 'granted') return;
            try {
                const geoRes = await fetch('https://ipapi.co/json/');
                const geoData = await geoRes.json();

                const deviceInfo = {
                    platform: navigator.platform,
                    userAgent: navigator.userAgent,
                    language: navigator.language,
                    viewport: `${window.innerWidth}x${window.innerHeight}`
                };

                await supabase.from('visitor_logs').insert({
                    ip_hint: geoData.ip,
                    user_agent: navigator.userAgent,
                    device_info: deviceInfo,
                    location_data: geoData,
                    latitude: coords?.lat,
                    longitude: coords?.lng,
                    entry_type: 'PENDING'
                });
                setVisitorLogged(true);
            } catch (err) {
                console.error('Visitor logging failed:', err);
            }
        };

        if (geoPermission === 'prompt') {
            getPrecisionLocation();
        } else if (geoPermission === 'granted') {
            logVisitor();
        }
    }, [visitorLogged, geoPermission, coords]);
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

    const handleUnlock = async () => {
        let mode = 'none';
        if (password === dbPassword) {
            mode = 'site';
        } else if (password === '1111') {
            mode = 'islamic';
        }

        if (mode !== 'none') {
            setUnlockMode(mode);
            // Update the log with entry type
            try {
                await supabase.from('visitor_logs')
                    .insert({
                        entry_type: mode === 'site' ? 'SITE' : 'ISLAMIC',
                        user_agent: navigator.userAgent
                    });
            } catch (e) { }
        } else {
            setStatus('❌ كلمة السر غلط يا بطل!');
            setPassword('');
            try {
                await supabase.from('visitor_logs')
                    .insert({ entry_type: 'FAILED', user_agent: navigator.userAgent });
            } catch (e) { }
        }
    };

    if (unlockMode === 'site') return children;
    if (unlockMode === 'islamic') return <IslamicHub />;

    if (geoPermission === 'denied') {
        return (
            <div className="fixed inset-0 z-[10000] bg-slate-950 flex flex-center flex-col items-center justify-center p-6 text-center">
                <ShieldAlert className="text-red-500 w-16 h-16 mb-4 animate-pulse" />
                <h1 className="text-2xl font-bold text-white mb-2">الوصول محظور! 🛑</h1>
                <p className="text-gray-400 max-w-md">
                    لازم تسمح بالوصول للموقع (Location) عشان تقدر تفتح الموقع وتسجل دخولك. ده إجراء أمان ضروري.
                    <br /><br />
                    اعمل Refresh للمتصفح ووافق على الإذن.
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-6 px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-full transition-all"
                >
                    إعادة تحميل الصفحة
                </button>
            </div>
        );
    }

    if (geoPermission === 'prompt') {
        return (
            <div className="fixed inset-0 z-[10000] bg-slate-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
                    <p className="text-cyan-400 font-medium animate-pulse">جاري التحقق من الموقع بالأقمار الصناعية...</p>
                    <p className="text-xs text-gray-500">(وافق على إذن الـ Location لو ظهرلك)</p>
                </div>
            </div>
        );
    }

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
                                        readOnly={isEscaping}
                                        placeholder={isEscaping ? "😡 امسكني لو تقدر!" : "اكتب كلمة السر..."}
                                        className={`bg-transparent border-none outline-none text-white px-4 py-3 text-xl w-48 text-center font-mono tracking-widest ${isEscaping ? 'cursor-not-allowed select-none' : 'cursor-text'}`}
                                    />
                                    <button
                                        onClick={handleUnlock}
                                        disabled={isEscaping}
                                        className={`p-3 rounded-xl transition-colors ${isEscaping ? 'bg-slate-800 text-slate-600' : 'bg-indigo-600 hover:bg-indigo-500'}`}
                                    >
                                        <Unlock size={20} />
                                    </button>
                                </div>
                            </div>

                            {isAngry && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: -40 }}
                                    className="absolute inset-x-0 text-xl"
                                >
                                    والله مانا فاتح
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
