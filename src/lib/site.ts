const address = "Vellankovil, Gobichettipalayam, Erode";

export const site = {
  name: "Tales by Threads",
  owner: "Mithanya",
  designerTitle: "Founder & Master Artisan",
  tagline: "Handcrafted Aari & Maggam Work",
  city: "Gobichettipalayam",
  phone: "+919876543210",
  phoneDisplay: "+91 98765 43210",
  whatsapp: "919876543210",
  instagram: "https://instagram.com",
  address,
  timings: "Mon – Sat, 9:30 AM – 8:00 PM",
  mapEmbed: `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`,
};

export const workTypes = [
  "Bridal Aari Blouse",
  "Party Wear Blouse",
  "Simple / Daily Wear",
  "Maggam Work Saree",
  "Kids Frock Work",
  "Custom Design",
];

export const services = [
  {
    title: "Aari Work",
    desc: "Intricate handcrafted thread, bead & needlework stitched to perfection for bridal & festive wear.",
    price: "Custom quote",
    icon: "🧵",
  },
  {
    title: "Embroidery",
    desc: "Classic & contemporary hand embroidery patterns custom tailored for blouses & sarees.",
    price: "Custom quote",
    icon: "🪡",
  },
  {
    title: "Brooches Work",
    desc: "Exquisite designer brooches, handcrafted motif attachments & statement accents.",
    price: "Custom quote",
    icon: "🧷",
  },
  {
    title: "Zardosi Work",
    desc: "Royal metallic zardosi embroidery crafted with gold & silver metallic threads & heavy detailing.",
    price: "Custom quote",
    icon: "👑",
  },
  {
    title: "Stone & Kundan Work",
    desc: "Sparkling kundan stones, crystal embellishments & rich bridal stone work designs.",
    price: "Custom quote",
    icon: "💎",
  },
  {
    title: "Cut Work & Patch Work",
    desc: "Precision cutwork patterns, layered fabric patches & modern structural embroidery artwork.",
    price: "Custom quote",
    icon: "✂️",
  },
];

export interface GalleryItem {
  id: string;
  src: string;
  cat: string;
  title: string;
  desc?: string;
}

export const gallery: GalleryItem[] = [
  {
    id: "g1",
    src: "/images/Bridal blouse design.jpg",
    cat: "Aari Work",
    title: "Bridal Elephant & Floral Aari Blouse",
    desc: "Exquisite handmade bridal blouse with gold zari thread, stone embellishments & detailed neck border.",
  },
  {
    id: "g2",
    src: "/images/Aari work.jpg",
    cat: "Aari Work",
    title: "Grand Peacock Motif Back Neck",
    desc: "Rich peacock embroidery motif with metallic thread accents and crystal stone highlights.",
  },
  {
    id: "g3",
    src: "/images/Hand work.jpg",
    cat: "Zardosi Work",
    title: "Royal Gold Zardosi Sleeve Work",
    desc: "Heavy antique gold zardosi embroidery with intricate bead clusters and traditional motifs.",
  },
  {
    id: "g4",
    src: "/images/download.jpg",
    cat: "Stone & Kundan Work",
    title: "Kundan & Mirror Work Blouse",
    desc: "Sparkling Kundan stone work integrated with fine silk thread borders for wedding receptions.",
  },
  {
    id: "g5",
    src: "/images/download (1).jpg",
    cat: "Embroidery",
    title: "Floral Threadwork Elbow Sleeve",
    desc: "Delicate floral vines and leaf embroidery patterns tailored for silk sarees.",
  },
  {
    id: "g6",
    src: "/images/download (2).jpg",
    cat: "Brooches Work",
    title: "Designer Motif Brooch Attachment",
    desc: "Handcrafted 3D motif brooch accent with hanging bead droplets and zari highlights.",
  },
  {
    id: "g7",
    src: "/images/download (3).jpg",
    cat: "Cut Work & Patch Work",
    title: "Layered Cutwork Neck Line",
    desc: "Precision structural cutwork pattern with gold thread framing & neat finishing.",
  },
  {
    id: "g8",
    src: "/images/download (4).jpg",
    cat: "Aari Work",
    title: "Heavy Maggam Bridal Sleeve Design",
    desc: "Dense gold thread maggam work detailing crafted for grand bridal sarees.",
  },
  {
    id: "g9",
    src: "/images/download (5).jpg",
    cat: "Zardosi Work",
    title: "Classic Mango Motif Back Design",
    desc: "Traditional paisley (mango) motif Aari needlework with copper-gold zari lines.",
  },
  {
    id: "g10",
    src: "/images/Aari Work Designs-Affordable Price Range ➡️From Rs_500_- DM in Instagram⬇️ sunshine_fashion_and_aari.jpg",
    cat: "Stone & Kundan Work",
    title: "Affordable Custom Aari Design",
    desc: "Classy & budget-friendly handcrafted Aari work with clean finishing.",
  },
];

export const testimonials = [
  {
    name: "Priya R.",
    place: "Saibaba Colony",
    text: "Bridal blouse work superb-a irundhuchu. Fitting perfect, delivery time-ku kudutha. Ella friends um kekaraanga!",
  },
  {
    name: "Divya S.",
    place: "Peelamedu",
    text: "Instagram-la paartha design-a same maari pannitanga. Stone work quality romba nalla iruku.",
  },
  {
    name: "Kavitha M.",
    place: "Gandhipuram",
    text: "Price reasonable, work neat. En daughter frock-ku panna work ellarum pathi paaratinaanga.",
  },
];

export const faqs = [
  {
    q: "Delivery ku evlo naal aagum?",
    a: "Simple work 3–5 days, party wear 7 days, bridal blouse 12–15 days. Urgent orders extra charge-la 48 hours-la mudikkalam.",
  },
  {
    q: "Blouse material neenga kudupeengala?",
    a: "Neenga material kondu varalam. Venumna namma kitta irukura lining, hooks, stones ellam supply pannuvom.",
  },
  {
    q: "Outstation courier panreengala?",
    a: "Aama. India முழுவதும் courier pannuvom. Measurement chart WhatsApp-la anuppuvom.",
  },
  {
    q: "Trial illama fitting sari varuma?",
    a: "Correct measurement kudutha 100% fitting guarantee. Local customers-ku oru trial free.",
  },
];
