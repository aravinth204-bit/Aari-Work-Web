import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import { site, services } from "@/lib/site";
import Analytics from "@/components/Analytics";
import { I18nProvider } from "@/lib/i18n";
import LuxuryCursor from "@/components/LuxuryCursor";
import LuxuryPreloader from "@/components/LuxuryPreloader";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-playfair",
});

function resolveSiteUrl(): URL {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configured) {
    try {
      return new URL(configured);
    } catch {
      console.warn(
        `[metadata] NEXT_PUBLIC_SITE_URL is not a valid URL ("${configured}"), using fallback.`,
      );
    }
  }

  const vercelHost =
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() || process.env.VERCEL_URL?.trim();

  if (vercelHost) {
    try {
      return new URL(`https://${vercelHost}`);
    } catch {
      // fall through to localhost
    }
  }

  return new URL("http://localhost:3000");
}

const siteUrl = resolveSiteUrl();
const gaId = process.env.NEXT_PUBLIC_GA_ID?.trim() ?? "";
const siteTitle = `${site.name} | Aari & Maggam Work Blouse in ${site.city}`;
const siteDescription = `Handcrafted aari work, maggam work and bridal blouse designing in ${site.city}, Erode, Coimbatore. Custom bridal blouse patterns, exquisite zardosi, perfect fitting, and on-time delivery by Mithanya. Enquire now.`;
const socialImage = "/images/hero_aari_work.jpg";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: siteTitle,
  description: siteDescription,
  keywords: [
    "aari work",
    "maggam work",
    "bridal blouse",
    site.city,
    "Erode bridal blouse",
    "Coimbatore aari work",
    "zardosi embroidery",
    "designer blouse",
    "Tales by Threads",
  ],
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "192x192" },
    ],
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    locale: "en_IN",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: socialImage,
        width: 1376,
        height: 768,
        alt: `Handcrafted aari work by ${site.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [socialImage],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl.toString()}#business`,
    name: site.name,
    description: site.tagline,
    url: siteUrl.toString(),
    image: [new URL(socialImage, siteUrl).toString()],
    logo: new URL("/icon.png", siteUrl).toString(),
    telephone: site.phone,
    priceRange: "₹₹",
    geo: {
      "@type": "GeoCoordinates",
      latitude: 11.4534,
      longitude: 77.4358,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address,
      addressLocality: site.city,
      addressRegion: "Tamil Nadu",
      postalCode: "638476",
      addressCountry: "IN",
    },
    areaServed: [
      site.city,
      "Erode",
      "Coimbatore",
      "Tirupur",
      "Salem",
      "Tamil Nadu",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Bridal Embroidery Services",
      itemListElement: services.map((s, idx) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.title,
          description: s.desc,
        },
        position: idx + 1,
      })),
    },
    ...(site.instagram && site.instagram !== "https://instagram.com"
      ? { sameAs: [site.instagram] }
      : {}),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:30",
        closes: "20:00",
      },
    ],
  };

  return (
    <html lang="en-IN" className={playfair.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <noscript>
          <style>{`
            .reveal { opacity: 1 !important; transform: none !important; }
          `}</style>
        </noscript>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <a
          href="#home"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[300] focus:rounded-full focus:bg-[#3A2025] focus:px-4 border focus:py-2 focus:text-sm focus:font-medium focus:text-white"
        >
          Skip to content
        </a>
        <I18nProvider>
          <LuxuryPreloader />
          <LuxuryCursor />
          {children}
        </I18nProvider>
        {gaId ? <Analytics gaId={gaId} /> : null}
      </body>
    </html>
  );
}
