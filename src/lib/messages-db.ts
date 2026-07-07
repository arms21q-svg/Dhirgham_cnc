import { prisma } from "@/lib/prisma";

export async function getAllContactMessages() {
  return prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getUnreadContactCount() {
  return prisma.contactMessage.count({ where: { read: false } });
}

export async function markContactMessageRead(id: string, read: boolean) {
  return prisma.contactMessage.update({ where: { id }, data: { read } });
}

export async function deleteContactMessage(id: string) {
  return prisma.contactMessage.delete({ where: { id } });
}
