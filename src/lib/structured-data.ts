import type { PublicSiteSettings } from "@/lib/site-settings";

export function buildLocalBusinessJsonLd(
  settings: PublicSiteSettings,
  locale: string
) {
  const address = locale === "ar" ? settings.addressAr : settings.addressEn;

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "ضرغام CNC",
    alternateName: "Dargham CNC",
    description:
      locale === "ar"
        ? "استوديو متخصص في تصاميم ونحت CNC على الخشب والمواد المتعددة"
        : "Studio specializing in CNC wood and multi-material carving and design",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://darghamcnc.com",
    telephone: settings.phone,
    email: settings.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: address,
      addressCountry: "IQ",
    },
    sameAs: [
      settings.social.instagram,
      settings.social.facebook,
      settings.social.twitter,
      settings.social.snapchat,
    ].filter(Boolean),
    priceRange: "$$",
    areaServed: "IQ",
  };
}
