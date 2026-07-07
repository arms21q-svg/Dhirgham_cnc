import { getTranslations, setRequestLocale } from "next-intl/server";
import { WorksGallery } from "@/components/sections/works-gallery";
import { getPublishedProjects, toPublicProject } from "@/lib/projects-db";
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
    path: "/works",
    titleKey: "works.title",
    descriptionKey: "works.description",
  });
}

export default async function WorksPage({  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("works");
  const dbProjects = await getPublishedProjects();
  const projects = dbProjects.map(toPublicProject);

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-navy md:text-5xl dark:text-white">
            {t("title")}
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>
        <WorksGallery projects={projects} />
      </div>
    </div>
  );
}
