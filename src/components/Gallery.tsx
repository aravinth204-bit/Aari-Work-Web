"use client";

import Image from "next/image";
import { useState } from "react";
import { gallery } from "@/lib/site";

const cats = ["All", ...Array.from(new Set(gallery.map((g) => g.cat)))];

export default function Gallery() {
  const [active, setActive] = useState("All");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const items = active === "All" ? gallery : gallery.filter((g) => g.cat === active);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`px-4 py-2 rounded-full text-sm border transition ${
              active === c
                ? "bg-[#6b1226] text-white border-[#6b1226]"
                : "bg-white text-[#6b1226] border-[#e3d3bb] hover:border-[#c9a227]"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
        {items.map((g) => (
          <button
            key={g.src}
            onClick={() => setLightbox(g.src)}
            className="group relative overflow-hidden rounded-2xl aspect-[3/4] bg-white shadow-sm ring-1 ring-[#eadfcd]"
          >
            <Image
              src={g.src}
              alt={g.title}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover transition duration-700 group-hover:scale-110"
            />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-left text-white text-xs md:text-sm">
              <span className="block font-medium">{g.title}</span>
              <span className="opacity-80">{g.cat}</span>
            </span>
          </button>
        ))}
      </div>

      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
        >
          <div className="relative w-full max-w-md aspect-[3/4]">
            <Image src={lightbox} alt="Aari work" fill className="object-contain" />
          </div>
          <button className="absolute top-5 right-6 text-white text-3xl">×</button>
        </div>
      )}
    </div>
  );
}
