import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Text, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

// --- Media Assets ---
// Ensure this list is populated with your actual file paths
const MEDIA_ASSETS = [
  { type: 'image', src: '/WhatsApp Image 2026-02-07 at 5.33.18 PM.jpeg' },
  { type: 'image', src: '/WhatsApp Image 2026-02-07 at 5.35.23 PM.jpeg' },
  { type: 'image', src: '/WhatsApp Image 2026-02-07 at 5.35.31 PM.jpeg' },
  { type: 'image', src: '/WhatsApp Image 2026-02-07 at 5.35.32 PM.jpeg' },
  { type: 'image', src: '/WhatsApp Image 2026-02-07 at 5.37.0 PM.jpeg' },
  { type: 'image', src: '/WhatsApp Image 2026-02-07 at 5.37.08 PM.jpeg' },
  { type: 'image', src: '/WhatsApp Image 2026-02-07 at 5.37.09 PM.jpeg' },
  { type: 'image', src: '/WhatsApp Image 2026-02-07 at 5.40.31 PM.jpeg' },
  { type: 'video', src: '/WhatsApp Video 2026-02-07 at 5.43.46 PM.mp4' },
  { type: 'image', src: '/WhatsApp Image 2026-02-07 at 5.45.19 PM.jpeg' },
  { type: 'video', src: '/WhatsApp Video 2026-02-07 at 5.47.31 PM.mp4' },
  { type: 'image', src: '/WhatsApp Image 2026-02-07 at 5.54.21 PM.jpeg' },
  { type: 'image', src: '/WhatsApp Image 2026-02-07 at 5.58.41 PM.jpeg' },
  { type: 'image', src: '/WhatsApp Image 2026-02-07 at 5.58.42 PM.jpeg' },
  { type: 'image', src: '/WhatsApp Image 2026-02-07 at 5.59.14 PM.jpeg' },
  { type: 'image', src: '/WhatsApp Image 2026-02-07 at 6.00.18 PM.jpeg' },
  { type: 'image', src: '/WhatsApp Image 2026-02-07 at 6.23.03 PM.jpeg' },
  { type: 'video', src: '/WhatsApp Video 2026-02-07 at 6.25.14 PM.mp4' },
  { type: 'image', src: '/bb.jpeg' },
  { type: 'image', src: '/h.jpeg' },
  { type: 'image', src: '/k.jpeg' },
];

// Added VideoPlane component
function VideoPlane({ src, scale, onClick }) {
  const video = useMemo(() => {
    const vid = document.createElement('video');
    vid.src = src;
    vid.loop = true;
    vid.muted = true;
    vid.play();
    return vid;
  }, [src]);

  return (
    <mesh scale={scale} onClick={onClick}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial toneMapped={false}>
        <videoTexture attach="map" args={[video]} encoding={THREE.sRGBEncoding} />
      </meshBasicMaterial>
    </mesh>
  );
}

// Added DeepSeaContent component
function DeepSeaContent({ onSelectInfo, items }) {
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
      {items.map((item, index) => {
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


function WaterDroplet({ position, onClick }) {
  const meshRef = useRef();

  // Random slight rotation
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh
        ref={meshRef}
        position={position}
        onClick={(e) => { e.stopPropagation(); onClick(); }
        }
        onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'default'; }}
      >
        <sphereGeometry args={[0.6, 32, 32]} /> {/* Sphere size */}
        <meshPhysicalMaterial
          thickness={1.5}
          roughness={0}
          clearcoat={1}
          clearcoatRoughness={0}
          transmission={1} // Glass/Water effect
          ior={1.33} // Refraction index of water
          envMapIntensity={2}
          color="#cceeff"
        />
      </mesh >
    </Float >
  );
}

function FloatingDroplets({ count = 50, onDropletClick }) {
  const positions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < count; i++) {
      // Random spread
      // X: -10 to 10
      // Y: -10 to 10 (vertical spread)
      // Z: -5 to -20 (depth)
      pos.push([
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() * -10) - 2 // Start from z=-2 back to z=-12
      ]);
    }
    return pos;
  }, [count]);

  return (
    <group>
      {positions.map((pos, i) => (
        <WaterDroplet key={i} position={pos} onClick={onDropletClick} />
      ))}
    </group>
  );
}

export default function MemoryRoom() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [mediaItems, setMediaItems] = useState(MEDIA_ASSETS); // Added state for mediaItems

  // Fetch custom media from Supabase
  useEffect(() => {
    const fetchMedia = async () => {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && !error) {
        const newMedia = data.map(m => ({
          type: m.type,
          src: m.url
        }));
        const combined = [...MEDIA_ASSETS, ...newMedia];

        // Randomize order for better experience? Or keep sorted?
        // Let's keep it sorted or append. Appending is safer for now.
        setMediaItems(combined);
      }
    };
    fetchMedia();
  }, []);

  const handleDropletClick = () => {
    // Use the dynamic mediaItems
    const randomItem = mediaItems[Math.floor(Math.random() * mediaItems.length)];
    setSelectedItem(randomItem);
  };

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[#001e36] via-[#000a12] to-black z-0 pointer-events-none" />

      {/* Header */}
      <div className="absolute top-0 left-0 w-full p-6 z-10 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
        <h1 className="text-2xl font-bold text-cyan-200 tracking-widest drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">
          OCEAN OF MEMORIES
        </h1>
        <div className="text-cyan-400/60 text-sm">
          Click a droplet...
        </div>
      </div>

      <Canvas camera={{ position: [0, 0, 5], fov: 60 }} dpr={[1, 2]}>
        <fog attach="fog" args={['#000a12', 5, 20]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />
        <directionalLight position={[-5, 5, 5]} intensity={1} color="#ffffff" />

        {/* Environment for reflections on water droplets */}
        <Environment preset="night" />

        {/* Bubbles/Particles */}
        <Sparkles count={500} scale={20} size={2} speed={0.4} opacity={0.5} color="#88ccff" />

        <FloatingDroplets count={40} onDropletClick={handleDropletClick} />

        {/* Added ScrollControls and DeepSeaContent */}
        <ScrollControls pages={mediaItems.length * 0.5} damping={0.2}>
          <DeepSeaContent onSelectInfo={setSelectedItem} items={mediaItems} />
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 cursor-pointer backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden border border-cyan-500/30 shadow-[0_0_50px_rgba(0,255,255,0.2)] bg-black/50"
              onClick={(e) => e.stopPropagation()} // Prevent close on content click
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-50 text-white bg-black/50 rounded-full p-2 hover:bg-white/20 transition-colors"
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

              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-center text-white/80">
                A precious moment ❤️
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
