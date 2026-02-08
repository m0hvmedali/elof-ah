import React, { Suspense, useState, useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Text, useTexture, Html, useVideoTexture, Sparkles, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Move, Search, Info, Star } from 'lucide-react';
import { supabase } from '../supabaseClient';

function MemoryStar({ data, position, onClick }) {
    const [hovered, setHovered] = useState(false);
    const meshRef = useRef();

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.01;
            const time = state.clock.getElapsedTime();
            meshRef.current.position.y += Math.sin(time + position[0]) * 0.002;
        }
    });

    const getStarColor = () => {
        if (data.type === 'image') return "#ff69b4"; // Pink
        if (data.type === 'video') return "#4ac3ff"; // Blue
        return "#eab308"; // Yellow for messages
    };

    return (
        <group position={position}>
            <mesh
                ref={meshRef}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                onPointerDown={(e) => {
                    e.stopPropagation();
                    onClick(data);
                }}
            >
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial
                    color={getStarColor()}
                    emissive={getStarColor()}
                    emissiveIntensity={hovered ? 5 : 2}
                />
            </mesh>

            {/* Glow effect */}
            <mesh scale={[1.5, 1.5, 1.5]}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshBasicMaterial
                    color={getStarColor()}
                    transparent
                    opacity={hovered ? 0.3 : 0.1}
                />
            </mesh>

            {hovered && (
                <Html position={[0, -0.4, 0]} center transform={false}>
                    <div className="bg-black/80 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/20 pointer-events-none shadow-2xl scale-75 md:scale-100">
                        <span className="text-white text-xs whitespace-nowrap font-black tracking-wide">
                            {data.type === 'image' ? 'صورة ✨' : data.type === 'video' ? 'فيديو 🎥' : 'رسالة 💌'}
                        </span>
                    </div>
                </Html>
            )}
        </group>
    );
}

function MemoryContent({ data, onClose }) {
    if (!data) return null;
    const safeUrl = encodeURI(data.url);

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm pointer-events-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                className="w-full max-w-sm md:max-w-md bg-gray-900/95 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 p-5 flex flex-col items-center gap-4 relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]"
            >
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 z-20 w-10 h-10 flex items-center justify-center bg-black/50 text-white rounded-full hover:bg-black/80 transition-all border border-white/10 shadow-lg"
                >
                    ✕
                </button>

                <div className="w-full relative rounded-3xl overflow-hidden bg-black/40 border border-white/10">
                    {data.type === 'image' && (
                        <div className="w-full aspect-[4/5] flex items-center justify-center bg-black/20">
                            <img
                                src={safeUrl}
                                className="max-w-full max-h-full object-contain"
                                alt="Memory"
                            />
                        </div>
                    )}

                    {data.type === 'video' && (
                        <div className="w-full aspect-video flex items-center justify-center bg-black">
                            <video
                                src={safeUrl}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-contain"
                            />
                        </div>
                    )}

                    {data.type === 'message' && (
                        <div className="py-20 px-8 text-center italic text-2xl text-yellow-100 font-serif leading-relaxed">
                            "{data.text}"
                        </div>
                    )}
                </div>

                <div className="text-white font-black text-center text-lg px-4 drop-shadow-md">
                    {data.label || (data.type === 'message' ? 'رسالة من القلب' : 'ذكرى غالية')}
                </div>
            </motion.div>
        </div>
    );
}

const PUBLIC_ASSETS = [
    { id: 'pa1', url: '/WhatsApp Image 2026-02-07 at 5.33.18 PM.jpeg', type: 'image', label: 'ذكرى حلوة' },
    { id: 'pa2', url: '/WhatsApp Image 2026-02-07 at 5.35.23 PM.jpeg', type: 'image', label: 'ضحكة من القلب' },
    { id: 'pa3', url: '/WhatsApp Image 2026-02-07 at 5.35.31 PM.jpeg', type: 'image', label: 'لحظاتنا' },
    { id: 'pa4', url: '/WhatsApp Image 2026-02-07 at 5.35.32 PM.jpeg', type: 'image', label: 'أجمل يوم' },
    { id: 'pa5', url: '/WhatsApp Image 2026-02-07 at 5.37.0 PM.jpeg', type: 'image', label: 'سوا دايماً' },
    { id: 'pa6', url: '/WhatsApp Image 2026-02-07 at 5.37.08 PM.jpeg', type: 'image', label: 'Jana' },
    { id: 'pa7', url: '/WhatsApp Image 2026-02-07 at 5.37.09 PM.jpeg', type: 'image', label: 'Smile' },
    { id: 'pa8', url: '/WhatsApp Image 2026-02-07 at 5.40.31 PM.jpeg', type: 'image', label: 'المستقبل' },
    { id: 'pa9', url: '/WhatsApp Image 2026-02-07 at 5.45.19 PM.jpeg', type: 'image', label: 'خروجة رايقة' },
    { id: 'pa10', url: '/WhatsApp Image 2026-02-07 at 5.54.21 PM.jpeg', type: 'image', label: 'أحلى صدفة' },
    { id: 'pa11', url: '/WhatsApp Image 2026-02-07 at 5.58.41 PM.jpeg', type: 'image', label: 'كل يوم أحلى' },
    { id: 'pa12', url: '/WhatsApp Image 2026-02-07 at 5.58.42 PM.jpeg', type: 'image', label: 'هلال في السما' },
    { id: 'pa13', url: '/WhatsApp Image 2026-02-07 at 5.59.14 PM.jpeg', type: 'image', label: 'جمالك' },
    { id: 'pa14', url: '/WhatsApp Image 2026-02-07 at 6.00.18 PM.jpeg', type: 'image', label: 'العيون' },
    { id: 'pa15', url: '/WhatsApp Image 2026-02-07 at 6.23.03 PM.jpeg', type: 'image', label: 'في البحر' },
    { id: 'pa16', url: '/bb.jpeg', type: 'image', label: 'Cuteee' },
    { id: 'pa17', url: '/h.jpeg', type: 'image', label: 'Beautiful' },
    { id: 'pa18', url: '/k.jpeg', type: 'image', label: 'Princess' },
    { id: 'pa19', url: '/WhatsApp Video 2026-02-07 at 5.43.46 PM.mp4', type: 'video', label: 'فيديو للذكرى' },
    { id: 'pa20', url: '/WhatsApp Video 2026-02-07 at 5.47.31 PM.mp4', type: 'video', label: 'لحظة مجنونة' },
    { id: 'pa21', url: '/WhatsApp Video 2026-02-07 at 6.25.14 PM.mp4', type: 'video', label: 'فيديو مميز' },
];

