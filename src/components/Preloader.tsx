"use client";

import { useEffect, useState } from "react";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFinish = () => {
    if (isFading) return;
    setIsFading(true);
    document.body.classList.add("preloader-done");
    setTimeout(() => {
      setIsLoading(false);
      document.body.style.overflow = "";
    }, 450);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      const quickTimer = setTimeout(() => {
        handleFinish();
      }, 400);
      return () => clearTimeout(quickTimer);
    }

    const startTime = performance.now();
    const duration = 1600;

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);
      if (pct < 100) {
        requestAnimationFrame(frame);
      } else {
        setTimeout(() => {
          handleFinish();
        }, 250);
      }
    };

    const animId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animId);
      document.body.style.overflow = "";
    };
  }, []);

  if (!isLoading) return null;

  // Circular calculations (Hoop Radius = 60px)
  const radius = 60;
  const circumference = 2 * Math.PI * radius; // ~377px
  const strokeDashoffset = circumference - (circumference * progress) / 100;

  // Needle circular rotation angle (from -90deg at top to 270deg)
  const angleDeg = -90 + (progress / 100) * 360;
  const angleRad = (angleDeg * Math.PI) / 180;
  const needleX = Math.round(75 + radius * Math.cos(angleRad));
  const needleY = Math.round(75 + radius * Math.sin(angleRad));

  return (
    <div
      className={`fixed inset-0 z-[100] h-[100dvh] w-screen flex flex-col items-center justify-center bg-[#F8F3EC] text-[#3A2025] select-none transition-opacity duration-450 ease-out ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative flex flex-col items-center justify-center px-4 max-w-sm text-center">
        {/* Circular Aari Wooden Hoop Ring & Orbiting Needle */}
        <div className="relative w-36 h-36 mb-5 flex items-center justify-center pointer-events-none">
          <svg className="w-full h-full -rotate-90 overflow-visible" viewBox="0 0 150 150">
            {/* Outer Wooden Embroidery Hoop Shadow & Ring */}
            <circle
              cx="75"
              cy="75"
              r="68"
              fill="none"
              stroke="#D8C19A"
              strokeWidth="1.5"
              opacity="0.35"
              strokeDasharray="4 4"
            />

            {/* Background Hoop Track */}
            <circle
              cx="75"
              cy="75"
              r={radius}
              fill="none"
              stroke="#E8DAC8"
              strokeWidth="4"
            />

            {/* Active Gold Thread Stitched Circular Progress Path */}
            <circle
              cx="75"
              cy="75"
              r={radius}
              fill="none"
              stroke="#B08A57"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ willChange: "stroke-dashoffset" }}
            />
          </svg>

          {/* Central Monogram Badge "TT" */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="h-16 w-16 rounded-full bg-[#3A2025] text-[#D8C19A] flex items-center justify-center ring-2 ring-[#B08A57] shadow-xl">
              <span className="font-serif-display text-2xl font-bold tracking-widest text-[#D8C19A] drop-shadow-md">
                TT
              </span>
            </div>
          </div>

          {/* Orbiting Needle 🪡 following 360-degree circular thread stitch */}
          <div
            className="absolute top-0 left-0 transition-transform duration-75 pointer-events-none z-20"
            style={{
              transform: `translate(${needleX - 10}px, ${needleY - 10}px) rotate(${angleDeg + 90}deg)`,
              willChange: "transform",
            }}
          >
            <span className="text-xl inline-block drop-shadow-md">🪡</span>
          </div>
        </div>

        {/* Brand Name & Designed Tagline */}
        <div
          className="relative flex flex-col items-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            opacity: progress > 10 ? Math.min(1, (progress - 10) / 50) : 0,
            transform: `translateY(${Math.max(0, 12 - (progress / 100) * 12)}px)`,
          }}
        >
          <h2 className="font-serif-display text-3xl sm:text-4xl text-[#3A2025] font-bold tracking-wide drop-shadow-xs">
            Tales by Threads
          </h2>
          <div className="gold-line h-px w-28 mx-auto my-2" />
          <p className="text-[11px] text-[#B08A57] tracking-[0.3em] font-semibold uppercase">
            HANDCRAFTED AARI WORK STUDIO
          </p>
        </div>

        {/* Minimal Progress Percentage */}
        <div className="mt-5 flex items-center gap-2">
          <div className="w-28 h-1 bg-[#D8C19A]/40 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#6B2638] rounded-full transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="font-mono text-xs font-semibold text-[#6B2638]">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </div>
  );
}

