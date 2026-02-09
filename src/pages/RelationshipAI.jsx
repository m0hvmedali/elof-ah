import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, ArrowLeft, Loader2, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RelationshipAI() {
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'أهلاً يا جنى وأحمد! أنا ذاكرة علاقتكم الذكية. أنا عارف كل تفاصيلكم، خناقاتكم، ضحككم، وكل اللحظات الحلوة اللي مريتوا بيها. تحبوا تسألوني عن إيه النهارده؟ ❤️✨' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [memory, setMemory] = useState(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        // Load the analyzed relationship memory
        fetch('/relationship_memory.json')
            .then(res => res.json())
            .then(data => setMemory(data))
            .catch(err => console.error("Failed to load memory:", err));
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setLoading(true);

        try {
            // Context injection from memory
            const context = memory ? `
                You are a relationship AI named "Ducky AI". You are the personal memory keeper for Jana and Ahmed.
                Based on their chat history analysis:
                - Total Messages: ${memory.interaction_stats.total_messages}
                - Jana personality: ${memory.personalities.jana.intensity > memory.personalities.ahmed.intensity ? 'More expressive' : 'Deeply caring'}.
                - Ahmed personality: Protective and deeply loves Jana.
                - Jana Likes: ${memory.likes.jana.map(l => l.text).join(', ')}
                - Ahmed Likes: ${memory.likes.ahmed.map(l => l.text).join(', ')}
                - Major milestones: ${memory.milestones.map(m => m.text).join(', ')}
                
                Guidelines:
                1. Always respond in warm, Egyptian Arabic slang (Ammiya).
                2. Be funny, supportive, and act like a close friend who knows everything about them.
                3. If they ask about themselves or their relationship, use the specific details from the context above.
                4. Keep answers relatively concise but deeply emotional or helpful.
            ` : "You are a friendly relationship AI.";

            // CALLING GEMINI API (Assuming proxy or VITE endpoint)
            // For now, simulating a very smart response based on memory keywords
            // In production, this should call a secure backend or use VITE_API_URL

            setTimeout(() => {
                let responseText = "أنا معاك وفاكر كل حاجة.. بس محتاجين نربط الـ API Key عشان أقدر أحلل بعمق أكتر! بس مبدئياً، أنا عارف إنكم بتحبوا بعض جداً والذكرى اللي في أكتوبر كانت مميزة أوي. ❤️";

                // Simple keyword-based smart logic for the "simulated" free version
                if (userMsg.includes('جنى') || userMsg.includes('بتحب')) {
                    const like = memory?.likes.jana[Math.floor(Math.random() * memory.likes.jana.length)]?.text;
                    responseText = `جنى ذوقها عالي وبتعشق ${like || 'التفاصيل الصغيرة'}.. إنت المفاجأة اللي هي بتستناها دايماً! 😉`;
                } else if (userMsg.includes('أحمد') || userMsg.includes('بيحب')) {
                    responseText = "أحمد بيحبك جداً يا جنى، ودايماً بيحاول يكون السند ليكي، حتى لو خناقاتكم ساعات بتبان صعبة بس هو مبيشوفش غيرك. ❤️";
                } else if (userMsg.includes('فاكر')) {
                    const m = memory?.milestones[Math.floor(Math.random() * memory.milestones.length)]?.text;
                    responseText = `طبعاً فاكر! فاكر مثلاً لما شوفتوا ${m || 'أول صورة ليكم'}؟ كانت لحظة متتنسيش..`;
                }

                setMessages(prev => [...prev, { role: 'assistant', text: responseText }]);
                setLoading(false);
            }, 1000);

        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { role: 'assistant', text: 'حصل مشكلة بسيطة في الشبكة، جرب تاني يا بطل! 🔧' }]);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex flex-col font-scheherazade overflow-hidden">
            {/* Header */}
            <div className="p-6 bg-slate-900/50 backdrop-blur-xl border-b border-slate-800 flex items-center gap-4 sticky top-0 z-50">
                <Link to="/" className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/20">
                    <Bot size={28} />
                </div>
                <div>
                    <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">Ducky AI Chat</h1>
                    <p className="text-xs text-slate-400 font-sans tracking-widest uppercase">Memory Keeper</p>
                </div>
            </div>

            {/* Chat Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-[radial-gradient(circle_at_50%_50%,_#1e293b_0%,_#0f172a_100%)]"
            >
                <div className="max-w-4xl mx-auto space-y-6">
                    {messages.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex ${msg.role === 'user' ? 'justify-start flex-row-reverse' : 'justify-start'} gap-4`}
                        >
                            <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${msg.role === 'user'
                                    ? 'bg-indigo-600'
                                    : 'bg-slate-800 border border-slate-700'
                                }`}>
                                {msg.role === 'user' ? <User size={20} /> : <Sparkles size={18} className="text-pink-400" />}
                            </div>
                            <div className={`max-w-[80%] p-5 rounded-3xl shadow-xl ${msg.role === 'user'
                                    ? 'bg-indigo-600 text-white rounded-tr-none'
                                    : 'bg-slate-800/80 backdrop-blur-md border border-slate-700/50 text-slate-100 rounded-tl-none'
                                }`}>
                                <p className="text-xl leading-relaxed">{msg.text}</p>
                            </div>
                        </motion.div>
                    ))}
                    {loading && (
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700">
                                <Loader2 size={18} className="animate-spin text-pink-400" />
                            </div>
                            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                                <div className="flex gap-2">
                                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" />
                                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Input Area */}
            <div className="p-6 bg-slate-900/80 backdrop-blur-2xl border-t border-slate-800">
                <div className="max-w-4xl mx-auto flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="اسألني عن أي حاجة في حكايتكم..."
                        className="flex-1 bg-slate-800 border-2 border-slate-700/50 rounded-2xl px-6 py-4 focus:outline-none focus:border-pink-500 transition-all text-xl"
                    />
                    <button
                        onClick={handleSend}
                        className="p-4 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all text-white"
                    >
                        <Send size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
}
