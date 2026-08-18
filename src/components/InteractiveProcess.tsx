"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { site } from "@/lib/site";

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
    poster: "/images/img-4.png",
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
    poster: "/images/Img-1.png",
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
    poster: "/images/hero_aari_artisan.jpg",
    badge: "Step 04 • Safe Delivery",
    icon: "🎁",
    highlightText: "Neat finishing & double quality check before courier delivery.",
  },
];


export default function InteractiveProcess() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStep = processSteps[activeIndex];

  // Auto-play step timer every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % processSteps.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid lg:grid-cols-12 gap-8 items-center">
      {/* LEFT COLUMN: 4 Step Buttons / Interactive List */}
      <div className="lg:col-span-5 flex flex-col gap-3 relative">
        {/* Connecting Vertical Stepper Line for Desktop */}
        <div className="hidden sm:block absolute left-[26px] top-6 bottom-6 w-0.5 bg-[#eadfcd] -z-0" />

        {processSteps.map((step, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={step.n}
              onClick={() => setActiveIndex(index)}
              className={`group relative text-left p-4 sm:p-5 rounded-2xl sm:rounded-3xl border transition-all duration-300 z-10 flex items-start gap-4 ${
                isActive
                  ? "bg-[#6b1226] text-white border-[#6b1226] shadow-xl scale-[1.02]"
                  : "bg-white text-neutral-800 border-[#eadfcd] hover:border-[#c9a227] hover:bg-[#fdf9f3]"
              }`}
            >
              {/* Step Number Circle / Badge */}
              <div
                className={`shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-2xl grid place-items-center font-serif-display text-sm sm:text-base font-bold transition-all ${
                  isActive
                    ? "bg-[#e8c85a] text-[#3d0a15] shadow-md ring-2 ring-white/30"
                    : "bg-[#f5ede2] text-[#6b1226] group-hover:bg-[#6b1226] group-hover:text-white"
                }`}
              >
                {step.n}
              </div>

              {/* Step Title & Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold ${
                      isActive ? "text-[#e8c85a]" : "text-[#c9a227]"
                    }`}
                  >
                    {step.sub}
                  </span>
                  <span className="text-base">{step.icon}</span>
                </div>

                <h3
                  className={`font-serif-display text-base sm:text-lg font-medium mt-0.5 leading-tight ${
                    isActive ? "text-white" : "text-[#6b1226]"
                  }`}
                >
                  {step.t}
                </h3>

                <p
                  className={`mt-1 text-xs sm:text-sm font-light leading-relaxed line-clamp-2 ${
                    isActive ? "text-white/85" : "text-neutral-600"
                  }`}
                >
                  {step.d}
                </p>
              </div>

              {/* Active Pointer Arrow Indicator */}
              {isActive && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-l-8 border-l-[#6b1226]" />
              )}
            </button>
          );
        })}
      </div>

      {/* RIGHT COLUMN: Dynamic Media Display Screen */}
      <div className="lg:col-span-7">
        <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full rounded-3xl overflow-hidden shadow-2xl ring-1 ring-[#eadfcd] bg-neutral-900 group">
          {/* Dynamic Media rendering (Image or Video) */}
          {activeStep.mediaType === "video" ? (
            <video
              key={activeStep.mediaSrc}
              autoPlay
              loop
              muted
              playsInline
              poster={activeStep.poster}
              className="w-full h-full object-cover transition-all duration-700 animate-fadeIn"
            >
              <source src={activeStep.mediaSrc} type="video/mp4" />
            </video>
          ) : (
            <Image
              key={activeStep.mediaSrc}
              src={activeStep.mediaSrc}
              alt={activeStep.t}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover transition-all duration-700 animate-fadeIn"
            />
          )}

          {/* Dark Overlay Gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

          {/* Top Badge: Step Counter & Tag */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <span className="rounded-full bg-[#6b1226]/90 backdrop-blur-md px-3.5 py-1 text-xs font-semibold text-[#e8c85a] ring-1 ring-[#e8c85a]/40 shadow-md">
              ✨ {activeStep.badge}
            </span>
            <span className="rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-xs text-white/90 font-mono border border-white/20">
              {activeIndex + 1} / {processSteps.length}
            </span>
          </div>

          {/* Bottom Info Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 text-white z-10">
            <span className="text-xs uppercase tracking-widest text-[#e8c85a] font-semibold">
              {activeStep.sub}
            </span>
            <h2 className="font-serif-display text-2xl sm:text-3xl text-white mt-1">
              {activeStep.t}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-white/85 font-light leading-relaxed max-w-xl">
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
                className="inline-flex items-center gap-2 rounded-full bg-[#c9a227] px-5 py-2 text-xs font-semibold text-[#3d0a15] hover:bg-[#e0b62e] active:scale-95 transition shadow-md"
              >
                <span>Start Step {activeStep.n} on WhatsApp</span>
                <span>→</span>
              </a>
            </div>
          </div>

          {/* Progress Indicator Bar at bottom */}
          <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20">
            <div
              className="h-full bg-[#e8c85a] transition-all duration-300"
              style={{ width: `${((activeIndex + 1) / processSteps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
