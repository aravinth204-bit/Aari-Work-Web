"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

interface EnquiryRecord {
  id: number;
  name: string;
  mobile: string;
  workType: string;
  functionDate: string | null;
  budget: string | null;
  city: string | null;
  message: string | null;
  adminNotes?: string | null;
  status: string;
  createdAt: string;
}

interface GalleryItem {
  id: string;
  src: string;
  cat: string;
  title: string;
  desc?: string;
}

const statusOptions = [
  { key: "new", label: "🆕 New Lead", color: "bg-amber-100 text-amber-800 border-amber-300" },
  { key: "contacted", label: "📞 Contacted / Quoted", color: "bg-blue-100 text-blue-800 border-blue-300" },
  { key: "advance_paid", label: "📐 Advance Paid", color: "bg-purple-100 text-purple-800 border-purple-300" },
  { key: "in_progress", label: "🧵 In Frame (Work in Progress)", color: "bg-indigo-100 text-indigo-800 border-indigo-300" },
  { key: "fitting_fixed", label: "👗 Fitting Trial Fixed", color: "bg-pink-100 text-pink-800 border-pink-300" },
  { key: "completed", label: "✅ Delivered & Completed", color: "bg-emerald-100 text-emerald-800 border-emerald-300" },
];

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<"leads" | "gallery">("leads");

  // Enquiries state
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Notes Modal state
  const [activeNoteRecord, setActiveNoteRecord] = useState<EnquiryRecord | null>(null);
  const [tempNote, setTempNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  // Quick WhatsApp Status Modal
  const [quickMsgCustomer, setQuickMsgCustomer] = useState<{ record: EnquiryRecord; stage: string } | null>(null);

  // Gallery Management State
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [newImage, setNewImage] = useState({
    title: "",
    category: "Bridal Aari",
    imageUrl: "",
    description: "",
  });
  const [uploadingFile, setUploadingFile] = useState(false);
  const [addingImage, setAddingImage] = useState(false);
  const [galleryMsg, setGalleryMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("aari_admin_token");
    if (savedToken) {
      setToken(savedToken);
      fetchEnquiries(savedToken);
      fetchGallery();
    }
  }, []);

  async function fetchEnquiries(authToken: string) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/enquiry", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          setError("Invalid Admin Token. Please enter correct secret.");
          setIsLoggedIn(false);
        } else {
          setError("Failed to load records from server.");
        }
        setLoading(false);
        return;
      }

      const data = await res.json();
      setEnquiries(data.enquiries || []);
      setIsLoggedIn(true);
      localStorage.setItem("aari_admin_token", authToken);
    } catch {
      setError("Network error connecting to API.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchGallery() {
    try {
      const res = await fetch("/api/gallery");
      if (res.ok) {
        const data = await res.json();
        setGalleryItems(data.items || []);
      }
    } catch (err) {
      console.error("Fetch gallery error:", err);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!token.trim()) return;
    await fetchEnquiries(token.trim());
    fetchGallery();
  }

  function handleLogout() {
    localStorage.removeItem("aari_admin_token");
    setIsLoggedIn(false);
    setEnquiries([]);
    setToken("");
  }

  async function updateRecord(id: number, updates: { status?: string; adminNotes?: string }) {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/enquiry", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, ...updates }),
      });

      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
        );

        // If status changed, suggest sending WhatsApp status update to customer
        if (updates.status) {
          const rec = enquiries.find((e) => e.id === id);
          if (rec) {
            setQuickMsgCustomer({ record: { ...rec, ...updates }, stage: updates.status });
          }
        }
      }
    } catch (err) {
      console.error("Status update error", err);
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleSaveNote() {
    if (!activeNoteRecord) return;
    setSavingNote(true);
    await updateRecord(activeNoteRecord.id, { adminNotes: tempNote });
    setSavingNote(false);
    setActiveNoteRecord(null);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    setGalleryMsg("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setGalleryMsg(data.error || "File upload failed.");
      } else {
        setNewImage((prev) => ({
          ...prev,
          imageUrl: data.url,
          title: prev.title || file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
        }));
        setGalleryMsg("📸 Photo uploaded successfully! Now click 'Publish to Live Gallery'.");
      }
    } catch {
      setGalleryMsg("Network error during file upload.");
    } finally {
      setUploadingFile(false);
    }
  }

  async function handleAddGalleryItem(e: React.FormEvent) {
    e.preventDefault();
    setAddingImage(true);
    setGalleryMsg("");
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newImage),
      });

      const data = await res.json();
      if (!res.ok) {
        setGalleryMsg(data.error || "Failed to add photo.");
      } else {
        setGalleryMsg("✅ Photo published to live website successfully!");
        setNewImage({ title: "", category: "Bridal Aari", imageUrl: "", description: "" });
        if (fileInputRef.current) fileInputRef.current.value = "";
        fetchGallery();
      }
    } catch {
      setGalleryMsg("Network error adding photo.");
    } finally {
      setAddingImage(false);
    }
  }

  async function handleDeleteGalleryItem(id: string) {
    if (!confirm("Are you sure you want to remove this creation from the live gallery?")) return;
    try {
      const res = await fetch(`/api/gallery?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        setGalleryItems((prev) => prev.filter((i) => i.id !== id));
      }
    } catch (err) {
      console.error("Delete photo error:", err);
    }
  }

  function exportToCSV() {
    if (filteredEnquiries.length === 0) return;

    const headers = [
      "ID",
      "Customer Name",
      "Mobile",
      "Work Type",
      "Function Date",
      "Budget",
      "City",
      "Status",
      "Customer Message",
      "Atelier Notes",
      "Created At",
    ];

    const rows = filteredEnquiries.map((e) => [
      e.id,
      `"${(e.name || "").replace(/"/g, '""')}"`,
      `"${(e.mobile || "").replace(/"/g, '""')}"`,
      `"${(e.workType || "").replace(/"/g, '""')}"`,
      `"${(e.functionDate || "").replace(/"/g, '""')}"`,
      `"${(e.budget || "").replace(/"/g, '""')}"`,
      `"${(e.city || "").replace(/"/g, '""')}"`,
      `"${e.status}"`,
      `"${(e.message || "").replace(/"/g, '""').replace(/\n/g, " ")}"`,
      `"${(e.adminNotes || "").replace(/"/g, '""').replace(/\n/g, " ")}"`,
      `"${new Date(e.createdAt).toLocaleString("en-IN")}"`,
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const today = new Date().toISOString().slice(0, 10);
    link.setAttribute("href", url);
    link.setAttribute("download", `Tales_by_Threads_Leads_${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Days until function date calculation
  function getUrgencyBadge(dateStr: string | null) {
    if (!dateStr) return null;
    const target = new Date(dateStr);
    if (isNaN(target.getTime())) return null;

    const now = new Date();
    const diffDays = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return <span className="text-[10px] bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full font-medium">Function Over</span>;
    }
    if (diffDays <= 7) {
      return (
        <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold animate-pulse border border-red-300">
          ⚠️ Urgent ({diffDays}d left)
        </span>
      );
    }
    if (diffDays <= 15) {
      return (
        <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold border border-amber-300">
          ⏳ Upcoming ({diffDays}d)
        </span>
      );
    }
    return (
      <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
        📅 {diffDays} days left
      </span>
    );
  }

  const stats = useMemo(() => {
    const total = enquiries.length;
    const newLeads = enquiries.filter((e) => e.status === "new").length;
    const inWork = enquiries.filter((e) => ["advance_paid", "in_progress", "fitting_fixed"].includes(e.status)).length;
    const completed = enquiries.filter((e) => e.status === "completed").length;

    return { total, newLeads, inWork, completed };
  }, [enquiries]);

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesMobile = item.mobile.toLowerCase().includes(q);
        const matchesCity = item.city ? item.city.toLowerCase().includes(q) : false;
        const matchesWork = item.workType.toLowerCase().includes(q);
        const matchesNotes = item.adminNotes ? item.adminNotes.toLowerCase().includes(q) : false;
        return matchesName || matchesMobile || matchesCity || matchesWork || matchesNotes;
      }
      return true;
    });
  }, [enquiries, statusFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F8F3EC] text-[#3A2025]">
      {/* MotionSites Luxury Header */}
      <header className="bg-[#2A151A] text-white py-4 px-4 md:px-8 shadow-xl border-b border-[#D8C19A]/20 sticky top-0 z-30">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-serif-display text-xl md:text-2xl font-bold tracking-wide text-[#D8C19A]">
              {site.name}
            </span>
            <span className="text-[10px] bg-[#B08A57]/20 border border-[#D8C19A]/30 text-[#D8C19A] px-2.5 py-0.5 rounded-full uppercase tracking-widest font-semibold">
              Atelier OS
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-xs text-[#D8C19A] hover:text-white transition flex items-center gap-1 font-medium"
            >
              <span>View Website</span>
              <span aria-hidden="true">↗</span>
            </Link>
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="text-xs bg-white/10 hover:bg-white/20 border border-white/20 text-white px-3.5 py-1.5 rounded-full transition cursor-pointer"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-4 md:p-8">
        {!isLoggedIn ? (
          /* Login Screen with Liquid-Glass Finishing */
          <div className="max-w-md mx-auto mt-16 bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-[#D8C19A]/50 text-center relative overflow-hidden">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#6B2638]/10 text-[#6B2638] flex items-center justify-center ring-4 ring-[#D8C19A]/30 shadow-inner">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-serif text-[#6B2638] font-bold mb-2">
              Atelier Command Access
            </h1>
            <p className="text-xs text-[#3A2025]/70 mb-6">
              Enter your <code className="bg-[#F8F3EC] px-1.5 py-0.5 rounded text-[#6B2638] font-mono">ADMIN_TOKEN</code> password to unlock the studio dashboard.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                placeholder="Enter password..."
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-[#D8C19A] focus:border-[#6B2638] focus:ring-2 focus:ring-[#B08A57]/30 outline-none text-sm text-center tracking-widest"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full bg-[#6B2638] hover:bg-[#541D2B] text-white font-semibold text-sm transition shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-60 cursor-pointer"
              >
                {loading ? "Authenticating..." : "Unlock Atelier Dashboard"}
              </button>
            </form>

            {error && (
              <p className="mt-4 text-xs text-red-700 bg-red-50 p-3 rounded-xl border border-red-200">
                {error}
              </p>
            )}
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="space-y-6">
            {/* Top Navigation Tabs: Orders vs Gallery */}
            <div className="flex items-center gap-3 border-b border-[#D8C19A]/40 pb-3">
              <button
                type="button"
                onClick={() => setActiveTab("leads")}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === "leads"
                    ? "bg-[#6B2638] text-white shadow-md scale-102"
                    : "bg-white text-[#3A2025]/70 hover:bg-[#D8C19A]/20"
                }`}
              >
                <span>🧵 Bridal Orders &amp; Leads</span>
                <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-[10px]">
                  {enquiries.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("gallery")}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === "gallery"
                    ? "bg-[#6B2638] text-white shadow-md scale-102"
                    : "bg-white text-[#3A2025]/70 hover:bg-[#D8C19A]/20"
                }`}
              >
                <span>🖼️ Live Gallery Studio</span>
                <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-[10px]">
                  {galleryItems.length}
                </span>
              </button>
            </div>

            {activeTab === "leads" ? (
              /* --- TAB 1: BRIDAL ORDERS & PIPELINE --- */
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-serif text-[#6B2638] font-bold">
                      Bridal Order Lifecycle Pipeline
                    </h1>
                    <p className="text-xs text-[#3A2025]/70 mt-1">
                      Track design lifecycle, measurements, muhurtham deadlines, and client notes
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      onClick={exportToCSV}
                      disabled={filteredEnquiries.length === 0}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-emerald-600 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold shadow-xs transition active:scale-95 disabled:opacity-50 cursor-pointer"
                      title="Download customer leads as Excel CSV file"
                    >
                      <span>📥 Export to CSV</span>
                    </button>

                    <button
                      onClick={() => fetchEnquiries(token)}
                      disabled={loading}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-[#B08A57] bg-white text-xs font-semibold text-[#6B2638] hover:bg-[#B08A57]/10 transition shadow-xs active:scale-95 cursor-pointer"
                    >
                      <span>{loading ? "Refreshing..." : "↻ Refresh"}</span>
                    </button>
                  </div>
                </div>

                {/* MotionSites Liquid-Glass KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
                  <div className="bg-white p-5 rounded-3xl border border-[#D8C19A]/50 shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between text-xs text-[#3A2025]/70">
                      <span className="font-medium">Total Inquiries</span>
                      <span className="p-1.5 rounded-full bg-[#B08A57]/10 text-[#B08A57]">📊</span>
                    </div>
                    <div className="mt-2.5 text-2xl md:text-3xl font-serif font-bold text-[#3A2025]">
                      {stats.total}
                    </div>
                    <div className="mt-1 text-[11px] text-[#3A2025]/60">All recorded customers</div>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-amber-200 bg-gradient-to-br from-white to-amber-50/30 shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between text-xs text-amber-800 font-medium">
                      <span>New Leads</span>
                      <span className="p-1.5 rounded-full bg-amber-100 text-amber-700">🆕</span>
                    </div>
                    <div className="mt-2.5 text-2xl md:text-3xl font-serif font-bold text-amber-700">
                      {stats.newLeads}
                    </div>
                    <div className="mt-1 text-[11px] text-amber-700/80">Pending call / quote</div>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-indigo-200 bg-gradient-to-br from-white to-indigo-50/30 shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between text-xs text-indigo-800 font-medium">
                      <span>In Production</span>
                      <span className="p-1.5 rounded-full bg-indigo-100 text-indigo-700">🧵</span>
                    </div>
                    <div className="mt-2.5 text-2xl md:text-3xl font-serif font-bold text-indigo-700">
                      {stats.inWork}
                    </div>
                    <div className="mt-1 text-[11px] text-indigo-700/80">Frame / Stitching / Trial</div>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-emerald-200 bg-gradient-to-br from-white to-emerald-50/30 shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between text-xs text-emerald-800 font-medium">
                      <span>Delivered</span>
                      <span className="p-1.5 rounded-full bg-emerald-100 text-emerald-700">✅</span>
                    </div>
                    <div className="mt-2.5 text-2xl md:text-3xl font-serif font-bold text-emerald-700">
                      {stats.completed}
                    </div>
                    <div className="mt-1 text-[11px] text-emerald-700/80">Fulfilled &amp; completed</div>
                  </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white p-4 md:p-5 rounded-3xl border border-[#D8C19A]/50 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                  <div className="relative flex-1">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#3A2025]/40">
                      🔍
                    </span>
                    <input
                      type="text"
                      placeholder="Search bride name, mobile, city, work type, or notes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-8 py-2.5 rounded-2xl border border-[#D8C19A]/60 text-xs md:text-sm outline-none focus:border-[#6B2638] focus:ring-2 focus:ring-[#B08A57]/20"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs font-medium">
                    {[
                      { key: "all", label: "All" },
                      { key: "new", label: "New Leads" },
                      { key: "contacted", label: "Contacted" },
                      { key: "advance_paid", label: "Advance Paid" },
                      { key: "in_progress", label: "In Frame" },
                      { key: "fitting_fixed", label: "Trial Fixed" },
                      { key: "completed", label: "Delivered" },
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setStatusFilter(tab.key)}
                        className={`px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap cursor-pointer ${
                          statusFilter === tab.key
                            ? "bg-[#6B2638] text-white font-semibold shadow-xs"
                            : "bg-[#F8F3EC] text-[#3A2025]/80 hover:bg-[#D8C19A]/30"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredEnquiries.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-3xl border border-[#D8C19A]/40 shadow-xs">
                    <p className="text-lg font-serif text-[#6B2638]">No matching orders found</p>
                    <p className="text-xs text-[#3A2025]/60 mt-1">
                      Try adjusting your search query or pipeline filter.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Mobile Card Dossier View */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                      {filteredEnquiries.map((item) => {
                        const cleanPhone = item.mobile.replace(/[^0-9]/g, "");
                        const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                          `வணக்கம் ${item.name}, Tales by Threads-ல் நீங்கள் கேட்ட ${item.workType} வடிவமைப்பு குறித்து பேசுகிறோம்.`
                        )}`;

                        return (
                          <div
                            key={item.id}
                            className="bg-white p-5 rounded-3xl border border-[#D8C19A]/60 shadow-sm space-y-3.5"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="font-semibold text-base text-[#3A2025]">{item.name}</h3>
                                <div className="text-xs text-[#6B2638] font-medium mt-0.5">{item.workType}</div>
                              </div>
                              <select
                                value={item.status}
                                disabled={updatingId === item.id}
                                onChange={(e) => updateRecord(item.id, { status: e.target.value })}
                                className="text-xs font-semibold px-3 py-1.5 rounded-full border border-[#D8C19A] bg-[#F8F3EC] text-[#3A2025] outline-none cursor-pointer"
                              >
                                {statusOptions.map((opt) => (
                                  <option key={opt.key} value={opt.key}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs bg-[#F8F3EC]/70 p-3 rounded-2xl border border-[#D8C19A]/30">
                              <div>
                                <span className="text-[#3A2025]/60 block text-[10px] uppercase font-medium">Function Date</span>
                                <div className="mt-0.5 flex flex-wrap items-center gap-1">
                                  <span className="font-medium text-[#3A2025]">{item.functionDate || "Not decided"}</span>
                                  {getUrgencyBadge(item.functionDate)}
                                </div>
                              </div>
                              <div>
                                <span className="text-[#3A2025]/60 block text-[10px] uppercase font-medium">Budget</span>
                                <span className="font-semibold text-[#B08A57] mt-0.5 block">{item.budget || "Not decided"}</span>
                              </div>
                              {item.city && (
                                <div className="col-span-2 pt-1.5 border-t border-[#D8C19A]/20">
                                  <span className="text-[#3A2025]/60 text-[10px] uppercase font-medium">Location: </span>
                                  <span className="font-medium text-[#3A2025]">{item.city}</span>
                                </div>
                              )}
                            </div>

                            {item.message && (
                              <p className="text-xs text-[#541D2B]/85 italic bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                                &ldquo;{item.message}&rdquo;
                              </p>
                            )}

                            {/* Internal Atelier Notes */}
                            <div>
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveNoteRecord(item);
                                  setTempNote(item.adminNotes || "");
                                }}
                                className="w-full text-left text-xs p-2.5 rounded-xl border border-dashed border-[#B08A57]/60 bg-[#F8F3EC]/40 hover:bg-[#F8F3EC] transition flex items-center justify-between cursor-pointer"
                              >
                                <span className="text-[#3A2025]/80 truncate">
                                  📝 {item.adminNotes ? item.adminNotes : "Click to add measurements / notes..."}
                                </span>
                                <span className="text-[#B08A57] text-[10px] font-semibold uppercase shrink-0 ml-2">Edit</span>
                              </button>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-1 flex items-center gap-2">
                              <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 py-2.5 px-4 rounded-xl bg-[#0F7A6C] active:bg-[#0B665C] text-white text-xs font-semibold text-center flex items-center justify-center gap-2 shadow-xs"
                              >
                                <span>WhatsApp Chat</span>
                              </a>
                              <a
                                href={`tel:${item.mobile}`}
                                className="py-2.5 px-4 rounded-xl border border-[#6B2638] text-[#6B2638] active:bg-[#6B2638]/10 text-xs font-semibold text-center flex items-center justify-center gap-1.5"
                              >
                                <span>📞 Call</span>
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto rounded-3xl border border-[#D8C19A]/50 bg-white shadow-sm">
                      <table className="w-full text-left text-sm border-collapse">
                        <thead>
                          <tr className="border-b border-[#D8C19A]/30 bg-[#F8F3EC]/80 text-xs uppercase tracking-wider text-[#3A2025]/70">
                            <th className="py-4 px-5">Customer Details</th>
                            <th className="py-4 px-5">Work Type</th>
                            <th className="py-4 px-5">Muhurtham Date</th>
                            <th className="py-4 px-5">Budget</th>
                            <th className="py-4 px-5">Pipeline Stage</th>
                            <th className="py-4 px-5">Atelier Notes</th>
                            <th className="py-4 px-5 text-right">Quick Contact</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#D8C19A]/20">
                          {filteredEnquiries.map((item) => {
                            const cleanPhone = item.mobile.replace(/[^0-9]/g, "");
                            const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                              `வணக்கம் ${item.name}, Tales by Threads-ல் நீங்கள் கேட்ட ${item.workType} வடிவமைப்பு குறித்து பேசுகிறோம்.`
                            )}`;

                            return (
                              <tr key={item.id} className="hover:bg-[#F8F3EC]/30 transition-colors">
                                <td className="py-4 px-5">
                                  <div className="font-semibold text-[#3A2025]">{item.name}</div>
                                  <div className="text-xs text-[#3A2025]/60 mt-0.5">{item.mobile}</div>
                                  {item.city && (
                                    <span className="text-[11px] text-[#B08A57] font-medium block mt-0.5">
                                      📍 {item.city}
                                    </span>
                                  )}
                                  {item.message && (
                                    <p className="text-xs text-[#541D2B]/80 mt-1 italic max-w-xs truncate" title={item.message}>
                                      &ldquo;{item.message}&rdquo;
                                    </p>
                                  )}
                                </td>
                                <td className="py-4 px-5 font-medium text-[#6B2638]">{item.workType}</td>
                                <td className="py-4 px-5 text-xs text-[#3A2025]/80 whitespace-nowrap">
                                  <div>{item.functionDate || "—"}</div>
                                  <div className="mt-1">{getUrgencyBadge(item.functionDate)}</div>
                                </td>
                                <td className="py-4 px-5 text-xs font-semibold text-[#B08A57] whitespace-nowrap">
                                  {item.budget || "—"}
                                </td>
                                <td className="py-4 px-5">
                                  <select
                                    value={item.status}
                                    disabled={updatingId === item.id}
                                    onChange={(e) => updateRecord(item.id, { status: e.target.value })}
                                    className="text-xs font-semibold px-3 py-1.5 rounded-full border border-[#D8C19A] bg-[#F8F3EC] text-[#3A2025] outline-none cursor-pointer focus:border-[#6B2638]"
                                  >
                                    {statusOptions.map((opt) => (
                                      <option key={opt.key} value={opt.key}>
                                        {opt.label}
                                      </option>
                                    ))}
                                  </select>
                                </td>
                                <td className="py-4 px-5">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setActiveNoteRecord(item);
                                      setTempNote(item.adminNotes || "");
                                    }}
                                    className="text-left text-xs max-w-xs truncate block text-[#3A2025]/80 hover:text-[#6B2638] transition cursor-pointer"
                                    title="Click to view/edit notes"
                                  >
                                    {item.adminNotes ? (
                                      <span className="bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 block truncate">
                                        📝 {item.adminNotes}
                                      </span>
                                    ) : (
                                      <span className="text-gray-400 italic hover:underline">
                                        + Add measurements...
                                      </span>
                                    )}
                                  </button>
                                </td>
                                <td className="py-4 px-5 text-right whitespace-nowrap">
                                  <div className="flex items-center justify-end gap-2">
                                    <a
                                      href={`tel:${item.mobile}`}
                                      className="inline-flex items-center px-3 py-1.5 rounded-full border border-[#6B2638] text-[#6B2638] hover:bg-[#6B2638]/10 text-xs font-medium transition"
                                      title="Call customer"
                                    >
                                      📞 Call
                                    </a>
                                    <a
                                      href={whatsappUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-[#0F7A6C] hover:bg-[#0B665C] text-white text-xs font-medium transition shadow-xs"
                                    >
                                      <span>WhatsApp</span>
                                    </a>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* --- TAB 2: LIVE GALLERY MANAGER (WITH DIRECT FILE UPLOAD) --- */
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-serif text-[#6B2638] font-bold">
                    Studio Gallery Manager
                  </h1>
                  <p className="text-xs text-[#3A2025]/70 mt-1">
                    Upload blouse photos directly from your phone/laptop to display on the live website
                  </p>
                </div>

                {/* Add Photo Form with Liquid Glass Style */}
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#D8C19A]/50 shadow-sm">
                  <h2 className="text-base font-serif font-bold text-[#6B2638] mb-4">
                    + Upload &amp; Publish New Blouse Creation
                  </h2>
                  <form onSubmit={handleAddGalleryItem} className="space-y-5">
                    {/* Direct File Upload Area */}
                    <div className="p-5 rounded-3xl border-2 border-dashed border-[#B08A57]/50 bg-[#F8F3EC]/60 text-center space-y-2 hover:bg-[#F8F3EC] transition">
                      <div className="w-12 h-12 mx-auto rounded-full bg-[#B08A57]/15 text-[#B08A57] flex items-center justify-center shadow-inner">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-xs font-semibold text-[#3A2025]">
                        Mobile அல்லது Laptop-ல் இருந்து போட்டோவை தேர்ந்தெடுக்கவும்
                      </p>
                      <p className="text-[11px] text-[#3A2025]/60">
                        Supports JPEG, PNG, WebP (Max 10MB)
                      </p>
                      <div className="pt-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          disabled={uploadingFile}
                          className="text-xs text-slate-500 file:mr-3 file:py-2.5 file:px-5 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#6B2638] file:text-white hover:file:bg-[#541D2B] cursor-pointer"
                        />
                      </div>
                      {uploadingFile && (
                        <p className="text-xs text-amber-700 animate-pulse font-medium">
                          ⏳ Uploading photo from device, please wait...
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-medium text-[#3A2025]/80 block mb-1">Creation Title *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Royal Peacock Zardosi Blouse"
                          value={newImage.title}
                          onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-2xl border border-[#D8C19A] text-xs md:text-sm outline-none focus:border-[#6B2638]"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-[#3A2025]/80 block mb-1">Category *</label>
                        <select
                          value={newImage.category}
                          onChange={(e) => setNewImage({ ...newImage, category: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-2xl border border-[#D8C19A] bg-[#F8F3EC] text-xs md:text-sm outline-none focus:border-[#6B2638]"
                        >
                          <option value="Bridal Aari">Bridal Aari</option>
                          <option value="Maggam Work">Maggam Work</option>
                          <option value="Zardosi">Zardosi</option>
                          <option value="Party Wear">Party Wear</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-[#3A2025]/80 block mb-1">
                          Image Path / URL *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="/uploads/... (or select file above)"
                          value={newImage.imageUrl}
                          onChange={(e) => setNewImage({ ...newImage, imageUrl: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-2xl border border-[#D8C19A] text-xs md:text-sm outline-none focus:border-[#6B2638]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-[#3A2025]/80 block mb-1">Description (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. Handcrafted antique gold bead and kundan stones on pure silk."
                        value={newImage.description}
                        onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-2xl border border-[#D8C19A] text-xs md:text-sm outline-none focus:border-[#6B2638]"
                      />
                    </div>

                    {galleryMsg && (
                      <p
                        className={`text-xs p-3 rounded-2xl border font-medium ${
                          galleryMsg.includes("✅") || galleryMsg.includes("📸")
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : "bg-red-50 text-red-800 border-red-200"
                        }`}
                      >
                        {galleryMsg}
                      </p>
                    )}

                    <div className="text-right">
                      <button
                        type="submit"
                        disabled={addingImage || uploadingFile || !newImage.imageUrl}
                        className="px-6 py-2.5 rounded-full bg-[#6B2638] hover:bg-[#541D2B] text-white text-xs font-semibold shadow-md active:scale-95 disabled:opacity-50 transition cursor-pointer"
                      >
                        {addingImage ? "Publishing..." : "Publish to Live Gallery"}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Current Gallery Grid Preview */}
                <div className="space-y-4">
                  <h2 className="text-base font-serif font-bold text-[#6B2638]">
                    Live Gallery Showcase ({galleryItems.length} photos)
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {galleryItems.map((item) => (
                      <div
                        key={item.id}
                        className="group relative bg-white rounded-3xl overflow-hidden border border-[#D8C19A]/50 shadow-xs hover:shadow-md transition"
                      >
                        <div className="relative aspect-[3/4] w-full bg-slate-100">
                          <Image
                            src={item.src}
                            alt={item.title}
                            fill
                            sizes="200px"
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteGalleryItem(item.id)}
                            className="absolute top-2 right-2 bg-red-600/90 hover:bg-red-700 text-white p-1.5 rounded-full shadow-md transition opacity-0 group-hover:opacity-100 cursor-pointer"
                            title="Delete this photo"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                          <span className="absolute bottom-2 left-2 bg-[#2A151A]/80 backdrop-blur-md text-[#D8C19A] text-[10px] px-2 py-0.5 rounded-full font-medium">
                            {item.cat}
                          </span>
                        </div>
                        <div className="p-3">
                          <h3 className="text-xs font-semibold text-[#3A2025] truncate">{item.title}</h3>
                          {item.desc && (
                            <p className="text-[11px] text-[#3A2025]/60 truncate mt-0.5">{item.desc}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Internal Notes & Measurements Modal */}
      {activeNoteRecord && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 md:p-8 shadow-2xl border border-[#D8C19A]/50 space-y-4">
            <div className="flex items-center justify-between border-b border-[#D8C19A]/30 pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#6B2638]">
                  Atelier Notes &amp; Measurements
                </h3>
                <p className="text-xs text-[#3A2025]/70">
                  Client: <strong className="text-[#3A2025]">{activeNoteRecord.name}</strong> ({activeNoteRecord.mobile})
                </p>
              </div>
              <button
                onClick={() => setActiveNoteRecord(null)}
                className="text-gray-400 hover:text-gray-600 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#3A2025] block mb-1.5">
                Internal Studio Details (Measurements, Neck Depth, Thread Colors, Special Requests):
              </label>
              <textarea
                rows={5}
                value={tempNote}
                onChange={(e) => setTempNote(e.target.value)}
                placeholder="e.g. Blouse size: 36, Neck depth: 8 front / 10 back. Customer wants peacock motif with antique gold beads. Advance ₹2000 paid via GPay."
                className="w-full p-3 rounded-2xl border border-[#D8C19A] text-xs md:text-sm outline-none focus:border-[#6B2638] focus:ring-2 focus:ring-[#B08A57]/20"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveNoteRecord(null)}
                className="px-4 py-2 rounded-full border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNote}
                disabled={savingNote}
                className="px-6 py-2 rounded-full bg-[#6B2638] hover:bg-[#541D2B] text-white text-xs font-semibold shadow-md transition disabled:opacity-60 cursor-pointer"
              >
                {savingNote ? "Saving..." : "Save Notes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Status WhatsApp Notification Suggestion Modal */}
      {quickMsgCustomer && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border border-[#D8C19A]/50 space-y-4 animate-fadeIn">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💬</span>
              <div>
                <h3 className="font-serif text-base font-bold text-[#6B2638]">
                  Send Status Update to {quickMsgCustomer.record.name}?
                </h3>
                <p className="text-[11px] text-[#3A2025]/70">
                  Status changed to: <strong>{quickMsgCustomer.stage}</strong>
                </p>
              </div>
            </div>

            <div className="bg-[#F8F3EC] p-3 rounded-2xl text-xs text-[#3A2025]/85 border border-[#D8C19A]/40 leading-relaxed italic">
              {quickMsgCustomer.stage === "advance_paid" &&
                `"வணக்கம் ${quickMsgCustomer.record.name}! உங்கள் ஆரி பிளவுஸிற்கான அட்வான்ஸ் தொகை பெறப்பட்டது. மரச்சட்டத்தில் வேலை துவங்குகிறது. நன்றி! - Tales by Threads"`}
              {quickMsgCustomer.stage === "in_progress" &&
                `"வணக்கம் ${quickMsgCustomer.record.name}! உங்கள் பிளவுஸ் தையல் வேலை விறுவிறுப்பாக நடந்து கொண்டிருக்கிறது. விரைவில் Trial தேதி தெரிவிக்கிறோம். - Tales by Threads"`}
              {quickMsgCustomer.stage === "fitting_fixed" &&
                `"வணக்கம் ${quickMsgCustomer.record.name}! உங்கள் பிளவுஸ் தையல் முடிந்து தயார் நிலையில் உள்ளது. நீங்கள் Studio-க்கு வந்து Trial பார்த்துக்கொள்ளலாம். - Tales by Threads"`}
              {quickMsgCustomer.stage === "completed" &&
                `"வணக்கம் ${quickMsgCustomer.record.name}! உங்கள் பிளவுஸ் வெற்றிகரமாக டெலிவரி செய்யப்பட்டது. உங்கள் இல்லத் திருமணத்திற்கு எங்களது மனமார்ந்த வாழ்த்துகள்! - Tales by Threads"`}
              {!["advance_paid", "in_progress", "fitting_fixed", "completed"].includes(quickMsgCustomer.stage) &&
                `"வணக்கம் ${quickMsgCustomer.record.name}! Tales by Threads-ல் உங்கள் ஆரி பிளவுஸ் ஸ்டேட்டஸ் புதுப்பிக்கப்பட்டுள்ளது."`}
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setQuickMsgCustomer(null)}
                className="px-4 py-2 rounded-full border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
              >
                Skip
              </button>
              <a
                href={`https://wa.me/${quickMsgCustomer.record.mobile.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                  quickMsgCustomer.stage === "advance_paid"
                    ? `வணக்கம் ${quickMsgCustomer.record.name}! உங்கள் ஆரி பிளவுஸிற்கான அட்வான்ஸ் தொகை பெறப்பட்டது. மரச்சட்டத்தில் வேலை துவங்குகிறது. நன்றி! - Tales by Threads`
                    : quickMsgCustomer.stage === "in_progress"
                    ? `வணக்கம் ${quickMsgCustomer.record.name}! உங்கள் பிளவுஸ் தையல் வேலை விறுவிறுப்பாக நடந்து கொண்டிருக்கிறது. விரைவில் Trial தேதி தெரிவிக்கிறோம். - Tales by Threads`
                    : quickMsgCustomer.stage === "fitting_fixed"
                    ? `வணக்கம் ${quickMsgCustomer.record.name}! உங்கள் பிளவுஸ் தையல் முடிந்து தயார் நிலையில் உள்ளது. நீங்கள் Studio-க்கு வந்து Trial பார்த்துக்கொள்ளலாம். - Tales by Threads`
                    : quickMsgCustomer.stage === "completed"
                    ? `வணக்கம் ${quickMsgCustomer.record.name}! உங்கள் பிளவுஸ் வெற்றிகரமாக டெலிவரி செய்யப்பட்டது. உங்கள் இல்லத் திருமணத்திற்கு எங்களது மனமார்ந்த வாழ்த்துகள்! - Tales by Threads`
                    : `வணக்கம் ${quickMsgCustomer.record.name}! Tales by Threads-ல் உங்கள் ஆரி பிளவுஸ் ஸ்டேட்டஸ் புதுப்பிக்கப்பட்டுள்ளது.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setQuickMsgCustomer(null)}
                className="px-5 py-2 rounded-full bg-[#0F7A6C] hover:bg-[#0B665C] text-white text-xs font-semibold shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>Send WhatsApp</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
