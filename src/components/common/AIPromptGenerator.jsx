import React, { useState } from 'react';
import { Sparkles, Copy, RefreshCw, X, Wand2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIPromptGenerator({ isOpen, onClose }) {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([
        "Jana as a disney princess with Ahmed as her prince in a magical garden",
        "A cute 3D render of Jana and Ahmed traveling around the world in a hot air balloon",
        "Watercolor portrait of Jana and Ahmed sitting by the beach at sunset"
    ]);

    const generateNewPrompt = async () => {
        setLoading(true);
        try {
            const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

            if (!API_KEY) {
                alert('Please add VITE_GEMINI_API_KEY to your environment variables!');
                setLoading(false);
                return;
            }

            const promptRequest = "Generate 3 highly creative and unique AI image generation prompts for a couple named Jana and Ahmed. The prompts should be in English, imaginative, and suitable for Midjourney or DALL-E. Vary the styles (e.g., Cyberpunk, Disney, 3D Render, etc.). Return ONLY the 3 prompts separated by newlines.";

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: promptRequest }]
                    }]
                })
            });

            const data = await response.json();
            const aiSuggestions = data.candidates?.[0]?.content?.parts?.[0]?.text?.split('\n').filter(s => s.trim().length > 10) || [];

            if (aiSuggestions.length > 0) {
                setSuggestions(aiSuggestions);
                setPrompt(aiSuggestions[0]);
            } else {
                throw new Error("Invalid AI response");
            }
        } catch (error) {
            console.error("AI Generation Error:", error);
            alert("خطأ في الاتصال بالذكاء الاصطناعي.. جرب تاني كمان شوية!");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Prompt copied! You can use it in your AI image generator.');
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800"
                >
                    <div className="p-8">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl text-white shadow-lg">
                                    <Wand2 size={24} />
                                </div>
                                <h2 className="text-2xl font-black text-gray-800 dark:text-white">AI Photo Ideas</h2>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                                <X size={24} className="text-gray-400" />
                            </button>
                        </div>

                        <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">
                            اختار فكرة أو خلي الذكاء الاصطناعي يقترح عليك أشكال جديدة ليكم سوا! ✨
                        </p>

                        <div className="space-y-4 mb-8">
                            {suggestions.map((s, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ x: 5 }}
                                    className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 group flex justify-between items-center gap-4"
                                >
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 line-clamp-2">{s}</p>
                                    <button
                                        onClick={() => copyToClipboard(s)}
                                        className="p-2 bg-white dark:bg-gray-700 rounded-xl shadow-sm hover:text-pink-500 transition-colors"
                                    >
                                        <Copy size={18} />
                                    </button>
                                </motion.div>
                            ))}
                        </div>

                        <button
                            onClick={generateNewPrompt}
                            disabled={loading}
                            className="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-black text-xl shadow-xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
                            يقترح فكرة جديدة
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
