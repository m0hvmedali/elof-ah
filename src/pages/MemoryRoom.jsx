import React, { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, useTexture, Sky, Environment } from '@react-three/drei'
import * as THREE from 'three'

const IMAGES = [
  { id: 'p1', src: '/WhatsApp Image 2026-02-07 at 5.33.18 PM.jpeg', story: ' الصورة 1' },
  { id: 'p2', src: '/bb.jpeg', story: ' الصورة 2' },
  { id: 'p3', src: 'h.jpeg', story: ' الصورة 3' },
  { id: 'p4', src: '/k.jpeg', story: ' الصورة 4' },
  { id: 'p5', src: '/WhatsApp Image 2026-02-07 at 5.37.09 PM.jpeg', story: ' الصورة 5' },
  { id: 'p6', src: '/WhatsApp Image 2026-02-07 at 5.40.31 PM.jpeg', story: ' الصورة 6' },
  { id: 'p7', src: '/WhatsApp Image 2026-02-07 at 5.54.21 PM.jpeg', story: ' الصورة 7' },
  { id: 'p8', src: '/WhatsApp Image 2026-02-07 at 5.54.22 PM.jpeg', story: ' الصورة 8' },
  { id: 'p9', src: '/WhatsApp Image 2026-02-07 at 5.58.42 PM.jpeg', story: ' الصورة 9' },
  { id: 'p10', src: '/WhatsApp Image 2026-02-07 at 5.59.14 PM.jpeg', story: ' الصورة 10' },
  { id: 'p11', src: '/WhatsApp Image 2026-02-07 at 6.00.18 PM.jpeg', story: ' الصورة 11' },
  { id: 'p12', src: '/WhatsApp Image 2026-02-07 at 6.23.03 PM.jpeg', story: ' الصورة 12' }
]

function ParticleImages({ images, onSelect }) {
  const group = useRef()
  const textures = useTexture(images.map(img => img.src))
  const bubbleRefs = useRef([])

  // إنشاء فقاعات
  useEffect(() => {
    const bubbles = []
    const bubbleGeometry = new THREE.SphereGeometry(0.1, 16, 16)
    const bubbleMaterial = new THREE.MeshBasicMaterial({
      color: 0x4da6ff,
      transparent: true,
      opacity: 0.6
    })

    for (let i = 0; i < 50; i++) {
      const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial)
      bubble.position.set(
        (Math.random() - 0.5) * 20,
        Math.random() * -10,
        (Math.random() - 0.5) * 20
      )
      bubble.scale.setScalar(0.3 + Math.random() * 0.3)
      group.current.add(bubble)
      bubbles.push(bubble)
    }

    bubbleRefs.current = bubbles

    return () => {
      // تنظيف الفقاعات بشكل آمن
      if (group.current) {
        bubbles.forEach(bubble => {
          if (bubble && group.current.children.includes(bubble)) {
            group.current.remove(bubble)
          }
        })
      }
    }
  }, [])

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()

    // حركة الصور
    if (group.current) {
      group.current.children.forEach((mesh, i) => {
        if (mesh.userData?.isBubble) return

        mesh.position.y = Math.sin(time * 0.5 + i * 0.3) * 0.2
        mesh.rotation.z = Math.sin(time * 0.3 + i) * 0.1
        mesh.rotation.x = Math.cos(time * 0.4 + i) * 0.05
      })
    }

    // حركة الفقاعات
    bubbleRefs.current.forEach((bubble, i) => {
      if (bubble) {
        bubble.position.y += 0.01
        bubble.position.x += Math.sin(time * 0.5 + i) * 0.01

        // إعادة تدوير الفقاعات
        if (bubble.position.y > 5) {
          bubble.position.y = -10
          bubble.position.x = (Math.random() - 0.5) * 10
          bubble.position.z = (Math.random() - 0.5) * 10
        }
      }
    })
  })

  return (
    <group ref={group}>
      {textures.map((tex, idx) => (
        <mesh
          key={idx}
          position={[
            (Math.random() - 0.5) * 8,
            Math.random() * 3 - 1,
            (Math.random() - 0.5) * 8
          ]}
          onClick={() => onSelect(images[idx])}
        >
          <planeGeometry args={[1.5, 1]} />
          <meshStandardMaterial
            map={tex}
            toneMapped
            transparent
            roughness={0.1}
            metalness={0.2}
            side={THREE.DoubleSide}
          />
          {/* إطار للصورة */}
          <mesh position={[0, 0, -0.01]}>
            <boxGeometry args={[1.55, 1.05, 0.05]} />
            <meshStandardMaterial
              color="#0077be"
              roughness={0.2}
              metalness={0.7}
            />
          </mesh>
        </mesh>
      ))}
    </group>
  )
}

