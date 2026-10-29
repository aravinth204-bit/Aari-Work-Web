"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { site } from "@/lib/site";
import { useMounted } from "@/lib/use-mounted";
import { useFocusTrap } from "@/lib/use-focus-trap";
import SmartVideo from "@/components/SmartVideo";

export interface StepItem {
  n: string;
  t: string;
  sub: string;
  d: string;
  mediaType: "image" | "video";
  mediaSrc: string;
  poster?: string;
  badge: string;
  icon: string;
  highlightText: string;
}

export const processSteps: StepItem[] = [
  {
    n: "01",
    t: "Design Selection",
    sub: "Browse & Choose",
    d: "Gallery-ல் உள்ள டிசைன் அல்லது உங்கள் Instagram / Pinterest reference photo-வை Select பண்ணுங்க.",
    mediaType: "video",
    mediaSrc: "/videos/step-1.mp4",
    poster: "/images/hero_aari_work.jpg",
    badge: "Step 01 • Design Choice",
    icon: "📱",
    highlightText: "Ungalukku pidicha reference photo thandha, adhe maari exact-a panni tharom!",
  },
  {
    n: "02",
    t: "Exact Measurement",
    sub: "In-Shop or WhatsApp",
    d: "Studio-க்கு நேரில் வரலாம் அல்லது எங்கள் WhatsApp Measurement Chart மூலமாக துல்லியமான அளவுகள் தரலாம்.",
    mediaType: "video",
    mediaSrc: "/videos/step-2.mp4",
    poster: "/images/process-step-2-poster.webp",
    badge: "Step 02 • Precision Fit",
    icon: "📏",
    highlightText: "100% Perfect fitting guarantee - Local customers-ku oru trial free!",
  },
  {
    n: "03",
    t: "Artisan Handcrafted",
    sub: "Live Photo Updates",
    d: "அனுபவம் வாய்ந்த கலைஞர்கள் கையால் நுணுக்கமாக தைப்பார்கள். WhatsApp-ல் Work Progress Photo Updates அனுப்புவோம்.",
    mediaType: "video",
    mediaSrc: "/videos/step-3.mp4",
    poster: "/images/Img-1.webp",
    badge: "Step 03 • Live Stitching",
    icon: "🪡",
    highlightText: "Live artisan needlework on wooden frame with original beads, stones & zari.",
  },
  {
    n: "04",
    t: "Trial & Safe Delivery",
    sub: "On-Time Doorstep",
    d: "Trial + Finishing முடித்து உங்கள் தேவைப்படும் தேதிக்கு On-time direct delivery அல்லது Courier வசதி.",
    mediaType: "video",
    mediaSrc: "/videos/step-4.mp4",
    poster: "/images/hero_aari_artisan.webp",
    badge: "Step 04 • Safe Delivery",
    icon: "🎁",
    highlightText: "Neat finishing & double quality check before courier delivery.",
  },
];

