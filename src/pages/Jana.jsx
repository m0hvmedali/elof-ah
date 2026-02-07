// src/pages/JanaPage.jsx
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import Typed from 'typed.js';
import * as anime from 'animejs';
import RelationshipTimer from '../components/common/RelationshipTimer';

const JanaPage = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [animationStage, setAnimationStage] = useState(0);
  const nameRef = useRef(null);
  const canvasRef = useRef(null);
  const typedRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));
  const rendererRef = useRef(null);
  const lettersRef = useRef([]);

  // تهيئة الرسوم ثلاثية الأبعاد
  useEffect(() => {
    if (!canvasRef.current) return;

    rendererRef.current = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimize performance

    cameraRef.current.position.z = 8;

    // إضاءة
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    sceneRef.current.add(ambientLight);

    const pointLight = new THREE.PointLight(0xff00ff, 1);
    pointLight.position.set(5, 5, 5);
    sceneRef.current.add(pointLight);

    // إنشاء الحروف
    const createLetters = () => {
      const name = 'Jana Shaaban';
      const fontLoader = new FontLoader();

      fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
        // Clean up explicit old letters if any logic called this twice
        lettersRef.current.forEach((letter) => {
          sceneRef.current.remove(letter);
          if (letter.geometry) letter.geometry.dispose();
          if (letter.material) letter.material.dispose();
        });
        lettersRef.current = [];

        const material = new THREE.MeshStandardMaterial({
          color: 0xff69b4,
          metalness: 0.7,
          roughness: 0.2,
          emissive: 0xff00ff,
          emissiveIntensity: 0.3,
        });

        let offsetX = -name.length * 0.3;
        for (let i = 0; i < name.length; i++) {
          const char = name[i];
          if (char === ' ') {
            offsetX += 0.5;
            continue;
          }

          const geometry = new TextGeometry(char, {
            font: font,
            size: 0.6,
            height: 0.15,
            curveSegments: 12, // Reduced from default logic if needed, but 12 fits
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 5,
          });

          const mesh = new THREE.Mesh(geometry, material);
          mesh.position.x = offsetX;
          offsetX += 0.7;

          sceneRef.current.add(mesh);
          lettersRef.current.push(mesh);
        }
      });
    };

    createLetters();

    // دورة الرسوم المتحركة + دوران الكاميرا
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const t = Date.now() * 0.0005; // الوقت
      const radius = 10; // نصف قطر الدوران

      // دوران الكاميرا حوالين المركز
      cameraRef.current.position.x = Math.cos(t) * radius;
      cameraRef.current.position.z = Math.sin(t) * radius;
      cameraRef.current.lookAt(0, 0, 0);

      // حركة الحروف
      lettersRef.current.forEach((letter, i) => {
        letter.rotation.x += 0.005;
        letter.rotation.y += 0.01;
        letter.position.y = Math.sin(Date.now() * 0.001 + i) * 0.2;
      });

      if (rendererRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    // Resize handler
    const handleResize = () => {
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      if (rendererRef.current) {
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);

      // Full cleanup
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }

      // Dispose letters
      lettersRef.current.forEach(mesh => {
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) mesh.material.dispose();
        sceneRef.current.remove(mesh);
      });
    };
  }, []);


  // كتابة الاسم بطرق مختلفة
  useEffect(() => {
    const options = {
      strings: [
        'Jana Elsaid',
        'جنى السيد',
        'J A N A  E L S A I D',
        'J❤️na Els❤️id',
        'I ❤️ u',
        'Jana Elsaid',
      ],
      typeSpeed: 60,
      backSpeed: 30,
      loop: true,
      showCursor: false,
      onStringTyped: () => {
        if (animationStage === 0) {
          setAnimationStage(1);
          animateLetters();
        }
      },
    };

    typedRef.current = new Typed(nameRef.current, options);

    return () => {
      if (typedRef.current) typedRef.current.destroy();
    };
  }, [animationStage]);

  // تحريك الحروف
  const animateLetters = () => {
    anime({
      targets: '.letter',
      translateY: [50, 0],
      opacity: [0, 1],
      rotateZ: [anime.random(-30, 30), 0],
      scale: [0.5, 1],
      duration: 1500,
      delay: anime.stagger(100),
      easing: 'easeOutElastic',
      complete: () => {
        setAnimationStage(2);
      },
    });
  };

  // تهيئة جسيمات الخلفية
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  // عرض التفاصيل الإضافية
  const revealDetails = () => {
    setShowDetails(true);

    anime({
      targets: '.detail-item',
      opacity: [0, 1],
      translateY: [30, 0],
      delay: anime.stagger(100),
      duration: 1000,
      easing: 'easeOutExpo',
    });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
      {/* جسيمات الخلفية - Optimized count */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        className="absolute inset-0 z-0"
        options={{
          particles: {
            number: { value: 40, density: { enable: true, value_area: 800 } }, // Reduced from 100
            color: { value: '#ff69b4' },
            shape: { type: 'circle', stroke: { width: 0, color: '#000000' } },
            opacity: {
              value: 0.5,
              random: true,
              anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false },
            },
            size: {
              value: 3,
              random: true,
              anim: { enable: true, speed: 2, size_min: 0.3, sync: false },
            },
            line_linked: {
              enable: true,
              distance: 150,
              color: '#ff69b4',
              opacity: 0.4,
              width: 1,
            },
            move: {
              enable: true,
              speed: 1, // Slow movement is fine
              random: true,
              out_mode: 'out',
              bounce: false,
            },
          },
          interactivity: {
            detect_on: 'canvas',
            events: {
              onhover: { enable: true, mode: 'repulse' },
              onclick: { enable: true, mode: 'push' },
              resize: true,
            },
            modes: { repulse: { distance: 100, duration: 0.4 }, push: { particles_nb: 4 } },
          },
          retina_detect: true,
        }}
      />

      {/* التأثير ثلاثي الأبعاد */}
      <canvas ref={canvasRef} className="absolute inset-0 z-10 opacity-70" />

      {/* المحتوى الرئيسي */}
      <div className="flex relative z-20 flex-col justify-center items-center px-4 w-full h-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          className="max-w-4xl"
        >
          <div className="mb-8">
            <div className="inline-block relative">
              <span
                ref={nameRef}
                className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 md:text-9xl"
              />
            </div>
          </div>

          <RelationshipTimer />

        </motion.div>
      </div>
    </div>
  );
};

export default JanaPage;
