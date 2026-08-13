import type { Metadata } from "next";
import "./globals.css";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: `${site.name} | Aari & Maggam Work Blouse in ${site.city}`,
  description: `Handcrafted aari work, maggam work and bridal blouse designing in ${site.city}. Custom designs, perfect fitting, on-time delivery. Enquire now.`,
  keywords: ["aari work", "maggam work", "bridal blouse", site.city, "embroidery blouse"],
  openGraph: {
    title: `${site.name} | ${site.tagline}`,
    description: `Bridal & party wear aari work blouses in ${site.city}.`,
    images: ["/images/hero.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.name,
    image: "/images/hero.jpg",
    telephone: site.phone,
    address: { "@type": "PostalAddress", streetAddress: site.address, addressLocality: site.city },
    openingHours: "Mo-Sa 09:30-20:00",
  };
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
