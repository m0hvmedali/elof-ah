import React, { Suspense, useRef, useState, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ScrollControls, Scroll, useScroll, Image, useVideoTexture, Text } from '@react-three/drei'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../components/Footer';

// --- Media Assets ---
const MEDIA_ASSETS = [
  { type: 'image', src: '/WhatsApp Image 2026-02-07 at 5.33.18 PM.jpeg' },
  { type: 'image', src: '/WhatsApp Image 2026-02-07 at 5.35.23 PM.jpeg' },
  { type: 'image', src: '/WhatsApp Image 2026-02-07 at 5.35.31 PM.jpeg' },
  { type: 'image', src: '/WhatsApp Image 2026-02-07 at 5.35.32 PM.jpeg' },
  { type: 'image', src: '/WhatsApp Image 2026-02-07 at 5.37.0 PM.jpeg' },
  { type: 'image', src: '/WhatsApp Image 2026-02-07 at 5.37.08 PM.jpeg' },
  { type: 'image', src: '/WhatsApp Image 2026-02-07 at 5.37.09 PM.jpeg' },
  { type: 'image', src: '/WhatsApp Image 2026-02-07 at 5.40.31 PM.jpeg' },
  { type: 'video', src: '/WhatsApp Video 2026-02-07 at 5.43.46 PM.mp4' }, // Video
  { type: 'image', src: '/WhatsApp Image 2026-02-07 at 5.45.19 PM.jpeg' },
  { type: 'video', src: '/WhatsApp Video 2026-02-07 at 5.47.31 PM.mp4' }, // Video
  { type: 'image', src: '/WhatsApp Image 2026-02-07 at 5.54.21 PM.jpeg' },
  { type: 'image', src: '/WhatsApp Image 2026-02-07 at 5.58.41 PM.jpeg' },
  { type: 'image', src: '/WhatsApp Image 2026-02-07 at 5.58.42 PM.jpeg' },
  { type: 'image', src: '/WhatsApp Image 2026-02-07 at 5.59.14 PM.jpeg' },
  { type: 'image', src: '/WhatsApp Image 2026-02-07 at 6.00.18 PM.jpeg' },
  { type: 'image', src: '/WhatsApp Image 2026-02-07 at 6.23.03 PM.jpeg' },
  { type: 'video', src: '/WhatsApp Video 2026-02-07 at 6.25.14 PM.mp4' }, // Video
  { type: 'image', src: '/bb.jpeg' },
  { type: 'image', src: '/h.jpeg' },
  { type: 'image', src: '/k.jpeg' },
];

function VideoPlane({ src, ...props }) {
  const texture = useVideoTexture(src, { start: true, muted: true, loop: true });
  return (
    <mesh {...props}>
      <planeGeometry args={[1.6, 0.9]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

function OceanParticles({ count = 100 }) {
  const points = useRef();

  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const distance = 10;
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * distance;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40; // Spread vertically
      positions[i * 3 + 2] = (Math.random() - 0.5) * distance;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (!points.current) return;
    // Float particles up slightly
    const positions = points.current.geometry.attributes.position.array;
    for (let i = 1; i < positions.length; i += 3) {
      positions[i] += 0.005;
      if (positions[i] > 10) positions[i] = -30; // Reset to bottom
    }
    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#88ccff" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

function DeepSeaContent({ onSelectInfo }) {
  const scroll = useScroll(); // Returns normalized scroll offset (0 to 1)
  const { width, height } = useThree((state) => state.viewport);

  // Calculate total height based on content
  // We want to spread items downwards
  // If we have N items, and space them by Y units
  const SPACING = 2.5;

  useFrame((state, delta) => {
    // You could add camera shake or subtle movement here
  });

  return (
    <group>
      {MEDIA_ASSETS.map((item, index) => {
        // Arrange in a zig-zag or spiral downwards
        const y = -index * SPACING;
        // const x = (index % 2 === 0 ? -1 : 1) * (width / 4);
        // Spiral:
        const angle = index * 0.8;
        const radius = 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius - 2; // Keep slightly in front? No, let's keep Z manageable

        // If using Scroll component from drei, the content is static relative to the scroll container
        // But we want parallax or simply standard scroll. 
        // ScrollControls pages={...} makes the canvas 'tall'.

        return (
          <group key={index} position={[x, -y - 3, 0]}> {/* Start a bit down. NOTE: Scroll moves CONTENT UP */}
            {item.type === 'video' ? (
              <VideoPlane
                src={item.src}
                scale={[2, 2, 1]}
                onClick={() => onSelectInfo(item)}
              />
            ) : (
              <Image
                url={item.src}
                scale={[2, 2, 1]} // Aspect ratio placeholder
                transparent
                opacity={0.9}
                onClick={() => onSelectInfo(item)}
              />
            )}
            <Text
              position={[0, -1.2, 0]}
              fontSize={0.2}
              color="white"
              anchorX="center"
              anchorY="top"
            >
              Memory #{index + 1}
            </Text>
          </group>
        )
      })}
    </group>
  )
}


export default function MemoryRoom() {
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#001e36] via-[#000a12] to-black z-0 pointer-events-none" />

      {/* Header */}
      <div className="absolute top-0 left-0 w-full p-6 z-10 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
        <h1 className="text-2xl font-bold text-cyan-200 tracking-widest drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">
          THE ABYSS
        </h1>
        <div className="text-cyan-400/60 text-sm">
          Dive Deeper ↓
        </div>
      </div>

      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <fog attach="fog" args={['#000a12', 4, 15]} />
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />

        <OceanParticles />

        {/* Calculate pages based on item count */}
        <ScrollControls pages={MEDIA_ASSETS.length * 0.5} damping={0.3}>
          <Scroll>
            {/* We manually map positions in DeepSeaContent. 
                             Wait, <Scroll> renders children on top of the DOM if using HTML, 
                             but here we want 3D scroll. 
                             Actually, <Scroll> creates a group that moves with scroll.
                         */}

            {/* Fix: <Scroll> without `html` prop renders 3D content that moves opposite to scroll */}
            {/* We want items to start at Y=0 and go DOWN. 
                             As we scroll DOWN (value increases), the <Scroll> group moves UP (+Y).
                             So items at -Y will come into view. 
                         */}
            <DeepSeaContent onSelectInfo={setSelectedItem} />
          </Scroll>
        </ScrollControls>
      </Canvas>

      {/* Overlay for viewing details */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)} // Close on background click
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl max-h-[90vh] rounded-lg overflow-hidden border border-cyan-500/30 shadow-[0_0_50px_rgba(0,255,255,0.1)]"
              onClick={(e) => e.stopPropagation()} // Prevent close on content click
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-50 text-white bg-black/50 rounded-full p-2 hover:bg-white/20"
              >
                ✕
              </button>

              {selectedItem.type === 'video' ? (
                <video
                  src={selectedItem.src}
                  controls
                  autoPlay
                  className="max-w-full max-h-[85vh] block"
                />
              ) : (
                <img
                  src={selectedItem.src}
                  alt="Memory"
                  className="max-w-full max-h-[85vh] object-contain block"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
