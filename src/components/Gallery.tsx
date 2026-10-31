"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { gallery as defaultGallery, GalleryItem, site } from "@/lib/site";
import Reveal from "@/components/Reveal";
import { useMounted } from "@/lib/use-mounted";
import { useFocusTrap } from "@/lib/use-focus-trap";
import TiltSpotlightCard from "@/components/TiltSpotlightCard";

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>(defaultGallery);
  const [activeCategory, setActiveCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(6); // 3 top + 3 bottom = 6 initial items
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [zoomScale, setZoomScale] = useState(1);
  const mounted = useMounted();
  const dialogRef = useRef<HTMLDivElement>(null);

  // Fetch dynamic gallery items from database / API if available
  useEffect(() => {
    async function fetchGallery() {
      try {
        const res = await fetch("/api/gallery");
        if (res.ok) {
          const data = await res.json();
          if (data.items && data.items.length > 0) {
            setItems(data.items);
          }
        }
      } catch (err) {
        // Fall back gracefully to static items
      }
    }
    fetchGallery();
  }, []);

  const categories = ["All", ...Array.from(new Set(items.map((g) => g.cat)))];

  const filteredItems =
    activeCategory === "All" ? items : items.filter((g) => g.cat === activeCategory);

  const displayedItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const openLightbox = (indexInFiltered: number) => {
    setSelectedIndex(indexInFiltered);
    setZoomScale(1);
  };

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null);
    setZoomScale(1);
  }, []);

  useFocusTrap(dialogRef, selectedIndex !== null, closeLightbox);

  const handlePrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! > 0 ? prev! - 1 : filteredItems.length - 1));
    setZoomScale(1);
  }, [selectedIndex, filteredItems.length]);

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! < filteredItems.length - 1 ? prev! + 1 : 0));
    setZoomScale(1);
  }, [selectedIndex, filteredItems.length]);

  const handleZoomIn = () => setZoomScale((s) => Math.min(s + 0.5, 3));
  const handleZoomOut = () => setZoomScale((s) => Math.max(s - 0.5, 1));
  const toggleZoom = () => setZoomScale((s) => (s === 1 ? 2 : 1));

  // Lock body scroll when Lightbox is open
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedIndex]);

  // Arrow-key navigation (Escape + focus trapping live in useFocusTrap)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, handlePrev, handleNext]);

  const activeItem = selectedIndex !== null ? filteredItems[selectedIndex] : null;

  return (
    <div>
      {/* Category Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {categories.map((cat) => (
          <button
            type="button"
            key={cat}
            aria-pressed={activeCategory === cat}
            onClick={() => {
              setActiveCategory(cat);
              setVisibleCount(6); // Reset pagination when switching filter
            }}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B2638] focus-visible:ring-offset-2 ${
              activeCategory === cat
                ? "filter-pill-active text-white border border-[#D8C19A]/60 scale-105"
                : "bg-[#FFFFFF] text-[#6B2638] border border-[#D8C19A] hover:border-[#B08A57] hover:bg-[#F1E7DC] hover:scale-102"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid Layout: 3 Columns Desktop (3 top + 3 bottom = 6 initial) */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-7">
        {displayedItems.map((g, index) => (
          <Reveal key={`${activeCategory}-${g.id || g.src}-${index}`} delay={(index % 6) * 75}>
            <TiltSpotlightCard
              onClick={() => openLightbox(index)}
              ariaLabel={`Open ${g.title} in the gallery`}
              className="gallery-card group block w-full rounded-3xl aspect-[3/4] bg-[#FFFFFF] text-left shadow-sm ring-1 ring-[#D8C19A]/60 hover:ring-2 hover:ring-[#B08A57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B2638] focus-visible:ring-offset-2"
            >
              <Image
                src={g.src}
                alt={g.title}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-108 motion-reduce:group-hover:scale-100 will-change-transform"
                style={{ transform: "translate3d(0, 0, 0)" }}
              />
              {/* Dynamic specular light shine */}
              <div className="card-shine" />

              {/* Dark gradient overlay with subtle burgundy brand tint on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#3A2025]/90 via-[#3A2025]/30 to-transparent transition-opacity duration-500 opacity-70 group-hover:opacity-85" />
              <div className="absolute inset-0 bg-[#6B2638]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Top Category Badge */}
              <span className="absolute top-3 left-3 rounded-full bg-[#3A2025]/85 backdrop-blur-md px-3 py-1 text-[11px] font-medium text-[#D8C19A] ring-1 ring-[#D8C19A]/30 group-hover:ring-[#B08A57]/80 group-hover:bg-[#6B2638]/90 group-hover:text-white transition-all duration-300">
                {g.cat}
              </span>

              {/* Click to Zoom Hint Icon */}
              <span className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300 rounded-full bg-[#6B2638] px-2.5 py-1 text-white text-[11px] font-medium shadow-lg border border-[#D8C19A]/40">
                🔍 Zoom
              </span>

              {/* Title & Info */}
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 text-left text-white z-10 transition-transform duration-300 group-hover:-translate-y-1">
                <h3 className="font-serif-display text-base md:text-lg text-white leading-tight drop-shadow-sm group-hover:text-[#F1E7DC] transition-colors">
                  {g.title}
                </h3>
                {g.desc && (
                  <p className="mt-1 text-xs text-white/80 line-clamp-2 font-light drop-shadow-xs">
                    {g.desc}
                  </p>
                )}
                <span className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] text-[#D8C19A] font-medium group-hover:text-white transition-colors duration-300">
                  <span>View full craftsmanship</span>
                  <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </div>
            </TiltSpotlightCard>
          </Reveal>
        ))}
      </div>

      {/* Load More / Explore More Designs Button */}
      {hasMore && (
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={handleLoadMore}
            className="cta-shimmer group relative inline-flex items-center gap-2 rounded-full bg-[#6B2638] px-8 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-[#541D2B] hover:shadow-lg active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B2638] focus-visible:ring-offset-2"
          >
            <span>Explore more designs</span>
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs text-[#D8C19A]">
              +{filteredItems.length - visibleCount} More
            </span>
          </button>
        </div>
      )}

      {/* Fullscreen High-Res Lightbox Modal with Zoom & Controls */}
      {mounted && selectedIndex !== null && activeItem && createPortal(
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`${activeItem.title} preview`}
          tabIndex={-1}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
          className="fixed inset-0 z-[200] bg-[#3A2025]/98 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6 overflow-hidden animate-fadeIn text-white focus:outline-none"
        >
          {/* Header Controls Bar */}
          <div className="flex items-center justify-between text-white z-20 gap-2 shrink-0 pt-2 sm:pt-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-xs sm:text-sm font-semibold text-[#D8C19A] bg-white/10 px-2.5 sm:px-3 py-1 rounded-full border border-white/15">
                {selectedIndex + 1} / {filteredItems.length}
              </span>
              <span className="text-xs sm:text-sm text-white/80">
                {activeItem.cat} Work
              </span>
            </div>

            {/* Zoom & Action Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="hidden sm:flex items-center gap-1 bg-white/10 p-1 rounded-full border border-white/15">
                <button
                  onClick={handleZoomOut}
                  disabled={zoomScale <= 1}
                  className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium hover:bg-white/30 disabled:opacity-40 transition"
                  title="Zoom Out"
                  aria-label="Zoom out"
                >
                  −
                </button>
                <span className="text-xs text-white/80 min-w-[32px] text-center font-mono">
                  {Math.round(zoomScale * 100)}%
                </span>
                <button
                  onClick={handleZoomIn}
                  disabled={zoomScale >= 3}
                  className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium hover:bg-white/30 disabled:opacity-40 transition"
                  title="Zoom In"
                  aria-label="Zoom in"
                >
                  +
                </button>
                {zoomScale > 1 && (
                  <button
                    onClick={() => setZoomScale(1)}
                    className="rounded-full bg-white/15 px-2 py-1 text-[11px] text-white/80 hover:bg-white/30 transition"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Prominent High-Contrast Close Button (Always visible on mobile & desktop at top-right) */}
              <button
                onClick={closeLightbox}
                data-autofocus
                className="rounded-full bg-[#6B2638] hover:bg-[#541D2B] h-10 w-10 sm:h-11 sm:w-11 flex items-center justify-center text-white text-lg sm:text-xl font-bold shadow-2xl ring-2 ring-[#D8C19A] active:scale-90 transition-all shrink-0"
                aria-label="Close Modal"
                title="Close (Esc)"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Main Large Image Workspace */}
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) closeLightbox();
            }}
            className="relative flex-1 flex items-center justify-center overflow-hidden my-2 sm:my-4"
          >
            {/* Left Navigation Arrow */}
            <button
              onClick={handlePrev}
              className="absolute left-1 sm:left-4 z-20 h-10 w-10 sm:h-12 sm:w-12 grid place-items-center rounded-full bg-[#3A2025]/90 text-white hover:bg-[#6B2638] border border-white/20 transition shadow-xl active:scale-90"
              title="Previous Design (Left Arrow)"
              aria-label="Previous"
            >
              ‹
            </button>

            {/* Large Image Frame */}
            <div
              onClick={toggleZoom}
              className="relative cursor-zoom-in max-w-5xl w-full h-full max-h-[65vh] sm:max-h-[75vh] flex items-center justify-center overflow-hidden select-none"
            >
              <div
                className="relative w-full h-full transition-transform duration-300 ease-out"
                style={{ transform: `scale(${zoomScale})` }}
              >
                <Image
                  src={activeItem.src}
                  alt={activeItem.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 80vw"
                  className="object-contain"
                />
              </div>
            </div>

            {/* Right Navigation Arrow */}
            <button
              onClick={handleNext}
              className="absolute right-1 sm:right-4 z-20 h-10 w-10 sm:h-12 sm:w-12 grid place-items-center rounded-full bg-[#3A2025]/90 text-white hover:bg-[#6B2638] border border-white/20 transition shadow-xl active:scale-90"
              title="Next Design (Right Arrow)"
              aria-label="Next"
            >
              ›
            </button>
          </div>

          {/* Lightbox Footer Info & Direct WhatsApp Inquiry */}
          <div className="max-w-4xl mx-auto w-full bg-[#3A2025]/95 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 ring-1 ring-[#D8C19A]/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-white z-20 shrink-0">
            <div className="text-left w-full sm:w-auto">
              <span className="text-[10px] sm:text-[11px] text-[#D8C19A] font-medium">
                {activeItem.cat} · Design details
              </span>
              <h3 className="font-serif-display text-base sm:text-lg text-white mt-0.5">
                {activeItem.title}
              </h3>
              {activeItem.desc && (
                <p className="text-xs text-white/80 font-light mt-0.5 max-w-xl line-clamp-2 sm:line-clamp-none">
                  {activeItem.desc}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={closeLightbox}
                className="sm:hidden px-4 py-2.5 rounded-full bg-white/15 text-xs text-white font-medium hover:bg-white/25 active:scale-95 transition"
              >
                ✕ Close
              </button>
              <a
                href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
                  `Hi! I saw the design "${activeItem.title}" in your website gallery. Can I get a price quote and delivery date for this work?`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp px-5 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-whatsapp-hover active:scale-95 transition shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#3A2025]"
              >
                <span>Inquire on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