function UnderwaterEnvironment() {
  const seaFloorRef = useRef()

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()

    // حركة الأعشاب البحرية
    if (seaFloorRef.current) {
      seaFloorRef.current.children.forEach((grass, i) => {
        if (grass) {
          grass.rotation.z = Math.sin(time * 0.5 + i) * 0.3
        }
      })
    }
  })

  return (
    <>
      {/* سماء زرقاء */}
      <Sky distance={1000} sunPosition={[0, 1, 0]} inclination={0} azimuth={0.25} />

      {/* ضباب تحت الماء */}
      <color attach="background" args={["#006994"]} />
      <fog attach="fog" args={["#006994", 5, 20]} />

      {/* قاع البحر */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -10, 0]}>
        <planeGeometry args={[100, 100, 50, 50]} />
        <meshStandardMaterial
          color="#0a5a4e"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* أعشاب بحرية */}
      <group ref={seaFloorRef}>
        {Array.from({ length: 100 }).map((_, i) => (
          <mesh
            key={i}
            position={[
              (Math.random() - 0.5) * 90,
              -9.9,
              (Math.random() - 0.5) * 90
            ]}
            rotation={[0, Math.random() * Math.PI, 0]}
          >
            <coneGeometry args={[0.1, 1 + Math.random() * 2, 5]} />
            <meshStandardMaterial
              color={`hsl(${120 + Math.random() * 30}, 80%, 40%)`}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>

      {/* ضوء تحت الماء */}
      <directionalLight
        position={[10, 5, 10]}
        intensity={0.5}
        color="#4da6ff"
      />
      <pointLight
        position={[0, 5, 0]}
        intensity={1}
        color="#00bfff"
        distance={20}
        decay={2}
      />
    </>
  )
}

function CameraRig({ target }) {
  const { camera } = useThree()

  useFrame(() => {
    if (camera) {
      camera.position.x += (target.current.x - camera.position.x) * 0.05
      camera.position.y += (target.current.y - camera.position.y) * 0.05
      camera.position.z += (target.current.z - camera.position.z) * 0.05
      camera.lookAt(0, 0, 0)
    }
  })

  return null
}

export default function UnderwaterMemoryRoom() {
  const [activeImage, setActiveImage] = useState(null)
  const cameraTarget = useRef({ x: 0, y: 0, z: 10 })
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [isMuted, setIsMuted] = useState(true)

  const openImage = (img) => {
    setActiveImage(img)
    cameraTarget.current = { x: 0, y: 0, z: 2 }
  }

  const closeOverlay = () => {
    setActiveImage(null)
    cameraTarget.current = { x: 0, y: 0, z: 10 }
  }

  const toggleSound = () => {
    setIsMuted(!isMuted)
    setSoundEnabled(true)
  }

  return (
    <div className="overflow-hidden relative w-full h-screen bg-gradient-to-b from-blue-900 to-black">
      {/* خلفية تحت الماء */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-blue-900 to-black"></div>

      {/* تأثيرات فقاعات CSS */}
      <div className="overflow-hidden absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute bg-blue-400 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${5 + Math.random() * 20}px`,
              height: `${5 + Math.random() * 20}px`,
              animation: `float ${10 + Math.random() * 20}s infinite linear`,
              animationDelay: `${Math.random() * 5}s`
            }}
          ></div>
        ))}
      </div>

      {/* عنوان الصفحة */}
      <div className="absolute top-4 left-4 z-10 text-xl font-bold text-white">
        Gallery Room
      </div>

      {/* زر التحكم بالصوت */}
      <button
        onClick={toggleSound}
        className="absolute top-4 right-4 z-10 p-2 text-white rounded-full bg-blue-800/50"
      >
        {isMuted ? '🔇' : '🔊'}
      </button>

      {/* مؤثرات الصوت */}
      {soundEnabled && !isMuted && (
        <audio autoPlay loop>
          <source src="/water-bubbles-257594.mp3" type="audio/mpeg" />
        </audio>
      )}

      {/* المشهد ثلاثي الأبعاد */}
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }} className="h-full">
        <ambientLight intensity={0.2} />
        <directionalLight position={[0, 10, 0]} intensity={0.5} color="#4da6ff" />
        <pointLight position={[0, 5, 0]} intensity={1} color="#00bfff" distance={20} decay={2} />

        <Suspense fallback={null}>
          <UnderwaterEnvironment />
          <ParticleImages images={IMAGES} onSelect={openImage} />
          <CameraRig target={cameraTarget} />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={20}
          />
        </Suspense>
      </Canvas>

      {activeImage && (
        <div className="flex fixed inset-0 z-50 justify-center items-center p-2">
          <div className="absolute inset-0 bg-black/60" onClick={closeOverlay} />
          <div className="overflow-hidden relative w-full max-w-md bg-blue-900 rounded-xl border-2 border-blue-400 shadow-2xl">
            <button onClick={closeOverlay} className="absolute top-2 right-2 z-50 p-2 text-white rounded-full bg-blue-800/80">✕</button>
            <div className="relative">
              <img src={activeImage.src} alt="" className="object-cover w-full max-h-[70vh]" />
              <div className="absolute right-0 bottom-0 left-0 p-4 bg-gradient-to-t to-transparent from-blue-900/90">
              </div>
            </div>
            <div className="p-4 text-white bg-blue-800">
            </div>
          </div>
        </div>
      )}

      {/* توجيهات المستخدم */}
      <div className="absolute right-0 left-0 bottom-4 z-10 text-sm text-center text-white/70">
        اضغط على اي شاشه منهم لرؤيه التفاصيل | استخدم الماوس او اصبعك للتحكمفي البيئه من كل الجهات       </div>

      {/* أنماط CSS للفقاعات */}
      <style>{`
        @keyframes float {
          0% {
            transform: translateY(100vh) translateX(0);
          }
          100% {
            transform: translateY(-100px) translateX(20px);
          }
        }
      `}</style>
    </div>
  )
}