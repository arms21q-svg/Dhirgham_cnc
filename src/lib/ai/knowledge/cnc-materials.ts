export type MaterialGuide = {
  id: string;
  nameAr: string;
  nameEn: string;
  bestForAr: string;
  bestForEn: string;
  thicknessAr: string;
  thicknessEn: string;
  notesAr: string;
  notesEn: string;
};

export const CNC_MATERIALS: MaterialGuide[] = [
  {
    id: "wood",
    nameAr: "الخشب الطبيعي",
    nameEn: "Natural Wood",
    bestForAr: "أبواب، ديكورات فاخرة، أثاث، نقوش بارزة",
    bestForEn: "Doors, luxury decor, furniture, raised carvings",
    thicknessAr: "12–40 مم حسب التطبيق؛ الأبواب 35–40 مم",
    thicknessEn: "12–40 mm by application; doors 35–40 mm",
    notesAr: "ممتاز للنقش والحفر العميق؛ يحتاج تشطيب وحماية من الرطوبة",
    notesEn: "Excellent for carving; needs finishing and moisture protection",
  },
  {
    id: "mdf",
    nameAr: "MDF",
    nameEn: "MDF",
    bestForAr: "ديكورات حائط، ألواح منقوشة، أثاث داخلي",
    bestForEn: "Wall decor, carved panels, indoor furniture",
    thicknessAr: "6–25 مم؛ التفاصيل الدقيقة 12–18 مم",
    thicknessEn: "6–25 mm; fine details 12–18 mm",
    notesAr: "سطح أملس واقتصادي؛ غير مناسب للرطوبة أو الاستخدام الخارجي",
    notesEn: "Smooth economical surface; not for wet or outdoor use",
  },
  {
    id: "pvc",
    nameAr: "PVC / فوم",
    nameEn: "PVC / Foam Board",
    bestForAr: "لافتات، ديكور خفيف، حروف بارزة",
    bestForEn: "Signs, lightweight decor, 3D letters",
    thicknessAr: "3–20 مم",
    thicknessEn: "3–20 mm",
    notesAr: "خفيف ومقاوم للرطوبة؛ مناسب للوحات واجهات المحلات",
    notesEn: "Lightweight and moisture-resistant; good for shop facades",
  },
  {
    id: "acrylic",
    nameAr: "الأكريليك",
    nameEn: "Acrylic",
    bestForAr: "لافتات مضيئة، حروف ثلاثية الأبعاد، واجهات عصرية",
    bestForEn: "Backlit signs, 3D letters, modern facades",
    thicknessAr: "3–15 مم",
    thicknessEn: "3–15 mm",
    notesAr: "شفافية عالية؛ يُدمج مع إضاءة LED",
    notesEn: "High clarity; pairs well with LED lighting",
  },
  {
    id: "aluminum",
    nameAr: "الألمنيوم",
    nameEn: "Aluminum",
    bestForAr: "واجهات خارجية، لافتات صناعية، قطع دقيقة",
    bestForEn: "Outdoor facades, industrial signs, precision parts",
    thicknessAr: "1–6 مم للحفر؛ أكثر للهياكل",
    thicknessEn: "1–6 mm for engraving; thicker for structures",
    notesAr: "متين للخارج؛ يحتاج أدوات قطع مناسبة",
    notesEn: "Durable outdoors; requires proper cutting tools",
  },
];

export function formatMaterialsContext(locale: string): string {
  const ar = locale === "ar";
  return CNC_MATERIALS.map((m) =>
    ar
      ? `- ${m.nameAr}: ${m.bestForAr}. السماكة: ${m.thicknessAr}. ${m.notesAr}`
      : `- ${m.nameEn}: ${m.bestForEn}. Thickness: ${m.thicknessEn}. ${m.notesEn}`
  ).join("\n");
}
