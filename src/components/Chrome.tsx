"use client";

import { useEffect, useState } from "react";
import { site, faqs } from "@/lib/site";

const links = [
  ["Home", "#home"],
  ["Services", "#services"],
  ["Gallery", "#gallery"],
  ["Process", "#process"],
  ["Reviews", "#reviews"],
  ["Contact", "#contact"],
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition ${
        solid ? "bg-[#fdf8f1]/95 backdrop-blur shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#6b1226] text-[#c9a227] font-serif-display">
            A
          </span>
          <span className={`font-serif-display text-lg ${solid ? "text-[#6b1226]" : "text-white"}`}>
            {site.name}
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          {links.map(([l, h]) => (
            <a key={h} href={h} className={`${solid ? "text-neutral-700" : "text-white/90"} hover:text-[#c9a227]`}>
              {l}
            </a>
          ))}
          <a href="#enquiry" className="rounded-full bg-[#6b1226] px-4 py-2 text-white hover:bg-[#540e1e]">
            Enquiry
          </a>
        </nav>

        <button
          onClick={() => setOpen((o) => !o)}
          className={`md:hidden text-2xl ${solid ? "text-[#6b1226]" : "text-white"}`}
          aria-label="Menu"
        >
          {open ? "×" : "☰"}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[#fdf8f1] border-t border-[#eadfcd] px-4 py-3 space-y-1">
          {[...links, ["Enquiry", "#enquiry"]].map(([l, h]) => (
            <a
              key={h}
              href={h}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm text-neutral-700 border-b border-[#f0e6d6] last:border-0"
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
        <div key={f.q} className="rounded-2xl bg-white ring-1 ring-[#eadfcd] overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
          >
            <span className="font-medium text-sm text-[#6b1226]">{f.q}</span>
            <span className="text-[#c9a227] text-xl">{open === i ? "−" : "+"}</span>
          </button>
          {open === i && <p className="px-5 pb-5 text-sm text-neutral-600 leading-relaxed">{f.a}</p>}
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
        className="fixed right-4 bottom-20 md:bottom-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white text-2xl shadow-xl"
        aria-label="WhatsApp"
      >
        ✆
      </a>
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 grid grid-cols-2 bg-[#6b1226] text-white text-sm">
        <a href={`tel:${site.phone}`} className="py-3.5 text-center border-r border-white/20">
          📞 Call Now
        </a>
        <a href="#enquiry" className="py-3.5 text-center">
          ✍️ Enquiry
        </a>
      </div>
    </>
  );
}
