"use client";

import { useRef } from "react";
import { Play } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax transformations
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const handleScrollToInquire = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const element = document.querySelector("#inquire");
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const handleScrollToPortfolio = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const element = document.querySelector("#portfolio");
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
    >
      {/* Parallax Background Image with Ken Burns effect */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop')",
            animation: "hero-zoom 25s infinite alternate ease-in-out"
          }}
        >
          {/* Overlay layers to create dark luxury depth */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-background"></div>
        </div>
      </motion.div>

      {/* Hero Content */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 text-center px-6 max-w-5xl mx-auto space-y-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="font-body text-tertiary text-xs font-bold tracking-[0.5em] uppercase">
            International Destination Photographers
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-4xl md:text-6xl lg:text-7xl leading-tight text-on-background uppercase font-semibold"
        >
          Every Love Story Deserves a <br />
          <span className="text-tertiary italic font-light">Masterpiece</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-body text-on-surface-variant max-w-2xl mx-auto text-base md:text-lg leading-relaxed font-light"
        >
          We don't just capture images; we archive emotions. Timeless, editorial wedding photography for the most discerning couples around the globe.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6"
        >
          <button
            onClick={handleScrollToInquire}
            className="w-full sm:w-auto bg-tertiary text-[#0b0b0b] font-body text-xs font-bold py-5 px-12 rounded-full gold-glow hover:scale-105 hover:brightness-110 active:scale-95 transition-all duration-300 tracking-[0.2em] uppercase cursor-pointer"
          >
            BOOK YOUR SHOOT
          </button>
          <button
            onClick={handleScrollToPortfolio}
            className="w-full sm:w-auto group border border-white/20 hover:border-tertiary/50 text-on-surface font-body text-xs font-semibold py-5 px-10 rounded-full backdrop-blur-md hover:scale-105 active:scale-95 transition-all duration-300 tracking-[0.2em] uppercase flex items-center justify-center gap-3 cursor-pointer"
          >
            <Play className="w-4 h-4 text-tertiary fill-tertiary group-hover:scale-110 transition-transform" />
            WATCH OUR FILMS
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 select-none">
        <span className="font-body text-[9px] tracking-[0.4em] text-on-surface-variant/60 uppercase">
          Scroll to Explore
        </span>
        <div className="w-[1px] h-12 bg-white/10 relative overflow-hidden">
          <div 
            className="absolute top-0 left-0 w-full h-1/2 bg-tertiary"
            style={{
              animation: "scroll-indicator 2s infinite ease-in-out"
            }}
          />
        </div>
      </div>

      <style jsx global>{`
        @keyframes scroll-indicator {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(200%); opacity: 0; }
        }
        @keyframes hero-zoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
      `}</style>
    </section>
  );
}
