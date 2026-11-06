"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import OrderDetailDrawer from "@/components/OrderDetailDrawer";
import AtelierInvoiceBill from "@/components/AtelierInvoiceBill";
import CustomerDetailDrawer from "@/components/CustomerDetailDrawer";
import { useFocusTrap } from "@/lib/use-focus-trap";
import {
  LayoutDashboard,
  Package,
  Users,
  Image as ImageIcon,
  DollarSign,
  TrendingUp,
  Truck,
  Sparkles,
  Crown,
  Search,
  Plus,
  RefreshCw,
  Phone,
  MessageCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  X,
  Menu,
  Globe,
  LogOut,
  Pencil,
  Trash2,
  FileText,
  UploadCloud,
  ChevronRight,
  Landmark,
  ArrowUpRight,
  Printer
} from "lucide-react";


export interface EnquiryRecord {
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
  orderAmount?: number;
  advanceAmount?: number;
  deliveryDate?: string | null;
  orderSource?: string;
  measurements?: string | null;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  src: string;
  cat: string;
  title: string;
  desc?: string;
  price?: string;
  tags?: string;
}

const statusOptions = [
  { key: "new", label: "🆕 New Lead", color: "bg-amber-50 text-amber-800 border-amber-200" },
  { key: "contacted", label: "📞 Contacted / Quoted", color: "bg-blue-50 text-blue-800 border-blue-200" },
  { key: "advance_paid", label: "📐 Advance Paid", color: "bg-purple-50 text-purple-800 border-purple-200" },
  { key: "in_progress", label: "🧵 In Wooden Frame", color: "bg-indigo-50 text-indigo-800 border-indigo-200" },
  { key: "fitting_fixed", label: "👗 Trial Fixed", color: "bg-pink-50 text-pink-800 border-pink-200" },
  { key: "completed", label: "✅ Delivered", color: "bg-emerald-50 text-emerald-800 border-emerald-200" },
];

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "orders" | "customers" | "gallery" | "revenue">("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Enquiries state
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Order Detail / Edit Modal state
  const [selectedOrder, setSelectedOrder] = useState<EnquiryRecord | null>(null);
  const [jobCardOrder, setJobCardOrder] = useState<EnquiryRecord | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<EnquiryRecord>>({});
  const [savingOrder, setSavingOrder] = useState(false);

  // Create Order Modal state (for Walk-in & Direct Phone orders)
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
  const [newOrderData, setNewOrderData] = useState({
    name: "",
    mobile: "",
    workType: "Bridal Aari Blouse",
    functionDate: "",
    deliveryDate: "",
    orderAmount: 0,
    advanceAmount: 0,
    city: "Gobichettipalayam",
    orderSource: "Walk-in Studio",
    measurements: "",
    message: "",
  });
  const [creatingOrder, setCreatingOrder] = useState(false);

  // Quick WhatsApp Status Modal
  const [quickMsgCustomer, setQuickMsgCustomer] = useState<{ record: EnquiryRecord; stage: string } | null>(null);

  // Customer Detail Modal State
  const [selectedCustomer, setSelectedCustomer] = useState<{
    mobile: string;
    name: string;
    city: string;
    orders: EnquiryRecord[];
    totalSpent: number;
    totalAdvance: number;
    firstOrderDate: string;
    isRepeat: boolean;
  } | null>(null);

  // Gallery Management State
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [newImage, setNewImage] = useState({
    title: "",
    category: "Bridal Aari",
    imageUrl: "",
    description: "",
    price: "",
    tags: "",
  });
  const [uploadingFile, setUploadingFile] = useState(false);
  const [addingImage, setAddingImage] = useState(false);
  const [galleryMsg, setGalleryMsg] = useState("");
  
  // Gallery Edit Modal State
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);
  const [savingGalleryItem, setSavingGalleryItem] = useState(false);
  
  // Gallery Delete Confirmation State
  const [deletingGalleryItem, setDeletingGalleryItem] = useState<GalleryItem | null>(null);
  const [deletingImage, setDeletingImage] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const deleteDialogRef = useRef<HTMLDivElement>(null);
  const closeDeleteDialog = useCallback(() => setDeletingGalleryItem(null), []);

  useFocusTrap(deleteDialogRef, deletingGalleryItem !== null, closeDeleteDialog);

  useEffect(() => {
    const savedToken = localStorage.getItem("aari_admin_token");
    if (savedToken) {
      setToken(savedToken);
      fetchEnquiries(savedToken);
      fetchGallery();
    }

    // Restore active tab from URL hash (e.g. #customers, #orders, #gallery, #revenue) or localStorage
    const hash = window.location.hash.replace("#", "") as "dashboard" | "orders" | "customers" | "gallery" | "revenue";
    const savedTab = (localStorage.getItem("aari_admin_tab") || "") as "dashboard" | "orders" | "customers" | "gallery" | "revenue";
    const validTabs: ("dashboard" | "orders" | "customers" | "gallery" | "revenue")[] = ["dashboard", "orders", "customers", "gallery", "revenue"];
    
    if (validTabs.includes(hash)) {
      setActiveTab(hash);
    } else if (validTabs.includes(savedTab)) {
      setActiveTab(savedTab);
    }
  }, []);

  function switchTab(tab: "dashboard" | "orders" | "customers" | "gallery" | "revenue") {
    setActiveTab(tab);
    localStorage.setItem("aari_admin_tab", tab);
    window.location.hash = tab;
  }

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

  // Update order record
  async function updateRecord(id: number, updates: Partial<EnquiryRecord>) {
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

        if (selectedOrder && selectedOrder.id === id) {
          setSelectedOrder((prev) => (prev ? { ...prev, ...updates } : null));
        }

        // WhatsApp trigger on status change
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

  async function handleSaveOrderEdit() {
    if (!selectedOrder) return;
    setSavingOrder(true);
    await updateRecord(selectedOrder.id, editFormData);
    setSavingOrder(false);
    setSelectedOrder(null);
  }

  // Direct Create Order (Walk-in / WhatsApp phone orders)
  async function handleCreateDirectOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!newOrderData.name || !newOrderData.mobile) return;

    setCreatingOrder(true);
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newOrderData),
      });

      if (res.ok) {
        setIsCreateOrderOpen(false);
        setNewOrderData({
          name: "",
          mobile: "",
          workType: "Bridal Aari Blouse",
          functionDate: "",
          deliveryDate: "",
          orderAmount: 0,
          advanceAmount: 0,
          city: "Gobichettipalayam",
          orderSource: "Walk-in Studio",
          measurements: "",
          message: "",
        });
        fetchEnquiries(token);
      }
    } catch (err) {
      console.error("Create order error:", err);
    } finally {
      setCreatingOrder(false);
    }
  }

  // Gallery File Upload
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const supportedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!supportedTypes.includes(file.type)) {
      setGalleryMsg("Only JPEG, PNG, and WebP images are supported.");
      e.target.value = "";
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setGalleryMsg("Image size exceeds the 10MB limit.");
      e.target.value = "";
      return;
    }

    setUploadingFile(true);
    setGalleryMsg("");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setGalleryMsg(data.error || "Could not prepare image upload.");
      } else {
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);
        uploadFormData.append("api_key", data.apiKey);
        uploadFormData.append("timestamp", data.timestamp);
        uploadFormData.append("folder", data.folder);
        uploadFormData.append("signature", data.signature);

        const uploadResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${encodeURIComponent(data.cloudName)}/image/upload`,
          { method: "POST", body: uploadFormData },
        );
        const uploadData = await uploadResponse.json();

        if (!uploadResponse.ok) {
          setGalleryMsg(uploadData.error?.message || "Cloud image upload failed.");
        } else if (
          typeof uploadData.secure_url !== "string" ||
          !uploadData.secure_url
        ) {
          setGalleryMsg("Upload succeeded but did not return an image URL.");
        } else {
          setNewImage((prev) => ({
            ...prev,
            imageUrl: uploadData.secure_url,
            title: prev.title || file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
          }));
          setGalleryMsg("📸 Photo uploaded successfully! Now click 'Publish'.");
        }
      }
    } catch {
      setGalleryMsg("Upload failed due to network or server error.");
    } finally {
      setUploadingFile(false);
      e.target.value = "";
    }
  }

  // Publish New Gallery Image
  async function handleAddImage(e: React.FormEvent) {
    e.preventDefault();
    if (!newImage.title || !newImage.imageUrl) {
      setGalleryMsg("Title and Image URL are required.");
      return;
    }

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
        setGalleryMsg(data.error || "Failed to publish photo.");
      } else {
        setGalleryMsg("✨ Masterpiece published to live website!");
        setNewImage({ title: "", category: "Bridal Aari", imageUrl: "", description: "", price: "", tags: "" });
        fetchGallery();
      }
    } catch {
      setGalleryMsg("Network error publishing image.");
    } finally {
      setAddingImage(false);
    }
  }

  // Save Gallery Item Edit
  async function handleSaveGalleryEdit() {
    if (!editingGalleryItem) return;
    setSavingGalleryItem(true);
    try {
      const res = await fetch("/api/gallery", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: editingGalleryItem.id,
          title: editingGalleryItem.title,
          category: editingGalleryItem.cat,
          description: editingGalleryItem.desc,
          price: editingGalleryItem.price,
          tags: editingGalleryItem.tags,
        }),
      });

      if (res.ok) {
        setGalleryItems((prev) =>
          prev.map((item) => (item.id === editingGalleryItem.id ? editingGalleryItem : item))
        );
        setEditingGalleryItem(null);
      }
    } catch (err) {
      console.error("Gallery edit error:", err);
    } finally {
      setSavingGalleryItem(false);
    }
  }

  // Delete Gallery Image
  async function handleDeleteImage(item: GalleryItem) {
    setDeletingImage(true);
    setDeleteError("");
    try {
      const res = await fetch(`/api/gallery?id=${encodeURIComponent(item.id)}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setGalleryItems((prev) => prev.filter((g) => g.id !== item.id));
        setDeletingGalleryItem(null);
      } else {
        setDeleteError(data.error || "Failed to delete image.");
      }
    } catch {
      setDeleteError("Failed to delete image due to network error.");
    } finally {
      setDeletingImage(false);
    }
  }

  // -------------------------------------------------------------
  // INTELLIGENT METRICS & COMPUTATIONS
  // -------------------------------------------------------------
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  // Customer Grouping & Repeat Bride Intelligence
  const customerProfiles = useMemo(() => {
    const map = new Map<string, {
      mobile: string;
      name: string;
      city: string;
      orders: EnquiryRecord[];
      totalSpent: number;
      totalAdvance: number;
      firstOrderDate: string;
      isRepeat: boolean;
    }>();

    enquiries.forEach((enq) => {
      const cleanedMobile = enq.mobile.replace(/[^0-9]/g, "");
      const key = cleanedMobile.length >= 10 ? cleanedMobile.slice(-10) : enq.mobile;

      const existing = map.get(key);
      const orderVal = enq.orderAmount || 0;
      const advVal = enq.advanceAmount || 0;

      if (!existing) {
        map.set(key, {
          mobile: enq.mobile,
          name: enq.name,
          city: enq.city || "Tamil Nadu",
          orders: [enq],
          totalSpent: orderVal,
          totalAdvance: advVal,
          firstOrderDate: enq.createdAt,
          isRepeat: false,
        });
      } else {
        existing.orders.push(enq);
        existing.totalSpent += orderVal;
        existing.totalAdvance += advVal;
        existing.isRepeat = true;
      }
    });

    return Array.from(map.values());
  }, [enquiries]);

  // Operational KPIs
  const metrics = useMemo(() => {
    let monthlyRevenue = 0;
    let monthlyAdvance = 0;
    let todayDeliveriesCount = 0;
    let upcomingDeliveriesCount = 0;
    let inFrameCount = 0;

    const now = new Date();
    const next7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    enquiries.forEach((e) => {
      monthlyRevenue += e.orderAmount || 0;
      monthlyAdvance += e.advanceAmount || 0;

      if (e.status === "in_progress") {
        inFrameCount += 1;
      }

      if (e.deliveryDate) {
        if (e.deliveryDate === todayStr) {
          todayDeliveriesCount += 1;
        } else {
          const dDate = new Date(e.deliveryDate);
          if (dDate > now && dDate <= next7Days && e.status !== "completed") {
            upcomingDeliveriesCount += 1;
          }
        }
      }
    });

    const repeatCount = customerProfiles.filter((c) => c.isRepeat).length;
    const repeatRate = customerProfiles.length > 0 ? Math.round((repeatCount / customerProfiles.length) * 100) : 0;

    return {
      totalOrders: enquiries.length,
      monthlyRevenue,
      monthlyAdvance,
      pendingBalance: monthlyRevenue - monthlyAdvance,
      todayDeliveriesCount,
      upcomingDeliveriesCount,
      inFrameCount,
      repeatCount,
      repeatRate,
    };
  }, [enquiries, customerProfiles, todayStr]);

  // Filtered Enquiries for Orders View
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((e) => {
      const matchSearch =
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.mobile.includes(searchQuery) ||
        (e.city && e.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
        e.workType.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchSearch) return false;

      if (statusFilter === "all") return true;
      if (statusFilter === "today_delivery") return e.deliveryDate === todayStr;
      return e.status === statusFilter;
    });
  }, [enquiries, searchQuery, statusFilter, todayStr]);

  // WhatsApp pre-formatted template generator
  function generateWhatsAppMessage(order: EnquiryRecord, stage: string) {
    const brideName = order.name;
    const work = order.workType;
    let msg = "";

    if (stage === "in_progress") {
      msg = `Vanakkam ${brideName} garu! 🧵 Your bridal blouse (${work}) is now on our wooden frame and stitching is actively in progress at Tales by Threads Studio. We will share live progress photos soon! ✨`;
    } else if (stage === "fitting_fixed") {
      msg = `Vanakkam ${brideName}! 👗 Your ${work} embroidery is ready for trial fitting. Kindly let us know a convenient time to visit our Gobichettipalayam studio or for courier trial.`;
    } else if (stage === "completed") {
      msg = `Vanakkam ${brideName}! 🎉 Your ${work} is 100% finished, double checked & packed with care. Thank you for choosing Tales by Threads! Wishing you a blessed wedding & function! 🌸`;
    } else {
      msg = `Vanakkam ${brideName}! Greetings from Tales by Threads Aari Studio. Regarding your enquiry for ${work}...`;
    }

    const cleanNum = order.mobile.replace(/[^0-9]/g, "");
    return `https://wa.me/${cleanNum}?text=${encodeURIComponent(msg)}`;
  }

  // -------------------------------------------------------------
  // LOGIN SCREEN
  // -------------------------------------------------------------
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F8F3EC] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-[#B08A57]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-[#6B2638]/10 blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-[#FFFFFF] rounded-3xl p-8 shadow-xl ring-1 ring-[#D8C19A]/80 border border-[#D8C19A]/40 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-[#F8F3EC] ring-1 ring-[#D8C19A]/60 shadow-xs">
              <Image
                src="/images/Logo-256.png"
                alt={site.name}
                width={56}
                height={56}
                className="w-14 h-14 object-contain rounded-xl"
                priority
              />
            </div>
            <h1 className="mt-4 font-serif-display text-2xl font-bold text-[#3A2025]">
              {site.name} Atelier
            </h1>
            <p className="mt-1 text-xs text-[#7E5C30] font-medium tracking-wider uppercase">
              Management & Order Studio
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#3A2025] mb-2 uppercase tracking-wider">
                Admin Security Token
              </label>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter secret token..."
                required
                className="w-full px-4 py-3 rounded-xl bg-[#F8F3EC]/50 border border-[#D8C19A] text-[#3A2025] placeholder:text-[#3A2025]/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#B08A57] focus:bg-white transition-all font-mono"
              />
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200 font-medium">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#6B2638] text-white text-sm font-semibold hover:bg-[#541D2B] transition-all shadow-md active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Verifying Access...</span>
              ) : (
                <>
                  <span>Open Atelier Suite</span>
                  <span aria-hidden="true">→</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-xs font-medium text-[#7E5C30] hover:text-[#6B2638] transition-colors"
            >
              ← Return to Customer Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED ADMIN SUITE
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#F8F3EC] flex flex-col md:flex-row text-[#3A2025]">
      {/* ========================================================= */}
      {/* 1. LEFT SIDEBAR (Desktop Fixed, Mobile Slide Drawer)       */}
      {/* ========================================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#3A2025] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } shadow-2xl md:shadow-none`}
      >
        <div>
          {/* Studio Brand Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-2xl overflow-hidden ring-1 ring-[#D8C19A]/50 bg-white/10 shadow-sm shrink-0 flex items-center justify-center p-0.5">
                <Image
                  src="/images/Logo-256.png"
                  alt={site.name}
                  width={40}
                  height={40}
                  className="w-full h-full object-contain rounded-xl"
                  priority
                />
              </div>
              <div>
                <h2 className="font-serif-display text-lg font-bold tracking-tight text-white">
                  Tales by Threads
                </h2>
                <span className="text-[10px] text-[#D8C19A] tracking-widest uppercase font-semibold">
                  Atelier Control
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden text-white/70 hover:text-white p-2"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <NavItem
              icon={<LayoutDashboard className="w-4 h-4" />}
              label="Dashboard"
              active={activeTab === "dashboard"}
              onClick={() => {
                switchTab("dashboard");
                setIsMobileMenuOpen(false);
              }}
            />
            <NavItem
              icon={<Package className="w-4 h-4" />}
              label="Orders & Deliveries"
              active={activeTab === "orders"}
              badge={metrics.todayDeliveriesCount > 0 ? `${metrics.todayDeliveriesCount} Today` : undefined}
              badgeColor="bg-red-500"
              onClick={() => {
                switchTab("orders");
                setIsMobileMenuOpen(false);
              }}
            />
            <NavItem
              icon={<Users className="w-4 h-4" />}
              label="Customer CRM"
              active={activeTab === "customers"}
              badge={`${customerProfiles.length}`}
              badgeColor="bg-white/20"
              onClick={() => {
                switchTab("customers");
                setIsMobileMenuOpen(false);
              }}
            />
            <NavItem
              icon={<ImageIcon className="w-4 h-4" />}
              label="Live Gallery Studio"
              active={activeTab === "gallery"}
              badge={`${galleryItems.length}`}
              badgeColor="bg-[#B08A57]"
              onClick={() => {
                switchTab("gallery");
                setIsMobileMenuOpen(false);
              }}
            />
            <NavItem
              icon={<TrendingUp className="w-4 h-4" />}
              label="Revenue & Finance"
              active={activeTab === "revenue"}
              onClick={() => {
                switchTab("revenue");
                setIsMobileMenuOpen(false);
              }}
            />
          </nav>
        </div>

        {/* Bottom Profile & Actions */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-[#D8C19A] transition-colors"
          >
            <span className="flex items-center gap-2">
              <span>🌐</span>
              <span>View Live Website</span>
            </span>
            <span aria-hidden="true">↗</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Atelier</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile drawer */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs"
        />
      )}

      {/* ========================================================= */}
      {/* 2. MAIN WORKSPACE AREA (Right Side)                        */}
      {/* ========================================================= */}
      <div className="flex-1 md:pl-72 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#D8C19A]/40 px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl bg-[#F8F3EC] text-[#3A2025] ring-1 ring-[#D8C19A] hover:bg-[#F1E7DC]"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-serif-display text-xl sm:text-2xl font-bold text-[#3A2025] capitalize">
                {activeTab === "dashboard" && "Atelier Overview"}
                {activeTab === "orders" && "Order & Delivery Hub"}
                {activeTab === "customers" && "Customer Directory & Repeat Brides"}
                {activeTab === "gallery" && "Live Gallery Studio"}
                {activeTab === "revenue" && "Financial Analytics"}
              </h1>
              <p className="text-[11px] text-[#7E5C30] font-medium hidden sm:block">
                {activeTab === "customers"
                  ? `Total ${customerProfiles.length} clients registered • ${metrics.repeatCount} returning customers`
                  : "Gobichettipalayam Studio • Handcrafted Bridal Management"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsCreateOrderOpen(true)}
              className="btn-atelier-primary"
            >
              <Plus className="w-4 h-4 text-[#D8C19A]" />
              <span className="hidden sm:inline">New Walk-in Order</span>
            </button>

            <button
              onClick={() => {
                fetchEnquiries(token);
                fetchGallery();
              }}
              className="btn-atelier-subtle"
              title="Refresh Records"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#B08A57]" />
              <span className="hidden sm:inline">Sync DB</span>
            </button>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <main className="p-4 sm:p-8 flex-1">
          {/* TAB 1: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 max-w-7xl mx-auto">
              {/* Quick Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <MetricCard
                  title="Total Revenue"
                  value={`₹${metrics.monthlyRevenue.toLocaleString("en-IN")}`}
                  subtitle={`Advance: ₹${metrics.monthlyAdvance.toLocaleString("en-IN")}`}
                  icon={<DollarSign className="w-5 h-5 text-[#0F7A6C]" />}
                  highlight="text-[#0F7A6C]"
                />
                <MetricCard
                  title="Today's Deliveries"
                  value={`${metrics.todayDeliveriesCount}`}
                  subtitle="Blouses scheduled today"
                  icon={<Truck className="w-5 h-5 text-red-600" />}
                  highlight={metrics.todayDeliveriesCount > 0 ? "text-red-600" : "text-[#3A2025]"}
                  alert={metrics.todayDeliveriesCount > 0}
                />
                <MetricCard
                  title="In Frame (Active Work)"
                  value={`${metrics.inFrameCount}`}
                  subtitle="Artisans stitching now"
                  icon={<Sparkles className="w-5 h-5 text-[#6B2638]" />}
                  highlight="text-[#6B2638]"
                />
                <MetricCard
                  title="Repeat Bride Rate"
                  value={`${metrics.repeatRate}%`}
                  subtitle={`${metrics.repeatCount} loyal customers`}
                  icon={<Crown className="w-5 h-5 text-[#B08A57]" />}
                  highlight="text-[#B08A57]"
                />
              </div>

              {/* Delivery Timeline & Urgent Action Card */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Left 2 Cols: Urgent Delivery Tracker */}
                <div className="lg:col-span-2 bg-[#FFFFFF] rounded-3xl p-6 ring-1 ring-[#D8C19A]/60 shadow-sm border border-[#D8C19A]/30">
                  <div className="flex items-center justify-between pb-4 border-b border-[#D8C19A]/30">
                    <div>
                      <h3 className="font-serif-display text-lg font-bold text-[#3A2025]">
                        Critical Delivery Pipeline
                      </h3>
                      <p className="text-xs text-[#7E5C30]">
                        Track deadlines before wedding & reception events
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        switchTab("orders");
                        setStatusFilter("today_delivery");
                      }}
                      className="text-xs font-semibold text-[#6B2638] hover:underline"
                    >
                      View All Orders →
                    </button>
                  </div>

                  <div className="mt-5 space-y-3.5">
                    {enquiries
                      .filter((e) => e.deliveryDate && e.status !== "completed")
                      .sort((a, b) => (a.deliveryDate! > b.deliveryDate! ? 1 : -1))
                      .slice(0, 5)
                      .map((order) => {
                        const isToday = order.deliveryDate === todayStr;
                        return (
                          <div
                            key={order.id}
                            className={`p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                              isToday
                                ? "bg-red-50 ring-1 ring-red-200 border-l-4 border-l-red-500"
                                : "bg-[#F8F3EC]/60 ring-1 ring-[#D8C19A]/40"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-10 h-10 rounded-full bg-white ring-1 ring-[#D8C19A] flex items-center justify-center text-sm font-bold shadow-xs">
                                {order.name[0]}
                              </span>
                              <div>
                                <h4 className="text-sm font-bold text-[#3A2025] flex items-center gap-2">
                                  <span>{order.name}</span>
                                  {isToday && (
                                    <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-bold animate-pulse">
                                      DUE TODAY
                                    </span>
                                  )}
                                </h4>
                                <p className="text-xs text-[#7E5C30]">
                                  {order.workType} • Function: {order.functionDate || "Not set"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#D8C19A]/20">
                              <div className="text-left sm:text-right">
                                <span className="text-[10px] uppercase font-bold text-[#7E5C30] block">
                                  Delivery Date
                                </span>
                                <span className="text-xs font-mono font-bold text-[#3A2025]">
                                  {order.deliveryDate}
                                </span>
                              </div>
                              <button
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setEditFormData(order);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-white text-[#6B2638] text-xs font-semibold ring-1 ring-[#D8C19A] hover:bg-[#6B2638] hover:text-white transition-all shadow-xs"
                              >
                                View Order
                              </button>
                            </div>
                          </div>
                        );
                      })}

                    {enquiries.filter((e) => e.deliveryDate && e.status !== "completed").length === 0 && (
                      <p className="text-sm text-center py-8 text-[#7E5C30]">
                        No urgent delivery pending. Good job! 🌟
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Col: Quick Atelier Actions & Summary */}
                <div className="space-y-6">
                  {/* Gallery Quick Card */}
                  <div className="bg-[#FFFFFF] rounded-3xl p-6 ring-1 ring-[#D8C19A]/60 shadow-sm border border-[#D8C19A]/30 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-2xl bg-[#6B2638]/10 text-[#6B2638] flex items-center justify-center"><ImageIcon className="w-5 h-5" /></div>
                        <span className="text-xs font-mono text-[#B08A57] font-bold bg-[#F8F3EC] px-2.5 py-1 rounded-full">
                          {galleryItems.length} Masterpieces
                        </span>
                      </div>
                      <h3 className="mt-4 font-serif-display text-lg font-bold text-[#3A2025]">
                        Live Website Gallery
                      </h3>
                      <p className="mt-1 text-xs text-[#7E5C30] leading-relaxed">
                        Uploaded bridal photos instantly reflect on the public customer showcase with price tags.
                      </p>
                    </div>

                    <button
                      onClick={() => switchTab("gallery")}
                      className="mt-6 w-full btn-atelier-primary justify-center text-xs"
                    >
                      Manage Live Photos & Pricing →
                    </button>
                  </div>

                  {/* Customer CRM Quick Card */}
                  <div className="bg-[#FFFFFF] rounded-3xl p-6 ring-1 ring-[#D8C19A]/60 shadow-sm border border-[#D8C19A]/30">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-2xl bg-[#0F7A6C]/10 text-[#0F7A6C] flex items-center justify-center"><Users className="w-5 h-5" /></div>
                      <span className="text-xs font-bold text-[#0F7A6C] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        {metrics.repeatCount} Repeat Brides
                      </span>
                    </div>
                    <h3 className="mt-4 font-serif-display text-lg font-bold text-[#3A2025]">
                      Client Relationships
                    </h3>
                    <p className="mt-1 text-xs text-[#7E5C30]">
                      Track order history, measurements and contact info.
                    </p>

                    <button
                      onClick={() => switchTab("customers")}
                      className="mt-5 w-full btn-atelier-gold justify-center text-xs"
                    >
                      Open Customer CRM →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS & DELIVERIES */}
          {activeTab === "orders" && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* Filter & Search Bar */}
              <div className="bg-[#FFFFFF] rounded-3xl p-5 ring-1 ring-[#D8C19A]/60 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="w-full md:w-80 relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search bride name, mobile, city..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#F8F3EC]/50 border border-[#D8C19A] text-xs text-[#3A2025] placeholder:text-[#3A2025]/50 focus:outline-none focus:ring-2 focus:ring-[#B08A57]"
                  />
                  <Search className="absolute left-3 top-3 w-4 h-4 text-[#7E5C30]/70" />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                  <FilterPill
                    label="All Orders"
                    active={statusFilter === "all"}
                    onClick={() => setStatusFilter("all")}
                  />
                  <FilterPill
                    label="🚨 Today's Delivery"
                    active={statusFilter === "today_delivery"}
                    onClick={() => setStatusFilter("today_delivery")}
                  />
                  <FilterPill
                    label="🧵 In Frame"
                    active={statusFilter === "in_progress"}
                    onClick={() => setStatusFilter("in_progress")}
                  />
                  <FilterPill
                    label="👗 Trial Fixed"
                    active={statusFilter === "fitting_fixed"}
                    onClick={() => setStatusFilter("fitting_fixed")}
                  />
                  <FilterPill
                    label="✅ Completed"
                    active={statusFilter === "completed"}
                    onClick={() => setStatusFilter("completed")}
                  />
                </div>
              </div>

              {/* DESKTOP HIGH-DENSITY LEDGER TABLE (Hidden on mobile) */}
              <div className="hidden md:block bg-white rounded-3xl ring-1 ring-[#D8C19A]/60 shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F8F3EC] text-[#7E5C30] uppercase font-bold text-[10px] tracking-wider border-b border-[#D8C19A]/40">
                      <th className="py-3.5 px-4 font-semibold">Order Ref</th>
                      <th className="py-3.5 px-4 font-semibold">Bride / Customer</th>
                      <th className="py-3.5 px-4 font-semibold">Blouse Work</th>
                      <th className="py-3.5 px-4 font-semibold">Delivery Target</th>
                      <th className="py-3.5 px-4 font-semibold">Muhurtham</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Bill / Balance</th>
                      <th className="py-3.5 px-4 font-semibold text-center">Status</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D8C19A]/20">
                    {filteredEnquiries.map((order) => {
                      const currentStatus = statusOptions.find((s) => s.key === order.status) || statusOptions[0];
                      const isToday = order.deliveryDate === todayStr;
                      const totalAmt = order.orderAmount || 0;
                      const advAmt = order.advanceAmount || 0;
                      const balAmt = Math.max(0, totalAmt - advAmt);

                      return (
                        <tr
                          key={order.id}
                          onClick={() => setSelectedOrder(order)}
                          className={`hover:bg-[#F8F3EC]/70 cursor-pointer transition-colors group ${
                            isToday ? "bg-red-50/30" : ""
                          }`}
                        >
                          <td className="py-3.5 px-4 font-mono font-bold text-[#6B2638]">
                            ORD-#{order.id}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-[#3A2025] block group-hover:text-[#6B2638] transition-colors text-sm">
                              {order.name}
                            </span>
                            <span className="text-[11px] text-[#7E5C30] font-mono">
                              {order.mobile}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-medium text-[#3A2025] block">
                              {order.workType}
                            </span>
                            {order.city && (
                              <span className="text-[10px] text-[#7E5C30]">
                                {order.city}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-mono">
                            <span className={`font-bold ${isToday ? "text-red-600 bg-red-100 px-2.5 py-0.5 rounded-full" : "text-[#3A2025]"}`}>
                              {order.deliveryDate || "Not Set"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[#6B2638] font-semibold">
                            {order.functionDate || "—"}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="font-bold text-[#3A2025] text-sm">
                              ₹{totalAmt.toLocaleString("en-IN")}
                            </div>
                            <div className="text-[11px] font-medium text-[#7E5C30]">
                              {balAmt > 0 ? (
                                <span className="text-amber-700">₹{balAmt.toLocaleString("en-IN")} due</span>
                              ) : (
                                <span className="text-[#0F7A6C]">Paid</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${currentStatus.color}`}>
                              {currentStatus.label}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setJobCardOrder(order)}
                                className="p-2 rounded-xl bg-white hover:bg-[#F8F3EC] text-[#6B2638] ring-1 ring-[#D8C19A]/80 transition-all shadow-2xs hover:scale-105 cursor-pointer"
                                title="Print Bill / Job Slip"
                              >
                                <Printer className="w-4 h-4 text-[#B08A57]" />
                              </button>
                              <a
                                href={generateWhatsAppMessage(order, order.status)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 ring-1 ring-emerald-300 transition-all shadow-2xs hover:scale-105"
                                title="Send WhatsApp Update"
                              >
                                <MessageCircle className="w-4 h-4" />
                              </a>
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="btn-atelier-primary text-xs !py-1 !px-2.5"
                              >
                                View Order
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS VIEW (Visible only on mobile screens < md) */}
              <div className="md:hidden space-y-4">
                {filteredEnquiries.map((order) => {
                  const currentStatus = statusOptions.find((s) => s.key === order.status) || statusOptions[0];
                  const isToday = order.deliveryDate === todayStr;
                  const totalAmt = order.orderAmount || 0;
                  const advAmt = order.advanceAmount || 0;
                  const balAmt = Math.max(0, totalAmt - advAmt);

                  return (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`bg-white rounded-2xl p-4 ring-1 shadow-sm space-y-3 cursor-pointer active:scale-98 transition-all ${
                        isToday ? "ring-2 ring-red-400 bg-red-50/20" : "ring-[#D8C19A]/60"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-mono text-[#7E5C30] font-bold">
                            ORD-#{order.id}
                          </span>
                          <h4 className="font-serif-display text-base font-bold text-[#3A2025]">
                            {order.name}
                          </h4>
                          <span className="text-xs text-[#7E5C30] font-mono block">{order.mobile}</span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${currentStatus.color}`}>
                          {currentStatus.label}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-[#F8F3EC]/60 border border-[#D8C19A]/40 text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="text-[#7E5C30]">Work Type:</span>
                          <span className="font-bold text-[#3A2025]">{order.workType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#7E5C30]">Delivery:</span>
                          <span className={`font-mono font-bold ${isToday ? "text-red-600" : "text-[#3A2025]"}`}>
                            {order.deliveryDate || "Not Set"}
                          </span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-[#D8C19A]/20">
                          <span className="text-[#7E5C30]">Payment:</span>
                          <span className="font-bold text-[#0F7A6C]">
                            ₹{totalAmt.toLocaleString("en-IN")}{" "}
                            {balAmt > 0 && <span className="text-amber-700 font-normal">({balAmt} due)</span>}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setJobCardOrder(order)}
                            className="p-2 rounded-xl bg-[#F8F3EC] text-[#6B2638] ring-1 ring-[#D8C19A] text-xs font-semibold flex items-center gap-1"
                          >
                            <Printer className="w-3.5 h-3.5 text-[#B08A57]" />
                            <span>Print</span>
                          </button>
                          <a
                            href={generateWhatsAppMessage(order, order.status)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 text-xs font-semibold flex items-center gap-1"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#6B2638] text-white text-xs font-bold"
                        >
                          View Order →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredEnquiries.length === 0 && (
                <div className="text-center py-16 bg-white rounded-3xl border border-[#D8C19A]/40">
                  <p className="text-base font-serif-display font-bold text-[#3A2025]">No orders found</p>
                  <p className="text-xs text-[#7E5C30] mt-1">Try another search keyword or filter.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CUSTOMER CRM */}
          {activeTab === "customers" && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* DESKTOP TABLE VIEW */}
              <div className="hidden md:block bg-[#FFFFFF] rounded-3xl p-6 ring-1 ring-[#D8C19A]/60 shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#D8C19A]/40 text-[#7E5C30] uppercase tracking-wider font-semibold">
                        <th className="py-3 px-3">Client Name</th>
                        <th className="py-3 px-3">Contact</th>
                        <th className="py-3 px-3">City</th>
                        <th className="py-3 px-3 text-center">Orders Placed</th>
                        <th className="py-3 px-3">Lifetime Value</th>
                        <th className="py-3 px-3">Balance Due</th>
                        <th className="py-3 px-3">Type</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#D8C19A]/20">
                      {customerProfiles.map((client) => {
                        const totalSpent = client.totalSpent || 0;
                        const totalAdv = client.orders.reduce((sum, o) => sum + (o.advanceAmount || 0), 0);
                        const balanceDue = totalSpent - totalAdv;

                        return (
                          <tr
                            key={client.mobile}
                            onClick={() => setSelectedCustomer(client)}
                            className="hover:bg-[#F8F3EC]/50 cursor-pointer transition-colors"
                          >
                            <td className="py-3.5 px-3">
                              <div className="flex items-center gap-3">
                                <span className="w-9 h-9 rounded-xl bg-[#6B2638] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
                                  {client.name[0]}
                                </span>
                                <div>
                                  <div className="font-bold text-[#3A2025] hover:text-[#6B2638] transition-colors">
                                    {client.name}
                                  </div>
                                  <div className="text-[11px] text-[#7E5C30]">
                                    Last: {client.orders[0]?.workType || "Bridal Wear"}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-3 font-mono text-[#3A2025]">{client.mobile}</td>
                            <td className="py-3.5 px-3 text-[#7E5C30]">{client.city || "Tamil Nadu"}</td>
                            <td className="py-3.5 px-3 text-center">
                              <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-[#F8F3EC] text-[#3A2025] font-bold text-xs ring-1 ring-[#D8C19A]/60">
                                {client.orders.length} orders
                              </span>
                            </td>
                            <td className="py-3.5 px-3 font-mono font-bold text-[#0F7A6C]">
                              ₹{totalSpent.toLocaleString("en-IN")}
                            </td>
                            <td className="py-3.5 px-3 font-mono font-bold">
                              {balanceDue > 0 ? (
                                <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded-lg">₹{balanceDue.toLocaleString("en-IN")}</span>
                              ) : (
                                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg">Settled</span>
                              )}
                            </td>
                            <td className="py-3.5 px-3">
                              {client.isRepeat ? (
                                <span className="inline-flex items-center gap-1 text-[11px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-300">
                                  <Crown className="w-3 h-3 text-[#B08A57]" /> Repeat Bride
                                </span>
                              ) : (
                                <span className="text-[11px] text-[#7E5C30] bg-[#F8F3EC] px-2 py-0.5 rounded-full border border-[#D8C19A]/50 font-medium">
                                  Royal Bride
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-3 text-right">
                              <div className="inline-flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                <button
                                  type="button"
                                  onClick={() => setSelectedCustomer(client)}
                                  className="btn-atelier-gold !py-1 !px-2.5 text-xs"
                                  title="View Profile"
                                >
                                  View
                                </button>
                                <a
                                  href={`https://wa.me/${client.mobile.replace(/[^0-9]/g, "")}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 ring-1 ring-emerald-300 transition-all shadow-2xs hover:scale-105"
                                  title="WhatsApp"
                                >
                                  <MessageCircle className="w-4 h-4" />
                                </a>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* MOBILE CARDS VIEW */}
              <div className="grid md:hidden grid-cols-1 gap-4">
                {customerProfiles.map((client) => {
                  const totalSpent = client.totalSpent || 0;
                  const totalAdv = client.orders.reduce((sum, o) => sum + (o.advanceAmount || 0), 0);
                  const balanceDue = totalSpent - totalAdv;

                  return (
                    <div
                      key={client.mobile}
                      onClick={() => setSelectedCustomer(client)}
                      className="bg-[#FFFFFF] rounded-2xl p-5 ring-1 ring-[#D8C19A]/60 shadow-xs cursor-pointer active:scale-[0.99] transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-10 h-10 rounded-xl bg-[#6B2638] text-white flex items-center justify-center text-sm font-bold shadow-2xs">
                            {client.name[0]}
                          </span>
                          <div>
                            <h4 className="font-serif-display text-base font-bold text-[#3A2025] flex items-center gap-1.5">
                              <span>{client.name}</span>
                              {client.isRepeat && (
                                <Crown className="w-3.5 h-3.5 text-[#B08A57]" />
                              )}
                            </h4>
                            <p className="text-xs text-[#7E5C30]">{client.city} • <span className="font-mono">{client.mobile}</span></p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3.5 p-3 rounded-xl bg-[#F8F3EC]/50 border border-[#D8C19A]/30 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <div className="text-[10px] text-[#7E5C30] uppercase">Orders</div>
                          <div className="font-bold text-[#3A2025]">{client.orders.length} orders</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-[#7E5C30] uppercase">Lifetime Spent</div>
                          <div className="font-bold text-[#0F7A6C]">₹{totalSpent.toLocaleString("en-IN")}</div>
                        </div>
                        <div className="col-span-2 pt-1 border-t border-[#D8C19A]/20 flex justify-between items-center">
                          <span className="text-[10px] text-[#7E5C30]">Balance Due:</span>
                          <span className="font-bold">
                            {balanceDue > 0 ? (
                              <span className="text-red-600">₹{balanceDue.toLocaleString("en-IN")}</span>
                            ) : (
                              <span className="text-emerald-700">Settled</span>
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-[#D8C19A]/30 flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => setSelectedCustomer(client)}
                          className="flex-1 btn-atelier-primary !py-2 text-xs"
                        >
                          View Details →
                        </button>
                        <a
                          href={`https://wa.me/${client.mobile.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs"
                          title="WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                        <a
                          href={`tel:${client.mobile}`}
                          className="p-2 rounded-xl bg-[#F8F3EC] text-[#3A2025] ring-1 ring-[#D8C19A]/60 shadow-xs"
                          title="Call"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: LIVE GALLERY STUDIO */}
          {activeTab === "gallery" && (
            <div className="space-y-8 max-w-7xl mx-auto">
              {/* Image Upload & Create Form */}
              <div className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 ring-1 ring-[#D8C19A]/60 shadow-sm border border-[#D8C19A]/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-6 border-b border-[#D8C19A]/30">
                  <div>
                    <h3 className="font-serif-display text-xl font-bold text-[#3A2025]">
                      Upload Masterpiece to Website
                    </h3>
                    <p className="text-xs text-[#7E5C30]">
                      Photos published here immediately appear in the homepage gallery with price tags
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#B08A57] bg-[#F8F3EC] px-3 py-1 rounded-full ring-1 ring-[#D8C19A]/40 self-start">
                    {galleryItems.length} Live Items
                  </span>
                </div>

                <form onSubmit={handleAddImage} className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  <div className="sm:col-span-2 lg:col-span-1">
                    <label className="block text-xs font-bold text-[#3A2025] mb-2 uppercase tracking-wider">
                      1. Upload Photo
                    </label>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-[#D8C19A] hover:border-[#B08A57] rounded-2xl p-6 text-center cursor-pointer bg-[#F8F3EC]/30 hover:bg-[#F8F3EC]/70 transition-all flex flex-col items-center justify-center min-h-[140px]"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      {uploadingFile ? (
                        <p className="text-xs font-bold text-[#6B2638] animate-pulse">
                          ⏳ Uploading to Cloudinary...
                        </p>
                      ) : newImage.imageUrl ? (
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden ring-1 ring-[#B08A57]">
                          <Image src={newImage.imageUrl} alt="preview" fill className="object-cover" />
                        </div>
                      ) : (
                        <>
                          <UploadCloud className="w-8 h-8 text-[#B08A57] mb-2" />
                          <span className="text-xs font-bold text-[#6B2638]">Click to Choose Photo</span>
                          <span className="text-[10px] text-[#7E5C30] mt-0.5">JPEG, PNG, WebP up to 10MB</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-[#3A2025] mb-1">Title</label>
                      <input
                        type="text"
                        value={newImage.title}
                        onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                        placeholder="e.g. Royal Peacock Bridal Blouse"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C19A] text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#B08A57]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#3A2025] mb-1">Category</label>
                      <select
                        value={newImage.category}
                        onChange={(e) => setNewImage({ ...newImage, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C19A] text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#B08A57]"
                      >
                        <option value="Bridal Aari">Bridal Aari</option>
                        <option value="Maggam Work">Maggam Work</option>
                        <option value="Zardosi Heavy">Zardosi Heavy</option>
                        <option value="Cutwork Blouse">Cutwork Blouse</option>
                        <option value="Simple Neckline">Simple Neckline</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-[#3A2025] mb-1">Starting Price (Reflects on Website)</label>
                      <input
                        type="text"
                        value={newImage.price}
                        onChange={(e) => setNewImage({ ...newImage, price: e.target.value })}
                        placeholder="e.g. ₹4,500"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C19A] text-xs bg-white font-bold text-[#0F7A6C] focus:outline-none focus:ring-1 focus:ring-[#B08A57]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#3A2025] mb-1">Description / Tags</label>
                      <input
                        type="text"
                        value={newImage.description}
                        onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
                        placeholder="e.g. Antique zari, emerald stones on velvet"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C19A] text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#B08A57]"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3 flex items-center justify-between pt-2">
                    {galleryMsg && (
                      <p className="text-xs font-semibold text-[#6B2638]">{galleryMsg}</p>
                    )}
                    <button
                      type="submit"
                      disabled={addingImage || !newImage.imageUrl}
                      className="ml-auto btn-atelier-primary disabled:opacity-50"
                    >
                      <Sparkles className="w-4 h-4 text-[#D8C19A]" />
                      <span>{addingImage ? "Publishing..." : "Publish to Live Gallery"}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Gallery List & Edit Cards */}
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {galleryItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#FFFFFF] rounded-3xl overflow-hidden ring-1 ring-[#D8C19A]/60 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div className="relative aspect-square w-full bg-[#F8F3EC]">
                      <Image
                        src={item.src}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-[#3A2025]/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                        {item.cat}
                      </span>
                      {item.price && (
                        <span className="absolute bottom-3 left-3 bg-[#0F7A6C] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                          {item.price}
                        </span>
                      )}
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif-display text-sm font-bold text-[#3A2025] line-clamp-1">
                          {item.title}
                        </h4>
                        {item.desc && (
                          <p className="text-xs text-[#7E5C30] mt-1 line-clamp-2">
                            {item.desc}
                          </p>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#D8C19A]/30 flex items-center justify-between gap-2">
                        <button
                          onClick={() => setEditingGalleryItem(item)}
                          className="flex-1 btn-atelier-subtle !py-1 text-xs"
                        >
                          <Pencil className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => setDeletingGalleryItem(item)}
                          className="p-1.5 rounded-xl text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors cursor-pointer"
                          title="Delete photo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: REVENUE & FINANCE */}
          {activeTab === "revenue" && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="grid sm:grid-cols-3 gap-6">
                <MetricCard
                  title="Total Billed Revenue"
                  value={`₹${metrics.monthlyRevenue.toLocaleString("en-IN")}`}
                  subtitle="Confirmed customer orders"
                  icon={<DollarSign className="w-5 h-5 text-[#0F7A6C]" />}
                  highlight="text-[#0F7A6C]"
                />
                <MetricCard
                  title="Advance Collected"
                  value={`₹${metrics.monthlyAdvance.toLocaleString("en-IN")}`}
                  subtitle="Safe advance in studio"
                  icon={<Landmark className="w-5 h-5 text-[#6B2638]" />}
                  highlight="text-[#6B2638]"
                />
                <MetricCard
                  title="Pending Balance on Handover"
                  value={`₹${metrics.pendingBalance.toLocaleString("en-IN")}`}
                  subtitle="Due upon trial / delivery"
                  icon={<Clock className="w-5 h-5 text-[#B08A57]" />}
                  highlight="text-[#B08A57]"
                />
              </div>

              <div className="bg-[#FFFFFF] rounded-3xl p-6 ring-1 ring-[#D8C19A]/60 shadow-xs">
                <h3 className="font-serif-display text-lg font-bold text-[#3A2025] mb-4">
                  Financial Ledger by Customer
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#D8C19A]/40 text-[#7E5C30] uppercase tracking-wider font-semibold">
                        <th className="py-3 px-3">Order #</th>
                        <th className="py-3 px-3">Bride Name</th>
                        <th className="py-3 px-3">Work Type</th>
                        <th className="py-3 px-3">Total Amount</th>
                        <th className="py-3 px-3">Advance Paid</th>
                        <th className="py-3 px-3">Balance Due</th>
                        <th className="py-3 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#D8C19A]/20">
                      {enquiries.map((order) => {
                        const total = order.orderAmount || 0;
                        const adv = order.advanceAmount || 0;
                        const bal = total - adv;
                        return (
                          <tr key={order.id} className="hover:bg-[#F8F3EC]/40">
                            <td className="py-3 px-3 font-mono font-bold text-[#7E5C30]">#{order.id}</td>
                            <td className="py-3 px-3 font-bold text-[#3A2025]">{order.name}</td>
                            <td className="py-3 px-3 text-[#7E5C30]">{order.workType}</td>
                            <td className="py-3 px-3 font-bold text-[#3A2025]">₹{total.toLocaleString("en-IN")}</td>
                            <td className="py-3 px-3 text-[#0F7A6C] font-semibold">₹{adv.toLocaleString("en-IN")}</td>
                            <td className="py-3 px-3 text-red-600 font-bold">₹{bal > 0 ? bal.toLocaleString("en-IN") : "0"}</td>
                            <td className="py-3 px-3">
                              <span className="capitalize px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F8F3EC] ring-1 ring-[#D8C19A]">
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================= */}
      {/* 3. NEW ORDER MODAL (Direct Walk-in / Phone Call)          */}
      {/* ========================================================= */}
      {isCreateOrderOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl ring-1 ring-[#D8C19A] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#D8C19A]/30">
              <h3 className="font-serif-display text-xl font-bold text-[#3A2025]">
                Create Walk-in / Direct Order
              </h3>
              <button
                onClick={() => setIsCreateOrderOpen(false)}
                className="text-lg text-[#7E5C30] hover:text-[#3A2025]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDirectOrder} className="space-y-4 text-xs">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#3A2025] mb-1">Bride / Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={newOrderData.name}
                    onChange={(e) => setNewOrderData({ ...newOrderData, name: e.target.value })}
                    placeholder="e.g. Priyadharshini"
                    className="w-full px-3 py-2 rounded-xl border border-[#D8C19A] bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#3A2025] mb-1">Mobile Number *</label>
                  <input
                    type="text"
                    required
                    value={newOrderData.mobile}
                    onChange={(e) => setNewOrderData({ ...newOrderData, mobile: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl border border-[#D8C19A] bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#3A2025] mb-1">Work Type</label>
                  <select
                    value={newOrderData.workType}
                    onChange={(e) => setNewOrderData({ ...newOrderData, workType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8C19A] bg-white"
                  >
                    <option value="Bridal Aari Blouse">Bridal Aari Blouse</option>
                    <option value="Maggam Work Saree">Maggam Work Saree</option>
                    <option value="Party Wear Blouse">Party Wear Blouse</option>
                    <option value="Zardosi Heavy">Zardosi Heavy</option>
                    <option value="Custom Design">Custom Design</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#3A2025] mb-1">City / Location</label>
                  <input
                    type="text"
                    value={newOrderData.city}
                    onChange={(e) => setNewOrderData({ ...newOrderData, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8C19A] bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-red-600 mb-1">Delivery Target Date</label>
                  <input
                    type="date"
                    value={newOrderData.deliveryDate}
                    onChange={(e) => setNewOrderData({ ...newOrderData, deliveryDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-red-300 bg-red-50/20 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#3A2025] mb-1">Function / Wedding Date</label>
                  <input
                    type="date"
                    value={newOrderData.functionDate}
                    onChange={(e) => setNewOrderData({ ...newOrderData, functionDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8C19A] bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#3A2025] mb-1">Total Order Price (₹)</label>
                  <input
                    type="number"
                    value={newOrderData.orderAmount || ""}
                    onChange={(e) => setNewOrderData({ ...newOrderData, orderAmount: Number(e.target.value) })}
                    placeholder="e.g. 6500"
                    className="w-full px-3 py-2 rounded-xl border border-[#D8C19A] bg-white font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#0F7A6C] mb-1">Advance Received (₹)</label>
                  <input
                    type="number"
                    value={newOrderData.advanceAmount || ""}
                    onChange={(e) => setNewOrderData({ ...newOrderData, advanceAmount: Number(e.target.value) })}
                    placeholder="e.g. 2000"
                    className="w-full px-3 py-2 rounded-xl border border-emerald-300 bg-emerald-50/30 font-mono font-bold text-[#0F7A6C]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#3A2025] mb-1">Measurements & Specifications</label>
                <textarea
                  rows={2}
                  value={newOrderData.measurements}
                  onChange={(e) => setNewOrderData({ ...newOrderData, measurements: e.target.value })}
                  placeholder="Front neck, back deep neck, sleeve length, chest, waist..."
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C19A] bg-white text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#D8C19A]/30">
                <button
                  type="button"
                  onClick={() => setIsCreateOrderOpen(false)}
                  className="btn-atelier-subtle"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingOrder}
                  className="btn-atelier-primary disabled:opacity-50"
                >
                  <Plus className="w-4 h-4 text-[#D8C19A]" />
                  <span>{creatingOrder ? "Creating..." : "Save & Create Order"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. ALL-IN-ONE ORDER DETAIL DRAWER & ACTIONS                */}
      {/* ========================================================= */}
      {selectedOrder && (
        <OrderDetailDrawer
          order={selectedOrder}
          statusOptions={statusOptions}
          onClose={() => setSelectedOrder(null)}
          onPrint={(ord) => setJobCardOrder(ord)}
          onUpdate={async (id, updates) => {
            await updateRecord(id, updates);
            setSelectedOrder((prev) => (prev ? { ...prev, ...updates } : null));
          }}
          generateWhatsAppUrl={generateWhatsAppMessage}
        />
      )}

      {/* ========================================================= */}
      {/* 4.1 ARTISAN JOB CARD & INVOICE MODAL                       */}
      {/* ========================================================= */}
      {jobCardOrder && (
        <AtelierInvoiceBill
          order={jobCardOrder}
          onClose={() => setJobCardOrder(null)}
        />
      )}

      {/* ========================================================= */}
      {/* 5. CUSTOMER PROFILE & ORDER HISTORY DRAWER                 */}
      {/* ========================================================= */}
      {selectedCustomer && (
        <CustomerDetailDrawer
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onSelectOrder={(ord) => {
            setSelectedCustomer(null);
            setSelectedOrder(ord);
          }}
        />
      )}

      {/* ========================================================= */}
      {/* 6. GALLERY ITEM EDIT MODAL                                 */}
      {/* ========================================================= */}
      {editingGalleryItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl ring-1 ring-[#D8C19A] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#D8C19A]/30">
              <h3 className="font-serif-display text-lg font-bold text-[#3A2025]">
                Edit Masterpiece Details
              </h3>
              <button
                onClick={() => setEditingGalleryItem(null)}
                className="text-lg text-[#7E5C30] hover:text-[#3A2025]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#3A2025] mb-1">Title</label>
                <input
                  type="text"
                  value={editingGalleryItem.title}
                  onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C19A] bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-[#3A2025] mb-1">Category</label>
                <select
                  value={editingGalleryItem.cat}
                  onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, cat: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C19A] bg-white"
                >
                  <option value="Bridal Aari">Bridal Aari</option>
                  <option value="Maggam Work">Maggam Work</option>
                  <option value="Zardosi Heavy">Zardosi Heavy</option>
                  <option value="Cutwork Blouse">Cutwork Blouse</option>
                  <option value="Simple Neckline">Simple Neckline</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#3A2025] mb-1">Price Tag (Reflects on Website)</label>
                <input
                  type="text"
                  value={editingGalleryItem.price || ""}
                  onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, price: e.target.value })}
                  placeholder="e.g. ₹4,500"
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C19A] bg-white font-bold text-[#0F7A6C]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#3A2025] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingGalleryItem.desc || ""}
                  onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, desc: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C19A] bg-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#D8C19A]/30">
              <button
                type="button"
                onClick={() => setEditingGalleryItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#7E5C30]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={savingGalleryItem}
                onClick={handleSaveGalleryEdit}
                className="px-5 py-2 rounded-xl bg-[#6B2638] text-white text-xs font-semibold hover:bg-[#541D2B] transition-colors"
              >
                {savingGalleryItem ? "Saving..." : "Save & Update Website"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. GALLERY DELETE SAFETY DIALOG                            */}
      {/* ========================================================= */}
      {deletingGalleryItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div ref={deleteDialogRef} className="bg-white rounded-3xl p-6 max-w-sm w-full ring-1 ring-red-200 shadow-xl space-y-4">
            <h4 className="font-serif-display text-lg font-bold text-red-700">Delete Gallery Photo?</h4>
            <p className="text-xs text-[#3A2025]/80">
              Are you sure you want to remove <strong>"{deletingGalleryItem.title}"</strong>? This will remove it from the live website.
            </p>
            {deleteError && <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg">{deleteError}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingGalleryItem(null)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#7E5C30]"
              >
                Keep
              </button>
              <button
                onClick={() => handleDeleteImage(deletingGalleryItem)}
                disabled={deletingImage}
                className="px-4 py-1.5 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700"
              >
                {deletingImage ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Subcomponents for Clean Architecture
function NavItem({
  icon,
  label,
  active,
  badge,
  badgeColor = "bg-[#B08A57]",
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  badge?: string;
  badgeColor?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all ${
        active
          ? "bg-[#6B2638] text-white shadow-md ring-1 ring-white/20"
          : "text-white/70 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span className="flex items-center gap-3">
        <span className="shrink-0 flex items-center justify-center">{icon}</span>
        <span>{label}</span>
      </span>
      {badge && (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${badgeColor}`}>
          {badge}
        </span>
      )}
    </button>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  icon,
  highlight = "text-[#3A2025]",
  alert = false,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  highlight?: string;
  alert?: boolean;
}) {
  return (
    <div
      className={`bg-[#FFFFFF] rounded-3xl p-5 ring-1 shadow-sm flex flex-col justify-between ${
        alert ? "ring-2 ring-red-400 bg-red-50/30" : "ring-[#D8C19A]/60"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#7E5C30]">{title}</span>
        <div className="w-10 h-10 rounded-2xl bg-[#F8F3EC] flex items-center justify-center text-[#7E5C30] shadow-2xs ring-1 ring-[#D8C19A]/40 shrink-0">{icon}</div>
      </div>
      <div className="mt-4">
        <div className={`font-serif-display text-2xl sm:text-3xl font-bold ${highlight}`}>
          {value}
        </div>
        <p className="mt-1 text-[11px] text-[#7E5C30] font-medium">{subtitle}</p>
      </div>
    </div>
  );
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
        active
          ? "bg-[#6B2638] text-white shadow-xs"
          : "bg-[#F8F3EC] text-[#3A2025] hover:bg-[#F1E7DC] ring-1 ring-[#D8C19A]/60"
      }`}
    >
      {label}
    </button>
  );
}
