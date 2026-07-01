"use client";

import { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Camera, Film, ChevronRight } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  order: number;
}

// 3D Scroll Reactive Vintage Cinema Camera Group
function ScrollAnimatedLens() {
  const groupRef = useRef<THREE.Group>(null);
  const reel1Ref = useRef<THREE.Group>(null);
  const reel2Ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    const scrollY = typeof window !== "undefined" ? window.scrollY : 0;
    const time = state.clock.getElapsedTime();

    if (groupRef.current) {
      // Gentle floating/rotating based on time + scroll depth
      groupRef.current.rotation.y = time * 0.12 + scrollY * 0.0012;
      groupRef.current.rotation.x = Math.sin(time * 0.15) * 0.08 + scrollY * 0.0006;

      // Parallax vertical movement on scroll
      groupRef.current.position.y = Math.cos(time * 0.4) * 0.12 - scrollY * 0.001;
    }

    // Spin the two film reels continuously!
    if (reel1Ref.current) {
      reel1Ref.current.rotation.z = time * 0.8;
    }
    if (reel2Ref.current) {
      reel2Ref.current.rotation.z = time * 0.8;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 3D Main Camera Body Box */}
      <mesh position={[0, -0.4, 0]}>
        <boxGeometry args={[1.7, 1.2, 0.8]} />
        <meshPhysicalMaterial
          color="#151719"
          roughness={0.15}
          metalness={0.8}
          clearcoat={1.0}
          transmission={0.35} // semi-transparent gold-edged chamber!
          thickness={0.5}
        />
      </mesh>

      {/* Protruding Lens Barrel Cylinder */}
      <mesh position={[0, -0.4, 0.65]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.45, 0.5, 24]} />
        <meshStandardMaterial
          color="#ecc246"
          roughness={0.1}
          metalness={0.95}
          emissive="#ecc246"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Lens front glowing ring */}
      <mesh position={[0, -0.4, 0.9]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.32, 0.03, 12, 32]} />
        <meshStandardMaterial
          color="#ecc246"
          roughness={0.05}
          metalness={0.95}
          emissive="#ecc246"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Lens Glass (sphere inside barrel) */}
      <mesh position={[0, -0.4, 0.9]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshPhysicalMaterial
          color="#ecc246"
          roughness={0.01}
          transmission={0.95}
          thickness={0.4}
          emissive="#ecc246"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* FILM REEL 1 (Top Left) */}
      <group ref={reel1Ref} position={[-0.45, 0.75, 0]}>
        {/* Outer hoop */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.55, 0.04, 12, 32]} />
          <meshStandardMaterial
            color="#ecc246"
            roughness={0.15}
            metalness={0.9}
            emissive="#ecc246"
            emissiveIntensity={0.15}
          />
        </mesh>
        {/* Inner Hub */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.08, 16]} />
          <meshStandardMaterial color="#ecc246" roughness={0.1} metalness={0.95} />
        </mesh>
        {/* Spokes */}
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} rotation={[0, 0, (i * Math.PI) / 4]}>
            <boxGeometry args={[1.0, 0.03, 0.06]} />
            <meshStandardMaterial color="#ecc246" roughness={0.1} metalness={0.9} />
          </mesh>
        ))}
      </group>

      {/* FILM REEL 2 (Top Right) */}
      <group ref={reel2Ref} position={[0.45, 0.75, 0]}>
        {/* Outer hoop */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.55, 0.04, 12, 32]} />
          <meshStandardMaterial
            color="#ecc246"
            roughness={0.15}
            metalness={0.95}
            emissive="#ecc246"
            emissiveIntensity={0.15}
          />
        </mesh>
        {/* Inner Hub */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.08, 16]} />
          <meshStandardMaterial color="#ecc246" roughness={0.1} metalness={0.95} />
        </mesh>
        {/* Spokes */}
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} rotation={[0, 0, (i * Math.PI) / 4]}>
            <boxGeometry args={[1.0, 0.03, 0.06]} />
            <meshStandardMaterial color="#ecc246" roughness={0.1} metalness={0.9} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// Particle field reacting to scroll
function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    const scrollY = typeof window !== "undefined" ? window.scrollY : 0;
    const time = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.04 + scrollY * 0.0003;
    }
  });

  const particleCount = 450;
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 16;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 16;
  }

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#ecc246"
        size={0.03}
        sizeAttenuation={true}
        transparent
        opacity={0.45}
      />
    </points>
  );
}

