import { getTranslations, setRequestLocale } from "next-intl/server";
import { Award, Target, Lightbulb } from "lucide-react";
import Image from "next/image";
import { createPageMetadata } from "@/lib/metadata";
import type { Locale } from "@/i18n/routing";

const values = [
  { icon: Award, title: "values.quality", desc: "values.qualityDesc" },
  { icon: Target, title: "values.precision", desc: "values.precisionDesc" },
  { icon: Lightbulb, title: "values.creativity", desc: "values.creativityDesc" },
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return createPageMetadata({
    locale: locale as Locale,
    path: "/about",
    titleKey: "about.title",
    descriptionKey: "about.description",
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-bold text-navy md:text-5xl dark:text-white">
            {t("title")}
          </h1>
          <p className="mt-3 text-lg text-gold">{t("subtitle")}</p>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"
              alt="CNC workshop"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="space-y-6">
            <p className="text-lg leading-relaxed text-muted-foreground">
              {t("description")}
            </p>
            <div className="space-y-4">
              <div className="rounded-xl border border-border/50 p-6">
                <h3 className="mb-2 font-semibold text-gold">{t("mission")}</h3>
                <p className="text-muted-foreground">{t("missionText")}</p>
              </div>
              <div className="rounded-xl border border-border/50 p-6">
                <h3 className="mb-2 font-semibold text-gold">{t("vision")}</h3>
                <p className="text-muted-foreground">{t("visionText")}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-3">
          {values.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl border border-border/50 p-8 text-center transition-all hover:border-gold/30 hover:shadow-md"
            >
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-gold/10 text-gold">
                <Icon className="size-8" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-navy dark:text-white">
                {t(title)}
              </h3>
              <p className="leading-relaxed text-muted-foreground">{t(desc)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
