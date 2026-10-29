import Image from "next/image";
import Gallery from "@/components/Gallery";
import EnquiryForm from "@/components/EnquiryForm";
import Reveal from "@/components/Reveal";
import InteractiveProcess from "@/components/InteractiveProcess";
import Preloader from "@/components/Preloader";
import ThreadDivider from "@/components/ThreadDivider";
import SmartVideo from "@/components/SmartVideo";
import Hero from "@/components/Hero";
import ServiceIcon from "@/components/ServiceIcon";
import { Header, Faqs, FloatingActions } from "@/components/Chrome";
import { site, services, testimonials } from "@/lib/site";

const footerLinks = [
  { label: "Home", href: "#home" },
  { label: "Recent Works", href: "#gallery" },
  { label: "About Us", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Reviews", href: "#reviews" },
  { label: "Enquiry", href: "#enquiry" },
];

export default function Home() {
  return (
    <main id="home" tabIndex={-1} className="focus:outline-none">
      <Preloader />
      <Header />
      <FloatingActions />

      <Hero />

      {/* RECENT WORKS (GALLERY) */}
      <Section id="gallery" bg="bg-[#F8F3EC]" eyebrow="Recent work" title="A few from the studio">
        <Gallery />
      </Section>

      {/* Decorative Thread 1: Between Recent Works & About */}
      <ThreadDivider variant="curve-right" className="bg-[#F8F3EC]" />

      {/* ABOUT */}
      <Section
        id="about"
        bg="bg-[#FFFFFF]"
        eyebrow="The studio"
        title="Thread by thread, made with love"
        pattern={
          <div className="absolute top-4 right-4 w-44 h-44 opacity-[0.04] pointer-events-none text-[#B08A57]">
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
              <circle cx="50" cy="50" r="12" strokeDasharray="2 2" />
              <path d="M 50 20 C 45 35, 35 45, 20 50 C 35 55, 45 65, 50 80 C 55 65, 65 55, 80 50 C 65 45, 55 35, 50 20 Z" />
              <path d="M 30 30 Q 50 40 70 30 Q 60 50 70 70 Q 50 60 30 70 Q 40 50 30 30 Z" strokeDasharray="3 3" />
            </svg>
          </div>
        }
      >
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <Reveal>
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden ring-1 ring-[#D8C19A] shadow-lg bg-[#3A2025]">
              <SmartVideo
                src="/videos/video-1.mp4"
                poster="/images/Img-1.webp"
                className="w-full h-full object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#6B2638] px-3.5 py-1 text-xs font-semibold text-[#D8C19A] mb-3 ring-1 ring-[#D8C19A]/40 shadow-sm">
              <span>Designed &amp; crafted by {site.owner}</span>
            </div>
            <h3 className="font-serif-display text-2xl text-[#3A2025] font-bold mb-3">
              Meet {site.owner}, founder &amp; master artisan
            </h3>
            <p className="text-[#3A2025]/85 leading-relaxed">
              {site.name} was founded by <strong className="text-[#6B2638] font-semibold">{site.owner}</strong> as a passionate handmade studio in {site.city}. 
              With an eye for traditional artistry and custom perfection, {site.owner} and her team have crafted 2500+ dream bridal blouses for brides across South India.
            </p>
            <p className="mt-4 text-[#3A2025]/85 leading-relaxed">
              Every blouse is personally designed by <strong className="text-[#3A2025]">{site.owner}</strong> using premium threads, original Kundan stones, and metallic zardosi. 
              Machine-la avasarama mudikura velai illa — {site.owner}-in neat finishing dhaan namma identity!
            </p>
            <ul className="mt-6 space-y-2 text-sm">
              {["100% handmade aari & maggam work by Mithanya's team", "Free fitting trial for local customers", "All-India courier available", "Design confidentiality guaranteed"].map((x) => (
                <li key={x} className="flex gap-2 text-[#3A2025]/90">
                  <span className="text-gold-deep" aria-hidden="true">✦</span>
                  {x}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      {/* Decorative Thread 2: Between About & Services */}
      <ThreadDivider variant="curve-left" className="bg-[#F8F3EC]" />

      {/* SERVICES */}
      <Section id="services" bg="bg-[#F1E7DC]" eyebrow="What we make" title="Aari work, by the piece">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 70}>
              <a
                href="#enquiry"
                className="group h-full rounded-3xl bg-[#FFFFFF] p-6 ring-1 ring-[#D8C19A]/60 hover:ring-[#B08A57]/60 shadow-sm hover:shadow-md transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 motion-reduce:hover:translate-y-0 flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B2638] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F1E7DC]"
              >
                <div>
                  <div className="overflow-hidden rounded-2xl inline-block transition-transform duration-450 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] motion-reduce:group-hover:scale-100">
                    <ServiceIcon title={s.title} className="h-9 w-9 text-[#6B2638]" />
                  </div>
                  <h3 className="mt-4 font-serif-display text-xl text-[#3A2025]">{s.title}</h3>
                  <p className="mt-2 text-sm text-[#3A2025]/75 leading-relaxed">{s.desc}</p>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <p className="text-sm font-medium text-gold-deep">{s.price}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#6B2638] transition-transform duration-350 ease-out group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0">
                    <span>Get a quote</span>
                    <span aria-hidden="true">→</span>
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Decorative Thread 2: Around Process Transition */}
      <ThreadDivider variant="curve-left" className="bg-[#F8F3EC]" />

      {/* PROCESS */}
      <Section
        id="process"
        bg="bg-[#FFFFFF]"
        eyebrow="How it works"
        title="Four steps, no surprises"
        pattern={
          <div className="absolute bottom-4 left-4 w-48 h-48 opacity-[0.04] pointer-events-none text-[#B08A57]">
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M 10 50 C 30 20, 70 20, 90 50 C 70 80, 30 80, 10 50 Z" />
              <circle cx="50" cy="50" r="16" strokeDasharray="3 2" />
              <circle cx="50" cy="50" r="6" />
            </svg>
          </div>
        }
      >
        <InteractiveProcess />
      </Section>

      {/* REVIEWS */}
      <Section id="reviews" bg="bg-[#F1E7DC]" eyebrow="In their words" title="What brides say">
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 90}>
              <div className="relative h-full rounded-3xl bg-[#FFFFFF] p-6 ring-1 ring-[#D8C19A]/60 hover:ring-[#B08A57]/60 shadow-sm hover:shadow-md transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 motion-reduce:hover:translate-y-0 flex flex-col justify-between overflow-hidden">
                {/* Decorative Subtle Gold Quote Mark */}
                <span className="absolute top-4 right-5 text-4xl font-serif text-[#B08A57]/20 select-none pointer-events-none">
                  ❝
                </span>

                <div>
                  {/* Spaced Out 5 Gold Stars */}
                  <div className="flex items-center gap-1 text-gold-deep text-sm tracking-wider" aria-label="Rated 5 out of 5">
                    <span aria-hidden="true">★ ★ ★ ★ ★</span>
                  </div>
                  <p className="mt-3.5 text-sm text-[#3A2025]/85 leading-relaxed">“{t.text}”</p>
                </div>

                <div className="mt-6 flex items-center gap-3 pt-3 border-t border-[#D8C19A]/20">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[#6B2638] text-white text-sm font-semibold shadow-xs">
                    {t.name[0]}
                  </span>
                  <div className="text-sm">
                    <div className="font-medium text-[#3A2025]">{t.name}</div>
                    <div className="text-xs text-[#3A2025]/70">{t.place}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Decorative Thread 3: Transition to Enquiry Section */}
      <ThreadDivider variant="wave" className="bg-[#F1E7DC]" />

      {/* ENQUIRY */}
      <section id="enquiry" className="relative py-20 bg-[#F8F3EC] text-[#3A2025] overflow-hidden">
        {/* Subtle Static Aari Motif - Enquiry Section */}
        <div className="absolute top-6 left-6 w-44 h-44 opacity-[0.04] pointer-events-none text-[#B08A57]">
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M 50 10 L 55 40 L 85 45 L 60 65 L 70 95 L 50 75 L 30 95 L 40 65 L 15 45 L 45 40 Z" strokeDasharray="4 3" />
            <circle cx="50" cy="50" r="20" />
          </svg>
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 grid lg:grid-cols-2 gap-10 items-start">
          <Reveal>
            <span className="text-xs font-medium tracking-[0.16em] text-gold-deep">Get in touch</span>
            <h2 className="font-serif-display text-3xl md:text-4xl text-[#3A2025] mt-2">Book your blouse</h2>
            <p className="mt-4 text-[#3A2025]/80 leading-relaxed max-w-md">
              Ungal aari work blouse order-a register pannunga. Form submit panna udane, namma team call / WhatsApp-la contact pannuvanga. Enquiry ku charge illa.
            </p>
            <div className="mt-8 space-y-3 text-sm text-[#3A2025]">
              <p><a href={`tel:${site.phone}`} className="underline hover:text-[#6B2638]">{site.phoneDisplay}</a></p>
              <p>{site.address}</p>
              <p>{site.timings}</p>
            </div>
            <div className="mt-6 overflow-hidden rounded-2xl ring-1 ring-[#D8C19A] shadow-sm">
              <iframe
                title={`${site.name} location map`}
                src={site.mapEmbed}
                width="100%"
                height="220"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block w-full border-0"
              />
            </div>
          </Reveal>
          <Reveal delay={100}>
            <EnquiryForm />
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <Section id="faq" bg="bg-[#FFFFFF]" eyebrow="Good to know" title="Questions, answered">
        <Reveal delay={80} className="max-w-3xl mx-auto">
          <Faqs />
        </Reveal>
      </Section>

      {/* CONTACT / FOOTER */}
      <footer id="contact" className="relative bg-[#3A2025] text-[#F8F3EC]/90 border-t border-[#B08A57]/20 overflow-hidden">
        {/* Subtle Static Decorative Embroidery Thread Background Pattern */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.10]">
          <svg className="absolute -top-12 -left-12 w-96 h-96 text-[#B08A57]" viewBox="0 0 400 400" fill="none" stroke="currentColor">
            <path d="M 20 20 C 150 80, 220 300, 380 380 M 50 120 C 180 180, 280 120, 350 250" strokeWidth="1.5" strokeDasharray="6 4" />
            <circle cx="380" cy="380" r="3" fill="currentColor" />
          </svg>
          <svg className="absolute -bottom-16 -right-16 w-96 h-96 text-[#B08A57]" viewBox="0 0 400 400" fill="none" stroke="currentColor">
            <path d="M 380 20 C 250 120, 180 280, 20 380 M 350 150 C 220 220, 120 280, 50 350" strokeWidth="1.5" strokeDasharray="6 4" />
            <circle cx="20" cy="380" r="3" fill="currentColor" />
          </svg>
        </div>

        <Reveal className="relative z-10 mx-auto max-w-6xl px-4 py-14 grid md:grid-cols-3 gap-10">
          {/* Column 1: Brand Logo & Social Links */}
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/images/Logo-256.png"
                alt={site.name}
                width={48}
                height={48}
                className="h-12 w-12 object-contain rounded-full bg-white/10 p-1 ring-1 ring-[#D8C19A]/40"
              />
              <div>
                <h3 className="font-serif-display text-xl text-[#F8F3EC] leading-tight">{site.name}</h3>
                <p className="text-[11px] text-[#B08A57]">Aari embroidery</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-[#F8F3EC]/80 leading-relaxed">{site.tagline} in {site.city}.</p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href={site.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs text-[#F8F3EC]/90 hover:text-[#B08A57] hover:bg-white/15 transition-all duration-300 ring-1 ring-[#D8C19A]/20"
                aria-label="Instagram"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>Instagram</span>
              </a>
              <a
                href={`https://wa.me/${site.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs text-[#F8F3EC]/90 hover:text-[#B08A57] hover:bg-white/15 transition-all duration-300 ring-1 ring-[#D8C19A]/20"
                aria-label="WhatsApp"
              >
                <svg className="h-4 w-4 fill-current text-[#25D366]" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c-.001 2.096.547 4.142 1.588 6.013L0 24l6.291-1.65a11.862 11.862 0 005.753 1.485h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <p className="text-[#B08A57] font-medium text-xs mb-3">Quick links</p>
            <ul className="space-y-2 text-sm text-[#F8F3EC]/80">
              {footerLinks.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="hover:text-[#B08A57] transition-colors duration-300 flex items-center gap-1.5">
                    <span className="text-[#B08A57] text-xs">›</span>
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="text-sm space-y-3 text-[#F8F3EC]/80">
            <p className="text-[#B08A57] font-medium text-xs mb-1">Contact us</p>
            <p>{site.address}</p>
            <p>
              <a href={`tel:${site.phone}`} className="hover:text-[#B08A57] transition-colors duration-300">{site.phoneDisplay}</a>
            </p>
            <p>{site.timings}</p>
          </div>
        </Reveal>

        <div className="relative z-10 border-t border-[#B08A57]/20 py-5 text-center text-xs text-[#F8F3EC]/70 pb-20 md:pb-5">
          © {new Date().getFullYear()} {site.name} by {site.owner}. All rights reserved.
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
  bg = "bg-[#F8F3EC]",
  pattern,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  bg?: string;
  pattern?: React.ReactNode;
}) {
  return (
    <section id={id} className={`relative py-20 md:py-28 ${bg} overflow-hidden`}>
      {pattern}
      <div className="relative z-10 mx-auto max-w-6xl px-4">
        <Reveal className="mb-10 md:mb-14">
          <p className="text-xs font-medium tracking-[0.16em] text-gold-deep">{eyebrow}</p>
          <div className="mt-3 flex items-end justify-between gap-8">
            <h2 className="font-serif-display text-3xl md:text-4xl text-[#3A2025] max-w-2xl">{title}</h2>
            <div className="stitch-rule hidden sm:block mb-2 h-0.5 w-24 shrink-0" aria-hidden="true" />
          </div>
        </Reveal>
        {children}
      </div>
    </section>
  );
}
