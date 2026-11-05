"use client";

import { useEffect, useRef, useState } from "react";
import ServiceIcon from "@/components/ServiceIcon";
import { services } from "@/lib/site";

// Initial scattered positions & rotations for Desktop
const SCATTER_PRESETS = [
  { x: -55, y: -45, rot: -14, scale: 0.92 }, // Card 1 (Top-Left scatter)
  { x: 10, y: -65, rot: 11, scale: 0.94 },   // Card 2 (Top-Center scatter)
  { x: 60, y: -40, rot: -9, scale: 0.91 },   // Card 3 (Top-Right scatter)
  { x: -65, y: 50, rot: 13, scale: 0.93 },   // Card 4 (Bottom-Left scatter)
  { x: -5, y: 70, rot: -12, scale: 0.95 },   // Card 5 (Bottom-Center scatter)
  { x: 58, y: 55, rot: 15, scale: 0.9 },     // Card 6 (Bottom-Right scatter)
];

export default function ScatteredServices() {
  const mobileSectionRef = useRef<HTMLDivElement>(null);
  const desktopSectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setPrefersReducedMotion(true);
    }

    const handleScroll = () => {
      // Pick active section based on current viewport width
      const isMobile = window.innerWidth < 640;
      const targetEl = isMobile ? mobileSectionRef.current : desktopSectionRef.current;
      if (!targetEl) return;

      const rect = targetEl.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const totalScrollable = rect.height - windowHeight;
      if (totalScrollable <= 0) return;

      const currentScroll = -rect.top;
      // Clamp progress between 0 and 1
      const progress = Math.max(0, Math.min(1, currentScroll / totalScrollable));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Also attach to Lenis if available
    const w = window as any;
    if (w.__lenis) {
      w.__lenis.on("scroll", handleScroll);
    }
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (w.__lenis) {
        w.__lenis.off("scroll", handleScroll);
      }
    };
  }, []);

  // Desktop arrange progress
  const arrangeProgress = Math.min(1, scrollProgress / 0.85);
  const easeProgress = Math.pow(arrangeProgress, 1.8);

  const numCards = services.length; // 6 cards

  // Stacking calculation for Mobile:
  const stackPhase = Math.min(1, scrollProgress / 0.88);

  // Active card index to display in counter (1 to 6)
  const currentActiveCardIndex = Math.min(
    numCards,
    Math.max(1, Math.floor(stackPhase * (numCards - 1)) + 1)
  );

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. MOBILE VIEW (Sticky Deck Stacking): < sm                                */}
      {/* ========================================================================= */}
      <div
        ref={mobileSectionRef}
        className="block sm:hidden relative w-full"
        style={{
          // 400vh provides comfortable runway for each card to rise
          height: prefersReducedMotion ? "auto" : "400vh",
        }}
      >
        <div
          className={`${
            prefersReducedMotion
              ? "relative py-12 px-4 flex flex-col gap-5"
              : "sticky top-0 h-screen max-h-screen flex flex-col justify-start pt-14 pb-8 px-4 overflow-hidden"
          }`}
        >
          {/* Mobile Header */}
          <div className="mb-4 text-left flex flex-col gap-2 flex-shrink-0">
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-[#7E5C30]">
                What we make
              </p>
              <h2 className="mt-1 font-serif-display text-2xl text-[#3A2025]">
                Aari work, by the piece
              </h2>
            </div>

            {!prefersReducedMotion && (
              <div className="flex items-center justify-between w-full pt-1">
                <span className="text-[11px] font-medium text-[#7E5C30] flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#B08A57] animate-ping" />
                  Scroll to stack designs
                </span>
                <span className="text-xs font-mono font-bold text-[#6B2638] bg-[#FFFFFF] px-3 py-1 rounded-full ring-1 ring-[#D8C19A]/60 shadow-xs">
                  {currentActiveCardIndex} / {numCards}
                </span>
              </div>
            )}
          </div>

          {/* Mobile Stacking Arena */}
          {prefersReducedMotion ? (
            services.map((s, i) => (
              <CardContent key={s.title} s={s} index={i} total={numCards} />
            ))
          ) : (
            <div className="relative flex-1 min-h-[360px] max-h-[460px] w-full flex items-center justify-center">
              {services.map((s, i) => {
                const stepDuration = 1 / (numCards - 1);
                const stepStart = (i - 1) * stepDuration;
                const stepEnd = i * stepDuration;

                let cardProgress = 0;
                if (i === 0) {
                  cardProgress = 1;
                } else if (stackPhase <= stepStart) {
                  cardProgress = 0;
                } else if (stackPhase >= stepEnd) {
                  cardProgress = 1;
                } else {
                  cardProgress = (stackPhase - stepStart) / (stepEnd - stepStart);
                }

                const eased = 1 - Math.pow(1 - cardProgress, 2.5);
                const translateY = i === 0 ? 0 : (1 - eased) * 130;
                const topOffset = i * 4;
                const scale = 0.95 + eased * 0.05;
                const opacity = i === 0 ? 1 : cardProgress <= 0.02 ? 0 : Math.min(1, cardProgress * 4);

                return (
                  <div
                    key={s.title}
                    className="absolute inset-x-0 w-full will-change-transform"
                    style={{
                      top: `${topOffset}px`,
                      transform: `translate3d(0, ${translateY}%, 0) scale(${scale})`,
                      opacity: opacity,
                      zIndex: 10 + i,
                      pointerEvents: cardProgress > 0.85 ? "auto" : "none",
                    }}
                  >
                    <CardContent s={s} index={i} total={numCards} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DESKTOP VIEW (Scattered Assemble): >= sm                               */}
      {/* ========================================================================= */}
      <div
        ref={desktopSectionRef}
        className="hidden sm:block relative w-full"
        style={{
          height: prefersReducedMotion ? "auto" : "220vh",
        }}
      >
        <div
          className={`${
            prefersReducedMotion
              ? "relative py-16"
              : "sticky top-0 min-h-screen flex flex-col justify-center py-12 md:py-16"
          } overflow-hidden`}
        >
          <div className="mx-auto max-w-6xl px-4 w-full">
            {/* Header */}
            <div className="mb-10 md:mb-14 text-left flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <p className="text-xs font-medium tracking-[0.16em] text-[#7E5C30]">
                  What we make
                </p>
                <h2 className="mt-2 font-serif-display text-3xl md:text-4xl text-[#3A2025]">
                  Aari work, by the piece
                </h2>
              </div>

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

            {/* Desktop Cards Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((s, i) => {
                const preset = SCATTER_PRESETS[i % SCATTER_PRESETS.length];

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
    </>
  );
}

// Mobile Card Component
function CardContent({
  s,
  index,
  total,
}: {
  s: (typeof services)[number];
  index: number;
  total: number;
}) {
  return (
    <a
      href="#enquiry"
      className="group block rounded-3xl bg-[#FFFFFF] p-6 ring-1 ring-[#D8C19A]/80 transition-all flex flex-col justify-between"
      style={{
        boxShadow: "0 18px 40px -12px rgba(58, 32, 37, 0.22), 0 2px 8px rgba(58, 32, 37, 0.08)",
      }}
    >
      <div>
        <div className="flex items-center justify-between">
          <div className="overflow-hidden rounded-2xl inline-block bg-[#F8F3EC] p-2.5 ring-1 ring-[#D8C19A]/40 shadow-xs">
            <ServiceIcon title={s.title} className="h-8 w-8 text-[#6B2638]" />
          </div>
          <span className="text-[11px] font-mono text-[#B08A57] font-bold bg-[#F8F3EC] px-3 py-1 rounded-full ring-1 ring-[#D8C19A]/60">
            0{index + 1} / 0{total}
          </span>
        </div>
        <h3 className="mt-4 font-serif-display text-xl text-[#3A2025]">{s.title}</h3>
        <p className="mt-2 text-sm text-[#3A2025]/85 leading-relaxed line-clamp-3">
          {s.desc}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between pt-4 border-t border-[#D8C19A]/40">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#7E5C30]/70 font-semibold block">
            Starting Price
          </span>
          <p className="text-base font-bold text-[#7E5C30]">{s.price}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FFFFFF] bg-[#6B2638] px-4 py-2 rounded-full shadow-sm active:scale-95 transition-transform">
          <span>Get a quote</span>
          <span aria-hidden="true">→</span>
        </span>
      </div>
    </a>
  );
}
