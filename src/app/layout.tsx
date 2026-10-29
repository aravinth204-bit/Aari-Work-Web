import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import Analytics from "@/components/Analytics";

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
const siteDescription = `Handcrafted aari work, maggam work and bridal blouse designing in ${site.city}. Custom designs, perfect fitting, on-time delivery. Enquire now.`;
const socialImage = "/images/hero_aari_work.jpg";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: siteTitle,
  description: siteDescription,
  keywords: ["aari work", "maggam work", "bridal blouse", site.city, "embroidery blouse"],
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/images/Logo.png",
    shortcut: "/images/Logo.png",
    apple: "/images/Logo.png",
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
    logo: new URL("/images/Logo.png", siteUrl).toString(),
    telephone: site.phone,
    priceRange: "₹₹",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address,
      addressLocality: site.city,
      addressRegion: "Tamil Nadu",
      addressCountry: "IN",
    },
    areaServed: [site.city, "Erode", "Coimbatore", "Tamil Nadu"],
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
        <link rel="icon" href="/images/Logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/Logo.png" />
        <noscript>
          <style>{`
            .reveal { opacity: 1 !important; transform: none !important; }
            .preloader-root { display: none !important; }
          `}</style>
        </noscript>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      </head>
      <body className="antialiased">
        <a
          href="#home"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[300] focus:rounded-full focus:bg-[#3A2025] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
        >
          Skip to content
        </a>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
        {gaId ? <Analytics gaId={gaId} /> : null}
      </body>
    </html>
  );
}
