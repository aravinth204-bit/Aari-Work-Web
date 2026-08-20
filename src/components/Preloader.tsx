"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { site } from "@/lib/site";

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
    }, 400);
  };

  useEffect(() => {
    // Lock scrolling while preloader is active
    document.body.style.overflow = "hidden";

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      const quickTimer = setTimeout(() => {
        handleFinish();
      }, 400);
      return () => clearTimeout(quickTimer);
    }

    // Animate progress smoothly over 1.4s
    const startTime = performance.now();
    const duration = 1400;

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);
      if (pct < 100) {
        requestAnimationFrame(frame);
      } else {
        setTimeout(() => {
          handleFinish();
        }, 200);
      }
    };

    const animId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animId);
      document.body.style.overflow = "";
    };
  }, []);

  if (!isLoading) return null;

  // Path length math for SVG thread tracing (length ~320px)
  const pathLength = 320;
  const strokeDashoffset = pathLength - (pathLength * progress) / 100;

  // Calculate needle X/Y coordinates along bezier curve: M 20,40 C 90,5 230,5 300,40
  const t = progress / 100;
  const needleX = Math.round((1 - t) * (1 - t) * 20 + 2 * (1 - t) * t * 160 + t * t * 300);
  const needleY = Math.round((1 - t) * (1 - t) * 40 + 2 * (1 - t) * t * 5 + t * t * 40);

  return (
    <div
      className={`fixed inset-0 z-[100] h-[100dvh] w-screen flex flex-col items-center justify-center bg-[#F8F3EC] text-[#3A2025] select-none transition-opacity duration-400 ease-out ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative flex flex-col items-center justify-center px-4 max-w-sm text-center">
        {/* Subtle Decorative SVG Embroidery Thread & Moving Needle */}
        <div className="relative w-80 h-16 mb-2 pointer-events-none">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 320 60">
            {/* Guide path in faint light gold */}
            <path
              d="M 20,40 C 90,5 230,5 300,40"
              fill="none"
              stroke="#D8C19A"
              strokeWidth="1"
              strokeDasharray="4 4"
              opacity="0.4"
            />
            {/* Stitched thread path in Muted Gold */}
            <path
              d="M 20,40 C 90,5 230,5 300,40"
              fill="none"
              stroke="#B08A57"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={pathLength}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>

          {/* Needle Motif positioned at leading edge of thread */}
          <div
            className="absolute top-0 left-0 transition-transform duration-75 pointer-events-none"
            style={{
              transform: `translate(${needleX - 10}px, ${needleY - 12}px) rotate(-35deg)`,
            }}
          >
            <span className="text-lg inline-block drop-shadow-xs">🪡</span>
          </div>
        </div>

        {/* Logo Container with Smooth Reveal */}
        <div
          className="relative flex flex-col items-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            opacity: progress > 15 ? Math.min(1, (progress - 15) / 60) : 0,
            transform: `translateY(${Math.max(0, 16 - (progress / 100) * 16)}px)`,
          }}
        >
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-3 rounded-full bg-white p-1.5 ring-1 ring-[#D8C19A] shadow-md flex items-center justify-center">
            <Image
              src="/images/Logo.png"
              alt={site.name}
              width={96}
              height={96}
              priority
              className="w-full h-full object-contain rounded-full"
            />
          </div>

          <h2 className="font-serif-display text-2xl sm:text-3xl text-[#3A2025] tracking-wide">
            {site.name}
          </h2>
          <p className="mt-1 text-xs text-[#B08A57] tracking-[0.25em] font-medium uppercase">
            Handcrafted Embroidery
          </p>
        </div>

        {/* Minimal Progress Thread Line */}
        <div className="mt-6 w-36 h-0.5 bg-[#D8C19A]/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#B08A57] rounded-full transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
