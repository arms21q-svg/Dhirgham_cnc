import { unstable_cache } from "next/cache";
import { getPublishedProjects } from "@/lib/projects-db";
import { getPublishedFaqs } from "@/lib/faq-db";
import { getSiteSettings } from "@/lib/site-settings";
import { CNC_MATERIALS } from "@/lib/ai/knowledge/cnc-materials";
import type { KnowledgeDocument } from "@/lib/ai/knowledge/types";

const SERVICE_LABELS = {
  ar: {
    doors: "أبواب خشبية CNC",
    decor: "ديكورات حائط",
    furniture: "أثاث مخصص",
    panels: "ألواح منقوشة",
    signs: "لافتات وشعارات",
    custom: "تصاميم خاصة",
  },
  en: {
    doors: "CNC Wood Doors",
    decor: "Wall Decor",
    furniture: "Custom Furniture",
    panels: "Carved Panels",
    signs: "Signs & Logos",
    custom: "Custom Designs",
  },
} as const;

async function buildIndex(): Promise<KnowledgeDocument[]> {
  const [projects, faqs, site] = await Promise.all([
    getPublishedProjects(),
    getPublishedFaqs(),
    getSiteSettings(),
  ]);

  const docs: KnowledgeDocument[] = [];

  for (const p of projects) {
    docs.push({
      id: `project-${p.id}`,
      type: "project",
      title: p.titleAr,
      content: [p.titleAr, p.titleEn, p.descriptionAr, p.descriptionEn, p.category]
        .filter(Boolean)
        .join(" "),
      locale: "both",
      keywords: [p.category, "مشروع", "عمل", "project", "portfolio"],
    });
  }

  for (const f of faqs) {
    docs.push({
      id: `faq-${f.id}`,
      type: "faq",
      title: f.questionAr,
      content: `${f.questionAr} ${f.questionEn} ${f.answerAr} ${f.answerEn}`,
      locale: "both",
      keywords: ["سؤال", "faq", "question"],
    });
  }

  for (const [key, labelAr] of Object.entries(SERVICE_LABELS.ar)) {
    const labelEn = SERVICE_LABELS.en[key as keyof typeof SERVICE_LABELS.en];
    docs.push({
      id: `service-${key}`,
      type: "service",
      title: labelAr,
      content: `${labelAr} ${labelEn}`,
      locale: "both",
      keywords: [key, labelAr, labelEn, "خدمة", "service"],
    });
  }

  docs.push({
    id: "site-contact",
    type: "site",
    title: "معلومات التواصل",
    content: `هاتف: ${site.phoneDisplay} واتساب: ${site.whatsapp} بريد: ${site.email} عنوان: ${site.addressAr} ${site.addressEn}`,
    locale: "both",
    keywords: ["تواصل", "هاتف", "واتساب", "contact", "phone", "whatsapp"],
  });

  for (const m of CNC_MATERIALS) {
    docs.push({
      id: `material-${m.id}`,
      type: "material",
      title: m.nameAr,
      content: `${m.nameAr} ${m.nameEn} ${m.bestForAr} ${m.bestForEn} ${m.thicknessAr} ${m.thicknessEn}`,
      locale: "both",
      keywords: [m.id, m.nameAr, m.nameEn, "مادة", "material", "خشب", "mdf", "pvc"],
    });
  }

  return docs;
}

export const getKnowledgeIndex = unstable_cache(buildIndex, ["ai-knowledge-index"], {
  revalidate: 180,
  tags: ["projects", "faq", "site-settings"],
});
