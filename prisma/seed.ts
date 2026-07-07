import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import { siteConfig } from "../src/config/site";
import { projects } from "../src/data/portfolio";
import { defaultFaqItems } from "../src/data/faq-defaults";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@darghamcnc.com";
  const password = process.env.ADMIN_PASSWORD ?? "Admin@123456";
  const name = process.env.ADMIN_NAME ?? "مدير النظام";

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.admin.upsert({
    where: { email },
    update: {},
    create: {
      name,
      email,
      passwordHash,
      role: "super_admin",
    },
  });

  const siteSettingsData = {
    phone: siteConfig.phone,
    phoneDisplay: siteConfig.phoneDisplay,
    whatsapp: siteConfig.whatsapp,
    email: siteConfig.email,
    addressAr: siteConfig.address.ar,
    addressEn: siteConfig.address.en,
    locationUrl: siteConfig.locationUrl,
    instagramUrl: siteConfig.social.instagram,
    twitterUrl: siteConfig.social.twitter,
    facebookUrl: siteConfig.social.facebook,
    snapchatUrl: siteConfig.social.snapchat,
  };

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: siteSettingsData,
    create: { id: 1, ...siteSettingsData },
  });

  await prisma.aiSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, enabled: false, model: "gemini-2.5-flash" },
  });

  await prisma.siteStats.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, visitorCount: 0 },
  });

  await prisma.homePageSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      subtitleAr:
        "نحوّل أفكارك إلى واقع بأحدث تقنيات CNC. تصاميم فاخرة للأبواب والديكورات والأثاث المخصص.",
      subtitleEn:
        "We transform your vision into reality with advanced CNC technology. Luxury designs for doors, decor, and custom furniture.",
    },
  });

  const heroSlideCount = await prisma.heroSlide.count();
  if (heroSlideCount === 0) {
    await prisma.heroSlide.createMany({
      data: projects
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
        })),
    });
  }

  const existingCount = await prisma.project.count();
  if (existingCount === 0) {
    await prisma.project.createMany({
      data: projects.map((p, index) => ({
        titleAr: p.titleAr,
        titleEn: p.titleEn,
        category: p.category,
        imageUrl: p.image,
        featured: p.featured,
        published: true,
        order: index,
      })),
    });
  }

  const faqCount = await prisma.faq.count();
  if (faqCount === 0) {
    await prisma.faq.createMany({
      data: defaultFaqItems.map((item) => ({
        ...item,
        published: true,
      })),
    });
  }

  console.log("Seed completed.");
  console.log(`Admin: ${email}`);
  console.log(`Password: ${password}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
