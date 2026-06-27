"use client";

import { useState, useEffect, useRef } from "react";
import { Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

interface GalleryItem {
  id: number;
  title: string;
  category: "wedding" | "editorial" | "engagement" | "events" | "corporate" | "drone";
  image: string;
}

export default function PortfolioPage() {
  const [filter, setFilter] = useState<string>("all");
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [displayCount, setDisplayCount] = useState(6);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const galleryRef = useRef<HTMLDivElement>(null);

  // Custom cursor logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const galleryItems: GalleryItem[] = [
    {
      id: 1,
      title: "The Grand Reveal",
      category: "editorial",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Coastal Solitude",
      category: "drone",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "Promises Made",
      category: "engagement",
      image: "https://images.unsplash.com/photo-1460978812857-470ed1c78af3?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: 4,
      title: "The Gala Evening",
      category: "corporate",
      image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: 5,
      title: "Twilight In Como",
      category: "wedding",
      image: "https://images.unsplash.com/photo-1519225495810-7517c296517a?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: 6,
      title: "Silent Altars",
      category: "events",
      image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=1000&auto=format&fit=crop"
    },
    // Extra items for infinite scroll simulation
    {
      id: 7,
      title: "Parisian Echoes",
      category: "editorial",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: 8,
      title: "Aegean Dream",
      category: "drone",
      image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1000&auto=format&fit=crop"
    }
  ];

  // Infinite scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 200 &&
        displayCount < galleryItems.length &&
        !loadingMore
      ) {
        setLoadingMore(true);
        setTimeout(() => {
          setDisplayCount((prev) => Math.min(prev + 2, galleryItems.length));
          setLoadingMore(false);
        }, 1000);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [displayCount, loadingMore, galleryItems.length]);

  const filteredItems = filter === "all" 
    ? galleryItems.slice(0, displayCount)
    : galleryItems.filter((item) => item.category === filter).slice(0, displayCount);

  const filterTabs = [
    { key: "all", name: "ALL" },
    { key: "wedding", name: "WEDDING" },
    { key: "editorial", name: "EDITORIAL" },
    { key: "engagement", name: "ENGAGEMENT" },
    { key: "events", name: "EVENTS" },
    { key: "corporate", name: "CORPORATE" },
    { key: "drone", name: "DRONE" }
  ];

  return (
    <>
      <Navbar />

      {/* Floating Custom Cursor */}
      {cursorVisible && (
        <div
          className="fixed pointer-events-none z-50 rounded-full border border-tertiary transition-transform duration-100 ease-out hidden lg:block"
          style={{
            left: `${mousePosition.x - 12}px`,
            top: `${mousePosition.y - 12}px`,
            width: "24px",
            height: "24px",
            backgroundColor: hoveredId !== null ? "rgba(201, 162, 39, 0.15)" : "transparent",
            borderColor: hoveredId !== null ? "transparent" : "#ecc246",
            transform: hoveredId !== null ? "scale(3.5)" : "scale(1)"
          }}
        />
      )}

      <main 
        onMouseEnter={() => setCursorVisible(true)}
        onMouseLeave={() => setCursorVisible(false)}
        className="pt-40 min-h-screen bg-[#0d0e0f] text-on-background selection:bg-tertiary/30"
      >
        {/* Title Block */}
        <section className="px-6 md:px-20 py-12 md:py-24 max-w-[1800px] mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <h2 className="font-display text-4xl md:text-6xl lg:text-7xl leading-none text-on-background uppercase font-bold">
                The Archive
              </h2>
              <p className="font-body text-on-surface-variant mt-8 max-w-2xl border-l-2 border-tertiary/30 pl-8 leading-relaxed font-light text-base md:text-lg">
                A curated visual anthology capturing the visceral, the silent, and the monumental. From cinematic wedding narratives to high-end editorial moments. Each frame is a testament to the art of presence.
              </p>
            </motion.div>
            <div className="hidden lg:block text-right pb-4 select-none">
              <span className="font-body text-[10px] text-on-surface-variant tracking-[0.3em] uppercase">
                SCROLL TO EXPLORE
              </span>
              <div className="h-12 w-px bg-tertiary/50 mx-auto mt-4" />
            </div>
          </div>
        </section>

        {/* Sticky Filters */}
        <section className="sticky top-[80px] z-40 bg-[#0d0e0f]/95 backdrop-blur-md px-6 md:px-20 py-8 border-b border-white/5">
          <div className="flex gap-6 md:gap-16 overflow-x-auto pb-2 no-scrollbar max-w-[1800px] mx-auto whitespace-nowrap">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`font-body text-[10px] font-bold tracking-[0.2em] uppercase pb-2 border-b-2 transition-all duration-300 cursor-pointer ${
                  filter === tab.key
                    ? "border-tertiary text-tertiary"
                    : "border-transparent text-on-surface-variant hover:text-primary"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </section>

        {/* Masonry-style Grid */}
        <section className="px-6 md:px-20 py-12 max-w-[1800px] mx-auto">
          <motion.div 
            layout 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  key={item.id}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="relative group overflow-hidden rounded-2xl cursor-none shadow-2xl h-[400px] lg:h-[480px]"
                >
                  {/* Photo Layer */}
                  <img
                    alt={item.title}
                    src={item.image}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                  />
                  
                  {/* Gold Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-tertiary/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8" />
                  
                  {/* Text Overlay */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-end z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="font-body text-[10px] text-white/80 tracking-widest uppercase font-semibold mb-2">
                      {item.category}
                    </span>
                    <h3 className="font-display text-2xl text-white font-bold tracking-tight">
                      {item.title}
                    </h3>
                    <div className="absolute right-8 bottom-8 text-white p-3 rounded-full border border-white/30 backdrop-blur-md">
                      <Eye className="w-4 h-4" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Infinite Scroll Spinner simulation */}
          {displayCount < galleryItems.length && (
            <div className="flex justify-center py-24">
              <div className="w-10 h-10 border-2 border-tertiary/10 border-t-tertiary rounded-full animate-spin" />
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
