"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Globe, ArrowUp, Mail, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export default function Footer() {
  const router = useRouter();
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setEmail("");
        setPassword("");
        setIsAdminModalOpen(false);
        router.push("/bookings");
        router.refresh();
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="relative w-full pt-32 pb-16 bg-surface-container-lowest border-t border-white/5 z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 px-6 md:px-20 max-w-[1440px] mx-auto mb-24">
        {/* Left Column: Brand Statement */}
        <div className="lg:col-span-5 space-y-8">
          <div className="font-display text-2xl md:text-3xl text-primary uppercase tracking-tighter font-bold">
            Click1<span className="text-tertiary italic font-light">Studio</span>
          </div>
          <p className="font-body text-on-surface-variant text-base leading-relaxed max-w-md">
            Dedicated to documenting the world's most beautiful celebrations through an editorial and emotive lens. Based in London, available for destination commissions worldwide.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-on-surface-variant hover:text-tertiary hover:border-tertiary transition-all duration-500">
              <Globe className="w-4 h-4" />
            </a>
            <a href="https://www.instagram.com/click.1studio?igsh=MXNnd3ozaTd3aTlkNA%3D%3D" target="_blank" className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-on-surface-variant hover:text-tertiary hover:border-tertiary transition-all duration-500">
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-on-surface-variant hover:text-tertiary hover:border-tertiary transition-all duration-500">
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Column 2: Navigation */}
        <div className="lg:col-span-2 lg:col-start-7 space-y-6">
          <h5 className="font-body text-[10px] text-tertiary uppercase tracking-[0.4em] font-semibold">Explore</h5>
          <ul className="space-y-4 font-body text-on-surface-variant text-sm">
            <li>
              <Link href="/portfolio" className="hover:text-primary transition-colors flex items-center gap-2 group">
                Portfolio <span className="w-0 group-hover:w-3 h-[1px] bg-tertiary transition-all"></span>
              </Link>
            </li>
            <li>
              <Link href="/films" className="hover:text-primary transition-colors flex items-center gap-2 group">
                Films & Collections <span className="w-0 group-hover:w-3 h-[1px] bg-tertiary transition-all"></span>
              </Link>
            </li>
            <li>
              <Link href="/book" className="hover:text-primary transition-colors flex items-center gap-2 group">
                Inquire <span className="w-0 group-hover:w-3 h-[1px] bg-tertiary transition-all"></span>
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-primary transition-colors flex items-center gap-2 group">
                Home <span className="w-0 group-hover:w-3 h-[1px] bg-tertiary transition-all"></span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Information */}
        <div className="lg:col-span-2 space-y-6">
          <h5 className="font-body text-[10px] text-tertiary uppercase tracking-[0.4em] font-semibold">Information</h5>
          <ul className="space-y-4 font-body text-on-surface-variant text-sm">
            <li><Link href="/about" className="hover:text-primary transition-colors flex items-center gap-2 group">
              About Us <span className="w-0 group-hover:w-3 h-[1px] bg-tertiary transition-all"></span>
              </Link>
              </li>
            
            <li><Link href="/#faq" className="hover:text-primary transition-colors flex items-center gap-2 group">
            FAQ <span className="w-0 group-hover:w-3 h-[1px] bg-tertiary transition-all"></span>
            </Link>
            </li>
            <li><Link href="/about#contact" className="hover:text-primary transition-colors flex items-center gap-2 group">
              Contact <span className="w-0 group-hover:w-3 h-[1px] bg-tertiary transition-all"></span>
              </Link>
              </li>
          </ul>
        </div>

        {/* Column 4: Legal */}
        <div className="lg:col-span-2 space-y-6">
          <h5 className="font-body text-[10px] text-tertiary uppercase tracking-[0.4em] font-semibold">Legal</h5>
          <ul className="space-y-4 font-body text-on-surface-variant text-sm">
            <li><a href="#" className="hover:text-primary transition-colors flex items-center gap-2 group">Privacy Policy <span className="w-0 group-hover:w-3 h-[1px] bg-tertiary transition-all"></span></a></li>
            <li><a href="#" className="hover:text-primary transition-colors flex items-center gap-2 group">Terms of Service <span className="w-0 group-hover:w-3 h-[1px] bg-tertiary transition-all"></span></a></li>
            <li><a href="#" className="hover:text-primary transition-colors flex items-center gap-2 group">Copyright 2026 <span className="w-0 group-hover:w-3 h-[1px] bg-tertiary transition-all"></span></a></li>
          </ul>
        </div>
      </div>

      {/* Sub-Footer */}
      <div className="px-6 md:px-20 max-w-[1440px] mx-auto pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
        <p className="font-body text-[10px] text-on-surface-variant tracking-[0.4em] uppercase">
          © {new Date().getFullYear()} CLICK1STUDIO. ALL RIGHTS RESERVED.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="font-body text-[10px] text-on-surface-variant tracking-[0.2em] uppercase">
              Designed and Developed by
            </span>
            <a
              href="https://www.linkedin.com/in/aditya-v27"
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-6 h-6 rounded-full overflow-hidden border border-white/10 hover:border-tertiary transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer"
              title="Aditya Verma on LinkedIn"
            >
              <img
                src="/developer_avatar.png"
                alt="Aditya Verma Profile"
                className="w-full h-full object-cover"
              />
            </a>
          </div>
          <button
            onClick={() => {
              setError("");
              setIsAdminModalOpen(true);
            }}
            className="font-body text-[9px] text-on-surface-variant/60 hover:text-tertiary tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer border border-white/10 hover:border-tertiary px-3 py-1.5 rounded"
          >
            For Admin Only
          </button>
        </div>
      </div>

      {/* Floating Scroll-to-Top Button */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-40">
        <button
          onClick={scrollToTop}
          className="bg-surface-container/80 backdrop-blur-xl text-on-surface border border-white/10 rounded-full p-4 hover:bg-tertiary hover:text-on-background transition-all shadow-2xl hover:scale-110 active:scale-95 cursor-pointer"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      </div>

      {/* Admin Login Modal */}
      <AnimatePresence>
        {isAdminModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isLoading) {
                  setIsAdminModalOpen(false);
                  setError("");
                }
              }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="glass-panel w-full max-w-md p-8 rounded-2xl relative z-10 border border-white/10 shadow-2xl overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setIsAdminModalOpen(false);
                  setError("");
                }}
                disabled={isLoading}
                className="absolute top-6 right-6 text-on-surface-variant hover:text-tertiary transition-colors duration-300 cursor-pointer disabled:opacity-50"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title */}
              <div className="mb-8">
                <h3 className="font-display text-2xl text-primary font-semibold uppercase tracking-wider">
                  Admin Login
                </h3>
                <p className="font-body text-xs text-on-surface-variant/70 mt-2 uppercase tracking-widest">
                  Access restricted to administrators only.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-3 bg-red-950/30 border border-red-500/20 text-red-400 text-xs font-body uppercase tracking-wider rounded text-center">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleAdminSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="font-body text-[10px] uppercase text-tertiary tracking-widest font-semibold block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full bg-transparent border-b border-outline-variant focus:border-tertiary py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 transition-colors outline-none font-light disabled:opacity-50"
                    placeholder="ENTER YOUR EMAIL"
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-body text-[10px] uppercase text-tertiary tracking-widest font-semibold block">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full bg-transparent border-b border-outline-variant focus:border-tertiary py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 transition-colors outline-none font-light disabled:opacity-50"
                    placeholder="ENTER YOUR PASSWORD"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdminModalOpen(false);
                      setError("");
                    }}
                    disabled={isLoading}
                    className="flex-1 font-body text-xs uppercase tracking-widest text-on-surface-variant border border-white/10 hover:border-white/30 rounded py-3.5 transition-all duration-300 cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-tertiary hover:bg-tertiary/90 text-background font-body text-xs font-semibold uppercase tracking-widest rounded py-3.5 transition-all duration-300 cursor-pointer shadow-lg shadow-tertiary/20 disabled:opacity-50 flex items-center justify-center"
                  >
                    {isLoading ? "Signing In..." : "Admin Only"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}
