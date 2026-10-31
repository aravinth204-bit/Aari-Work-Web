"use client";

import { useState, useRef, ReactNode, MouseEvent } from "react";

interface TiltSpotlightCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  ariaLabel?: string;
}

export default function TiltSpotlightCard({
  children,
  className = "",
  maxTilt = 7,
  onClick,
  ariaLabel,
}: TiltSpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState("");
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate 3D tilt angles based on cursor offset
    const tiltX = ((y - centerY) / centerY) * -maxTilt;
    const tiltY = ((x - centerX) / centerX) * maxTilt;

    setTransformStyle(
      `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025)`
    );

    // Spotlight position as percentages
    setSpotlightPos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    // Return smoothly to flat resting state
    setTransformStyle("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    setSpotlightPos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.(e as unknown as MouseEvent<HTMLDivElement>);
        }
      }}
      style={{
        transform: transformStyle,
        transition: "transform 450ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 450ms cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      className={`relative overflow-hidden cursor-pointer select-none will-change-transform ${className}`}
    >
      {children}

      {/* Dynamic Golden Spotlight Halo */}
      <div
        className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
        style={{
          opacity: spotlightPos.opacity,
          background: `radial-gradient(320px circle at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(216, 193, 154, 0.28), rgba(176, 138, 87, 0.12) 40%, transparent 75%)`,
        }}
      />
    </div>
  );
}

