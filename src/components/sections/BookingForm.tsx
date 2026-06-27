"use client";

import { useState } from "react";
import { CheckCircle2, ArrowRight, ArrowLeft, Send, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BookingForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    eventType: "",
    date: "",
    location: "",
    guests: "",
    budget: "",
    packageType: "Signature Pro",
    notes: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successData, setSuccessData] = useState<any>(null);

  const totalSteps = 6;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const selectEvent = (type: string) => {
    setFormData((prev) => ({ ...prev, eventType: type }));
  };

  const selectPackage = (pkg: string) => {
    setFormData((prev) => ({ ...prev, packageType: pkg }));
  };

  const isStepValid = () => {
    if (step === 1) return formData.name && formData.phone && formData.email;
    if (step === 2) return formData.eventType;
    if (step === 3) return formData.date && formData.location && formData.guests && formData.budget;
    if (step === 4) return formData.packageType;
    return true;
  };

  const handleNext = () => {
    if (isStepValid() && step < totalSteps) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStepValid()) return;
    
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setSuccessData(data.booking);
        setStep(6);
      } else {
        setError(data.error || "Failed to submit booking inquiry.");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const progress = ((step - 1) / (totalSteps - 1)) * 100;

  return (
    <section id="inquire" className="py-32 px-6 md:px-20 bg-surface-container-lowest relative z-10">
      <div className="max-w-[1000px] mx-auto">
        
        {/* Section Title */}
        <div className="text-center mb-16">
          <span className="font-body text-tertiary text-xs font-bold tracking-[0.5em] uppercase mb-4 block">
            The Inquiry
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-primary font-semibold uppercase italic">
            Book Your Masterpiece
          </h2>
          <p className="text-on-surface-variant font-body text-sm max-w-xl mx-auto mt-4 leading-relaxed font-light">
            Tell us about your vision. Every moment we capture at Click1Studio is a story told with editorial grace and cinematic precision.
          </p>
        </div>

        {/* Progress Tracker */}
        {step < 6 && (
          <div className="relative mb-16 max-w-[600px] mx-auto">
            <div className="h-[2px] w-full bg-outline-variant absolute top-1/2 -translate-y-1/2 left-0 -z-10" />
            <motion.div 
              className="h-[2px] bg-tertiary absolute top-1/2 -translate-y-1/2 left-0 -z-10 shadow-[0_0_10px_#ecc246]"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
            <div className="flex justify-between">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold font-body transition-all duration-500 ring-8 ring-[#0d0e0f] ${
                    i < step
                      ? "bg-tertiary text-[#0b0b0b] shadow-[0_0_15px_#ecc246]"
                      : i === step
                      ? "bg-tertiary text-[#0b0b0b] scale-110 shadow-[0_0_15px_#ecc246]"
                      : "bg-surface-variant text-on-surface-variant"
                  }`}
                >
                  {i}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form panel container */}
        <div className="glass-panel rounded-[2rem] p-8 md:p-16 relative overflow-hidden min-h-[500px] shadow-2xl">
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              
              {/* Step 1: Personal Details */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-8"
                >
                  <h3 className="font-display text-2xl text-primary font-semibold uppercase mb-8">Personal Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="font-body text-[10px] uppercase text-tertiary tracking-widest font-semibold block">Full Name</label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-outline-variant focus:border-tertiary py-4 text-base text-on-surface placeholder:text-surface-variant transition-colors outline-none font-light"
                        placeholder="ENTER YOUR FULL NAME"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-body text-[10px] uppercase text-tertiary tracking-widest font-semibold block">Phone Number</label>
                      <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-outline-variant focus:border-tertiary py-4 text-base text-on-surface placeholder:text-surface-variant transition-colors outline-none font-light"
                        placeholder="+1 (555) 000-0000"
                        required
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="font-body text-[10px] uppercase text-tertiary tracking-widest font-semibold block">Email Address</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-outline-variant focus:border-tertiary py-4 text-base text-on-surface placeholder:text-surface-variant transition-colors outline-none font-light"
                        placeholder="HELLO@YOURDOMAIN.COM"
                        required
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Event Type */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-8"
                >
                  <h3 className="font-display text-2xl text-primary font-semibold uppercase mb-8 text-center">What event are we archiving?</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                      { key: "wedding", label: "Wedding", desc: "Fine Art Wed" },
                      { key: "pre-wedding", label: "Pre-Wedding", desc: "Editorial Session" },
                      { key: "anniversary", label: "Anniversary", desc: "Elegant Milestones" },
                      { key: "corporate", label: "Corporate", desc: "Luxury Brands" }
                    ].map((type) => (
                      <button
                        type="button"
                        key={type.key}
                        onClick={() => selectEvent(type.key)}
                        className={`p-8 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-4 cursor-pointer ${
                          formData.eventType === type.key
                            ? "border-tertiary bg-tertiary/10 scale-102"
                            : "border-white/5 bg-white/5 hover:border-tertiary/40"
                        }`}
                      >
                        <span className="font-body text-xs font-bold uppercase tracking-widest text-primary">{type.label}</span>
                        <span className="font-body text-[9px] uppercase tracking-widest text-on-surface-variant font-light">{type.desc}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Event Details */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-8"
                >
                  <h3 className="font-display text-2xl text-primary font-semibold uppercase mb-8">Event Nuances</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="font-body text-[10px] uppercase text-tertiary tracking-widest font-semibold block">Preferred Date</label>
                      <input 
                        type="date" 
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-outline-variant focus:border-tertiary py-4 text-base text-on-surface [color-scheme:dark] transition-colors outline-none font-light"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-body text-[10px] uppercase text-tertiary tracking-widest font-semibold block">Venue / Location</label>
                      <input 
                        type="text" 
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-outline-variant focus:border-tertiary py-4 text-base text-on-surface placeholder:text-surface-variant transition-colors outline-none font-light"
                        placeholder="GLOBAL DESTINATION"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-body text-[10px] uppercase text-tertiary tracking-widest font-semibold block">Expected Guests</label>
                      <select 
                        name="guests"
                        value={formData.guests}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-outline-variant focus:border-tertiary py-4 text-base text-on-surface transition-colors outline-none font-light"
                        required
                      >
                        <option value="" disabled className="bg-surface">Select headcount</option>
                        <option value="intimate" className="bg-surface">Intimate (0-50 guests)</option>
                        <option value="medium" className="bg-surface">Medium (50-150 guests)</option>
                        <option value="grand" className="bg-surface">Grand (150+ guests)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="font-body text-[10px] uppercase text-tertiary tracking-widest font-semibold block">Production Budget</label>
                      <select 
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-outline-variant focus:border-tertiary py-4 text-base text-on-surface transition-colors outline-none font-light"
                        required
                      >
                        <option value="" disabled className="bg-surface">Select budget range</option>
                        <option value="3k-5k" className="bg-surface">$3,000 - $5,000</option>
                        <option value="5k-10k" className="bg-surface">$5,000 - $10,000</option>
                        <option value="10k+" className="bg-surface">$10,000+</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Package Selection */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-8"
                >
                  <h3 className="font-display text-2xl text-primary font-semibold uppercase mb-8 text-center">Choose Your Collection</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <button
                      type="button"
                      onClick={() => selectPackage("Classic Collection")}
                      className={`p-10 rounded-3xl border text-left transition-all duration-300 relative flex flex-col justify-between min-h-[220px] cursor-pointer ${
                        formData.packageType === "Classic Collection"
                          ? "border-tertiary bg-tertiary/5"
                          : "border-white/5 bg-white/5 hover:border-tertiary/40"
                      }`}
                    >
                      <div>
                        <h4 className="font-display text-xl text-primary font-semibold mb-2">The Classic</h4>
                        <p className="text-on-surface-variant text-xs leading-relaxed font-light">
                          6 hours editorial coverage, lead artist, 400+ curated high-resolution digital image archives.
                        </p>
                      </div>
                      <div className="font-display text-3xl text-tertiary font-bold mt-6">$3,200</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => selectPackage("Signature Pro")}
                      className={`p-10 rounded-3xl border-2 text-left transition-all duration-300 relative flex flex-col justify-between min-h-[220px] cursor-pointer ${
                        formData.packageType === "Signature Pro"
                          ? "border-tertiary bg-tertiary/10"
                          : "border-white/5 bg-white/5 hover:border-tertiary/40"
                      }`}
                    >
                      <div className="absolute top-6 right-6 bg-tertiary text-background px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest">
                        Most Demanded
                      </div>
                      <div>
                        <h4 className="font-display text-xl text-primary font-semibold mb-2">The Studio Pro</h4>
                        <p className="text-on-surface-variant text-xs leading-relaxed font-light">
                          10 hours, lead + second shooter, cinematic highlight film, premium layout album, drone footage.
                        </p>
                      </div>
                      <div className="font-display text-3xl text-tertiary font-bold mt-6">$6,500</div>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 5: Brief and Submit */}
              {step === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-8"
                >
                  <h3 className="font-display text-2xl text-primary font-semibold uppercase mb-8">Confirm Details</h3>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="font-body text-[10px] uppercase text-tertiary tracking-widest font-semibold block">The Creative Brief (Vision)</label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-outline-variant focus:border-tertiary py-4 text-base text-on-surface placeholder:text-surface-variant transition-colors outline-none font-light resize-none"
                        placeholder="DESCRIBE THE ARTISTIC DIRECTION, KEY DETAILS, OR OVERALL EMOTIVE ATMOSPHERE..."
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="border border-white/5 bg-white/5 rounded-2xl p-8 space-y-4">
                    <h4 className="font-body text-[10px] uppercase text-tertiary tracking-[0.2em] font-bold">Summary Review</h4>
                    <div className="grid grid-cols-2 gap-y-3 text-sm">
                      <div className="text-on-surface-variant font-light">Name:</div>
                      <div className="text-primary text-right font-semibold">{formData.name}</div>
                      
                      <div className="text-on-surface-variant font-light">Type:</div>
                      <div className="text-primary text-right font-semibold uppercase">{formData.eventType}</div>
                      
                      <div className="text-on-surface-variant font-light">Location:</div>
                      <div className="text-primary text-right font-semibold">{formData.location}</div>
                      
                      <div className="text-on-surface-variant font-light">Collection:</div>
                      <div className="text-tertiary text-right font-semibold">{formData.packageType}</div>
                    </div>
                  </div>

                  {error && <div className="text-red-400 text-xs mt-4">{error}</div>}
                </motion.div>
              )}

              {/* Step 6: Success Screen */}
              {step === 6 && successData && (
                <motion.div
                  key="step6"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-12 space-y-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="w-20 h-20 bg-tertiary/10 text-tertiary border border-tertiary/20 rounded-full flex items-center justify-center mb-4"
                  >
                    <CheckCircle2 className="w-10 h-10" />
                  </motion.div>
                  
                  <h3 className="font-display text-3xl md:text-4xl text-primary font-semibold uppercase italic">
                    Inquiry Received
                  </h3>
                  
                  <p className="text-on-surface-variant font-body text-base max-w-lg mx-auto leading-relaxed font-light">
                    Thank you, <span className="text-white font-semibold">{successData.name}</span>. Your creative request for <span className="text-white font-semibold">{successData.location}</span> has been archived in our bookings ledger.
                  </p>

                  <div className="border border-white/5 bg-white/5 rounded-2xl p-6 mt-8 w-full max-w-md text-left space-y-3 font-body text-xs">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-on-surface-variant">Reference ID</span>
                      <span className="text-tertiary font-bold tracking-widest">{successData.id}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-on-surface-variant">Selected Package</span>
                      <span className="text-primary">{successData.packageType}</span>
                    </div>
                    <div className="flex justify-between pb-1">
                      <span className="text-on-surface-variant">Inquiry Status</span>
                      <span className="text-green-400 font-semibold uppercase tracking-wider">Awaiting Curation</span>
                    </div>
                  </div>

                  <p className="text-on-surface-variant/50 text-[10px] uppercase tracking-widest italic pt-6">
                    Our Creative Director will contact you within 24 hours.
                  </p>
                </motion.div>
              )}

            </AnimatePresence>

            {/* Navigation buttons */}
            {step < 6 && (
              <div className="mt-12 flex justify-between items-center border-t border-white/5 pt-8 z-10">
                <button
                  type="button"
                  onClick={handlePrev}
                  className={`text-on-surface-variant hover:text-primary transition-all flex items-center gap-2 font-body text-xs font-semibold tracking-widest uppercase cursor-pointer ${
                    step === 1 ? "opacity-0 pointer-events-none" : ""
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" /> Previous
                </button>

                {step < 5 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!isStepValid()}
                    className={`bg-tertiary text-[#0b0b0b] py-4 px-10 rounded-full font-body text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-2 shadow-xl cursor-pointer ${
                      !isStepValid()
                        ? "opacity-45 cursor-not-allowed"
                        : "hover:scale-105 active:scale-95"
                    }`}
                  >
                    Next Step <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading || !isStepValid()}
                    className={`bg-tertiary text-[#0b0b0b] py-4 px-10 rounded-full font-body text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-2 shadow-xl cursor-pointer ${
                      loading || !isStepValid()
                        ? "opacity-45 cursor-not-allowed"
                        : "hover:scale-105 active:scale-95 hover:shadow-[0_0_30px_rgba(236,194,70,0.3)]"
                    }`}
                  >
                    {loading ? "Submitting..." : "Submit Inquiry"} <Send className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
