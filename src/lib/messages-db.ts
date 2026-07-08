import { prisma } from "@/lib/prisma";

export async function getAllContactMessages() {
  try {
    return await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export async function getUnreadContactCount() {
  try {
    return await prisma.contactMessage.count({ where: { read: false } });
  } catch {
    return 0;
  }
}

export async function markContactMessageRead(id: string, read: boolean) {
  return prisma.contactMessage.update({ where: { id }, data: { read } });
}

export async function deleteContactMessage(id: string) {
  return prisma.contactMessage.delete({ where: { id } });
}
