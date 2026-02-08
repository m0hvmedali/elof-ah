import React, { Suspense, useState, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sky, Stars, Cloud, Float, Text, useTexture, Html, useVideoTexture } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Move, Search, Info } from 'lucide-react';

const assets = [
  // Images
  { url: '/WhatsApp Image 2026-02-07 at 5.33.18 PM.jpeg', type: 'image' },
  { url: '/WhatsApp Image 2026-02-07 at 5.35.23 PM.jpeg', type: 'image' },
  { url: '/WhatsApp Image 2026-02-07 at 5.35.31 PM.jpeg', type: 'image' },
  { url: '/WhatsApp Image 2026-02-07 at 5.35.32 PM.jpeg', type: 'image' },
  { url: '/WhatsApp Image 2026-02-07 at 5.37.0 PM.jpeg', type: 'image' },
  { url: '/WhatsApp Image 2026-02-07 at 5.37.08 PM.jpeg', type: 'image' },
  { url: '/WhatsApp Image 2026-02-07 at 5.37.09 PM.jpeg', type: 'image' },
  { url: '/WhatsApp Image 2026-02-07 at 5.40.31 PM.jpeg', type: 'image' },
  { url: '/WhatsApp Image 2026-02-07 at 5.45.19 PM.jpeg', type: 'image' },
  { url: '/WhatsApp Image 2026-02-07 at 5.54.21 PM.jpeg', type: 'image' },
  { url: '/WhatsApp Image 2026-02-07 at 5.58.41 PM.jpeg', type: 'image' },
  { url: '/WhatsApp Image 2026-02-07 at 5.58.42 PM.jpeg', type: 'image' },
  { url: '/WhatsApp Image 2026-02-07 at 5.59.14 PM.jpeg', type: 'image' },
  { url: '/WhatsApp Image 2026-02-07 at 6.00.18 PM.jpeg', type: 'image' },
  { url: '/WhatsApp Image 2026-02-07 at 6.23.03 PM.jpeg', type: 'image' },
  { url: '/bb.jpeg', type: 'image' },
  { url: '/h.jpeg', type: 'image' },
  { url: '/k.jpeg', type: 'image' },
  // Videos
  { url: '/WhatsApp Video 2026-02-07 at 5.43.46 PM.mp4', type: 'video' },
  { url: '/WhatsApp Video 2026-02-07 at 5.47.31 PM.mp4', type: 'video' },
  { url: '/WhatsApp Video 2026-02-07 at 6.25.14 PM.mp4', type: 'video' }
];

