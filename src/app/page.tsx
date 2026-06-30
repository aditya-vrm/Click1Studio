"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import FAQ from "@/components/sections/FAQ";
import Footer from "@/components/ui/Footer";

// Dynamically import ThreeLoader to prevent SSR hydration errors with Canvas
const ThreeLoader = dynamic(() => import("@/components/three/ThreeLoader"), {
  ssr: false,
});

export default function Home() {
  const [loading, setLoading] = useState(true);

  const stats = [
    { val: "1k+", label: "Weddings Captured" },
    { val: "15", label: "Years Experience" },
    { val: "5k+", label: "Global Clients" },
    { val: "62", label: "Industry Awards" }
  ];

  return (
    <>
      <AnimatePresence mode="wait">
        {loading ? (
          <ThreeLoader key="loader" onComplete={() => setLoading(false)} />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col w-full min-h-screen bg-background"
          >
            {/* Top Navigation */}
            <Navbar />

            {/* Main Content Sections */}
            <main className="flex-1 w-full flex flex-col">
              <Hero />
              
              <Services />

              {/* Stats Section */}
              <section className="py-32 bg-surface border-y border-white/5 relative overflow-hidden">
                <div className="max-w-[1440px] mx-auto px-6 md:px-20 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center relative z-10">
                  {stats.map((stat, idx) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      className="text-center"
                    >
                      <div className="font-display text-4xl md:text-6xl text-tertiary font-bold mb-3">
                        {stat.val}
                      </div>
                      <div className="font-body text-[10px] text-on-surface-variant uppercase tracking-[0.3em] font-semibold">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
                {/* Subtle glow background */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(201,162,39,0.03),transparent_70%)]" />
              </section>

              {/* Call to Action Section */}
              <section className="relative py-32 px-6 flex items-center justify-center overflow-hidden min-h-[70vh]">
                <div className="absolute inset-0 z-0">
                  <div 
                    className="w-full h-full bg-cover bg-fixed bg-center" 
                    style={{ 
                      backgroundImage: "url('https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop')" 
                    }}
                  >
                    <div className="absolute inset-0 bg-black/85"></div>
                  </div>
                </div>
                <div className="relative z-10 max-w-4xl text-center space-y-8">
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="font-display text-4xl md:text-6xl text-on-background leading-tight uppercase font-semibold"
                  >
                    Let's Create Memories That <br />
                    <span className="italic text-tertiary font-light">Last Forever</span>
                  </motion.h2>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="font-body text-on-surface-variant max-w-xl mx-auto text-base md:text-lg leading-relaxed font-light"
                  >
                    Our calendar fills up quickly with only a limited number of commissions accepted each year to ensure uncompromising quality for our clients.
                  </motion.p>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="pt-6"
                  >
                    <Link
                      href="/book"
                      className="inline-block bg-tertiary text-background font-body text-xs font-bold py-5 px-12 rounded-full gold-glow hover:scale-105 active:scale-95 hover:shadow-[0_0_40px_rgba(236,194,70,0.3)] transition-all duration-300 tracking-[0.2em] uppercase cursor-pointer"
                    >
                      RESERVE YOUR DATE
                    </Link>
                  </motion.div>
                </div>
              </section>
            </main>

            {/* FAQ Section */}
            <FAQ />

            {/* Footer */}
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
