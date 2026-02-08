import React, { Suspense, useState, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sky, Stars, Cloud, Float, Text, Environment, ContactShadows, useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Move, Search, Info } from 'lucide-react';

const albumPhotos = [
    { url: '/WhatsApp Image 2026-02-07 at 5.33.18 PM.jpeg', label: 'لحظة حلوة' },
    { url: '/WhatsApp Image 2026-02-07 at 5.35.23 PM.jpeg', label: 'ضحكة من القلب' },
    { url: '/WhatsApp Image 2026-02-07 at 5.40.31 PM.jpeg', label: 'ذكرياتنا' },
    { url: '/WhatsApp Image 2026-02-07 at 6.00.18 PM.jpeg', label: 'يوم مميز' },
    { url: '/bb.jpeg', label: 'Cute Moment' },
    { url: '/h.jpeg', label: 'Beautiful Jana' },
    { url: '/k.jpeg', label: 'Memories' },
];

function MemoryFragment({ photo, position, ...props }) {
    const [hovered, setHovered] = useState(false);
    const texture = useTexture(photo.url);

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1} position={position}>
            <mesh
                {...props}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <planeGeometry args={[2, 2.5]} />
                <meshStandardMaterial
                    map={texture}
                    side={THREE.DoubleSide}
                    metalness={0.5}
                    roughness={0.2}
                    emissive={hovered ? "#ff69b4" : "#000000"}
                    emissiveIntensity={hovered ? 0.2 : 0}
                />
                {hovered && (
                    <Html position={[0, -1.5, 0]} center>
                        <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg pointer-events-none">
                            <span className="text-pink-600 font-bold whitespace-nowrap">{photo.label}</span>
                        </div>
                    </Html>
                )}
            </mesh>
        </Float>
    );
}

function Ocean() {
    const mesh = useRef();
    useFrame((state) => {
        mesh.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
    });

    return (
        <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
            <planeGeometry args={[100, 100, 100, 100]} />
            <shaderMaterial
                transparent
                uniforms={{
                    uTime: { value: 0 },
                    uColor: { value: new THREE.Color("#135da5") },
                    uHighlight: { value: new THREE.Color("#4ac3ff") }
                }}
                vertexShader={`
          uniform float uTime;
          varying vec2 vUv;
          varying float vElevation;
          void main() {
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);
            float elevation = sin(modelPosition.x * 0.5 + uTime) * 
                             sin(modelPosition.z * 0.5 + uTime) * 0.2;
            modelPosition.y += elevation;
            vec4 viewPosition = viewMatrix * modelPosition;
            vec4 projectionPosition = projectionMatrix * viewPosition;
            gl_Position = projectionPosition;
            vUv = uv;
            vElevation = elevation;
          }
        `}
                fragmentShader={`
          uniform vec3 uColor;
          uniform vec3 uHighlight;
          varying float vElevation;
          void main() {
            float mixedColor = (vElevation + 0.2) / 0.4;
            vec3 finalColor = mix(uColor, uHighlight, mixedColor);
            gl_FragColor = vec4(finalColor, 0.8);
          }
        `}
            />
        </mesh>
    );
}

export default function MemoryRoomPage() {
    const [showTutorial, setShowTutorial] = useState(true);

    return (
        <div className="w-full h-screen bg-[#050b1a] relative">
            <Canvas camera={{ position: [0, 2, 10], fov: 60 }}>
                <fog attach="fog" args={['#050b1a', 5, 45]} />
                <Sky sunPosition={[100, 10, 100]} />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />

                <Suspense fallback={null}>
                    <Ocean />
                    <Cloud position={[-10, 5, -15]} speed={0.2} opacity={0.5} />
                    <Cloud position={[10, 8, -10]} speed={0.1} opacity={0.3} />
                    <Cloud position={[0, 4, -20]} speed={0.15} opacity={0.4} />

                    {albumPhotos.map((photo, i) => (
                        <MemoryFragment
                            key={i}
                            photo={photo}
                            position={[
                                Math.sin(i * (Math.PI * 2 / albumPhotos.length)) * 8,
                                1 + Math.random() * 2,
                                Math.cos(i * (Math.PI * 2 / albumPhotos.length)) * 8
                            ]}
                            rotation={[0, -i * (Math.PI * 2 / albumPhotos.length), 0]}
                        />
                    ))}

                    <Text
                        position={[0, 5, -10]}
                        fontSize={2}
                        color="white"
                        anchorX="center"
                        anchorY="middle"
                    >
                        بحر الذكريات
                    </Text>
                </Suspense>

                <OrbitControls
                    enablePan={false}
                    maxPolarAngle={Math.PI / 2.1}
                    minDistance={5}
                    maxDistance={30}
                    autoRotate
                    autoRotateSpeed={0.5}
                />
            </Canvas>

            <AnimatePresence>
                {showTutorial && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-80 p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 text-center"
                    >
                        <div className="w-16 h-16 bg-blue-500/30 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-400">
                            <Move size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4">أهلاً بيكي في غرفتنا ❤️</h2>
                        <p className="text-white/70 mb-8 leading-relaxed">
                            استخدمي الماوس أو صوابعك عشان تتحركي في المكان وتشوف صورنا وهي عايمة في بحر ذكرياتنا.
                        </p>
                        <button
                            onClick={() => setShowTutorial(false)}
                            className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-bold transition-all shadow-lg"
                        >
                            ابدأ الاستكشاف
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="absolute top-6 left-6 z-10 flex gap-4">
                <a
                    href="/"
                    className="p-4 bg-white/10 backdrop-blur-md rounded-2xl text-white hover:bg-white/20 transition-all border border-white/20"
                >
                    <ArrowLeft size={24} />
                </a>
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 hidden md:flex items-center gap-6 bg-black/30 backdrop-blur-lg px-8 py-4 rounded-full border border-white/10">
                <div className="flex items-center gap-2 text-white/80">
                    <Search size={18} />
                    <span>لفي وشوفي الصور</span>
                </div>
                <div className="w-px h-6 bg-white/20" />
                <div className="flex items-center gap-2 text-white/80">
                    <Info size={18} />
                    <span>المسي الصور للتفاصيل</span>
                </div>
            </div>
        </div>
    );
}
