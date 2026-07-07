"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Expand, ArrowLeft, ArrowRight } from "lucide-react";
import { RemoteImage } from "@/components/shared/remote-image";
import { ButtonLink } from "@/components/ui/button-link";
import {
  WorkDetailDialog,
  type GalleryProject,
} from "@/components/sections/work-detail-dialog";

export function FeaturedWorksGallery({ projects }: { projects: GalleryProject[] }) {
  const t = useTranslations("featured");
  const tWorks = useTranslations("works");
  const locale = useLocale();
  const [selected, setSelected] = useState<GalleryProject | null>(null);
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const title = locale === "ar" ? project.titleAr : project.titleEn;
          const description =
            locale === "ar" ? project.descriptionAr : project.descriptionEn;

          return (
            <button
              key={project.id}
              type="button"
              onClick={() => setSelected(project)}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-navy-dark/50 text-start transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-xl hover:shadow-gold/10"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <RemoteImage
                  src={project.image}
                  alt={title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy-dark/20 to-transparent opacity-80" />
                <div className="absolute inset-0 flex items-center justify-center bg-navy-dark/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="flex items-center gap-2 rounded-full bg-gold/90 px-4 py-2 text-sm font-medium text-navy-dark">
                    <Expand className="size-4" />
                    {t("viewDetails")}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <span className="mb-1 inline-block rounded-full bg-gold/15 px-2.5 py-0.5 text-xs font-medium text-gold">
                  {tWorks(`categories.${project.category}`)}
                </span>
                <h3 className="font-semibold text-white">{title}</h3>
                {description && (
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/60">
                    {description}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <WorkDetailDialog
        project={selected}
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
      />

      <div className="mt-12 text-center">
        <ButtonLink
          href="/works"
          size="lg"
          variant="outline"
          className="border-gold/40 text-gold hover:bg-gold/10 hover:text-gold"
        >
          {t("viewAll")}
          <Arrow data-icon="inline-end" />
        </ButtonLink>
      </div>
    </>
  );
}