export default function AboutPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch team members from database
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch("/api/team");
        if (res.ok) {
          const data = await res.json();
          setTeam(data);
        }
      } catch (err) {
        console.error("Failed to load team:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  // Split team into founders and general staff
  const founders = team.filter((m) => m.order <= 2);
  const operators = team.filter((m) => m.order > 2);

  return (
    <>
      <Navbar />

      {/* BACKGROUND 3D WEBGL SCENE */}
      <div className="fixed inset-0 z-0 pointer-events-none w-full h-full bg-[#0d0e0f]">
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
          <ambientLight intensity={0.25} />
          <pointLight position={[8, 8, 8]} intensity={1.8} color="#ecc246" />
          <directionalLight position={[-8, 8, -8]} intensity={0.4} />
          <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.3}>
            <ScrollAnimatedLens />
          </Float>
          <ParticleField />
          <Stars radius={100} depth={50} count={1000} factor={4} saturation={0.5} fade speed={1} />
        </Canvas>
      </div>

      {/* CORE HTML CONTENT OVERLAY */}
      <main className="relative z-10 text-on-background selection:bg-tertiary/30">
        
        {/* HERO SECTION */}
        <section className="min-h-screen flex items-center px-6 md:px-20 max-w-[1800px] mx-auto pt-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full">
            {/* Left Header */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="font-body text-[10px] tracking-[0.4em] text-tertiary uppercase font-semibold mb-4 block"
              >
                About Click1Studio
              </motion.span>
              
              <div className="overflow-hidden">
                <motion.h1
                  initial={{ y: 80, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="font-display text-4xl md:text-6xl lg:text-7xl font-bold uppercase leading-none text-white tracking-tight"
                >
                  Architects <br />
                  <span className="font-light italic text-tertiary">of Light & Motion</span>
                </motion.h1>
              </div>
            </div>

            {/* Right Philosophy */}
            <div className="lg:col-span-5 flex items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="border-l border-white/10 pl-8 space-y-6"
              >
                <p className="font-body text-base md:text-lg text-on-surface-variant font-light leading-relaxed">
                  Click1Studio is a luxury wedding photography & cinematography collective. We do not just record celebrations; we design visual relics of your legacy.
                </p>
                <p className="font-body text-sm text-on-surface-variant/80 font-light leading-relaxed">
                  Operating out of Chas Bokaro, Jharkhand, our specialized crew travels throughout India and global destinations. We blend modern editorial realism with grand cinematic compositions to write timeless visual stories.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* TEAM SECTION */}
        <section className="px-6 md:px-20 py-32 max-w-[1800px] mx-auto">
          {/* Header */}
          <div className="border-b border-white/5 pb-12 mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h5 className="font-body text-[10px] tracking-[0.4em] text-tertiary uppercase font-semibold mb-2 block">
                The Collective
              </h5>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-white uppercase tracking-tight">
                Our Creators
              </h2>
            </div>
            <p className="font-body text-xs text-on-surface-variant/60 uppercase tracking-widest font-light">
              Dynamic crew based in Chas Bokaro, Jharkhand
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-8 h-8 border border-tertiary/20 border-t-tertiary rounded-full animate-spin mb-4" />
              <p className="font-body text-[10px] text-on-surface-variant uppercase tracking-widest font-light">Loading Team...</p>
            </div>
          ) : (
            <div className="space-y-32">
              
              {/* Founders Section (Prominent Layout) */}
              <div>
                <motion.span 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="font-body text-[9px] text-tertiary uppercase tracking-[0.3em] font-bold block mb-8"
                >
                  Founding Directors
                </motion.span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {founders.map((member) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="group relative bg-[#131415]/40 border border-white/5 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-auto md:h-[340px]"
                    >
                      {/* Photo Box */}
                      <div className="w-full md:w-2/5 h-[300px] md:h-full overflow-hidden relative shrink-0">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 md:from-transparent to-transparent" />
                      </div>

                      {/* Content Box */}
                      <div className="p-8 flex flex-col justify-center flex-1">
                        <span className="font-body text-[9px] text-tertiary border border-tertiary/20 bg-tertiary/5 uppercase font-semibold px-3 py-1 rounded-full tracking-wider w-fit">
                          {member.role}
                        </span>
                        <h3 className="font-display text-2xl font-bold text-white uppercase mt-4">
                          {member.name}
                        </h3>
                        <p className="font-body text-xs text-on-surface-variant/80 mt-4 leading-relaxed font-light">
                          {member.bio}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* General Staff / Operators Section */}
              <div>
                <motion.span 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="font-body text-[9px] text-tertiary uppercase tracking-[0.3em] font-bold block mb-8"
                >
                  Production Specialists
                </motion.span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {operators.map((member) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="group bg-[#131415]/30 border border-white/5 hover:border-tertiary/20 rounded-xl overflow-hidden shadow-xl flex flex-col h-[450px] transition-all duration-500"
                    >
                      {/* Photo Box */}
                      <div className="h-[280px] w-full overflow-hidden relative shrink-0">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-103"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      </div>

                      {/* Content Box */}
                      <div className="p-6 flex flex-col flex-1 justify-between">
                        <div>
                          <span className="font-body text-[8px] text-tertiary/80 uppercase tracking-widest font-semibold">
                            {member.role}
                          </span>
                          <h4 className="font-display text-lg font-bold text-white uppercase mt-1">
                            {member.name}
                          </h4>
                          <p className="font-body text-[11px] text-on-surface-variant/70 mt-3 leading-relaxed font-light line-clamp-3">
                            {member.bio}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </section>

        {/* CONTACT & LOCATION SECTION */}
        <section id="contact" className="px-6 md:px-20 py-32 max-w-[1800px] mx-auto border-t border-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Left Info Panel */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <span className="font-body text-[10px] tracking-[0.4em] text-tertiary uppercase font-semibold mb-4 block">
                Connect With Us
              </span>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-white uppercase tracking-tight mb-8">
                Start Your Story
              </h2>
              <p className="font-body text-sm text-on-surface-variant/80 font-light leading-relaxed max-w-lg mb-12">
                Have a question or looking to secure a date? Connect with our Bokaro headquarters or write us directly. We are excited to document your moments.
              </p>

              {/* Direct Details Grid */}
              <div className="space-y-8">
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-tertiary shrink-0 border border-white/5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-body text-[9px] text-on-surface-variant/50 uppercase tracking-widest font-semibold">
                      Phone Number
                    </h5>
                    <a
                      href="tel:+916203812196"
                      className="font-display text-lg text-white hover:text-tertiary transition-colors mt-1 block font-semibold"
                    >
                      +91 6203812196
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-tertiary shrink-0 border border-white/5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-body text-[9px] text-on-surface-variant/50 uppercase tracking-widest font-semibold">
                      Email Address
                    </h5>
                    <a
                      href="mailto:click01studio@gmail.com"
                      className="font-display text-lg text-white hover:text-tertiary transition-colors mt-1 block font-semibold"
                    >
                      click01studio@gmail.com
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-tertiary shrink-0 border border-white/5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-body text-[9px] text-on-surface-variant/50 uppercase tracking-widest font-semibold">
                      Headquarters
                    </h5>
                    <p className="font-body text-sm text-white/90 leading-relaxed mt-1 font-light max-w-sm">
                      CLICK 1 Studio, Kalapather, Chas Bokaro (JH), near police station.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Design Panel / Map Info */}
            <div className="lg:col-span-6 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="glass-panel w-full p-8 md:p-12 rounded-2xl border border-white/10 relative overflow-hidden shadow-2xl space-y-8"
              >
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-tertiary/5 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-tertiary" />
                  <h4 className="font-display text-lg font-bold text-white uppercase tracking-wider">
                    Studio Availability
                  </h4>
                </div>

                <div className="space-y-4 border-t border-white/5 pt-6">
                  <div className="flex justify-between items-center text-sm font-body font-light">
                    <span className="text-on-surface-variant/80">Monday - Sunday</span>
                    <span className="text-white font-semibold uppercase">10:00 AM - 08:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-body font-light border-t border-white/5 pt-4">
                    <span className="text-on-surface-variant/80">Consultations</span>
                    <span className="text-tertiary font-semibold uppercase">By Appointment</span>
                  </div>
                </div>

                <div className="bg-[#0b0c0d] p-6 rounded-xl border border-white/5 space-y-4">
                  <span className="font-body text-[8px] text-tertiary uppercase tracking-widest font-semibold block">
                    Travel Coverage
                  </span>
                  <p className="font-body text-xs text-on-surface-variant/80 leading-relaxed font-light">
                    Our team is fully equipped and available for national and international travel. Travel costs and accommodation requirements are calculated dynamically based on location details.
                  </p>
                </div>

                <a
                  href="/book"
                  className="w-full bg-tertiary hover:bg-tertiary/90 text-[#0b0b0b] font-body text-xs font-bold py-4 rounded-full flex items-center justify-center gap-2 tracking-widest uppercase transition-all duration-300 shadow-xl"
                >
                  Book Consultation <ChevronRight className="w-4 h-4" />
                </a>
              </motion.div>
            </div>

          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
