import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Bell, music, Image as ImageIcon, Lock, Upload, Send, Save, Music, Trophy, Calendar } from 'lucide-react';

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState('notifications');
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

    // Game Management State
    const [gameQuestions, setGameQuestions] = useState([]);
    const [availableMedia, setAvailableMedia] = useState([]);
    const [qType, setQType] = useState('photo');
    const [qLabel, setQLabel] = useState('');
    const [qAnswer, setQAnswer] = useState('');
    const [qOptions, setQOptions] = useState(['', '', '', '']);
    const [qHint, setQHint] = useState('');
    const [qMediaUrl, setQMediaUrl] = useState('');

    // Check Login
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Check against Supabase or fallback
        const { data, error } = await supabase
            .from('app_settings')
            .select('value')
            .eq('key', 'admin_password')
            .single();

        const dbPass = data?.value || '0000'; // Default if not found

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
            // Call Vercel Function
            const res = await fetch('/api/sendPush', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: notifTitle, body: notifBody, password }) // Send password for extra security check if needed
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

    // Game Management Logic
    useEffect(() => {
        if (isAuthenticated && activeTab === 'game') {
            fetchGameQuestions();
        }
    }, [isAuthenticated, activeTab]);

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
        if (!qLabel || !qAnswer || qOptions.some(o => !o)) return setStatus('اكمل بيانات السؤال والـ 4 اختيارات');
        setLoading(true);
        try {
            const { error } = await supabase.from('game_questions').insert([{
                type: qType,
                label: qLabel,
                answer: qAnswer,
                options: qOptions,
                hint: qHint,
                media_url: qMediaUrl
            }]);
            if (error) throw error;
            setStatus('تم إضافة السؤال بنجاح! 🎯');
            setQLabel('');
            setQAnswer('');
            setQOptions(['', '', '', '']);
            setQHint('');
            setQMediaUrl('');
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
                        onClick={() => setActiveTab('settings')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl transition ${activeTab === 'settings' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                    >
                        <Lock size={20} /> الإعدادات
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

                                        <label className="text-sm text-gray-400">السؤال / الحدث</label>
                                        <input
                                            type="text"
                                            value={qLabel}
                                            onChange={(e) => setQLabel(e.target.value)}
                                            placeholder={qType === 'photo' ? "عنوان الصورة (مثلاً: فاكرة دي فين؟)" : "الحدث (مثلاً: كتبنا الكتاب)"}
                                            className="w-full p-4 bg-gray-800 rounded-xl outline-none border border-gray-600 focus:border-orange-500"
                                        />

                                        <label className="text-sm text-gray-400">الإجابة الصحيحة (لازم تكون من الاختيارات الـ 4)</label>
                                        <input
                                            type="text"
                                            value={qAnswer}
                                            onChange={(e) => setQAnswer(e.target.value)}
                                            placeholder="الإجابة الصح بالظبط"
                                            className="w-full p-4 bg-gray-800 rounded-xl outline-none border border-gray-600 focus:border-orange-500"
                                        />

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
                                                    <p className="text-sm text-gray-400">{q.answer}</p>
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

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Lock size={20} className="text-red-400" /> تغيير كلمة المرور
                            </h2>
                            <div className="space-y-4 max-w-md">
                                <input
                                    type="password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    placeholder="كلمة المرور الحالية"
                                    className="w-full p-3 bg-gray-700 rounded-lg border-gray-600 focus:border-red-500 outline-none"
                                />
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="كلمة المرور الجديدة"
                                    className="w-full p-3 bg-gray-700 rounded-lg border-gray-600 focus:border-red-500 outline-none"
                                />
                                <button
                                    onClick={handleChangePassword}
                                    disabled={loading}
                                    className="w-full bg-red-600 hover:bg-red-500 p-3 rounded-lg font-bold transition flex justify-center items-center gap-2 disabled:opacity-50"
                                >
                                    <Save size={18} /> حفظ التغييرات
                                </button>
                                <p className="text-xs text-gray-500">
                                    * كلمة المرور الجديدة ستحفظ في السحابة فوراً.
                                </p>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
