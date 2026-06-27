"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import Showcase from "@/components/sections/Showcase";
import BookingForm from "@/components/sections/BookingForm";
import Footer from "@/components/ui/Footer";

// Dynamically import ThreeLoader to prevent SSR hydration errors with Canvas
const ThreeLoader = dynamic(() => import("@/components/three/ThreeLoader"), {
  ssr: false,
});

export default function Home() {
  const [loading, setLoading] = useState(true);

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
              <Showcase />
              
              {/* Mid-page luxury decorative text banner */}
              <section className="py-24 bg-surface-container border-y border-white/5 overflow-hidden flex items-center justify-center relative select-none">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 0.8, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="text-center space-y-4 px-6"
                >
                  <p className="font-body text-tertiary text-xs font-bold tracking-[0.6em] uppercase">
                    Bespoke Visual Heritage
                  </p>
                  <p className="font-display text-2xl md:text-3xl text-on-surface font-light italic">
                    "Documenting history. Telling stories. Framing eternity."
                  </p>
                </motion.div>
                {/* Subtle glow behind text */}
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(201,162,39,0.02),transparent_70%)]" />
              </section>

              <BookingForm />
            </main>

            {/* Footer */}
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
