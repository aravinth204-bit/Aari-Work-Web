"use client";

import { useEffect, useRef, useState } from "react";
import SmartVideo from "@/components/SmartVideo";
import { site } from "@/lib/site";

const highlights = [
  "100% handmade aari & maggam work by Mithanya's team",
  "Free fitting trial for local customers",
  "All-India courier available",
  "Design confidentiality guaranteed",
];

export default function StudioSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [videoInView, setVideoInView] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener("change", handleMediaChange);

    // Track scroll progress inside this section
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // When top of container hits 80% from top of viewport, video appears
      if (rect.top <= windowHeight * 0.85) {
        setVideoInView(true);
      }

      // Compute normalized progress [0 to 1] through the section
      const totalDist = rect.height + windowHeight;
      const currentPos = windowHeight - rect.top;
      const progress = Math.max(0, Math.min(1, currentPos / totalDist));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, []);

  // Parallax calculations (disabled if prefers-reduced-motion)
  // Left video: reveals fast on enter, stays anchored with very slow subtle float
  const videoTranslateY = prefersReducedMotion ? 0 : (scrollProgress - 0.4) * 20;

  // Right side content layers: stagger parallax offsets
  const headerOffset = prefersReducedMotion ? 0 : Math.max(0, (0.45 - scrollProgress) * 70);
  const textOffset = prefersReducedMotion ? 0 : Math.max(0, (0.55 - scrollProgress) * 90);
  const listOffset = prefersReducedMotion ? 0 : Math.max(0, (0.65 - scrollProgress) * 110);

  // Dynamic opacities based on scroll
  const headerOpacity = prefersReducedMotion ? 1 : Math.min(1, Math.max(0, (scrollProgress - 0.15) * 4));
  const textOpacity = prefersReducedMotion ? 1 : Math.min(1, Math.max(0, (scrollProgress - 0.28) * 3.5));
  const listOpacity = prefersReducedMotion ? 1 : Math.min(1, Math.max(0, (scrollProgress - 0.38) * 3.2));

  return (
    <div ref={containerRef} className="relative">
      <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
        {/* LEFT COLUMN: Artisan Video (Enters 1st on scroll) */}
        <div
          className={`transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            videoInView ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-12"
          }`}
          style={{
            transform: prefersReducedMotion
              ? undefined
              : `translate3d(0, ${videoTranslateY}px, 0)`,
          }}
        >
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden ring-1 ring-[#D8C19A] shadow-xl bg-[#3A2025] group">
            <SmartVideo
              src="/videos/video-1.mp4"
              poster="/images/Img-1.webp"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Golden decorative corner accents */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#D8C19A]/80 rounded-tl-lg pointer-events-none" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#D8C19A]/80 rounded-tr-lg pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#D8C19A]/80 rounded-bl-lg pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#D8C19A]/80 rounded-br-lg pointer-events-none" />

            {/* Video Live Badge */}
            <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-[#3A2025]/85 backdrop-blur-md px-3.5 py-1 text-xs font-medium text-[#D8C19A] ring-1 ring-[#D8C19A]/40 shadow-sm pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-[#B08A57] animate-pulse" />
              <span>Inside the Studio</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Content with Scroll Parallax (Enters as user continues scrolling) */}
        <div className="space-y-6">
          {/* Layer 1: Badge + Title */}
          <div
            style={{
              transform: prefersReducedMotion ? undefined : `translate3d(0, ${headerOffset}px, 0)`,
              opacity: headerOpacity,
              transition: prefersReducedMotion ? undefined : "opacity 400ms ease, transform 300ms cubic-bezier(0.16,1,0.3,1)",
              willChange: "transform, opacity",
            }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-[#6B2638] px-3.5 py-1 text-xs font-semibold text-[#D8C19A] mb-3 ring-1 ring-[#D8C19A]/40 shadow-sm">
              <span>Designed &amp; crafted by {site.owner}</span>
            </div>
            <h3 className="font-serif-display text-2xl sm:text-3xl text-[#3A2025] font-bold">
              Meet {site.owner}, founder &amp; master artisan
            </h3>
          </div>

          {/* Layer 2: Story Paragraphs (Parallax Float) */}
          <div
            className="space-y-4 text-[#3A2025]/85 leading-relaxed text-sm sm:text-base"
            style={{
              transform: prefersReducedMotion ? undefined : `translate3d(0, ${textOffset}px, 0)`,
              opacity: textOpacity,
              transition: prefersReducedMotion ? undefined : "opacity 400ms ease, transform 300ms cubic-bezier(0.16,1,0.3,1)",
              willChange: "transform, opacity",
            }}
          >
            <p>
              {site.name} was founded by{" "}
              <strong className="text-[#6B2638] font-semibold">{site.owner}</strong> as a passionate
              handmade studio in {site.city}. With an eye for traditional artistry and custom
              perfection, {site.owner} and her team have crafted 2500+ dream bridal blouses for brides
              across South India.
            </p>
            <p>
              Every blouse is personally designed by{" "}
              <strong className="text-[#3A2025] font-semibold">{site.owner}</strong> using premium
              threads, original Kundan stones, and metallic zardosi. Machine-la avasarama mudikura
              velai illa — {site.owner}-in neat finishing dhaan namma identity!
            </p>
          </div>

          {/* Layer 3: Craftsmanship Highlights (Sequential Needle-Stitch Stagger) */}
          <div
            style={{
              transform: prefersReducedMotion ? undefined : `translate3d(0, ${listOffset}px, 0)`,
              opacity: listOpacity,
              transition: prefersReducedMotion ? undefined : "opacity 400ms ease, transform 300ms cubic-bezier(0.16,1,0.3,1)",
              willChange: "transform, opacity",
            }}
          >
            <ul className="space-y-2.5 text-sm">
              {highlights.map((x, i) => (
                <li
                  key={x}
                  className="flex items-center gap-3 text-[#3A2025]/90 transition-transform duration-300 hover:translate-x-1"
                  style={{
                    transitionDelay: prefersReducedMotion ? undefined : `${i * 90}ms`,
                  }}
                >
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#B08A57]/15 text-[#B08A57] text-xs font-bold shrink-0 ring-1 ring-[#B08A57]/30">
                    ✦
                  </span>
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

