"use client";

import { useMemo, useState } from "react";
import { Expand } from "lucide-react";
import { RemoteImage } from "@/components/shared/remote-image";
import { useTranslations, useLocale } from "next-intl";
import type { ProjectCategory } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import {
  WorkDetailDialog,
  type GalleryProject,
} from "@/components/sections/work-detail-dialog";

const allCategories: ProjectCategory[] = ["doors", "decor", "furniture", "panels", "signs"];

export function WorksGallery({ projects }: { projects: GalleryProject[] }) {
  const t = useTranslations("works");
  const locale = useLocale();
  const [selected, setSelected] = useState<GalleryProject | null>(null);

  const availableFilters = useMemo(() => {
    const withProjects = new Set(projects.map((p) => p.category));
    const cats = allCategories.filter((cat) => withProjects.has(cat));
    return ["all" as const, ...cats];
  }, [projects]);

  const [active, setActive] = useState<ProjectCategory | "all">("all");

  const safeActive =
    active === "all" || availableFilters.includes(active) ? active : "all";

  const filtered =
    safeActive === "all" ? projects : projects.filter((p) => p.category === safeActive);

  if (projects.length === 0) {
    return (
      <p className="py-16 text-center text-muted-foreground">{t("emptyCategory")}</p>
    );
  }

  return (
    <div>
      {availableFilters.length > 1 && (
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {availableFilters.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-all",
                safeActive === cat
                  ? "bg-navy text-white dark:bg-gold dark:text-navy-dark"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {cat === "all" ? t("filterAll") : t(`categories.${cat}`)}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project) => {
          const title = locale === "ar" ? project.titleAr : project.titleEn;
          const description =
            locale === "ar" ? project.descriptionAr : project.descriptionEn;

          return (
            <button
              key={project.id}
              type="button"
              onClick={() => setSelected(project)}
              className="group overflow-hidden rounded-xl border border-border/50 text-start transition-all hover:border-gold/30 hover:shadow-lg"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <RemoteImage
                  src={project.image}
                  alt={title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-navy/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="flex items-center gap-2 rounded-full bg-gold/90 px-4 py-2 text-sm font-medium text-navy-dark">
                    <Expand className="size-4" />
                    {t("viewDetails")}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <span className="mb-1 inline-block rounded-full bg-gold/10 px-2 py-0.5 text-xs font-medium text-gold">
                  {t(`categories.${project.category}`)}
                </span>
                <h3 className="font-semibold text-navy dark:text-white">{title}</h3>
                {description && (
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
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
    </div>
  );
}
