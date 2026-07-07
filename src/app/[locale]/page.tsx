import { HeroSection } from "@/components/sections/hero-section";
import { AboutPreviewSection } from "@/components/sections/about-preview-section";
import { ServicesPreviewSection } from "@/components/sections/services-preview-section";
import { FeaturedWorksSection } from "@/components/sections/featured-works-section";
import { WhyChooseSection } from "@/components/sections/why-choose-section";
import { ContactCtaSection } from "@/components/sections/contact-cta-section";
import { setRequestLocale } from "next-intl/server";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      <AboutPreviewSection />
      <ServicesPreviewSection />
      <FeaturedWorksSection />
      <WhyChooseSection />
      <ContactCtaSection />
    </>
  );
}
