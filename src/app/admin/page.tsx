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
  { key: "new", label: "🆕 New Lead" },
  { key: "contacted", label: "📞 Contacted / Quoted" },
  { key: "advance_paid", label: "📐 Advance Paid / Measurements" },
  { key: "in_progress", label: "🧵 In Frame (Work in Progress)" },
  { key: "fitting_fixed", label: "👗 Fitting Trial Fixed" },
  { key: "completed", label: "✅ Delivered & Completed" },
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
          setError("Invalid Admin Token. Please enter correct password.");
          setIsLoggedIn(false);
        } else {
          setError("Failed to load records.");
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
      }
    } catch (err) {
      console.error("Status update error", err);
    } finally {
      setUpdatingId(null);
    }
  }

  async function saveNotes() {
    if (!activeNoteRecord) return;
    setSavingNote(true);
    await updateRecord(activeNoteRecord.id, { adminNotes: tempNote });
    setActiveNoteRecord(null);
    setSavingNote(false);
  }

  // Handle direct file upload from Laptop / Mobile
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setUploadingFile(true);
    setGalleryMsg("");

    try {
      const formData = new FormData();
      formData.append("file", file);

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
          imageUrl: data.imageUrl,
          title: prev.title || file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " "),
        }));
        setGalleryMsg("📸 Photo uploaded successfully! Now click 'Publish to Gallery'.");
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
        setGalleryMsg("✅ Photo published to gallery successfully!");
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
    if (!confirm("Are you sure you want to remove this photo from the gallery?")) return;
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
      {/* Header */}
      <header className="bg-[#3A2025] text-white py-4 px-4 md:px-8 shadow-sm border-b border-[#D8C19A]/20 sticky top-0 z-30">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-serif-display text-xl font-bold tracking-wide text-[#D8C19A]">
              {site.name}
            </span>
            <span className="text-xs bg-[#B08A57]/30 text-[#D8C19A] px-2.5 py-0.5 rounded-full uppercase tracking-wider font-semibold">
              Atelier Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs text-[#D8C19A] hover:underline hidden sm:inline">
              ← View Website
            </Link>
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full transition cursor-pointer"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-4 md:p-8">
        {!isLoggedIn ? (
          /* Login Form */
          <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-3xl shadow-lg border border-[#D8C19A]/40 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#6B2638]/10 text-[#6B2638] flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-serif text-[#6B2638] font-bold mb-2">
              Admin Access
            </h1>
            <p className="text-sm text-[#3A2025]/70 mb-6">
              Enter the <code className="bg-[#F8F3EC] px-1 rounded">ADMIN_TOKEN</code> secret to manage bridal customer leads and gallery.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                placeholder="Enter ADMIN_TOKEN..."
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#D8C19A] focus:border-[#6B2638] focus:ring-2 focus:ring-[#B08A57]/20 outline-none text-sm text-center"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full bg-[#6B2638] hover:bg-[#541D2B] text-white font-medium text-sm transition shadow-md disabled:opacity-60 cursor-pointer"
              >
                {loading ? "Authenticating..." : "Unlock Dashboard"}
              </button>
            </form>

            {error && (
              <p className="mt-4 text-xs text-red-700 bg-red-50 p-2.5 rounded-xl border border-red-200">
                {error}
              </p>
            )}
          </div>
        ) : (
          /* Dashboard */
          <div className="space-y-6">
            {/* Top Navigation Tabs: Orders vs Gallery */}
            <div className="flex items-center gap-3 border-b border-[#D8C19A]/40 pb-3">
              <button
                type="button"
                onClick={() => setActiveTab("leads")}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                  activeTab === "leads"
                    ? "bg-[#6B2638] text-white shadow-xs"
                    : "bg-white text-[#3A2025]/70 hover:bg-[#D8C19A]/20"
                }`}
              >
                🧵 Orders &amp; Leads ({enquiries.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("gallery")}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                  activeTab === "gallery"
                    ? "bg-[#6B2638] text-white shadow-xs"
                    : "bg-white text-[#3A2025]/70 hover:bg-[#D8C19A]/20"
                }`}
              >
                🖼️ Gallery Manager ({galleryItems.length})
              </button>
            </div>

            {activeTab === "leads" ? (
              /* --- TAB 1: ORDERS & LEADS --- */
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-serif text-[#6B2638] font-bold">
                      Bridal Atelier Order Pipeline
                    </h1>
                    <p className="text-xs text-[#3A2025]/70 mt-1">
                      Track design lifecycle, measurements, wedding deadlines, and client notes
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      onClick={exportToCSV}
                      disabled={filteredEnquiries.length === 0}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-emerald-600 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold shadow-xs transition disabled:opacity-50 cursor-pointer"
                      title="Download customer leads as Excel CSV file"
                    >
                      <span>📥 Export to CSV</span>
                    </button>

                    <button
                      onClick={() => fetchEnquiries(token)}
                      disabled={loading}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#B08A57] bg-white text-xs font-semibold text-[#6B2638] hover:bg-[#B08A57]/10 transition shadow-xs cursor-pointer"
                    >
                      <span>{loading ? "Refreshing..." : "↻ Refresh"}</span>
                    </button>
                  </div>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                  <div className="bg-white p-4 md:p-5 rounded-2xl border border-[#D8C19A]/40 shadow-xs">
                    <div className="flex items-center justify-between text-xs text-[#3A2025]/70">
                      <span>Total Enquiries</span>
                      <span className="p-1 rounded bg-[#B08A57]/10 text-[#B08A57]">📊</span>
                    </div>
                    <div className="mt-2 text-2xl md:text-3xl font-serif font-bold text-[#3A2025]">
                      {stats.total}
                    </div>
                    <div className="mt-1 text-[11px] text-[#3A2025]/60">All customer inquiries</div>
                  </div>

                  <div className="bg-white p-4 md:p-5 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-xs">
                    <div className="flex items-center justify-between text-xs text-amber-800 font-medium">
                      <span>New Leads</span>
                      <span className="p-1 rounded bg-amber-100 text-amber-700">🆕</span>
                    </div>
                    <div className="mt-2 text-2xl md:text-3xl font-serif font-bold text-amber-700">
                      {stats.newLeads}
                    </div>
                    <div className="mt-1 text-[11px] text-amber-700/80">Pending quote / call</div>
                  </div>

                  <div className="bg-white p-4 md:p-5 rounded-2xl border border-indigo-200 bg-indigo-50/20 shadow-xs">
                    <div className="flex items-center justify-between text-xs text-indigo-800 font-medium">
                      <span>In Production</span>
                      <span className="p-1 rounded bg-indigo-100 text-indigo-700">🧵</span>
                    </div>
                    <div className="mt-2 text-2xl md:text-3xl font-serif font-bold text-indigo-700">
                      {stats.inWork}
                    </div>
                    <div className="mt-1 text-[11px] text-indigo-700/80">Advance paid / In frame / Trial</div>
                  </div>

                  <div className="bg-white p-4 md:p-5 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
                    <div className="flex items-center justify-between text-xs text-emerald-800 font-medium">
                      <span>Delivered</span>
                      <span className="p-1 rounded bg-emerald-100 text-emerald-700">✅</span>
                    </div>
                    <div className="mt-2 text-2xl md:text-3xl font-serif font-bold text-emerald-700">
                      {stats.completed}
                    </div>
                    <div className="mt-1 text-[11px] text-emerald-700/80">Fulfilled &amp; delivered</div>
                  </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white p-4 rounded-2xl border border-[#D8C19A]/40 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#3A2025]/40">
                      🔍
                    </span>
                    <input
                      type="text"
                      placeholder="Search bride name, mobile, city, work, or notes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#D8C19A]/60 text-xs md:text-sm outline-none focus:border-[#6B2638] focus:ring-1 focus:ring-[#6B2638]"
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
                        className={`px-3 py-1.5 rounded-full transition-all whitespace-nowrap cursor-pointer ${
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
                  <div className="text-center py-16 bg-white rounded-3xl border border-[#D8C19A]/40">
                    <p className="text-lg font-serif text-[#6B2638]">No matching orders found</p>
                    <p className="text-xs text-[#3A2025]/60 mt-1">
                      Try adjusting your search terms or filter selections.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Mobile Card View */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                      {filteredEnquiries.map((item) => {
                        const cleanPhone = item.mobile.replace(/[^0-9]/g, "");
                        const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                          `வணக்கம் ${item.name}, Tales by Threads-ல் நீங்கள் கேட்ட ${item.workType} வடிவமைப்பு குறித்து பேசுகிறோம்.`
                        )}`;

                        return (
                          <div
                            key={item.id}
                            className="bg-white p-5 rounded-2xl border border-[#D8C19A]/50 shadow-xs space-y-3"
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
                                className="text-xs font-semibold px-2.5 py-1 rounded-full border border-[#D8C19A] bg-[#F8F3EC] text-[#3A2025] outline-none cursor-pointer"
                              >
                                {statusOptions.map((opt) => (
                                  <option key={opt.key} value={opt.key}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs bg-[#F8F3EC]/60 p-2.5 rounded-xl border border-[#D8C19A]/30">
                              <div>
                                <span className="text-[#3A2025]/60 block text-[10px] uppercase">Function Date</span>
                                <span className="font-medium text-[#3A2025]">{item.functionDate || "Not decided"}</span>
                              </div>
                              <div>
                                <span className="text-[#3A2025]/60 block text-[10px] uppercase">Budget</span>
                                <span className="font-semibold text-[#B08A57]">{item.budget || "Not decided"}</span>
                              </div>
                              {item.city && (
                                <div className="col-span-2 pt-1 border-t border-[#D8C19A]/20">
                                  <span className="text-[#3A2025]/60 text-[10px] uppercase">Location: </span>
                                  <span className="font-medium text-[#3A2025]">{item.city}</span>
                                </div>
                              )}
                            </div>

                            {item.message && (
                              <p className="text-xs text-[#541D2B]/85 italic bg-amber-50/40 p-2.5 rounded-lg border border-amber-100">
                                &ldquo;{item.message}&rdquo;
                              </p>
                            )}

                            {/* Internal Atelier Notes */}
                            <div className="pt-1">
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
                            <div className="pt-2 flex items-center gap-2">
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
                                <span>📞 Call Now</span>
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto rounded-3xl border border-[#D8C19A]/40 bg-white shadow-sm">
                      <table className="w-full text-left text-sm border-collapse">
                        <thead>
                          <tr className="border-b border-[#D8C19A]/30 bg-[#F8F3EC]/80 text-xs uppercase tracking-wider text-[#3A2025]/70">
                            <th className="py-4 px-5">Customer</th>
                            <th className="py-4 px-5">Work Type</th>
                            <th className="py-4 px-5">Function Date</th>
                            <th className="py-4 px-5">Budget</th>
                            <th className="py-4 px-5">Pipeline Stage</th>
                            <th className="py-4 px-5">Atelier Notes</th>
                            <th className="py-4 px-5 text-right">Actions</th>
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
                                  {item.message && (
                                    <p className="text-xs text-[#541D2B]/80 mt-1 italic max-w-xs truncate" title={item.message}>
                                      &ldquo;{item.message}&rdquo;
                                    </p>
                                  )}
                                </td>
                                <td className="py-4 px-5 font-medium text-[#6B2638]">{item.workType}</td>
                                <td className="py-4 px-5 text-xs text-[#3A2025]/80">
                                  {item.functionDate || "—"}
                                </td>
                                <td className="py-4 px-5 text-xs font-semibold text-[#B08A57]">
                                  {item.budget || "—"}
                                </td>
                                <td className="py-4 px-5">
                                  <select
                                    value={item.status}
                                    disabled={updatingId === item.id}
                                    onChange={(e) => updateRecord(item.id, { status: e.target.value })}
                                    className="text-xs font-medium px-2.5 py-1.5 rounded-full border border-[#D8C19A] bg-[#F8F3EC] text-[#3A2025] outline-none cursor-pointer focus:border-[#6B2638]"
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
                                      <span className="bg-amber-50 px-2 py-1 rounded border border-amber-200 block truncate">
                                        📝 {item.adminNotes}
                                      </span>
                                    ) : (
                                      <span className="text-gray-400 italic hover:underline">
                                        + Add note...
                                      </span>
                                    )}
                                  </button>
                                </td>
                                <td className="py-4 px-5 text-right whitespace-nowrap">
                                  <div className="flex items-center justify-end gap-2">
                                    <a
                                      href={`tel:${item.mobile}`}
                                      className="inline-flex items-center px-2.5 py-1.5 rounded-full border border-[#6B2638] text-[#6B2638] hover:bg-[#6B2638]/10 text-xs font-medium transition"
                                      title="Call customer"
                                    >
                                      📞 Call
                                    </a>
                                    <a
                                      href={whatsappUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#0F7A6C] hover:bg-[#0B665C] text-white text-xs font-medium transition shadow-xs"
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

                {/* Add Photo Form */}
                <div className="bg-white p-6 rounded-3xl border border-[#D8C19A]/40 shadow-sm">
                  <h2 className="text-base font-serif font-bold text-[#6B2638] mb-4">
                    + Upload &amp; Publish New Blouse Creation
                  </h2>
                  <form onSubmit={handleAddGalleryItem} className="space-y-5">
                    {/* Direct File Upload Area */}
                    <div className="p-4 rounded-2xl border-2 border-dashed border-[#B08A57]/50 bg-[#F8F3EC]/50 text-center space-y-2">
                      <div className="w-10 h-10 mx-auto rounded-full bg-[#B08A57]/10 text-[#B08A57] flex items-center justify-center">
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
                      <div className="pt-1">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          disabled={uploadingFile}
                          className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#6B2638] file:text-white hover:file:bg-[#541D2B] cursor-pointer"
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
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C19A] text-xs md:text-sm outline-none focus:border-[#6B2638]"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-[#3A2025]/80 block mb-1">Category *</label>
                        <select
                          value={newImage.category}
                          onChange={(e) => setNewImage({ ...newImage, category: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C19A] bg-[#F8F3EC] text-xs md:text-sm outline-none focus:border-[#6B2638]"
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
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C19A] text-xs md:text-sm outline-none focus:border-[#6B2638]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-[#3A2025]/80 block mb-1">Description</label>
                      <input
                        type="text"
                        placeholder="e.g. Handcrafted antique gold bead and kundan stones on pure silk."
                        value={newImage.description}
                        onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C19A] text-xs md:text-sm outline-none focus:border-[#6B2638]"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {galleryMsg && (
                        <p className="text-xs text-[#6B2638] font-medium">{galleryMsg}</p>
                      )}
                      <button
                        type="submit"
                        disabled={addingImage || uploadingFile || !newImage.imageUrl}
                        className="ml-auto px-6 py-2.5 rounded-full bg-[#6B2638] hover:bg-[#541D2B] text-white text-xs font-semibold shadow-xs transition disabled:opacity-50 cursor-pointer"
                      >
                        {addingImage ? "Publishing..." : "Publish to Live Gallery"}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Current Gallery Grid */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-[#3A2025]/70">
                    Live Gallery Items ({galleryItems.length})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {galleryItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-2xl overflow-hidden border border-[#D8C19A]/40 shadow-xs flex flex-col justify-between"
                      >
                        <div className="aspect-square relative bg-[#3A2025]/10 overflow-hidden">
                          <Image
                            src={item.src}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#3A2025]/80 text-[#D8C19A] text-[10px] font-semibold">
                            {item.cat}
                          </span>
                        </div>
                        <div className="p-3">
                          <h4 className="font-semibold text-xs text-[#3A2025] truncate">{item.title}</h4>
                          <p className="text-[11px] text-[#3A2025]/60 truncate mt-0.5">{item.desc || "Handcrafted"}</p>
                          <button
                            type="button"
                            onClick={() => handleDeleteGalleryItem(item.id)}
                            className="mt-2.5 w-full py-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-[11px] font-medium transition cursor-pointer"
                          >
                            Remove from Gallery
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Notes Edit Modal */}
            {activeNoteRecord && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
                <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-[#D8C19A] space-y-4">
                  <div className="flex items-center justify-between border-b border-[#D8C19A]/30 pb-3">
                    <h3 className="font-serif text-lg font-bold text-[#6B2638]">
                      Atelier Notes • {activeNoteRecord.name}
                    </h3>
                    <button
                      onClick={() => setActiveNoteRecord(null)}
                      className="text-gray-400 hover:text-gray-600 text-sm cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#3A2025]/80 block mb-1">
                      Blouse Measurements, Thread Codes, Stone Specs or Advance Details:
                    </label>
                    <textarea
                      rows={4}
                      value={tempNote}
                      onChange={(e) => setTempNote(e.target.value)}
                      placeholder="e.g. Chest 36, Elbow sleeve 10.5, Peacock emerald green beads, Advance ₹2,000 received..."
                      className="w-full p-3 rounded-xl border border-[#D8C19A] text-xs md:text-sm outline-none focus:border-[#6B2638] focus:ring-1 focus:ring-[#6B2638]"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveNoteRecord(null)}
                      className="px-4 py-2 rounded-full border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={savingNote}
                      onClick={saveNotes}
                      className="px-5 py-2 rounded-full bg-[#6B2638] hover:bg-[#541D2B] text-white text-xs font-semibold shadow-xs transition disabled:opacity-60 cursor-pointer"
                    >
                      {savingNote ? "Saving..." : "Save Note"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
