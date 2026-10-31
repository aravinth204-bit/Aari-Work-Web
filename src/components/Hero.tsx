"use client";

import HeroMedia from "@/components/HeroMedia";
import { site } from "@/lib/site";
import { useI18n } from "@/lib/i18n";

export default function Hero() {
  const { locale, t } = useI18n();

  const proof = [
    { value: "2,500+", label: locale === "ta" ? "மணப்பெண்கள்" : "Brides dressed" },
    { value: "100%", label: locale === "ta" ? "கைவினை வேலை" : "Hand-worked" },
    { value: locale === "ta" ? "அனைத்து ஊர்களுக்கும்" : "All-India", label: locale === "ta" ? "டெலிவரி" : "Delivery" },
  ];

  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-[#F8F3EC]">
      {/* Background Subtle Golden Radial Spotlight */}
      <div
        className="pointer-events-none absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-35 blur-[120px]"
        style={{
          background: "radial-gradient(circle, rgba(176,138,87,0.35) 0%, rgba(248,243,236,0) 70%)",
        }}
        aria-hidden="true"
      />

      <div className="mx-auto grid min-h-[100dvh] max-w-6xl items-center gap-12 px-4 pb-16 pt-28 md:grid-cols-[1.05fr_0.95fr] md:gap-8 md:pb-20 md:pt-24">
        {/* Copy column with MotionSites Staggered Blur-Rise Choreography */}
        <div className="relative z-10">
          {/* Eyebrow Badge with MotionSites Liquid-Glass Rim */}
          <div
            className="motion-blur-rise inline-block"
            style={{ "--delay": "100ms" } as React.CSSProperties}
          >
            <p className="liquid-flex inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold text-[#3A2025] liquid-glass">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0F7A6C] animate-pulse" aria-hidden="true" />
              {locale === "ta" ? `${site.city}-ல் கைவண்ணம்` : `Handcrafted in ${site.city}`}
            </p>
          </div>

          {/* Headline with Staggered Blur-Rise */}
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

          {/* Subheading with Motion Fade-Rise */}
          <p
            className="motion-fade-rise mt-6 max-w-md text-base leading-relaxed text-[#3A2025]/85 font-normal"
            style={{ "--delay": "420ms" } as React.CSSProperties}
          >
            {locale === "ta"
              ? `மணப்பெண் மற்றும் விசேஷங்களுக்கான தங்க ஜரி, குந்தன் மற்றும் மணி வேலைப்பாடுகள் — ${site.owner} மற்றும் குழுவினரால் நேர்த்தியாக வடிவமைக்கப்படுகிறது.`
              : `Bridal and party-wear blouses in gold zari, kundan and bead — hand-worked by ${site.owner} and her team, with a fitting trial before delivery.`}
          </p>

          {/* CTA Actions with Liquid Glass + Solid Inverse */}
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
              className="liquid-glass rounded-full px-6 py-3.5 text-sm font-medium text-[#3A2025] transition-all duration-300 hover:scale-[1.02] hover:bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B2638] focus-visible:ring-offset-2 shadow-xs"
            >
              {t("hero.cta_gallery")}
            </a>
          </div>

          {/* Social Proof Strip with Glass Badges */}
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

        {/* Aari hoop column with MotionSites Settle-Zoom & Golden Glow Pulse */}
        <div className="relative">
          <div className="motion-settle-zoom relative mx-auto aspect-square w-full max-w-[520px]">
            {/* SVG Embroidery Frame */}
            <svg
              viewBox="0 0 200 200"
              className="hoop-stitch absolute -inset-6 h-[calc(100%+3rem)] w-[calc(100%+3rem)] text-[#B08A57]"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="100"
                cy="100"
                r="95"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="3 6"
                opacity="0.75"
              />
              <circle
                className="hoop-arc"
                cx="100"
                cy="100"
                r="95"
                stroke="#6B2638"
                strokeWidth="2.5"
                strokeLinecap="round"
                transform="rotate(-90 100 100)"
              />
            </svg>

            {/* Glowing Video Frame */}
            <div className="hoop-glow absolute inset-0 overflow-hidden rounded-full bg-[#3A2025] ring-[7px] ring-[#3A2025] md:ring-[10px] transition-all duration-700">
              <HeroMedia />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
