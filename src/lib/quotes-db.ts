import { prisma } from "@/lib/prisma";

export type QuoteInput = {
  name: string;
  email: string;
  phone: string;
  material: string;
  width?: string;
  height?: string;
  thickness?: string;
  quantity?: number;
  description: string;
  locale?: string;
};

export async function createQuoteRequest(data: QuoteInput) {
  return prisma.quoteRequest.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      material: data.material,
      width: data.width ?? null,
      height: data.height ?? null,
      thickness: data.thickness ?? null,
      quantity: data.quantity ?? 1,
      description: data.description,
      locale: data.locale ?? "ar",
    },
  });
}

export async function getAllQuotes() {
  try {
    return await prisma.quoteRequest.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export async function getUnreadQuoteCount() {
  try {
    return await prisma.quoteRequest.count({ where: { read: false } });
  } catch {
    return 0;
  }
}

export async function updateQuote(
  id: string,
  data: Partial<{
    status: string;
    estimatedPrice: string;
    adminNotes: string;
    read: boolean;
  }>
) {
  return prisma.quoteRequest.update({ where: { id }, data });
}

export async function deleteQuote(id: string) {
  return prisma.quoteRequest.delete({ where: { id } });
}
