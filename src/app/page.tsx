import Image from "next/image";
import Gallery from "@/components/Gallery";
import EnquiryForm from "@/components/EnquiryForm";
import Reveal from "@/components/Reveal";
import { Header, Faqs, FloatingActions } from "@/components/Chrome";
import { site, services, testimonials } from "@/lib/site";

const steps = [
  { n: "01", t: "Design Select", d: "Gallery-la illa ungal reference photo-la design select pannunga." },
  { n: "02", t: "Measurement", d: "Shop-la vandhu illa WhatsApp chart mulama measurement kudunga." },
  { n: "03", t: "Hand Work", d: "Experienced artisans neat-a aari work pannuvanga. Photo update kidaikum." },
  { n: "04", t: "Delivery", d: "Trial + finishing mudichu on-time delivery / courier." },
];

export default function Home() {
  return (
    <main id="home">
      <Header />
      <FloatingActions />

      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center">
        <Image
          src="/images/hero_aari_work.jpg"
          alt="Handcrafted Aari Work Embroidery"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80 md:bg-gradient-to-r md:from-black/85 md:via-black/60 md:to-black/30" />
        <div className="relative mx-auto max-w-6xl px-4 pt-24 pb-16 text-white">
          <span className="inline-block rounded-full border border-[#c9a227]/70 px-4 py-1 text-xs tracking-widest text-[#e8c85a]">
            {site.city.toUpperCase()} • SINCE 2025
          </span>
          <h1 className="font-serif-display mt-5 text-4xl md:text-6xl leading-tight max-w-2xl">
            Handcrafted <span className="text-[#e8c85a]">Aari Work</span> Blouses for Your Big Day
          </h1>
          <p className="mt-5 max-w-lg text-white/80">
            Bridal, party wear, maggam & kids embroidery — ungal kanavu design-a nangal nijamakkurom.
            Perfect fitting, on-time delivery guarantee.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#enquiry" className="rounded-full bg-[#c9a227] px-7 py-3.5 font-medium text-[#3d0a15] hover:bg-[#e0b62e]">
              Enquiry 
            </a>
            <a
              href={`https://wa.me/${site.whatsapp}`}
              target="_blank"
              className="rounded-full border border-white/50 px-7 py-3.5 font-medium hover:bg-white/10"
            >
              WhatsApp Now
            </a>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-4 max-w-md text-center">
            {[
              ["12+", "Years Exp."],
              ["2500+", "Blouses Done"],
              ["4.9★", "Customer Rating"],
            ].map(([a, b]) => (
              <div key={b}>
                <div className="font-serif-display text-2xl text-[#e8c85a]">{a}</div>
                <div className="text-[11px] uppercase tracking-wide text-white/70">{b}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <Section id="about" eyebrow="About Us" title="Thread by Thread, Made with Love">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <Reveal>
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden ring-1 ring-[#eadfcd] shadow-lg">
              <Image src="/images/Img-1.png" alt="Artisan doing aari work" fill className="object-cover" />
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 80}>
              <div className="relative h-full rounded-3xl bg-white p-6 ring-1 ring-[#eadfcd]">
                <span className="font-serif-display text-4xl text-[#eadfcd]">{s.n}</span>
                <h3 className="mt-2 font-medium text-[#6b1226]">{s.t}</h3>
                <p className="mt-2 text-sm text-neutral-600">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
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
            <h3 className="font-serif-display text-xl text-white">{site.name}</h3>
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
