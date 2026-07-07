import { getTranslations, getLocale } from "next-intl/server";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { HeroImageSlider } from "@/components/sections/hero-image-slider";
import { getActiveHeroSlides, getHomePageSettings } from "@/lib/homepage-db";
import { getFeaturedProjects, getPublishedProjects } from "@/lib/projects-db";
import { projects as fallbackProjects } from "@/data/portfolio";

function buildFallbackSlides(locale: string, defaultCaption: string) {
  return fallbackProjects
    .filter((p) => p.featured)
    .slice(0, 6)
    .map((project) => ({
      id: project.id,
      imageUrl: project.image,
      title: locale === "ar" ? project.titleAr : project.titleEn,
      caption: defaultCaption,
    }));
}

function buildProjectSlides(
  locale: string,
  defaultCaption: string,
  featured: Awaited<ReturnType<typeof getFeaturedProjects>>,
  published: Awaited<ReturnType<typeof getPublishedProjects>>
) {
  const source =
    featured.length >= 2
      ? featured
      : published.length >= 2
        ? published
        : fallbackProjects.filter((p) => p.featured);

  return source.slice(0, 6).map((project) => ({
    id: project.id,
    imageUrl: "imageUrl" in project ? project.imageUrl : project.image,
    title: locale === "ar" ? project.titleAr : project.titleEn,
    caption: defaultCaption,
  }));
}

export async function HeroSection() {
  const t = await getTranslations("hero");
  const locale = await getLocale();
  const isRtl = locale === "ar";
  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  const [homeSettings, dbSlides, featured, published] = await Promise.all([
    getHomePageSettings(),
    getActiveHeroSlides(),
    getFeaturedProjects(),
    getPublishedProjects(),
  ]);

  const subtitle =
    locale === "ar"
      ? homeSettings.subtitleAr || t("subtitle")
      : homeSettings.subtitleEn || t("subtitle");

  const slides =
    dbSlides.length > 0
      ? dbSlides.map((slide) => ({
          id: slide.id,
          imageUrl: slide.imageUrl,
          title: locale === "ar" ? slide.titleAr : slide.titleEn,
          caption: locale === "ar" ? slide.captionAr : slide.captionEn,
        }))
      : buildProjectSlides(locale, t("imageCaption"), featured, published);

  const finalSlides =
    slides.length > 0 ? slides : buildFallbackSlides(locale, t("imageCaption"));

  return (
    <section className="relative overflow-hidden bg-navy-dark text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(45,90,138,0.35)_0%,transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,rgba(201,169,98,0.08)_0%,transparent_45%)]" />
        <div className="hero-grid absolute inset-0 opacity-[0.07]" />
        <div className="hero-glow absolute -top-32 start-1/4 size-[420px] rounded-full bg-navy-light/20 animate-hero-float" />
        <div className="hero-glow absolute -bottom-40 end-0 size-[360px] rounded-full bg-gold/10 animate-hero-float-delayed" />
      </div>

      <div className="container relative mx-auto px-4 py-24 md:py-32 lg:py-40">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div className="space-y-7 animate-fade-up">
            <Badge
              variant="outline"
              className="border-gold/40 bg-gold/10 px-4 py-1.5 text-gold"
            >
              {t("badge")}
            </Badge>

            <h1 className="text-4xl font-bold leading-[1.15] tracking-tight md:text-5xl lg:text-6xl">
              {t("title")}{" "}
              <span className="bg-gradient-to-l from-gold to-gold-light bg-clip-text text-transparent">
                {t("titleHighlight")}
              </span>
            </h1>

            <p className="max-w-xl text-lg leading-relaxed text-white/70">{subtitle}</p>

            <div className="flex flex-wrap gap-4">
              <ButtonLink
                href="/works"
                size="lg"
                className="bg-gold text-navy-dark shadow-lg shadow-gold/20 hover:bg-gold-light"
              >
                {t("cta")}
                <Arrow data-icon="inline-end" />
              </ButtonLink>
              <ButtonLink
                href="/contact"
                variant="outline"
                size="lg"
                className="border-white/25 bg-white/5 text-white hover:border-gold/50 hover:bg-gold/10 hover:text-gold"
              >
                {t("ctaSecondary")}
              </ButtonLink>
            </div>
          </div>

          <HeroImageSlider slides={finalSlides} badge={t("badge")} isRtl={isRtl} />
        </div>
      </div>
    </section>
  );
}
