import { getTranslations, getLocale } from "next-intl/server";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getVisibleServices } from "@/data/services";
import { getActiveProjectCategories } from "@/lib/projects-db";
import { ButtonLink } from "@/components/ui/button-link";

export async function ServicesPreviewSection() {
  const t = await getTranslations();
  const locale = await getLocale();
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;
  const activeCategories = await getActiveProjectCategories();
  const visibleServices = getVisibleServices(activeCategories);

  if (visibleServices.length === 0) return null;

  return (
    <section className="bg-muted/30 py-20 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold tracking-widest text-gold uppercase">
            CNC
          </p>
          <h2 className="text-3xl font-bold text-navy md:text-4xl dark:text-white">
            {t("services.title")}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            {t("services.subtitle")}
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleServices.map(({ id, icon: Icon, titleKey, descriptionKey }) => (
            <article
              key={id}
              className="group relative overflow-hidden rounded-2xl border border-border/50 bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-lg hover:shadow-gold/5"
            >
              <div className="absolute -end-6 -top-6 size-24 rounded-full bg-gold/5 transition-transform duration-500 group-hover:scale-150" />
              <div className="relative mb-5 flex size-14 items-center justify-center rounded-xl bg-navy text-gold transition-all duration-300 group-hover:scale-110 group-hover:bg-gold group-hover:text-navy-dark dark:bg-navy-light">
                <Icon className="size-7" />
              </div>
              <h3 className="relative mb-2 text-lg font-semibold text-navy dark:text-white">
                {t(titleKey)}
              </h3>
              <p className="relative text-sm leading-relaxed text-muted-foreground">
                {t(descriptionKey)}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <ButtonLink
            href="/services"
            size="lg"
            className="bg-navy text-white hover:bg-navy-light dark:bg-gold dark:text-navy-dark dark:hover:bg-gold-light"
          >
            {t("services.viewAll")}
            <Arrow data-icon="inline-end" />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
