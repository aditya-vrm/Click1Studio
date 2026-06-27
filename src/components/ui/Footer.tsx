"use client";

import Link from "next/link";
import { Globe, ArrowUp, Mail } from "lucide-react";

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
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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
            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-on-surface-variant hover:text-tertiary hover:border-tertiary transition-all duration-500">
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
            <li><a href="#" className="hover:text-primary transition-colors">Investment</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Destinations</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
          </ul>
        </div>

        {/* Column 4: Legal */}
        <div className="lg:col-span-2 space-y-6">
          <h5 className="font-body text-[10px] text-tertiary uppercase tracking-[0.4em] font-semibold">Legal</h5>
          <ul className="space-y-4 font-body text-on-surface-variant text-sm">
            <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Copyright 2026</a></li>
          </ul>
        </div>
      </div>

      {/* Sub-Footer */}
      <div className="px-6 md:px-20 max-w-[1440px] mx-auto pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
        <p className="font-body text-[10px] text-on-surface-variant tracking-[0.4em] uppercase">
          © {new Date().getFullYear()} CLICK1STUDIO. ALL RIGHTS RESERVED.
        </p>
        <p className="font-body text-[10px] text-on-surface-variant tracking-[0.4em] uppercase">
          DESIGNED FOR THE DISCERNING
        </p>
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
    </footer>
  );
}
