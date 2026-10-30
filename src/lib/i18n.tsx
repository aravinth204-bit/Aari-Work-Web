"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Locale = "en" | "ta";

interface I18nContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.gallery": "Recent Works",
    "nav.about": "About Us",
    "nav.services": "Services",
    "nav.process": "Process",
    "nav.reviews": "Reviews",
    "nav.contact": "Contact",
    "nav.enquiry": "Enquiry",

    // Hero
    "hero.badge": "Bridal Aari & Maggam Work Specialist",
    "hero.headline": "Exquisite Bridal Aari Blouse & Designer Embroidery",
    "hero.subheadline": "Crafted with love, precision, and timeless elegance by Mithanya. Designed for the unforgettable day of every Tamil bride.",
    "hero.cta_enquiry": "Book Your Bridal Blouse",
    "hero.cta_gallery": "View Recent Creations",
    "hero.badge_delivery": "On-Time Bridal Delivery",
    "hero.badge_custom": "100% Custom Tailored",

    // Section Titles
    "services.tag": "Our Expertise",
    "services.title": "Handcrafted Embroidery for Every Occasion",
    "gallery.tag": "Bridal Portfolio",
    "gallery.title": "Our Handcrafted Works",
    "process.tag": "The Journey",
    "process.title": "How We Craft Your Dream Blouse",

    // Form
    "form.title": "Enquire For Your Special Day",
    "form.subtitle": "Tell us your event date and design thoughts. We will guide you with sketches and pricing.",
    "form.name": "Your Name *",
    "form.mobile": "Mobile / WhatsApp *",
    "form.work": "Work Type *",
    "form.date": "Function Date",
    "form.budget": "Budget",
    "form.city": "City / Area",
    "form.message": "Design details / Reference",
    "form.submit": "Send my enquiry",
    "form.sending": "Sending...",
    "form.safe": "Your details are safe. We will contact you directly.",
  },
  ta: {
    // Navigation
    "nav.home": "முகப்பு",
    "nav.gallery": "படைப்புகள்",
    "nav.about": "எங்களை பற்றி",
    "nav.services": "சேவைகள்",
    "nav.process": "செயல்முறை",
    "nav.reviews": "கருத்துக்கள்",
    "nav.contact": "தொடர்பு",
    "nav.enquiry": "விசாரிக்க",

    // Hero
    "hero.badge": "பிரத்யேக மணப்பெண் ஆரி & மக்கம் வேலைப்பாடுகள்",
    "hero.headline": "நேர்த்தியான மணப்பெண் ஆரி பிளவுஸ் & கைவினை எம்பிராய்டரி",
    "hero.subheadline": "மிதன்யாவின் கைவண்ணத்தில், மணப்பெண்களின் கனவுகளை நினைவாக்கும் உன்னதமான ஆரி மற்றும் ஜர்தோசி கலை வடிவமைப்பு.",
    "hero.cta_enquiry": "உங்கள் பிளவுஸ் பதிவு செய்ய",
    "hero.cta_gallery": "படைப்புகளை பார்க்க",
    "hero.badge_delivery": "குறித்த நேரத்தில் டெலிவரி",
    "hero.badge_custom": "100% பிரத்யேக வடிவமைப்பு",

    // Section Titles
    "services.tag": "எங்கள் சேவைகள்",
    "services.title": "அனைத்து விசேஷங்களுக்குமான கைவினை வேலைப்பாடுகள்",
    "gallery.tag": "மணப்பெண் தொகுப்பு",
    "gallery.title": "எங்கள் சமீபத்திய ஆரி படைப்புகள்",
    "process.tag": "செயல்முறை",
    "process.title": "உங்கள் கனவு பிளவுஸ் எவ்வாறு உருவாகிறது?",

    // Form
    "form.title": "உங்கள் விசேஷத்திற்கான முன்பதிவு",
    "form.subtitle": "விசேஷ தேதி மற்றும் உங்கள் விருப்பங்களை தெரிவிக்கவும். வடிவமைப்புகளோடு உடனே தொடர்பு கொள்வோம்.",
    "form.name": "உங்கள் பெயர் *",
    "form.mobile": "கைபேசி / WhatsApp *",
    "form.work": "வேலை வகை *",
    "form.date": "விசேஷ தேதி",
    "form.budget": "பட்ஜெட் (Budget)",
    "form.city": "ஊர் / பகுதி",
    "form.message": "வடிவமைப்பு விவரங்கள்",
    "form.submit": "விசாரணையை அனுப்பவும்",
    "form.sending": "அனுப்பப்படுகிறது...",
    "form.safe": "உங்கள் விவரங்கள் பாதுகாப்பானது. நாங்கள் மட்டுமே தொடர்பு கொள்வோம்.",
  },
};

const I18nContext = createContext<I18nContextType>({
  locale: "en",
  setLocale: () => {},
  t: (k: string) => k,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = localStorage.getItem("aari_locale") as Locale;
    if (saved === "en" || saved === "ta") {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("aari_locale", l);
  };

  const t = (key: string): string => {
    return translations[locale]?.[key] || translations["en"]?.[key] || key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

