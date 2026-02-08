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
                onClick={() => onClick(data)}
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
                <Html position={[0, -0.4, 0]} center>
                    <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 pointer-events-none">
                        <span className="text-white text-[10px] whitespace-nowrap font-bold">
                            {data.type === 'image' ? 'صورة ✨' : data.type === 'video' ? 'فيديو 🎥' : 'رسالة 💌'}
                        </span>
                    </div>
                </Html>
            )}
        </group>
    );
}

function MemoryContent({ data, onClose }) {
    // Texture hooks (must be top-level in component)
    const imageTexture = data?.type === 'image' ? useTexture(data.url) : null;
    const videoTexture = data?.type === 'video' ? useVideoTexture(data.url) : null;

    if (!data) return null;

    return (
        <Html center zIndexRange={[100, 200]}>
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                className="w-[85vw] max-w-md bg-gray-900/90 backdrop-blur-2xl rounded-3xl border border-white/10 p-6 flex flex-col items-center gap-4 relative overflow-hidden"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/50 hover:text-white"
                >
                    ✕
                </button>

                {data.type === 'image' && (
                    <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden border border-white/5">
                        <img src={data.url} className="w-full h-full object-cover" alt="Memory" />
                    </div>
                )}

                {data.type === 'video' && (
                    <div className="w-full aspect-video rounded-2xl overflow-hidden border border-white/5 bg-black">
                        <video src={data.url} autoPlay loop muted playsInline className="w-full h-full object-contain" />
                    </div>
                )}

                {data.type === 'message' && (
                    <div className="py-12 px-6 text-center italic text-xl text-yellow-100 font-serif leading-relaxed">
                        "{data.text}"
                    </div>
                )}

                <div className="text-white/80 font-bold text-center">
                    {data.label || (data.type === 'message' ? 'رسالة من القلب' : 'ذكرى غالية')}
                </div>
            </motion.div>
        </Html>
    );
}

export default function MemoryRoomPage() {
    const [memories, setMemories] = useState([]);
    const [selectedMemory, setSelectedMemory] = useState(null);
    const [showTutorial, setShowTutorial] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            // Fetch Media
            const { data: mediaData } = await supabase.from('media').select('*');
            // Fetch Messages
            const { data: messagesData } = await supabase.from('jana_messages').select('*').limit(20);

            const combined = [
                ...(mediaData || []).map(m => ({ ...m, type: m.type || 'image' })),
                ...(messagesData || []).map(m => ({ id: m.id, type: 'message', text: m.message, label: 'رسالة خاصة' }))
            ];

            // Add random positions
            const positioned = combined.map((item, i) => {
                const phi = Math.acos(-1 + (2 * i) / combined.length);
                const theta = Math.sqrt(combined.length * Math.PI) * phi;
                const radius = 10 + Math.random() * 5;

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

                    <AnimatePresence>
                        {selectedMemory && (
                            <MemoryContent
                                data={selectedMemory}
                                onClose={() => setSelectedMemory(null)}
                            />
                        )}
                    </AnimatePresence>
                </Suspense>

                <OrbitControls
                    enablePan={false}
                    minDistance={5}
                    maxDistance={40}
                    autoRotate={!selectedMemory}
                    autoRotateSpeed={0.5}
                />
            </Canvas>

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
