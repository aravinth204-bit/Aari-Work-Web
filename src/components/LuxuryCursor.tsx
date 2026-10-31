"use client";

import { useEffect, useRef, useState } from "react";

export default function LuxuryCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run on non-touch devices with fine pointers and no reduced-motion preference
    if (
      typeof window === "undefined" ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) setIsVisible(true);

      // Instant follow for precision golden needle dot
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      // Check if hovering over clickable / interactive elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest(
          "a, button, input, select, textarea, [role='button'], .gallery-card, .cursor-pointer"
        );
        setIsHoveringInteractive(!!interactive);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    // Smooth lerp trailing animation for the luxury outer golden hoop ring
    const render = () => {
      // Lerp factor 0.18 for silky physical momentum
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }

      rafId = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, [isVisible]);

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[9999] transition-opacity duration-300 hidden md:block ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden="true"
    >
      {/* 1. Precision Zari Golden Needle Dot (Centered) */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 -ml-1 -mt-1 w-2 h-2 rounded-full bg-[#B08A57] shadow-[0_0_8px_rgba(176,138,87,0.9)] will-change-transform"
      />

      {/* 2. Trailing Aari Hoop Ring (with smooth lerp & magnetic expansion on links) */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 will-change-transform transition-[width,height,margin,border-color,background-color] duration-300 ease-out rounded-full border ${
          isHoveringInteractive
            ? "-ml-6 -mt-6 w-12 h-12 border-[#B08A57] bg-[#B08A57]/15 shadow-[0_0_20px_rgba(176,138,87,0.35)] scale-110"
            : "-ml-4 -mt-4 w-8 h-8 border-[#B08A57]/50 bg-transparent"
        }`}
      />
    </div>
  );
}

