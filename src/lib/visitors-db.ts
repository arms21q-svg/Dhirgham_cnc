import { prisma } from "@/lib/prisma";

export async function getVisitorCount(): Promise<number> {
  try {
    const stats = await prisma.siteStats.findUnique({ where: { id: 1 } });
    return stats?.visitorCount ?? 0;
  } catch {
    return 0;
  }
}

export async function recordVisitor(): Promise<number> {
  try {
    const stats = await prisma.siteStats.upsert({
      where: { id: 1 },
      create: { id: 1, visitorCount: 1 },
      update: { visitorCount: { increment: 1 } },
    });
    return stats.visitorCount;
  } catch {
    return 0;
  }
}
