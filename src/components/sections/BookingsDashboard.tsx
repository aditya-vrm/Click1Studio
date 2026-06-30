"use client";

import { useState, useMemo, useEffect } from "react";
import { 
  LogOut, 
  Search, 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  Mail, 
  Phone, 
  Inbox,
  Clock,
  Image as ImageIcon,
  Film as FilmIcon,
  Upload,
  Trash2,
  Loader2,
  PlusCircle,
  X,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Booking, PortfolioItem, FilmItem } from "@/lib/db";

interface BookingsDashboardProps {
  initialBookings: Booking[];
}

export default function BookingsDashboard({ initialBookings }: BookingsDashboardProps) {
  // Navigation & Base State
  const [activeTab, setActiveTab] = useState<"bookings" | "media">("bookings");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEventType, setSelectedEventType] = useState("all");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Media Management State
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [filmItems, setFilmItems] = useState<FilmItem[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"portfolio" | "film" | null>(null);

  // Form States
  const [itemTitle, setItemTitle] = useState("");
  const [itemCategory, setItemCategory] = useState<PortfolioItem["category"]>("wedding");
  const [itemLocation, setItemLocation] = useState("");
  const [itemDuration, setItemDuration] = useState("");
  const [itemVideoUrl, setItemVideoUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Upload Progress & State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadError, setUploadError] = useState("");
  
  // Deleting State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch portfolio & films
  const fetchMedia = async () => {
    setLoadingMedia(true);
    try {
      const [portRes, filmRes] = await Promise.all([
        fetch("/api/portfolio"),
        fetch("/api/films")
      ]);
      if (portRes.ok && filmRes.ok) {
        const portData = await portRes.json();
        const filmData = await filmRes.json();
        setPortfolioItems(portData);
        setFilmItems(filmData);
      }
    } catch (e) {
      console.error("Error fetching media items:", e);
    } finally {
      setLoadingMedia(false);
    }
  };

  // Trigger fetch when changing to media tab
  useEffect(() => {
    if (activeTab === "media") {
      fetchMedia();
    }
  }, [activeTab]);

  // Logout handler
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const res = await fetch("/api/admin/logout", {
        method: "POST",
      });
      if (res.ok) {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Get unique event types for filtering
  const eventTypes = useMemo(() => {
    const types = new Set(initialBookings.map((b) => b.eventType));
    return ["all", ...Array.from(types)];
  }, [initialBookings]);

  // Filter bookings based on search & filter selection
  const filteredBookings = useMemo(() => {
    return initialBookings.filter((booking) => {
      const matchesSearch =
        booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (booking.notes && booking.notes.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesType =
        selectedEventType === "all" || booking.eventType === selectedEventType;

      return matchesSearch && matchesType;
    });
  }, [initialBookings, searchTerm, selectedEventType]);

  // Format date utilities
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch (e) {
      return dateStr;
    }
  };

  const formatSubmittedAt = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateStr;
    }
  };

  // ImageKit file upload handler
  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError("Please select a file to upload.");
      return;
    }

    setIsUploading(true);
    setUploadError("");
    setUploadStatus("Acquiring security signature...");

    try {
      // 1. Fetch auth signature, public key, and urlEndpoint from server
      const authRes = await fetch("/api/imagekit/auth");
      if (!authRes.ok) {
        throw new Error("Failed to authenticate with ImageKit server");
      }
      const authData = await authRes.json();
      const { token, expire, signature, publicKey } = authData;

      setUploadStatus("Uploading file to ImageKit Cloud...");

      // 2. Prepare FormData for ImageKit direct API upload
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("fileName", selectedFile.name);
      formData.append("publicKey", publicKey);
      formData.append("signature", signature);
      formData.append("expire", expire.toString());
      formData.append("token", token);
      formData.append("folder", modalType === "portfolio" ? "/portfolio" : "/films");

      // 3. POST upload request to ImageKit
      const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const uploadErrData = await uploadRes.json();
        throw new Error(uploadErrData.message || "Upload to ImageKit failed");
      }

      const uploadData = await uploadRes.json();
      const fileUrl = uploadData.url;

      setUploadStatus("Saving metadata to Database...");

      // 4. Save metadata to MongoDB via local API
      if (modalType === "portfolio") {
        const dbRes = await fetch("/api/portfolio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: itemTitle,
            category: itemCategory,
            image: fileUrl,
          }),
        });

        if (!dbRes.ok) {
          throw new Error("Failed to save portfolio metadata to database");
        }

        const newPortfolioItem = await dbRes.json();
        setPortfolioItems((prev) => [newPortfolioItem, ...prev]);
      } else {
        const dbRes = await fetch("/api/films", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: itemTitle,
            location: itemLocation,
            duration: itemDuration,
            coverImage: fileUrl,
            videoUrl: itemVideoUrl,
          }),
        });

        if (!dbRes.ok) {
          throw new Error("Failed to save film metadata to database");
        }

        const newFilmItem = await dbRes.json();
        setFilmItems((prev) => [newFilmItem, ...prev]);
      }

      // Success Reset
      setIsModalOpen(false);
      setItemTitle("");
      setItemLocation("");
      setItemDuration("");
      setItemVideoUrl("");
      setSelectedFile(null);
      setUploadStatus("");
    } catch (err: any) {
      setUploadError(err.message || "An unexpected error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  // Delete handler
  const handleDeleteMedia = async (id: string, type: "portfolio" | "film") => {
    if (!confirm("Are you sure you want to delete this item? This action cannot be undone.")) return;

    setDeletingId(id);
    try {
      const endpoint = type === "portfolio" ? `/api/portfolio?id=${id}` : `/api/films?id=${id}`;
      const res = await fetch(endpoint, {
        method: "DELETE",
      });

      if (res.ok) {
        if (type === "portfolio") {
          setPortfolioItems((prev) => prev.filter((item) => item.id !== id));
        } else {
          setFilmItems((prev) => prev.filter((item) => item.id !== id));
        }
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete item.");
      }
    } catch (e) {
      console.error("Delete error:", e);
      alert("An error occurred while deleting.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background py-20 px-6 md:px-20 max-w-[1440px] mx-auto relative">
      
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 border-b border-white/5 pb-8">
        <div>
          <span className="font-body text-[10px] text-tertiary uppercase tracking-[0.4em] font-semibold block mb-2">
            Admin Workspace
          </span>
          <h1 className="font-display text-4xl md:text-5xl text-primary uppercase font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="font-body text-sm text-on-surface-variant mt-2 font-light">
            Manage inquiries, portfolio photographs, and cinematic films.
          </p>
        </div>

        {/* Action Button: Logout */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-2 font-body text-xs text-on-surface-variant hover:text-tertiary tracking-widest uppercase transition-all duration-300 border border-white/10 hover:border-tertiary px-5 py-3 rounded-lg cursor-pointer disabled:opacity-50"
        >
          <LogOut className="w-4 h-4" />
          {isLoggingOut ? "LOGGING OUT..." : "LOGOUT"}
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-8 mb-12 border-b border-white/5 pb-4">
        <button
          onClick={() => setActiveTab("bookings")}
          className={`font-body text-xs font-bold uppercase tracking-[0.2em] py-2 relative cursor-pointer transition-colors duration-300 ${
            activeTab === "bookings" ? "text-tertiary" : "text-on-surface-variant/60 hover:text-primary"
          }`}
        >
          Client Inquiries
          {activeTab === "bookings" && (
            <motion.span 
              layoutId="activeTabUnderline" 
              className="absolute bottom-[-17px] left-0 w-full h-[2px] bg-tertiary"
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab("media")}
          className={`font-body text-xs font-bold uppercase tracking-[0.2em] py-2 relative cursor-pointer transition-colors duration-300 ${
            activeTab === "media" ? "text-tertiary" : "text-on-surface-variant/60 hover:text-primary"
          }`}
        >
          Manage Gallery & Films
          {activeTab === "media" && (
            <motion.span 
              layoutId="activeTabUnderline" 
              className="absolute bottom-[-17px] left-0 w-full h-[2px] bg-tertiary"
            />
          )}
        </button>
      </div>

      {/* TAB CONTENT: BOOKINGS INQUIRIES */}
      {activeTab === "bookings" && (
        <div>
          {/* Control Panel: Search & Filter */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
            {/* Search Input */}
            <div className="md:col-span-8 relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-on-surface-variant/40">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="SEARCH BY NAME, EMAIL, LOCATION OR NOTES..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-surface-container-low border border-white/5 focus:border-tertiary/40 pl-12 pr-4 py-4 rounded-xl text-sm font-light uppercase tracking-wider outline-none text-on-surface placeholder:text-on-surface-variant/40 transition-colors"
              />
            </div>

            {/* Category Filter */}
            <div className="md:col-span-4">
              <select
                value={selectedEventType}
                onChange={(e) => setSelectedEventType(e.target.value)}
                className="w-full bg-surface-container-low border border-white/5 focus:border-tertiary/40 px-4 py-4 rounded-xl text-sm font-light uppercase tracking-wider outline-none text-on-surface cursor-pointer transition-colors"
              >
                {eventTypes.map((type) => (
                  <option key={type} value={type} className="bg-surface-container-high text-on-surface">
                    {type === "all" ? "ALL EVENT TYPES" : type.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Bookings Grid */}
          {filteredBookings.length === 0 ? (
            <div className="glass-panel text-center py-24 rounded-2xl border border-white/5 max-w-md mx-auto">
              <Inbox className="w-12 h-12 text-on-surface-variant/20 mx-auto mb-4" />
              <h3 className="font-display text-lg text-primary uppercase font-semibold">No inquiries found</h3>
              <p className="font-body text-xs text-on-surface-variant mt-2 uppercase tracking-wider">
                Try adjusting your search query or filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredBookings.map((booking) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  key={booking.id}
                  className="glass-card bg-surface-container/30 backdrop-blur-xl border border-white/5 rounded-2xl p-8 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4 mb-6">
                      <div className="flex items-center gap-2">
                        <span className="bg-tertiary/10 text-tertiary border border-tertiary/20 text-[9px] font-body uppercase tracking-[0.2em] px-3 py-1.5 rounded-full font-semibold">
                          {booking.eventType}
                        </span>
                        <span className="bg-white/5 text-on-surface-variant/80 border border-white/5 text-[9px] font-body uppercase tracking-[0.2em] px-3 py-1.5 rounded-full font-medium">
                          {booking.packageType}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-on-surface-variant/40 text-[9px] font-body tracking-wider uppercase">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatSubmittedAt(booking.createdAt)}</span>
                      </div>
                    </div>

                    <h3 className="font-display text-2xl text-primary font-semibold uppercase tracking-wide mb-6">
                      {booking.name}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 mb-6">
                      <div className="flex items-center gap-3 text-on-surface-variant text-sm font-light">
                        <Mail className="w-4 h-4 text-tertiary/60 shrink-0" />
                        <a href={`mailto:${booking.email}`} className="hover:text-tertiary transition-colors truncate">
                          {booking.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-3 text-on-surface-variant text-sm font-light">
                        <Phone className="w-4 h-4 text-tertiary/60 shrink-0" />
                        <a href={`tel:${booking.phone}`} className="hover:text-tertiary transition-colors">
                          {booking.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-3 text-on-surface-variant text-sm font-light">
                        <Calendar className="w-4 h-4 text-tertiary/60 shrink-0" />
                        <span>{formatDate(booking.date)}</span>
                      </div>
                      <div className="flex items-center gap-3 text-on-surface-variant text-sm font-light">
                        <MapPin className="w-4 h-4 text-tertiary/60 shrink-0" />
                        <span className="truncate">{booking.location}</span>
                      </div>
                      <div className="flex items-center gap-3 text-on-surface-variant text-sm font-light">
                        <Users className="w-4 h-4 text-tertiary/60 shrink-0" />
                        <span>{booking.guests} Guests</span>
                      </div>
                      <div className="flex items-center gap-3 text-on-surface-variant text-sm font-light">
                        <DollarSign className="w-4 h-4 text-tertiary/60 shrink-0" />
                        <span>{booking.budget} Budget</span>
                      </div>
                    </div>

                    {booking.notes && (
                      <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 mt-6">
                        <span className="font-body text-[9px] text-tertiary uppercase tracking-widest font-semibold block mb-1.5">
                          Client Notes
                        </span>
                        <p className="font-body text-xs text-on-surface-variant/80 leading-relaxed font-light whitespace-pre-line italic">
                          "{booking.notes}"
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-8">
                    <span className="font-body text-[8px] text-on-surface-variant/30 tracking-[0.3em] uppercase">
                      INQUIRY REF
                    </span>
                    <span className="font-body text-[9px] text-on-surface-variant/60 font-semibold tracking-wider bg-white/5 px-2.5 py-1 rounded">
                      #{booking.id}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: MANAGE GALLERY & FILMS */}
      {activeTab === "media" && (
        <div className="space-y-16">
          
          {loadingMedia ? (
            <div className="text-center py-24">
              <Loader2 className="w-10 h-10 text-tertiary animate-spin mx-auto mb-4" />
              <p className="font-body text-xs text-on-surface-variant uppercase tracking-widest font-light">
                Fetching cloud content...
              </p>
            </div>
          ) : (
            <>
              {/* SECTION: PORTFOLIO IMAGES */}
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <ImageIcon className="w-5 h-5 text-tertiary" />
                    <h2 className="font-display text-2xl text-primary uppercase font-bold tracking-wide">
                      Portfolio Gallery ({portfolioItems.length})
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setModalType("portfolio");
                      setIsModalOpen(true);
                      setItemCategory("wedding");
                    }}
                    className="inline-flex items-center gap-2 bg-tertiary text-background font-body text-[10px] font-bold tracking-widest py-3.5 px-6 rounded-full uppercase hover:scale-105 active:scale-95 transition-all duration-300 shadow-md cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" /> Add Photo
                  </button>
                </div>

                {portfolioItems.length === 0 ? (
                  <p className="font-body text-sm text-on-surface-variant font-light italic">
                    No portfolio photos found. Click "Add Photo" to upload your first asset.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {portfolioItems.map((item) => (
                      <div 
                        key={item.id}
                        className="group relative bg-surface-container/30 border border-white/5 rounded-xl overflow-hidden aspect-square flex flex-col justify-end"
                      >
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        
                        <div className="relative p-4 flex justify-between items-end gap-2 w-full z-10">
                          <div className="truncate">
                            <span className="text-[8px] bg-tertiary/10 text-tertiary border border-tertiary/20 uppercase font-semibold px-2 py-0.5 rounded-full font-body tracking-wider">
                              {item.category}
                            </span>
                            <h4 className="font-body text-xs font-bold text-white uppercase tracking-wider truncate mt-2">
                              {item.title}
                            </h4>
                          </div>

                          <button
                            onClick={() => handleDeleteMedia(item.id, "portfolio")}
                            disabled={deletingId === item.id}
                            className="bg-red-950/80 hover:bg-red-700 text-red-300 p-2 rounded-lg border border-red-500/20 hover:border-red-500 transition-all duration-300 shrink-0 cursor-pointer disabled:opacity-50"
                            title="Delete Photo"
                          >
                            {deletingId === item.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION: WEDDING FILMS */}
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <FilmIcon className="w-5 h-5 text-tertiary" />
                    <h2 className="font-display text-2xl text-primary uppercase font-bold tracking-wide">
                      Wedding Films ({filmItems.length})
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setModalType("film");
                      setIsModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 bg-tertiary text-background font-body text-[10px] font-bold tracking-widest py-3.5 px-6 rounded-full uppercase hover:scale-105 active:scale-95 transition-all duration-300 shadow-md cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" /> Add Film
                  </button>
                </div>

                {filmItems.length === 0 ? (
                  <p className="font-body text-sm text-on-surface-variant font-light italic">
                    No films found. Click "Add Film" to upload your first asset.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {filmItems.map((item) => (
                      <div 
                        key={item.id}
                        className="group relative bg-surface-container/30 border border-white/5 rounded-xl overflow-hidden aspect-video flex flex-col justify-end"
                      >
                        <img 
                          src={item.coverImage} 
                          alt={item.title} 
                          className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-75 transition-all duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                        
                        <div className="relative p-5 flex justify-between items-end gap-4 w-full z-10">
                          <div className="truncate">
                            <div className="flex items-center gap-2 text-[9px] font-body text-on-surface-variant uppercase tracking-wider">
                              <MapPin className="w-3 h-3 text-tertiary/75" />
                              <span className="truncate">{item.location}</span>
                              <span>•</span>
                              <span>{item.duration}</span>
                            </div>
                            <h4 className="font-display text-lg font-bold text-white uppercase tracking-wide truncate mt-2 flex items-center gap-1.5">
                              {item.title}
                              {item.videoUrl && (
                                <a 
                                  href={item.videoUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-tertiary/60 hover:text-tertiary transition-colors"
                                  title="View Video Link"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </h4>
                          </div>

                          <button
                            onClick={() => handleDeleteMedia(item.id, "film")}
                            disabled={deletingId === item.id}
                            className="bg-red-950/80 hover:bg-red-700 text-red-300 p-2.5 rounded-lg border border-red-500/20 hover:border-red-500 transition-all duration-300 shrink-0 cursor-pointer disabled:opacity-50"
                            title="Delete Film"
                          >
                            {deletingId === item.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* UPLOAD FORM MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isUploading) {
                  setIsModalOpen(false);
                  setUploadError("");
                }
              }}
              className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="glass-panel w-full max-w-lg p-8 rounded-2xl relative z-10 border border-white/10 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              {/* Close Icon */}
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setUploadError("");
                }}
                disabled={isUploading}
                className="absolute top-6 right-6 text-on-surface-variant hover:text-tertiary transition-colors duration-300 cursor-pointer disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-display text-2xl text-primary font-bold uppercase tracking-wider mb-2">
                {modalType === "portfolio" ? "Add Portfolio Photo" : "Add Wedding Film"}
              </h3>
              <p className="font-body text-xs text-on-surface-variant/70 mb-8 uppercase tracking-widest">
                Upload your files directly to ImageKit cloud.
              </p>

              {uploadError && (
                <div className="mb-6 p-4 bg-red-950/30 border border-red-500/20 text-red-400 text-xs font-body uppercase tracking-wider rounded text-center">
                  {uploadError}
                </div>
              )}

              <form onSubmit={handleFileUpload} className="space-y-6">
                
                {/* Title */}
                <div className="space-y-2">
                  <label className="font-body text-[10px] uppercase text-tertiary tracking-widest font-semibold block">
                    Asset Title
                  </label>
                  <input
                    type="text"
                    required
                    value={itemTitle}
                    onChange={(e) => setItemTitle(e.target.value)}
                    disabled={isUploading}
                    placeholder="ENTER TITLE (E.G. TWILIGHT IN COMO)"
                    className="w-full bg-transparent border-b border-outline-variant focus:border-tertiary py-3 text-sm text-on-surface placeholder:text-on-surface-variant/30 transition-colors outline-none font-light disabled:opacity-50"
                  />
                </div>

                {/* Portfolio Specific Fields */}
                {modalType === "portfolio" && (
                  <div className="space-y-2">
                    <label className="font-body text-[10px] uppercase text-tertiary tracking-widest font-semibold block">
                      Category
                    </label>
                    <select
                      value={itemCategory}
                      onChange={(e) => setItemCategory(e.target.value as any)}
                      disabled={isUploading}
                      className="w-full bg-surface-container border border-white/5 py-3.5 px-4 rounded-xl text-sm font-light uppercase tracking-wider outline-none text-on-surface cursor-pointer disabled:opacity-50"
                    >
                      <option value="wedding">Wedding</option>
                      <option value="pre-wedding">Pre-Wedding</option>
                      <option value="engagement">Engagement</option>
                      <option value="birthday">Birthday</option>
                      <option value="drone-shots">Drone Shots</option>
                      <option value="lifestyle-portrait">Lifestyle Portrait</option>
                      <option value="events">Events</option>
                      <option value="branding">Branding</option>
                    </select>
                  </div>
                )}

                {/* Film Specific Fields */}
                {modalType === "film" && (
                  <>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="font-body text-[10px] uppercase text-tertiary tracking-widest font-semibold block">
                          Location
                        </label>
                        <input
                          type="text"
                          required
                          value={itemLocation}
                          onChange={(e) => setItemLocation(e.target.value)}
                          disabled={isUploading}
                          placeholder="E.G. LAKE COMO, ITALY"
                          className="w-full bg-transparent border-b border-outline-variant focus:border-tertiary py-3 text-sm text-on-surface placeholder:text-on-surface-variant/30 transition-colors outline-none font-light disabled:opacity-50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="font-body text-[10px] uppercase text-tertiary tracking-widest font-semibold block">
                          Duration
                        </label>
                        <input
                          type="text"
                          required
                          value={itemDuration}
                          onChange={(e) => setItemDuration(e.target.value)}
                          disabled={isUploading}
                          placeholder="E.G. 04:30"
                          className="w-full bg-transparent border-b border-outline-variant focus:border-tertiary py-3 text-sm text-on-surface placeholder:text-on-surface-variant/30 transition-colors outline-none font-light disabled:opacity-50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="font-body text-[10px] uppercase text-tertiary tracking-widest font-semibold block">
                        Video URL Link (Vimeo / YouTube / ImageKit URL)
                      </label>
                      <input
                        type="url"
                        value={itemVideoUrl}
                        onChange={(e) => setItemVideoUrl(e.target.value)}
                        disabled={isUploading}
                        placeholder="ENTER LINK URL (OPTIONAL)"
                        className="w-full bg-transparent border-b border-outline-variant focus:border-tertiary py-3 text-sm text-on-surface placeholder:text-on-surface-variant/30 transition-colors outline-none font-light disabled:opacity-50"
                      />
                    </div>
                  </>
                )}

                {/* File Upload Area */}
                <div className="space-y-2">
                  <label className="font-body text-[10px] uppercase text-tertiary tracking-widest font-semibold block mb-2">
                    {modalType === "portfolio" ? "Photo File" : "Cover Image File"}
                  </label>
                  <label className="flex flex-col items-center justify-center border border-dashed border-white/10 hover:border-tertiary/50 rounded-xl p-8 cursor-pointer transition-all duration-300 bg-surface-container/20 group">
                    <Upload className="w-8 h-8 text-on-surface-variant/40 group-hover:text-tertiary mb-3 transition-colors" />
                    <span className="text-xs uppercase tracking-wider text-on-surface-variant group-hover:text-primary transition-colors text-center max-w-[250px] truncate">
                      {selectedFile ? selectedFile.name : "Select or drag file"}
                    </span>
                    <input 
                      type="file" 
                      required
                      disabled={isUploading}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setSelectedFile(e.target.files[0]);
                        }
                      }} 
                      className="hidden" 
                      accept="image/*" 
                    />
                  </label>
                </div>

                {/* Submit Panel */}
                <div className="pt-4 flex gap-4">
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 font-body text-xs uppercase tracking-widest text-on-surface-variant border border-white/10 hover:border-white/30 rounded py-3.5 transition-all duration-300 cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading || !selectedFile}
                    className="flex-1 bg-tertiary hover:bg-tertiary/90 text-background font-body text-xs font-bold uppercase tracking-widest rounded py-3.5 transition-all duration-300 cursor-pointer shadow-lg shadow-tertiary/20 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      "Upload & Save"
                    )}
                  </button>
                </div>

                {isUploading && (
                  <p className="text-[10px] text-center text-tertiary uppercase tracking-widest font-semibold animate-pulse mt-2">
                    {uploadStatus}
                  </p>
                )}
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
