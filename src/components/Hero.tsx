"use client";

import { useEffect, useRef, useState } from "react";
import HeroMedia from "@/components/HeroMedia";
import { site } from "@/lib/site";
import { useI18n } from "@/lib/i18n";

interface HeroHoopPortalProps {
  onScrollToGallery?: () => void;
}

export default function HeroHoopPortal({ onScrollToGallery }: HeroHoopPortalProps) {
  const { locale, t } = useI18n();
  const heroRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const proof = [
    { value: "2,500+", label: locale === "ta" ? "மணப்பெண்கள்" : "Brides dressed" },
    { value: "100%", label: locale === "ta" ? "கைவினை வேலை" : "Hand-worked" },
    { value: locale === "ta" ? "அனைத்து ஊர்களுக்கும்" : "All-India", label: locale === "ta" ? "டெலிவரி" : "Delivery" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const heroEl = heroRef.current;
      if (!heroEl) return;

      const rect = heroEl.getBoundingClientRect();
      const heroHeight = rect.height || window.innerHeight;

      // Progress starts as user scrolls past initial viewport until bottom of hero
      const scrollY = -rect.top;
      const progress = scrollY / (heroHeight * 0.75);
      const clamped = Math.max(0, Math.min(1, progress));

      setScrollProgress(clamped);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll helper when clicking portal button
  const handlePortalClick = () => {
    const gallerySection = document.getElementById("gallery");
    if (gallerySection) {
      gallerySection.scrollIntoView({ behavior: "smooth" });
    }
    if (onScrollToGallery) onScrollToGallery();
  };

  // Interpolated visual values:
  // As user scrolls:
  // - Hero text fades & translates slightly left
  // - Aari Hoop scale expands from 1.0 to 1.35
  // - Inner glow deepens with gold shimmer
  const textOpacity = Math.max(0, 1 - scrollProgress * 1.6);
  const textTranslateX = -scrollProgress * 40;
  const hoopScale = 1 + scrollProgress * 0.28;
  const portalGlow = scrollProgress * 0.55;

  return (
    <section ref={heroRef} className="relative min-h-[100dvh] overflow-hidden bg-[#F8F3EC]">
      {/* Background Subtle Golden Radial Spotlight */}
      <div
        className="pointer-events-none absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-35 blur-[120px]"
        style={{
          background: "radial-gradient(circle, rgba(176,138,87,0.35) 0%, rgba(248,243,236,0) 70%)",
        }}
        aria-hidden="true"
      />

      {/* Dynamic Golden Ring Portal Ray (Reveals when scrolling down towards Gallery) */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-48 rounded-t-full transition-opacity duration-300 blur-3xl"
        style={{
          opacity: scrollProgress,
          background: "radial-gradient(ellipse at bottom, rgba(176,138,87,0.3) 0%, rgba(107,38,56,0.15) 50%, transparent 80%)",
        }}
        aria-hidden="true"
      />

      <div className="mx-auto grid min-h-[100dvh] max-w-6xl items-center gap-12 px-4 pb-16 pt-28 md:grid-cols-[1.05fr_0.95fr] md:gap-8 md:pb-20 md:pt-24 relative z-10">
        
        {/* Copy Column: Transitions softly on scroll */}
        <div
          className="relative z-10 transition-transform duration-100 ease-out will-change-transform"
          style={{
            opacity: textOpacity,
            transform: `translateX(${textTranslateX}px)`,
          }}
        >
          {/* Eyebrow Badge */}
          <div
            className="motion-blur-rise inline-block"
            style={{ "--delay": "100ms" } as React.CSSProperties}
          >
            <p className="liquid-flex inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold text-[#3A2025] liquid-glass">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0F7A6C] animate-pulse" aria-hidden="true" />
              {locale === "ta" ? `${site.city}-ல் கைவண்ணம்` : `Handcrafted in ${site.city}`}
            </p>
          </div>

          {/* Headline */}
          <h1
            className="motion-blur-rise mt-6 text-balance font-serif-display text-[clamp(2.35rem,6.4vw,4.2rem)] leading-[1.05] tracking-[-0.02em] text-[#3A2025]"
            style={{ "--delay": "250ms" } as React.CSSProperties}
          >
            {locale === "ta" ? (
              <>
                பாரம்பரிய ஆரி கலை,
                <br />
                <em className="font-normal italic text-[#6B2638]">உங்கள் அளவுக்கு ஏற்ப.</em>
              </>
            ) : (
              <>
                Heirloom aari work,
                <br />
                <em className="font-normal italic text-[#6B2638]">stitched to your measure.</em>
              </>
            )}
          </h1>

          {/* Subheading */}
          <p
            className="motion-fade-rise mt-6 max-w-md text-base leading-relaxed text-[#3A2025]/85 font-normal"
            style={{ "--delay": "420ms" } as React.CSSProperties}
          >
            {locale === "ta"
              ? `மணப்பெண் மற்றும் விசேஷங்களுக்கான தங்க ஜரி, குந்தன் மற்றும் மணி வேலைப்பாடுகள் — ${site.owner} மற்றும் குழுவினரால் நேர்த்தியாக வடிவமைக்கப்படுகிறது.`
              : `Bridal and party-wear blouses in gold zari, kundan and bead — hand-worked by ${site.owner} and her team, with a fitting trial before delivery.`}
          </p>

          {/* CTA Actions */}
          <div
            className="motion-fade-rise mt-8 flex flex-wrap items-center gap-3.5"
            style={{ "--delay": "600ms" } as React.CSSProperties}
          >
            <a
              href="#enquiry"
              className="group relative inline-flex items-center justify-center rounded-full bg-[#6B2638] px-7 py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-[#541D2B] hover:shadow-lg hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B2638] focus-visible:ring-offset-2"
            >
              <span>{t("hero.cta_enquiry")}</span>
              <span className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </a>
            <a
              href="#gallery"
              onClick={handlePortalClick}
              className="liquid-glass rounded-full px-6 py-3.5 text-sm font-medium text-[#3A2025] transition-all duration-300 hover:scale-[1.02] hover:bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B2638] focus-visible:ring-offset-2 shadow-xs cursor-pointer"
            >
              {t("hero.cta_gallery")}
            </a>
          </div>

          {/* Social Proof */}
          <dl
            className="motion-fade-rise mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-[#3A2025]/12 pt-6"
            style={{ "--delay": "750ms" } as React.CSSProperties}
          >
            {proof.map((item) => (
              <div key={item.label} className="space-y-0.5">
                <dt className="text-[11px] font-medium uppercase tracking-wider text-[#3A2025]/60">
                  {item.label}
                </dt>
                <dd className="font-serif-display text-2xl font-bold text-[#3A2025]">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Option 2: The Aari Hoop Portal (Expands & morphs into the gallery window on scroll) */}
        <div className="relative flex items-center justify-center">
          <div
            className="motion-settle-zoom relative mx-auto aspect-square w-full max-w-[520px] will-change-transform"
            style={{
              transform: `scale(${hoopScale}) translateY(${scrollProgress * 30}px)`,
              transition: "transform 80ms ease-out",
            }}
          >
            {/* SVG Embroidery Frame with Morph Stitches */}
            <svg
              viewBox="0 0 200 200"
              className="hoop-stitch absolute -inset-6 h-[calc(100%+3rem)] w-[calc(100%+3rem)] text-[#B08A57]"
              fill="none"
              aria-hidden="true"
              style={{
                transform: `rotate(${scrollProgress * 45}deg)`,
                transition: "transform 100ms ease-out",
              }}
            >
              <circle
                cx="100"
                cy="100"
                r="95"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeDasharray="3 6"
                opacity="0.8"
              />
              <circle
                className="hoop-arc"
                cx="100"
                cy="100"
                r="95"
                stroke="#6B2638"
                strokeWidth={2.5 + scrollProgress * 1.5}
                strokeLinecap="round"
                transform="rotate(-90 100 100)"
                style={{
                  strokeDashoffset: 600 * (1 - scrollProgress * 0.3),
                }}
              />
            </svg>

            {/* Glowing Circular Video Frame (Expands like a magnifying lens portal) */}
            <div
              className="hoop-glow absolute inset-0 overflow-hidden rounded-full bg-[#3A2025] ring-[7px] ring-[#3A2025] md:ring-[10px] transition-all duration-300"
              style={{
                boxShadow: `0 ${20 + scrollProgress * 30}px ${50 + scrollProgress * 40}px -15px rgba(58, 32, 37, ${0.35 + portalGlow * 0.4}), 0 0 ${30 + scrollProgress * 40}px 5px rgba(176, 138, 87, ${0.25 + portalGlow * 0.5})`,
              }}
            >
              <HeroMedia />
            </div>

            {/* Ambient Gold Particle Ring floating around the hoop */}
            <div
              className="absolute -inset-4 rounded-full pointer-events-none transition-opacity duration-300"
              style={{
                opacity: scrollProgress > 0.15 ? Math.min(1, scrollProgress * 1.5) : 0,
                border: "1.5px dashed rgba(176, 138, 87, 0.45)",
                transform: `rotate(${-scrollProgress * 60}deg)`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Seamless Curved Edge Transition into Gallery Section */}
      <div className="relative w-full overflow-hidden leading-none z-20 pointer-events-none -mt-8 md:-mt-12">
        <svg
          viewBox="0 0 1440 90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-12 md:h-20 text-[#F8F3EC] fill-current preserve-3d"
        >
          <path d="M 0,0 C 480,80 960,80 1440,0 L 1440,90 L 0,90 Z" />
        </svg>
      </div>
    </section>
  );
}
