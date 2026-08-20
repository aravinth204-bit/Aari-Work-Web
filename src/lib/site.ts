export const site = {
  name: "Tales by Threads",
  tagline: "Handcrafted Aari & Maggam Work",
  city: "Gobichettipalayam",
  phone: "+919876543210",
  phoneDisplay: "+91 98765 43210",
  whatsapp: "919876543210",
  instagram: "https://instagram.com",
  address: "Vellankovil, Gobichettipalayam, Erode",
  timings: "Mon – Sat, 9:30 AM – 8:00 PM",
  mapEmbed:
    "https://www.google.com/maps?q=R.S.Puram,Coimbatore&output=embed",
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
  { id: "g1", src: "/images/img-2.png", cat: "Bridal", title: "Peacock Zardosi Bridal Blouse", desc: "Heavy gold zardosi embroidery with handcrafted peacock motifs & stone embellishments." },
  { id: "g2", src: "/images/img-3.png", cat: "Party Wear", title: "Pastel Mirror & Kundan Work", desc: "Elegant pastel silk blouse embellished with crystal mirrors and Kundan stones." },
  { id: "g3", src: "/images/img-4.png", cat: "Minimal", title: "Neat Chain Stitch Neckline", desc: "Subtle & classy handcrafted threadwork for office and light saree occasions." },
  { id: "g4", src: "/images/img-5.png", cat: "Custom Work", title: "3D Layered Cutwork Pattern", desc: "Modern structural cutwork design with gold thread outlines and bead highlights." },
  { id: "g5", src: "/images/img-6.png", cat: "Kids Wear", title: "Royal Kids Frock Embroidery", desc: "Custom handcrafted embroidery work for children's birthday frocks & pattu pavadai." },
  { id: "g6", src: "/images/img-7.png", cat: "Saree Work", title: "Maggam Saree Pallu & Borders", desc: "Heavy metallic gold thread maggam work embellishments for bridal silk sarees." },
  { id: "g7", src: "/images/Img-1.png", cat: "Bridal", title: "Grand Bridal Back Neck Motif", desc: "Rich temple motif Aari work crafted with original stones and zari threads." },
  { id: "g8", src: "/images/hero_aari_artisan.jpg", cat: "Artisan Work", title: "Handmade Frame Needlework", desc: "Live artisan needlework on traditional wooden frame with precision detailing." },
  { id: "g9", src: "/images/hero_aari_work.jpg", cat: "Party Wear", title: "Floral Thread & Bead Sleeves", desc: "Intricate floral vines and bead clusters covering full elbow sleeves." },
  { id: "g10", src: "/images/Home.png", cat: "Bridal", title: "Traditional Bridal Zari Border", desc: "Classic South Indian bridal saree blouse embellishment with high stone density." },
  { id: "g11", src: "/images/img-2.png", cat: "Saree Work", title: "Elephant Motif Maggam Blouse", desc: "Royal heritage elephant motif embroidery in antique gold wire." },
  { id: "g12", src: "/images/img-3.png", cat: "Minimal", title: "Geometric Elbow Sleeve Border", desc: "Clean geometric threadwork border tailored for daily festive wear." },
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
