"use client";

import { useEffect, useRef, useState } from "react";
import { testimonials } from "@/lib/site";

// Repeat testimonials for infinite seamless scrolling
const allTestimonials = [
  ...testimonials,
  ...testimonials,
  ...testimonials,
  ...testimonials,
];

export default function TestimonialMarquee() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Track scroll progress when section is in view
      const totalDist = rect.height + windowHeight;
      const currentPos = windowHeight - rect.top;
      const progress = Math.max(0, Math.min(1, currentPos / totalDist));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Subtle scroll parallax offset
  const scrollOffset = (scrollProgress - 0.5) * 80;
  const isPaused = hoveredIndex !== null;

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden py-12"
    >
      {/* Left & Right gentle gradient fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-20 bg-gradient-to-r from-[#F1E7DC] to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-20 bg-gradient-to-l from-[#F1E7DC] to-transparent z-20 pointer-events-none" />

      {/* Track moving Right to Left */}
      <div
        className="flex gap-6 w-max will-change-transform"
        style={{
          transform: `translate3d(${scrollOffset}px, 0, 0)`,
          transition: "transform 150ms ease-out",
        }}
      >
        <div
          className="flex gap-6 shrink-0 py-6 animate-marquee-left"
          style={{
            animationPlayState: isPaused ? "paused" : "running",
          }}
        >
          {allTestimonials.map((t, idx) => {
            const isCardHovered = hoveredIndex === idx;

            return (
              <div
                key={`${t.name}-${idx}`}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                onTouchStart={() => setHoveredIndex(idx)}
                onTouchEnd={() => setHoveredIndex(null)}
                className="relative w-[320px] sm:w-[400px] shrink-0 rounded-3xl bg-[#FFFFFF] p-6 sm:p-8 ring-1 ring-[#D8C19A] shadow-md flex flex-col justify-between overflow-hidden cursor-pointer border border-[#D8C19A]/40"
                style={{
                  transform: isCardHovered
                    ? "scale(1.08) translateY(-8px)"
                    : "scale(1) translateY(0px)",
                  boxShadow: isCardHovered
                    ? "0 25px 50px -12px rgba(107, 38, 56, 0.25), 0 0 24px rgba(176, 138, 87, 0.4)"
                    : undefined,
                  borderColor: isCardHovered ? "#B08A57" : undefined,
                  zIndex: isCardHovered ? 40 : 1,
                  transition: "transform 300ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 300ms ease, border-color 300ms ease",
                }}
              >
                {/* Decorative Subtle Gold Quote Mark */}
                <span className="absolute top-3 right-5 text-4xl sm:text-5xl font-serif text-[#B08A57]/20 select-none pointer-events-none transition-colors">
                  ❝
                </span>

                <div>
                  {/* 5 Gold Stars */}
                  <div
                    className="flex items-center gap-1.5 text-[#B08A57] text-base tracking-wider transition-transform duration-300 origin-left"
                    style={{
                      transform: isCardHovered ? "scale(1.05)" : "scale(1)",
                    }}
                  >
                    <span aria-hidden="true">★ ★ ★ ★ ★</span>
                    <span className="sr-only">Rated 5 out of 5</span>
                  </div>

                  {/* Review Text */}
                  <p className="mt-4 text-[15px] sm:text-[16px] text-[#221013] font-medium leading-[1.65] tracking-normal drop-shadow-xs">
                    “{t.text}”
                  </p>
                </div>

                {/* Author & Place Info */}
                <div className="mt-6 flex items-center gap-3.5 pt-4 border-t border-[#D8C19A]/40">
                  <span
                    className="grid h-11 w-11 place-items-center rounded-full bg-[#6B2638] text-white text-base font-bold shadow-sm ring-2 ring-[#B08A57] transition-transform duration-300"
                    style={{
                      transform: isCardHovered ? "scale(1.1)" : "scale(1)",
                    }}
                  >
                    {t.name[0]}
                  </span>
                  <div>
                    <div className="font-serif-display text-base font-bold text-[#221013]">
                      {t.name}
                    </div>
                    <div className="text-xs text-[#4A262C] font-semibold flex items-center gap-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-[#0F7A6C]" />
                      <span>{t.place}</span>
                      <span className="text-[#8C6239]">• Verified Bride</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
