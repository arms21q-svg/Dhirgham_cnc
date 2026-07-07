import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminsManager } from "@/components/admin/admins-manager";

export default async function AdminAdminsPage() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  if (admin.role !== "super_admin") {
    redirect("/admin");
  }

  const admins = await prisma.admin.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return <AdminsManager initialAdmins={admins} />;
}
