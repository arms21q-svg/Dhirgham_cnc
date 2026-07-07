export const siteConfig = {
  name: "ضرغام CNC",
  nameEn: "Dargham CNC",
  description: {
    ar: "تصاميم ونحت CNC على الخشب بدقة وشغل نظيف",
    en: "Precision CNC wood designs and craftsmanship of the highest quality",
  },
  phone: "+9647701234567",
  phoneDisplay: "0770 123 4567",
  whatsapp: "9647701234567",
  email: "info@darghamcnc.com",
  address: {
    ar: "بغداد، العراق",
    en: "Baghdad, Iraq",
  },
  locationUrl: "https://maps.google.com/?q=Baghdad+Iraq",
  social: {
    instagram: "https://instagram.com/darghamcnc",
    twitter: "https://twitter.com/darghamcnc",
    facebook: "https://facebook.com/darghamcnc",
    snapchat: "https://snapchat.com/add/darghamcnc",
  },
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://darghamcnc.com",
} as const;

export type SiteConfig = typeof siteConfig;
