"use client";

import { Camera, Film, Heart, Plane, Diamond, Briefcase, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Services() {
  const services = [
    {
      icon: Camera,
      title: "Photography",
      description: "Fine-art editorial coverage of your most precious moments, preserved forever with medium format quality."
    },
    {
      icon: Film,
      title: "Cinematography",
      description: "Cinematic storytelling that breathes life back into your memories with 4K movement and custom scores."
    },
    {
      icon: Heart,
      title: "Pre-Wedding",
      description: "The quiet, romantic chapters before the grand celebration. Fashion-forward sessions at iconic locations."
    },
    {
      icon: Plane,
      title: "Drone Art",
      description: "Breathtaking aerial perspectives of your venue and surrounding landscapes for a grand sense of scale."
    },
    {
      icon: Diamond,
      title: "Engagement",
      description: "Intimate portrait sessions capturing the raw excitement and chemistry of your engagement."
    },
    {
      icon: Briefcase,
      title: "Corporate",
      description: "High-end editorial coverage for global luxury brands, galas, and premium corporate events."
    }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  return (
    <section id="experience" className="py-32 px-6 md:px-20 bg-surface-container-lowest relative z-10">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Header Block */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <span className="font-body text-tertiary text-xs font-bold tracking-[0.5em] uppercase mb-4 block">
              Our Services
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-on-surface leading-tight font-semibold uppercase">
              Curated Visual Narratives <br />
              For Extraordinary Lives
            </h2>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:max-w-md border-l border-tertiary/20 pl-8 py-2"
          >
            <p className="font-body text-on-surface-variant text-base leading-relaxed font-light">
              From intimate elopements on the Amalfi Coast to grand celebrations in Parisian châteaus, Click1Studio provides a full suite of luxury capture services.
            </p>
          </motion.div>
        </div>

        {/* Services Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                variants={cardVariants}
                className="glass-card p-10 flex flex-col items-start gap-8 h-full group"
              >
                <div className="text-tertiary p-4 bg-tertiary/5 rounded-2xl group-hover:bg-tertiary group-hover:text-[#0b0b0b] transition-all duration-500">
                  <Icon className="w-8 h-8 stroke-[1.5]" />
                </div>
                <div className="space-y-3">
                  <h4 className="font-display text-xl text-on-surface uppercase tracking-tight font-semibold">
                    {service.title}
                  </h4>
                  <p className="font-body text-on-surface-variant group-hover:text-on-surface transition-colors leading-relaxed text-sm font-light">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            );
          })}

          {/* Custom Commissions Card */}
          <motion.div
            variants={cardVariants}
            className="glass-card p-10 flex flex-col items-center justify-center gap-4 h-full border-dashed border-tertiary/30 bg-transparent hover:bg-tertiary/5 hover:border-tertiary/50"
          >
            <h4 className="font-body text-xs text-tertiary tracking-[0.3em] uppercase font-bold text-center">
              Custom Commissions
            </h4>
            <PlusCircle className="w-12 h-12 text-on-surface-variant animate-pulse stroke-[1.2]" />
            <p className="text-on-surface-variant font-body text-[10px] tracking-widest uppercase text-center font-semibold">
              Inquire for Bespoke Packages
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
