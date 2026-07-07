"use client";

import { useLocale, useTranslations } from "next-intl";
import { RemoteImage } from "@/components/shared/remote-image";
import { ButtonLink } from "@/components/ui/button-link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ProjectCategory } from "@/data/portfolio";

export type GalleryProject = {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string | null;
  descriptionEn: string | null;
  category: ProjectCategory;
  image: string;
};

type WorkDetailDialogProps = {
  project: GalleryProject | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function WorkDetailDialog({ project, open, onOpenChange }: WorkDetailDialogProps) {
  const t = useTranslations("works");
  const locale = useLocale();

  if (!project) return null;

  const title = locale === "ar" ? project.titleAr : project.titleEn;
  const description =
    locale === "ar" ? project.descriptionAr : project.descriptionEn;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">
          {t(`categories.${project.category}`)}
        </DialogDescription>
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-navy-dark">
          <RemoteImage
            src={project.image}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
        <div className="space-y-3 p-6">
          <span className="inline-block rounded-full bg-gold/15 px-3 py-1 text-xs font-medium text-gold">
            {t(`categories.${project.category}`)}
          </span>
          <h3 className="text-xl font-bold text-navy dark:text-white">{title}</h3>
          {description ? (
            <p className="leading-relaxed text-muted-foreground">{description}</p>
          ) : (
            <p className="text-sm text-muted-foreground">{t("noDescription")}</p>
          )}
          <ButtonLink
            href="/contact"
            className="bg-navy text-white hover:bg-navy-light dark:bg-gold dark:text-navy-dark"
          >
            {t("requestSimilar")}
          </ButtonLink>
        </div>
      </DialogContent>
    </Dialog>
  );
}
