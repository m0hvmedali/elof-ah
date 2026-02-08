import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Bell, music, Image as ImageIcon, Lock, Upload, Send, Save, Music } from 'lucide-react';

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

                </div>
            </div>
        </div>
    );
}
