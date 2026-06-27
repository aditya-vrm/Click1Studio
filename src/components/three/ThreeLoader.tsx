"use client";

import { useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Float } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

function AnimatedMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = time * 0.4;
      meshRef.current.rotation.y = time * 0.3;
    }
    if (ringRef.current) {
      ringRef.current.rotation.y = -time * 0.2;
      ringRef.current.rotation.z = time * 0.1;
    }
  });

  return (
    <group>
      {/* Central glowing geometry representing lens/iris in 3D */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.6, 2]} />
        <meshStandardMaterial
          color="#ecc246"
          wireframe
          transparent
          opacity={0.35}
          emissive="#ecc246"
          emissiveIntensity={0.8}
        />
      </mesh>
      
      {/* Outer Orbit Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[2.5, 0.04, 16, 100]} />
        <meshStandardMaterial 
          color="#ecc246" 
          roughness={0.1}
          metalness={0.9}
          emissive="#ecc246"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
}

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.05;
    }
  });

  // Generate particles manually to avoid version conflicts
  const particleCount = 600;
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 15;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
  }

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ecc246"
        size={0.035}
        sizeAttenuation={true}
        transparent
        opacity={0.6}
      />
    </points>
  );
}

interface ThreeLoaderProps {
  onComplete: () => void;
}

export default function ThreeLoader({ onComplete }: ThreeLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setFadeOut(true);
            setTimeout(onComplete, 800); // Allow fadeout animation to complete
          }, 400);
          return 100;
        }
        // Randomly increment to make it feel natural
        const diff = Math.floor(Math.random() * 4) + 1;
        return Math.min(prev + diff, 100);
      });
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {!fadeOut && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0b0b0b] overflow-hidden"
        >
          {/* Background WebGL Scene */}
          <div className="absolute inset-0 z-0 opacity-80">
            <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
              <ambientLight intensity={0.4} />
              <pointLight position={[10, 10, 10]} intensity={1.5} color="#ecc246" />
              <directionalLight position={[-5, 5, -5]} intensity={0.5} />
              <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
                <AnimatedMesh />
              </Float>
              <ParticleField />
              <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
            </Canvas>
          </div>

          {/* Loader Overlay Content */}
          <div className="relative z-10 flex flex-col items-center select-none text-center">
            {/* Logo Monogram */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-[11px] tracking-[0.8em] text-[#ecc246] uppercase mb-4"
            >
              MEMORIES IN MOTION
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-4xl md:text-5xl lg:text-6xl text-primary font-bold tracking-tighter uppercase mb-16"
            >
              CLICK1<span className="text-[#ecc246] italic font-light">STUDIO</span>
            </motion.h1>

            {/* Numeric Progress display */}
            <div className="flex flex-col items-center justify-center">
              <motion.span
                key={progress}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="font-display text-8xl md:text-[10rem] font-extrabold text-white/5 tracking-tighter leading-none tabular-nums"
              >
                {progress.toString().padStart(3, "0")}
              </motion.span>
              
              {/* Luxury Progress Bar */}
              <div className="w-48 h-[2px] bg-white/10 mt-8 rounded-full overflow-hidden relative">
                <motion.div 
                  className="absolute left-0 top-0 h-full bg-[#ecc246] shadow-[0_0_10px_#ecc246]"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              
              <span className="font-body text-[10px] uppercase tracking-[0.4em] text-on-surface-variant/60 mt-4">
                ARCHIVING EPHEMERAL MOMENTS
              </span>
            </div>
          </div>

          {/* Luxury Corner Decors */}
          <div className="absolute top-12 left-12 border-t border-l border-white/10 w-6 h-6" />
          <div className="absolute top-12 right-12 border-t border-r border-white/10 w-6 h-6" />
          <div className="absolute bottom-12 left-12 border-b border-l border-white/10 w-6 h-6" />
          <div className="absolute bottom-12 right-12 border-b border-r border-white/10 w-6 h-6" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
