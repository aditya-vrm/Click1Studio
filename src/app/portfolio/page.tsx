"use client";

import { useState, useEffect, useRef } from "react";
import { Eye, X, ChevronLeft, ChevronRight, Image as ImageIcon, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

interface GalleryItem {
  id: string;
  title: string;
  category:
    | "wedding"
    | "pre-wedding"
    | "engagement"
    | "birthday"
    | "drone-shots"
    | "lifestyle-portrait"
    | "events"
    | "branding";
  image: string;
  isCover?: boolean;
}

const ALBUMS = [
  { 
    key: "wedding" as const, 
    name: "Wedding", 
    description: "Capturing editorial romance, grand details, and intimate connection.",
    defaultCover: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop"
  },
  { 
    key: "pre-wedding" as const, 
    name: "Pre-Wedding", 
    description: "Pre-nuptial visual storytelling in breathtaking landscapes.",
    defaultCover: "https://images.unsplash.com/photo-1460978812857-470ed1c78af3?q=80&w=1000&auto=format&fit=crop"
  },
  { 
    key: "engagement" as const, 
    name: "Engagement", 
    description: "Honoring the first chapters and quiet promises of the journey.",
    defaultCover: "https://images.unsplash.com/photo-1519225495810-7517c296517a?q=80&w=1000&auto=format&fit=crop"
  },
  { 
    key: "birthday" as const, 
    name: "Birthday", 
    description: "Documenting milestone celebrations filled with joy and character.",
    defaultCover: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=1000&auto=format&fit=crop"
  },
  { 
    key: "drone-shots" as const, 
    name: "Drone Shots", 
    description: "Stunning, high-altitude perspectives and geometry of the land.",
    defaultCover: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop"
  },
  { 
    key: "lifestyle-portrait" as const, 
    name: "Lifestyle Portrait", 
    description: "High-end personality-driven portraits and editorial compositions.",
    defaultCover: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop"
  },
  { 
    key: "events" as const, 
    name: "Events", 
    description: "Luxury corporate Galas, cultural functions, and family celebrations.",
    defaultCover: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000&auto=format&fit=crop"
  },
  { 
    key: "branding" as const, 
    name: "Branding", 
    description: "Sleek narrative assets and visual identity for commercial creators.",
    defaultCover: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000&auto=format&fit=crop"
  }
];

export default function PortfolioPage() {
  const [hoveredAlbum, setHoveredAlbum] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal / Lightbox states
  const [selectedAlbumKey, setSelectedAlbumKey] = useState<string | null>(null);
  const [lightboxImageIndex, setLightboxImageIndex] = useState<number | null>(null);

  // Custom cursor logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Fetch portfolio data
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await fetch("/api/portfolio");
        if (res.ok) {
          const data = await res.json();
          setGalleryItems(data);
        }
      } catch (err) {
        console.error("Failed to fetch portfolio:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  // Filter items based on active modal album
  const currentAlbumItems = selectedAlbumKey
    ? galleryItems.filter((item) => item.category === selectedAlbumKey)
    : [];

  const activeAlbumInfo = selectedAlbumKey
    ? ALBUMS.find((a) => a.key === selectedAlbumKey)
    : null;

  // Navigation inside Lightbox
  const showNextImage = () => {
    if (lightboxImageIndex !== null && currentAlbumItems.length > 0) {
      setLightboxImageIndex((lightboxImageIndex + 1) % currentAlbumItems.length);
    }
  };

  const showPrevImage = () => {
    if (lightboxImageIndex !== null && currentAlbumItems.length > 0) {
      setLightboxImageIndex(
        (lightboxImageIndex - 1 + currentAlbumItems.length) % currentAlbumItems.length
      );
    }
  };

  // Keyboard navigation inside lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxImageIndex === null) return;
      if (e.key === "ArrowRight") showNextImage();
      if (e.key === "ArrowLeft") showPrevImage();
      if (e.key === "Escape") setLightboxImageIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxImageIndex, currentAlbumItems]);

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
            backgroundColor: hoveredAlbum !== null ? "rgba(201, 162, 39, 0.15)" : "transparent",
            borderColor: hoveredAlbum !== null ? "transparent" : "#ecc246",
            transform: hoveredAlbum !== null ? "scale(3.5)" : "scale(1)"
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
                The Gallery
              </h2>
              <p className="font-body text-on-surface-variant mt-8 max-w-2xl border-l-2 border-tertiary/30 pl-8 leading-relaxed font-light text-base md:text-lg">
                Explore our collections organized by albums. Select any category to view full archives, editorial collections, and drone shots in details.
              </p>
            </motion.div>
            <div className="hidden lg:block text-right pb-4 select-none">
              <span className="font-body text-[10px] text-on-surface-variant tracking-[0.3em] uppercase">
                CLICK ALBUM TO OPEN
              </span>
              <div className="h-12 w-px bg-tertiary/50 mx-auto mt-4" />
            </div>
          </div>
        </section>

        {/* Albums Grid */}
        <section className="px-6 md:px-20 pb-32 max-w-[1800px] mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="w-10 h-10 border-2 border-tertiary/10 border-t-tertiary rounded-full animate-spin mb-4" />
              <p className="font-body text-xs text-on-surface-variant uppercase tracking-[0.2em] font-light">Loading Albums...</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {ALBUMS.map((album, idx) => {
                // Find items matching this category
                const albumPhotos = galleryItems.filter((item) => item.category === album.key);
                // Cover image is the designated cover or fallback to latest photo, then default cover
                const coverItem = albumPhotos.find((item) => item.isCover);
                const coverImage = coverItem ? coverItem.image : (albumPhotos.length > 0 ? albumPhotos[0].image : album.defaultCover);

                return (
                  <motion.div
                    key={album.key}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    onMouseEnter={() => setHoveredAlbum(album.key)}
                    onMouseLeave={() => setHoveredAlbum(null)}
                    onClick={() => {
                      setSelectedAlbumKey(album.key);
                    }}
                    className="relative group overflow-hidden rounded-2xl shadow-2xl cursor-none h-[420px] lg:h-[480px] bg-surface-container/20 border border-white/5 hover:border-tertiary/30 transition-all duration-500"
                  >
                    {/* Cover Photo */}
                    <img
                      alt={album.name}
                      src={coverImage}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-85 group-hover:opacity-90 transition-opacity duration-500" />
                    
                    {/* Top indicator icon */}
                    <div className="absolute top-6 right-6 border border-white/10 text-white/50 group-hover:border-tertiary group-hover:text-tertiary w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-500">
                      <Camera className="w-3.5 h-3.5" />
                    </div>

                    {/* Text block */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                      <span className="font-body text-[10px] text-tertiary tracking-[0.25em] uppercase font-semibold mb-2 block">
                        {albumPhotos.length} {albumPhotos.length === 1 ? "Photograph" : "Photographs"}
                      </span>
                      <h3 className="font-display text-2xl md:text-3xl text-white font-bold tracking-tight uppercase mb-3">
                        {album.name}
                      </h3>
                      <p className="font-body text-xs text-on-surface-variant/80 font-light leading-relaxed max-h-0 group-hover:max-h-16 overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-750 ease-[0.16,1,0.3,1]">
                        {album.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </section>
      </main>

      {/* ALBUM PHOTOS VIEWER MODAL */}
      <AnimatePresence>
        {selectedAlbumKey && activeAlbumInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAlbumKey(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl cursor-pointer"
            />

            {/* Modal Body Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="glass-panel w-full max-w-[1500px] h-[85vh] rounded-2xl relative z-10 border border-white/5 shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 md:px-12 py-6 border-b border-white/5 shrink-0 bg-background/50">
                <div>
                  <span className="font-body text-[9px] text-tertiary uppercase tracking-[0.4em] font-semibold">
                    Viewing Album
                  </span>
                  <h3 className="font-display text-2xl md:text-3xl text-primary font-bold uppercase tracking-wide mt-1">
                    {activeAlbumInfo.name} Collection
                  </h3>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-body text-[10px] text-on-surface-variant/60 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-full border border-white/5 font-semibold">
                    {currentAlbumItems.length} {currentAlbumItems.length === 1 ? "Image" : "Images"}
                  </span>
                  
                  {/* Close button */}
                  <button
                    onClick={() => setSelectedAlbumKey(null)}
                    className="text-on-surface-variant hover:text-tertiary w-10 h-10 rounded-full border border-white/10 hover:border-tertiary flex items-center justify-center transition-all duration-300 cursor-pointer shrink-0"
                    title="Close Album"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Scrollable content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-12 scrollbar-thin">
                {currentAlbumItems.length === 0 ? (
                  <div className="text-center py-24">
                    <ImageIcon className="w-12 h-12 text-on-surface-variant/20 mx-auto mb-4" />
                    <p className="font-body text-sm text-on-surface-variant/60 italic">
                      There are no photographs in the {activeAlbumInfo.name} album yet.
                    </p>
                  </div>
                ) : (
                  <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6">
                    {currentAlbumItems.map((item, idx) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.5) }}
                        onClick={() => setLightboxImageIndex(idx)}
                        className="break-inside-avoid mb-6 relative rounded-xl overflow-hidden group cursor-zoom-in bg-surface-container/20 border border-white/5 hover:border-tertiary/20 shadow-lg"
                      >
                        <img
                          src={item.image}
                          alt=""
                          className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-[1.02]"
                        />
                        <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                          <span className="text-tertiary text-[9px] uppercase tracking-widest font-semibold flex items-center gap-1.5 font-body">
                            <Eye className="w-3 h-3" /> Expand
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FULLSCREEN LIGHTBOX VIEW */}
      <AnimatePresence>
        {lightboxImageIndex !== null && currentAlbumItems[lightboxImageIndex] && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/98">
            {/* Close Lightbox */}
            <button
              onClick={() => setLightboxImageIndex(null)}
              className="absolute top-6 right-6 z-50 text-white/70 hover:text-tertiary w-12 h-12 rounded-full border border-white/10 hover:border-tertiary flex items-center justify-center backdrop-blur-md transition-all duration-300 cursor-pointer"
              title="Close Fullscreen"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left trigger */}
            {currentAlbumItems.length > 1 && (
              <button
                onClick={showPrevImage}
                className="absolute left-6 z-50 text-white/70 hover:text-tertiary w-12 h-12 rounded-full border border-white/10 hover:border-tertiary flex items-center justify-center backdrop-blur-md transition-all duration-300 cursor-pointer"
                title="Previous Image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Image display */}
            <div className="relative max-w-[90vw] max-h-[85vh] flex flex-col items-center justify-center">
              <motion.img
                key={lightboxImageIndex}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                src={currentAlbumItems[lightboxImageIndex].image}
                alt=""
                className="max-w-full max-h-[80vh] object-contain rounded shadow-2xl border border-white/5"
              />
              
              {/* Metadata panel */}
              <div className="text-center mt-6 space-y-1">
                <p className="font-body text-[10px] text-tertiary tracking-[0.25em] uppercase font-semibold">
                  {lightboxImageIndex + 1} / {currentAlbumItems.length}
                </p>
              </div>
            </div>

            {/* Right trigger */}
            {currentAlbumItems.length > 1 && (
              <button
                onClick={showNextImage}
                className="absolute right-6 z-50 text-white/70 hover:text-tertiary w-12 h-12 rounded-full border border-white/10 hover:border-tertiary flex items-center justify-center backdrop-blur-md transition-all duration-300 cursor-pointer"
                title="Next Image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
