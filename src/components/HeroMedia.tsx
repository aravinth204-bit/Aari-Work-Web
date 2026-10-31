"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type NetworkInformation = {
  saveData?: boolean;
  effectiveType?: string;
};

/**
 * Poster-first hero media. The optimized image is the LCP element; the video
 * is fetched and played after the page settles, and is skipped entirely for
 * reduced-motion or data-saver visitors.
 */
export default function HeroMedia() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;

    if (reduced || connection?.saveData) {
      return;
    }

    let cancelled = false;

    const play = () => {
      if (cancelled || document.visibilityState !== "visible") return;
      video.play().catch(() => {
        // Autoplay can be blocked on some low-power settings. Poster stays visible.
      });
    };

    // Attempt playback immediately and after brief layout settle
    play();
    const timer = window.setTimeout(play, 500);

    const onVisibility = () => {
      if (document.visibilityState === "visible") play();
    };

    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <>
      <Image
        src="/images/hero_aari_artisan.webp"
        alt="Artisan hand-stitching aari work on a wooden frame"
        fill
        priority
        fetchPriority="high"
        sizes="(max-width: 768px) 90vw, 520px"
        className="object-cover"
      />

      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        onPlaying={() => setIsPlaying(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 motion-reduce:hidden ${
          isPlaying ? "opacity-100" : "opacity-0"
        }`}
      >
        <source
          src="/videos/hero_background_mobile-opt.mp4"
          type="video/mp4"
          media="(max-width: 767px)"
        />
        <source src="/videos/hero_background-opt.mp4" type="video/mp4" />
      </video>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#3A2025]/55 via-transparent to-transparent" />

      <p className="absolute inset-x-0 bottom-9 text-center text-[11px] tracking-[0.18em] text-[#F8F3EC]/90">
        Gold zari · Kundan · Bead
      </p>
    </>
  );
}
