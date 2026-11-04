"use client";

import { useEffect, useRef, useState } from "react";
import ServiceIcon from "@/components/ServiceIcon";
import { services } from "@/lib/site";

// Initial scattered positions & rotations (klanji kedakura state)
const SCATTER_PRESETS = [
  { x: -55, y: -45, rot: -14, scale: 0.92 }, // Card 1 (Top-Left scatter)
  { x: 10, y: -65, rot: 11, scale: 0.94 },   // Card 2 (Top-Center scatter)
  { x: 60, y: -40, rot: -9, scale: 0.91 },   // Card 3 (Top-Right scatter)
  { x: -65, y: 50, rot: 13, scale: 0.93 },   // Card 4 (Bottom-Left scatter)
  { x: -5, y: 70, rot: -12, scale: 0.95 },   // Card 5 (Bottom-Center scatter)
  { x: 58, y: 55, rot: 15, scale: 0.9 },     // Card 6 (Bottom-Right scatter)
];

export default function ScatteredServices() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Section height is sticky pinned (e.g. 200vh - 250vh)
      // Progress 0 when section enters, 1 when cards are fully arranged
      const totalScrollable = rect.height - windowHeight;
      if (totalScrollable <= 0) return;

      const currentScroll = -rect.top;
      // Clamp progress between 0 and 1
      const progress = Math.max(0, Math.min(1, currentScroll / totalScrollable));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // When progress goes from 0 -> 0.85, cards move from scattered to (0,0,0) arranged grid
  // After 0.85 to 1.0, cards stay settled so user can comfortably read before unpinning
  const arrangeProgress = Math.min(1, scrollProgress / 0.85);

  // Easing function for satisfying magnetic snap feel
  const easeProgress = Math.pow(arrangeProgress, 1.8);

  return (
    <div
      ref={sectionRef}
      className="relative w-full"
      style={{
        // 220vh gives generous scroll runway to watch the cards fly together
        height: prefersReducedMotion ? "auto" : "220vh",
      }}
    >
      <div
        className={`${
          prefersReducedMotion ? "relative py-16" : "sticky top-0 min-h-screen flex flex-col justify-center py-12 md:py-16"
        } overflow-hidden`}
      >
        <div className="mx-auto max-w-6xl px-4 w-full">
          {/* Header with dynamic arrange hint indicator */}
          <div className="mb-10 md:mb-14 text-center sm:text-left flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-xs font-medium tracking-[0.16em] text-[#7E5C30]">What we make</p>
              <h2 className="mt-2 font-serif-display text-3xl md:text-4xl text-[#3A2025]">
                Aari work, by the piece
              </h2>
            </div>

            {/* Visual arranging indicator */}
            {!prefersReducedMotion && (
              <div className="inline-flex items-center gap-2 self-start sm:self-end px-3.5 py-1.5 rounded-full bg-[#FFFFFF]/80 backdrop-blur-md ring-1 ring-[#D8C19A]/50 text-xs text-[#6B2638] shadow-xs">
                <span
                  className="w-2 h-2 rounded-full transition-colors duration-300"
                  style={{
                    backgroundColor: arrangeProgress >= 0.95 ? "#0F7A6C" : "#B08A57",
                  }}
                />
                <span className="font-medium">
                  {arrangeProgress >= 0.95
                    ? "✨ Perfectly stitched & arranged"
                    : "Scroll to arrange the crafts"}
                </span>
                <span className="text-[#B08A57] font-bold">
                  {Math.round(arrangeProgress * 100)}%
                </span>
              </div>
            )}
          </div>

          {/* Cards Grid: 6 cards scattered -> assembled */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s, i) => {
              const preset = SCATTER_PRESETS[i % SCATTER_PRESETS.length];

              // Calculate current transform based on arrangeProgress
              const currentX = (1 - easeProgress) * preset.x;
              const currentY = (1 - easeProgress) * preset.y;
              const currentRot = (1 - easeProgress) * preset.rot;
              const currentScale = preset.scale + easeProgress * (1 - preset.scale);
              const shadowElevation = (1 - easeProgress) * 20;

              return (
                <div
                  key={s.title}
                  className="will-change-transform"
                  style={{
                    transform: prefersReducedMotion
                      ? undefined
                      : `translate3d(${currentX}px, ${currentY}px, 0) rotate(${currentRot}deg) scale(${currentScale})`,
                    transition: prefersReducedMotion
                      ? undefined
                      : "transform 120ms cubic-bezier(0.16,1,0.3,1)",
                    zIndex: Math.round((1 - arrangeProgress) * (10 + i)),
                  }}
                >
                  <a
                    href="#enquiry"
                    className="group h-full rounded-3xl bg-[#FFFFFF] p-6 ring-1 ring-[#D8C19A]/60 hover:ring-[#B08A57]/60 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B2638] focus-visible:ring-offset-2"
                    style={{
                      boxShadow: prefersReducedMotion
                        ? undefined
                        : `0 ${10 + shadowElevation}px ${25 + shadowElevation}px -10px rgba(58, 32, 37, ${
                            0.08 + (1 - easeProgress) * 0.12
                          })`,
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="overflow-hidden rounded-2xl inline-block transition-transform duration-300 group-hover:scale-105">
                          <ServiceIcon title={s.title} className="h-9 w-9 text-[#6B2638]" />
                        </div>
                        <span className="text-[11px] font-mono text-[#B08A57] font-semibold bg-[#F8F3EC] px-2.5 py-0.5 rounded-full ring-1 ring-[#D8C19A]/40">
                          0{i + 1}
                        </span>
                      </div>
                      <h3 className="mt-4 font-serif-display text-xl text-[#3A2025]">{s.title}</h3>
                      <p className="mt-2 text-sm text-[#3A2025]/75 leading-relaxed">{s.desc}</p>
                    </div>

                    <div className="mt-5 flex items-center justify-between pt-4 border-t border-[#D8C19A]/20">
                      <p className="text-sm font-medium text-[#7E5C30]">{s.price}</p>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#6B2638] transition-transform duration-300 group-hover:translate-x-1">
                        <span>Get a quote</span>
                        <span aria-hidden="true">→</span>
                      </span>
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

