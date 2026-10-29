import Image from "next/image";
import { site } from "@/lib/site";

const proof = [
  { value: "2,500+", label: "Brides dressed" },
  { value: "100%", label: "Hand-worked" },
  { value: "All-India", label: "Delivery" },
];

export default function Hero() {
  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-[#F8F3EC]">
      <div className="mx-auto grid min-h-[100dvh] max-w-6xl items-center gap-12 px-4 pb-16 pt-28 md:grid-cols-[1.05fr_0.95fr] md:gap-8 md:pb-20 md:pt-24">
        {/* Copy column */}
        <div className="relative z-10">
          <p className="hero-animate-eyebrow inline-flex items-center gap-2 rounded-full border border-[#3A2025]/15 bg-[#FFFFFF]/60 px-3.5 py-1.5 text-xs font-medium text-[#3A2025]/80 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1F4E4A]" aria-hidden="true" />
            Hand-stitched in {site.city}
          </p>

          <h1 className="hero-animate-heading mt-6 text-balance font-serif-display text-[clamp(2.15rem,6.2vw,4rem)] leading-[1] tracking-[-0.02em] text-[#3A2025]">
            Heirloom aari work,
            <br />
            <em className="font-normal italic">stitched to your measure.</em>
          </h1>

          <p className="hero-animate-paragraph mt-6 max-w-md text-base leading-relaxed text-[#3A2025]/80">
            Bridal and party-wear blouses in gold zari, kundan and bead — hand-worked by{" "}
            {site.owner} and her team, with a fitting trial before delivery.
          </p>

          <div className="hero-animate-cta-primary mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#enquiry"
              className="rounded-full bg-[#6B2638] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#541D2B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B2638] focus-visible:ring-offset-2"
            >
              Get a quote
            </a>
            <a
              href="#gallery"
              className="rounded-full border border-[#3A2025]/25 px-6 py-3 text-sm font-medium text-[#3A2025] transition hover:border-[#3A2025]/60 hover:bg-[#FFFFFF]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B2638] focus-visible:ring-offset-2"
            >
              See recent work
            </a>
          </div>

          <dl className="hero-animate-cta-secondary mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-[#3A2025]/10 pt-6">
            {proof.map((item) => (
              <div key={item.label}>
                <dt className="text-[11px] text-[#3A2025]/70">{item.label}</dt>
                <dd className="mt-0.5 font-serif-display text-xl text-[#3A2025]">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Aari hoop column */}
        <div className="relative">
          <div className="relative mx-auto aspect-square w-full max-w-[520px]">
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

            <div className="absolute inset-0 overflow-hidden rounded-full bg-[#3A2025] shadow-[0_36px_90px_-32px_rgba(58,32,37,0.55)] ring-[7px] ring-[#3A2025] md:ring-[10px]">
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                poster="/images/hero_aari_artisan.webp"
                aria-hidden="true"
                className="h-full w-full object-cover motion-reduce:hidden"
              >
                <source src="/videos/hero_background_mobile.mp4" type="video/mp4" media="(max-width: 767px)" />
                <source src="/videos/hero_background.mp4" type="video/mp4" />
              </video>

              <Image
                src="/images/hero_aari_artisan.webp"
                alt="Artisan hand-stitching aari work on a wooden frame"
                fill
                priority
                sizes="(max-width: 768px) 90vw, 520px"
                className="hidden object-cover motion-reduce:block"
              />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#3A2025]/55 via-transparent to-transparent" />

              <p className="absolute inset-x-0 bottom-9 text-center text-[11px] tracking-[0.18em] text-[#F8F3EC]/90">
                Gold zari · Kundan · Bead
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