export default function InteractiveProcess() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalStepIndex, setModalStepIndex] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const mounted = useMounted();
  const dialogRef = useRef<HTMLDivElement>(null);

  const closeProcessModal = useCallback(() => setModalStepIndex(null), []);

  useFocusTrap(dialogRef, modalStepIndex !== null, closeProcessModal);

  // Lock body scroll when process modal is open
  useEffect(() => {
    if (modalStepIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalStepIndex]);

  // Auto-play step timer for desktop preview. Pauses on hover, while the modal
  // is open, when the visitor turns it off, and for reduced-motion visitors.
  useEffect(() => {
    if (!autoPlay || isHovered || modalStepIndex !== null) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % processSteps.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [autoPlay, isHovered, modalStepIndex]);

  const activeStep = processSteps[activeIndex];

  return (
    <div>
      {/* MOBILE VIEW: Vertical Story/Video Cards (matching reference layout) */}
      <div className="flex flex-col gap-6 lg:hidden">
        {processSteps.map((step, index) => (
          <a
            key={step.n}
            href={step.mediaSrc}
            onClick={(e) => {
              e.preventDefault();
              setModalStepIndex(index);
            }}
            className="relative block w-full aspect-[3/4] sm:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-[#D8C19A] bg-[#3A2025] cursor-pointer group text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B08A57] focus-visible:ring-offset-2"
          >
            {/* Background Video */}
            <SmartVideo
              src={step.mediaSrc}
              poster={step.poster}
              className="w-full h-full object-cover"
            />

            {/* Dark Gradient Overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#3A2025]/95 via-[#3A2025]/45 to-black/30" />

            {/* Top Header: Step Badge & Expand Hint */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
              <span className="h-9 w-9 rounded-full bg-[#B08A57] text-[#3A2025] flex items-center justify-center font-serif-display text-sm font-bold shadow-lg ring-2 ring-white/40">
                {step.n}
              </span>
              <span className="rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-[11px] text-[#D8C19A] font-medium border border-white/20 shadow-md">
                Tap to expand
              </span>
            </div>

            {/* Bottom Overlay: Category, Title, Subtitle & Explanation Text */}
            <div className="absolute inset-x-0 bottom-0 p-5 text-white z-10 text-left">
              <span className="inline-block rounded-md bg-[#6B2638] px-2.5 py-0.5 text-[10px] font-semibold text-[#D8C19A] mb-1.5 ring-1 ring-[#D8C19A]/30">
                Step {step.n} · {step.sub}
              </span>
              <h3 className="font-serif-display text-xl sm:text-2xl text-white font-bold leading-tight">
                {step.t}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-white/90 font-light leading-relaxed">
                {step.d}
              </p>

              <div className="mt-3.5 flex items-center justify-between text-xs text-[#D8C19A] font-medium pt-2.5 border-t border-white/15">
                <span>{step.highlightText}</span>
                <span className="text-base" aria-hidden="true">→</span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* DESKTOP VIEW: 4 Step Interactive Stepper */}
      <div
        className="hidden lg:grid lg:grid-cols-12 gap-8 items-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
      >
        {/* LEFT COLUMN: 4 Step Buttons / Interactive List */}
        <div className="lg:col-span-5 flex flex-col gap-3 relative">
          {/* Connecting Vertical Stepper Line */}
          <div className="absolute left-[26px] top-6 bottom-6 w-0.5 bg-[#D8C19A] -z-0" />

          {processSteps.map((step, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                type="button"
                key={step.n}
                aria-pressed={isActive}
                onClick={() => setActiveIndex(index)}
                className={`group relative text-left p-5 rounded-3xl border transition-all duration-300 z-10 flex items-start gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B2638] focus-visible:ring-offset-2 ${
                  isActive
                    ? "bg-[#6B2638] text-white border-[#6B2638] shadow-xl scale-[1.02]"
                    : "bg-[#FFFFFF] text-[#3A2025] border-[#D8C19A] hover:border-[#B08A57] hover:bg-[#F1E7DC]"
                }`}
              >
                {/* Step Number Circle / Badge */}
                <div
                  className={`shrink-0 h-12 w-12 rounded-2xl grid place-items-center font-serif-display text-base font-bold transition-all ${
                    isActive
                      ? "bg-[#D8C19A] text-[#3A2025] shadow-md ring-2 ring-white/30"
                      : "bg-[#F1E7DC] text-[#6B2638] group-hover:bg-[#6B2638] group-hover:text-white"
                  }`}
                >
                  {step.n}
                </div>

                {/* Step Title & Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[11px] font-medium ${
                        isActive ? "text-[#D8C19A]" : "text-gold-deep"
                      }`}
                    >
                      {step.sub}
                    </span>
                  </div>

                  <h3
                    className={`font-serif-display text-lg font-medium mt-0.5 leading-tight ${
                      isActive ? "text-white" : "text-[#3A2025]"
                    }`}
                  >
                    {step.t}
                  </h3>

                  <p
                    className={`mt-1 text-sm font-light leading-relaxed line-clamp-2 ${
                      isActive ? "text-white/85" : "text-[#3A2025]/80"
                    }`}
                  >
                    {step.d}
                  </p>
                </div>

                {/* Active Pointer Arrow Indicator */}
                {isActive && (
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-l-8 border-l-[#6B2638]" />
                )}
              </button>
            );
          })}
        </div>

        {/* RIGHT COLUMN: Dynamic Media Display Screen */}
        <div className="lg:col-span-7">
          <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden shadow-2xl ring-1 ring-[#D8C19A] bg-[#3A2025] group">
            {/* Dynamic Media rendering */}
            <SmartVideo
              key={activeStep.mediaSrc}
              src={activeStep.mediaSrc}
              poster={activeStep.poster}
              className="w-full h-full object-cover transition-all duration-700 animate-fadeIn"
            />

            {/* Dark Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

            {/* Top Badge: Step Counter & Tag */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
              <span className="rounded-full bg-[#6B2638]/90 backdrop-blur-md px-3.5 py-1 text-xs font-semibold text-[#D8C19A] ring-1 ring-[#D8C19A]/40 shadow-md">
                {activeStep.badge}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAutoPlay((value) => !value);
                  }}
                  aria-pressed={!autoPlay}
                  className="rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-medium text-white/90 border border-white/20 hover:bg-black/80 transition"
                >
                  {autoPlay ? "⏸ Pause tour" : "▶ Play tour"}
                </button>
                <button
                  type="button"
                  onClick={() => setModalStepIndex(activeIndex)}
                  className="rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-xs text-white/90 font-mono border border-white/20 hover:bg-black/80 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Expand ({activeIndex + 1} / {processSteps.length})
                </button>
              </div>
            </div>

            {/* Bottom Info Overlay */}
            <div className="absolute inset-x-0 bottom-0 p-7 text-white z-10">
              <span className="text-xs font-medium text-[#D8C19A]">
                {activeStep.sub}
              </span>
              <h2 className="font-serif-display text-3xl text-white mt-1">
                {activeStep.t}
              </h2>
              <p className="mt-2 text-sm text-white/85 font-light leading-relaxed max-w-xl">
                {activeStep.highlightText}
              </p>

              {/* Quick Action Button inside preview */}
              <div className="mt-4 flex items-center gap-3">
                <a
                  href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
                    `Hi! I want to start ${activeStep.t} (${activeStep.sub}) for my blouse.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="cta-shimmer inline-flex items-center gap-2 rounded-full bg-[#6B2638] px-5 py-2 text-xs font-semibold text-white hover:bg-[#541D2B] active:scale-95 transition shadow-md"
                >
                  <span>Start Step {activeStep.n} on WhatsApp</span>
                  <span>→</span>
                </a>
              </div>
            </div>

            {/* Progress Indicator Bar at bottom */}
            <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20">
              <div
                className="h-full bg-[#B08A57] transition-all duration-300"
                style={{ width: `${((activeIndex + 1) / processSteps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* FULLSCREEN VIDEO LIGHTBOX MODAL (using React createPortal at document.body) */}
      {mounted && modalStepIndex !== null && createPortal(
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Process step ${processSteps[modalStepIndex].n}: ${processSteps[modalStepIndex].t}`}
          tabIndex={-1}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeProcessModal();
          }}
          className="fixed inset-0 z-[200] bg-[#3A2025]/98 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6 overflow-hidden animate-fadeIn text-white focus:outline-none"
        >
          {/* Top Controls Bar */}
          <div className="flex items-center justify-between text-white z-20 gap-2 shrink-0 pt-2 sm:pt-0">
            <div className="flex items-center gap-2">
              <span className="h-8 w-8 rounded-full bg-[#B08A57] text-[#3A2025] flex items-center justify-center font-serif-display text-xs font-bold shadow-md">
                {processSteps[modalStepIndex].n}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-[#D8C19A]">
                Step {modalStepIndex + 1} / {processSteps.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted((m) => !m)}
                className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/30 transition flex items-center gap-1 border border-white/15"
              >
                <span>{isMuted ? "Muted" : "Sound on"}</span>
              </button>
              <button
                onClick={() => closeProcessModal()}
                data-autofocus
                className="rounded-full bg-[#6B2638] hover:bg-[#541D2B] h-10 w-10 sm:h-11 sm:w-11 flex items-center justify-center text-white text-lg sm:text-xl font-bold shadow-2xl ring-2 ring-[#D8C19A] active:scale-90 transition-all shrink-0"
                aria-label="Close Video"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Main Video Workspace */}
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) closeProcessModal();
            }}
            className="relative flex-1 flex items-center justify-center overflow-hidden my-2 sm:my-4"
          >
            {/* Prev Step Button */}
            <button
              onClick={() => setModalStepIndex((prev) => (prev! > 0 ? prev! - 1 : processSteps.length - 1))}
              className="absolute left-1 sm:left-4 z-20 h-10 w-10 sm:h-12 sm:w-12 grid place-items-center rounded-full bg-[#3A2025]/90 text-white hover:bg-[#6B2638] border border-white/20 transition shadow-xl active:scale-90"
              aria-label="Previous Step"
            >
              ‹
            </button>

            {/* Video Frame */}
            <div className="relative max-w-4xl w-full h-full max-h-[65vh] sm:max-h-[75vh] flex items-center justify-center rounded-2xl overflow-hidden ring-1 ring-[#D8C19A] bg-black">
              <video
                key={processSteps[modalStepIndex].mediaSrc}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                controls
                poster={processSteps[modalStepIndex].poster}
                className="w-full h-full object-contain"
              >
                <source src={processSteps[modalStepIndex].mediaSrc} type="video/mp4" />
              </video>
            </div>

            {/* Next Step Button */}
            <button
              onClick={() => setModalStepIndex((prev) => (prev! < processSteps.length - 1 ? prev! + 1 : 0))}
              className="absolute right-1 sm:right-4 z-20 h-10 w-10 sm:h-12 sm:w-12 grid place-items-center rounded-full bg-[#3A2025]/90 text-white hover:bg-[#6B2638] border border-white/20 transition shadow-xl active:scale-90"
              aria-label="Next Step"
            >
              ›
            </button>
          </div>

          {/* Bottom Footer Info & WhatsApp CTA */}
          <div className="max-w-4xl mx-auto w-full bg-[#3A2025]/95 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 ring-1 ring-[#D8C19A]/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-white z-20 shrink-0">
            <div className="text-left w-full sm:w-auto">
              <span className="text-[10px] sm:text-[11px] text-[#D8C19A] font-semibold">
                {processSteps[modalStepIndex].sub}
              </span>
              <h3 className="font-serif-display text-base sm:text-lg text-white mt-0.5">
                Step {processSteps[modalStepIndex].n}: {processSteps[modalStepIndex].t}
              </h3>
              <p className="text-xs text-white/85 font-light mt-0.5 max-w-xl">
                {processSteps[modalStepIndex].d}
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => closeProcessModal()}
                className="sm:hidden px-4 py-2.5 rounded-full bg-white/15 text-xs text-white font-medium hover:bg-white/25 active:scale-95 transition"
              >
                ✕ Close
              </button>
              <a
                href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
                  `Hi! I want to start ${processSteps[modalStepIndex].t} (${processSteps[modalStepIndex].sub}) for my blouse.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp px-5 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-whatsapp-hover active:scale-95 transition shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#3A2025]"
              >
                <span>Start Step {processSteps[modalStepIndex].n} on WhatsApp</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
