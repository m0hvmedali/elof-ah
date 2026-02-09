import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { Upload, Image as ImageIcon, Loader2, Plus, X, Maximize2, Wand2, Sparkles } from 'lucide-react';
import AIPromptGenerator from '../components/common/AIPromptGenerator';
export default function PhotozPage() {
    const [photos, setPhotos] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [uploading, setUploading] = React.useState(false);
    const [selectedPhoto, setSelectedPhoto] = React.useState(null);
    const [status, setStatus] = React.useState('');
    const [isGeneratorOpen, setIsGeneratorOpen] = React.useState(false);

    React.useEffect(() => {
        fetchPhotos();
    }, []);

    const fetchPhotos = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('media')
            .select('*')
            .eq('category', 'ai_photos')
            .order('created_at', { ascending: false });

        if (data) setPhotos(data);
        setLoading(false);
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setStatus('جاري الرفع والسحر... ✨');

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `ai-photos/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('media')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('media')
                .getPublicUrl(filePath);

            const { error: dbError } = await supabase
                .from('media')
                .insert([{
                    type: 'image',
                    url: publicUrl,
                    category: 'ai_photos'
                }]);

            if (dbError) throw dbError;

            setStatus('تمت الإضافة بنجاح! 📸');
            fetchPhotos();
        } catch (error) {
            console.error(error);
            setStatus('فشل الرفع: ' + error.message);
        }
        setUploading(false);
        setTimeout(() => setStatus(''), 3000);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white pb-32 pt-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-5xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
                            Photoz ✨
                        </h1>
                        <p className="text-gray-400 mt-2 text-lg">صورنا المتعدلة بالذكاء الاصطناعي.. خيال مش كدة؟ 😉</p>
                    </motion.div>

                    <div className="flex flex-wrap justify-center md:justify-end gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsGeneratorOpen(true)}
                            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold cursor-pointer shadow-lg shadow-purple-900/20 hover:shadow-purple-500/40 transition-all border border-purple-400/30 text-white"
                        >
                            <Wand2 size={24} />
                            <span>اقتراحات صور الـ AI</span>
                        </motion.button>

                        <motion.label
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl font-bold cursor-pointer shadow-lg shadow-cyan-900/20 hover:shadow-cyan-500/40 transition-all border border-cyan-400/30 text-white"
                        >
                            {uploading ? <Loader2 className="animate-spin" /> : <Plus size={24} />}
                            <span>{uploading ? 'جاري السحر...' : 'ارفعي صورة AI جديدة'}</span>
                            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
                        </motion.label>
                    </div>
                </div>

                {status && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 p-4 rounded-xl bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 text-center font-bold"
                    >
                        {status}
                    </motion.div>
                )}

                {/* Gallery Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 size={48} className="text-cyan-500 animate-spin mb-4" />
                        <p className="text-gray-500">جاري تحميل المعرض السحري...</p>
                    </div>
                ) : photos.length === 0 ? (
                    <div className="text-center py-20 bg-gray-800/30 rounded-[3rem] border border-dashed border-gray-700">
                        <ImageIcon size={64} className="mx-auto text-gray-700 mb-4" />
                        <p className="text-gray-500 text-xl">مفيش صور AI لسه.. ارفعي أول صورة! 🚀</p>
                    </div>
                ) : (
                    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                        {photos.map((photo, index) => (
                            <motion.div
                                key={photo.id}
                                layoutId={photo.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => setSelectedPhoto(photo)}
                                className="relative group cursor-pointer rounded-3xl overflow-hidden bg-gray-800 border border-white/5 hover:border-cyan-500/50 transition-all hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]"
                            >
                                <img
                                    src={photo.url}
                                    alt="AI Art"
                                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                    <div className="flex items-center gap-2 text-cyan-400">
                                        <Maximize2 size={20} />
                                        <span className="font-bold">تكبير</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedPhoto && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
                        onClick={() => setSelectedPhoto(null)}
                    >
                        <motion.button
                            className="absolute top-8 right-8 p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition"
                            onClick={() => setSelectedPhoto(null)}
                        >
                            <X size={32} />
                        </motion.button>

                        <motion.img
                            layoutId={selectedPhoto.id}
                            src={selectedPhoto.url}
                            className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <AIPromptGenerator
                isOpen={isGeneratorOpen}
                onClose={() => setIsGeneratorOpen(false)}
            />
        </div>
    );
}
