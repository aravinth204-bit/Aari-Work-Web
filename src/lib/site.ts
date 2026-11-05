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
  price?: string;
  tags?: string;
}

export const gallery: GalleryItem[] = [
  {
    id: "g1",
    src: "/images/gallery-bridal-elephant.webp",
    cat: "Aari Work",
    title: "Bridal Elephant & Floral Aari Blouse",
    desc: "Exquisite handmade bridal blouse with gold zari thread, stone embellishments & detailed neck border.",
  },
  {
    id: "g2",
    src: "/images/gallery-peacock-neck.webp",
    cat: "Aari Work",
    title: "Grand Peacock Motif Back Neck",
    desc: "Rich peacock embroidery motif with metallic thread accents and crystal stone highlights.",
  },
  {
    id: "g3",
    src: "/images/gallery-zardosi-sleeve.webp",
    cat: "Zardosi Work",
    title: "Royal Gold Zardosi Sleeve Work",
    desc: "Heavy antique gold zardosi embroidery with intricate bead clusters and traditional motifs.",
  },
  {
    id: "g4",
    src: "/images/gallery-kundan-mirror.webp",
    cat: "Stone & Kundan Work",
    title: "Kundan & Mirror Work Blouse",
    desc: "Reflective mirror detailing bordered by hand-set kundan crystals on rich raw silk fabric.",
  },
  {
    id: "g5",
    src: "/images/gallery-cutwork-blouse.webp",
    cat: "Cut Work & Patch Work",
    title: "Contemporary Cutwork Designer Back",
    desc: "Laser-sharp hand cutout borders framed with delicate metallic outline needlework.",
  },
  {
    id: "g6",
    src: "/images/gallery-bridal-parrot.webp",
    cat: "Aari Work",
    title: "Twin Parrot Motif Bridal Blouse",
    desc: "Heritage twin parrot motif embellished with sugar beads, cut dana and French knots.",
  },
  {
    id: "g7",
    src: "/images/gallery-simple-kasu.webp",
    cat: "Embroidery",
    title: "Classic Kasu Mala Embroidery Work",
    desc: "Traditional coin-embossed border stitching tailored for elegant muhurtham celebrations.",
  },
  {
    id: "g8",
    src: "/images/gallery-heavy-wedding.webp",
    cat: "Zardosi Work",
    title: "Full Heavy Bridal Designer Blouse",
    desc: "Elbow-to-wrist complete coverage with pure micro-zari, dabka, pearl and stone inlay.",
  },
  {
    id: "g9",
    src: "/images/gallery-minimal-neck.webp",
    cat: "Embroidery",
    title: "Minimal Floral Vine Neckline",
    desc: "Subtle yet breathtaking handcrafted vine border design crafted for party wear sarees.",
  },
];

export const processSteps = [
  {
    n: "01",
    t: "Design Selection",
    d: "Choose from our catalogue or bring your reference picture. We sketch the custom pattern onto your fabric measurement.",
  },
  {
    n: "02",
    t: "Fabric & Measurement",
    d: "Drop your blouse material at our Gobichettipalayam studio or courier it. We take precise measurements.",
  },
  {
    n: "03",
    t: "Handcrafting",
    d: "Our artisans meticulously handcraft every stitch, bead, and stone over 5–12 days using wooden frame needlework.",
  },
  {
    n: "04",
    t: "Trial & Delivery",
    d: "Final finishing, steam press, and trial fitting before your special occasion. Local pickup or courier delivery.",
  },
];

export const faqs = [
  {
    q: "How many days in advance should I order for a wedding?",
    a: "We recommend placing bridal orders at least 15–20 days before your wedding date. For urgent rush orders, WhatsApp us directly to check express slot availability.",
  },
  {
    q: "Can I bring my own blouse fabric and reference design?",
    a: "Yes, absolutely! You can bring or courier your blouse fabric and share reference photos from Instagram or Pinterest. We can customize the design to suit your preference and budget.",
  },
  {
    q: "Do you take measurements in person or online?",
    a: "If you are in or near Gobichettipalayam, you can visit our studio for in-person measurements. For customers across Tamil Nadu and abroad, you can send an existing well-fitting blouse or follow our WhatsApp measurement guide.",
  },
  {
    q: "What is your starting price for Aari work blouses?",
    a: "Our basic neck and sleeve border aari work starts from ₹1,200. Semi-bridal designs range from ₹2,500 to ₹5,000, and grand bridal zardosi/maggam work blouses range upwards depending on embroidery density.",
  },
  {
    q: "Do you deliver to Coimbatore, Erode, Tiruppur or other cities?",
    a: "Yes! We safely pack and courier finished blouses across Tamil Nadu, all over India, and internationally with tracking details provided.",
  },
];

export const testimonials = [
  {
    name: "Priya R.",
    place: "Gobichettipalayam",
    text: "Bridal blouse work superb-a irundhuchu. Fitting perfect, delivery time-ku kudutha. Ella friends um kekaraanga!",
  },
  {
    name: "Kavitha S.",
    place: "Erode",
    text: "Mithanya sister romba patient-a ketutu design panni thandhaanga. Zardosi work finishing so neat and rich.",
  },
  {
    name: "Deepa M.",
    place: "Coimbatore",
    text: "Courier la send pannanga, packing super. Blouse exact-a fit aachu without any alteration. Highly recommended!",
  },
  {
    name: "Soundarya V.",
    place: "Tiruppur",
    text: "My wedding reception blouse was the highlight of the event. Intricate peacock motif with original kundan stones.",
  },
];
