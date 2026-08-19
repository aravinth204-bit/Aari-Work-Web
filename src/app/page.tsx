import Image from "next/image";
import Gallery from "@/components/Gallery";
import EnquiryForm from "@/components/EnquiryForm";
import Reveal from "@/components/Reveal";
import InteractiveProcess from "@/components/InteractiveProcess";
import Preloader from "@/components/Preloader";
import { Header, Faqs, FloatingActions } from "@/components/Chrome";
import { site, services, testimonials } from "@/lib/site";

export default function Home() {
  return (
    <main id="home">
      <Preloader />
      <Header />
      <FloatingActions />

      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Background Image / Video Fallback */}
        {/* Mobile Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="md:hidden absolute inset-0 w-full h-full object-cover object-[70%_center]"
          poster="/images/hero_aari_artisan.jpg"
        >
          <source src="/videos/hero_background_mobile.mp4" type="video/mp4" />
          <source src="/images/Woman_performing_Aari_needle_emb%E2%80%A6_202608141634.mp4" type="video/mp4" />
        </video>

        {/* Desktop Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="hidden md:block absolute inset-0 w-full h-full object-cover object-center"
          poster="/images/hero_aari_artisan.jpg"
        >
          <source src="/videos/hero_background.mp4" type="video/mp4" />
          <source src="/images/Woman_performing_Aari_needle_emb%E2%80%A6_202608141615.mp4" type="video/mp4" />
        </video>
        <Image
          src="/images/hero_aari_artisan.jpg"
          alt="Handcrafted Aari Work Embroidery Artisan"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[75%_center] md:object-center -z-10"
        />

        {/* Lighter, Crystal-Clear Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20 md:bg-gradient-to-r md:from-black/80 md:via-black/35 md:to-transparent" />

        <div className="relative mx-auto max-w-6xl px-4 pt-32 pb-20 text-white z-10">
          <span className="inline-block rounded-full border border-[#c9a227]/80 bg-black/40 backdrop-blur-md px-3.5 py-1 text-xs tracking-widest text-[#e8c85a] shadow-md">
            ✨ HANDMADE AARI WORK STUDIO
          </span>
          <h1 className="font-serif-display mt-4 text-3xl sm:text-5xl md:text-6xl leading-tight max-w-xl drop-shadow-md">
            Handcrafted <span className="text-[#e8c85a]">Aari Work</span> Blouses
          </h1>
          <p className="mt-3 max-w-md text-white/90 text-sm sm:text-base font-light drop-shadow-sm">
            Exclusive Bridal & Party Wear Embroidery • Perfect Fitting
          </p>
          <div className="mt-6 hidden md:flex flex-wrap gap-3">
            <a
              href="#enquiry"
              className="rounded-full bg-[#c9a227] px-6 py-2.5 text-sm font-semibold text-[#3d0a15] hover:bg-[#e0b62e] transition shadow-md active:scale-95"
            >
              Enquiry
            </a>
            <a
              href={`https://wa.me/${site.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/60 bg-black/30 backdrop-blur-sm px-6 py-2.5 text-sm font-medium hover:bg-white/20 transition shadow-md active:scale-95"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <Section id="about" eyebrow="About Us" title="Thread by Thread, Made with Love">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <Reveal>
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden ring-1 ring-[#eadfcd] shadow-lg bg-black">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
                poster="/images/Img-1.png"
              >
                <source src="/videos/video-1.mp4" type="video/mp4" />
              </video>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-neutral-700 leading-relaxed">
              {site.name} started as a small home studio in {site.city} with one aari frame and a lot of
              passion. Indha 12 varusathula 2500+ brides and families namma work-a nambi irukanga.
            </p>
            <p className="mt-4 text-neutral-700 leading-relaxed">
              Ella blouse-um kai-yaala, quality thread, original stones and beads vechu pannuvom.
              Machine-la avasarama mudikura velai illa — neat finishing dhaan namma identity.
            </p>
            <ul className="mt-6 space-y-2 text-sm">
              {["100% handmade aari & maggam work", "Free fitting trial for local customers", "All-India courier available", "Design confidentiality guaranteed"].map((x) => (
                <li key={x} className="flex gap-2">
                  <span className="text-[#c9a227]">✦</span>
                  {x}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      {/* SERVICES */}
      <Section id="services" eyebrow="What We Do" title="Our Services" alt>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 70}>
              <div className="h-full rounded-3xl bg-white p-6 ring-1 ring-[#eadfcd] shadow-sm hover:shadow-lg hover:-translate-y-1 transition">
                <div className="text-3xl">{s.icon}</div>
                <h3 className="mt-4 font-serif-display text-xl text-[#6b1226]">{s.title}</h3>
                <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{s.desc}</p>
                <p className="mt-4 text-sm font-medium text-[#c9a227]">{s.price}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* GALLERY */}
      <Section id="gallery" eyebrow="Our Work" title="Design Gallery">
        <Gallery />
      </Section>

      {/* PROCESS */}
      <Section id="process" eyebrow="How It Works" title="Simple 4 Step Process" alt>
        <InteractiveProcess />
      </Section>

      {/* REVIEWS */}
      <Section id="reviews" eyebrow="Happy Customers" title="What They Say">
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 90}>
              <div className="h-full rounded-3xl bg-white p-6 ring-1 ring-[#eadfcd] shadow-sm">
                <div className="text-[#c9a227]">★★★★★</div>
                <p className="mt-3 text-sm text-neutral-700 leading-relaxed">“{t.text}”</p>
                <div className="mt-5 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[#6b1226] text-white">
                    {t.name[0]}
                  </span>
                  <div className="text-sm">
                    <div className="font-medium">{t.name}</div>
                    <div className="text-xs text-neutral-500">{t.place}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ENQUIRY */}
      <section id="enquiry" className="py-20 bg-[#6b1226] text-white">
        <div className="mx-auto max-w-6xl px-4 grid lg:grid-cols-2 gap-10 items-start">
          <Reveal>
            <span className="text-xs tracking-[0.2em] text-[#e8c85a]">GET IN TOUCH</span>
            <h2 className="font-serif-display text-3xl md:text-4xl mt-3">
              Ungal Design-a Sollunga, Namma Panni Tharom
            </h2>
            <p className="mt-4 text-white/75 text-sm leading-relaxed">
              Form fill pannunga — 24 hours-kul namma team call panni design, price and delivery date
              confirm pannuvanga. Enquiry ku charge illa.
            </p>
            <div className="mt-8 space-y-3 text-sm">
              <p>📞 <a href={`tel:${site.phone}`} className="underline">{site.phoneDisplay}</a></p>
              <p>📍 {site.address}</p>
              <p>🕘 {site.timings}</p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <EnquiryForm />
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <Section id="faq" eyebrow="Doubts?" title="Frequently Asked Questions">
        <div className="max-w-3xl mx-auto">
          <Faqs />
        </div>
      </Section>

      {/* CONTACT / FOOTER */}
      <footer id="contact" className="bg-[#2b0c15] text-white/80">
        <div className="mx-auto max-w-6xl px-4 py-14 grid md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2.5">
              <Image
                src="/images/Logo.png"
                alt={site.name}
                width={36}
                height={36}
                className="h-9 w-9 object-contain rounded-full bg-white/10 p-0.5"
              />
              <h3 className="font-serif-display text-xl text-white">{site.name}</h3>
            </div>
            <p className="mt-3 text-sm">{site.tagline} in {site.city}.</p>
            <div className="mt-4 flex gap-3 text-sm">
              <a href={site.instagram} target="_blank" className="hover:text-[#e8c85a]">Instagram</a>
              <a href={`https://wa.me/${site.whatsapp}`} target="_blank" className="hover:text-[#e8c85a]">WhatsApp</a>
            </div>
          </div>
          <div className="text-sm space-y-2">
            <p className="text-white font-medium">Contact</p>
            <p>{site.address}</p>
            <p>{site.phoneDisplay}</p>
            <p>{site.timings}</p>
          </div>
          <div className="rounded-2xl overflow-hidden ring-1 ring-white/10 h-44">
            <iframe src={site.mapEmbed} className="w-full h-full" loading="lazy" title="Map" />
          </div>
        </div>
        <div className="border-t border-white/10 py-5 text-center text-xs pb-20 md:pb-5">
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </div>
      </footer>
    </main>
  );
}

function Section({
  id,
  eyebrow,
  title,
  children,
  alt,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  alt?: boolean;
}) {
  return (
    <section id={id} className={`py-20 ${alt ? "bg-[#f7eee1]" : ""}`}>
      <div className="mx-auto max-w-6xl px-4">
        <Reveal className="text-center mb-12">
          <span className="text-xs tracking-[0.25em] text-[#c9a227]">{eyebrow.toUpperCase()}</span>
          <h2 className="font-serif-display text-3xl md:text-4xl text-[#6b1226] mt-2">{title}</h2>
          <div className="gold-line h-px w-40 mx-auto mt-4" />
        </Reveal>
        {children}
      </div>
    </section>
  );
}

