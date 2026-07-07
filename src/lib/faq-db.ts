import { unstable_cache, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { defaultFaqItems } from "@/data/faq-defaults";

export type FaqInput = {
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
  order?: number;
  published?: boolean;
};

function getFallbackFaqs() {
  return defaultFaqItems.map((item, index) => ({
    id: `fallback-faq-${index}`,
    questionAr: item.questionAr,
    questionEn: item.questionEn,
    answerAr: item.answerAr,
    answerEn: item.answerEn,
    order: item.order,
    published: true,
    createdAt: new Date(0),
    updatedAt: new Date(0),
  }));
}

async function fetchPublishedFaqs() {
  try {
    return await prisma.faq.findMany({
      where: { published: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
  } catch {
    return getFallbackFaqs();
  }
}

const getCachedPublishedFaqs = unstable_cache(
  fetchPublishedFaqs,
  ["published-faqs"],
  { revalidate: 120, tags: ["faq"] }
);

export async function getPublishedFaqs() {
  return getCachedPublishedFaqs();
}

export async function getAllFaqsAdmin() {
  return prisma.faq.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}

export async function getFaqById(id: string) {
  return prisma.faq.findUnique({ where: { id } });
}

function revalidateFaqCache() {
  revalidateTag("faq", "max");
}

export async function createFaq(data: FaqInput) {
  const faq = await prisma.faq.create({
    data: {
      questionAr: data.questionAr,
      questionEn: data.questionEn,
      answerAr: data.answerAr,
      answerEn: data.answerEn,
      order: data.order ?? 0,
      published: data.published ?? true,
    },
  });
  revalidateFaqCache();
  return faq;
}

export async function updateFaq(id: string, data: Partial<FaqInput>) {
  const faq = await prisma.faq.update({
    where: { id },
    data: {
      ...(data.questionAr !== undefined && { questionAr: data.questionAr }),
      ...(data.questionEn !== undefined && { questionEn: data.questionEn }),
      ...(data.answerAr !== undefined && { answerAr: data.answerAr }),
      ...(data.answerEn !== undefined && { answerEn: data.answerEn }),
      ...(data.order !== undefined && { order: data.order }),
      ...(data.published !== undefined && { published: data.published }),
    },
  });
  revalidateFaqCache();
  return faq;
}

export async function deleteFaq(id: string) {
  const faq = await prisma.faq.delete({ where: { id } });
  revalidateFaqCache();
  return faq;
}
