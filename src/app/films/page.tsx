"use client";

import { useRef, useState, useEffect } from "react";
import { Play, ArrowRight, MapPin, ChevronLeft, ChevronRight, Video, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

interface FilmItem {
  id: string;
  title: string;
  location: string;
  duration: string;
  coverImage: string;
  videoUrl?: string;
  createdAt: string;
}

interface ReelItem {
  id: string;
  title: string;
  videoUrl: string;
  createdAt: string;
}

export default function FilmsPage() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [weddingFilms, setWeddingFilms] = useState<FilmItem[]>([]);
  const [reels, setReels] = useState<ReelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  const getEmbedUrl = (url: string | null) => {
    if (!url) return null;

    // YouTube
    const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const ytMatch = url.match(ytRegex);
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`;
    }

    // Vimeo
    const vimeoRegex = /(?:vimeo\.com\/)(?:video\/)?([0-9]+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch && vimeoMatch[1]) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
    }

    return null;
  };

  useEffect(() => {
    const fetchFilmsAndReels = async () => {
      try {
        const [filmsRes, reelsRes] = await Promise.all([
          fetch("/api/films"),
          fetch("/api/reels")
        ]);
        if (filmsRes.ok) {
          const data = await filmsRes.json();
          setWeddingFilms(data);
        }
        if (reelsRes.ok) {
          const data = await reelsRes.json();
          setReels(data);
        }
      } catch (err) {
        console.error("Failed to fetch films/reels:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFilmsAndReels();
  }, []);

  const scrollSlider = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = 400;
      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <>
      <Navbar />

      {/* Cinematic Splash Hero */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-background">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-background z-10" />
          <div 
            className="w-full h-full bg-cover bg-center scale-100 animate-pulse-slow" 
            style={{ 
              backgroundImage: "url('/images/wedding_night_drone_view.png')",
              animation: "pulse-slow 12s infinite alternate ease-in-out"
            }} 
          />
        </div>

        <div className="relative z-20 text-center px-6">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="font-body text-tertiary tracking-[0.5em] uppercase mb-6 block text-xs md:text-sm font-bold"
          >
            Cinematic Excellence
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="font-display text-4xl md:text-7xl lg:text-8xl text-white mb-10 max-w-5xl mx-auto leading-tight font-extrabold tracking-tight uppercase"
          >
            THE ART OF THE MOMENT
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <button 
              onClick={() => {
                if (weddingFilms.length > 0 && weddingFilms[0].videoUrl) {
                  setActiveVideoUrl(weddingFilms[0].videoUrl);
                }
              }}
              className="bg-tertiary text-background px-12 py-5 rounded-full font-body text-xs font-bold tracking-widest hover:scale-105 active:scale-95 transition-all duration-300 gold-glow flex items-center gap-3 mx-auto cursor-pointer"
            >
              VIEW SHOWREEL <Play className="w-4 h-4 fill-current" />
            </button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 opacity-60">
          <span className="text-[9px] tracking-[0.5em] uppercase font-body text-white font-semibold">Scroll to Explore</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent" />
        </div>
      </section>

      {/* Main Content Canvas */}
      <main className="relative z-10 bg-background pt-24 pb-32">
        
        {/* Weddings collections horizontal list */}
        <section className="mb-32">
          <div className="px-6 md:px-20 max-w-[1440px] mx-auto mb-12 flex justify-between items-end">
            <div>
              <span className="text-tertiary font-body tracking-[0.3em] uppercase text-xs font-bold">Featured Works</span>
              <h3 className="font-display text-3xl md:text-5xl text-white mt-3 font-semibold uppercase">Wedding Collections</h3>
            </div>
            <a href="#portfolio" className="text-on-surface-variant hover:text-tertiary transition-colors font-body uppercase tracking-widest text-xs flex items-center gap-2 group font-semibold">
              View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Netlix Style Slider block */}
          <div className="relative group/slider max-w-[1440px] mx-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <Loader2 className="w-8 h-8 text-tertiary animate-spin mb-4" />
                <p className="font-body text-xs text-on-surface-variant uppercase tracking-[0.2em] font-light">Loading Collections...</p>
              </div>
            ) : weddingFilms.length === 0 ? (
              <div className="text-center py-24 border border-dashed border-white/5 rounded-2xl mx-6 md:mx-20">
                <p className="font-body text-sm text-on-surface-variant italic">No films in the collection yet.</p>
              </div>
            ) : (
              <>
                <div 
                  ref={sliderRef}
                  className="flex gap-8 overflow-x-auto no-scrollbar px-6 md:px-20 pb-8 slider-container"
                >
                  {weddingFilms.map((film) => (
                    <div 
                      key={film.id} 
                      onClick={() => {
                        if (film.videoUrl) {
                          setActiveVideoUrl(film.videoUrl);
                        }
                      }}
                      className="film-card flex-shrink-0 w-[300px] md:w-[480px] relative cursor-pointer group"
                    >
                      <div className="aspect-[16/9] overflow-hidden rounded-2xl relative shadow-2xl">
                        <div 
                          className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
                          style={{ backgroundImage: `url(${film.coverImage && film.coverImage.includes("imagekit.io") ? `${film.coverImage}?tr=orig-true` : film.coverImage})` }} 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80" />
                        
                        {/* Hover Play Button */}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-[1px]">
                          <div className="w-16 h-16 rounded-full border border-tertiary/40 flex items-center justify-center text-tertiary bg-[#0b0b0b]/60 scale-75 group-hover:scale-100 transition-transform duration-500">
                            <Play className="w-6 h-6 fill-current ml-1" />
                          </div>
                        </div>
                        
                        <span className="absolute top-4 right-4 bg-[#0b0b0b]/80 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-body text-white font-bold tracking-widest">
                          {film.duration}
                        </span>
                      </div>
                      <div className="mt-6">
                        <h4 className="font-display text-xl text-white group-hover:text-tertiary transition-colors font-bold uppercase tracking-tight">
                          {film.title}
                        </h4>
                        <p className="text-on-surface-variant font-body text-xs mt-2 flex items-center gap-1 font-light">
                          <MapPin className="w-3.5 h-3.5 text-tertiary" /> {film.location}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Slider triggers */}
                <button 
                  onClick={() => scrollSlider("left")}
                  className="absolute left-6 top-[35%] -translate-y-1/2 z-30 bg-black/80 border border-white/5 text-white p-3 rounded-full opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-tertiary hover:text-black cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => scrollSlider("right")}
                  className="absolute right-6 top-[35%] -translate-y-1/2 z-30 bg-black/80 border border-white/5 text-white p-3 rounded-full opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-tertiary hover:text-black cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </section>



        {/* Reels Section */}
        {reels.length > 0 && (
          <section className="max-w-[1440px] mx-auto mt-24">
            <div className="px-6 md:px-20 mb-12">
              <span className="text-tertiary font-body tracking-[0.3em] uppercase text-xs font-bold">Short Cinematics</span>
              <h3 className="font-display text-3xl md:text-5xl text-white mt-3 font-semibold uppercase">Vertical Reels</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-6 md:px-20">
              {reels.map((reel) => (
                <div 
                  key={reel.id} 
                  onClick={() => {
                    if (reel.videoUrl) {
                      setActiveVideoUrl(reel.videoUrl);
                    }
                  }}
                  className="group cursor-pointer relative aspect-[9/16] overflow-hidden rounded-2xl shadow-xl bg-surface-container/20 border border-white/5"
                >
                  <video 
                    src={reel.videoUrl} 
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-85 transition-all duration-700 group-hover:scale-105"
                    muted
                    loop
                    playsInline
                    onMouseEnter={(e) => {
                      e.currentTarget.play().catch(() => {});
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.pause();
                      e.currentTarget.currentTime = 0;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent transition-opacity duration-500" />
                  
                  {/* Title overlay */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <h4 className="font-display text-lg text-white font-bold uppercase tracking-wide truncate">
                      {reel.title}
                    </h4>
                  </div>
                  
                  {/* Play Indicator */}
                  <div className="absolute top-4 right-4 bg-[#0b0b0b]/80 backdrop-blur-md p-2 rounded-full text-white">
                    <Play className="w-3 h-3 fill-current text-tertiary" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      <Footer />

      {/* Lightbox Video Player Modal */}
      <AnimatePresence>
        {activeVideoUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm">
            {/* Backdrop click to close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveVideoUrl(null)}
              className="absolute inset-0 cursor-pointer"
            />

            {/* Close Button */}
            <button
              onClick={() => setActiveVideoUrl(null)}
              className="absolute top-6 right-6 z-50 text-white/70 hover:text-tertiary w-12 h-12 rounded-full border border-white/10 hover:border-tertiary flex items-center justify-center backdrop-blur-md transition-all duration-300 cursor-pointer"
              title="Close Player"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Video Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 z-10 bg-black"
            >
              {getEmbedUrl(activeVideoUrl) ? (
                <iframe
                  src={getEmbedUrl(activeVideoUrl) || undefined}
                  className="w-full h-full"
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                  frameBorder="0"
                />
              ) : (
                <video
                  src={activeVideoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes pulse-slow {
          0% { transform: scale(1); }
          100% { transform: scale(1.05); }
        }
      `}</style>
    </>
  );
}
