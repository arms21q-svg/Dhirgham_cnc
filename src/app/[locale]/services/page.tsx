import { getTranslations, setRequestLocale } from "next-intl/server";
import { getVisibleServices } from "@/data/services";
import { getActiveProjectCategories } from "@/lib/projects-db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createPageMetadata } from "@/lib/metadata";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return createPageMetadata({
    locale: locale as Locale,
    path: "/services",
    titleKey: "services.title",
    descriptionKey: "services.description",
  });
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const activeCategories = await getActiveProjectCategories();
  const visibleServices = getVisibleServices(activeCategories);

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-bold text-navy md:text-5xl dark:text-white">
            {t("services.title")}
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">{t("services.subtitle")}</p>
        </div>

        {visibleServices.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">{t("services.empty")}</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {visibleServices.map(({ id, icon: Icon, titleKey, descriptionKey }) => (
              <Card
                key={id}
                className="group border-border/50 transition-all hover:border-gold/30 hover:shadow-lg"
              >
                <CardHeader>
                  <div className="mb-3 flex size-14 items-center justify-center rounded-xl bg-navy/5 text-navy transition-colors group-hover:bg-gold/10 group-hover:text-gold dark:bg-white/5 dark:text-gold">
                    <Icon className="size-7" />
                  </div>
                  <CardTitle className="text-xl text-navy dark:text-white">
                    {t(titleKey)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed text-muted-foreground">
                    {t(descriptionKey)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
