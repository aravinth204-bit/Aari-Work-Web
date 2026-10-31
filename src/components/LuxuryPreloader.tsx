"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const ATELIER_WORDS = [
  "Handcrafted Silk",
  "Pure Zari Artistry",
  "Intricate Needlework",
  "Bridal Couture",
];

export default function LuxuryPreloader() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  // If user is accessing the admin portal, bypass preloader completely
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    setMounted(true);

    if (isAdmin) {
      setIsDone(true);
      setIsHidden(true);
      document.documentElement.classList.add("hero-go");
      return;
    }

    // Only skip if user prefers reduced motion (allows preloader to show on page refresh)
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setIsDone(true);
      setIsHidden(true);
      document.documentElement.classList.add("hero-go");
      return;
    }

    // Lock body scroll while intro is playing
    document.body.style.overflow = "hidden";

    // Cycle atelier philosophy words every 800ms
    const wordInterval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % ATELIER_WORDS.length);
    }, 800);

    // Smooth, majestic count up from 0 to 100 over 3.2 seconds
    const duration = 3200;
    const startTime = performance.now();

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);

      // Ease out cubic for a rich, royal deceleration towards 100
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.round(easedProgress * 100);

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        clearInterval(wordInterval);
        // Elegant 500ms hold at 100% so customer absorbs the achievement, then curtain raises
        setTimeout(() => {
          setIsDone(true);
          document.documentElement.classList.add("hero-go");
          document.body.style.overflow = "";

          // Remove entirely from DOM after curtain slide
          setTimeout(() => {
            setIsHidden(true);
          }, 950);
        }, 500);
      }
    };

    const rafId = requestAnimationFrame(updateCounter);

    return () => {
      clearInterval(wordInterval);
      cancelAnimationFrame(rafId);
      document.body.style.overflow = "";
    };
  }, []);

  if (!mounted || isHidden || isAdmin) return null;

  return (
    <div
      role="status"
      aria-label="Loading atelier craftsmanship"
      className={`fixed inset-0 z-[10000] flex flex-col justify-between p-6 sm:p-12 bg-[#2A151A] text-white transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isDone ? "-translate-y-full opacity-95 pointer-events-none" : "translate-y-0 opacity-100"
      }`}
    >
      {/* Subtle Atelier Monogram Background Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
        <span className="font-serif-display text-[25vw] text-[#D8C19A] tracking-widest font-bold">
          AARI
        </span>
      </div>

      {/* Top Header: Atelier Brand Eyebrow */}
      <div className="relative z-10 flex items-center justify-between text-xs tracking-[0.25em] uppercase text-[#D8C19A]/80 font-medium">
        <span>Tales by Threads</span>
        <span className="hidden sm:inline">Mithanya Atelier · Gobichettipalayam</span>
      </div>

      {/* Center: Rotating Craftsmanship Philosophy Words */}
      <div className="relative z-10 text-center my-auto">
        <p className="text-[11px] tracking-[0.2em] uppercase text-[#D8C19A]/60 mb-3">
          Preparing Couture Experience
        </p>
        <div className="h-14 sm:h-20 overflow-hidden flex items-center justify-center">
          <h2
            key={wordIndex}
            className="font-serif-display text-2xl sm:text-4xl md:text-5xl italic text-white tracking-wide transition-all duration-500 transform animate-fadeIn drop-shadow-md"
          >
            "{ATELIER_WORDS[wordIndex]}"
          </h2>
        </div>
      </div>

      {/* Bottom Footer: Golden Thread Hairline Progress Bar & 000-100 Counter */}
      <div className="relative z-10">
        <div className="flex items-end justify-between mb-3 font-mono">
          <span className="text-[11px] text-[#D8C19A]/70 uppercase tracking-widest">
            {count < 100 ? "Weaving in progress..." : "Masterpiece Ready"}
          </span>
          <span className="font-serif-display text-3xl sm:text-5xl text-[#D8C19A] font-light tracking-tight">
            {String(count).padStart(3, "0")}
            <span className="text-sm sm:text-lg text-white/50 ml-1 font-sans">%</span>
          </span>
        </div>

        {/* Hairline Gold Glow Progress Track */}
        <div className="relative w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#B08A57] via-[#D8C19A] to-[#F1E7DC] transition-all duration-150 ease-out shadow-[0_0_12px_rgba(216,193,154,0.8)]"
            style={{ width: `${count}%` }}
          />
        </div>
      </div>
    </div>
  );
}

