"use client";

import { useEffect } from "react";
import Link from "next/link";
import { site } from "@/lib/site";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App boundary error caught:", error);
  }, [error]);

  const whatsappUrl = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
    "வணக்கம் Mithanya, Tales by Threads தளத்தில் ஒரு பிழை ஏற்பட்டது. நான் உதவி பெற விரும்புகிறேன்."
  )}`;

  return (
    <main className="min-h-screen bg-[#F8F3EC] text-[#3A2025] flex flex-col justify-center items-center px-4 py-16 text-center">
      <div className="w-16 h-16 mb-5 rounded-full bg-[#6B2638]/10 border border-[#6B2638]/20 flex items-center justify-center text-[#6B2638]">
        <svg
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
      </div>

      <h1 className="text-3xl md:text-4xl font-serif text-[#6B2638] font-bold mb-3">
        சிறு தொழில்நுட்பக் கோளாறு ஏற்பட்டது
      </h1>

      <p className="max-w-md text-sm md:text-base text-[#541D2B]/80 mb-8 leading-relaxed">
        பக்கத்தை ஏற்றுவதில் தற்காலிக பிழை ஏற்பட்டுள்ளது. மீண்டும் முயற்சிக்கலாம் அல்லது அவசர தேவைகளுக்கு எங்களை WhatsApp மூலம் உடனடியாக தொடர்பு கொள்ளலாம்.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <button
          onClick={() => reset()}
          type="button"
          className="cursor-pointer inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#6B2638] text-[#F8F3EC] font-medium text-sm hover:bg-[#541D2B] transition-colors shadow-md"
        >
          மீண்டும் முயற்சிக்க (Retry)
        </button>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#0F7A6C] text-white font-medium text-sm hover:bg-[#0B665C] transition-colors shadow-md"
        >
          WhatsApp-ல் பேச
        </a>

        <Link
          href="/"
          className="inline-flex items-center justify-center px-5 py-3 rounded-full border border-[#B08A57] text-[#6B2638] font-medium text-sm hover:bg-[#B08A57]/10 transition-colors"
        >
          முகப்பு
        </Link>
      </div>
    </main>
  );
}
