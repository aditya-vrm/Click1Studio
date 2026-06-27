"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Films", href: "/films" },
    { name: "Book Now", href: "/book" },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 w-full z-50 transition-all duration-500 flex justify-between items-center px-6 md:px-20 ${
          scrolled
            ? "py-4 bg-[#121414]/90 backdrop-blur-2xl border-b border-white/5 shadow-2xl"
            : "py-7 bg-transparent border-b border-transparent"
        }`}
      >
        {/* Logo */}
        <Link 
          href="/"
          className="font-display text-xl md:text-2xl text-primary tracking-tighter uppercase font-bold cursor-pointer select-none"
        >
          Click1<span className="text-tertiary italic font-light">Studio</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex gap-12 items-center">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`transition-colors font-body text-xs font-semibold tracking-[0.2em] uppercase relative group py-2 ${
                  isActive ? "text-tertiary" : "text-on-surface-variant hover:text-primary"
                }`}
              >
                {link.name}
                <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-tertiary transform transition-transform origin-left duration-300 ${
                  isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`}></span>
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-8">
          <button className="text-primary hover:text-tertiary transition-colors cursor-pointer">
            <Search className="w-5 h-5 stroke-[1.5]" />
          </button>
          <Link
            href="/book"
            className="bg-primary/5 hover:bg-tertiary text-primary hover:text-on-background font-body text-[10px] font-semibold tracking-widest border border-primary/20 hover:border-tertiary px-8 py-3 rounded-full backdrop-blur-md transition-all duration-500 uppercase cursor-pointer"
          >
            INQUIRE NOW
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex lg:hidden items-center gap-4">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-primary hover:text-tertiary p-2 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-surface/98 backdrop-blur-2xl flex flex-col justify-center px-8"
          >
            <div className="flex flex-col gap-8 text-left max-w-md mx-auto w-full">
              {navLinks.map((link, idx) => (
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  key={link.name}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-display text-4xl text-on-background hover:text-tertiary transition-colors uppercase tracking-tight"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="pt-8 border-t border-white/10 mt-4 flex flex-col gap-6"
              >
                <Link
                  href="/book"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-tertiary text-on-background font-body text-center text-xs tracking-widest py-5 rounded-full uppercase font-bold"
                >
                  RESERVE YOUR DATE
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
