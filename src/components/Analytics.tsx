"use client";

import Script from "next/script";
import { useEffect } from "react";

/**
 * Loads GA4 only when a measurement ID is configured, and tracks outbound
 * WhatsApp and phone clicks from one delegated listener.
 */
export default function Analytics({ gaId }: { gaId: string }) {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest("a");
      if (!link) return;

      const href = link.getAttribute("href") ?? "";

      if (href.startsWith("https://wa.me") || href.startsWith("https://api.whatsapp.com")) {
        window.gtag?.("event", "whatsapp_click", { link_url: href });
      } else if (href.startsWith("tel:")) {
        window.gtag?.("event", "call_click", { link_url: href });
      }
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');`}
      </Script>
    </>
  );
}
