"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string | string[];
  listTitle?: string;
  subItems?: { label: string; value: string }[];
}

const faqs: FAQItem[] = [
  {
    question: "How far in advance should we book our wedding shoot?",
    answer: "We recommend booking at least 3–6 months in advance, especially during the wedding season, to secure your preferred dates.",
  },
  {
    question: "What services do you provide?",
    listTitle: "We offer:",
    answer: [
      "Wedding Photography",
      "Wedding Cinematography",
      "Pre-Wedding Shoots",
      "Engagement Photography",
      "Birthday & Anniversary Coverage",
      "Corporate Event Photography",
      "Drone Coverage",
      "Photo & Video Editing",
      "Premium Album Design",
    ],
  },
  {
    question: "Do you travel outside your city?",
    answer: "Yes. We are available for destination weddings and events across India. Travel and accommodation charges may apply depending on the location.",
  },
  {
    question: "How many photographers and videographers will cover my event?",
    answer: "The team size depends on your selected package. Typically, we provide 2–5 professionals, including photographers, cinematographers, and drone operators when required.",
  },
  {
    question: "Do you provide drone photography and videography?",
    answer: "Yes. Drone coverage is available where local regulations and venue permissions allow.",
  },
  {
    question: "When will we receive our photos and videos?",
    subItems: [
      { label: "Edited Photos", value: "2–4 weeks" },
      { label: "Highlight Film", value: "3–5 weeks" },
      { label: "Full Wedding Film", value: "4–8 weeks" },
    ],
    answer: "Delivery timelines may vary depending on the project size.",
  },
  {
    question: "How will we receive our final photos and videos?",
    listTitle: "You'll receive your memories through:",
    answer: [
      "Online Gallery",
      "Google Drive or Cloud Link",
      "USB Drive (optional)",
      "Premium Printed Album (if included)",
    ],
  },
  {
    question: "Can we customize a photography package?",
    answer: "Absolutely! We offer flexible packages based on your event duration, budget, and specific requirements.",
  },
  {
    question: "Do you provide same-day edited photos or reels?",
    answer: "Yes. Same-day teaser photos and Instagram reels can be arranged as an add-on service.",
  },
  {
    question: "Do you edit all the photos?",
    answer: "Yes. Every delivered photo is professionally color-corrected and edited. Selected premium images also receive detailed retouching.",
  },
  {
    question: "Can we choose the songs for our wedding film?",
    answer: "Of course! You can share your preferred music, and we'll create a cinematic film that matches your style.",
  },
  {
    question: "What happens if it rains or there is bad weather?",
    answer: "We always have backup plans and equipment. If needed, we'll adjust the schedule to ensure the best possible results.",
  },
  {
    question: "How do we book our date?",
    answer: "Simply fill out our booking form or contact us directly. Your date is confirmed once the booking amount is received.",
  },
  {
    question: "What payment methods do you accept?",
    listTitle: "We accept:",
    answer: ["UPI", "Bank Transfer", "Cash", "Credit/Debit Cards (if available)"],
  },
  {
    question: "Do you cover events other than weddings?",
    listTitle: "Yes! Along with weddings, we cover:",
    answer: [
      "Engagements",
      "Pre-Wedding Shoots",
      "Birthday Parties",
      "Anniversaries",
      "Baby Showers",
      "Corporate Events",
      "Cultural Functions",
      "Family Celebrations",
    ],
  },
  {
    question: "Can we meet before booking?",
    answer: "Yes. We can schedule an in-person meeting or a video call to discuss your event, packages, and expectations.",
  },
  {
    question: "Do you provide wedding albums?",
    answer: "Yes. We offer premium-quality printed albums in a variety of sizes and designs.",
  },
  {
    question: "Will all our photos be edited?",
    answer: "Every delivered photo is professionally edited for color, lighting, and overall quality. We do not provide raw, unedited files unless agreed upon beforehand.",
  },
  {
    question: "Do you take last-minute bookings?",
    answer: "If our team is available, we do our best to accommodate last-minute bookings. However, advance booking is always recommended.",
  },
  {
    question: "How can we contact you?",
    answer: "You can reach us through our Contact page, WhatsApp, phone, email, or social media. We'll get back to you as soon as possible.",
  },
];

