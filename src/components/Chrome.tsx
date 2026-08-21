"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { site, faqs } from "@/lib/site";

const links = [
  ["Home", "#home"],
  ["Recent Works", "#gallery"],
  ["About Us", "#about"],
  ["Services", "#services"],
  ["Process", "#process"],
  ["Reviews", "#reviews"],
  ["Contact", "#contact"],
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isScrolledOrOpen = solid || open;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:!transition-none ${
        isScrolledOrOpen
          ? "bg-[#F8F3EC]/92 backdrop-blur-md shadow-sm border-b border-[#D8C19A]/20"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2.5">
          <Image
            src="/images/Logo.png"
            alt={site.name}
            width={36}
            height={36}
            className="h-9 w-9 object-contain rounded-full bg-white/20 p-0.5 shadow-sm"
          />
          <span className={`font-serif-display text-lg transition-colors duration-300 ${isScrolledOrOpen ? "text-[#3A2025]" : "text-white"}`}>
            {site.name}
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          {links.map(([l, h]) => (
            <a
              key={h}
              href={h}
              className={`${
                isScrolledOrOpen ? "text-[#3A2025]/90" : "text-white/90"
              } hover:text-[#B08A57] transition-colors duration-300`}
            >
              {l}
            </a>
          ))}
          <a href="#enquiry" className="cta-shimmer rounded-full bg-[#6B2638] px-4 py-2 text-white hover:bg-[#541D2B] transition">
            <span>Enquiry</span>
          </a>
        </nav>

        <button
          onClick={() => setOpen((o) => !o)}
          className={`md:hidden text-2xl transition-colors duration-300 ${isScrolledOrOpen ? "text-[#3A2025]" : "text-white"}`}
          aria-label="Menu"
        >
          {open ? "×" : "☰"}
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="md:hidden border-t border-[#D8C19A]/30 bg-[#F8F3EC] px-4 py-4 space-y-3">
          {links.map(([l, h]) => (
            <a
              key={h}
              href={h}
              onClick={() => setOpen(false)}
              className="block text-sm font-medium text-[#3A2025] hover:text-[#B08A57]"
            >
              {l}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

export function Faqs() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-3">
      {faqs.map((f, i) => (
        <div key={f.q} className="rounded-2xl bg-[#FFFFFF] ring-1 ring-[#D8C19A] overflow-hidden shadow-sm">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
          >
            <span className="font-medium text-sm text-[#3A2025]">{f.q}</span>
            <span className="text-[#B08A57] text-xl font-semibold">{open === i ? "−" : "+"}</span>
          </button>
          {open === i && <p className="px-5 pb-5 text-sm text-[#3A2025]/80 leading-relaxed">{f.a}</p>}
        </div>
      ))}
    </div>
  );
}

export function FloatingActions() {
  return (
    <>
      <a
        href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Hi, I need aari work details")}`}
        target="_blank"
        rel="noreferrer"
        className="group fixed right-4 bottom-20 md:right-5 md:bottom-5 z-40 flex items-center h-12 md:h-[52px] w-12 md:w-[52px] hover:md:w-[165px] rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl transition-all duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 motion-reduce:!w-12 motion-reduce:!h-12 motion-reduce:md:!w-[52px] motion-reduce:md:!h-[52px]"
        aria-label="Chat with us on WhatsApp"
      >
        <div className="shrink-0 h-12 w-12 md:h-[52px] md:w-[52px] grid place-items-center text-xl md:text-2xl font-bold">
          <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c-.001 2.096.547 4.142 1.588 6.013L0 24l6.291-1.65a11.862 11.862 0 005.753 1.485h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        </div>
        <span className="whitespace-nowrap text-xs font-semibold pr-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out hidden md:inline motion-reduce:!hidden">
          Chat with us
        </span>
      </a>
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 grid grid-cols-2 bg-[#6B2638] text-white text-sm">
        <a href={`tel:${site.phone}`} className="py-3.5 text-center border-r border-white/20 hover:bg-[#541D2B] transition">
          📞 Call Now
        </a>
        <a href="#enquiry" className="py-3.5 text-center hover:bg-[#541D2B] transition">
          ✍️ Enquiry
        </a>
      </div>
    </>
  );
}
