"use client";

import { useEffect, useRef, useState } from "react";

type SmartVideoProps = {
  src: string;
  poster?: string;
  className?: string;
  controls?: boolean;
  muted?: boolean;
};

/**
 * Plays a video only while it is in the viewport. This stops the four process
 * videos (and the about video) from all downloading and decoding at once.
 * Reduced-motion visitors see the poster instead of an autoplaying loop.
 */
export default function SmartVideo({
  src,
  poster,
  className = "",
  controls = false,
  muted = true,
}: SmartVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (inView && !reduced) {
      el.play().catch(() => {
        // Autoplay can be blocked (for example low-power mode). The poster
        // stays visible and the visitor can still use the controls.
      });
    } else {
      el.pause();
    }
  }, [inView, src]);

  return (
    <video
      ref={ref}
      muted={muted}
      loop
      playsInline
      preload="none"
      poster={poster}
      controls={controls}
      className={className}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
