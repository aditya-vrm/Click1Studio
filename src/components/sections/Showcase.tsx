"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectItem {
  id: number;
  title: string;
  category: "wedding" | "destination" | "film";
  type: "photo" | "video";
  image: string;
  location: string;
}

export default function Showcase() {
  const [filter, setFilter] = useState<"all" | "wedding" | "destination" | "film">("all");

  const items: ProjectItem[] = [
    {
      id: 1,
      title: "The Parisian Romance",
      category: "destination",
      type: "photo",
      image: "https://images.unsplash.com/photo-1507504038482-76214372a54a?q=80&w=1000&auto=format&fit=crop",
      location: "Paris, France"
    },
    {
      id: 2,
      title: "Château d'Esclimont Gala",
      category: "wedding",
      type: "photo",
      image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000&auto=format&fit=crop",
      location: "Eure-et-Loir, France"
    },
    {
      id: 3,
      title: "Amalfi Golden Hour",
      category: "film",
      type: "video",
      image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1000&auto=format&fit=crop",
      location: "Amalfi Coast, Italy"
    },
    {
      id: 4,
      title: "Editorial Lake Como",
      category: "destination",
      type: "photo",
      image: "https://images.unsplash.com/photo-1519225495810-7517c296517a?q=80&w=1000&auto=format&fit=crop",
      location: "Lake Como, Italy"
    },
    {
      id: 5,
      title: "The Florence Archive",
      category: "wedding",
      type: "photo",
      image: "https://images.unsplash.com/photo-1460978812857-470ed1c78af3?q=80&w=1000&auto=format&fit=crop",
      location: "Florence, Italy"
    },
    {
      id: 6,
      title: "Mediterranean Symphony",
      category: "film",
      type: "video",
      image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=1000&auto=format&fit=crop",
      location: "Santorini, Greece"
    }
  ];

  const filteredItems = filter === "all" ? items : items.filter((item) => item.category === filter);

  const categories = [
    { key: "all", name: "All Works" },
    { key: "wedding", name: "Weddings" },
    { key: "destination", name: "Destinations" },
    { key: "film", name: "Films" }
  ];

  const stats = [
    { val: "1k+", label: "Weddings Captured" },
    { val: "15", label: "Years Experience" },
    { val: "5k+", label: "Global Clients" },
    { val: "62", label: "Industry Awards" }
  ];

  return (
    <section id="portfolio" className="py-32 px-6 md:px-20 bg-background relative z-10">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20">
          <div>
            <span className="font-body text-tertiary text-xs font-bold tracking-[0.5em] uppercase mb-4 block">
              Showcase
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-primary leading-tight font-semibold uppercase">
              The Archives
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-4 md:gap-8">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setFilter(cat.key as any)}
                className={`font-body text-xs font-bold tracking-widest uppercase pb-2 border-b-2 transition-all duration-300 cursor-pointer ${
                  filter === cat.key
                    ? "border-tertiary text-tertiary"
                    : "border-transparent text-on-surface-variant hover:text-primary"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                key={item.id}
                className="group relative h-[450px] rounded-3xl overflow-hidden cursor-pointer shadow-2xl"
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-110"
                  style={{ backgroundImage: `url(${item.image})` }}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500 opacity-80 group-hover:opacity-90" />
                
                {/* Card Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end gap-3 z-10">
                  <span className="font-body text-tertiary text-[10px] tracking-[0.2em] uppercase font-bold">
                    {item.location}
                  </span>
                  
                  <h3 className="font-display text-2xl text-white uppercase tracking-tight font-semibold">
                    {item.title}
                  </h3>
                  
                  <div className="flex items-center justify-between mt-4">
                    <span className="font-body text-on-surface-variant text-[10px] tracking-widest uppercase">
                      {item.category} • {item.type}
                    </span>
                    
                    {item.type === "video" && (
                      <span className="w-10 h-10 flex items-center justify-center rounded-full bg-tertiary/10 text-tertiary border border-tertiary/20 group-hover:bg-tertiary group-hover:text-black transition-all duration-300">
                        <Play className="w-4 h-4 fill-current" />
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mt-40 pt-20 border-t border-white/5 relative">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <div className="font-display text-5xl md:text-6xl text-tertiary font-bold mb-3">
                {stat.val}
              </div>
              <div className="font-body text-xs text-on-surface-variant uppercase tracking-[0.3em] font-semibold">
                {stat.label}
              </div>
            </motion.div>
          ))}
          {/* Subtle glow background */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(201,162,39,0.03),transparent_70%)]" />
        </div>
      </div>
    </section>
  );
}
