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
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [zoomScale, setZoomScale] = useState(1);
  const mounted = useMounted();
  const dialogRef = useRef<HTMLDivElement>(null);

  // Fetch dynamic gallery items from database / API
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
      } catch {
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

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null);
    setZoomScale(1);
  }, []);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setZoomScale(1);
  };

  useFocusTrap(dialogRef, selectedIndex !== null, closeLightbox);

  // Lock body scroll when lightbox is active
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

  // Keyboard controls for lightbox navigation
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") {
        setSelectedIndex((prev) =>
          prev !== null ? (prev + 1) % displayedItems.length : null
        );
        setZoomScale(1);
      }
      if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) =>
          prev !== null ? (prev - 1 + displayedItems.length) % displayedItems.length : null
        );
        setZoomScale(1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, displayedItems.length, closeLightbox]);

  const activeItem = selectedIndex !== null ? displayedItems[selectedIndex] : null;

  return (
    <div>
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              setActiveCategory(cat);
              setVisibleCount(6);
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

      {/* Grid Layout: 3 Columns Desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-7">
        {displayedItems.map((g, index) => (
          <Reveal key={`${activeCategory}-${g.id || g.src}-${index}`} delay={(index % 6) * 220}>
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
              <div className="card-shine" />

              <div className="absolute inset-0 bg-gradient-to-t from-[#3A2025]/90 via-[#3A2025]/30 to-transparent transition-opacity duration-500 opacity-70 group-hover:opacity-85" />
              <div className="absolute inset-0 bg-[#6B2638]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Top Category Badge */}
              <span className="absolute top-3 left-3 rounded-full bg-[#3A2025]/85 backdrop-blur-md px-3 py-1 text-[11px] font-medium text-[#D8C19A] ring-1 ring-[#D8C19A]/30 group-hover:ring-[#B08A57]/80 group-hover:bg-[#6B2638]/90 group-hover:text-white transition-all duration-300">
                {g.cat}
              </span>

              {/* Price Tag if set from Admin */}
              {g.price && (
                <span className="absolute top-3 right-3 rounded-full bg-[#0F7A6C]/90 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white shadow-sm ring-1 ring-white/30">
                  {g.price}
                </span>
              )}

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
                  <span>View craftsmanship & quote</span>
                  <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </div>
            </TiltSpotlightCard>
          </Reveal>
        ))}
      </div>

      {/* Load More Button */}
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
          aria-label={`Detailed view of ${activeItem.title}`}
          tabIndex={-1}
          className="fixed inset-0 z-[9999] bg-[#221013]/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8 animate-fade-in focus:outline-none"
        >
          {/* Top Bar with Title & Close Action */}
          <div className="flex items-center justify-between text-white z-20">
            <div>
              <span className="text-[11px] uppercase tracking-widest text-[#D8C19A] font-medium">
                {activeItem.cat} • {selectedIndex + 1} of {displayedItems.length}
              </span>
              <h2 className="font-serif-display text-lg sm:text-2xl font-semibold mt-0.5">
                {activeItem.title}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              {activeItem.price && (
                <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-[#0F7A6C] text-xs font-bold text-white shadow-xs">
                  {activeItem.price}
                </span>
              )}
              <button
                type="button"
                onClick={closeLightbox}
                className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8C19A]"
                aria-label="Close lightbox"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Central Image View with Smooth Scale Zoom */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            <div
              className="relative w-full h-full max-h-[75vh] max-w-4xl transition-transform duration-300 ease-out cursor-zoom-in"
              onClick={() => setZoomScale((prev) => (prev === 1 ? 1.7 : 1))}
              style={{ transform: `scale(${zoomScale})` }}
            >
              <Image
                src={activeItem.src}
                alt={activeItem.title}
                fill
                priority
                className="object-contain drop-shadow-2xl select-none"
              />
            </div>
          </div>

          {/* Bottom Bar: Caption & Quick Inquiry Call-to-Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-white z-20 max-w-4xl mx-auto w-full pt-2 border-t border-white/15">
            <p className="text-xs sm:text-sm text-white/80 max-w-xl text-center sm:text-left font-light leading-relaxed">
              {activeItem.desc || "Handcrafted with premium zari, beads & kundan stones tailored in our atelier."}
            </p>
            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
                  `Vanakkam Mithanya! I saw "${activeItem.title}" (${activeItem.cat}) on your website. I want a similar bridal blouse. Can you share quotation details?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0F7A6C] text-white text-xs font-semibold hover:bg-[#0B665C] transition-all shadow-md active:scale-95"
              >
                <span>💬 WhatsApp Inquiry</span>
              </a>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
