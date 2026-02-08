import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Send, Trash2, Edit2, Check, X } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useTheme } from '../context/ThemeContext';

export default function MessagesPage() {
    const { currentTheme } = useTheme();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const { data, error } = await supabase
                .from('jana_messages')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setMessages(data || []);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        setLoading(true);
        try {
            const { error } = await supabase
                .from('jana_messages')
                .insert([{ message: newMessage.trim(), author: 'جنى' }]);

            if (error) throw error;

            setNewMessage('');
            await fetchMessages();
        } catch (error) {
            console.error('Error sending message:', error);
            alert('فشل إرسال الرسالة. حاول مرة أخرى.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteMessage = async (id) => {
        if (!confirm('هل تريد حذف هذه الرسالة؟')) return;

        try {
            const { error } = await supabase
                .from('jana_messages')
                .delete()
                .eq('id', id);

            if (error) throw error;
            await fetchMessages();
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    const handleEditMessage = async (id) => {
        if (!editText.trim()) return;

        try {
            const { error } = await supabase
                .from('jana_messages')
                .update({ message: editText.trim() })
                .eq('id', id);

            if (error) throw error;

            setEditingId(null);
            setEditText('');
            await fetchMessages();
        } catch (error) {
            console.error('Error editing message:', error);
        }
    };

    const startEdit = (message) => {
        setEditingId(message.id);
        setEditText(message.message);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditText('');
    };

    return (
        <div
            className="min-h-screen relative overflow-hidden pb-24"
            style={{
                background: `linear-gradient(135deg, #ff69b440, #9333ea40, #ec489940)`
            }}
        >
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.2, 0.5, 0.2],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    >
                        <Heart size={20 + Math.random() * 30} className="text-pink-500" fill="rgba(236, 72, 153, 0.3)" />
                    </motion.div>
                ))}
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 via-purple-600 to-violet-600">
                        Jana's Messages ❤️
                    </h1>
                    <p className="text-xl text-gray-700 dark:text-gray-300 font-semibold">
                        رسائل من جنى لأحمد 💕
                    </p>
                </motion.div>

                {/* Message Input */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-8 p-6 rounded-3xl backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 shadow-2xl border-2 border-pink-300/50"
                >
                    <div className="flex flex-col gap-4">
                        <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && e.ctrlKey) {
                                    handleSendMessage();
                                }
                            }}
                            placeholder="اكتبي رسالة لأحمد... 💕"
                            className="w-full p-4 rounded-2xl bg-white dark:bg-gray-700 border-2 border-pink-400 focus:border-purple-500 focus:outline-none resize-none min-h-[120px] text-lg text-gray-800 dark:text-gray-200"
                        />
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">اضغطي Ctrl+Enter للإرسال</p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleSendMessage}
                                disabled={loading || !newMessage.trim()}
                                className="flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-pink-500 to-purple-600"
                            >
                                <Send size={20} />
                                {loading ? 'جاري الإرسال...' : 'إرسال'}
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Messages List */}
                <div className="space-y-4">
                    <AnimatePresence>
                        {messages.map((msg, index) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 50 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-6 rounded-3xl backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 shadow-xl border-2 border-pink-200/50 hover:shadow-2xl transition-shadow"
                            >
                                {editingId === msg.id ? (
                                    <div className="space-y-4">
                                        <textarea
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            className="w-full p-4 rounded-2xl bg-white dark:bg-gray-700 border-2 border-pink-400 focus:outline-none resize-none min-h-[100px] text-gray-800 dark:text-gray-200"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEditMessage(msg.id)}
                                                className="flex items-center gap-2 px-4 py-2 rounded-full text-white bg-gradient-to-r from-pink-500 to-purple-600"
                                            >
                                                <Check size={16} />
                                                حفظ
                                            </button>
                                            <button
                                                onClick={cancelEdit}
                                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-500 text-white"
                                            >
                                                <X size={16} />
                                                إلغاء
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-gradient-to-r from-pink-400 to-purple-500">
                                                    💕
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg text-pink-600 dark:text-pink-400">
                                                        {msg.author || 'جنى'}
                                                    </h3>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                                        {new Date(msg.created_at).toLocaleString('ar-EG', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => startEdit(msg)}
                                                    className="p-2 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30 transition"
                                                >
                                                    <Edit2 size={16} className="text-purple-600" />
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleDeleteMessage(msg.id)}
                                                    className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition"
                                                >
                                                    <Trash2 size={16} className="text-red-500" />
                                                </motion.button>
                                            </div>
                                        </div>
                                        <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap font-medium">
                                            {msg.message}
                                        </p>
                                    </>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {messages.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                        >
                            <div className="text-6xl mb-4">💕</div>
                            <p className="text-xl text-gray-600 dark:text-gray-400 font-semibold">لا توجد رسائل بعد</p>
                            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">ابدأي بكتابة أول رسالة!</p>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
