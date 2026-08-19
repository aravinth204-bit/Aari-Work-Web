"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFading, setIsFading] = useState(false);

  const handleFinish = () => {
    if (isFading) return;
    setIsFading(true);
    setTimeout(() => {
      setIsLoading(false);
      document.body.style.overflow = "";
    }, 700);
  };

  useEffect(() => {
    // Lock scrolling while preloader is visible
    document.body.style.overflow = "hidden";

    // Auto-dismiss preloader after 2.2s
    const timer = setTimeout(() => {
      handleFinish();
    }, 2200);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] h-[100dvh] w-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#160409] via-[#2b0c15] to-[#160409] text-white select-none transition-opacity duration-700 ease-in-out ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Radial Gold Ambient Backlight Glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_rgba(201,162,39,0.18)_0%,_transparent_65%)]" />

      <div className="relative z-10 flex flex-col items-center justify-center px-4">
        {/* Glowing Aura & Rotating Decorative Gold Ring */}
        <div className="relative flex items-center justify-center">
          {/* Outer Pulsing Aura Ring */}
          <div className="absolute w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full border border-[#c9a227]/20 animate-ping opacity-20" />

          {/* Animated Gold Dash Ring */}
          <div className="absolute w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full border-2 border-dashed border-[#c9a227]/50 animate-[spin_12s_linear_infinite]" />

          {/* Icon Container with Gold Glow */}
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-[#c9a227] shadow-[0_0_50px_rgba(201,162,39,0.4)] bg-[#3d0a15] p-3.5 sm:p-4 flex items-center justify-center">
            <Image
              src="/icon.png"
              alt="Sri Aari Creatives Logo"
              width={160}
              height={160}
              priority
              className="w-full h-full object-contain animate-pulse"
            />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-8 sm:mt-10 w-44 sm:w-56 md:w-64 h-1 sm:h-1.5 bg-white/10 rounded-full overflow-hidden relative shadow-[0_0_15px_rgba(201,162,39,0.3)]">
          <div
            className="h-full bg-gradient-to-r from-[#c9a227] via-[#fce68a] to-[#c9a227] rounded-full transition-all duration-300 shadow-[0_0_10px_#e8c85a]"
            style={{
              animation: "preloaderProgress 2s ease-in-out forwards",
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes preloaderProgress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
