import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import {
    Bell, Image as ImageIcon, Lock, Upload, Send, Save, Music,
    Trophy, Calendar, Sparkles, Users, Moon, Unlock,
    ShieldAlert, X, MapPin, Monitor, Globe, Info, Trash2
} from 'lucide-react';

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [visitorLogs, setVisitorLogs] = useState([]);
    const [activeTab, setActiveTab] = useState('notifications');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');
    const [selectedLog, setSelectedLog] = useState(null); // للتحكم في نافذة تفاصيل الزائر

    // --- حالات الإشعارات ---
    const [notifTitle, setNotifTitle] = useState('رسالة جديدة ❤️');
    const [notifBody, setNotifBody] = useState('');

    // --- حالات الميديا والأغاني ---
    const [mediaFile, setMediaFile] = useState(null);
    const [songFile, setSongFile] = useState(null);
    const [songTitle, setSongTitle] = useState('');
    const [songArtist, setSongArtist] = useState('');

    // --- حالات الأمان ---
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [sitePassword, setSitePassword] = useState('');
    const [oldSitePassword, setOldSitePassword] = useState('');

    // --- حالات إدارة اللعبة ---
    const [availableMedia, setAvailableMedia] = useState([]);
    const [qType, setQType] = useState('photo');
    const [qLabel, setQLabel] = useState('');
    const [qOptions, setQOptions] = useState(['', '', '', '']);
    const [qCorrectIndex, setQCorrectIndex] = useState(0);
    const [qHint, setQHint] = useState('');
    const [qMediaUrl, setQMediaUrl] = useState('');
    const [gameQuestions, setGameQuestions] = useState([]);
    const [qTargetPlayer, setQTargetPlayer] = useState('both');

    // --- حالات الذاكرة الإضافية ---
    const [extraMemories, setExtraMemories] = useState([]);
    const [newMemoryContent, setNewMemoryContent] = useState('');
    const [newMemoryCategory, setNewMemoryCategory] = useState('general');

    // ==========================================
    //  دوال جلب البيانات (Fetching Logic)
    // ==========================================

    useEffect(() => {
        if (isAuthenticated) {
            if (activeTab === 'visitors') fetchVisitorLogs();
            if (activeTab === 'game') fetchGameQuestions();
            if (activeTab === 'memory') fetchExtraMemories();
            if (activeTab === 'settings') fetchSitePassword();
        }
    }, [isAuthenticated, activeTab]);

    const fetchVisitorLogs = async () => {
        const { data } = await supabase.from('visitor_logs').select('*').order('created_at', { ascending: false }).limit(60);
        if (data) setVisitorLogs(data);
    };

    const fetchGameQuestions = async () => {
        const { data: qData } = await supabase.from('game_questions').select('*').order('created_at', { ascending: false });
        if (qData) setGameQuestions(qData);

        const { data: storageFiles } = await supabase.storage.from('media').list('', { limit: 500 });
        if (storageFiles) {
            const mediaWithUrls = storageFiles.filter(f => !f.name.startsWith('.')).map(f => {
                const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(f.name);
                return { id: f.id, url: publicUrl, name: f.name, type: f.name.match(/\.(mp4|mov|webm)$/i) ? 'video' : 'image' };
            });
            setAvailableMedia(mediaWithUrls);
        }
    };

    const fetchExtraMemories = async () => {
        const { data } = await supabase.from('extra_memory').select('*').order('created_at', { ascending: false });
        if (data) setExtraMemories(data);
    };

    const fetchSitePassword = async () => {
        const { data } = await supabase.from('app_settings').select('value').eq('key', 'site_password').single();
        if (data) setSitePassword(data.value);
    };

    // ==========================================
    //  دوال العمليات (Action Handlers)
    // ==========================================

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { data } = await supabase.from('app_settings').select('value').eq('key', 'admin_password').single();
        const dbPass = data?.value || '0000';
        if (password === dbPass) { setIsAuthenticated(true); setStatus(''); }
        else { setStatus('⚠️ كلمة المرور غلط'); }
        setLoading(false);
    };

    const handleSendNotification = async () => {
        if (!notifBody) return;
        setLoading(true);
        try {
            const API_BASE = import.meta.env.VITE_API_URL || '';
            const res = await fetch(`${API_BASE}/api/sendPush`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: notifTitle, body: notifBody, password })
            });
            if (res.ok) { setStatus('✅ تم إرسال الإشعار'); setNotifBody(''); }
        } catch (e) { setStatus('❌ فشل الإرسال'); }
        setLoading(false);
    };

    const handleUploadMedia = async () => {
        if (!mediaFile) return;
        setLoading(true);
        const fileName = `${Date.now()}-${mediaFile.name}`;
        const { error: upErr } = await supabase.storage.from('media').upload(fileName, mediaFile);
        if (!upErr) {
            const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(fileName);
            await supabase.from('media').insert([{ type: mediaFile.type.startsWith('video') ? 'video' : 'image', url: publicUrl }]);
            setStatus('✅ تم الرفع'); setMediaFile(null);
        }
        setLoading(false);
    };

    const handleAddQuestion = async () => {
        setLoading(true);
        const { error } = await supabase.from('game_questions').insert([{
            type: qType, label: qLabel, options: qOptions, answer: qOptions[qCorrectIndex],
            correct_option_index: qCorrectIndex, hint: qHint, media_url: qMediaUrl, target_player: qTargetPlayer
        }]);
        if (!error) { setStatus('✅ تم إضافة السؤال'); setQLabel(''); setQOptions(['', '', '', '']); fetchGameQuestions(); }
        setLoading(false);
    };

    const handleAddMemory = async () => {
        if (!newMemoryContent) return;
        setLoading(true);
        await supabase.from('extra_memory').insert([{ content: newMemoryContent, category: newMemoryCategory }]);
        setStatus('✅ تم الحفظ في الذاكرة'); setNewMemoryContent(''); fetchExtraMemories();
        setLoading(false);
    };

    const handleUpdateSitePassword = async () => {
        setLoading(true);
        const { data } = await supabase.from('app_settings').select('value').eq('key', 'site_password').single();
        if (oldSitePassword !== data?.value) { setStatus('⚠️ باسوورد الموقع القديم غلط'); setLoading(false); return; }
        await supabase.from('app_settings').upsert({ key: 'site_password', value: sitePassword });
        setStatus('✅ تم تحديث قفل الموقع'); setOldSitePassword('');
        setLoading(false);
    };

    // ==========================================
    //  واجهة المستخدم (UI)
    // ==========================================

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4 font-sans" dir="rtl">
                <div className="bg-gray-800 p-8 rounded-[2rem] border border-gray-700 w-full max-w-md shadow-2xl">
                    <div className="flex justify-center mb-6 text-cyan-400"><Lock size={50} strokeWidth={1.5} /></div>
                    <h2 className="text-2xl font-black text-center mb-8 uppercase tracking-tight">Admin Access</h2>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="رقم السر يا عبقري" className="w-full p-4 bg-gray-700 rounded-2xl border border-gray-600 focus:border-cyan-500 outline-none text-center text-2xl tracking-[0.5em]" maxLength={4} />
                        <button type="submit" disabled={loading} className="w-full bg-cyan-600 p-4 rounded-2xl font-bold hover:bg-cyan-500 transition-all active:scale-95 shadow-lg shadow-cyan-600/20">{loading ? 'تحقق...' : 'دخول النظام'}</button>
                        {status && <p className="text-red-400 text-center text-sm font-medium">{status}</p>}
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white pb-24 font-sans selection:bg-cyan-500/30" dir="rtl">
            <div className="max-w-4xl mx-auto p-4 md:p-6">
                {/* Header */}
                <header className="flex justify-between items-center mb-8 mt-4 px-2">
                    <div>
                        <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-l from-cyan-400 to-blue-500">CONTROL CENTER</h1>
                        <p className="text-[10px] text-gray-500 font-mono mt-1">OPERATIONAL ENVIROMENT v2.5</p>
                    </div>
                    {status && <div className="text-[10px] bg-cyan-500/10 text-cyan-400 px-3 py-1.5 rounded-full border border-cyan-500/20 animate-pulse">{status}</div>}
                </header>

                {/* Tabs Navigation */}
                <nav className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
                    {[
                        { id: 'notifications', icon: <Bell size={18} />, label: 'إشعارات' },
                        { id: 'visitors', icon: <Users size={18} />, label: 'الزوار' },
                        { id: 'media', icon: <ImageIcon size={18} />, label: 'الميديا' },
                        { id: 'game', icon: <Trophy size={18} />, label: 'اللعبة' },
                        { id: 'memory', icon: <Save size={18} />, label: 'الذاكرة' },
                        { id: 'settings', icon: <Lock size={18} />, label: 'الأمان' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); setStatus(''); }}
                            className={`flex items-center gap-2 px-5 py-3 rounded-2xl whitespace-nowrap transition-all duration-300 border ${activeTab === tab.id ? 'bg-cyan-600 text-white border-cyan-500 shadow-lg shadow-cyan-600/20' : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700'}`}
                        >
                            {tab.icon} <span className="text-sm font-bold">{tab.label}</span>
                        </button>
                    ))}
                </nav>

                {/* Main Content Card */}
                <main className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-[2.5rem] p-6 shadow-2xl min-h-[400px]">

                    {/* 1. Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-5 animate-in fade-in duration-500">
                            <h2 className="text-xl font-bold flex items-center gap-2"><Send className="text-cyan-400" size={20} /> بث إشعار Push</h2>
                            <div className="space-y-4">
                                <input type="text" value={notifTitle} onChange={(e) => setNotifTitle(e.target.value)} className="w-full p-4 bg-gray-900/50 rounded-2xl border border-gray-700 outline-none focus:border-cyan-500 transition-colors" placeholder="عنوان الإشعار" />
                                <textarea value={notifBody} onChange={(e) => setNotifBody(e.target.value)} className="w-full p-4 bg-gray-900/50 rounded-2xl border border-gray-700 outline-none focus:border-cyan-500 h-32 resize-none" placeholder="اكتب محتوى الرسالة هنا..." />
                                <button onClick={handleSendNotification} disabled={loading} className="w-full bg-cyan-600 p-4 rounded-2xl font-black text-lg hover:bg-cyan-500 transition-all flex items-center justify-center gap-3">
                                    <Send size={20} /> إرسال لجميع الأجهزة
                                </button>
                            </div>
                        </div>
                    )}

                    {/* 2. Visitors Tab (Fixed Grid View) */}
                    {activeTab === 'visitors' && (
                        <div className="animate-in fade-in duration-500">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-2"><Users className="text-cyan-400" /> مراقبة النشاط</h2>
                                <button onClick={fetchVisitorLogs} className="p-2 bg-gray-700 rounded-xl text-xs">تحديث</button>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                {visitorLogs.map(log => (
                                    <button
                                        key={log.id}
                                        onClick={() => setSelectedLog(log)}
                                        className="bg-gray-800/80 p-4 rounded-[1.8rem] border border-gray-700 hover:border-cyan-500/50 transition-all flex flex-col items-center justify-center text-center gap-2 h-32 relative group overflow-hidden"
                                    >
                                        <div className={`p-2 rounded-xl ${log.entry_type === 'SITE' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                            {log.entry_type === 'SITE' ? <Unlock size={20} /> : <ShieldAlert size={20} />}
                                        </div>
                                        <div className="w-full overflow-hidden">
                                            <p className="text-[11px] font-black text-slate-100 truncate">{log.location_data?.city || 'Unknown'}</p>
                                            <p className="text-[9px] text-gray-500 mt-1 font-mono uppercase tracking-tighter">
                                                {new Date(log.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                        <Info size={14} className="absolute top-3 right-3 text-gray-600 group-hover:text-cyan-400 transition-colors" />
                                    </button>
                                ))}
                            </div>
                            {visitorLogs.length === 0 && <p className="text-center text-gray-500 mt-10 italic">لا يوجد سجلات حالياً</p>}
                        </div>
                    )}

                    {/* 3. Media Tab */}
                    {activeTab === 'media' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold flex items-center gap-2"><Upload className="text-purple-400" /> رفع وسائط</h2>
                            <div className="border-2 border-dashed border-gray-700 rounded-3xl p-10 text-center hover:border-purple-500 transition-colors relative group">
                                <input type="file" accept="image/*,video/*" onChange={(e) => setMediaFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                <Upload size={40} className="mx-auto text-gray-600 group-hover:text-purple-400 transition-colors mb-4" />
                                <p className="text-sm text-gray-400">{mediaFile ? mediaFile.name : 'اسحب الملف هنا أو اضغط للاختيار'}</p>
                            </div>
                            <button onClick={handleUploadMedia} disabled={!mediaFile} className="w-full bg-purple-600 p-4 rounded-2xl font-bold disabled:opacity-30">بدء الرفع</button>
                        </div>
                    )}

                    {/* 4. Game Tab */}
                    {activeTab === 'game' && (
                        <div className="space-y-6 animate-in slide-in-from-left duration-500">
                            <h2 className="text-xl font-bold text-orange-400">هندسة الأسئلة</h2>
                            <div className="grid md:grid-cols-2 gap-4 bg-gray-900/40 p-5 rounded-3xl border border-gray-700">
                                <div className="space-y-3">
                                    <label className="text-[10px] text-gray-500 uppercase font-bold">نوع السؤال والهدف</label>
                                    <select value={qType} onChange={(e) => setQType(e.target.value)} className="w-full p-3 bg-gray-800 rounded-xl border border-gray-700 outline-none">
                                        <option value="photo">صورة 📸</option>
                                        <option value="date">تاريخ 📅</option>
                                    </select>
                                    <select value={qTargetPlayer} onChange={(e) => setQTargetPlayer(e.target.value)} className="w-full p-3 bg-gray-800 rounded-xl border border-gray-700 outline-none">
                                        <option value="both">الكل</option>
                                        <option value="jana">جنى 👸</option>
                                        <option value="ahmed">أحمد 🤵</option>
                                    </select>
                                    <input type="text" value={qLabel} onChange={(e) => setQLabel(e.target.value)} placeholder="نص السؤال" className="w-full p-3 bg-gray-800 rounded-xl border border-gray-700 outline-none" />
                                    {qType === 'photo' && (
                                        <div className="flex gap-2 overflow-x-auto py-2">
                                            {availableMedia.filter(m => m.type === 'image').map(m => (
                                                <img key={m.id} src={m.url} onClick={() => setQMediaUrl(m.url)} className={`w-12 h-12 rounded-lg object-cover cursor-pointer border-2 ${qMediaUrl === m.url ? 'border-orange-500' : 'border-transparent'}`} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] text-gray-500 uppercase font-bold">الاختيارات</label>
                                    {qOptions.map((opt, i) => (
                                        <input key={i} type="text" value={opt} onChange={(e) => { let n = [...qOptions]; n[i] = e.target.value; setQOptions(n); }} placeholder={`اختيار ${i + 1}`} className={`w-full p-3 bg-gray-800 rounded-xl border ${qCorrectIndex === i ? 'border-green-500' : 'border-gray-700'}`} />
                                    ))}
                                    <select value={qCorrectIndex} onChange={(e) => setQCorrectIndex(parseInt(e.target.value))} className="w-full p-3 bg-green-900/20 text-green-400 rounded-xl border border-green-900/30 font-bold">
                                        <option value={0}>الأول هو الصح</option>
                                        <option value={1}>الثاني هو الصح</option>
                                        <option value={2}>الثالث هو الصح</option>
                                        <option value={3}>الرابع هو الصح</option>
                                    </select>
                                </div>
                                <button onClick={handleAddQuestion} className="md:col-span-2 bg-orange-600 p-4 rounded-2xl font-black">حفظ السؤال في اللعبة</button>
                            </div>
                        </div>
                    )}

                    {/* 5. Memory Tab */}
                    {activeTab === 'memory' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-indigo-400">تلقين الذاكرة (AI)</h2>
                            <textarea value={newMemoryContent} onChange={(e) => setNewMemoryContent(e.target.value)} placeholder="أضف حقيقة أو ذكرى ليعرفها النظام..." className="w-full p-5 bg-gray-900/50 rounded-3xl border border-gray-700 h-32 focus:border-indigo-500 outline-none" />
                            <div className="flex gap-3">
                                <select value={newMemoryCategory} onChange={(e) => setNewMemoryCategory(e.target.value)} className="bg-gray-800 p-4 rounded-2xl border border-gray-700 text-sm outline-none">
                                    <option value="general">عام</option>
                                    <option value="likes">تفضيلات</option>
                                    <option value="dates">مواعيد</option>
                                </select>
                                <button onClick={handleAddMemory} className="flex-1 bg-indigo-600 p-4 rounded-2xl font-bold">تحديث الذاكرة 🧠</button>
                            </div>
                            <div className="space-y-3 mt-8">
                                {extraMemories.map(m => (
                                    <div key={m.id} className="bg-gray-900/30 p-4 rounded-2xl border border-gray-700 flex justify-between items-center group">
                                        <p className="text-sm text-gray-300">{m.content}</p>
                                        <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded uppercase">{m.category}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 6. Settings Tab */}
                    {activeTab === 'settings' && (
                        <div className="space-y-8 max-w-md mx-auto">
                            <div className="bg-gray-900/40 p-6 rounded-[2rem] border border-gray-700 shadow-xl">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-indigo-400"><Monitor size={20} /> حماية الموقع (الشقية)</h3>
                                <p className="text-xs text-gray-500 mb-6">هذا الكود هو الذي يمنع أي شخص من الدخول للموقع إلا به.</p>
                                <div className="space-y-4">
                                    <input type="password" value={oldSitePassword} onChange={(e) => setOldSitePassword(e.target.value)} placeholder="كلمة السر الحالية للموقع" className="w-full p-4 bg-gray-800 rounded-2xl border border-gray-700 outline-none focus:border-indigo-500" />
                                    <input type="text" value={sitePassword} onChange={(e) => setSitePassword(e.target.value)} placeholder="الكلمة الجديدة (أرقام فقط)" className="w-full p-4 bg-gray-800 rounded-2xl border border-gray-700 outline-none focus:border-indigo-500 text-center font-mono text-xl" />
                                    <button onClick={handleUpdateSitePassword} className="w-full bg-indigo-600 p-4 rounded-2xl font-black">تحديث قفل الموقع</button>
                                </div>
                            </div>
                        </div>
                    )}

                </main>
            </div>

            {/* Modal: تفاصيل الزائر (The Solution) */}
            {selectedLog && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-sm">
                    <div className="bg-gray-900 border-t sm:border border-gray-700 w-full max-w-lg rounded-t-[3rem] sm:rounded-[3rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">

                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-800/30">
                            <div>
                                <h3 className="font-black text-xl text-white flex items-center gap-2 tracking-tight">
                                    زيارة من {selectedLog.location_data?.city || 'غير معروف'}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-full font-mono uppercase">{selectedLog.ip_hint}</span>
                                    <span className="text-[10px] text-gray-500 font-mono italic">{new Date(selectedLog.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <button onClick={() => setSelectedLog(null)} className="p-3 bg-gray-800 hover:bg-gray-700 rounded-2xl text-gray-400 transition-all"><X size={24} /></button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto no-scrollbar">

                            {/* Grid Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-800/50 p-5 rounded-3xl border border-gray-700 group">
                                    <Globe className="text-cyan-400 mb-2 group-hover:scale-110 transition-transform" size={24} />
                                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Country</p>
                                    <p className="font-bold text-sm truncate">{selectedLog.location_data?.country_name || 'N/A'}</p>
                                </div>
                                <div className="bg-gray-800/50 p-5 rounded-3xl border border-gray-700 group">
                                    <Monitor className="text-purple-400 mb-2 group-hover:scale-110 transition-transform" size={24} />
                                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Platform</p>
                                    <p className="font-bold text-sm truncate">{selectedLog.device_info?.platform || 'N/A'}</p>
                                </div>
                            </div>

                            {/* User Agent Section */}
                            <div className="bg-gray-800/50 p-6 rounded-[2rem] border border-gray-700">
                                <div className="flex items-center gap-2 mb-4">
                                    <Info size={16} className="text-orange-400" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Technical Signature (User Agent)</span>
                                </div>
                                <p className="text-[11px] font-mono text-gray-400 leading-relaxed break-words bg-black/30 p-4 rounded-2xl border border-white/5 select-all">
                                    {selectedLog.user_agent}
                                </p>
                            </div>

                            {/* Footer: Precise Map Link */}
                            {selectedLog.latitude && (
                                <div className="pt-2">
                                    <a
                                        href={`https://www.google.com/maps?q=${selectedLog.latitude},${selectedLog.longitude}`}
                                        target="_blank" rel="noopener noreferrer"
                                        className="w-full bg-white text-black py-5 rounded-2xl font-black text-center transition-all flex items-center justify-center gap-3 hover:bg-cyan-400 hover:scale-[1.02] active:scale-95 shadow-xl shadow-white/5"
                                    >
                                        <MapPin size={22} /> تتبع الموقع الدقيق على الخريطة
                                    </a>
                                    <p className="text-center text-[9px] text-gray-600 mt-4 italic italic">بيانات الموقع قد تختلف بناءً على مزود الخدمة (ISP)</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}