export default function FAQ() {
  const [visibleCount, setVisibleCount] = useState(5);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 5, faqs.length));
  };

  const renderAnswer = (item: FAQItem) => {
    if (Array.isArray(item.answer)) {
      return (
        <div className="space-y-3">
          {item.listTitle && (
            <p className="text-on-surface-variant/80 text-sm font-medium tracking-wide">
              {item.listTitle}
            </p>
          )}
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5 pl-5 list-disc marker:text-tertiary">
            {item.answer.map((sub, sIdx) => (
              <li
                key={sIdx}
                className="text-on-surface-variant/90 text-sm leading-relaxed hover:text-primary transition-colors duration-300"
              >
                {sub}
              </li>
            ))}
          </ul>
        </div>
      );
    }

    if (item.subItems) {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {item.subItems.map((sub, sIdx) => (
              <div
                key={sIdx}
                className="bg-surface-container/30 p-4 rounded-xl border border-white/5 hover:border-tertiary/20 hover:bg-surface-container/55 transition-all duration-500"
              >
                <div className="text-[10px] text-tertiary uppercase tracking-widest font-semibold mb-1">
                  {sub.label}
                </div>
                <div className="text-sm font-bold text-primary">
                  {sub.value}
                </div>
              </div>
            ))}
          </div>
          {item.answer && (
            <p className="text-on-surface-variant/90 text-sm leading-relaxed">
              {item.answer}
            </p>
          )}
        </div>
      );
    }

    return (
      <p className="text-on-surface-variant/90 text-sm leading-relaxed">
        {item.answer}
      </p>
    );
  };

  return (
    <section
      id="faq"
      className="py-32 bg-background border-t border-white/5 relative overflow-hidden scroll-mt-24"
    >
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-tertiary/3 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[960px] mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-2"
          >
            <HelpCircle className="w-4 h-4 text-tertiary" />
            <span className="font-body text-[10px] text-tertiary uppercase tracking-[0.4em] font-semibold">
              Common Queries
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl md:text-5xl text-on-background font-semibold uppercase"
          >
            Frequently Asked <span className="italic font-light text-tertiary">Questions</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-body text-on-surface-variant max-w-lg mx-auto text-sm md:text-base leading-relaxed font-light"
          >
            Everything you need to know about our luxury booking process, services, and event execution.
          </motion.p>
        </div>

        {/* FAQ List */}
        <div className="space-y-2">
          {faqs.slice(0, visibleCount).map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: Math.min(idx % 5, 4) * 0.05 }}
                className={`border-b border-white/5 overflow-hidden transition-colors duration-500 ${
                  isOpen ? "bg-surface/10 border-white/10" : "hover:bg-surface/5"
                }`}
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full text-left py-6 px-4 md:px-6 flex items-center justify-between gap-6 cursor-pointer group"
                >
                  <span
                    className={`font-body text-base md:text-lg font-medium transition-colors duration-300 ${
                      isOpen ? "text-tertiary" : "text-primary group-hover:text-on-background"
                    }`}
                  >
                    {item.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-on-surface-variant transition-all duration-500 shrink-0 group-hover:border-tertiary/40 group-hover:text-tertiary ${
                      isOpen ? "bg-tertiary border-tertiary text-background rotate-180" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-4 md:px-6 pb-8 pt-2 text-on-surface-variant font-body">
                        {renderAnswer(item)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Load More Button */}
        {visibleCount < faqs.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <button
              onClick={handleLoadMore}
              className="inline-flex items-center gap-3 border border-white/10 hover:border-tertiary bg-surface/30 px-10 py-4 rounded-full font-body text-xs font-semibold tracking-[0.2em] text-primary hover:text-background hover:bg-tertiary transition-all duration-500 uppercase cursor-pointer hover:scale-105 active:scale-95 shadow-lg animate-fade-in"
            >
              More FAQs
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