function MemoryFragment({ asset, position, rotation, ...props }) {
  const [hovered, setHovered] = useState(false);
  
  // Use textures conditionally
  const texture = asset.type === 'image' ? useTexture(asset.url) : null;
  const videoTexture = asset.type === 'video' ? useVideoTexture(asset.url) : null;

  return (
    <Float speed={1.5 + Math.random()} rotationIntensity={1} floatIntensity={1} position={position}>
      <mesh
        {...props}
        rotation={rotation}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <planeGeometry args={asset.type === 'image' ? [2, 2.5] : [3, 1.8]} />
        <meshStandardMaterial 
          map={asset.type === 'image' ? texture : videoTexture} 
          side={THREE.DoubleSide} 
          metalness={0.5} 
          roughness={0.2}
          emissive={hovered ? "#ff69b4" : "#000000"}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
        {hovered && (
          <Html position={[0, -1.8, 0]} center>
            <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg pointer-events-none border border-pink-400/30">
              <span className="text-pink-600 font-bold whitespace-nowrap">
                {asset.type === 'image' ? 'ذكرى مصورة ✨' : 'فيديو للذكرى 🎥'}
              </span>
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
    <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
      <planeGeometry args={[150, 150, 150, 150]} />
      <shaderMaterial
        transparent
        uniforms={{
          uTime: { value: 0 },
          uColor: { value: new THREE.Color("#0a192f") },
          uHighlight: { value: new THREE.Color("#1e3a8a") }
        }}
        vertexShader={`
          uniform float uTime;
          varying vec2 vUv;
          varying float vElevation;
          void main() {
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);
            float elevation = sin(modelPosition.x * 0.3 + uTime * 0.5) * 
                             sin(modelPosition.z * 0.3 + uTime * 0.5) * 0.4;
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
            float mixedColor = (vElevation + 0.4) / 0.8;
            vec3 finalColor = mix(uColor, uHighlight, mixedColor);
            gl_FragColor = vec4(finalColor, 0.9);
          }
        `}
      />
    </mesh>
  );
}

export default function MemoryRoomPage() {
  const [showTutorial, setShowTutorial] = useState(true);

  // Distribute assets in multiple rings and heights
  const fragmentPositions = useMemo(() => {
    return assets.map((asset, i) => {
      const ring = Math.floor(i / 8); // Inner, middle, outer rings
      const angle = (i % 8) * (Math.PI * 2 / 8) + (ring * 0.5);
      const radius = 6 + (ring * 6) + Math.random() * 2;
      const height = 1 + (ring * 2) + (Math.random() * 3);
      
      return {
        position: [
          Math.sin(angle) * radius,
          height,
          Math.cos(angle) * radius
        ],
        rotation: [0, -angle + Math.PI, 0]
      };
    });
  }, []);

  return (
    <div className="w-full h-screen bg-[#050b1a] relative">
      <Canvas camera={{ position: [0, 5, 15], fov: 60 }}>
        <fog attach="fog" args={['#050b1a', 5, 50]} />
        <Sky sunPosition={[100, 20, 100]} turbidity={0.1} rayleigh={0.5} />
        <Stars radius={100} depth={50} count={7000} factor={4} saturation={0} fade speed={1.5} />
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#4ac3ff" />
        <pointLight position={[-10, 5, -10]} intensity={1} color="#ff69b4" />
        
        <Suspense fallback={null}>
          <Ocean />
          <Cloud position={[-15, 10, -20]} speed={0.2} opacity={0.4} />
          <Cloud position={[15, 12, -15]} speed={0.1} opacity={0.3} />
          <Cloud position={[0, 8, -25]} speed={0.15} opacity={0.5} />

          {assets.map((asset, i) => (
            <MemoryFragment
              key={i}
              asset={asset}
              position={fragmentPositions[i].position}
              rotation={fragmentPositions[i].rotation}
            />
          ))}

          <Text
            position={[0, 8, -15]}
            fontSize={3}
            color="white"
            font="/fonts/arial.ttf" // Optional: placeholder for Arabic support
            anchorX="center"
            anchorY="middle"
          >
            بحر ذكرياتنا المليان ❤️
          </Text>
        </Suspense>

        <OrbitControls 
          enablePan={false}
          maxPolarAngle={Math.PI / 1.8} 
          minDistance={5}
          maxDistance={40}
          autoRotate
          autoRotateSpeed={0.3}
        />
      </Canvas>

      <AnimatePresence>
        {showTutorial && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-80 p-8 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 text-center shadow-2xl"
          >
            <div className="w-16 h-16 bg-pink-500/30 rounded-full flex items-center justify-center mx-auto mb-6 text-pink-400">
              <Star size={32} fill="currentColor" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">بحر الذكريات المليان ✨</h2>
            <p className="text-white/80 mb-8 leading-relaxed">
              دلوقتي تقدري تشوفي كل صورنا وفيديوهاتنا وهي عايمة في المكان. 
              <br/>
              <b>المسي أي ذكرى عشان تشوفيها بوضوح!</b>
            </p>
            <button
              onClick={() => setShowTutorial(false)}
              className="w-full py-4 bg-gradient-to-r from-pink-500 to-blue-600 text-white rounded-2xl font-bold transition-all shadow-lg hover:shadow-pink-500/50"
            >
              ابدأ الاستكشاف
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-6 left-6 z-10">
        <a 
          href="/"
          className="p-4 bg-white/10 backdrop-blur-md rounded-2xl text-white hover:bg-white/20 transition-all border border-white/20 flex items-center gap-2"
        >
          <ArrowLeft size={24} />
          <span className="font-bold">رجوع</span>
        </a>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex items-center gap-6 bg-black/40 backdrop-blur-xl px-10 py-5 rounded-full border border-pink-500/20 shadow-2xl">
        <div className="flex items-center gap-2 text-white/90">
          <Search size={20} className="text-pink-400" />
          <span className="font-medium">لفي شوفي كل الرسايل</span>
        </div>
        <div className="w-px h-8 bg-white/20" />
        <div className="flex items-center gap-2 text-white/90">
          <Info size={20} className="text-blue-400" />
          <span className="font-medium">الفيديوهات شغالة لايف!</span>
        </div>
      </div>
    </div>
  );
}
