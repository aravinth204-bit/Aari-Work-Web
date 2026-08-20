"use client";

import { useEffect, useRef, useState } from "react";

interface ThreadDividerProps {
  className?: string;
  variant?: "curve-right" | "curve-left" | "wave";
}

export default function ThreadDivider({
  className = "",
  variant = "curve-right",
}: ThreadDividerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [pathLength, setPathLength] = useState(0);

  useEffect(() => {
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength();
      setPathLength(len);
    }

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // SVG Paths for organic, elegant hand-drawn embroidery thread curves
  const paths = {
    "curve-right":
      "M 10 25 C 120 5, 240 45, 360 20 C 480 -5, 600 40, 720 22 C 840 5, 950 30, 1080 20",
    "curve-left":
      "M 10 20 C 140 40, 260 5, 390 28 C 520 48, 650 10, 780 32 C 900 12, 1000 35, 1080 22",
    wave:
      "M 10 28 C 150 10, 300 42, 450 20 C 600 2, 750 38, 900 18 C 1000 30, 1050 15, 1080 25",
  };

  const selectedPath = paths[variant];

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden py-4 flex items-center justify-center pointer-events-none select-none ${className}`}
    >
      <div className="max-w-6xl w-full px-4 flex items-center justify-center">
        <svg
          viewBox="0 0 1090 45"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto max-h-12 overflow-visible opacity-70"
        >
          {/* Main Decorative Handcrafted Embroidery Thread */}
          <path
            ref={pathRef}
            d={selectedPath}
            stroke="#B08A57"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: pathLength || 1000,
              strokeDashoffset: isVisible ? 0 : pathLength || 1000,
              transition: isVisible
                ? "stroke-dashoffset 2.2s cubic-bezier(0.37, 0, 0.63, 1)"
                : "none",
            }}
            className="motion-reduce:!stroke-dashoffset-0 motion-reduce:!transition-none"
          />

          {/* Tiny Decorative Needlepoint / Gold Motif Bullet at end */}
          <g
            style={{
              opacity: isVisible ? 1 : 0,
              transition: "opacity 0.6s ease-in 1.8s",
            }}
            className="motion-reduce:!opacity-100 motion-reduce:!transition-none"
          >
            <circle cx="1080" cy="20" r="2.5" fill="#D8C19A" />
            <polygon
              points="1080,14 1082,18 1086,20 1082,22 1080,26 1078,22 1074,20 1078,18"
              fill="#B08A57"
              opacity="0.8"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
