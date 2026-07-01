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
import { Booking, PortfolioItem, FilmItem, TeamMember } from "@/lib/db";

const categories = [
  { id: "wedding", label: "Wedding" },
  { id: "pre-wedding", label: "Pre-Wedding" },
  { id: "engagement", label: "Engagement" },
  { id: "birthday", label: "Birthday" },
  { id: "drone-shots", label: "Drone Shots" },
  { id: "lifestyle-portrait", label: "Lifestyle Portrait" },
  { id: "events", label: "Events" },
  { id: "branding", label: "Branding" }
] as const;

interface BookingsDashboardProps {
  initialBookings: Booking[];
}

export default function BookingsDashboard({ initialBookings }: BookingsDashboardProps) {
  // Navigation & Base State
  const [activeTab, setActiveTab] = useState<"bookings" | "media" | "team">("bookings");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEventType, setSelectedEventType] = useState("all");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Media Management State
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [filmItems, setFilmItems] = useState<FilmItem[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"portfolio" | "film" | null>(null);

  // Team Management State
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loadingTeam, setLoadingTeam] = useState(false);
  const [updatingTeamId, setUpdatingTeamId] = useState<string | null>(null);
  const [updatingTeamStatus, setUpdatingTeamStatus] = useState("");

  // Form States
  const [itemTitle, setItemTitle] = useState("");
  const [itemCategory, setItemCategory] = useState<PortfolioItem["category"]>("wedding");
  const [itemLocation, setItemLocation] = useState("");
  const [itemDuration, setItemDuration] = useState("");
  const [itemVideoUrl, setItemVideoUrl] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [videoSourceType, setVideoSourceType] = useState<"link" | "upload">("link");
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  
  // Upload Progress & State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadError, setUploadError] = useState("");
  
  // Deleting State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Cropping States
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [cropZoom, setCropZoom] = useState(1);
  const [cropOffset, setCropOffset] = useState({ x: 0, y: 0 });
  const [isDragStart, setIsDragStart] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [cropCallback, setCropCallback] = useState<((croppedFile: File | null) => void) | null>(null);
  const [cropOriginalName, setCropOriginalName] = useState("");

  // Confirmation Modal States
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [onConfirmAction, setOnConfirmAction] = useState<(() => void) | null>(null);

  // Toast State
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
  };

  // Upload Progresses State
  const [uploadProgresses, setUploadProgresses] = useState<{ [key: string]: number }>({});

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

  // Fetch team members
  const fetchTeam = async () => {
    setLoadingTeam(true);
    try {
      const res = await fetch("/api/team");
      if (res.ok) {
        const data = await res.json();
        setTeamMembers(data);
      }
    } catch (e) {
      console.error("Error fetching team members:", e);
    } finally {
      setLoadingTeam(false);
    }
  };

  // Trigger fetch when changing to tabs
  useEffect(() => {
    if (activeTab === "media") {
      fetchMedia();
    } else if (activeTab === "team") {
      fetchTeam();
    }
  }, [activeTab]);

  // Toast Auto-Dismiss Hook
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

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

  const startImageCrop = (file: File): Promise<File | null> => {
    return new Promise((resolve) => {
      setCropOriginalName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setCropImageSrc(reader.result as string);
        setCropZoom(1);
        setCropOffset({ x: 0, y: 0 });
        setCropCallback(() => (cropped: File | null) => {
          resolve(cropped);
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleCropImage = () => {
    if (!cropImageSrc || !cropCallback) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = cropImageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 800;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.clearRect(0, 0, 800, 800);
        const containerSize = 320;
        const fitScale = Math.min(containerSize / img.width, containerSize / img.height);
        
        ctx.save();
        ctx.translate(400, 400);
        ctx.scale(cropZoom, cropZoom);
        
        const scaleFactor = 800 / containerSize;
        ctx.translate(
          (cropOffset.x * scaleFactor) / cropZoom,
          (cropOffset.y * scaleFactor) / cropZoom
        );
        
        ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
        ctx.restore();

        try {
          const croppedDataUrl = canvas.toDataURL("image/jpeg", 0.95);
          const croppedFile = dataURLtoFile(croppedDataUrl, cropOriginalName || "cropped-image.jpg");
          cropCallback(croppedFile);
        } catch (err) {
          console.error("Cropping draw error:", err);
          cropCallback(null);
        }
      } else {
        cropCallback(null);
      }
      setCropImageSrc(null);
      setCropZoom(1);
      setCropOffset({ x: 0, y: 0 });
      setCropCallback(null);
    };
  };

  const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  // Triggered on modal form submission
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      setUploadError("Please select a cover image file to upload.");
      return;
    }
    if (modalType === "film" && videoSourceType === "upload" && !selectedVideoFile) {
      setUploadError("Please select a video file to upload.");
      return;
    }

    if (modalType === "portfolio") {
      setConfirmMessage(
        `Are you sure you want to upload and publish these ${selectedFiles.length} photographs?`
      );
    } else {
      setConfirmMessage(`Are you sure you want to upload and publish the new wedding film?`);
    }

    setOnConfirmAction(() => () => {
      setConfirmModalOpen(false);
      executeFileUpload();
    });
    setConfirmModalOpen(true);
  };

  // ImageKit file upload execution
  const executeFileUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    setUploadError("");

    // Determine files in the upload queue for progress mapping
    const filesToUpload = [...selectedFiles];
    if (modalType === "film" && videoSourceType === "upload" && selectedVideoFile) {
      filesToUpload.push(selectedVideoFile);
    }

    // Initialize progress indicators
    const initialProgresses: { [key: string]: number } = {};
    filesToUpload.forEach((file) => {
      initialProgresses[file.name] = 0;
    });
    setUploadProgresses(initialProgresses);

    // XHR helper to track upload completion percent (1-100)
    const uploadFileWithProgress = (file: File, formData: FormData): Promise<any> => {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "https://upload.imagekit.io/api/v1/files/upload");

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            setUploadProgresses((prev) => ({
              ...prev,
              [file.name]: percentComplete,
            }));
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              resolve(JSON.parse(xhr.responseText));
            } catch (err) {
              reject(new Error("Failed to parse response"));
            }
          } else {
            try {
              const errData = JSON.parse(xhr.responseText);
              reject(new Error(errData.message || `Upload failed (Status ${xhr.status})`));
            } catch (err) {
              reject(new Error(`Upload failed (Status ${xhr.status})`));
            }
          }
        };

        xhr.onerror = () => {
          reject(new Error("Network connection error"));
        };

        xhr.send(formData);
      });
    };

    try {
      if (modalType === "portfolio") {
        // Upload multiple portfolio photos
        for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i];
          const progressLabel = `Processing file ${i + 1} of ${selectedFiles.length}...`;
          setUploadStatus(progressLabel);

          // 1. Fetch signature
          const authRes = await fetch("/api/imagekit/auth");
          if (!authRes.ok) {
            throw new Error(`Failed to acquire signature for photo ${i + 1}`);
          }
          const authData = await authRes.json();
          const { token, expire, signature, publicKey } = authData;

          // 2. Prepare FormData
          const formData = new FormData();
          formData.append("file", file);
          formData.append("fileName", file.name);
          formData.append("publicKey", publicKey);
          formData.append("signature", signature);
          formData.append("expire", expire.toString());
          formData.append("token", token);
          formData.append("folder", "/portfolio");

          // 3. Upload with XHR tracking
          const uploadData = await uploadFileWithProgress(file, formData);
          const fileUrl = uploadData.url;

          // Extract title from file name (removing extension)
          const autoTitle = file.name.replace(/\.[^/.]+$/, "");

          // 4. Save metadata to Database
          const dbRes = await fetch("/api/portfolio", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: autoTitle,
              category: itemCategory,
              image: fileUrl,
            }),
          });

          if (!dbRes.ok) {
            throw new Error(`Failed to save database record for photo ${i + 1}`);
          }

          const newPortfolioItem = await dbRes.json();
          setPortfolioItems((prev) => [newPortfolioItem, ...prev]);
        }

        showToast(`Successfully uploaded ${selectedFiles.length} photographs!`, "success");
      } else {
        // Single Film Cover upload
        const coverFile = selectedFiles[0];
        setUploadStatus("Uploading cover image to ImageKit...");

        const authRes = await fetch("/api/imagekit/auth");
        if (!authRes.ok) {
          throw new Error("Failed to authenticate with ImageKit server");
        }
        const authData = await authRes.json();
        const { token, expire, signature, publicKey } = authData;

        const coverFormData = new FormData();
        coverFormData.append("file", coverFile);
        coverFormData.append("fileName", coverFile.name);
        coverFormData.append("publicKey", publicKey);
        coverFormData.append("signature", signature);
        coverFormData.append("expire", expire.toString());
        coverFormData.append("token", token);
        coverFormData.append("folder", "/films");

        const coverUploadData = await uploadFileWithProgress(coverFile, coverFormData);
        const coverUrl = coverUploadData.url;

        // Determine video URL
        let finalVideoUrl = itemVideoUrl;

        if (videoSourceType === "upload" && selectedVideoFile) {
          setUploadStatus("Uploading video file to ImageKit (this may take a few moments)...");

          const videoFormData = new FormData();
          videoFormData.append("file", selectedVideoFile);
          videoFormData.append("fileName", selectedVideoFile.name);
          videoFormData.append("publicKey", publicKey);
          videoFormData.append("signature", signature);
          videoFormData.append("expire", expire.toString());
          videoFormData.append("token", token);
          videoFormData.append("folder", "/films/videos");

          const videoUploadData = await uploadFileWithProgress(selectedVideoFile, videoFormData);
          finalVideoUrl = videoUploadData.url;
        }

        setUploadStatus("Saving film details to Database...");

        const dbRes = await fetch("/api/films", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: itemTitle,
            location: itemLocation,
            duration: itemDuration,
            coverImage: coverUrl,
            videoUrl: finalVideoUrl,
          }),
        });

        if (!dbRes.ok) {
          throw new Error("Failed to save film metadata to database");
        }

        const newFilmItem = await dbRes.json();
        setFilmItems((prev) => [newFilmItem, ...prev]);

        showToast("Successfully uploaded and published your new Film!", "success");
      }

      // Success Reset
      setIsModalOpen(false);
      setItemTitle("");
      setItemLocation("");
      setItemDuration("");
      setItemVideoUrl("");
      setSelectedFiles([]);
      setVideoSourceType("link");
      setSelectedVideoFile(null);
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

  const handleSetAlbumCover = async (itemId: string) => {
    try {
      const res = await fetch("/api/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: itemId }),
      });

      if (!res.ok) {
        throw new Error("Failed to set cover image");
      }

      const updatedItems = await res.json();
      setPortfolioItems(updatedItems);
      showToast("Successfully set this photo as the album cover!", "success");
    } catch (err: any) {
      alert(err.message || "Failed to set album cover.");
    }
  };

  // Team Photo update handler
  const handleTeamPhotoChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    memberId: string
  ) => {
    if (!e.target.files || !e.target.files[0]) return;
    const originalFile = e.target.files[0];

    // Crop the image first!
    const file = await startImageCrop(originalFile);
    if (!file) return;

    // Show Confirmation Dialog before proceeding!
    const member = teamMembers.find((m) => m.id === memberId);
    const memberName = member ? member.name : "this team member";

    setConfirmMessage(`Are you sure you want to update the profile picture for ${memberName}?`);
    setOnConfirmAction(() => async () => {
      setConfirmModalOpen(false);
      setUpdatingTeamId(memberId);
      setUpdatingTeamStatus("Signing request...");

      try {
        // 1. Fetch auth signature, public key, and urlEndpoint from server
        const authRes = await fetch("/api/imagekit/auth");
        if (!authRes.ok) {
          throw new Error("Failed to authenticate with ImageKit server");
        }
        const authData = await authRes.json();
        const { token, expire, signature, publicKey } = authData;

        setUpdatingTeamStatus("Uploading to ImageKit...");

        // 2. Prepare FormData
        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileName", `team-${memberId}-${file.name}`);
        formData.append("publicKey", publicKey);
        formData.append("signature", signature);
        formData.append("expire", expire.toString());
        formData.append("token", token);
        formData.append("folder", "/team");

        // 3. Upload to ImageKit
        const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          const uploadErrData = await uploadRes.json();
          throw new Error(uploadErrData.message || "Upload failed");
        }

        const uploadData = await uploadRes.json();
        const fileUrl = uploadData.url;

        setUpdatingTeamStatus("Saving changes...");

        // 4. Update in MongoDB via API
        const dbRes = await fetch("/api/team", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: memberId,
            image: fileUrl,
          }),
        });

        if (!dbRes.ok) {
          throw new Error("Failed to save image changes to database");
        }

        const updatedMember = await dbRes.json();

        // 5. Update local state
        setTeamMembers((prev) =>
          prev.map((m) => (m.id === memberId ? updatedMember : m))
        );

        showToast(`Successfully updated profile picture for ${memberName}!`, "success");
      } catch (err: any) {
        alert(err.message || "Failed to update team member photo.");
      } finally {
        setUpdatingTeamId(null);
        setUpdatingTeamStatus("");
      }
    });
    setConfirmModalOpen(true);
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
        <button
          onClick={() => setActiveTab("team")}
          className={`font-body text-xs font-bold uppercase tracking-[0.2em] py-2 relative cursor-pointer transition-colors duration-300 ${
            activeTab === "team" ? "text-tertiary" : "text-on-surface-variant/60 hover:text-primary"
          }`}
        >
          Manage Team
          {activeTab === "team" && (
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
                  <div className="space-y-12">
                    {categories.map((cat) => {
                      const catItems = portfolioItems.filter((item) => item.category === cat.id);
                      return (
                        <div key={cat.id} className="space-y-4 border border-white/5 bg-surface-container/10 p-6 rounded-2xl">
                          <div className="flex items-center justify-between border-b border-white/5 pb-2">
                            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-primary flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                              {cat.label} Album ({catItems.length})
                            </h3>
                            <button
                              onClick={() => {
                                setModalType("portfolio");
                                setIsModalOpen(true);
                                setItemCategory(cat.id);
                              }}
                              className="font-body text-[8px] uppercase tracking-widest text-tertiary hover:text-white transition-colors cursor-pointer border border-tertiary/20 hover:border-white/20 py-1 px-3.5 rounded-full"
                            >
                              Add to {cat.label}
                            </button>
                          </div>

                          {catItems.length === 0 ? (
                            <p className="font-body text-[10px] text-on-surface-variant/40 uppercase tracking-wider font-light py-2">
                              No photos in this album yet.
                            </p>
                          ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                              {catItems.map((item) => (
                                <div
                                  key={item.id}
                                  className="group relative bg-surface-container/30 border border-white/5 rounded-xl overflow-hidden aspect-square flex flex-col justify-between"
                                >
                                  {/* Hover Actions Bar */}
                                  <div className="absolute top-2 left-2 right-2 flex justify-between items-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {/* Set Cover Button / Indicator */}
                                    {item.isCover ? (
                                      <span className="text-[7px] bg-tertiary text-background uppercase font-bold px-2 py-0.5 rounded-full font-body tracking-wider shadow">
                                        Cover
                                      </span>
                                    ) : (
                                      <button
                                        onClick={() => handleSetAlbumCover(item.id)}
                                        className="text-[7px] bg-black/85 hover:bg-tertiary hover:text-background text-tertiary border border-tertiary/30 uppercase font-bold px-2 py-0.5 rounded-full font-body tracking-wider transition-colors shadow cursor-pointer animate-none"
                                      >
                                        Set Cover
                                      </button>
                                    )}

                                    {/* Delete Button */}
                                    <button
                                      onClick={() => handleDeleteMedia(item.id, "portfolio")}
                                      disabled={deletingId === item.id}
                                      className="bg-black/85 hover:bg-red-700 text-red-400 p-1.5 rounded-md border border-red-500/20 hover:border-red-500 transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                                      title="Delete Photo"
                                    >
                                      {deletingId === item.id ? (
                                        <Loader2 className="w-3 animate-spin" />
                                      ) : (
                                        <Trash2 className="w-3 h-3" />
                                      )}
                                    </button>
                                  </div>

                                  {/* Permanent Cover Indicator (visible without hover) */}
                                  {item.isCover && (
                                    <div className="absolute top-2 left-2 z-10 group-hover:opacity-0 transition-opacity duration-300">
                                      <span className="text-[7px] bg-tertiary text-background uppercase font-bold px-2 py-0.5 rounded-full font-body tracking-wider shadow">
                                        Cover
                                      </span>
                                    </div>
                                  )}

                                  <img
                                    src={item.image && item.image.includes("imagekit.io") ? `${item.image}?tr=orig-true` : item.image}
                                    alt={item.title}
                                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all duration-500 group-hover:scale-105"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                                  <div className="relative p-2.5 mt-auto z-10 truncate w-full">
                                    <h4 className="font-body text-[10px] font-bold text-white uppercase tracking-wider truncate">
                                      {item.title}
                                    </h4>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
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
                          src={item.coverImage && item.coverImage.includes("imagekit.io") ? `${item.coverImage}?tr=orig-true` : item.coverImage} 
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

      {/* TAB CONTENT: MANAGE TEAM */}
      {activeTab === "team" && (
        <div className="space-y-12 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <ImageIcon className="w-5 h-5 text-tertiary" />
              <h2 className="font-display text-2xl text-primary uppercase font-bold tracking-wide">
                Manage Team Members ({teamMembers.length})
              </h2>
            </div>
            <p className="font-body text-xs text-on-surface-variant/70 uppercase tracking-wider font-light">
              Hover over a member to upload a custom profile picture
            </p>
          </div>

          {loadingTeam ? (
            <div className="text-center py-24">
              <Loader2 className="w-10 h-10 text-tertiary animate-spin mx-auto mb-4" />
              <p className="font-body text-xs text-on-surface-variant uppercase tracking-widest font-light">
                Fetching team records...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {teamMembers.map((member) => {
                const isUpdatingThis = updatingTeamId === member.id;
                return (
                  <div
                    key={member.id}
                    className="group relative bg-surface-container/20 border border-white/5 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-end h-[420px]"
                  >
                    {/* Background member photo */}
                    <img
                      src={member.image}
                      alt={member.name}
                      className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-85 transition-all duration-500 group-hover:scale-102"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />

                    {/* Change Image Button Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]">
                      {isUpdatingThis ? (
                        <div className="text-center space-y-2">
                          <Loader2 className="w-8 h-8 text-tertiary animate-spin mx-auto" />
                          <span className="text-[10px] text-tertiary uppercase tracking-widest block font-body font-semibold px-4">
                            {updatingTeamStatus}
                          </span>
                        </div>
                      ) : (
                        <label className="bg-tertiary hover:scale-105 active:scale-95 text-[#0b0b0b] font-body text-[10px] font-bold py-3 px-6 rounded-full tracking-widest uppercase transition-all duration-300 cursor-pointer shadow-lg">
                          Change Photo
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleTeamPhotoChange(e, member.id)}
                          />
                        </label>
                      )}
                    </div>

                    {/* Team member text block */}
                    <div className="relative p-6 z-10 w-full">
                      <span className="text-[9px] bg-tertiary/15 text-tertiary border border-tertiary/20 uppercase font-semibold px-3 py-1 rounded-full font-body tracking-[0.15em]">
                        {member.role}
                      </span>
                      <h4 className="font-display text-xl font-bold text-white uppercase tracking-wide mt-3">
                        {member.name}
                      </h4>
                      <p className="font-body text-[11px] text-on-surface-variant/80 mt-2 font-light leading-relaxed line-clamp-3">
                        {member.bio}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
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

              <form onSubmit={handleSubmitForm} className="space-y-6">
                
                {/* Title */}
                {modalType === "film" && (
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
                )}

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
                        Video Source
                      </label>
                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => {
                            setVideoSourceType("link");
                            setSelectedVideoFile(null);
                          }}
                          disabled={isUploading}
                          className={`flex-1 py-2.5 text-[10px] uppercase tracking-wider font-semibold rounded-lg border transition-all duration-300 cursor-pointer ${
                            videoSourceType === "link"
                              ? "bg-tertiary text-background border-tertiary"
                              : "bg-transparent text-on-surface-variant border-white/10 hover:border-white/20"
                          }`}
                        >
                          Video Link URL
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setVideoSourceType("upload");
                            setItemVideoUrl("");
                          }}
                          disabled={isUploading}
                          className={`flex-1 py-2.5 text-[10px] uppercase tracking-wider font-semibold rounded-lg border transition-all duration-300 cursor-pointer ${
                            videoSourceType === "upload"
                              ? "bg-tertiary text-background border-tertiary"
                              : "bg-transparent text-on-surface-variant border-white/10 hover:border-white/20"
                          }`}
                        >
                          Upload Video File
                        </button>
                      </div>
                    </div>

                    {videoSourceType === "link" ? (
                      <div className="space-y-2">
                        <label className="font-body text-[10px] uppercase text-tertiary tracking-widest font-semibold block">
                          Video URL Link (Vimeo / YouTube / ImageKit URL)
                        </label>
                        <input
                          type="url"
                          required={videoSourceType === "link"}
                          value={itemVideoUrl}
                          onChange={(e) => setItemVideoUrl(e.target.value)}
                          disabled={isUploading}
                          placeholder="ENTER LINK URL"
                          className="w-full bg-transparent border-b border-outline-variant focus:border-tertiary py-3 text-sm text-on-surface placeholder:text-on-surface-variant/30 transition-colors outline-none font-light disabled:opacity-50"
                        />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="font-body text-[10px] uppercase text-tertiary tracking-widest font-semibold block">
                          Upload Video File (.mp4, .mov, etc.)
                        </label>
                        <label className="flex flex-col items-center justify-center border border-dashed border-white/10 hover:border-tertiary/50 rounded-xl p-6 cursor-pointer transition-all duration-300 bg-surface-container/20 group">
                          <Upload className="w-6 h-6 text-on-surface-variant/40 group-hover:text-tertiary mb-2 transition-colors" />
                          <span className="text-[10px] uppercase tracking-wider text-on-surface-variant group-hover:text-primary transition-colors text-center max-w-[250px] truncate">
                            {selectedVideoFile ? selectedVideoFile.name : "Select Video File"}
                          </span>
                          <input
                            type="file"
                            disabled={isUploading}
                            onChange={(e) => {
                              if (e.target.files && e.target.files.length > 0) {
                                setSelectedVideoFile(e.target.files[0]);
                              }
                            }}
                            className="hidden"
                            accept="video/*"
                          />
                        </label>
                      </div>
                    )}
                  </>
                )}

                {/* Selected Files Preview Grid */}
                {selectedFiles.length > 0 && !isUploading && (
                  <div className="space-y-2">
                    <label className="font-body text-[10px] uppercase text-tertiary tracking-widest font-semibold block">
                      Staged Photos Preview ({selectedFiles.length})
                    </label>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 bg-surface-container/20 border border-white/5 p-3 rounded-xl max-h-48 overflow-y-auto">
                      {selectedFiles.map((file, index) => {
                        const fileUrl = URL.createObjectURL(file);
                        return (
                          <div
                            key={index}
                            className="relative group aspect-square rounded-lg overflow-hidden border border-white/10"
                          >
                            <img
                              src={fileUrl}
                              alt=""
                              className="w-full h-full object-cover"
                              onLoad={() => URL.revokeObjectURL(fileUrl)}
                            />
                            {/* Remove button */}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
                              }}
                              className="absolute top-1 right-1 bg-black/75 hover:bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center transition-colors cursor-pointer border border-white/10"
                              title="Remove File"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* File Upload Area */}
                <div className="space-y-2">
                  <label className="font-body text-[10px] uppercase text-tertiary tracking-widest font-semibold block mb-2">
                    {modalType === "portfolio" ? "Photo File(s)" : "Cover Image File"}
                  </label>
                  <label className="flex flex-col items-center justify-center border border-dashed border-white/10 hover:border-tertiary/50 rounded-xl p-8 cursor-pointer transition-all duration-300 bg-surface-container/20 group">
                    <Upload className="w-8 h-8 text-on-surface-variant/40 group-hover:text-tertiary mb-3 transition-colors" />
                    <span className="text-xs uppercase tracking-wider text-on-surface-variant group-hover:text-primary transition-colors text-center max-w-[250px] truncate">
                      {selectedFiles.length > 0
                        ? selectedFiles.length === 1
                          ? selectedFiles[0].name
                          : `${selectedFiles.length} files selected`
                        : "Select or drag file(s)"}
                    </span>
                    <input 
                      type="file" 
                      disabled={isUploading}
                      multiple={modalType === "portfolio"}
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          const filesArray = Array.from(e.target.files);
                          setSelectedFiles(filesArray);
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
                    onClick={() => {
                      setIsModalOpen(false);
                      setSelectedFiles([]);
                    }}
                    className="flex-1 font-body text-xs uppercase tracking-widest text-on-surface-variant border border-white/10 hover:border-white/30 rounded py-3.5 transition-all duration-300 cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading || selectedFiles.length === 0}
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
                  <div className="space-y-3 bg-surface-container/10 border border-white/5 p-4 rounded-xl mt-4">
                    <p className="text-[10px] text-center text-tertiary uppercase tracking-widest font-semibold animate-pulse">
                      {uploadStatus}
                    </p>
                    <div className="space-y-2 max-h-36 overflow-y-auto scrollbar-none">
                      {selectedFiles.map((file, index) => {
                        const progress = uploadProgresses[file.name] || 0;
                        return (
                          <div key={index} className="space-y-1">
                            <div className="flex justify-between items-center text-[9px] font-body text-on-surface-variant uppercase tracking-widest">
                              <span className="truncate max-w-[70%]">{file.name}</span>
                              <span className="font-semibold text-tertiary">{progress}%</span>
                            </div>
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-tertiary transition-all duration-300"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* IMAGE CROPPER MODAL */}
      <AnimatePresence>
        {cropImageSrc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (cropCallback) cropCallback(null);
                setCropImageSrc(null);
              }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-panel w-full max-w-md p-6 rounded-2xl relative z-10 border border-white/10 shadow-2xl space-y-6 flex flex-col items-center"
            >
              <h3 className="font-display text-xl text-primary font-bold uppercase tracking-wider text-center w-full">
                Adjust Image Crop
              </h3>

              {/* Crop box container */}
              <div
                className="relative w-80 h-80 bg-black rounded-xl overflow-hidden cursor-move border border-white/10"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setIsDragStart(true);
                  setDragStartPos({ x: e.clientX - cropOffset.x, y: e.clientY - cropOffset.y });
                }}
                onMouseMove={(e) => {
                  if (!isDragStart) return;
                  setCropOffset({
                    x: e.clientX - dragStartPos.x,
                    y: e.clientY - dragStartPos.y
                  });
                }}
                onMouseUp={() => setIsDragStart(false)}
                onMouseLeave={() => setIsDragStart(false)}
                onTouchStart={(e) => {
                  if (e.touches.length === 1) {
                    setIsDragStart(true);
                    setDragStartPos({
                      x: e.touches[0].clientX - cropOffset.x,
                      y: e.touches[0].clientY - cropOffset.y
                    });
                  }
                }}
                onTouchMove={(e) => {
                  if (!isDragStart || e.touches.length !== 1) return;
                  setCropOffset({
                    x: e.touches[0].clientX - dragStartPos.x,
                    y: e.touches[0].clientY - dragStartPos.y
                  });
                }}
                onTouchEnd={() => setIsDragStart(false)}
              >
                {/* Square crop frame indicator */}
                <div className="absolute inset-0 border-2 border-tertiary/75 pointer-events-none z-10 rounded-xl" />

                {/* The image itself */}
                <img
                  src={cropImageSrc}
                  alt="Cropping Preview"
                  draggable={false}
                  className="max-w-none origin-center absolute select-none pointer-events-none"
                  style={{
                    transform: `translate(${cropOffset.x}px, ${cropOffset.y}px) scale(${cropZoom})`,
                    left: "50%",
                    top: "50%",
                    marginLeft: "-160px",
                    marginTop: "-160px",
                    width: "320px",
                    height: "320px",
                    objectFit: "contain"
                  }}
                />
              </div>

              {/* Zoom Slider */}
              <div className="w-full space-y-2">
                <div className="flex justify-between text-xs font-body text-on-surface-variant font-light uppercase tracking-widest">
                  <span>Zoom</span>
                  <span>{Math.round(cropZoom * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.01"
                  value={cropZoom}
                  onChange={(e) => setCropZoom(parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-tertiary"
                />
              </div>

              <div className="flex gap-4 w-full pt-2">
                <button
                  onClick={() => {
                    if (cropCallback) cropCallback(null);
                    setCropImageSrc(null);
                  }}
                  className="flex-1 font-body text-xs uppercase tracking-widest text-on-surface-variant border border-white/10 hover:border-white/30 rounded-lg py-3 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCropImage}
                  className="flex-1 bg-tertiary hover:bg-tertiary/95 text-background font-body text-xs font-bold uppercase tracking-widest rounded-lg py-3 transition-colors cursor-pointer shadow-lg shadow-tertiary/20"
                >
                  Crop Image
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* UPLOAD CONFIRMATION DIALOG */}
      <AnimatePresence>
        {confirmModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="glass-panel w-full max-w-sm p-6 rounded-xl relative z-10 border border-white/10 shadow-2xl text-center space-y-6"
            >
              <div className="w-12 h-12 rounded-full bg-tertiary/10 border border-tertiary/20 flex items-center justify-center mx-auto text-tertiary">
                <Upload className="w-5 h-5" />
              </div>
              
              <div className="space-y-2">
                <h4 className="font-display text-lg font-bold text-white uppercase tracking-wider">
                  Confirm Action
                </h4>
                <p className="font-body text-xs text-on-surface-variant leading-relaxed font-light">
                  {confirmMessage}
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setConfirmModalOpen(false)}
                  className="flex-1 font-body text-xs uppercase tracking-widest text-on-surface-variant border border-white/10 hover:border-white/30 rounded py-3 transition-all duration-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (onConfirmAction) onConfirmAction();
                  }}
                  className="flex-1 bg-tertiary hover:bg-tertiary/95 text-background font-body text-xs font-bold uppercase tracking-widest rounded py-3 transition-all duration-300 cursor-pointer shadow-lg shadow-tertiary/20"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TOAST NOTIFICATION BANNER */}
      <AnimatePresence>
        {toast.show && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center gap-3 bg-[#e6fcf5] border border-[#20c997]/25 text-[#099268] font-body text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow-lg"
            >
              <span className="w-5 h-5 rounded-full bg-[#20c997]/15 flex items-center justify-center text-[#20c997] font-semibold text-sm">
                ✓
              </span>
              <span>{toast.message}</span>
              <button
                type="button"
                onClick={() => setToast((prev) => ({ ...prev, show: false }))}
                className="ml-4 text-[#20c997] hover:text-[#099268] transition-colors p-1 hover:bg-[#20c997]/10 rounded-md cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