export default function MemoryRoomPage() {
    const [memories, setMemories] = useState([]);
    const [selectedMemory, setSelectedMemory] = useState(null);
    const [showTutorial, setShowTutorial] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            // Fetch Media
            const { data: mediaData } = await supabase.from('media').select('*');
            // Fetch Messages
            const { data: messagesData } = await supabase.from('jana_messages').select('*').limit(30);

            const combined = [
                ...PUBLIC_ASSETS,
                ...(mediaData || []).map(m => ({ ...m, type: m.type || 'image' })),
                ...(messagesData || []).map(m => ({ id: m.id, type: 'message', text: m.message, label: 'رسالة خاصة' }))
            ];

            // Add random positions
            const positioned = combined.map((item, i) => {
                const phi = Math.acos(-1 + (2 * i) / combined.length);
                const theta = Math.sqrt(combined.length * Math.PI) * phi;
                const radius = 10 + Math.random() * 8; // Slightly larger sphere for more items

                return {
                    ...item,
                    position: [
                        radius * Math.cos(theta) * Math.sin(phi),
                        radius * Math.sin(theta) * Math.sin(phi),
                        radius * Math.cos(phi)
                    ]
                };
            });

            setMemories(positioned);
        };

        fetchData();
    }, []);

    return (
        <div className="w-full h-screen bg-[#02040a] relative overflow-hidden">
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 20]} />
                <color attach="background" args={['#010206']} />

                {/* Environment */}
                <Stars radius={100} depth={50} count={8000} factor={4} saturation={0} fade speed={1} />
                <Sparkles count={200} size={2} scale={20} speed={0.5} opacity={0.2} color="#4ac3ff" />
                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#4ac3ff" />

                <Suspense fallback={null}>
                    {memories.map((memory) => (
                        <MemoryStar
                            key={memory.id}
                            data={memory}
                            position={memory.position}
                            onClick={(d) => setSelectedMemory(d)}
                        />
                    ))}
                </Suspense>

                <OrbitControls
                    enablePan={false}
                    minDistance={5}
                    maxDistance={40}
                    autoRotate={!selectedMemory}
                    autoRotateSpeed={0.5}
                />
            </Canvas>

            <AnimatePresence>
                {selectedMemory && (
                    <MemoryContent
                        data={selectedMemory}
                        onClose={() => setSelectedMemory(null)}
                    />
                )}
            </AnimatePresence>

            {/* UI Overlay */}
            <div className="absolute top-6 left-6 z-10">
                <a
                    href="/"
                    className="p-3 bg-white/5 backdrop-blur-md rounded-2xl text-white hover:bg-white/10 transition-all border border-white/10 flex items-center gap-2"
                >
                    <ArrowLeft size={20} />
                    <span className="font-bold text-sm">رجوع</span>
                </a>
            </div>

            <AnimatePresence>
                {showTutorial && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        onClick={() => setShowTutorial(false)}
                        className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 w-[80%] max-w-sm p-6 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 text-center cursor-pointer"
                    >
                        <div className="text-white font-bold mb-2">سماء ذكرياتنا ✨</div>
                        <p className="text-white/60 text-sm">
                            كل نجمة هي ذكرى.. المسيهم عشان يظهروا بوضوح في قلب التعتيم.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="absolute top-6 right-6 z-10 flex gap-2">
                <div className="px-4 py-2 bg-pink-500/20 rounded-full border border-pink-500/30 text-pink-400 text-xs font-bold">
                    {memories.length} ذكرى
                </div>
            </div>
        </div>
    );
}
