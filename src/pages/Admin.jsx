import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Bell, Image as ImageIcon, Lock, Upload, Send, Save, Music, Trophy, Calendar, Sparkles, Users, Moon, Unlock, ShieldAlert } from 'lucide-react';

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [visitorLogs, setVisitorLogs] = useState([]);
    const [activeTab, setActiveTab] = useState('notifications'); // stats, messages, questions, settings, memory, visitors
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    // Notification State
    const [notifTitle, setNotifTitle] = useState('رسالة جديدة ❤️');
    const [notifBody, setNotifBody] = useState('');

    // Media State
    const [mediaFile, setMediaFile] = useState(null);
    const [songFile, setSongFile] = useState(null);
    const [songTitle, setSongTitle] = useState('');
    const [songArtist, setSongArtist] = useState('');

    // Settings State
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [sitePassword, setSitePassword] = useState('');
    const [oldSitePassword, setOldSitePassword] = useState('');

    // Game Management State
    const [availableMedia, setAvailableMedia] = useState([]);

    const fetchVisitorLogs = async () => {
        const { data } = await supabase
            .from('visitor_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);
        if (data) setVisitorLogs(data);
    };

    useEffect(() => {
        if (activeTab === 'visitors') fetchVisitorLogs();
    }, [activeTab]);
    const [qType, setQType] = useState('photo');
    const [qLabel, setQLabel] = useState('');
    const [qAnswer, setQAnswer] = useState('');
    const [qOptions, setQOptions] = useState(['', '', '', '']);
    const [qCorrectIndex, setQCorrectIndex] = useState(0); // 0-based index
    const [qHint, setQHint] = useState('');
    const [qMediaUrl, setQMediaUrl] = useState('');
    const [gameQuestions, setGameQuestions] = useState([]);
    const [qTargetPlayer, setQTargetPlayer] = useState('both');

    // Extra Memory State
    const [extraMemories, setExtraMemories] = useState([]);
    const [newMemoryContent, setNewMemoryContent] = useState('');
    const [newMemoryCategory, setNewMemoryCategory] = useState('general');

    // Check Login
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Check against Supabase or fallback
        const { data, error } = await supabase
            .from('app_settings')
            .select('value')
            .eq('key', 'admin_password');

        const dbPass = (data && data.length > 0) ? data[0].value : '0000';

        if (password === dbPass) {
            setIsAuthenticated(true);
            setStatus('');
        } else {
            setStatus('كلمة المرور غير صحيحة');
        }
        setLoading(false);
    };

    // Change Password
    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword) return setStatus('املأ البيانات');
        setLoading(true);

        try {
            // Verify Old
            const { data } = await supabase
                .from('app_settings')
                .select('value')
                .eq('key', 'admin_password')
                .single();

            const currentPass = data?.value || '0000';

            if (oldPassword !== currentPass) {
                setStatus('كلمة المرور القديمة خطأ');
                setLoading(false);
                return;
            }

            // Update New
            const { error } = await supabase
                .from('app_settings')
                .upsert({ key: 'admin_password', value: newPassword });

            if (error) throw error;

            setStatus('تم تغيير كلمة المرور بنجاح! 🔐');
            setOldPassword('');
            setNewPassword('');
            // Create settings table if not exists? SQL executed already.

        } catch (err) {
            console.error(err);
            setStatus('فشل التغيير: ' + err.message);
        }
        setLoading(false);
    };

    // Send Notification
    const handleSendNotification = async () => {
        if (!notifBody) return setStatus('اكتب رسالة الأول');
        setLoading(true);
        setStatus('جاري الإرسال...');

        try {
            // Point to Vercel API if on Firebase Hosting
            const API_BASE = import.meta.env.VITE_API_URL || '';
            console.log('Sending notification via:', API_BASE || 'current domain');
            const res = await fetch(`${API_BASE}/api/sendPush`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: notifTitle, body: notifBody, password })
            });

            if (res.ok) {
                setStatus('تم الإرسال بنجاح! 🚀');
                setNotifBody('');
            } else {
                setStatus('فشل الإرسال. تأكد من VAPID Keys.');
            }
        } catch (err) {
            console.error(err);
            setStatus('حدث خطأ أثناء الإرسال');
        }
        setLoading(false);
    };

    // Upload Media (Image/Video)
    const handleUploadMedia = async () => {
        if (!mediaFile) return;
        setLoading(true);
        setStatus('جاري الرفع...');

        try {
            const fileExt = mediaFile.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('media')
                .upload(filePath, mediaFile);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('media')
                .getPublicUrl(filePath);

            const type = mediaFile.type.startsWith('video') ? 'video' : 'image';

            const { error: dbError } = await supabase
                .from('media')
                .insert([{ type, url: publicUrl }]);

            if (dbError) throw dbError;

            setStatus('تم رفع الملف بنجاح! ✅');
            setMediaFile(null);
        } catch (error) {
            console.error(error);
            setStatus('فشل الرفع: ' + error.message);
        }
        setLoading(false);
    };

    // Upload Song
    const handleUploadSong = async () => {
        if (!songFile || !songTitle) return setStatus('اكمل بيانات الأغنية');
        setLoading(true);
        setStatus('جاري رفع الأغنية...');

        try {
            const fileExt = songFile.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('audio')
                .upload(fileName, songFile);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('audio')
                .getPublicUrl(fileName);

            const { error: dbError } = await supabase
                .from('songs')
                .insert([{ title: songTitle, artist: songArtist || 'Unknown', url: publicUrl }]);

            if (dbError) throw dbError;

            setStatus('تم إضافة الأغنية لقائمة التشغيل! 🎵');
            setSongFile(null);
            setSongTitle('');
            setSongArtist('');
        } catch (error) {
            console.error(error);
            setStatus('فشل الرفع: ' + error.message);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (isAuthenticated) {
            if (activeTab === 'game') fetchGameQuestions();
            if (activeTab === 'memory') fetchExtraMemories();
        }
    }, [isAuthenticated, activeTab]);

    const fetchExtraMemories = async () => {
        const { data, error } = await supabase
            .from('extra_memory')
            .select('*')
            .order('created_at', { ascending: false });
        if (data) setExtraMemories(data);
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchSitePassword();
        }
    }, [isAuthenticated]);

    const fetchSitePassword = async () => {
        const { data } = await supabase
            .from('app_settings')
            .select('value')
            .eq('key', 'site_password');

        if (data && data.length > 0) {
            setSitePassword(data[0].value);
        } else {
            setSitePassword('0000');
        }
    };

    const handleUpdateSitePassword = async () => {
        if (sitePassword.length < 4) return setStatus('كلمة سر الموقع لازم على الأقل 4 أرقام');
        if (!oldSitePassword) return setStatus('اكتب كلمة السر القديمة للموقع الأول');
        setLoading(true);

        // Verify current site password first
        const { data } = await supabase
            .from('app_settings')
            .select('value')
            .eq('key', 'site_password')
            .single();

        const currentSitePass = data?.value || '0000';
        if (oldSitePassword !== currentSitePass) {
            setStatus('⚠️ كلمة السر القديمة للموقع غلط!');
            setLoading(false);
            return;
        }

        const { error } = await supabase
            .from('app_settings')
            .upsert({ key: 'site_password', value: sitePassword });
        if (!error) {
            setStatus('تم تحديث كلمة مرور الموقع بنجاح! 🔑');
            setOldSitePassword('');
        } else {
            setStatus('فشل التحديث: ' + error.message);
        }
        setLoading(false);
    };

    const handleAddMemory = async () => {
        if (!newMemoryContent.trim()) return setStatus('اكتب حاجة الأول');
        setLoading(true);
        try {
            const { error } = await supabase
                .from('extra_memory')
                .insert([{ content: newMemoryContent, category: newMemoryCategory }]);
            if (error) throw error;
            setStatus('تم إضافة المعلومة للذاكرة بنجاح! 🧠');
            setNewMemoryContent('');
            fetchExtraMemories();
        } catch (err) {
            setStatus('فشل الإضافة: ' + err.message);
        }
        setLoading(false);
    };

    const handleDeleteMemory = async (id) => {
        if (!window.confirm('متأكد إنك عايز تمسح المعلومة دي؟')) return;
        const { error } = await supabase.from('extra_memory').delete().eq('id', id);
        if (!error) {
            setStatus('تم المسح بنجاح');
            fetchExtraMemories();
        }
    };

    const fetchGameQuestions = async () => {
        const { data: qData } = await supabase
            .from('game_questions')
            .select('*')
            .order('created_at', { ascending: false });
        if (qData) setGameQuestions(qData);

        // Fetch from Storage Bucket directly - getting all items
        const { data: storageFiles } = await supabase.storage
            .from('media')
            .list('', { limit: 500, offset: 0, sortBy: { column: 'name', order: 'desc' } });

        if (storageFiles) {
            const mediaWithUrls = storageFiles
                .filter(file => !file.name.startsWith('.'))
                .map(file => {
                    const { data: { publicUrl } } = supabase.storage
                        .from('media')
                        .getPublicUrl(file.name);

                    // Simple type detection by extension if metadata is missing
                    const isVideo = file.name.toLowerCase().match(/\.(mp4|mov|webm|ogg)$/);

                    return {
                        id: file.id || file.name,
                        url: publicUrl,
                        name: file.name,
                        type: isVideo ? 'video' : 'image'
                    };
                });
            setAvailableMedia(mediaWithUrls);
        }
    };

    const handleAddQuestion = async () => {
        if (!qLabel || qOptions.some(o => !o)) return setStatus('اكمل بيانات السؤال والـ 4 اختيارات');
        setLoading(true);
        try {
            const { error } = await supabase.from('game_questions').insert([{
                type: qType,
                label: qLabel,
                answer: qOptions[qCorrectIndex], // Still keep text for safety, but we'll use index
                options: qOptions,
                correct_option_index: qCorrectIndex,
                hint: qHint,
                media_url: qMediaUrl,
                target_player: qTargetPlayer
            }]);
            if (error) throw error;
            setStatus('تم إضافة السؤال بنجاح! 🎯');
            setQLabel('');
            setQAnswer('');
            setQOptions(['', '', '', '']);
            setQCorrectIndex(0);
            setQHint('');
            setQMediaUrl('');
            setQTargetPlayer('both');
            fetchGameQuestions();
        } catch (error) {
            setStatus('فشل الإضافة: ' + error.message);
        }
        setLoading(false);
    };

    const handleDeleteQuestion = async (id) => {
        if (!window.confirm('متأكد إنك عايز تمسح السؤال ده؟')) return;
        const { error } = await supabase.from('game_questions').delete().eq('id', id);
        if (!error) {
            setStatus('تم المسح بنجاح');
            fetchGameQuestions();
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
                <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-700">
                    <div className="flex justify-center mb-6 text-cyan-400">
                        <Lock size={48} />
                    </div>
                    <h2 className="text-2xl font-bold text-center mb-6">لوحة التحكم</h2>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="دخل الرقم السري يا باشا"
                            className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-cyan-500 outline-none text-center text-lg tracking-widest"
                            maxLength={4}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 p-3 rounded-lg font-bold hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] transition"
                        >
                            {loading ? 'ثواني...' : 'دخول'}
                        </button>
                        {status && <p className="text-red-400 text-center text-sm">{status}</p>}
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white pb-20">
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-8 mt-4">
                    Admin Dashboard 🛠️
                </h1>

                {/* Status Bar */}
                {status && (
                    <div className={`p-4 mb-6 rounded-lg ${status.includes('نجاح') ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                        {status}
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                    <button
                        onClick={() => setActiveTab('notifications')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl transition ${activeTab === 'notifications' ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                    >
                        <Bell size={20} /> الإشعارات
                    </button>
                    <button
                        onClick={() => setActiveTab('media')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl transition ${activeTab === 'media' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                    >
                        <ImageIcon size={20} /> الصور/الفيديو
                    </button>
                    <button
                        onClick={() => setActiveTab('music')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl transition ${activeTab === 'music' ? 'bg-pink-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                    >
                        <Music size={20} /> الأغاني
                    </button>
                    <button
                        onClick={() => setActiveTab('game')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl transition ${activeTab === 'game' ? 'bg-orange-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                    >
                        <Trophy size={20} /> إدارة اللعبة
                    </button>
                    <button
                        onClick={() => setActiveTab('memory')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl transition ${activeTab === 'memory' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                    >
                        <Save size={20} /> الذاكرة
                    </button>
                    <button
                        onClick={() => setActiveTab('visitors')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl transition ${activeTab === 'visitors' ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                    >
                        <Users size={20} /> الزوار
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl transition ${activeTab === 'settings' ? 'bg-gray-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                    >
                        <Lock size={20} /> الأمان
                    </button>
                </div>

                {/* Content */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Send size={20} className="text-cyan-400" /> إرسال إشعار لحظي
                            </h2>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    value={notifTitle}
                                    onChange={(e) => setNotifTitle(e.target.value)}
                                    placeholder="عنوان الإشعار"
                                    className="w-full p-3 bg-gray-700 rounded-lg border-gray-600 focus:border-cyan-500 outline-none"
                                />
                                <textarea
                                    value={notifBody}
                                    onChange={(e) => setNotifBody(e.target.value)}
                                    placeholder="اكتب رسالتك هنا..."
                                    className="w-full p-3 bg-gray-700 rounded-lg border-gray-600 focus:border-cyan-500 outline-none h-32 resize-none"
                                />
                                <button
                                    onClick={handleSendNotification}
                                    disabled={loading}
                                    className="w-full bg-cyan-600 hover:bg-cyan-500 p-3 rounded-lg font-bold transition flex justify-center items-center gap-2"
                                >
                                    <Send size={18} /> ارسال الآن
                                </button>
                                <p className="text-xs text-gray-500 mt-2">
                                    * سيتم إرسال الإشعار لجميع الأجهزة المشتركة فوراً حتى لو الموقع مغلق.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Media Tab */}
                    {activeTab === 'media' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Upload size={20} className="text-purple-400" /> رفع ذكريات جديدة
                            </h2>
                            <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-purple-500 transition cursor-pointer relative">
                                <input
                                    type="file"
                                    accept="image/*,video/*"
                                    onChange={(e) => setMediaFile(e.target.files[0])}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="flex flex-col items-center">
                                    <Upload size={40} className="text-gray-400 mb-2" />
                                    <p className="text-lg font-medium">اضغط لاختيار صورة أو فيديو</p>
                                    {mediaFile && <p className="text-purple-400 mt-2">{mediaFile.name}</p>}
                                </div>
                            </div>
                            <button
                                onClick={handleUploadMedia}
                                disabled={!mediaFile || loading}
                                className="w-full bg-purple-600 hover:bg-purple-500 p-3 rounded-lg font-bold transition disabled:opacity-50"
                            >
                                رفع للمكتبة
                            </button>
                        </div>
                    )}

                    {/* Music Tab */}
                    {activeTab === 'music' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Music size={20} className="text-pink-400" /> إضافة أغنية جديدة
                            </h2>
                            <div className="space-y-4">
                                <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-pink-500 transition cursor-pointer relative">
                                    <input
                                        type="file"
                                        accept="audio/*"
                                        onChange={(e) => setSongFile(e.target.files[0])}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="flex flex-col items-center">
                                        <Music size={40} className="text-gray-400 mb-2" />
                                        <p className="text-lg font-medium">اضغط لاختيار ملف صوتي</p>
                                        {songFile && <p className="text-pink-400 mt-2">{songFile.name}</p>}
                                    </div>
                                </div>

                                <input
                                    type="text"
                                    value={songTitle}
                                    onChange={(e) => setSongTitle(e.target.value)}
                                    placeholder="اسم الأغنية"
                                    className="w-full p-3 bg-gray-700 rounded-lg border-gray-600 focus:border-pink-500 outline-none"
                                />
                                <input
                                    type="text"
                                    value={songArtist}
                                    onChange={(e) => setSongArtist(e.target.value)}
                                    placeholder="الفنان (اختياري)"
                                    className="w-full p-3 bg-gray-700 rounded-lg border-gray-600 focus:border-pink-500 outline-none"
                                />
                                <button
                                    onClick={handleUploadSong}
                                    disabled={!songFile || !songTitle || loading}
                                    className="w-full bg-pink-600 hover:bg-pink-500 p-3 rounded-lg font-bold transition disabled:opacity-50"
                                >
                                    إضافة للقائمة
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Game Management Tab */}
                    {activeTab === 'game' && (
                        <div className="space-y-8">
                            <h2 className="text-xl font-semibold flex items-center gap-2 text-orange-400">
                                <Trophy size={20} /> إضافة سؤال جديد للعبة
                            </h2>

                            <div className="bg-gray-700/30 p-6 rounded-2xl border border-gray-600 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <label className="text-sm text-gray-400">نوع السؤال</label>
                                        <select
                                            value={qType}
                                            onChange={(e) => setQType(e.target.value)}
                                            className="w-full p-4 bg-gray-800 rounded-xl outline-none border border-gray-600 focus:border-orange-500 transition"
                                        >
                                            <option value="photo">تخمين صورة 📸</option>
                                            <option value="date">تخمين تاريخ 📅</option>
                                        </select>

                                        <label className="text-sm text-gray-400">مين اللي هيلعب؟</label>
                                        <select
                                            value={qTargetPlayer}
                                            onChange={(e) => setQTargetPlayer(e.target.value)}
                                            className="w-full p-4 bg-gray-800 rounded-xl outline-none border border-gray-600 focus:border-orange-500 transition"
                                        >
                                            <option value="both">جنى وأحمد (الكل) 👫</option>
                                            <option value="jana">جنى بس 👸</option>
                                            <option value="ahmed">أحمد بس 🤵</option>
                                        </select>

                                        <label className="text-sm text-gray-400">السؤال / الحدث</label>
                                        <input
                                            type="text"
                                            value={qLabel}
                                            onChange={(e) => setQLabel(e.target.value)}
                                            placeholder={qType === 'photo' ? "عنوان الصورة (مثلاً: فاكرة دي فين؟)" : "الحدث (مثلاً: كتبنا الكتاب)"}
                                            className="w-full p-4 bg-gray-800 rounded-xl outline-none border border-gray-600 focus:border-orange-500"
                                        />

                                        <label className="text-sm text-gray-400">رقم الإجابة الصحيحة (1-4)</label>
                                        <select
                                            value={qCorrectIndex + 1}
                                            onChange={(e) => setQCorrectIndex(parseInt(e.target.value) - 1)}
                                            className="w-full p-4 bg-gray-800 rounded-xl outline-none border border-gray-600 focus:border-orange-500 transition"
                                        >
                                            <option value="1">الاختيار الأول 1️⃣</option>
                                            <option value="2">الاختيار الثاني 2️⃣</option>
                                            <option value="3">الاختيار الثالث 3️⃣</option>
                                            <option value="4">الاختيار الرابع 4️⃣</option>
                                        </select>

                                        {qType === 'photo' && (
                                            <div className="space-y-2">
                                                <label className="text-sm text-gray-400">اختار صورة من المكتبة</label>
                                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                                    {availableMedia.filter(m => m.type === 'image').map(m => (
                                                        <img
                                                            key={m.id}
                                                            src={m.url}
                                                            onClick={() => setQMediaUrl(m.url)}
                                                            className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 transition ${qMediaUrl === m.url ? 'border-orange-500' : 'border-transparent'}`}
                                                        />
                                                    ))}
                                                </div>
                                                <input
                                                    type="text"
                                                    value={qMediaUrl}
                                                    onChange={(e) => setQMediaUrl(e.target.value)}
                                                    placeholder="أو حط رابط الصورة هنا"
                                                    className="w-full p-3 bg-gray-800 rounded-lg text-xs outline-none border border-gray-600"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-sm text-gray-400">الاختيارات الأربعة 👇</label>
                                        <div className="grid grid-cols-1 gap-3">
                                            {qOptions.map((opt, i) => (
                                                <input
                                                    key={i}
                                                    type="text"
                                                    value={opt}
                                                    onChange={(e) => {
                                                        const newOpts = [...qOptions];
                                                        newOpts[i] = e.target.value;
                                                        setQOptions(newOpts);
                                                    }}
                                                    placeholder={`اختيار رقم ${i + 1}`}
                                                    className="w-full p-3 bg-gray-800 rounded-xl outline-none border border-gray-600 focus:border-orange-500"
                                                />
                                            ))}
                                        </div>

                                        <label className="text-sm text-gray-400">تلميح (Hint)</label>
                                        <input
                                            type="text"
                                            value={qHint}
                                            onChange={(e) => setQHint(e.target.value)}
                                            placeholder="تلميح يساعدها لو معرفتش"
                                            className="w-full p-4 bg-gray-800 rounded-xl outline-none border border-gray-600 focus:border-orange-500"
                                        />

                                        <button
                                            onClick={handleAddQuestion}
                                            disabled={loading}
                                            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:shadow-[0_0_20px_rgba(234,88,12,0.4)] p-4 rounded-xl font-bold transition flex items-center justify-center gap-2"
                                        >
                                            <Trophy size={20} /> حفظ السؤال للعبة
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">الأسئلة الموجودة:</h3>
                                <div className="grid gap-3">
                                    {gameQuestions.map(q => (
                                        <div key={q.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl border border-gray-600">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-lg ${q.type === 'photo' ? 'bg-pink-500/20 text-pink-400' : 'bg-purple-500/20 text-purple-400'}`}>
                                                    {q.type === 'photo' ? <ImageIcon size={20} /> : <Calendar size={20} />}
                                                </div>
                                                <div>
                                                    <p className="font-bold">{q.label}</p>
                                                    <p className="text-sm text-gray-400">
                                                        {q.answer} • 🎯 {q.target_player === 'both' ? 'الكل' : (q.target_player === 'jana' ? 'جنى' : 'أحمد')}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteQuestion(q.id)}
                                                className="text-red-400 hover:text-red-300 p-2"
                                            >
                                                مسح
                                            </button>
                                        </div>
                                    ))}
                                    {gameQuestions.length === 0 && (
                                        <p className="text-center text-gray-500 py-4">مفيش أسئلة لسه..</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Extra Memory Tab */}
                    {activeTab === 'memory' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold flex items-center gap-2 text-indigo-400">
                                <Sparkles size={20} /> إدارة الذاكرة الإضافية
                            </h2>
                            <p className="text-sm text-gray-400">أي معلومة هتضيفها هنا الـ AI هيعرفها وهيقدر يرد بيها على جنى وأحمد.</p>


                            <div className="bg-gray-700/30 p-6 rounded-2xl border border-gray-600 space-y-4">
                                <textarea
                                    value={newMemoryContent}
                                    onChange={(e) => setNewMemoryContent(e.target.value)}
                                    placeholder="مثلاً: عيد ميلاد جنى يوم 22 أكتوبر، أو أحمد بيحب الشوكولاتة البيضاء.."
                                    className="w-full p-4 bg-gray-800 rounded-xl outline-none border border-gray-600 focus:border-indigo-500 h-32"
                                />
                                <div className="flex gap-4">
                                    <select
                                        value={newMemoryCategory}
                                        onChange={(e) => setNewMemoryCategory(e.target.value)}
                                        className="p-3 bg-gray-800 rounded-lg outline-none border border-gray-600 focus:border-indigo-500"
                                    >
                                        <option value="general">عام</option>
                                        <option value="likes">تفضيلات</option>
                                        <option value="dislikes">حاجات بيضايقوا منها</option>
                                        <option value="dates">مواعيد مهمة</option>
                                    </select>
                                    <button
                                        onClick={handleAddMemory}
                                        disabled={loading}
                                        className="flex-1 bg-indigo-600 hover:bg-indigo-500 p-3 rounded-lg font-bold transition flex items-center justify-center gap-2"
                                    >
                                        <Save size={18} /> حفظ في الذاكرة
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">المعلومات المحفوظة:</h3>
                                <div className="grid gap-3">
                                    {extraMemories.map(m => (
                                        <div key={m.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl border border-gray-600">
                                            <div className="flex-1">
                                                <p className="font-medium text-slate-100">{m.content}</p>
                                                <span className="text-[10px] uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                                                    {m.category}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteMemory(m.id)}
                                                className="text-red-400 hover:text-red-300 p-2 ml-4 flex-shrink-0"
                                            >
                                                مسح
                                            </button>
                                        </div>
                                    ))}
                                    {extraMemories.length === 0 && (
                                        <p className="text-center text-gray-500 py-4">مفيش معلومات إضافية لسه.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <div className="space-y-8 max-w-2xl">
                            <h2 className="text-2xl font-black flex items-center gap-3 text-red-500 uppercase tracking-tighter italic">
                                <Lock size={28} /> Security Center / الأمان
                            </h2>

                            {/* Section 1: Admin Dashboard Password */}
                            <div className="bg-gray-700/30 p-8 rounded-3xl border border-gray-600/50 shadow-xl space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-red-500/10 rounded-2xl text-red-400">
                                        <Lock size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-100">باسوورد الـ Admin</h3>
                                        <p className="text-sm text-gray-400">تحكم في الدخول للوحة التحكم دي بس.</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <input
                                        type="password"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        placeholder="كلمة المرور الحالية للـ Admin"
                                        className="w-full p-4 bg-gray-800/80 rounded-2xl border border-gray-600 focus:border-red-500 outline-none transition-all"
                                    />
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="كلمة المرور الجديدة للـ Admin"
                                        className="w-full p-4 bg-gray-800/80 rounded-2xl border border-gray-600 focus:border-red-500 outline-none transition-all"
                                    />
                                    <button
                                        onClick={handleChangePassword}
                                        disabled={loading}
                                        className="w-full bg-red-600 hover:bg-red-500 p-4 rounded-2xl font-bold transition flex justify-center items-center gap-2 shadow-lg shadow-red-600/20 disabled:opacity-50"
                                    >
                                        <Save size={20} /> تحديث باسوورد الـ Admin
                                    </button>
                                </div>
                            </div>

                            {/* Section 2: Entire Site Lock Password */}
                            <div className="bg-gray-700/30 p-8 rounded-3xl border border-gray-600/50 shadow-xl space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400">
                                        <Sparkles size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-100">قفل الموقع بالكامل (الشقية)</h3>
                                        <p className="text-sm text-gray-400">تحكم في الكود اللي بيقفل الموقع كله على جنى وأحمد.</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <input
                                        type="password"
                                        value={oldSitePassword}
                                        onChange={(e) => setOldSitePassword(e.target.value)}
                                        placeholder="كلمة السر القديمة للموقع"
                                        className="w-full p-4 bg-gray-800/80 rounded-2xl border border-gray-600 focus:border-indigo-500 outline-none transition-all"
                                    />
                                    <input
                                        type="text"
                                        value={sitePassword}
                                        onChange={(e) => setSitePassword(e.target.value)}
                                        placeholder="كلمة السر الجديدة للموقع (أرقام)"
                                        className="w-full p-4 bg-gray-800/80 rounded-2xl border border-gray-600 focus:border-indigo-500 outline-none transition-all"
                                    />
                                    <button
                                        onClick={handleUpdateSitePassword}
                                        disabled={loading}
                                        className="w-full bg-indigo-600 hover:bg-indigo-500 p-4 rounded-2xl font-bold transition shadow-lg shadow-indigo-600/20"
                                    >
                                        تحديث قفل الموقع
                                    </button>
                                </div>
                            </div>

                            <p className="text-center text-xs text-gray-500 italic">
                                مفيش خروج غير بالباسورد.. خليك فاكره كويس! 🦆🔐
                            </p>
                        </div>
                    )}

                    {/* Visitors Tab */}
                    {activeTab === 'visitors' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold flex items-center gap-2 text-cyan-400">
                                <Users size={20} /> نشاط الزوار
                            </h2>
                            <div className="grid gap-4">
                                {visitorLogs.map(log => (
                                    <div key={log.id} className="bg-gray-700/30 p-4 rounded-xl border border-gray-600 flex flex-col gap-3">
                                        {/* Top Section: Icon + Data */}
                                        <div className="flex items-start gap-3">
                                            {/* Icon with fixed size */}
                                            <div className={`p-3 rounded-xl shrink-0 ${log.entry_type === 'SITE' ? 'bg-green-500/20 text-green-400' :
                                                log.entry_type === 'ISLAMIC' ? 'bg-blue-500/20 text-blue-400' :
                                                    log.entry_type === 'FAILED' ? 'bg-red-500/20 text-red-400' :
                                                        'bg-gray-500/20 text-gray-400'
                                                }`}>
                                                {log.entry_type === 'SITE' && <Unlock size={20} />}
                                                {log.entry_type === 'ISLAMIC' && <Moon size={20} />}
                                                {log.entry_type === 'FAILED' && <ShieldAlert size={20} />}
                                                {log.entry_type === 'PENDING' && <Lock size={20} />}
                                            </div>

                                            {/* Text Content with min-w-0 to allow truncating */}
                                            <div className="flex-1 min-w-0 space-y-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="font-bold text-slate-100 text-sm">{log.location_data?.city || 'Unknown'}, {log.location_data?.country_name || 'Unknown'}</span>
                                                    <span className="text-[10px] bg-gray-600 px-2 py-0.5 rounded uppercase font-mono">{log.ip_hint}</span>
                                                </div>

                                                {/* Truncated User Agent */}
                                                <p className="text-xs text-gray-400 truncate w-full block">
                                                    {log.user_agent}
                                                </p>

                                                {log.latitude && (
                                                    <a
                                                        href={`https://www.google.com/maps?q=${log.latitude},${log.longitude}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 mt-1 w-fit"
                                                    >
                                                        📍 عرض الموقع
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                        {/* Bottom Section: Footer for Device & Date */}
                                        <div className="flex items-center justify-between pt-2 border-t border-gray-600/30 mt-1">
                                            <span className="text-xs font-medium text-cyan-400">{log.device_info?.platform || 'Device unknown'}</span>
                                            <span className="text-[10px] text-gray-500">{new Date(log.created_at).toLocaleString('ar-EG')}</span>
                                        </div>
                                    </div>
                                ))}
                                {visitorLogs.length === 0 && (
                                    <p className="text-center text-gray-500 py-10 italic">لسه مفيش زوار اتسجلوا..</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
