import { unstable_cache, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { projects as fallbackProjects } from "@/data/portfolio";

export type HomePageSettingsRecord = {
  subtitleAr: string;
  subtitleEn: string;
};

export type HeroSlideRecord = {
  id: string;
  titleAr: string;
  titleEn: string;
  captionAr: string;
  captionEn: string;
  imageUrl: string;
  order: number;
  active: boolean;
};

const defaultSettings: HomePageSettingsRecord = {
  subtitleAr: "نحوّل أفكارك إلى واقع بأحدث تقنيات CNC. تصاميم فاخرة للأبواب والديكورات والأثاث المخصص.",
  subtitleEn:
    "We transform your vision into reality with advanced CNC technology. Luxury designs for doors, decor, and custom furniture.",
};

async function fetchHomePageSettings(): Promise<HomePageSettingsRecord> {
  try {
    const row = await prisma.homePageSettings.findUnique({ where: { id: 1 } });
    if (!row) return defaultSettings;
    return { subtitleAr: row.subtitleAr, subtitleEn: row.subtitleEn };
  } catch {
    return defaultSettings;
  }
}

async function fetchActiveHeroSlides(): Promise<HeroSlideRecord[]> {
  try {
    const rows = await prisma.heroSlide.findMany({
      where: { active: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    return rows;
  } catch {
    return [];
  }
}

const getCachedHomePageSettings = unstable_cache(
  fetchHomePageSettings,
  ["homepage-settings"],
  { revalidate: 120, tags: ["homepage"] }
);

const getCachedActiveHeroSlides = unstable_cache(
  fetchActiveHeroSlides,
  ["hero-slides-active"],
  { revalidate: 120, tags: ["homepage"] }
);

export async function getHomePageSettings() {
  return getCachedHomePageSettings();
}

export async function getActiveHeroSlides() {
  return getCachedActiveHeroSlides();
}

export async function getAllHeroSlidesAdmin() {
  try {
    return await prisma.heroSlide.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
  } catch {
    return [];
  }
}

export async function updateHomePageSettings(data: HomePageSettingsRecord) {
  const result = await prisma.homePageSettings.upsert({
    where: { id: 1 },
    create: { id: 1, ...data },
    update: data,
  });
  revalidateTag("homepage", "max");
  return result;
}

export type HeroSlideInput = {
  titleAr: string;
  titleEn: string;
  captionAr: string;
  captionEn: string;
  imageUrl: string;
  order?: number;
  active?: boolean;
};

export async function createHeroSlide(data: HeroSlideInput) {
  const slide = await prisma.heroSlide.create({
    data: {
      titleAr: data.titleAr,
      titleEn: data.titleEn,
      captionAr: data.captionAr,
      captionEn: data.captionEn,
      imageUrl: data.imageUrl,
      order: data.order ?? 0,
      active: data.active ?? true,
    },
  });
  revalidateTag("homepage", "max");
  return slide;
}

export async function updateHeroSlide(id: string, data: Partial<HeroSlideInput>) {
  const slide = await prisma.heroSlide.update({ where: { id }, data });
  revalidateTag("homepage", "max");
  return slide;
}

export async function deleteHeroSlide(id: string) {
  await prisma.heroSlide.delete({ where: { id } });
  revalidateTag("homepage", "max");
}

export function getDefaultHeroSlidesFromPortfolio(): HeroSlideInput[] {
  return fallbackProjects
    .filter((p) => p.featured)
    .slice(0, 6)
    .map((p, index) => ({
      titleAr: p.titleAr,
      titleEn: p.titleEn,
      captionAr: "تصاميم خشبية فاخرة بتقنية CNC المتطورة",
      captionEn: "Luxury wood designs crafted with advanced CNC technology",
      imageUrl: p.image,
      order: index,
      active: true,
    }));
}
